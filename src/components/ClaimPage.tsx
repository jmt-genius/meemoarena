import { Container, Heading, Text, Flex, Box, Button, RadioGroup } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useWallet } from '@suiet/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui/client';
import { ConnectButton, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { TESTNET_COUNTER_PACKAGE_ID } from '../constants';

const COLLECTION_ID = "0xf7ba633e0120ffe942abc456f3e3642e5b27d39b691778b0774aed6ec493b163";
const suiClient = new SuiClient({ url: 'https://fullnode.devnet.sui.io' });

function ClaimPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [selectedWinners, setSelectedWinners] = useState<{ [pollId: string]: number | null }>({});
  const [loading, setLoading] = useState(true);
  const wallet = useWallet();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const [claimStatus, setClaimStatus] = useState<{ [pollId: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<{ [pollId: string]: string | null }>({});
  const [tableId, setTableId] = useState<string | null>(null);

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const { data: collectionData } = await suiClient.getObject({
        id: COLLECTION_ID,
        options: { showContent: true }
      });
      const tableObj = (collectionData?.content as any)?.fields?.polls;
      const tableId = tableObj?.fields?.id?.id || tableObj?.fields?.id;
      const nextPollId = Number((collectionData?.content as any)?.fields?.next_poll_id);

      if (!tableId) return;

      const pollsFetched: any[] = [];
      for (let i = 0; i < nextPollId; i++) {
        const { data: pollData } = await suiClient.getDynamicFieldObject({
          parentId: tableId,
          name: { type: 'u64', value: i.toString() }
        });
        if (pollData?.content?.dataType === "moveObject" && pollData.content.fields) {
          pollsFetched.push(pollData.content.fields);
        }
      }
      setPolls(pollsFetched);
      setTableId(tableId);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (pollId: string) => {
    const winnerIdx = selectedWinners[pollId];
    try {
      setClaimStatus(prev => ({ ...prev, [pollId]: 'waiting' }));
      setErrorMessage(prev => ({ ...prev, [pollId]: null }));

      if (!tableId) throw new Error('Table ID is not set');
      const response = await suiClient.getDynamicFieldObject({
        parentId: tableId,
        name: { type: 'u64', value: pollId }
      });

      if (!response.data?.content || response.data.content.dataType !== 'moveObject') {
        throw new Error('Failed to get poll details');
      }

      const fields = (response.data.content as any).fields;
      if (fields.claimed) {
        throw new Error('Poll has already been claimed');
      }
      // Optionally, check if poll is ended, or other business logic

      // Build the claim transaction
      const tx = new TransactionBlock();
      tx.setGasBudget(100000000);
      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::MemeVirality::claim`,
        arguments: [
          tx.object(COLLECTION_ID),
          tx.pure.u64(Number(pollId)),
          tx.pure.u64(Number(winnerIdx)),
        ],
      });

      signAndExecute({
        transaction: tx.serialize(),
      }, {
        onSuccess: async (response) => {
          try {
            const txResponse = await suiClient.waitForTransaction({
              digest: response.digest,
              options: {
                showEffects: true,
                showEvents: true,
                showBalanceChanges: true,
                showObjectChanges: true,
              },
            });

            if (txResponse.effects?.status.status === 'success') {
              setClaimStatus(prev => ({ ...prev, [pollId]: 'success' }));

              // Show detailed transaction information
              const gasUsed = txResponse.effects.gasUsed || { computationCost: 0, storageCost: 0, storageRebate: 0 };
              const totalGas = (BigInt(gasUsed.computationCost) + BigInt(gasUsed.storageCost) - BigInt(gasUsed.storageRebate)) / BigInt(1_000_000_000);

              // Log balance changes
              const balanceChanges = (txResponse.effects as any).balanceChanges || [];
              // You may want to show the balance change for the poll owner or winner
              // const winnings = ...;

              // Optionally, show a toast or message
              // toast.success(`Claimed successfully! Gas used: ${totalGas.toString()} SUI`);

              // Log the transaction details to console for debugging
              console.log('Transaction details:', {
                digest: response.digest,
                effects: txResponse.effects,
                balanceChanges,
                gasUsed: totalGas,
              });

              await fetchPolls();
            } else {
              throw new Error(`Transaction failed: ${txResponse.effects?.status.error || 'Unknown error'}`);
            }
          } catch (error) {
            setErrorMessage(prev => ({ ...prev, [pollId]: error instanceof Error ? error.message : 'Unknown error occurred' }));
            setClaimStatus(prev => ({ ...prev, [pollId]: 'error' }));
          }
        },
        onError: (error) => {
          setErrorMessage(prev => ({ ...prev, [pollId]: error instanceof Error ? error.message : 'Failed to claim' }));
          setClaimStatus(prev => ({ ...prev, [pollId]: 'error' }));
        },
      });
    } catch (error) {
      setErrorMessage(prev => ({ ...prev, [pollId]: error instanceof Error ? error.message : 'Failed to claim' }));
      setClaimStatus(prev => ({ ...prev, [pollId]: 'error' }));
    }
  };

  if (loading) {
    return (
      <Container>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container size="3">
      <Box mb="6">
        <Heading size="8" mb="2">Claim Rewards</Heading>
      </Box>
      <Box mb="4">
        <ConnectButton />
      </Box>
      {polls.length === 0 ? (
        <Text>No polls found.</Text>
      ) : (
        <form onSubmit={e => { e.preventDefault(); }}>
          {polls.map((poll, idx) => {
            const pollId = poll.value.fields.poll_id;
            const questionBytes = poll.value.fields.question;
            const question = Array.isArray(questionBytes)
              ? new TextDecoder().decode(Uint8Array.from(questionBytes))
              : '';
            const options = poll.value.fields.options || [];
            const totalStake = options.reduce(
              (sum: number, opt: any) => sum + Number(opt.fields.total_stake || 0),
              0
            );
            return (
              <Box key={poll.id?.id || idx} mb="6" style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
                <Heading size="5">{question}</Heading>
                <Text>Total Stake: {totalStake / 1_000_000_000} SUI</Text>
                <Box mt="2" mb="2">
                  <Flex direction="row" gap="4" wrap="wrap">
                    {Array.isArray(options) && options.map((option: any, oidx: number) => {
                      const optionName = Array.isArray(option.fields?.name)
                        ? new TextDecoder().decode(Uint8Array.from(option.fields.name))
                        : '';
                      return (
                        <Box key={oidx} style={{ minWidth: 200 }}>
                          <Text>
                            <b>{optionName}</b> — Stake: {Number(option.fields.total_stake) / 1_000_000_000} SUI
                          </Text>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
                <RadioGroup.Root
                  value={
                    selectedWinners[pollId] !== undefined && selectedWinners[pollId] !== null
                      ? String(selectedWinners[pollId])
                      : ''
                  }
                  onValueChange={val => {
                    setSelectedWinners(prev => ({ ...prev, [pollId]: Number(val) }));
                  }}
                >
                  <Flex direction="row" gap="4" wrap="wrap">
                    {Array.isArray(options) && options.map((option: any, oidx: number) => {
                      const optionName = Array.isArray(option.fields?.name)
                        ? new TextDecoder().decode(Uint8Array.from(option.fields.name))
                        : '';
                      return (
                        <Box key={oidx} asChild style={{ minWidth: 200 }}>
                          <label style={{ display: 'block', margin: '8px 0' }}>
                            <RadioGroup.Item value={String(oidx)} /> {optionName}
                          </label>
                        </Box>
                      );
                    })}
                  </Flex>
                </RadioGroup.Root>
                <Button
                  type="button"
                  size="3"
                  variant="solid"
                  disabled={
                    selectedWinners[pollId] === undefined ||
                    selectedWinners[pollId] === null ||
                    poll.claimed
                  }
                  onClick={() => handleClaim(pollId)}
                  mt="2"
                >
                  {poll.claimed ? 'Already Claimed' : (claimStatus[pollId] === 'waiting' ? 'Claiming...' : 'Claim')}
                </Button>
                {poll.claimed && (
                  <Text color="gray" size="2" ml="2">This poll has already been claimed.</Text>
                )}
                {errorMessage[pollId] && (
                  <Text color="red" size="2" ml="2">{errorMessage[pollId]}</Text>
                )}
                <Box mt="2">
                  <Text size="2" color="gray">
                    Calculation: Total Stake = sum of all option stakes. Winner is the option you select above.
                  </Text>
                </Box>
              </Box>
            );
          })}
        </form>
      )}
    </Container>
  );
}

export default ClaimPage;

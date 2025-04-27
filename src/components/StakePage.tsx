import { Container, Heading, Card, Text, Flex, Box, Button, RadioGroup, TextField } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { type SuiTransactionBlockResponse } from '@mysten/sui/client';
import { ConnectButton, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { TESTNET_COUNTER_PACKAGE_ID } from '../constants';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { configDotenv } from "dotenv";

const COLLECTION_ID = "0xf7ba633e0120ffe942abc456f3e3642e5b27d39b691778b0774aed6ec493b163"; // Replace with your PollCollection object ID
const suiClient = new SuiClient({ url: 'https://fullnode.devnet.sui.io' }); // or your preferred network

function StakePage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [selectedOptions, setSelectedOptions] = useState<{ [pollId: string]: number | null }>({});
  const [stakeAmounts, setStakeAmounts] = useState<{ [pollId: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const wallet = useWallet();
  const { mutate: signAndExecute, isSuccess, isPending } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const [stakeStatus, setStakeStatus] = useState<{ [pollId: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<{ [pollId: string]: string | null }>({});

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

      console.log("tableId", tableId, "nextPollId", nextPollId);
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
      console.log('Fetched polls:', pollsFetched);
    } catch (error) {
      console.error('Error fetching polls:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStake = async (pollId: string) => {
    console.log("Handling stake");
    const selectedOption = selectedOptions[pollId];
    const stakeAmount = stakeAmounts[pollId];
    try {
      setStakeStatus(prev => ({ ...prev, [pollId]: 'waiting' }));
      setErrorMessage(prev => ({ ...prev, [pollId]: null }));
      // Convert SUI to MIST
      const stakeAmountInMist = BigInt(Math.floor(parseFloat(stakeAmount) * 1_000_000_000));
      const tx = new TransactionBlock();
      tx.setGasBudget(100000000);
      // Split the coin for the stake amount
      console.log(COLLECTION_ID);
      const [coin] = tx.splitCoins(tx.gas, [tx.pure(stakeAmountInMist)]);
      tx.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::MemeVirality::stake`,
        arguments: [
          tx.object(COLLECTION_ID),
          tx.pure.u64(Number(pollId)),
          tx.pure.u64(Number(selectedOption)),
          coin,
        ],
      });
      signAndExecute(
        {
          transaction: tx.serialize(),
        },
        {
          onSuccess: async ({ digest }) => {
            await suiClient.waitForTransaction({
              digest: digest,
              options: { showEffects: true },
            });
            setStakeStatus(prev => ({ ...prev, [pollId]: 'success' }));
            await fetchPolls();
          },
          onError: (error) => {
            setErrorMessage(prev => ({ ...prev, [pollId]: error instanceof Error ? error.message : 'Failed to stake' }));
            setStakeStatus(prev => ({ ...prev, [pollId]: 'error' }));
          },
        },
      );
    } catch (error) {
      setErrorMessage(prev => ({ ...prev, [pollId]: error instanceof Error ? error.message : 'Failed to stake' }));
      setStakeStatus(prev => ({ ...prev, [pollId]: 'error' }));
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
        <Heading size="8" mb="2">Active Polls</Heading>
      </Box>
      <Box mb="4">
        <ConnectButton />
      </Box>
      {polls.length === 0 ? (
        <Text>No active polls found.</Text>
      ) : (
        <form onSubmit={e => { e.preventDefault(); }}>
          {polls.map((poll, idx) => {
            const pollId = poll.value.fields.poll_id;
            const questionBytes = poll.value.fields.question;
            const question = Array.isArray(questionBytes)
              ? new TextDecoder().decode(Uint8Array.from(questionBytes))
              : '';
            const options = poll.value.fields.options || [];
            return (
              <Box key={poll.id?.id || idx} mb="6" style={{ border: '1px solid #eee', borderRadius: 8, padding: 16 }}>
                <Heading size="5">{question}</Heading>
                <RadioGroup.Root
                  value={
                    selectedOptions[pollId] !== undefined && selectedOptions[pollId] !== null
                      ? String(selectedOptions[pollId])
                      : ''
                  }
                  onValueChange={val => {
                    setSelectedOptions(prev => ({ ...prev, [pollId]: Number(val) }));
                  }}
                >
                  <Flex direction="row" gap="4" wrap="wrap">
                    {Array.isArray(options) && options.map((option: any, idx: number) => {
                      const optionName = Array.isArray(option.fields?.name)
                        ? new TextDecoder().decode(Uint8Array.from(option.fields.name))
                        : '';
                      const cid = Array.isArray(option.fields?.content_id)
                        ? new TextDecoder().decode(Uint8Array.from(option.fields.content_id))
                        : '';
                      const imageUrl = cid ? `https://chocolate-worldwide-earwig-657.mypinata.cloud/ipfs/${cid}` : '';
                      return (
                        <Box key={idx} asChild style={{ minWidth: 200 }}>
                          <label style={{ display: 'block', margin: '8px 0' }}>
                            {cid && (
                              <img
                                src={imageUrl}
                                alt={optionName}
                                style={{ width: '100%', maxWidth: 200, borderRadius: 8, marginBottom: 8 }}
                              />
                            )}
                            <RadioGroup.Item value={String(idx)} /> {optionName} (Current Stake: {option.fields.total_stake/1000000000} SUI)
                          </label>
                        </Box>
                      );
                    })}
                  </Flex>
                </RadioGroup.Root>
                <Flex direction="row" align="center" gap="2" mt="3">
                  <input
                    type="number"
                    placeholder="Amount to stake (SUI)"
                    value={stakeAmounts[pollId] || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStakeAmounts(prev => ({ ...prev, [pollId]: e.target.value }))}
                    min={0}
                    style={{ width: 120, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                  />
                  <Button
                    type="button"
                    size="3"
                    variant="solid"
                    disabled={
                      selectedOptions[pollId] === undefined ||
                      selectedOptions[pollId] === null ||
                      !stakeAmounts[pollId]
                    }
                    onClick={() => handleStake(pollId)}
                  >
                    {stakeStatus[pollId] === 'waiting' ? 'Staking...' : 'Stake'}
                  </Button>
                  {errorMessage[pollId] && (
                    <Text color="red" size="2" ml="2">{errorMessage[pollId]}</Text>
                  )}
                </Flex>
              </Box>
            );
          })}
        </form>
      )}
    </Container>
  );
}

export default StakePage; 
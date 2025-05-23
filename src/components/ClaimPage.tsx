import { Container, Heading, Text, Flex, Box, RadioGroup } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { SuiClient } from '@mysten/sui/client';
import { ConnectButton, useSignAndExecuteTransaction, useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { TESTNET_COUNTER_PACKAGE_ID } from '../constants';
import { CardContainer, CardBody, CardItem } from './ui/3d-card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
const COLLECTION_ID = "0xf7ba633e0120ffe942abc456f3e3642e5b27d39b691778b0774aed6ec493b163";

function ClaimPage() {
  const [polls, setPolls] = useState<any[]>([]);
  const [selectedWinners, setSelectedWinners] = useState<{ [pollId: string]: number | null }>({});
  const [loading, setLoading] = useState(true);
  const account = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();
  const [claimStatus, setClaimStatus] = useState<{ [pollId: string]: string }>({});
  const [errorMessage, setErrorMessage] = useState<{ [pollId: string]: string | null }>({});
  const [tableId, setTableId] = useState<string | null>(null);
  const [userStakes, setUserStakes] = useState<{ [pollId: string]: { [optionIndex: number]: number } }>({});
  const [selectedPollForDialog, setSelectedPollForDialog] = useState<{ pollId: string, totalStake: number, userStake: number } | null>(null);

  console.log('address', account?.address);

  useEffect(() => {
    if (account?.address) {
      fetchPolls();
    }
  }, [account?.address]);

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
      const userStakesFetched: { [pollId: string]: { [optionIndex: number]: number } } = {};

      for (let i = 0; i < nextPollId; i++) {
        const { data: pollData } = await suiClient.getDynamicFieldObject({
          parentId: tableId,
          name: { type: 'u64', value: i.toString() }
        });

        if (pollData?.content?.dataType === "moveObject" && pollData.content.fields) {
          pollsFetched.push(pollData.content.fields);
          
          // Get user stakes for each option in the poll
          const options = (pollData.content.fields as any).value?.fields?.options;
          userStakesFetched[i] = {};
          
          for (let optIdx = 0; optIdx < options.length; optIdx++) {
            const option = options[optIdx];
            const userStakesTable = option.fields.user_stakes;
            
            if (account?.address && userStakesTable) {
              try {
                const { data: userStakeData } = await suiClient.getDynamicFieldObject({
                  parentId: userStakesTable.fields.id.id,
                  name: { type: 'address', value: account.address }
                });
                
                if (userStakeData?.content?.dataType === "moveObject") {
                  userStakesFetched[i][optIdx] = Number((userStakeData.content.fields as any).value);
                } else {
                  userStakesFetched[i][optIdx] = 0;
                }
              } catch (error) {
                userStakesFetched[i][optIdx] = 0;
              }
            }
          }
        }
      }
      
      console.log('Fetched polls:', pollsFetched);
      console.log('Fetched user stakes:', userStakesFetched);
      
      setPolls(pollsFetched);
      setUserStakes(userStakesFetched);
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

  // ... existing code ...
  const calculateProfit = (pollTotalStake: number, optionTotalStake: number, userStake: number) => {
    // Return 0 if any input is 0 to avoid division by zero
    if (pollTotalStake === 0 || optionTotalStake === 0 || userStake === 0) {
      return 0;
    }
    
    // Calculate reward proportionally based on user's stake percentage in the winning option
    const rewardAmount = (BigInt(userStake) * BigInt(pollTotalStake)) / BigInt(optionTotalStake);
    
    // Convert from MIST to SUI
    return Number(rewardAmount) / 1_000_000_000;
  };
// ... existing code ...

  if (loading) {
    return (
      <Container>
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <div className="flex justify-center items-center w-full overflow-x-hidden">
      {/* Background glow effects */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[50px]"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-pink-600/10 blur-[50px]"></div>
        <div className="absolute top-[40%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-blue-600/5 blur-[50px]"></div>
      </div>

      <section className="relative w-full min-h-screen overflow-auto bg-black/50 backdrop-blur-sm flex flex-col items-center justify-start z-[1]">
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-16 flex flex-col items-center">
          <div className="w-full flex flex-col items-center text-center animate-fade-in-down">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
              Claim Your Rewards
            </h1>
            <div className="mb-12 w-full flex justify-center">
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed text-center">
                Claim your rewards for accurately predicting winning memes. Your predictions shape the future of meme culture! 🏆
              </p>
            </div>
            <div className="mb-80 pt-7" />
            <div className="w-full max-w-5xl mb-16">
              <div className="bg-black/20 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-6 text-white">How Claiming Works</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-400">Claiming Process</h4>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                      <li>Select which option you believe is the winner for each poll</li>
                      <li>Click "Claim" to submit your choice and claim your rewards if correct</li>
                      <li>If your prediction matches the community consensus, you'll receive a portion of the stake pool</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-400">Reward Distribution</h4>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                      <li>Rewards are proportional to the total stake</li>
                      <li>Distributed automatically upon successful claim</li>
                      <li>Once claimed, a poll cannot be claimed again</li>
                      <li>Higher stakes lead to higher potential rewards</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-80 pt-7" />
            <div className="mb-8 w-full flex justify-center">
              <ConnectButton />
            </div>

            {loading ? (
              <div className="flex items-center justify-center p-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : polls.length === 0 ? (
              <div className="text-center p-8 bg-black/30 rounded-xl border border-white/10">
                <Text size="4" className="text-gray-300">No active polls found</Text>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); }} className="w-full">
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
                    <CardContainer key={poll.id?.id || idx} className="mb-6 pb-[80px]">
                      <CardBody className="w-[1000px] h-[500px] bg-black/80 rounded-2xl shadow-xl flex flex-col items-center justify-between p-8 border-2 border-white/20">
                        <CardItem translateZ="60" className="mb-4 text-2xl font-bold text-center text-white">
                          {question}
                        </CardItem>
                        <CardItem translateZ="60" className="mb-2 text-white text-lg">
                          Total Stake: {totalStake / 1_000_000_000} SUI
                        </CardItem>
                        <CardItem translateZ="60" className="w-full flex flex-col items-center mb-4">
                          <div className="flex flex-row gap-8 w-full justify-center items-start mb-2">
                            {Array.isArray(options) && options.map((option: any, oidx: number) => {
                              const optionName = Array.isArray(option.fields?.name)
                                ? new TextDecoder().decode(Uint8Array.from(option.fields.name))
                                : '';
                              const cid = Array.isArray(option.fields?.content_id)
                                ? new TextDecoder().decode(Uint8Array.from(option.fields.content_id))
                                : '';
                              const imageUrl = cid ? `https://chocolate-worldwide-earwig-657.mypinata.cloud/ipfs/${cid}` : '';
                              return (
                                <div key={oidx} className="flex flex-col items-center w-1/2">
                                  {cid && (
                                    <img
                                      src={imageUrl}
                                      alt={optionName}
                                      className="w-56 h-56 object-cover rounded-lg mb-2"
                                    />
                                  )}
                                  <span className="font-medium text-lg text-center text-white">{optionName}</span>
                                  {userStakes[pollId]?.[oidx] > 0 && (
                                    <span className="text-sm text-green-500 mt-1">
                                      Your Stake: {userStakes[pollId][oidx] / 1_000_000_000} SUI
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <CardItem translateZ="10" className="w-full mt-4">
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
                              <div className="flex flex-row gap-8 w-full justify-center items-center">
                                {Array.isArray(options) && options.map((option: any, oidx: number) => {
                                  const optionName = Array.isArray(option.fields?.name)
                                    ? new TextDecoder().decode(Uint8Array.from(option.fields.name))
                                    : '';
                                  return (
                                    <label key={oidx} className="flex flex-col items-center">
                                      <RadioGroup.Item value={String(oidx)} className="w-5 h-5 rounded-full border-2 border-purple-500 checked:bg-purple-500 transition-colors" />
                                      <span className="mt-2 text-white">{optionName}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            </RadioGroup.Root>
                          </CardItem>
                        </CardItem>
                        <CardItem translateZ="60" className="flex flex-row items-center gap-4 w-full justify-center mt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                type="button"
                                
                                disabled={
                                  selectedWinners[pollId] === undefined ||
                                  selectedWinners[pollId] === null ||
                                  poll.claimed
                                }
                                onClick={() => {
                                  const selectedOption = selectedWinners[pollId];
                                  if (selectedOption !== null) {
                                    const userStake = userStakes[pollId]?.[selectedOption] || 0;
                                    setSelectedPollForDialog({
                                      pollId,
                                      totalStake,
                                      userStake
                                    });
                                  }
                                }}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {poll.claimed ? 'Already Claimed' : (claimStatus[pollId] === 'waiting' ? 'Claiming...' : 'Claim')}
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Claim Rewards</DialogTitle>
                                <DialogDescription>
                                  <div className="mt-4 space-y-4">
                                    <div className="flex justify-between">
                                      <span>Total Poll Stake:</span>
                                      <span>{totalStake / 1_000_000_000} SUI</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Option Total Stake:</span>
                                      <span>{options[selectedWinners[pollId] || 0]?.fields.total_stake / 1_000_000_000} SUI</span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span>Your Stake:</span>
                                      <span className="text-green-500">
                                        {selectedPollForDialog?.userStake ? selectedPollForDialog.userStake / 1_000_000_000 : 0} SUI
                                      </span>
                                    </div>
                                    <div className="mb-80 pt-7" />
                                    <div className="flex justify-between font-bold">
                                      <span>Estimated Profit:</span>
                                      <span className="text-green-500">
                                        {calculateProfit(
                                          totalStake,
                                          options[selectedWinners[pollId] || 0]?.fields.total_stake || 0,
                                          selectedPollForDialog?.userStake || 0
                                        )} SUI
                                      </span>
                                    </div>
                                    <div className="mb-80 pt-7" />
                                    <Button
                                      onClick={() => {
                                        if (selectedPollForDialog) {
                                          handleClaim(selectedPollForDialog.pollId);
                                        }
                                      }}
                                      className="w-full mt-4"
                                    >
                                      Confirm Claim
                                    </Button>
                                  </div>
                                </DialogDescription>
                              </DialogHeader>
                            </DialogContent>
                          </Dialog>
                          {poll.claimed && (
                            <Text color="gray" size="2" ml="2">This poll has already been claimed.</Text>
                          )}
                          {errorMessage[pollId] && (
                            <Text color="red" size="2" ml="2">{errorMessage[pollId]}</Text>
                          )}
                        </CardItem>
                        
                      </CardBody>
                    </CardContainer>
                  );
                })}
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default ClaimPage;

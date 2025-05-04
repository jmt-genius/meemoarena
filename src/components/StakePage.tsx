import { Container, Heading, Card, Text, Flex, Box, RadioGroup, TextField } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { useWallet } from '@suiet/wallet-kit';
import { Transaction } from '@mysten/sui/transactions';
import { SuiClient } from '@mysten/sui/client';
import { type SuiTransactionBlockResponse } from '@mysten/sui/client';
import { ConnectButton, useSignAndExecuteTransaction, useSuiClient } from '@mysten/dapp-kit';
import { TESTNET_COUNTER_PACKAGE_ID } from '../constants';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { Button } from "@/components/ui/button";
import { CardContainer, CardBody, CardItem } from './ui/3d-card';

// Use environment variables with fallback values
const COLLECTION_ID = "0xf7ba633e0120ffe942abc456f3e3642e5b27d39b691778b0774aed6ec493b163";
const NETWORK_URL = import.meta.env.VITE_NETWORK_URL || 'https://fullnode.testnet.sui.io';
const suiClient = new SuiClient({ url: NETWORK_URL });

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
              Stake Your Memes
            </h1>
            <div className="mb-12 w-full flex justify-center">
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed text-center">
                Back your favorite memes with SUI tokens and earn rewards when they win. Join the community in deciding the next viral sensation! 🚀
              </p>
            </div>

            <div className="w-full max-w-5xl mb-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-black/20 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 text-white">How Staking Works:</h3>
                  <ol className="list-decimal pl-6 space-y-2 text-gray-300">
                    <li>Select your favorite option in a poll</li>
                    <li>Enter the amount of SUI you want to stake</li>
                    <li>Click "Stake" to confirm your choice</li>
                    <li>Your stake increases the option's total stake</li>
                    <li>If your option wins, you'll earn rewards proportional to your stake</li>
                  </ol>
                </div>
                
                <div className="bg-black/20 p-6 rounded-xl border border-white/10 backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 text-white">Rewards System:</h3>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    <li>Total rewards pool grows with each stake</li>
                    <li>Winners share the rewards based on their stake percentage</li>
                    <li>Claim your rewards on the Claim page after voting ends</li>
                    <li>Higher stakes = Higher potential rewards</li>
                    <li>Choose wisely to maximize your returns!</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="mb-80 pt-7" />
            <div className="mb-8 w-full flex justify-center">
              <ConnectButton />
            </div>

            {polls.length === 0 ? (
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
                  return (
                    <CardContainer key={poll.id?.id || idx} className="mb-6">
                      <CardBody className="w-[1000px] h-[500px] bg-black/80 rounded-2xl shadow-xl flex flex-col items-center justify-between p-8 border-2 border-white/20">
                        <CardItem className="mb-4 text-2xl font-bold text-center" translateZ="60" >
                          {question}
                        </CardItem>
                        <CardItem translateZ="60" className="flex flex-row gap-8 w-full justify-center items-start mb-4">
                          {Array.isArray(options) && options.map((option: any, optIdx: number) => {
                            const optionName = Array.isArray(option.fields?.name)
                              ? new TextDecoder().decode(Uint8Array.from(option.fields.name))
                              : '';
                            const cid = Array.isArray(option.fields?.content_id)
                              ? new TextDecoder().decode(Uint8Array.from(option.fields.content_id))
                              : '';
                            const imageUrl = cid ? `https://chocolate-worldwide-earwig-657.mypinata.cloud/ipfs/${cid}` : '';
                            return (
                              <div key={optIdx} className="flex flex-col items-center w-1/2">
                                {cid && (
                                  <img
                                    src={imageUrl}
                                    alt={optionName}
                                    className="w-56 h-56 object-cover rounded-lg mb-2"
                                  />
                                )}
                                <label className="flex flex-col items-center">
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
                                    <RadioGroup.Item value={String(optIdx)} />
                                  </RadioGroup.Root>
                                  <span className="mt-2 font-medium text-lg text-center">{optionName}</span>
                                  <span className="text-xs text-gray-500">(Current Stake: {option.fields.total_stake/1000000000} SUI)</span>
                                </label>
                              </div>
                            );
                          })}
                        </CardItem>
                        <CardItem translateZ="60" className="flex flex-row items-center gap-4 w-full justify-center mt-2">
                          <input
                            type="number"
                            placeholder="Amount to stake (SUI)"
                            value={stakeAmounts[pollId] || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStakeAmounts(prev => ({ ...prev, [pollId]: e.target.value }))}
                            min={0}
                            className="w-60 p-2 rounded border border-gray-300 bg-black/40 text-white"
                          />
                          <Button
                            type="button"
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

export default StakePage; 
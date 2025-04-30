import React, { useState } from 'react';
import { Container, Heading, Button, Flex, Box } from '@radix-ui/themes';
import { useWallet } from '@suiet/wallet-kit';
import { TransactionBlock } from '@mysten/sui.js/transactions';
import axios from 'axios';
import { TESTNET_COUNTER_PACKAGE_ID } from '../constants';
import { ConnectButton, useSignAndExecuteTransaction,useSuiClient } from '@mysten/dapp-kit';
import ClipLoader from 'react-spinners/ClipLoader';

const Admin = () => {
  const [question, setQuestion] = useState('');
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [image1, setImage1] = useState<File | null>(null);
  const [image2, setImage2] = useState<File | null>(null);
  const wallet = useWallet();
  const { mutate: signAndExecute, isSuccess, isPending } = useSignAndExecuteTransaction();
  const suiClient = useSuiClient();

  const apiKey = import.meta.env.VITE_PINATA_API_KEY;
  const secretApiKey = import.meta.env.VITE_PINATA_SECRET_API_KEY;
  const JWT = import.meta.env.VITE_PINATA_JWT;
  

  const handleImageUpload = async (image: File) => {
     // Ensure this is set in your .env file
    console.log(JWT)
    const formData = new FormData();
    formData.append("file", image);
    formData.append("network", "public");

    try {
      const request = await fetch("https://uploads.pinata.cloud/v3/files", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${JWT}`,
        },
        body: formData,
      });

      const response = await request.json();
      console.log(response.data.cid);
      return response.data.cid; // Assuming the response contains a 'cid' field
    } catch (error) {
      console.error('Error uploading file to Pinata:', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const contentId1 = image1 ? await handleImageUpload(image1) : '';
      const contentId2 = image2 ? await handleImageUpload(image2) : '';
      console.log(contentId1);
      const txb = new TransactionBlock();
      console.log(question);
      const questionArg = txb.pure.string(question);
      const option1Arg = txb.pure.string(option1);
      const contentId1Arg = txb.pure.string(contentId1);
      const option2Arg = txb.pure.string(option2);
      const contentId2Arg = txb.pure.string(contentId2);
      txb.setGasBudget(100000000);
      txb.moveCall({
        target: `${TESTNET_COUNTER_PACKAGE_ID}::MemeVirality::create_poll`,
        arguments: [
          txb.object('0xf7ba633e0120ffe942abc456f3e3642e5b27d39b691778b0774aed6ec493b163'),
          questionArg,
          option1Arg,
          contentId1Arg,
          option2Arg,
          contentId2Arg
        ],
      });
      console.log("move worked");
      signAndExecute(
        {
          transaction: txb.serialize(),
        },
        {
          onSuccess: async ({ digest }) => {
            const { effects } = await suiClient.waitForTransaction({
              digest: digest,
              options: {
                showEffects: true,
              },
            });

            if (effects?.created?.[0]?.reference?.objectId) {
              console.log("success")
              alert('Poll created successfully!');
            }
          },
        },
      );
      console.log("perfect");
    } catch (error) {
      console.error('Error creating poll:', error);
    }
  };

  return (
    <Container size="3">
      <Heading size="8" mb="4">Create a New Poll</Heading>
      <Box mb="4">
        <ConnectButton />
      </Box>
      <Flex direction="column" gap="4">
        <input type="text" placeholder="Poll Question" value={question} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuestion(e.target.value)} />
        <input type="text" placeholder="Option 1" value={option1} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOption1(e.target.value)} />
        <input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage1(e.target.files?.[0] || null)} />
        <input type="text" placeholder="Option 2" value={option2} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setOption2(e.target.value)} />
        <input type="file" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImage2(e.target.files?.[0] || null)} />
        <Button onClick={handleSubmit} disabled={isSuccess || isPending}>
          {isSuccess || isPending ? <ClipLoader size={20} /> : 'Create Poll'}
        </Button>
      </Flex>
    </Container>
  );
};

export default Admin;

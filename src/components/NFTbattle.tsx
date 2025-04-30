"use client";
import React, { useState } from "react";
import { Client } from "@gradio/client";
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { useSignAndExecuteTransaction, useCurrentAccount } from '@mysten/dapp-kit';
import { Button } from "@/components/ui/button";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { BackgroundGradient } from "@/components/ui/background-gradient";

const PACKAGE_ID = "0xc897d37de1326095701bb34eb3f9eecf8057855d981c27881b3be1f2fb262005";
const JWT = import.meta.env.VITE_PINATA_JWT;
const GEMINI_API_KEY = "AIzaSyASKIDur6VEDbydkALMrGTtSAMUHb1qRA0"; // Replace with your actual key

export default function MintAINFT() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [cid, setCid] = useState<string | null>(null);
  const [minting, setMinting] = useState(false);
  const { mutate: signAndExecute } = useSignAndExecuteTransaction();
  const account = useCurrentAccount();
  const [prompt, setPrompt] = useState<string>("A futuristic knight in a digital landscape");
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setMinting(true);
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GEMINI_API_KEY}`;
      const body = {
        contents: [{
          parts: [
            { text: `${prompt}. Generate a square image, 1:1 aspect ratio.` }
          ]
        }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] }
      };
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      // Find the base64 image in the response
      let base64Image = null;
      if (
        data.candidates &&
        data.candidates[0].content &&
        data.candidates[0].content.parts
      ) {
        for (const part of data.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.data) {
            base64Image = part.inlineData.data;
            break;
          }
        }
      }
      if (base64Image) {
        const aiImageUrl = `data:image/png;base64,${base64Image}`;
        setGeneratedImageUrl(aiImageUrl);
        setImageUrl(aiImageUrl);
        console.log("AI image URL:", aiImageUrl);
      } else {
        alert("No image generated.");
      }
    } catch (err) {
      alert("Error generating image: " + err);
    }
    setMinting(false);
  };

  const handleMint = async () => {
    setMinting(true);
    // Use the generated image URL if available
    const aiImageUrl = generatedImageUrl || imageUrl;
    if (!aiImageUrl) {
      setMinting(false);
      return;
    }
    // 2. Upload to Pinata
    const imageBlob = await fetch(aiImageUrl).then(res => res.blob());
    const formData = new FormData();
    formData.append("file", imageBlob);
    formData.append("network", "public");

    const request = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: { Authorization: `Bearer ${JWT}` },
      body: formData,
    });
    const response = await request.json();
    setCid(response.data.cid);
    console.log(response.data.cid)
    const ccid=response.data.cid
    // 3. Mint NFT on Sui
    const tx = new TransactionBlock();
    tx.setGasBudget(100000000);
    tx.moveCall({
      target: `${PACKAGE_ID}::nft::mint`,
      arguments: [
        tx.pure(Array.from(new TextEncoder().encode("AI NFT"))),
        tx.pure(Array.from(new TextEncoder().encode("Minted from AI image"))),
        tx.pure(Array.from(new TextEncoder().encode(`https://chocolate-worldwide-earwig-657.mypinata.cloud/ipfs/${ccid}`))),
      ],
    });
    signAndExecute({
      transaction: tx.serialize(),
    });
    setMinting(false);
  };

  const handleImageUpload = async (image: File) => {
    const formData = new FormData();
    formData.append("file", image);

    const request = await fetch("https://uploads.pinata.cloud/v3/files", {
      method: "POST",
      headers: { Authorization: `Bearer ${JWT}` },
      body: formData,
    });
    const response = await request.json();
    console.log(response.data.cid);
    return response.data.cid;
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-row items-center gap-2">
        <input
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Enter your prompt for AI image generation"
          className="p-2 border border-gray-300 rounded w-96"
        />
        <Button onClick={handleGenerate} disabled={minting}>
          Generate
        </Button>
      </div>
      {generatedImageUrl && (
        
          <CardContainer>
            <CardBody className="w-[350px] h-[400px] bg-black border-2 border-white rounded-2xl flex flex-col items-center justify-center">
              <CardItem>
                <img
                  src={generatedImageUrl}
                  alt="Generated AI Preview"
                  style={{ width: 256, height: 256, borderRadius: 16 }}
                />
              </CardItem>
              <Button onClick={handleMint} disabled={minting || !generatedImageUrl} className="mt-6">
                {minting ? "Minting..." : "Mint AI NFT"}
              </Button>
            </CardBody>
          </CardContainer>
        
      )}
      
    </div>
  );
}

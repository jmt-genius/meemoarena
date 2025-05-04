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
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Replace with your actual key

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
              AI NFT Battle Arena
            </h1>
            <div className="mb-12 w-full flex justify-center">
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed text-center">
                Create unique NFTs powered by AI! Generate images using Gemini AI, mint them on Sui blockchain, and join epic meme battles. 🎨 ✨
              </p>
            </div>
            <div className="mb-80 pt-7" />
            <div className="w-full max-w-5xl mb-16">
              <div className="bg-black/20 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-6 text-white">Create & Battle</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-400">Creation Process</h4>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                      <li>Enter a descriptive prompt in the text box</li>
                      <li>Click "Generate" to create your unique AI artwork</li>
                      <li>Once generated, click "Mint AI NFT" to mint your creation</li>
                      <li>Your NFT will be stored on IPFS and recorded on-chain</li>
                    </ul>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium text-purple-400">Battle System</h4>
                    <ul className="list-disc pl-6 space-y-3 text-gray-300">
                      <li>Use your NFTs in community battles</li>
                      <li>Earn rewards based on community votes</li>
                      <li>Build your collection of unique AI-generated art</li>
                      <li>Participate in themed competitions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-80 pt-7" />
            <div className="w-full max-w-2xl mb-12">
              <div className="flex flex-row items-center gap-2 w-full">
                <input
                  type="text"
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Enter your prompt for AI image generation"
                  className="p-3 border border-white/20 bg-black/40 rounded-lg w-full text-lg text-white focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
                <Button onClick={handleGenerate} disabled={minting} className="text-lg py-6 px-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:opacity-90">
                  Generate
                </Button>
              </div>
            </div>
            <div className="mb-80 pt-7" />
            {generatedImageUrl && (
              <CardContainer className="w-full max-w-md mx-auto">
                <CardBody className="w-full h-[600px] bg-black border-2 border-white rounded-2xl flex flex-col items-center justify-between py-8 px-6">
                  <CardItem translateZ="100" className="w-full text-center mb-6">
                    <h2 className="text-2xl font-bold">Your AI-Generated Artwork</h2>
                  </CardItem>
                  
                  <CardItem translateZ="100" className="w-full flex justify-center items-center">
                    <img
                      src={generatedImageUrl}
                      alt="Generated AI Preview"
                      style={{ width: 400, height: 400, borderRadius: 16, objectFit: 'contain' }}
                      className="shadow-xl"
                    />
                  </CardItem>
                  
                  <CardItem translateZ="50" className="w-full mt-8 flex justify-center">
                    <Button 
                      onClick={handleMint} 
                      disabled={minting || !generatedImageUrl} 
                      className="text-lg py-6 px-10"
                    >
                      {minting ? "Minting..." : "Mint AI NFT"}
                    </Button>
                  </CardItem>
                </CardBody>
              </CardContainer>
            )}
            <div className="mb-80 pt-7" />
            <div className="max-w-4xl mx-auto mt-16 px-4">
              <h3 className="text-2xl font-semibold mb-6 text-white">Prompt Examples</h3>
              <div className="mb-80 pt-7" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/20 p-6 rounded-xl border border-white/10">
                  <h4 className="text-lg font-medium text-purple-400 mb-4">Art Styles</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    <li>"Cyberpunk samurai in neon-lit streets"</li>
                    <li>"Watercolor painting of a magical forest"</li>
                    <li>"Pop art style superhero meme"</li>
                    <li>"Vaporwave aesthetic digital landscape"</li>
                  </ul>
                </div>
                <div className="bg-black/20 p-6 rounded-xl border border-white/10">
                  <h4 className="text-lg font-medium text-purple-400 mb-4">Meme Concepts</h4>
                  <ul className="list-disc pl-6 space-y-2 text-gray-300">
                    <li>"Crypto trading emotions as cute animals"</li>
                    <li>"Web3 developer debugging adventures"</li>
                    <li>"NFT collectors in the metaverse"</li>
                    <li>"Blockchain memes with retro gaming style"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

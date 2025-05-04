"use client";
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState, useEffect } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import LetterGlitch from './blocks/Backgrounds/LetterGlitch/LetterGlitch';
import StakePage from './components/StakePage';
import Admin from "./components/Admin";
import ClaimPage from './components/ClaimPage';
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "./components/ui/resizable-navbar";
import ClickSpark from './blocks/Animations/ClickSpark/ClickSpark';
import MintAINFT from "./components/NFTbattle";
import logo from "./../public/icon/icon2.svg";

function NavbarDemo() {
  const navItems = [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "Stake",
      link: "/stake",
    },
    {
      name: "Claim",
      link: "/claim",
    },
    {
      name: "AI NFT Battle",
      link: "/nftbattle",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="relative w-full flex justify-center items-center">
      <Navbar className="navbar">
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo />
          <NavItems items={navItems} />
          <div className="flex items-center gap-4">
            <ConnectButton />
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo />
            <MobileNavToggle
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </MobileNavHeader>

          <MobileNavMenu
            isOpen={isMobileMenuOpen}
            onClose={() => setIsMobileMenuOpen(false)}
          >
            {navItems.map((item, idx) => (
              <Link
                key={`mobile-link-${idx}`}
                to={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </Link>
            ))}
            <div className="flex w-full flex-col gap-4">
              <ConnectButton />
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Add a slight delay to ensure smooth animation entry
    setTimeout(() => setIsLoaded(true), 300);
  }, []);

  return (
    <ClickSpark
      sparkColor='#fff'
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div className="app-background">
        <Router>
          {/* Background glow effects */}
          <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] rounded-full bg-purple-600/10 blur-[50px]"></div>
            <div className="absolute bottom-[15%] right-[10%] w-[35vw] h-[35vw] rounded-full bg-pink-600/10 blur-[50px]"></div>
            <div className="absolute top-[40%] right-[25%] w-[25vw] h-[25vw] rounded-full bg-blue-600/5 blur-[50px]"></div>
          </div>
          
          {/* Main Content */}
          <div className="relative z-[2]">
          <NavbarDemo />
          <Routes>
              <Route path="/" element={<Home isLoaded={isLoaded} />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/stake" element={<StakePage />} />
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/claim' element={<ClaimPage/>}/>
            <Route path='/nftbattle' element={<MintAINFT/>}/>
          </Routes>
          </div>
        </Router>
      </div>
    </ClickSpark>
  );
}

function Home({ isLoaded }: { isLoaded: boolean }) {
  return (
    <div className="flex justify-center items-center w-full overflow-x-hidden">
      {/* Combined Hero and Sui Section */}
      <section className="relative w-full min-h-screen overflow-auto bg-black/50 backdrop-blur-sm flex flex-col items-center justify-start" id="hero">
        {/* Content Container */}
        <div className="relative z-[2] w-full max-w-7xl mx-auto px-4 sm:px-6 py-32 flex flex-col items-center">
          {/* Hero Content */}
          <div className={`w-full flex flex-col items-center text-center ${isLoaded ? 'animate-fade-in-down' : 'opacity-0'} transition-opacity duration-500 pb-32`}> 
            <h1 className="text-5xl md:text-7xl font-bold mb-16 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 leading-tight text-center">
               MeeMo Arena🚀
            </h1>
            <div className="mb-20 w-full flex justify-center">
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl leading-relaxed text-center">
                The ultimate Web3 platform for meme lovers to create, stake, and earn with AI-generated NFTs on the Sui blockchain. 
                Join the battle, vote for your favorites, and claim rewards! 🎮 ✨
              </p>
            </div>
            <div className="mb-80 pt-7" />
            <div className="mb-12 w-full flex justify-center">
              <h3 className="text-2xl font-bold text-center">Platform Features</h3>
            </div>
            <div className="mb-80 pt-7" />
            <div className="w-full flex justify-center mb-24">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 stagger-animation max-w-5xl w-full">
                <FeatureCard 
                  emoji="🎨" 
                  title="AI NFT Creation" 
                  description="Generate unique, one-of-a-kind NFTs using cutting-edge AI technology and mint them directly to the Sui blockchain."
                  delay={0.1}
                />
                <FeatureCard 
                  emoji="💰" 
                  title="Stake & Earn" 
                  description="Stake SUI tokens on your favorite memes in community polls and earn rewards when your predictions are correct."
                  delay={0.3}
                />
                <FeatureCard 
                  emoji="🏆" 
                  title="Competitive Arena" 
                  description="Participate in meme battles with your AI NFTs, compete for community votes, and claim your victory rewards."
                  delay={0.5}
                />
              </div>
            </div>
            {/* Spacing between features and buttons */}
            <div className="mb-80 pt-7" />
            <div className="mb-40 w-full flex justify-center">
              <div className="flex flex-wrap justify-center gap-10">
                <Link
                  to="/nftbattle"
                  className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-medium text-white hover:opacity-90 transition-opacity animate-pulse flex items-center gap-2 text-lg"
                >
                  <span>Start Creating NFTs</span>
                  <span className="text-xl">→</span>
                </Link>
                <Link
                  to="/stake"
                  className="px-10 py-5 bg-black/40 border border-white/30 backdrop-blur-sm rounded-full font-medium text-white hover:bg-black/60 transition-all flex items-center gap-2 text-lg"
                >
                  <span>Explore Polls</span>
                  <span className="text-xl">⭐</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* About Sui Content */}
          <div className="w-full text-center max-w-6xl mx-auto pt-20 pb-24">
         
            
            <div className="mb-16 flex flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <span className="text-4xl font-bold mb-1 text-center">Powered by</span>
                <img src="/images/Sui_Logo.webp" alt="Sui Logo" className="w-32 h-32 object-contain" />
              </div>
            </div>
            
            {/* Two-column layout for Sui description and Architecture card */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-16 mb-24 px-4">
              <div className="w-full md:w-1/2 flex flex-col items-center">
                <div className="mb-16 w-full flex justify-center">
                  <p className="text-xl text-gray-300 leading-relaxed max-w-xl mx-auto text-center">
                    MeeMo Arena is built on Sui, a high-performance Layer 1 blockchain that brings the power of Web3 to millions of users through its security, scalability, and unrivaled user experience.
                  </p>
                </div>
                <div className="mb-80 pt-7" />
                
                <div className="flex flex-wrap gap-6 justify-center">
                  <div className="flex items-center gap-2 bg-black/30 px-6 py-3 rounded-full">
                    <span className="text-emerald-400 text-xl">⚡</span>
                    <span className="text-white">Lightning-fast transactions</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 px-6 py-3 rounded-full">
                    <span className="text-emerald-400 text-xl">🔒</span>
                    <span className="text-white">Advanced security</span>
                  </div>
                  <div className="flex items-center gap-2 bg-black/30 px-6 py-3 rounded-full">
                    <span className="text-emerald-400 text-xl">💸</span>
                    <span className="text-white">Low gas fees</span>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2 flex justify-center md:justify-end mt-12 md:mt-0">
                <div className="relative w-full max-w-md aspect-square p-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-emerald-500/10 rounded-3xl blur-[30px]"></div>
                  <div className="relative h-full w-full bg-black/30 backdrop-blur-sm border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
                    <div className="text-6xl mb-8">🌊</div>
                    <h3 className="text-2xl font-bold mb-6 text-white">Object-Centric Architecture</h3>
                    <p className="text-gray-300 mb-10 text-lg">
                      Sui's unique object-centric model allows for parallel transaction processing and exceptional scalability, making it perfect for NFTs and digital assets.
                    </p>
                    <div className="mb-80 pt-7" />
                    <a href="https://sui.io" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full font-medium text-white hover:opacity-90 transition-opacity">
                      Learn About Sui
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Spacing between Sui architecture and key features */}
            <div className="mb-20" />
            <div className="mb-16">
              <h3 className="text-2xl font-bold text-center">Key Features of Sui Blockchain</h3>
            </div>
            <div className="mb-80 pt-7" />
            <div className="w-full flex justify-center">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl w-full pb-32 px-4">
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-emerald-500/50 transition-all flex flex-col items-center text-center h-full">
                  <div className="text-4xl mb-6">🖼️</div>
                  <h3 className="text-xl font-bold mb-4 text-white">NFT Support</h3>
                  <p className="text-gray-400">First-class NFT and digital asset support with rich on-chain properties</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-emerald-500/50 transition-all flex flex-col items-center text-center h-full">
                  <div className="text-4xl mb-6">🔄</div>
                  <h3 className="text-xl font-bold mb-4 text-white">Move Language</h3>
                  <p className="text-gray-400">Secure smart contracts with the safety-focused Move programming language</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-emerald-500/50 transition-all flex flex-col items-center text-center h-full">
                  <div className="text-4xl mb-6">⚖️</div>
                  <h3 className="text-xl font-bold mb-4 text-white">Consensus</h3>
                  <p className="text-gray-400">Narwhal and Bullshark consensus for high throughput and finality</p>
                </div>
                
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-emerald-500/50 transition-all flex flex-col items-center text-center h-full">
                  <div className="text-4xl mb-6">🔗</div>
                  <h3 className="text-xl font-bold mb-4 text-white">Composability</h3>
                  <p className="text-gray-400">Strong composability enables complex dApps and user experiences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature card component
function FeatureCard({ 
  emoji, 
  title, 
  description, 
  delay = 0 
}: { 
  emoji: string; 
  title: string; 
  description: string;
  delay?: number;
}) {
  return (
    <div 
      className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:border-purple-500/50 transition-all hover:transform hover:scale-105 animate-fade-in-down h-full flex flex-col items-center"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="text-6xl mb-6">{emoji}</div>
      <h3 className="text-xl font-bold mb-4 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function CounterPage() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <Container>
      {currentAccount ? (
        counterId ? (
          <Counter id={counterId} />
        ) : (
          <CreateCounter
            onCreated={(id) => {
              window.location.hash = id;
              setCounter(id);
            }}
          />
        )
      ) : (
        <Heading>Please connect your wallet</Heading>
      )}
    </Container>
  );
}

export default App;

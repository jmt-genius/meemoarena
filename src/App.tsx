"use client";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
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
      <Navbar>
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
              <a
                key={`mobile-link-${idx}`}
                href={item.link}
                onClick={() => setIsMobileMenuOpen(false)}
                className="relative text-neutral-600 dark:text-neutral-300"
              >
                <span className="block">{item.name}</span>
              </a>
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

  return (
    <ClickSpark
      sparkColor='#fff'
      sparkSize={10}
      sparkRadius={15}
      sparkCount={8}
      duration={400}
    >
      <div style={{ minHeight: '100vh', position: 'relative' }}>
        <Router>
          <NavbarDemo />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/counter" element={<CounterPage />} />
            <Route path="/stake" element={<StakePage />} />
            <Route path='/admin' element={<Admin/>}/>
            <Route path='/claim' element={<ClaimPage/>}/>
            <Route path='/nftbattle' element={<MintAINFT/>}/>
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </div>
    </ClickSpark>
  );
}

function Home() {
  return (
    <>
      <Container>
        <Container
          mt="5"
          pt="2"
          px="4"
          style={{ background: "var(--gray-a2)", minHeight: 500 }}
        >
          <Heading>Please connect your wallet</Heading>
          <h1 className="text-3xl font-bold underline">
            Hello world!
          </h1>
        </Container>
      </Container>
    </>
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

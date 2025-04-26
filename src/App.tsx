import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { Box, Container, Flex, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { Counter } from "./Counter";
import { CreateCounter } from "./CreateCounter";
import LetterGlitch from './blocks/Backgrounds/LetterGlitch/LetterGlitch';
import StakePage from './components/StakePage';

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/counter" element={<CounterPage />} />
        <Route path="/stake" element={<StakePage />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

function Home() {
  return (
    <>
      <LetterGlitch
        glitchSpeed={50}
        centerVignette={true}
        outerVignette={false}
        smooth={true}
        glitchColors={["#FF0000", "#00FF00", "#0000FF"]}
      />
      <Flex
        position="sticky"
        px="4"
        py="2"
        justify="between"
        style={{
          borderBottom: "1px solid var(--gray-a2)",
        }}
      >
        <Box>
          <Heading>dApp Starter Template</Heading>
        </Box>

        <Box>
          <ConnectButton />
        </Box>
      </Flex>
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

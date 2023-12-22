import React, { useEffect, useRef, useState } from "react";

import { ethers, Contract } from "ethers";

// import Thing, { OtherThing } from 'somemodule'

// default export -> import Thing from 'somemodule'
// named export -> import { OtherThing } from 'somemodule'

// function onMount() {
//   console.log("hello world");
// }

const contractAddress = "0x294770855Eb7323043958eA87327F2c51D3f62E5";

const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "storedValue",
        type: "uint256",
      },
    ],
    name: "ValueStored",
    type: "event",
  },
  {
    inputs: [],
    name: "retrieve",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "num",
        type: "uint256",
      },
    ],
    name: "store",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

function App() {
  // const [counter, setCounter] = useState(0); // reactive value
  // const [amount, setAmount] = useState(0);
  //const [getter-ish, setter] = useState(initialValue)
  // const variable = 1; // non-reactive value

  // const amount = counter * 2; // derived variable

  // useEffect(onMount);

  // useEffect( setupFunction )
  // run setupFunction on every render

  // useEffect( setupFunction, [dependency1, dependency2])
  // run setupFunction on every render if dependency1 or dependency2 changed

  // useEffect( setupFunction, [] )
  // run setupFunction on first render only

  // useEffect(()=>{
  //   console.log('im run')
  //   setAmount(counter*2)
  // }, [counter])

  // const [name, setName] = useState("");
  // const [surname, setSurname] = useState("");

  // const fullName = name + " " + surname; // derived variable

  // useEffect(() => {
  //   console.log("mount");
  //   return () => {
  //     console.log("unmount");
  //   };
  // });

  // infinite re-render

  // useEffect(()=>{
  //   setCounter(counter+1) // 0 -> 1
  //   setCounter(counter+1) // 1 -> 2
  //   setCounter(counter+1) // 2 -> 3
  //   setCounter(counter+1) // 3 -> 4
  // }, [counter])

  // functional update

  // useEffect( ()=>{
  //   setCounter((prev)=>prev+1)
  //   setCounter((prev)=>prev+1)
  //   setCounter((prev)=>prev+1)
  //   setCounter((prev)=>prev+1)
  // }, [])

  // const myRef = useRef(null);

  // console.log(myRef.current)

  // useEffect(()=>{
  //   console.log(myRef.current)
  // }, [myRef.current])
  const [account, setAccount] = useState(null);

  const onConnectWallet = () => {
    window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then((accounts) => {
        // console.log(accounts);
        setAccount(accounts[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // const onSwitchChain = () => {
  //   console.log("switching chain");
  //   window.ethereum
  //     .request({
  //       method: "wallet_addEthereumChain",
  //       params: [
  //         {
  //           chainId: "0x89",
  //           chainName: "Matic Mainnet",
  //           nativeCurrency: {
  //             name: "Matic",
  //             symbol: "MATIC",
  //             decimals: 18,
  //           },
  //           rpcUrls: ["https://rpc-mainnet.maticvigil.com/"],
  //           blockExplorerUrls: ["https://explorer.matic.network/"],
  //         },
  //       ],
  //     })
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // const onSendTransaction = () => {
  //   window.ethereum
  //     .request({
  //       method: "eth_sendTransaction",
  //       params: [
  //         {
  //           from: account
  //             ? account
  //             : "0",
  //           to: "0xc55886a2FE11Ba8Ed1B84945bbd240313D1B06d9",
  //           value: "0x01"
  //         },
  //       ],
  //     })
  //     .then((result) => {
  //       console.log(result);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  // provider -> public client
  // signer -> wallet client

  // 0x01AEC4e064c010Ee83F58e558dE71ff0625c14B8

  // const provider = new ethers.BrowserProvider(window.ethereum);
  // const signer = await provider.getSigner();
  // const contract = new ethers.Contract(
  // contractAddress, // address
  //   contractABI, // abi (application binary interface)
  //   window.ethereum
  // );

  const [value, setValue] = useState("");

  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const getProviderAndSigner = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setProvider(provider);
      setSigner(signer);

      const contract = new ethers.Contract(
        contractAddress, // address
        contractABI, // abi (application binary interface)
        signer
      );
      setContract(contract);

      contract.on("ValueStored", (storedValue) => {
        console.log("Got emitted event with value: ", storedValue);
      });
    };

    getProviderAndSigner();
  }, []);

  const onStore = async () => {
    const result = await contract.store(Number(value));
    console.log(result);
  };

  const onRetrieve = async () => {
    console.log("retrieving");
    const provider = new ethers.BrowserProvider(window.ethereum);
    console.log(provider);
    const contract = new ethers.Contract(
      contractAddress, // address
      contractABI, // abi (application binary interface)
      provider
    );

    const result = await contract.retrieve();
    console.log(result);
  };

  return (
    <>
      <div className="w-full h-screen flex flex-col items-center justify-center">
        You are connected with: {account}
        <button onClick={onConnectWallet}>Connect Wallet</button>
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          type="decimal"
        />
        <button onClick={onStore}>Store</button>
        <button onClick={onRetrieve}>Retrieve</button>
        {/* <button onClick={onSwitchChain}>Switch Chain</button> */}
        {/* <button onClick={onSendTransaction}>Send Transaction</button> */}
        <button
          onClick={() => {
            console.log(provider);
            console.log(signer);
            console.log(contract);
            console.log(value);
          }}
        >
          test
        </button>
      </div>
    </>
  );
}

export default App;

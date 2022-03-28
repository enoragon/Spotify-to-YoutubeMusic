import "react-native-gesture-handler";

import { useEffect, useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useLoadedAssets } from "./hooks/useLoadedAssets";
import Navigation from "./navigation";
import { useColorScheme, Text } from "react-native";

import * as Linking from 'expo-linking';

// const prefix = Linking.createURL('/');

export default function App() {
  const isLoadingComplete = useLoadedAssets();
  const colorScheme = useColorScheme();
  // const linking = {
  //   prefixes: [prefix],
  // }

  const [data, setData] = useState(null);

  function handleDeepLink(event) {
    let data = Linking.parse(event.url);
    setData(data);
  }

  useEffect(() => {
    async function getInitialURL() {
      const innitialURL = await Linking.getInitialURL();
      if (innitialURL) setData(Linking.parse(innitialURL));
    }

    Linking.addEventListener("url", handleDeepLink);

    if (!data) {
      getInitialURL();
    }

    // fetch('http://localhost:3000', {
    //   method: 'GET',
    //   headers: {
    //     Accept: 'application/json',
    //     'Content-Type': 'application/json'
    //   }
    // }).then(res => res.json())
    // .then(data => console.log(data));
    
    return (() => {
      Linking.removeEventListener("url");
    });

  }, [])

 

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <SafeAreaProvider>
        <Navigation colorScheme={colorScheme} />
        <Text>{ data? JSON.stringify(data) : "Fuck you!" }</Text>
        <StatusBar />
      </SafeAreaProvider>
    );
  }
}

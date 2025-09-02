'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
const fetchWalletBalance = async () => {
  try {
    console.log('Fetching wallet...');
    const response = await axiosInstance.get('/users/profile');
    console.log('Wallet API response:', response);

    if (response.status === 200 && response.data.wallet != null) {
      setWalletBalance(response.data.wallet);
      setLoading(false);
    } else {
      console.warn('Wallet not found in response:', response.data);
    }
  } catch (error) {
    console.error('Failed to fetch wallet balance:', error);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    fetchWalletBalance();
  }, []);

  return (
    <WalletContext.Provider
      value={{ walletBalance, loading, fetchWalletBalance }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);

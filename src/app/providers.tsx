'use client';
import { FC, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({});

const Providers: FC<{ children?: ReactNode }> = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Providers;

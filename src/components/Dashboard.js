import React from 'react';
import { Box, Stack } from '@mui/material';
import { alpha } from '@mui/material/styles';
import Layout from './Layout';
import Header from './Header';
import MainGrid from './MainGrid';

export default function Dashboard() {
  return (
    <Layout>
      <Stack
        spacing={2}
        sx={{
          alignItems: 'center',
          mx: 3,
          pb: 5,
          mt: { xs: 8, md: 0 },
        }}
      >
        <Header />
        <MainGrid />
      </Stack>
    </Layout>
  );
}

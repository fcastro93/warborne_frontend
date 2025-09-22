import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', views: 12000 },
  { name: 'Feb', views: 15000 },
  { name: 'Mar', views: 18000 },
  { name: 'Apr', views: 16000 },
  { name: 'May', views: 20000 },
  { name: 'Jun', views: 19000 },
];

export default function PageViewsBarChart() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Page views and downloads
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          1.3M -8% Page views and downloads for the last 6 months
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#1976d2" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

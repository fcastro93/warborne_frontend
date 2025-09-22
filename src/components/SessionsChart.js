import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', sessions: 4000 },
  { name: 'Feb', sessions: 3000 },
  { name: 'Mar', sessions: 5000 },
  { name: 'Apr', sessions: 4500 },
  { name: 'May', sessions: 6000 },
  { name: 'Jun', sessions: 5500 },
];

export default function SessionsChart() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Sessions
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          13,277 +35% Sessions per day for the last 30 days
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="sessions" stroke="#1976d2" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

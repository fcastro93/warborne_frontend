import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'India', value: 50, color: '#1976d2' },
  { name: 'USA', value: 35, color: '#42a5f5' },
  { name: 'Brazil', value: 10, color: '#90caf9' },
  { name: 'Other', value: 5, color: '#e3f2fd' },
];

export default function ChartUserByCountry() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Users by country
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          98.5K Total
        </Typography>
        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

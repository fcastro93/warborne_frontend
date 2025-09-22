import React from 'react';
import { Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Chip } from '@mui/material';

const rows = [
  { id: 1, page: 'Homepage Overview', status: 'Online', users: 2450, events: 3200, viewsPerUser: 1.3, avgTime: '2m 15s', conversions: 85 },
  { id: 2, page: 'Product Details - Gadgets', status: 'Online', users: 1800, events: 2100, viewsPerUser: 1.2, avgTime: '1m 45s', conversions: 72 },
  { id: 3, page: 'Checkout Process - Step 1', status: 'Online', users: 1200, events: 1500, viewsPerUser: 1.25, avgTime: '3m 20s', conversions: 95 },
  { id: 4, page: 'User Profile Dashboard', status: 'Offline', users: 800, events: 900, viewsPerUser: 1.1, avgTime: '4m 10s', conversions: 60 },
];

export default function CustomizedDataGrid() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Details
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Page Title</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Users</TableCell>
                <TableCell>Event Count</TableCell>
                <TableCell>Views per User</TableCell>
                <TableCell>Average Time</TableCell>
                <TableCell>Daily Conversions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.page}</TableCell>
                  <TableCell>
                    <Chip
                      label={row.status}
                      color={row.status === 'Online' ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.users.toLocaleString()}</TableCell>
                  <TableCell>{row.events.toLocaleString()}</TableCell>
                  <TableCell>{row.viewsPerUser}</TableCell>
                  <TableCell>{row.avgTime}</TableCell>
                  <TableCell>
                    <Box sx={{ width: 100, height: 8, bgcolor: 'grey.200', borderRadius: 1 }}>
                      <Box 
                        sx={{ 
                          width: `${row.conversions}%`, 
                          height: '100%', 
                          bgcolor: 'primary.main', 
                          borderRadius: 1 
                        }} 
                      />
                    </Box>
                    {row.conversions}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

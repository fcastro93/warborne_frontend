import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Chip,
  Box,
} from '@mui/material';

const members = [
  {
    id: 1,
    name: 'GuildMaster',
    role: 'Guild Master',
    level: 85,
    status: 'Online',
    joinDate: '2024-01-15',
    avatar: 'GM',
  },
  {
    id: 2,
    name: 'WarriorElite',
    role: 'Officer',
    level: 82,
    status: 'Online',
    joinDate: '2024-01-20',
    avatar: 'WE',
  },
  {
    id: 3,
    name: 'MageSupreme',
    role: 'Member',
    level: 78,
    status: 'Offline',
    joinDate: '2024-02-01',
    avatar: 'MS',
  },
  {
    id: 4,
    name: 'RogueShadow',
    role: 'Member',
    level: 80,
    status: 'Online',
    joinDate: '2024-02-10',
    avatar: 'RS',
  },
];

const getStatusColor = (status) => {
  switch (status) {
    case 'Online': return 'success';
    case 'Offline': return 'default';
    default: return 'default';
  }
};

const getRoleColor = (role) => {
  switch (role) {
    case 'Guild Master': return 'error';
    case 'Officer': return 'warning';
    default: return 'primary';
  }
};

export default function GuildMembersTable() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Guild Members
        </Typography>
        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Level</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Join Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {members.map((member) => (
                <TableRow key={member.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {member.avatar}
                      </Avatar>
                      <Typography variant="body2">{member.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={member.role}
                      color={getRoleColor(member.role)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{member.level}</TableCell>
                  <TableCell>
                    <Chip
                      label={member.status}
                      color={getStatusColor(member.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{member.joinDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}

import React, { useState, useEffect } from 'react';
import {
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Box,
} from '@mui/material';
import { Person, Shield, LocalFireDepartment, Healing } from '@mui/icons-material';
import { apiService } from '../services/api';

// Static data as fallback
const fallbackMembers = [
  {
    id: 1,
    name: 'ViolenceGuild',
    role: 'Leader',
    gameRole: 'Tank',
    faction: 'Emberwild',
    level: 45,
    status: 'Online',
    joinDate: '2024-01-15',
    avatar: 'VG',
    drifters: ['Warrior', 'Guardian', 'Berserker']
  },
  {
    id: 2,
    name: 'ShadowStrike',
    role: 'Officer',
    gameRole: 'Ranged DPS',
    faction: 'Ashen',
    level: 42,
    status: 'Online',
    joinDate: '2024-01-20',
    avatar: 'SS',
    drifters: ['Ranger', 'Assassin', 'Marksman']
  },
  {
    id: 3,
    name: 'HealMaster',
    role: 'Officer',
    gameRole: 'Healer',
    faction: 'Sirius',
    level: 40,
    status: 'Offline',
    joinDate: '2024-02-01',
    avatar: 'HM',
    drifters: ['Priest', 'Cleric', 'Shaman']
  },
  {
    id: 4,
    name: 'DPSKing',
    role: 'Member',
    gameRole: 'Melee DPS',
    faction: 'Magnates',
    level: 38,
    status: 'Online',
    joinDate: '2024-02-10',
    avatar: 'DK',
    drifters: ['Fighter', 'Rogue', 'Monk']
  },
  {
    id: 5,
    name: 'TankQueen',
    role: 'Member',
    gameRole: 'Defensive Tank',
    faction: 'Ironcreed',
    level: 35,
    status: 'Online',
    joinDate: '2024-02-15',
    avatar: 'TQ',
    drifters: ['Paladin', 'Knight', 'Guardian']
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
    case 'Leader': return 'error';
    case 'Officer': return 'warning';
    default: return 'primary';
  }
};

const getGameRoleIcon = (gameRole) => {
  switch (gameRole) {
    case 'Defensive Tank':
    case 'Offensive Tank':
      return <Shield color="primary" />;
    case 'Healer':
    case 'Defensive Support':
      return <Healing color="success" />;
    case 'Ranged DPS':
    case 'Melee DPS':
    case 'Offensive Support':
      return <LocalFireDepartment color="error" />;
    default:
      return <Person color="action" />;
  }
};

const getFactionColor = (faction) => {
  switch (faction) {
    case 'Emberwild': return 'error';
    case 'Ashen': return 'default';
    case 'Sirius': return 'info';
    case 'Magnates': return 'warning';
    case 'Ironcreed': return 'secondary';
    case 'Shroud': return 'primary';
    default: return 'default';
  }
};

export default function GuildMembersTable() {
  const [members, setMembers] = useState(fallbackMembers);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiService.getGuildMembers();
        if (data.members && data.members.length > 0) {
          // Show only the latest 5 members
          setMembers(data.members.slice(0, 5));
        } else {
          // Use fallback data but limit to 5
          setMembers(fallbackMembers.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching guild members:', error);
        // Keep fallback data but limit to 5
        setMembers(fallbackMembers.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  if (loading) {
    return <div>Loading members...</div>;
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
        Latest 5 Members
      </Typography>
      <TableContainer>
        <Table 
          sx={{
            '& .MuiTableRow-root': {
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
              },
            },
            '& .MuiTableCell-root': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              padding: '8px 16px',
            },
            '& .MuiTableHead-root .MuiTableCell-root': {
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              fontWeight: 600,
              fontSize: '0.875rem',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              color: 'rgba(255, 255, 255, 0.87)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            },
          }}
        >
        <TableHead>
          <TableRow>
            <TableCell>Player</TableCell>
            <TableCell>Game Role</TableCell>
            <TableCell>Level</TableCell>
            <TableCell>Faction</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Drifters</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {members.map((member) => (
            <TableRow key={member.id}>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    {member.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" fontWeight="medium">
                      {member.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {member.role}
                    </Typography>
                  </Box>
                </Box>
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getGameRoleIcon(member.gameRole)}
                  <Typography variant="body2">
                    {member.gameRole}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight="medium">
                  {member.level}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={member.faction}
                  color={getFactionColor(member.faction)}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell>
                <Chip
                  label={member.status}
                  color={getStatusColor(member.status)}
                  size="small"
                />
              </TableCell>
              <TableCell>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {member.drifters.map((drifter, index) => (
                    <Chip
                      key={index}
                      label={drifter}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: '0.7rem' }}
                    />
                  ))}
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

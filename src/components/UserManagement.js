import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Alert,
  Avatar,
  Tooltip,
  Stack,
  Divider
} from '@mui/material';
import {
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  SupervisedUserCircle as StaffIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import Layout from './Layout';

// Custom styles for dark theme table - stable approach
const darkTableStyles = {
  '& .MuiTableHead-root': {
    backgroundColor: 'transparent'
  },
  '& .MuiTableCell-head': {
    backgroundColor: 'transparent',
    color: 'inherit'
  },
  '& .MuiTableRow-head': {
    backgroundColor: '#424242'
  },
  // Prevent layout shifts
  '& .MuiTableCell-root': {
    transition: 'none !important'
  },
  '& .MuiTableRow-root': {
    transition: 'none !important'
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [alert, setAlert] = useState(null);
  
  const [createForm, setCreateForm] = useState({
    username: '',
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    is_staff: false,
    is_active: true
  });
  
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    is_staff: false,
    is_active: true,
    password: ''
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  // Helper function to get authentication headers
  const getAuthHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCookie('csrftoken')
    };
    
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    
    return headers;
  };

  // Helper function to get CSRF token
  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === (name + '=')) {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users/', {
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setUsers(data.users);
      } else {
        showAlert('error', data.error || 'Failed to fetch users');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('error', 'Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/users/create/', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(createForm)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        showAlert('success', data.message);
        setCreateModalOpen(false);
        setCreateForm({
          username: '',
          email: '',
          password: '',
          first_name: '',
          last_name: '',
          is_staff: false,
          is_active: true
        });
        fetchUsers();
      } else {
        showAlert('error', data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      showAlert('error', 'Error creating user');
    }
  };

  const handleEditUser = async () => {
    try {
      const response = await fetch(`/api/users/${selectedUser.id}/update/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(editForm)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        showAlert('success', data.message);
        setEditModalOpen(false);
        setSelectedUser(null);
        fetchUsers();
      } else {
        showAlert('error', data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      showAlert('error', 'Error updating user');
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!window.confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await fetch(`/api/users/${userId}/delete/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        showAlert('success', data.message);
        fetchUsers();
      } else {
        showAlert('error', data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showAlert('error', 'Error deleting user');
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setEditForm({
      username: user.username,
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      is_staff: user.is_staff,
      is_active: user.is_active,
      password: ''
    });
    setEditModalOpen(true);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  const getUserInitials = (user) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return user.username.substring(0, 2).toUpperCase();
  };

  const getUserStatusColor = (user) => {
    if (!user.is_active) return 'error';
    if (user.is_superuser) return 'secondary';
    if (user.is_staff) return 'primary';
    return 'success';
  };

  const getUserStatusText = (user) => {
    if (!user.is_active) return 'Inactive';
    if (user.is_superuser) return 'Superuser';
    if (user.is_staff) return 'Staff';
    return 'Active';
  };

  const getUserStatusIcon = (user) => {
    if (!user.is_active) return <CancelIcon />;
    if (user.is_superuser) return <AdminIcon />;
    if (user.is_staff) return <StaffIcon />;
    return <PersonIcon />;
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{ p: 3, minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>Loading users...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ 
        p: 3, 
        minHeight: '100vh',
        backgroundColor: 'inherit',
        position: 'relative'
      }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              <SecurityIcon sx={{ mr: 2, verticalAlign: 'middle' }} />
              User Management
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage system users and permissions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => setCreateModalOpen(true)}
            sx={{ 
              bgcolor: '#1976d2', 
              '&:hover': { bgcolor: '#1565c0' },
              borderRadius: 2,
              px: 3,
              py: 1.5
            }}
          >
            Create User
          </Button>
        </Box>

        {/* Alert */}
        {alert && (
          <Alert 
            severity={alert.type} 
            sx={{ mb: 3, borderRadius: 2 }}
            onClose={() => setAlert(null)}
          >
            {alert.message}
          </Alert>
        )}

        {/* Users Table */}
        <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
          <CardContent sx={{ p: 0 }}>
            <TableContainer sx={darkTableStyles}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'grey.800' }}>
                    <TableCell sx={{ fontWeight: 'bold', py: 2, color: 'white' }}>User</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Status</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Joined</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: 'white' }}>Last Login</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', textAlign: 'center', color: 'white' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover sx={{ bgcolor: 'grey.900', '&:hover': { bgcolor: 'grey.700' } }}>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: getUserStatusColor(user) === 'primary' ? '#1976d2' : 
                                      getUserStatusColor(user) === 'secondary' ? '#9c27b0' : 
                                      getUserStatusColor(user) === 'error' ? '#f44336' : '#4caf50',
                              mr: 2,
                              width: 40,
                              height: 40
                            }}
                          >
                            {getUserInitials(user)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'medium', color: 'white' }}>
                              {user.first_name && user.last_name 
                                ? `${user.first_name} ${user.last_name}`
                                : user.username
                              }
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'grey.400' }}>
                              @{user.username}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={getUserStatusIcon(user)}
                          label={getUserStatusText(user)}
                          color={getUserStatusColor(user)}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {user.email || 'No email'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {formatDate(user.date_joined)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ color: 'white' }}>
                          {formatDate(user.last_login)}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ textAlign: 'center' }}>
                        <Stack direction="row" spacing={1} justifyContent="center">
                          <Tooltip title="Edit User">
                            <IconButton
                              size="small"
                              onClick={() => openEditModal(user)}
                              sx={{ color: '#1976d2' }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                          {!user.is_superuser && user.id !== parseInt(localStorage.getItem('userId')) && (
                            <Tooltip title="Delete User">
                              <IconButton
                                size="small"
                                onClick={() => handleDeleteUser(user.id, user.username)}
                                sx={{ color: '#f44336' }}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Create User Modal */}
        <Dialog open={createModalOpen} onClose={() => setCreateModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <PersonAddIcon sx={{ mr: 1, color: '#1976d2' }} />
              Create New User
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username *"
                  value={createForm.username}
                  onChange={(e) => setCreateForm({ ...createForm, username: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={createForm.email}
                  onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password *"
                  type="password"
                  value={createForm.password}
                  onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={createForm.first_name}
                  onChange={(e) => setCreateForm({ ...createForm, first_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={createForm.last_name}
                  onChange={(e) => setCreateForm({ ...createForm, last_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={createForm.is_staff}
                        onChange={(e) => setCreateForm({ ...createForm, is_staff: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Staff User (can access admin features)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={createForm.is_active}
                        onChange={(e) => setCreateForm({ ...createForm, is_active: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Active User"
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateUser}
              variant="contained"
              disabled={!createForm.username || !createForm.password}
            >
              Create User
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit User Modal */}
        <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ pb: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <EditIcon sx={{ mr: 1, color: '#1976d2' }} />
              Edit User: {selectedUser?.username}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Username *"
                  value={editForm.username}
                  onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="New Password (leave blank to keep current)"
                  type="password"
                  value={editForm.password}
                  onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editForm.is_staff}
                        onChange={(e) => setEditForm({ ...editForm, is_staff: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Staff User (can access admin features)"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={editForm.is_active}
                        onChange={(e) => setEditForm({ ...editForm, is_active: e.target.checked })}
                        color="primary"
                      />
                    }
                    label="Active User"
                  />
                </Stack>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditUser}
              variant="contained"
              disabled={!editForm.username}
            >
              Update User
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
};

export default UserManagement;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Stack, Button, Fab, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { RecommendRounded, BuildRounded, PersonRounded, StarRounded, AddRounded, CloseRounded } from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

export default function RecommendedBuildsList() {
  const navigate = useNavigate();
  const [recommendedBuilds, setRecommendedBuilds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createForm, setCreateForm] = useState({
    title: '',
    description: '',
    role: ''
  });

  useEffect(() => {
    fetchRecommendedBuilds();
  }, []);

  const fetchRecommendedBuilds = async () => {
    try {
      setLoading(true);
      const buildsData = await apiService.getRecommendedBuilds();
      console.log('Recommended builds data:', buildsData);
      setRecommendedBuilds(buildsData.builds || []);
    } catch (error) {
      console.error('Error fetching recommended builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuildClick = (buildId) => {
    navigate(`/recbuilds/${buildId}`);
  };

  const handleCreateBuild = () => {
    setCreateModalOpen(true);
  };

  const handleCloseModal = () => {
    setCreateModalOpen(false);
    setCreateForm({
      title: '',
      description: '',
      role: ''
    });
  };

  const handleFormChange = (field, value) => {
    setCreateForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitBuild = async () => {
    try {
      // Validate required fields
      if (!createForm.title.trim()) {
        alert('Please enter a build title');
        return;
      }
      if (!createForm.description.trim()) {
        alert('Please enter a build description');
        return;
      }
      if (!createForm.role) {
        alert('Please select a role');
        return;
      }

      // Create the build via API
      const response = await fetch('/api/builds/create/', {
        method: 'POST',
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify({
          title: createForm.title,
          description: createForm.description,
          role: createForm.role
        })
      });

      if (response.ok) {
        const result = await response.json();
        handleCloseModal();
        // Navigate to the newly created build
        navigate(`/recbuilds/${result.build_id}`);
      } else {
        const error = await response.json();
        alert('Error creating build: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating build:', error);
      alert('Error creating build: ' + error.message);
    }
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

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'healer':
        return '#4caf50'; // Green
      case 'dps':
        return '#f44336'; // Red
      case 'support':
        return '#2196f3'; // Blue
      default:
        return '#9e9e9e'; // Grey
    }
  };

  const getRarityColor = (rarity) => {
    switch (rarity?.toLowerCase()) {
      case 'common':
        return '#9e9e9e'; // Grey
      case 'uncommon':
        return '#4caf50'; // Green
      case 'rare':
        return '#2196f3'; // Blue
      case 'epic':
        return '#9c27b0'; // Purple
      case 'legendary':
        return '#ff9800'; // Orange
      default:
        return '#9e9e9e'; // Grey
    }
  };

  if (loading) {
    return (
      <Layout>
        <Box sx={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Typography sx={{ color: '#ffffff', fontSize: '1.5rem' }}>
            Loading recommended builds...
          </Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        color: '#ffffff',
        p: 2.5
      }}>
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center', position: 'relative' }}>
          <Typography variant="h4" sx={{
            color: '#64b5f6',
            fontWeight: 'bold',
            mb: 1,
            textShadow: '0 0 20px rgba(100, 181, 246, 0.5)'
          }}>
            Recommended Builds
          </Typography>
          <Typography variant="h6" sx={{ color: '#b0bec5', mb: 3 }}>
            Discover optimized builds for your drifters
          </Typography>
          
          {/* Create Build Button */}
          <Button
            variant="contained"
            startIcon={<AddRounded />}
            onClick={handleCreateBuild}
            sx={{
              background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              fontSize: '1rem',
              textTransform: 'none',
              boxShadow: '0 4px 15px rgba(100, 181, 246, 0.3)',
              transition: 'all 0.3s ease',
              '&:hover': {
                background: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(100, 181, 246, 0.4)'
              }
            }}
          >
            Create New Build
          </Button>
        </Box>

        {/* Builds Grid */}
        {recommendedBuilds.length > 0 ? (
          <Grid container spacing={3}>
            {recommendedBuilds.map((build) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={build.id}>
                <Card
                  onClick={() => handleBuildClick(build.id)}
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(100, 181, 246, 0.3)',
                      borderColor: '#64b5f6'
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Build Header */}
                    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                      <Avatar sx={{
                        bgcolor: getRoleColor(build.role),
                        width: 48,
                        height: 48
                      }}>
                        <BuildRounded />
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" sx={{
                          color: '#ffffff',
                          fontWeight: 600,
                          mb: 0.5
                        }}>
                          {build.title}
                        </Typography>
                        <Chip
                          label={build.role?.charAt(0).toUpperCase() + build.role?.slice(1)}
                          size="small"
                          sx={{
                            bgcolor: getRoleColor(build.role),
                            color: 'white',
                            fontWeight: 600,
                            fontSize: '0.75rem'
                          }}
                        />
                      </Box>
                    </Stack>

                    {/* Description */}
                    {build.description && (
                      <Typography sx={{
                        color: '#b0bec5',
                        fontSize: '0.9rem',
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {build.description}
                      </Typography>
                    )}

                    {/* Drifter Info */}
                    {build.drifter && (
                      <Box sx={{ mb: 2 }}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <PersonRounded sx={{ color: '#64b5f6', fontSize: '1.2rem' }} />
                          <Typography sx={{ color: '#64b5f6', fontWeight: 600 }}>
                            {build.drifter.name}
                          </Typography>
                        </Stack>
                        <Typography sx={{ color: '#b0bec5', fontSize: '0.8rem', ml: 3 }}>
                          HP: {build.drifter.base_health} | Energy: {build.drifter.base_energy}
                        </Typography>
                      </Box>
                    )}

                    {/* Equipment Preview */}
                    <Box sx={{ mb: 2 }}>
                      <Stack direction="row" spacing={1} flexWrap="wrap">
                        {build.weapon && (
                          <Chip
                            label={build.weapon.name}
                            size="small"
                            sx={{
                              bgcolor: getRarityColor(build.weapon.rarity),
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        )}
                        {build.helmet && (
                          <Chip
                            label={build.helmet.name}
                            size="small"
                            sx={{
                              bgcolor: getRarityColor(build.helmet.rarity),
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        )}
                        {build.chest && (
                          <Chip
                            label={build.chest.name}
                            size="small"
                            sx={{
                              bgcolor: getRarityColor(build.chest.rarity),
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        )}
                        {build.boots && (
                          <Chip
                            label={build.boots.name}
                            size="small"
                            sx={{
                              bgcolor: getRarityColor(build.boots.rarity),
                              color: 'white',
                              fontSize: '0.7rem',
                              height: 24
                            }}
                          />
                        )}
                      </Stack>
                    </Box>

                    {/* Footer */}
                    <Stack direction="row" justifyContent="flex-end" alignItems="center">
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          bgcolor: '#64b5f6',
                          color: 'white',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: '#42a5f5'
                          }
                        }}
                      >
                        View Build
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center'
          }}>
            <RecommendRounded sx={{ fontSize: 64, color: '#64b5f6', mb: 2, opacity: 0.5 }} />
            <Typography variant="h5" sx={{ color: '#b0bec5', mb: 1 }}>
              No Recommended Builds Available
            </Typography>
            <Typography sx={{ color: '#90caf9', opacity: 0.8 }}>
              Check back later for optimized build recommendations
            </Typography>
          </Box>
        )}

        {/* Floating Action Button for Mobile */}
        <Fab
          color="primary"
          aria-label="create build"
          onClick={handleCreateBuild}
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
            boxShadow: '0 4px 15px rgba(100, 181, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
              transform: 'scale(1.05)',
              boxShadow: '0 8px 25px rgba(100, 181, 246, 0.4)'
            },
            display: { xs: 'flex', md: 'none' } // Only show on mobile
          }}
        >
          <AddRounded />
        </Fab>

        {/* Create Build Modal */}
        <Dialog
          open={createModalOpen}
          onClose={handleCloseModal}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              background: 'linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(45, 45, 45, 0.95))',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: 2,
              backdropFilter: 'blur(20px)',
              color: '#ffffff',
              maxHeight: '90vh',
              overflow: 'auto'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#64b5f6', 
            fontSize: '1.5rem', 
            fontWeight: 700, 
            textAlign: 'center',
            borderBottom: '2px solid rgba(100, 181, 246, 0.3)',
            pb: 2,
            pt: 3,
            px: 3
          }}>
            Create New Build
          </DialogTitle>
          
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Build Title"
                value={createForm.title}
                onChange={(e) => handleFormChange('title', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#64b5f6' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0bec5' }
                }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={createForm.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused fieldset': { borderColor: '#64b5f6' }
                  },
                  '& .MuiInputLabel-root': { color: '#b0bec5' }
                }}
              />
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    color: '#b0bec5',
                    '&.Mui-focused': { color: '#64b5f6' }
                  }}
                >
                  Role
                </InputLabel>
                <Select
                  value={createForm.role}
                  onChange={(e) => handleFormChange('role', e.target.value)}
                  label="Role"
                  sx={{
                    color: 'white',
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.3)' },
                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255, 255, 255, 0.5)' },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#64b5f6' }
                  }}
                >
                  <MenuItem value="ranged_dps">Ranged DPS</MenuItem>
                  <MenuItem value="melee_dps">Melee DPS</MenuItem>
                  <MenuItem value="healer">Healer</MenuItem>
                  <MenuItem value="defensive_tank">Defensive Tank</MenuItem>
                  <MenuItem value="offensive_tank">Offensive Tank</MenuItem>
                  <MenuItem value="offensive_support">Offensive Support</MenuItem>
                  <MenuItem value="defensive_support">Defensive Support</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, justifyContent: 'center' }}>
            <Button
              onClick={handleCloseModal}
              sx={{
                color: '#b0bec5',
                mr: 2,
                '&:hover': {
                  color: '#ffffff',
                  background: 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitBuild}
              variant="contained"
              sx={{
                background: 'linear-gradient(135deg, #64b5f6, #42a5f5)',
                color: 'white',
                px: 4,
                '&:hover': {
                  background: 'linear-gradient(135deg, #42a5f5, #1e88e5)'
                }
              }}
            >
              Create Build
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Layout>
  );
}

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Grid, Avatar, Chip, Stack, Button, Fab } from '@mui/material';
import { RecommendRounded, BuildRounded, PersonRounded, StarRounded, AddRounded } from '@mui/icons-material';
import Layout from './Layout';
import { apiService } from '../services/api';

export default function RecommendedBuildsList() {
  const navigate = useNavigate();
  const [recommendedBuilds, setRecommendedBuilds] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const getRoleColor = (role) => {
    switch (role?.toLowerCase()) {
      case 'healer':
        return '#4caf50'; // Green
      case 'tank':
        return '#ff9800'; // Orange
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
            onClick={() => {
              // For now, we'll navigate to a create build page or show a modal
              // You can implement the actual create functionality later
              console.log('Create new build clicked');
              // navigate('/recbuilds/create');
            }}
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
                      <Typography sx={{ color: '#90caf9', fontSize: '0.8rem', fontWeight: 600, mb: 1 }}>
                        Equipment:
                      </Typography>
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
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ color: '#b0bec5', fontSize: '0.8rem' }}>
                        by {build.created_by}
                      </Typography>
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
          onClick={() => {
            console.log('Create new build clicked (FAB)');
            // navigate('/recbuilds/create');
          }}
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
      </Box>
    </Layout>
  );
}

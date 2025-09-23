import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Button, Paper, Avatar, Chip, IconButton, Tabs, Tab } from '@mui/material';
import { ArrowBack, Add, Inventory2, Person } from '@mui/icons-material';
import Layout from './Layout';
// Legacy theme values - inline for this component
const legacyVars = {
  bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  cardBg: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(255,255,255,0.1)',
  textPrimary: '#ffffff',
  textSubtle: '#b0bec5',
  accentBlue: '#64b5f6',
  accentBlueHover: '#4a9eff',
};

const legacySx = {
  pageBg: {
    minHeight: '100vh',
    color: legacyVars.textPrimary,
    background: legacyVars.bgGradient
  },
  glassCard: {
    background: legacyVars.cardBg,
    border: `1px solid ${legacyVars.cardBorder}`,
    borderRadius: 2,
    backdropFilter: 'blur(10px)',
  },
  sectionTitle: {
    fontWeight: 700,
    color: legacyVars.accentBlue,
    textShadow: `0 0 20px rgba(100, 181, 246, 0.5)`,
  },
  pillTabs: {
    container: {
      background: legacyVars.cardBg,
      borderRadius: 2,
      p: 0.5,
    },
    tab: {
      textTransform: 'none',
      fontWeight: 600,
      color: legacyVars.textSubtle,
      borderRadius: 1,
      '&.Mui-selected': {
        color: legacyVars.accentBlue,
        background: 'rgba(100, 181, 246, 0.2)',
        boxShadow: `0 0 15px rgba(100, 181, 246, 0.3)`
      },
      '&:hover': {
        background: 'rgba(255,255,255,0.1)',
        color: '#fff'
      }
    }
  },
  primaryButton: {
    background: `linear-gradient(135deg, ${legacyVars.accentBlue}, #42a5f5)`,
    color: '#fff',
    fontWeight: 600,
    boxShadow: `0 4px 15px rgba(100, 181, 246, 0.3)`,
    '&:hover': {
      background: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px rgba(100, 181, 246, 0.4)`
    }
  }
};

// Rarity colors for slot cards - using legacy theme
const rarityColor = {
  common: legacyVars.textSubtle,
  uncommon: '#4caf50',
  rare: '#2196f3',
  epic: '#9c27b0',
  legendary: '#ff9800',
};

// Legacy typography helpers - matching old CSS .subtitle, .info-label, .info-value
const legacyTypography = {
  primary: {
    color: legacyVars.textPrimary, // white
    fontWeight: 600,
  },
  subtitle: {
    color: legacyVars.textSubtle, // #b0bec5
    fontWeight: 400,
  },
  infoLabel: {
    color: legacyVars.textSubtle, // #b0bec5
    fontWeight: 500,
  },
  infoValue: {
    color: legacyVars.textPrimary, // white
    fontWeight: 700,
  },
};

// Slot card component with legacy styling
const SlotCard = ({ state, label, item, selected, onClick }) => {
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick?.();
    }
  };

  const getAriaLabel = () => {
    const slotType = label.toLowerCase();
    if (slotType.startsWith('mod')) {
      return `${label} slot`;
    }
    return `${slotType} slot`;
  };

  return (
    <Paper
      elevation={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={getAriaLabel()}
      sx={[
        {
          aspectRatio: '1 / 1',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-1px)',
          },
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 2px ${legacyVars.accentBlue}`,
          }
        },
        // Base glass card styling
        legacySx.glassCard,
        // Empty slot styling
        state === 'empty' && {
          border: `1px dashed ${legacyVars.cardBorder}`,
          '&:hover': {
            border: `1px dashed ${legacyVars.accentBlue}`,
          }
        },
        // Filled slot styling with soft glow
        state === 'filled' && {
          border: `1px solid ${rarityColor[item?.rarity || 'common']}`,
          boxShadow: `0 0 10px ${rarityColor[item?.rarity || 'common']}20`,
          '&:hover': {
            boxShadow: `0 0 15px ${rarityColor[item?.rarity || 'common']}40`,
          }
        },
        selected && {
          boxShadow: `0 0 0 2px ${legacyVars.accentBlue} inset`
        },
      ]}
    >
      {state === 'empty' ? (
        <>
          <IconButton size="small" sx={{ color: legacyVars.textSubtle }}>
            <Add />
          </IconButton>
          <Typography 
            variant="caption" 
            sx={{ 
              position: 'absolute', 
              bottom: 6, 
              left: 0, 
              right: 0, 
              textAlign: 'center', 
              opacity: 0.7,
              ...legacyTypography.subtitle
            }}
          >
            {label}
          </Typography>
        </>
      ) : (
        <>
          {item?.imageUrl ? (
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              maxHeight: '55%',
              width: '100%',
              p: 1
            }}>
              <Box 
                component="img" 
                src={item.imageUrl} 
                alt={item?.name} 
                sx={{ 
                  maxWidth: '100%', 
                  maxHeight: '100%', 
                  objectFit: 'contain' 
                }} 
              />
            </Box>
          ) : (
            <Avatar sx={{ mb: 1, width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.1)' }}>
              <Inventory2 sx={{ color: legacyVars.textSubtle }} />
            </Avatar>
          )}
          <Typography 
            variant="body2" 
            textAlign="center"
            sx={{ mb: 0.5, ...legacyTypography.infoValue }}
          >
            {item?.name}
          </Typography>
          {item?.subtitle && (
            <Typography 
              variant="body2" 
              sx={{ 
                opacity: 0.8, 
                mb: 0.5,
                textAlign: 'center',
                fontSize: '0.75rem',
                ...legacyTypography.subtitle
              }}
            >
              {item.subtitle}
            </Typography>
          )}
          {item?.stat && (
            <Typography 
              variant="caption" 
              sx={{ 
                mt: 0.5, 
                color: '#4caf50',
                textAlign: 'center',
                display: 'block'
              }}
            >
              {item.stat}
            </Typography>
          )}
          <Chip 
            size="small" 
            variant="outlined" 
            sx={{ 
              mt: 0.5, 
              borderColor: rarityColor[item?.rarity || 'common'], 
              color: rarityColor[item?.rarity || 'common'],
              fontSize: '0.7rem',
              height: 20,
              bgcolor: 'rgba(255,255,255,0.05)'
            }} 
            label={label} 
          />
        </>
      )}
    </Paper>
  );
};

export default function PlayerLoadout() {
  const { playerId } = useParams();
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Sample drifter data
  const drifters = [
    { name: 'Solenne', level: 15, class: 'Healer' },
    { name: 'Drifter 2', level: 12, class: 'Warrior' },
    { name: 'Drifter 3', level: 8, class: 'Mage' }
  ];

    return (
      <Layout>
      <Box sx={[legacySx.pageBg, { p: 3 }]}>
        {/* Header with Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />} 
            onClick={() => window.history.back()}
            sx={[legacySx.primaryButton, { mb: 2 }]}
          >
            Back
          </Button>
          
          <Typography variant="h4" component="h1" sx={[legacySx.sectionTitle, { mb: 1 }]}>
            Player Loadout
                </Typography>
          
          <Typography variant="body1" sx={legacyTypography.subtitle}>
            Player ID: {playerId}
          </Typography>
        </Box>

        {/* Drifter Loadouts Section */}
        <Box sx={{ ...legacySx.glassCard, p: 2, mb: 3 }}>
          <Typography variant="h6" sx={legacySx.sectionTitle}>
                  Drifter Loadouts
                </Typography>
                
          {/* Pill-styled Tabs */}
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
            sx={legacySx.pillTabs.container}
                >
                  {drifters.map((drifter, index) => (
                    <Tab
                      key={index}
                      label={
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Person sx={{ fontSize: 18 }} />
                    {drifter.name}
                        </Box>
                      }
                sx={legacySx.pillTabs.tab}
                    />
                  ))}
                </Tabs>

          {/* Tab Content */}
                {drifters.map((drifter, index) => (
                  <Box
                    key={index}
                    hidden={activeTab !== index}
                    sx={{ mt: 2 }}
                  >
              <Typography variant="body2" sx={{ mb: 2, ...legacyTypography.infoLabel }}>
                Level {drifter.level} {drifter.class}
                        </Typography>
              
              {/* Change Drifter Button */}
                        <Box sx={{ textAlign: 'center' }}>
                          <Button 
                            variant="contained" 
                  sx={legacySx.primaryButton}
                          >
                            Change Drifter
                          </Button>
                        </Box>
                  </Box>
                ))}
        </Box>
                  
        {/* Equipped Items Section */}
        <Box sx={{ ...legacySx.glassCard, p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={legacySx.sectionTitle}>
                      Equipped Items:
                    </Typography>
            <Typography variant="body2" sx={legacyTypography.subtitle}>
                      5/9
                    </Typography>
                  </Box>
                  
          {/* Equipment Grid */}
          <Box
                            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
                              },
                            }}
                          >
            {/* Equipment Slots - First Row (5 slots) */}
            {['weapon', 'helmet', 'chest', 'boots', 'consumable'].map((slot) => {
              // Sample data - replace with real data
              const sampleItems = {
                weapon: { name: 'Luminous Ward', subtitle: 'Sanctum Arc', rarity: 'epic', stat: '' },
                helmet: { name: 'Healer\'s Hood', subtitle: 'Swift Aid', rarity: 'rare', stat: 'HP: +714' },
                chest: { name: 'Cleansing Robe', subtitle: 'Purify', rarity: 'common', stat: '' },
                boots: { name: 'Arcaneflow Boots', subtitle: 'Abundance', rarity: 'rare', stat: 'HP: +675' },
                consumable: { name: 'Mass Healing Elixir', subtitle: 'Mass Healing Elixir', rarity: 'common', stat: '' }
              };
              const item = sampleItems[slot];
              return (
                <SlotCard
                  key={slot}
                  state={item ? "filled" : "empty"}
                  label={slot}
                  item={item}
                  onClick={() => console.log(`Clicked ${slot}`)}
                />
                    );
                  })}
                    
            {/* Mod Slots - Second Row (4 slots) */}
            {[1, 2, 3, 4].map((modNum) => {
              const modSlot = `mod${modNum}`;
                               return (
                <SlotCard
                  key={modSlot}
                  state="empty"
                  label={`Mod ${modNum}`}
                  onClick={() => console.log(`Adding mod to ${modSlot}`)}
                />
                               );
                             })}
                         </Box>
                  </Box>
                                       
        {/* Example: Game Items Section */}
        <Box sx={{ ...legacySx.glassCard, p: 2 }}>
          <Typography variant="h6" sx={legacySx.sectionTitle}>
            Game Items
                </Typography>
          <Typography variant="body2" sx={{ mt: 1, ...legacyTypography.subtitle }}>
            This section will contain the item inventory and filters
                      </Typography>
                  </Box>
      </Box>
    </Layout>
  );
}

import { alpha } from '@mui/material/styles';

export const legacyVars = {
  bgGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
  cardBg: 'rgba(255,255,255,0.05)',
  cardBorder: 'rgba(255,255,255,0.1)',
  textPrimary: '#ffffff',
  textSubtle: '#b0bec5',
  accentBlue: '#64b5f6',
  accentBlueHover: '#4a9eff',
};

export const legacySx = {
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
    textShadow: `0 0 20px ${alpha(legacyVars.accentBlue, 0.5)}`,
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
        background: alpha(legacyVars.accentBlue, 0.2),
        boxShadow: `0 0 15px ${alpha(legacyVars.accentBlue, 0.3)}`
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
    boxShadow: `0 4px 15px ${alpha(legacyVars.accentBlue, 0.3)}`,
    '&:hover': {
      background: 'linear-gradient(135deg, #42a5f5, #1e88e5)',
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 20px ${alpha(legacyVars.accentBlue, 0.4)}`
    }
  }
};

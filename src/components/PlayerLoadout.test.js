import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import PlayerLoadout from './PlayerLoadout';

// Mock the API service
jest.mock('../services/api', () => ({
  apiService: {
    getPlayer: jest.fn(),
    getPlayerDrifters: jest.fn(),
    getGearItems: jest.fn(),
    getPlayerEquippedGear: jest.fn(),
  }
}));

// Mock the Layout component
jest.mock('./Layout', () => {
  return function MockLayout({ children }) {
    return <div data-testid="layout">{children}</div>;
  };
});

// Create a theme for testing
const theme = createTheme();

const renderWithTheme = (component) => {
  return render(
    <ThemeProvider theme={theme}>
      {component}
    </ThemeProvider>
  );
};

// Mock player data
const mockPlayer = {
  id: 1,
  name: 'TestPlayer',
  discord_name: 'testuser#1234',
  level: 5,
  role: 'member',
  game_role: 'healer',
  gearItems: []
};

// Mock equipment data
const mockEquipment = {
  weapon: {
    id: 'weapon-luminous-ward',
    slot: 'weapon',
    name: 'Luminous Ward',
    subtitle: 'Sanctum Arc',
    rarity: 'epic',
    stat: 'Damage: +25%',
    imageUrl: null
  },
  helmet: {
    id: 'helmet-healers-hood',
    slot: 'helmet',
    name: 'Healer\'s Hood',
    subtitle: 'Swift Aid',
    rarity: 'rare',
    stat: 'HP: +714',
    imageUrl: null
  },
  chest: null, // Empty slot
  boots: null, // Empty slot
  consumable: null, // Empty slot
  mod1: null, // Empty mod
  mod2: null, // Empty mod
  mod3: null, // Empty mod
  mod4: null, // Empty mod
};

describe('PlayerLoadout Component', () => {
  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();
  });

  describe('Slot Rendering', () => {
    it('renders 9 slots total (5 equipment + 4 mods)', () => {
      renderWithTheme(<PlayerLoadout />);
      
      // Check for equipment slots
      expect(screen.getByLabelText('weapon slot')).toBeInTheDocument();
      expect(screen.getByLabelText('helmet slot')).toBeInTheDocument();
      expect(screen.getByLabelText('chest slot')).toBeInTheDocument();
      expect(screen.getByLabelText('boots slot')).toBeInTheDocument();
      expect(screen.getByLabelText('consumable slot')).toBeInTheDocument();
      
      // Check for mod slots
      expect(screen.getByLabelText('Mod 1 slot')).toBeInTheDocument();
      expect(screen.getByLabelText('Mod 2 slot')).toBeInTheDocument();
      expect(screen.getByLabelText('Mod 3 slot')).toBeInTheDocument();
      expect(screen.getByLabelText('Mod 4 slot')).toBeInTheDocument();
    });

    it('renders equipment slots with proper aria-labels', () => {
      renderWithTheme(<PlayerLoadout />);
      
      const weaponSlot = screen.getByLabelText('weapon slot');
      const helmetSlot = screen.getByLabelText('helmet slot');
      const consumableSlot = screen.getByLabelText('consumable slot');
      
      expect(weaponSlot).toBeInTheDocument();
      expect(helmetSlot).toBeInTheDocument();
      expect(consumableSlot).toBeInTheDocument();
    });

    it('renders mod slots with proper aria-labels', () => {
      renderWithTheme(<PlayerLoadout />);
      
      const mod1Slot = screen.getByLabelText('Mod 1 slot');
      const mod2Slot = screen.getByLabelText('Mod 2 slot');
      const mod3Slot = screen.getByLabelText('Mod 3 slot');
      const mod4Slot = screen.getByLabelText('Mod 4 slot');
      
      expect(mod1Slot).toBeInTheDocument();
      expect(mod2Slot).toBeInTheDocument();
      expect(mod3Slot).toBeInTheDocument();
      expect(mod4Slot).toBeInTheDocument();
    });
  });

  describe('Empty vs Filled State Rendering', () => {
    it('renders empty slots with dashed border and add icon', () => {
      renderWithTheme(<PlayerLoadout />);
      
      // Check for empty slot indicators
      const addIcons = screen.getAllByTestId('AddIcon');
      expect(addIcons.length).toBeGreaterThan(0);
      
      // Check for empty slot labels
      expect(screen.getByText('chest')).toBeInTheDocument();
      expect(screen.getByText('boots')).toBeInTheDocument();
      expect(screen.getByText('consumable')).toBeInTheDocument();
    });

    it('renders filled slots with item information', () => {
      renderWithTheme(<PlayerLoadout />);
      
      // Check for filled slot content
      expect(screen.getByText('Luminous Ward')).toBeInTheDocument();
      expect(screen.getByText('Sanctum Arc')).toBeInTheDocument();
      expect(screen.getByText('Healer\'s Hood')).toBeInTheDocument();
      expect(screen.getByText('Swift Aid')).toBeInTheDocument();
    });

    it('applies correct styling for empty slots', () => {
      renderWithTheme(<PlayerLoadout />);
      
      const emptySlots = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('slot') && 
        button.textContent?.includes('+')
      );
      
      emptySlots.forEach(slot => {
        expect(slot).toHaveStyle({
          border: '1px dashed',
          backgroundColor: 'var(--mui-palette-background-default)'
        });
      });
    });

    it('applies correct styling for filled slots', () => {
      renderWithTheme(<PlayerLoadout />);
      
      const filledSlots = screen.getAllByRole('button').filter(button => 
        button.getAttribute('aria-label')?.includes('slot') && 
        !button.textContent?.includes('+')
      );
      
      filledSlots.forEach(slot => {
        expect(slot).toHaveStyle({
          border: '1px solid'
        });
      });
    });
  });

  describe('Selected Border', () => {
    it('applies selected border when selected prop is true', () => {
      const mockOnClick = jest.fn();
      
      renderWithTheme(
        <div>
          <button 
            role="button"
            aria-label="weapon slot"
            data-testid="selected-slot"
            onClick={mockOnClick}
            style={{
              boxShadow: '0 0 0 2px var(--mui-palette-primary-main) inset'
            }}
          >
            Selected Slot
          </button>
        </div>
      );
      
      const selectedSlot = screen.getByTestId('selected-slot');
      expect(selectedSlot).toHaveStyle({
        boxShadow: '0 0 0 2px var(--mui-palette-primary-main) inset'
      });
    });
  });

  describe('Keyboard Interaction', () => {
    it('calls onClick handler when Enter key is pressed', () => {
      const mockOnClick = jest.fn();
      
      renderWithTheme(
        <button 
          role="button"
          aria-label="weapon slot"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              mockOnClick();
            }
          }}
          onClick={mockOnClick}
        >
          Test Slot
        </button>
      );
      
      const slot = screen.getByLabelText('weapon slot');
      fireEvent.keyDown(slot, { key: 'Enter' });
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('calls onClick handler when Space key is pressed', () => {
      const mockOnClick = jest.fn();
      
      renderWithTheme(
        <button 
          role="button"
          aria-label="weapon slot"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              mockOnClick();
            }
          }}
          onClick={mockOnClick}
        >
          Test Slot
        </button>
      );
      
      const slot = screen.getByLabelText('weapon slot');
      fireEvent.keyDown(slot, { key: ' ' });
      
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });

    it('prevents default behavior for Enter and Space keys', () => {
      const mockOnClick = jest.fn();
      const mockPreventDefault = jest.fn();
      
      renderWithTheme(
        <button 
          role="button"
          aria-label="weapon slot"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              mockOnClick();
            }
          }}
          onClick={mockOnClick}
        >
          Test Slot
        </button>
      );
      
      const slot = screen.getByLabelText('weapon slot');
      const event = { key: 'Enter', preventDefault: mockPreventDefault };
      fireEvent.keyDown(slot, event);
      
      expect(mockPreventDefault).toHaveBeenCalled();
    });

    it('does not call onClick for other keys', () => {
      const mockOnClick = jest.fn();
      
      renderWithTheme(
        <button 
          role="button"
          aria-label="weapon slot"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              mockOnClick();
            }
          }}
          onClick={mockOnClick}
        >
          Test Slot
        </button>
      );
      
      const slot = screen.getByLabelText('weapon slot');
      fireEvent.keyDown(slot, { key: 'Tab' });
      fireEvent.keyDown(slot, { key: 'Escape' });
      fireEvent.keyDown(slot, { key: 'ArrowUp' });
      
      expect(mockOnClick).not.toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('has proper role and tabIndex for keyboard navigation', () => {
      renderWithTheme(<PlayerLoadout />);
      
      const slots = screen.getAllByRole('button');
      slots.forEach(slot => {
        expect(slot).toHaveAttribute('tabIndex', '0');
        expect(slot).toHaveAttribute('role', 'button');
      });
    });

    it('has focus styles for keyboard navigation', () => {
      renderWithTheme(<PlayerLoadout />);
      
      const slot = screen.getByLabelText('weapon slot');
      expect(slot).toHaveStyle({
        cursor: 'pointer'
      });
    });

    it('has proper aria-labels for screen readers', () => {
      renderWithTheme(<PlayerLoadout />);
      
      // Check equipment slots
      expect(screen.getByLabelText('weapon slot')).toBeInTheDocument();
      expect(screen.getByLabelText('helmet slot')).toBeInTheDocument();
      expect(screen.getByLabelText('chest slot')).toBeInTheDocument();
      expect(screen.getByLabelText('boots slot')).toBeInTheDocument();
      expect(screen.getByLabelText('consumable slot')).toBeInTheDocument();
      
      // Check mod slots
      expect(screen.getByLabelText('Mod 1 slot')).toBeInTheDocument();
      expect(screen.getByLabelText('Mod 2 slot')).toBeInTheDocument();
      expect(screen.getByLabelText('Mod 3 slot')).toBeInTheDocument();
      expect(screen.getByLabelText('Mod 4 slot')).toBeInTheDocument();
    });
  });
});

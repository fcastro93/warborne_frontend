import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Stack,
  Tooltip,
} from '@mui/material';
import Layout from './Layout';
import { apiService } from '../services/api';
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  People as PeopleIcon,
  Event as EventIcon,
  Build as BuildIcon,
  Timeline as TimelineIcon,
  Assessment as AssessmentIcon,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';

// Sample data for widgets (removed - using real data now)
const sampleData = {};

// Widget components
const MetricWidget = ({ title, value, change, trend, period, chartData, onSettings, onToggle }) => {
  const formatValue = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  const getChangeColor = () => {
    if (trend === 'up') return '#4caf50';
    if (trend === 'down') return '#f44336';
    return '#9e9e9e';
  };

  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    if (trend === 'down') return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    return null;
  };

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton size="small" onClick={onSettings}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={onToggle ? "Hide widget" : "Show widget"}>
              <IconButton size="small" onClick={onToggle}>
                {onToggle ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {formatValue(value)}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <Chip
            label={`${change > 0 ? '+' : ''}${change}%`}
            size="small"
            sx={{
              backgroundColor: getChangeColor(),
              color: 'white',
              fontWeight: 'bold'
            }}
            icon={getTrendIcon()}
          />
          <Typography variant="body2" color="text.secondary">
            {period}
          </Typography>
        </Box>
        
        {/* Simple chart representation */}
        <Box sx={{ height: 60, display: 'flex', alignItems: 'end', gap: 0.5 }}>
          {chartData.map((point, index) => {
            const height = (point / Math.max(...chartData)) * 60;
            return (
              <Box
                key={index}
                sx={{
                  width: 8,
                  height: height,
                  backgroundColor: getChangeColor(),
                  borderRadius: '2px 2px 0 0',
                  opacity: 0.7
                }}
              />
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

const ChartWidget = ({ title, value, change, period, onSettings, onToggle }) => {
  const formatValue = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
    return val.toString();
  };

  const getChangeColor = () => {
    if (change > 0) return '#4caf50';
    if (change < 0) return '#f44336';
    return '#9e9e9e';
  };

  const getTrendIcon = () => {
    if (change > 0) return <TrendingUpIcon sx={{ fontSize: 16 }} />;
    if (change < 0) return <TrendingDownIcon sx={{ fontSize: 16 }} />;
    return null;
  };

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton size="small" onClick={onSettings}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={onToggle ? "Hide widget" : "Show widget"}>
              <IconButton size="small" onClick={onToggle}>
                {onToggle ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
          {formatValue(value)}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <Chip
            label={`${change > 0 ? '+' : ''}${change}%`}
            size="small"
            sx={{
              backgroundColor: getChangeColor(),
              color: 'white',
              fontWeight: 'bold'
            }}
            icon={getTrendIcon()}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {period}
        </Typography>
        
        {/* Placeholder for chart */}
        <Box sx={{ 
          height: 200, 
          backgroundColor: 'grey.100', 
          borderRadius: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          border: '2px dashed',
          borderColor: 'grey.300'
        }}>
          <Typography variant="body2" color="text.secondary">
            Chart visualization will be implemented here
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

const GearPowerAnalyticsWidget = ({ onSettings, onToggle, data, loading }) => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await apiService.getGearPowerAnalytics();
        if (response.analytics) {
          // Flatten the data to show each loadout as a separate entry
          const flatData = [];
          response.analytics.forEach(player => {
            player.loadouts.forEach(loadout => {
              flatData.push({
                label: `${player.player_name} - ${loadout.drifter_name}`,
                value: loadout.gear_power,
                playerName: player.player_name,
                drifterName: loadout.drifter_name,
                equippedCount: loadout.equipped_count
              });
            });
          });
          
          // Sort by gear power descending
          flatData.sort((a, b) => b.value - a.value);
          setAnalyticsData(flatData);
        }
      } catch (error) {
        console.error('Error fetching gear power analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const maxPower = analyticsData.length > 0 ? Math.max(...analyticsData.map(item => item.value)) : 0;
  const totalLoadouts = analyticsData.length;
  const avgPower = analyticsData.length > 0 ? Math.round(analyticsData.reduce((sum, item) => sum + item.value, 0) / analyticsData.length) : 0;

  return (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            Player Gear Power
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Settings">
              <IconButton size="small" onClick={onSettings}>
                <SettingsIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title={onToggle ? "Hide widget" : "Show widget"}>
              <IconButton size="small" onClick={onToggle}>
                {onToggle ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              {totalLoadouts}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Loadouts
            </Typography>
          </Box>
          <Box>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: 'success.main' }}>
              {avgPower}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Avg Power
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Gear power by player loadout (weapon, helmet, chest, boots, off-hand)
        </Typography>
        
        {/* Bar Chart */}
        <Box sx={{ height: 300, overflow: 'auto' }}>
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="body2" color="text.secondary">Loading...</Typography>
            </Box>
          ) : analyticsData.length === 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
              <Typography variant="body2" color="text.secondary">No loadout data available</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {analyticsData.slice(0, 20).map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ minWidth: 120, fontSize: '0.75rem' }}>
                    {item.label}
                  </Typography>
                  <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: `${maxPower > 0 ? (item.value / maxPower) * 100 : 0}%`,
                        height: 20,
                        backgroundColor: index < 5 ? '#4caf50' : index < 10 ? '#ff9800' : '#2196f3',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        paddingRight: 1
                      }}
                    >
                      <Typography variant="caption" sx={{ color: 'white', fontWeight: 'bold' }}>
                        {item.value}
                      </Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ minWidth: 30 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
              ))}
              {analyticsData.length > 20 && (
                <Typography variant="caption" color="text.secondary" sx={{ textAlign: 'center', mt: 1 }}>
                  Showing top 20 loadouts (of {analyticsData.length} total)
                </Typography>
              )}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

// Default widget configuration
const defaultWidgets = [
  { id: 'gearPowerAnalytics', type: 'gearPower', title: 'Player Gear Power', visible: true, size: { xs: 12, md: 12 } },
];

export default function Analytics() {
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [settingsMenu, setSettingsMenu] = useState({ anchorEl: null, widgetId: null });
  const [settingsDialog, setSettingsDialog] = useState({ open: false, widgetId: null });
  const [customizeDialog, setCustomizeDialog] = useState(false);

  // Load saved widget configuration from localStorage, but ensure new widgets are included
  useEffect(() => {
    const savedWidgets = localStorage.getItem('analytics-widgets');
    if (savedWidgets) {
      const parsedWidgets = JSON.parse(savedWidgets);
      // Check if gearPowerAnalytics widget exists in saved config
      const hasGearPowerWidget = parsedWidgets.some(widget => widget.id === 'gearPowerAnalytics');
      if (!hasGearPowerWidget) {
        // Add the new widget to saved configuration
        parsedWidgets.push({ id: 'gearPowerAnalytics', type: 'gearPower', title: 'Player Gear Power', visible: true, size: { xs: 12, md: 8 } });
        localStorage.setItem('analytics-widgets', JSON.stringify(parsedWidgets));
      }
      setWidgets(parsedWidgets);
    } else {
      // No saved config, use default widgets
      setWidgets(defaultWidgets);
    }
  }, []);

  // Save widget configuration to localStorage
  const saveWidgets = (newWidgets) => {
    setWidgets(newWidgets);
    localStorage.setItem('analytics-widgets', JSON.stringify(newWidgets));
  };

  // Toggle widget visibility
  const toggleWidgetVisibility = (widgetId) => {
    const newWidgets = widgets.map(widget =>
      widget.id === widgetId ? { ...widget, visible: !widget.visible } : widget
    );
    saveWidgets(newWidgets);
  };

  // Open settings menu
  const handleSettingsClick = (event, widgetId) => {
    setSettingsMenu({ anchorEl: event.currentTarget, widgetId });
  };

  // Close settings menu
  const handleSettingsClose = () => {
    setSettingsMenu({ anchorEl: null, widgetId: null });
  };

  // Open settings dialog
  const handleSettingsDialogOpen = () => {
    setSettingsDialog({ open: true, widgetId: settingsMenu.widgetId });
    handleSettingsClose();
  };

  // Close settings dialog
  const handleSettingsDialogClose = () => {
    setSettingsDialog({ open: false, widgetId: null });
  };

  // Render widget based on type
  const renderWidget = (widget) => {
    const data = sampleData[widget.id];
    
    switch (widget.type) {
      case 'metric':
        return (
          <MetricWidget
            title={widget.title}
            value={data?.total || 0}
            change={data?.change || 0}
            trend={data?.trend || 'neutral'}
            period={data?.period || ''}
            chartData={data?.chartData || []}
            onSettings={(e) => handleSettingsClick(e, widget.id)}
            onToggle={() => toggleWidgetVisibility(widget.id)}
          />
        );
      case 'chart':
        return (
          <ChartWidget
            title={widget.title}
            value={data?.total || 0}
            change={data?.change || 0}
            period={data?.period || ''}
            onSettings={(e) => handleSettingsClick(e, widget.id)}
            onToggle={() => toggleWidgetVisibility(widget.id)}
          />
        );
      case 'gearPower':
        return (
          <GearPowerAnalyticsWidget
            onSettings={(e) => handleSettingsClick(e, widget.id)}
            onToggle={() => toggleWidgetVisibility(widget.id)}
          />
        );
      case 'action':
        return (
          <Card sx={{ height: '100%', position: 'relative' }}>
            <CardContent sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {widget.title}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Tooltip title="Settings">
                    <IconButton size="small" onClick={(e) => handleSettingsClick(e, widget.id)}>
                      <SettingsIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={widget.visible ? "Hide widget" : "Show widget"}>
                    <IconButton size="small" onClick={() => toggleWidgetVisibility(widget.id)}>
                      {widget.visible ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Uncover performance and visitor insights with our data wizardry.
              </Typography>
              <Button variant="contained" size="large">
                Get insights
              </Button>
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  // Get widget icon
  const getWidgetIcon = (widgetId) => {
    const iconMap = {
      users: <PeopleIcon />,
      conversions: <AssessmentIcon />,
      eventCount: <EventIcon />,
      exploreData: <BuildIcon />,
      gearPowerAnalytics: <ShieldIcon />,
      sessions: <TimelineIcon />,
      pageViews: <BarChartIcon />,
    };
    return iconMap[widgetId] || <AssessmentIcon />;
  };

  return (
    <Layout>
      <Box sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            Analytics
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                localStorage.removeItem('analytics-widgets');
                setWidgets(defaultWidgets);
              }}
            >
              Reset Dashboard
            </Button>
            <Button
              variant="outlined"
              onClick={() => setCustomizeDialog(true)}
            >
              Customize Dashboard
            </Button>
          </Box>
        </Box>

        {/* Breadcrumbs */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary">
            Analytics {'>'} Overview
          </Typography>
        </Box>

        {/* Widgets Grid */}
        <Grid container spacing={3}>
          {widgets
            .filter(widget => widget.visible)
            .map((widget) => (
              <Grid key={widget.id} item {...widget.size}>
                {renderWidget(widget)}
              </Grid>
            ))}
        </Grid>

      {/* Settings Menu */}
      <Menu
        anchorEl={settingsMenu.anchorEl}
        open={Boolean(settingsMenu.anchorEl)}
        onClose={handleSettingsClose}
      >
        <MenuItem onClick={handleSettingsDialogOpen}>
          <SettingsIcon sx={{ mr: 1 }} />
          Widget Settings
        </MenuItem>
        <MenuItem onClick={() => {
          toggleWidgetVisibility(settingsMenu.widgetId);
          handleSettingsClose();
        }}>
          {widgets.find(w => w.id === settingsMenu.widgetId)?.visible ? 
            <VisibilityOffIcon sx={{ mr: 1 }} /> : 
            <VisibilityIcon sx={{ mr: 1 }} />
          }
          {widgets.find(w => w.id === settingsMenu.widgetId)?.visible ? 'Hide' : 'Show'} Widget
        </MenuItem>
      </Menu>

      {/* Widget Settings Dialog */}
      <Dialog open={settingsDialog.open} onClose={handleSettingsDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Widget Settings</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Widget settings for: {widgets.find(w => w.id === settingsDialog.widgetId)?.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Advanced settings will be implemented here.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSettingsDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Customize Dashboard Dialog */}
      <Dialog open={customizeDialog} onClose={() => setCustomizeDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Customize Dashboard</DialogTitle>
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Show/Hide Widgets
          </Typography>
          <List>
            {widgets.map((widget) => (
              <ListItem key={widget.id} divider>
                <ListItemIcon>
                  {getWidgetIcon(widget.id)}
                </ListItemIcon>
                <ListItemText
                  primary={widget.title}
                  secondary={`${widget.type.charAt(0).toUpperCase() + widget.type.slice(1)} widget`}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={widget.visible}
                      onChange={() => toggleWidgetVisibility(widget.id)}
                    />
                  }
                  label=""
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomizeDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Layout>
  );
}
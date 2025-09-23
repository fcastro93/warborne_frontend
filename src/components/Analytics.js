import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Avatar,
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
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Tooltip,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DragIndicator as DragIndicatorIcon,
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
} from '@mui/icons-material';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Sample data for widgets (will be replaced with real data later)
const sampleData = {
  users: {
    total: 14250,
    change: 25,
    trend: 'up',
    period: 'Last 30 days',
    chartData: [12000, 12500, 13000, 13500, 14000, 14250]
  },
  conversions: {
    total: 325,
    change: -25,
    trend: 'down',
    period: 'Last 30 days',
    chartData: [400, 380, 360, 340, 330, 325]
  },
  eventCount: {
    total: 200000,
    change: 5,
    trend: 'up',
    period: 'Last 30 days',
    chartData: [190000, 192000, 195000, 198000, 199000, 200000]
  },
  sessions: {
    total: 13277,
    change: 35,
    trend: 'up',
    period: 'Sessions per day for the last 30 days',
    chartData: [8000, 9000, 10000, 11000, 12000, 13277]
  }
};

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

// Default widget configuration
const defaultWidgets = [
  { id: 'users', type: 'metric', title: 'Users', visible: true, size: { xs: 12, sm: 6, md: 3 } },
  { id: 'conversions', type: 'metric', title: 'Conversions', visible: true, size: { xs: 12, sm: 6, md: 3 } },
  { id: 'eventCount', type: 'metric', title: 'Event count', visible: true, size: { xs: 12, sm: 6, md: 3 } },
  { id: 'exploreData', type: 'action', title: 'Explore your data', visible: true, size: { xs: 12, sm: 6, md: 3 } },
  { id: 'sessions', type: 'chart', title: 'Sessions', visible: true, size: { xs: 12, md: 6 } },
  { id: 'pageViews', type: 'chart', title: 'Page views and downloads', visible: true, size: { xs: 12, md: 6 } },
];

export default function Analytics() {
  const [widgets, setWidgets] = useState(defaultWidgets);
  const [settingsMenu, setSettingsMenu] = useState({ anchorEl: null, widgetId: null });
  const [settingsDialog, setSettingsDialog] = useState({ open: false, widgetId: null });
  const [customizeDialog, setCustomizeDialog] = useState(false);

  // Load saved widget configuration from localStorage
  useEffect(() => {
    const savedWidgets = localStorage.getItem('analytics-widgets');
    if (savedWidgets) {
      setWidgets(JSON.parse(savedWidgets));
    }
  }, []);

  // Save widget configuration to localStorage
  const saveWidgets = (newWidgets) => {
    setWidgets(newWidgets);
    localStorage.setItem('analytics-widgets', JSON.stringify(newWidgets));
  };

  // Handle drag and drop
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const newWidgets = Array.from(widgets);
    const [reorderedItem] = newWidgets.splice(result.source.index, 1);
    newWidgets.splice(result.destination.index, 0, reorderedItem);

    saveWidgets(newWidgets);
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
      sessions: <TimelineIcon />,
      pageViews: <BarChartIcon />,
    };
    return iconMap[widgetId] || <AssessmentIcon />;
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Analytics
        </Typography>
        <Button
          variant="outlined"
          startIcon={<DragIndicatorIcon />}
          onClick={() => setCustomizeDialog(true)}
        >
          Customize Dashboard
        </Button>
      </Box>

      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="body2" color="text.secondary">
          Analytics {'>'} Overview
        </Typography>
      </Box>

      {/* Widgets Grid */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="widgets">
          {(provided) => (
            <Grid container spacing={3} {...provided.droppableProps} ref={provided.innerRef}>
              {widgets
                .filter(widget => widget.visible)
                .map((widget, index) => (
                  <Draggable key={widget.id} draggableId={widget.id} index={index}>
                    {(provided, snapshot) => (
                      <Grid
                        item
                        {...widget.size}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{
                          opacity: snapshot.isDragging ? 0.8 : 1,
                          transform: snapshot.isDragging ? 'rotate(5deg)' : 'none',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {renderWidget(widget)}
                      </Grid>
                    )}
                  </Draggable>
                ))}
              {provided.placeholder}
            </Grid>
          )}
        </Droppable>
      </DragDropContext>

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
  );
}

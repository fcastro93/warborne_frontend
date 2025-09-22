import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

const treeData = [
  {
    id: '1',
    label: 'Website',
    children: [
      { id: '2', label: 'Home' },
      { id: '3', label: 'Pricing' },
      { id: '4', label: 'About us' },
      { id: '5', label: 'Blog' },
    ],
  },
  { id: '6', label: 'Store' },
  { id: '7', label: 'Contact' },
  { id: '8', label: 'Help' },
];

export default function CustomizedTreeView() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Product tree
        </Typography>
        <SimpleTreeView
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
          items={treeData}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        />
      </CardContent>
    </Card>
  );
}

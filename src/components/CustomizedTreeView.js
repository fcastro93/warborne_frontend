import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { TreeView, TreeItem } from '@mui/x-tree-view';
import { ExpandMore, ChevronRight } from '@mui/icons-material';

export default function CustomizedTreeView() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Product tree
        </Typography>
        <TreeView
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
          sx={{ height: 240, flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
        >
          <TreeItem nodeId="1" label="Website">
            <TreeItem nodeId="2" label="Home" />
            <TreeItem nodeId="3" label="Pricing" />
            <TreeItem nodeId="4" label="About us" />
            <TreeItem nodeId="5" label="Blog" />
          </TreeItem>
          <TreeItem nodeId="6" label="Store" />
          <TreeItem nodeId="7" label="Contact" />
          <TreeItem nodeId="8" label="Help" />
        </TreeView>
      </CardContent>
    </Card>
  );
}

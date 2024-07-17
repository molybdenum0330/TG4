import React from 'react';
import { List, ListItem, ListItemText } from '@mui/material';
import { Result } from '../types/types';


interface ResultListProps {
  results: Result[];
  onResultClick: (result: Result) => void;
}

const ResultList: React.FC<ResultListProps> = ({ results, onResultClick }) => {
  return (
    <List>
      {results.map(result => (
        <ListItem button key={result.id} onClick={() => onResultClick(result)}>
          <ListItemText primary={result.name} />
        </ListItem>
      ))}
    </List>
  );
};

export default ResultList;


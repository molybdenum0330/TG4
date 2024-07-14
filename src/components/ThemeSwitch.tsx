import React from 'react';
import { IconButton, Switch } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

interface ThemeSwitchProps {
  darkMode: boolean;
  handleThemeChange: () => void;
}

const ThemeSwitch = ({ darkMode, handleThemeChange }: ThemeSwitchProps) => {
  return (
    <>
        <IconButton edge="end" color="inherit" aria-label="light mode">
            <LightModeIcon />
        </IconButton>
        <Switch checked={darkMode} onChange={handleThemeChange} />
        <IconButton edge="start" color="inherit" aria-label="dark mode">
            <DarkModeIcon />
        </IconButton>
    </>
  );
};

export default ThemeSwitch;
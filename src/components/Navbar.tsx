import { AppBar, Box, Toolbar, Typography } from '@mui/material';

const NavBar = () => {
  return (
    <Box>
      <AppBar position="static">
        <Toolbar sx={{ height: '100px' }}>
          <Typography variant="h5" sx={{ ml: 6 }}>
            RAMS
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default NavBar;

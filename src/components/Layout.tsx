import { Box } from '@mui/material';
import NavBar from './Navbar';

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <Box>
      <NavBar />
      <Box mt={2} px={2}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;

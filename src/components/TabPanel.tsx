import { Box } from '@mui/material';

interface Props {
  children: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: Props) => {
  if (value !== index) {
    return null;
  }

  return (
    <Box sx={{ p: 6 }}>
      <Box>{children}</Box>
    </Box>
  );
};

export default TabPanel;

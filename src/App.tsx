import { Box, Tab, Tabs } from '@mui/material';
import NavBar from './components/Navbar';
import { useState } from 'react';
import TabPanel from './components/TabPanel';
import FactoryInformationManagement from './views/FactoryInformationManagement';
import PersonnelInformationManagement from './views/PersonnelInformationManagement';
import ReservationsManagement from './views/ReservationsManagement';

const TABS = {
  FACTORY_INFORMATION: 0,
  PERSONNEL_INFORMATION: 1,
  RESERVATION_MANAGEMENT: 2,
};

function App() {
  const [tabValue, setTabValue] = useState(0);

  return (
    <Box sx={{ height: '100vh' }}>
      <NavBar />
      <Box mt={2} px={2}>
        <Tabs
          value={tabValue}
          onChange={(_, val) => setTabValue(val)}
          sx={{ px: 6 }}
        >
          <Tab label="Factory Information" value={0} />
          <Tab label="Personnel Information" value={1} />
          <Tab label="Reservation Management" value={2} />
        </Tabs>
        <TabPanel value={tabValue} index={TABS.FACTORY_INFORMATION}>
          <FactoryInformationManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={TABS.PERSONNEL_INFORMATION}>
          <PersonnelInformationManagement />
        </TabPanel>
        <TabPanel value={tabValue} index={TABS.RESERVATION_MANAGEMENT}>
          <ReservationsManagement />
        </TabPanel>
      </Box>
    </Box>
  );
}

export default App;

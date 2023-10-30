import { StrictMode } from "react";
import "./App.css";
import styled from "styled-components";
import "@twa-dev/sdk";
import DemoPage from "./pages/DemoPage";
import DriveDashboard from "./pages/DriveDashboard";

const StyledApp = styled.div`
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
`;

function App() {
  return (
    <StrictMode>
      <StyledApp>
        <AppContainer>
          <DriveDashboard />
        </AppContainer>
      </StyledApp>
    </StrictMode>
  );
}

export default App;

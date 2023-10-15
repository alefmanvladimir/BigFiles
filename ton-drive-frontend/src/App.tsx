import { StrictMode } from "react";
import "./App.css";
import styled from "styled-components";
import "@twa-dev/sdk";
import DemoPage from "./pages/DemoPage";
import FilesListPage from "./pages/FilesListPage";

const StyledApp = styled.div`
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  return (
    <StrictMode>
      <StyledApp>
        <AppContainer>
          <FilesListPage />
        </AppContainer>
      </StyledApp>
    </StrictMode>
  );
}

export default App;

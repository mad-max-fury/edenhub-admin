import { ReduxProvider } from "./redux";
import RouterProviderWrapper from "./router";

function App() {
  return (
    <main>
      <ReduxProvider>
        <RouterProviderWrapper />
      </ReduxProvider>
    </main>
  );
}

export default App;

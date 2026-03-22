import NotificationContainer from "./components/notifications/notificationContainer";
import { ReduxProvider } from "./redux";
import RouterProviderWrapper from "./router";

function App() {
  return (
    <main>
      <ReduxProvider>
        <RouterProviderWrapper />
        <NotificationContainer />
      </ReduxProvider>
    </main>
  );
}

export default App;

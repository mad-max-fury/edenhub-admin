import { APIProvider } from "@vis.gl/react-google-maps";
import NotificationContainer from "./components/notifications/notificationContainer";
import { ReduxProvider } from "./redux";
import RouterProviderWrapper from "./router";

const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || "";

function App() {
  return (
    <main>
      <APIProvider apiKey={GOOGLE_MAPS_KEY}>
        <ReduxProvider>
          <RouterProviderWrapper />
          <NotificationContainer />
        </ReduxProvider>
      </APIProvider>
    </main>
  );
}

export default App;

import Provider from "./provider";
import Client from "./components/client";

export default function Home() {
  return (
    <Provider>
      <Client />
    </Provider>
  );
}

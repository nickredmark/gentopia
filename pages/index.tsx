import dynamic from "next/dynamic";

import { Sidebar } from "../components/sidebar";

const Itowns = dynamic(() => import("../components/map/others/itowns"), {
  ssr: false,
});

const ItownsPage = () => {
  return (
    <div className="h-full w-full flex items-stretch justify-between">
      <div className="flex-grow overflow-hidden relative flex items-stretch">
        <Itowns />
      </div>
      <Sidebar />
    </div>
  );
};

export default ItownsPage;

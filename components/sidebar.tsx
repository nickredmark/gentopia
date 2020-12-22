import { useRouterState } from "../hooks/router";
import { FC } from "react";

const Button = ({ active, ...props }) => (
  <button
    className={`block cursor-pointer rounded-lg p-2 mb-3 w-full text-white ${
      active ? "bg-blue-400" : "bg-blue-600"
    }`}
    {...props}
  />
);

export const Sidebar: FC = () => {
  const [{ area }, updateQuery] = useRouterState({});

  return (
    <div className="flex-none flex p-4">
      <div>
        <Button
          active={area?.startsWith("ecoregions-")}
          onClick={() => {
            updateQuery({
              area: "ecoregions-world",
            });
          }}
        >
          Ecoregions
        </Button>
        <Button
          active={area?.startsWith("basins-")}
          onClick={() => {
            updateQuery({
              area: "basins-world",
            });
          }}
        >
          River basins
        </Button>
        <Button
          active={area?.startsWith("admin-")}
          onClick={() => {
            updateQuery({
              area: "admin-world",
            });
          }}
        >
          Administrative areas
        </Button>
      </div>
    </div>
  );
};

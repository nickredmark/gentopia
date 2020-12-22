import { useEffect, useState } from "react";
import { useRouterState } from "./router";

export const useArea = () => {
  const [{ area }, updateQuery] = useRouterState({});
  const [layers, setLayers] = useState<any>({});
  const [areaToLoad, setAreaToLoad] = useState<string>();

  useEffect(() => {
    if (!(area in layers)) {
      setAreaToLoad(area);
    }
  }, [area, layers]);

  useEffect(() => {
    (async () => {
      if (areaToLoad) {
        if (!layers[areaToLoad]) {
          const [mode, id] = areaToLoad.split("-");
          let path;
          switch (mode) {
            case "admin":
              path =
                id === "world"
                  ? ""
                  : `/${id.replace("_1", "").replace(/\./g, "/")}`;
              break;
            case "basins":
              path = id === "world" ? "" : `${id.replace(/(?=.)/g, "/")}`;
              break;
            case "ecoregions":
              path = id === "world" ? "" : `/${id.replace(/\./g, "/")}`;
              break;
          }

          let layer;
          try {
            layer = await (
              await fetch(
                `${process.env.NEXT_PUBLIC_WORLD_URL}/${mode}-geojson/data${path}/${id}.json`
              )
            ).json();
          } catch (e) {
            if (mode !== "basins") {
              throw e;
            }

            const parentId = id.slice(0, -1).replace(/0+$/, "");
            const parentPath = `${parentId.replace(/(?=.)/g, "/")}`;

            layer = await (
              await fetch(
                `${process.env.NEXT_PUBLIC_WORLD_URL}/${mode}-geojson/data${parentPath}/${parentId}.json`
              )
            ).json();
            layer = layer.features.find(
              (f) => `${f.properties.PFAF_ID}` === id
            );
          }
          layer.features = layer.features.filter((feature) => feature.geometry);
          setLayers((layers) => ({
            ...layers,
            [areaToLoad]: layer,
          }));
        }
        if (area !== areaToLoad) {
          updateQuery({
            area: areaToLoad,
          });
        }
      }
    })();
  }, [areaToLoad]);

  return [area, layers[area], setAreaToLoad];
};

import { useEffect, useMemo, useRef, useState } from "react";
import { useArea } from "../../../hooks/area";

const itowns = require("itowns");

const Itowns = () => {
  const [areaName, area, setAreaToLoad] = useArea();

  const viewerDiv = useRef<HTMLDivElement>();

  const [view, setView] = useState<any>();

  useEffect(() => {
    if (view) {
      return;
    }

    const newView = new itowns.GlobeView(viewerDiv.current, {
      coord: new itowns.Coordinates("EPSG:4326", 2.351323, 48.856712),
      range: 25000000,
    });

    // var orthoSource = new itowns.WMTSSource({
    //   // url: `https://wxs.ign.fr/${process.env.NEXT_PUBLIC_IGN_KEY}/geoportail/wmts`,
    //   url: `/api/wmts`,
    //   crs: "EPSG:3857",
    //   name: "ORTHOIMAGERY.ORTHOPHOTOS",
    //   tileMatrixSet: "PM",
    //   format: "image/jpeg",
    // });

    const imagerySource = new itowns.TMSSource({
      url:
        "https://api.mapbox.com/v4/mapbox.satellite/${z}/${x}/${y}.jpg?access_token=" +
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
      // url: "/api/mapbox?path=/v4/mapbox.satellite/${z}/${x}/${y}.jpg",
      crs: "EPSG:3857",
    });

    const imageryLayer = new itowns.ColorLayer("Ortho", {
      source: imagerySource,
    });

    newView.addLayer(imageryLayer);

    const elevationSource = new itowns.WMTSSource({
      url: `https://wxs.ign.fr/${process.env.NEXT_PUBLIC_IGN_KEY}/geoportail/wmts`,
      // url: `/api/wmts`,
      crs: "EPSG:4326",
      name: "ELEVATION.ELEVATIONGRIDCOVERAGE.SRTM3",
      tileMatrixSet: "WGS84G",
      format: "image/x-bil;bits=32",
      zoom: { min: 3, max: 10 },
    });

    // does not work
    // const elevationSource = new itowns.TMSSource({
    //   url:
    //     "https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}/${y}.pngraw?access_token=" +
    //     process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    //   crs: "EPSG:4326",
    // });

    const elevationLayer = new itowns.ElevationLayer("MNT_WORLD", {
      source: elevationSource,
    });

    newView.addLayer(elevationLayer);

    const handleLayersInitialized = () => {
      setView(newView);
      newView.removeEventListener(
        "layers-initialized",
        handleLayersInitialized
      );
    };
    newView.addEventListener("layers-initialized", handleLayersInitialized);
  }, [view]);

  useEffect(() => {
    if (!view || !area || view.getLayerById(areaName)) {
      return;
    }
    (async () => {
      const source = new itowns.FileSource({
        features: await itowns.GeoJsonParser.parse(area, {
          in: {
            crs: "EPSG:4326",
          },
          out: {
            crs: view.tileLayer.extent.crs,
            buildExtent: true,
            mergeFeatures: true,
            withNormal: false,
            withAltitude: false,
          },
        }),
      });
      await source.whenReady;
      const layer = new itowns.ColorLayer(areaName, {
        name: areaName,
        transparent: true,
        source,
        style: new itowns.Style({
          fill: {
            color: "blue",
          },
          stroke: {
            color: "white",
          },
        }),
      });
      view.addLayer(layer);
    })();

    return () => {
      if (view && areaName) {
        view.removeLayer(areaName);
      }
    };
  }, [view, areaName, !!area]);

  return (
    <div
      className="flex-auto cursor-pointer"
      ref={viewerDiv}
      onClick={async (event) => {
        if (!view || !areaName) {
          return;
        }
        const layer = view.getLayerById(areaName);
        if (!layer) {
          return;
        }

        const feature = view.pickFeaturesAt(
          { x: event.clientX, y: event.clientY },
          0
        )[areaName][0]?.geometry;

        /*
        const data = await layer.source.loadData(undefined, {
          crs: view.tileLayer.extent.crs,
        });
        const coord = new Vector2(event.clientX, event.clientY);
        const geoCoord = view.controls.pickGeoPosition(coord);
        const result = itowns.FeaturesUtils.filterFeaturesUnderCoordinate(
          geoCoord,
          data,
          10
        );
        if (!result || !result.length) {
          return;
        }
        */

        if (!feature) {
          return;
        }

        const [mode, currentId] = areaName.split("-");
        let id;
        switch (mode) {
          case "admin":
            const layer =
              currentId === "world"
                ? 0
                : (currentId.match(/\./g) || []).length + 1;
            id = feature.properties[`GID_${layer}`];
            break;
          case "basins":
            id = feature.properties["PFAF_ID"];
            break;
          case "ecoregions":
            id = feature.properties["ID"];
            break;
        }

        if (id) {
          setAreaToLoad(`${mode}-${id}`);
        }
      }}
    />
  );
};

export default Itowns;

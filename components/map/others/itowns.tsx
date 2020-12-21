import { useEffect, useRef } from "react";

const Itowns = () => {
  const viewerDiv = useRef();

  useEffect(() => {
    const itowns = require("itowns");

    const globalExtentTMS = new Map();
    globalExtentTMS.set(
      "EPSG:4326",
      new itowns.Extent("EPSG:4326", -180, 180, -90, 90)
    );
    const extent3857 = globalExtentTMS.get("EPSG:4326").as("EPSG:3857");
    extent3857.clampSouthNorth(extent3857.west, extent3857.east);
    globalExtentTMS.set("EPSG:3857", extent3857);

    var placement = {
      coord: new itowns.Coordinates("EPSG:4326", 2.351323, 48.856712),
      range: 25000000,
    };
    var view = new itowns.GlobeView(viewerDiv.current, placement);

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
      crs: "EPSG:3857",
    });

    const imageryLayer = new itowns.ColorLayer("Ortho", {
      source: imagerySource,
    });

    view.addLayer(imageryLayer);

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
    //     "https://api.mapbox.com/v4/mapbox.terrain-rgb/${z}/${x}$/${y}.pngraw" +
    //     process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    //   crs: "EPSG:3857",
    // });

    const elevationLayer = new itowns.ElevationLayer("MNT_WORLD", {
      source: elevationSource,
    });

    view.addLayer(elevationLayer);
  }, []);
  return <div style={{ height: "100%", overflow: "hidden" }} ref={viewerDiv} />;
};

export default Itowns;

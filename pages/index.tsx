import { useEffect, useRef } from "react";

const Page = () => {
  const viewerDiv = useRef();

  useEffect(() => {
    const itowns = require("itowns");

    var placement = {
      coord: new itowns.Coordinates("EPSG:4326", 2.351323, 48.856712),
      range: 25000000,
    };
    var view = new itowns.GlobeView(viewerDiv.current, placement);

    var orthoSource = new itowns.WMTSSource({
      url: `https://wxs.ign.fr/${process.env.NEXT_PUBLIC_IGN_KEY}/geoportail/wmts`,
      crs: "EPSG:3857",
      name: "ORTHOIMAGERY.ORTHOPHOTOS",
      tileMatrixSet: "PM",
      format: "image/jpeg",
    });

    var orthoLayer = new itowns.ColorLayer("Ortho", {
      source: orthoSource,
    });

    view.addLayer(orthoLayer);

    var elevationSource = new itowns.WMTSSource({
      url: `https://wxs.ign.fr/${process.env.NEXT_PUBLIC_IGN_KEY}/geoportail/wmts`,
      crs: "EPSG:4326",
      name: "ELEVATION.ELEVATIONGRIDCOVERAGE.SRTM3",
      tileMatrixSet: "WGS84G",
      format: "image/x-bil;bits=32",
      zoom: { min: 3, max: 10 },
    });

    var elevationLayer = new itowns.ElevationLayer("MNT_WORLD", {
      source: elevationSource,
    });

    view.addLayer(elevationLayer);

  }, []);
  return <div style={{ height: "100%", overflow: "hidden" }} ref={viewerDiv} />;
};

export default Page;

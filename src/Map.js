
import GoogleMapReact from "google-map-react";



const RED_ICON = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
const BLUE_ICON = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";

function Maps(props) {
  const {allPolygons, allMarkers} = props;
  if (!allPolygons?.length || !allMarkers?.length) {
    return;
  }
  const defaultProps = {
    center: {
      lat: 33.738814834894875,
      lng: -118.28972402268668
    },
    zoom: 11
  };
    return (
      <div style = {{height: "100vh", width: "100%"}}>
        <script type="text/javascript" src="http://maps.google.com/maps/api/js?libraries=geometry&sensor=true_or_false"></script>
        <GoogleMapReact
          bootstrapURLKeys={{ 
            key: "AIzaSyC_TM6mkSt4reTYVB3Z2Z5ywTMDxDaMZc0",
            libraries:['geometry'],
          }}
          defaultCenter={defaultProps.center}
          defaultZoom={defaultProps.zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps, props)}

        >
        </GoogleMapReact>
      </div> 
    ) 
  }

  const handleApiLoaded = (map, maps, props) => {
    const {allPolygons, allMarkers} = props;
    createLegend(map, maps);
    plotChargers(map, allMarkers);
    plotPolygons(map, allPolygons);
  }
  
  function plotChargers(globalMap, allChargers) {
    allChargers.forEach(e => {
      e.setMap(globalMap);
    });
  }

  function plotPolygons(globalMap, allPolygons) {
    
    allPolygons.forEach(polygon => {
      polygon.setMap(globalMap);
    });
  }
  
 
  
  function createLegend(globalMap, maps) {
    const icons = {
      inZone: {
        name: "In Project Area",
        icon: RED_ICON,
      },
      outZone: {
        name: "Outside Project Area",
        icon: BLUE_ICON,
      }, 
    };
    const legend = document.createElement("div");
    legend.classList.add("legend");
    const legendTitle = document.createElement("h3");
    legend.appendChild(legendTitle);
    legendTitle.innerHTML ="Legend";

    for (const key in icons) {
      const type = icons[key];
      const name = type.name;
      const icon = type.icon;
      const div = document.createElement("div");
      div.innerHTML = '<img src="' + icon + '"> ' + name;
      legend.appendChild(div);
    }

    globalMap.controls[maps.ControlPosition.RIGHT_BOTTOM].push(legend);


  }

  
 export default Maps; 

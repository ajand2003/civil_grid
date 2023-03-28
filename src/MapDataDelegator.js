import './App.css';
import Maps from './Map';
import { BrowserRouter } from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';
import ChargerData from './ChargerData';
import Navbar from './Navbar';
import ProjectData from './ProjectData';
import cipData from './cip_projects.json';
import evData from './ev_chargers.json';
import React, { useState } from 'react';
import GoogleMapReact from "google-map-react";


const RED_ICON = "http://maps.google.com/mapfiles/ms/icons/blue-dot.png";
const BLUE_ICON = "http://maps.google.com/mapfiles/ms/icons/red-dot.png";
const loadCipData = () => JSON.parse(JSON.stringify(cipData));
const loadEvData = () => JSON.parse(JSON.stringify(evData));

function MapDataDelegator() {
    const [allPolygons, setAllPolygons] = useState([]);
    const [chargerToPolygons, setChargerToPolygons]  = useState(new Map());
    const [allMarkers, setAllMarkers] = useState([]);
    const defaultProps = {
        center: {
          lat: 33.738814834894875,
          lng: -118.28972402268668
        },
        zoom: 11
    };
    return (
        <div>
            <div>
                <GoogleMapReact
                    bootstrapURLKeys={{ 
                    key: "AIzaSyC_TM6mkSt4reTYVB3Z2Z5ywTMDxDaMZc0",
                    libraries:['geometry'],
                    }}
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
                    yesIWantToUseGoogleMapApiInternals
                    onGoogleApiLoaded={({ map, maps }) => {
                            const {allPolygons, chargerToPolygons, allMarkers}  = handleApiLoaded(map, maps);
                            setAllPolygons(allPolygons);
                            setChargerToPolygons(chargerToPolygons);
                            setAllMarkers(allMarkers);
                        }
                    }   
                >
                </GoogleMapReact>
            </div>
            
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<div><Navbar /><Maps allPolygons={allPolygons} allMarkers={allMarkers} /></div>}> </Route>
                    <Route path = "/ChargerData" element = {<div><Navbar /><ChargerData chargerToPolygons={chargerToPolygons} allMarkers={allMarkers} /></div>}></Route>
                    <Route path = "/ProjectData" element = {<div><Navbar /><ProjectData allPolygons={allPolygons}/></div>}></Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

const handleApiLoaded = (map, maps) => {
    const allPolygons = collectPolygons(loadCipData().features, maps);
    const {chargerToPolygons, allMarkers} = collectChargers(loadEvData().features, allPolygons, maps);
    return {allPolygons, chargerToPolygons, allMarkers}
  }

function collectChargers(features, allPolygons, maps) {
    const allMarkers = [];
    const chargerToPolygons = new Map(); 

    features.forEach(e => {  
      const coordinates = e.geometry.coordinates;
      const LatLng = new maps.LatLng(coordinates[1], coordinates[0]);
      let isInPolygon = false;
      allPolygons.forEach(poly => {
          if(maps.geometry.poly.containsLocation(LatLng, poly)) {
            if (!chargerToPolygons.has(e.id)) {
                chargerToPolygons.set(e.id, []);
            }
            chargerToPolygons.get(e.id).push(poly.title);
            isInPolygon = true;
          }
      });
      const marker = new maps.Marker({
        position: LatLng,
        title: e.id.toString(),
        icon : isInPolygon ? RED_ICON: BLUE_ICON
      });
      allMarkers.push(marker);
    });
    return {chargerToPolygons, allMarkers};
  }

function collectPolygons(features, maps) {
    let allPolygons = [];
    features.forEach(e => {
      if (e.geometry.type === "MultiPolygon") {
        const polygons =  collectMultiCoordinates(e.geometry);
        polygons.forEach(poly => {
          let polygon = createPolygon(poly, "#FF0000", maps, e.id, e.properties);
          allPolygons.push(polygon);
        });

      }
      else {
        const coordinates = collectCoordinates(e.geometry.coordinates);
        let polygon = createPolygon(coordinates, "#FF0000", maps, e.id, e.properties);
        allPolygons.push(polygon);
      }
    })
    return allPolygons;  
  }

  function collectMultiCoordinates(geometry) {
    let polygons = []; 
    geometry.coordinates.forEach(c => {
      polygons.push(collectCoordinates(c));
    });
  
    return polygons;
  }
  
  function collectCoordinates(coordinates) {
    return coordinates[0].map(function(c) {
      return {lat: c[1], lng: c[0]};
    });
  }

  function createPolygon(coordinates, color, maps, id, properties) {
    
    const polygon = new maps.Polygon({
      paths: coordinates,
      strokeColor: color,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: color,
      fillOpacity: 0.35,
      title: id,
      properties: properties
    });

    return polygon;
  }
  export default MapDataDelegator;
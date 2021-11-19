import React from 'react';
import './App.css';


export const App = () => {

  const DG = require('2gis-maps'); 
  let map:any;

  return (
      <div
        id="map"
        ref ={(node) => {
          if (node) {

              map = DG.map('map', {
                'center': [55.76239378474318, 37.85664198038579],
                'zoom': 13,
            });

          };
        }}>
      </div>
      
  );
};
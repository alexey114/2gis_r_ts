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
                'center': [54.98, 82.89],
                'zoom': 13,
                
            });
          };
        }}>
      </div>
      
  );
};
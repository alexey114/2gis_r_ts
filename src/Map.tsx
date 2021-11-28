import React from 'react';
import './Map.css';
import Marker, { IMarker } from './Marker';

const DG = require('2gis-maps');

interface IMap {
    center: [number, number],
    zoom: number
}

export default class Map extends React.Component<IMap> {
    map: any; // DG.map result
    
    render() {
        return (<div id="map"
            ref={(node) => {
                if (node) {
                    if (!this.map) {
                        this.map = DG.map(node, {
                            'center': this.props.center,
                            'zoom': this.props.zoom,
                        });
                    }

                    (this.props.children as any).forEach((child: any) => {
                        if (child.type === Marker) { // т.е. type для компонент - это ф-ия (класс)
                            DG.marker((child.props as IMarker).coords).addTo(this.map);
                        }
                    })
                };
            }}
        />);
    }
}
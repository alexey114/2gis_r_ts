import './Map.css';
import Marker, { IMarker } from './Marker';

const DG = require('2gis-maps');

interface IBaseReact {
    children: any[]    
}

interface IMap extends IBaseReact {
    center: [number, number],
    zoom: number,
}

function Map(props: IMap) {
    let map: any; // DG.map result

    return (<div id="map"
        ref={(node) => {
            if (node) {
                if (!map) {
                    map = DG.map(node, {
                        'center': props.center,
                        'zoom': props.zoom,
                    });
                }

                (props as any).children.forEach((child: any) => {
                    if (child.type === Marker) { // т.е. type для компонент - это ф-ия (класс)
                        DG.marker((child.props as IMarker).coords).addTo(map);
                    }
                })
            };
        }}
    />);
}

export default Map;
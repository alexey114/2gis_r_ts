import React, { useState, useEffect } from 'react';
import './Map.css';

const DG = require('2gis-maps');
interface IBaseReact {
    children: any[]
}
interface IMap extends IBaseReact {
    center: [number, number],
    zoom: number,
}
interface ICoordinateMap {
    lat: number,
    lng: number
}

let map: any; // DG.map result

function Map(props: IMap) {

    let [coordinateToArrayMap, setCoordinateToArrayMap] = useState<ICoordinateMap[]>([])  //ОСНОВНОЙ массив координат
    let [isDownLineMap, setIsDownLineMap] = useState(false)                     //Нажатие на линию
    let [isDownCircleMap, setIsDownCircleMap] = useState(false)                 //Нажатие на круг (замена элемента)


    console.log("finish")

    return (
        <div id="map"

            ref={(node) => {

                if (node) {
                    if (!map) {
                        map = DG.map(node, {
                            'center': props.center,
                            'zoom': props.zoom,
                        });

                        let coordinateMap: any = []
                        

                        map.on('click', function (e: any) {

                            console.log(e.latlng.lat, e.latlng.lng)

                            //Попытка работы со state
                            let coordinateState = [...coordinateToArrayMap]                            
                            coordinateState.push({ lat: e.latlng.lat, lng: e.latlng.lng })
                            setCoordinateToArrayMap(coordinateState)
                            console.log("coordinateState!!!", coordinateState)              //выводит всегда одно значение - последнюю координату
                            console.log("coordinateToArrayMap!!!", coordinateToArrayMap)    //выводит пустой массив

                            //Работает корректно добавляя новую координату в массив
                            coordinateMap.push({ lat: e.latlng.lat, lng: e.latlng.lng })
                            console.log("coordinateMap", coordinateMap)

                            let circle = DG.circle([coordinateMap[coordinateMap.length - 1].lat, coordinateMap[coordinateMap.length - 1].lng], 50, { color: 'red' }).addTo(map);

                            circle.on('mousedown', function (e: any) {
                                setIsDownCircleMap(true)
                                console.log("круг")

                                map.dragging.disable()
                            })

                            if (coordinateMap.length > 1) {
                                let polyline = DG.polyline([[coordinateMap[coordinateMap.length - 2].lat, coordinateMap[coordinateMap.length - 2].lng], [coordinateMap[coordinateMap.length - 1].lat, coordinateMap[coordinateMap.length - 1].lng]], { color: 'blue' }).addTo(map);
                                console.log(polyline)
                                polyline.on('mousedown', function (e: any) {
                                    setIsDownLineMap(true)
                                    console.log("линия")

                                    map.on("mousemove", function (e: any) {

                                        console.log("isDownLineMap", isDownLineMap) //отражает на входе false, хотя состояние меняю непосредственно перед входом на true

                                        if (coordinateMap.length > 1 && isDownLineMap) {
                                        console.log("mousemove", e.latlng.lat, e.latlng.lng)
                                        let newCoordinatePolylineLat = e.latlng.lat - coordinateMap[coordinateMap.length - 1].lat
                                        let newCoordinatePolylineLng = e.latlng.lng - coordinateMap[coordinateMap.length - 1].lng
        
                                        console.log("newCoordinatePolylineLat", newCoordinatePolylineLat)
                                        console.log("newCoordinatePolylineLng", newCoordinatePolylineLng)
        
                                        let newCoordinatePolyline = coordinateMap.map(function (element: ICoordinateMap, index: number) {
                                            console.log("coordinateMa", coordinateMap)
                                            let latMap = coordinateMap[index].lat + newCoordinatePolylineLat
                                            let lngMap = coordinateMap[index].lng + newCoordinatePolylineLng
                                            console.log("latMap", latMap)
                                            console.log("lngMap", lngMap)
                                            return { lat: latMap, lng: lngMap }
                                        })
                                        console.log("newCoordinatePolyline", newCoordinatePolyline)
                                        coordinateMap = newCoordinatePolyline
                                    }
        
                                    })

                                    map.dragging.disable()
                                })

                                polyline.on('mouseup', function (e: any) {

                                    console.log("линия отпущено")
                                })
                            }


                            circle.on('mouseup', function (e: any) {
                                console.log("круг отпущено")
                            })

                            setIsDownLineMap(false)
                            setIsDownCircleMap(false)
                            map.dragging.enable()

                        });

                        //РИСОВАНИЕ ПОЛИГОНОВ - оригинал
                        // function createFigures() {
                        //     coordinatePolygon += coordinateToArray.map(createPolygon).join(" ")

                        //     for (let index = 1; index < coordinateToArray.length; index++) {
                        //         coordinateLine.push(
                        //             <line key={index} onMouseDown={(e) => { downLine(index, e) }} x1={coordinateToArray[index - 1].x} x2={coordinateToArray[index].x} y1={coordinateToArray[index - 1].y} y2={coordinateToArray[index].y} stroke={colorСircuit} fill={colorFillPolygon} strokeWidth="5" />
                        //         )
                        //     }
                        // }
                        // createFigures()

                        // if(coordinateToArrayMap.length>0){
                        // }
                    }

                }
            }}
        >

            <div className='buttonBox'>
                {/* <label>
            Выберите фигуру для рисования:
            <select value={selectFigure} onChange={handleChangeFigure}>
              <option value="line">Линия</option>
              <option value="linePath">Линия сложная</option>
              <option value="polygon">Полигон</option>
            </select>
          </label>
          <br />
  
          <label>
            Выберите фигуру в узлах:
            <br />
            <select value={selectKnot} onChange={handleChangeKnot}>
              <option value="circle">Кружок</option>
              <option value="rect">Квадратик</option>
            </select>
          </label>
          <br /> */}

                {/* <button className="buttonZ" onClick={() => setCloseLinePath()}>{textButtonCloseLinePath}</button> */}
                <br />

                {/* <button className="colorRed" onClick={() => setColor()}>{textButtonColor} </button> */}
                {/* <button className="buttonPolygon" onClick={() => setColorFill()}> {textButtonFillPolygon} </button>
                <br />

                <button className="deleteCircle" onClick={() => delCircleBtn()}> Удалить узел </button>
                <br />

                <button className="save" onClick={() => saveCoordinate()}> Сохранить </button>
                <button className="save" onClick={() => loadCoordinate()}> Загрузить </button>
                <button className="save" onClick={() => buttonRemove()}> Очистить </button> */}
                <br />
            </div>
        </div>
    )
}

export default Map
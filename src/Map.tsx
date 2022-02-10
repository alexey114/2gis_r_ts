import React, { useState, useEffect } from 'react';
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

interface ICoordinate {
    x: number,
    y: number
}
interface ICoordinateMap {
    lat: number,
    lng: number
}

let map: any; // DG.map result

function Map(props: IMap) {

    let refCoordinate:ICoordinateMap[] = []     //ОСНОВНОЙ массив координат КАРТЫ 
    let coordinateLine: JSX.Element[] = []                                   //Массив с координатами обычных линий для отрисовки
    let coordinatePolygon: string = ""                                         //Строка с координатами полигона
    // let coordinateLinePath: string = ""                                       //Строка с координатами линии Path

    let colorСircuit = "black"                                                 //Цвет контуров
    // let textButtonColor = "Красный выкл"                                      //Текст кнопки переключения цветов

    let colorFillPolygon = "none"                                              //Цвет заливки
    let textButtonFillPolygon = "Заливка полигона выкл"                        //Текст кнопки переключения заливки

    // let textButtonCloseLinePath = "Соединить точки"                          //Текст кнопки закрытия линии Path

    // let [windowSize, setWindowSize] = useState<number[]>([500, 500])           //Отслеживание размера окна браузера
    let [coordinateToArray, setCoordinateArray] = useState<ICoordinate[]>([])  //ОСНОВНОЙ массив координат
    let [coordinateToArrayRef, setCoordinateArrayRef] = useState<ICoordinateMap[]>([])  //ОСНОВНОЙ массив координат

    // let [buttonCloseLinePath, setButtonCloseLinePath] = useState(false)      //соединение PATH линий
    // let [selectFigure, setSelectFigure]  = useState('linePath')              //выбор по умолчанию для визуализации сложной линиия
    // let [selectKnot, setSelectKnot] = useState('circle')                     //выбор по умолчанию, для визуализации в узлах кружков
    // let [buttonColor, setButtonColor] = useState(false)                      //переключение цвета контуров
    let [buttonFillColor, setButtonFillColor] = useState(false)               //переключение цвета заливки

    let [isDown, setIsDown] = useState(false)                                 //отслеживание нажата ли кнопка на узле
    let [isDownPolygon, setIsDownPolygon] = useState(false)                   //отслеживание зажата ли кнопка на полигоне

    let [circleNumber, setCircleNumber] = useState(-1);                       //номер выбранного узла
    let [colorCircleSelection, setColorCircleSelection] = useState(false)     //выделение узла для удаления
    let [delCircleButton, setDelCircleButton] = useState(false)               //кнопка удаления узла
    let [delCircleKey, setDelCircleKey] = useState(false)                     //удаления узла по кнопке Delete

    let [isDownLine, setIsDownLine] = useState(false)                       //Попадание на линию ипервое движение (добавление элемента)
    let [isDownLineOne, setIsDownLineOne] = useState(false)                 //Попадание на линию ипервое движение (замена элемента)
    let [isLineNumber, setLineNumber] = useState(-1);                       //Номер выбранной линии

    //ОТСЛЕЖИВАНИЕ ИЗМЕНЕНИЯ РАЗМЕРА ОКНА БРАУЗЕРА ДЛЯ ПОСЛЕДУЮЩЕЙ АДАПТАЦИИ SVG ПОЛЯ ПОД НЕГО

    // useEffect(() => {
    //     function changeWindow() {
    //         setWindowSize([window.innerWidth - 50, window.innerHeight - 150])
    //         console.log("window", window.innerWidth, window.innerHeight)
    //     }
    //     window.addEventListener("resize", changeWindow);
    //     changeWindow()
    //     return () => window.removeEventListener("resize", changeWindow);

    // }, [])

    //ЗАПИСЬ КООРДИНАТ В МАССИВ - оригинал

    // function setCoordinateToArray(e: any) { //Ошибка типа при выборе MouseEvent - Свойство "getBoundingClientRect" не существует в типе "EventTarget".

    //     if (isDownPolygon === true || isDown === true) {
    //         console.log("нажато")
    //     } else {
    //         let offset = e.target.getBoundingClientRect() //отслеживание положения поля
    //         if (!isDownLine) {
    //             let coordinate = [...coordinateToArray]
    //             coordinate.push({ x: e.clientX - offset.left, y: e.clientY - offset.top })
    //             setCoordinateArray(coordinate)
    //         }
    //     }
    // }

    //ЗАПИСЬ КООРДИНАТ В МАССИВ - map

    function setCoordinateToArray(e: any) { //Ошибка типа при выборе MouseEvent - Свойство "getBoundingClientRect" не существует в типе "EventTarget".
        let coordinate = [...refCoordinate]
        console.log("coordinate - 1", coordinate)
        console.log("refCoordinate - 2", refCoordinate)

        let coordinateRef = [...refCoordinate]
        setCoordinateArrayRef(coordinateRef)
        console.log("coordinateRef", coordinateRef)

        createFigures()
    }

    

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


    //РИСОВАНИЕ ПОЛИГОНОВ - map
    function createFigures() {
        coordinatePolygon += refCoordinate.map(createPolygon).join(" ")

        for (let index = 1; index < refCoordinate.length; index++) {
            coordinateLine.push(
                <line key={index} onMouseDown={(e) => { downLine(index, e) }} x1={refCoordinate[index - 1].lat} x2={refCoordinate[index].lat} y1={refCoordinate[index - 1].lng} y2={refCoordinate[index].lng} stroke={colorСircuit} fill={colorFillPolygon} strokeWidth="5" />
            )
        }
    }


    //Polygon
    function createPolygon(element: ICoordinateMap) {
        return (element.lat + " " + element.lng)
    }

    //ИЗМЕНЕНИЕ ЦВЕТА КОНТУРА
    // function setColor() {
    //   setButtonColor((buttonColor) ? false : true)

    //   function changeColor() {
    //     colorСircuit = (buttonColor) ? "red" : "black"
    //     textButtonColor = (buttonColor) ? "Красный вкл" : "Красный выкл"
    //   }
    //   changeColor()
    // }

    //ИЗМЕНЕНИЕ ЦВЕТА ЗАЛИВКИ
    function setColorFill() {
        if (coordinateToArray.length > 2) {
            setButtonFillColor((buttonFillColor) ? false : true)
        } else {
            alert("Нарисуйте минимум две линии")
        }
    }

    //ИЗМЕНЕНИЕ ЦВЕТА КОНТУРОВ И ТЕКСТА КНОПКИ

    // function changeColor() {
    //   colorСircuit = (buttonColor) ? "red" : "black"
    //   textButtonColor = (buttonColor) ? "Красный вкл" : "Красный выкл"
    // }
    // changeColor()

    //ИЗМЕНЕНИЕ ЦВЕТА ЗАЛИВКИ И ТЕКСТА КНОПКИ

    function changeFillPolygon() {
        colorFillPolygon = (buttonFillColor) ? "blue" : "none"
        textButtonFillPolygon = (buttonFillColor) ? "Заливка полигона вкл" : "Заливка полигона выкл"
    }
    changeFillPolygon()

    //ИЗМЕНЕНИЕ ЦВЕТА ЗАЛИВКИ КРУГА ПРИ ВЫДЕЛЕНИИ

    function circleSelection() {
        setColorCircleSelection((colorCircleSelection) ? false : true)
    }

    //РИСОВАНИЕ КРУЖКОВ

    function createFiguresKnot(element: ICoordinate, index: number) {
        return <circle key={index} onMouseDown={(e) => { downCircle(index, e) }} onClick={circleSelection} cx={element.x} cy={element.y} style={{ zIndex: 1 }} r="10" fill="blue" stroke={colorСircuit} />
    }
    let paintFiguresKnot = coordinateToArray.map(createFiguresKnot)

    //ОТСЛЕЖИВАНИЕ НАЖАТИЯ НА КРУГЕ

    function downCircle(index: number, e: React.MouseEvent) {
        if (index >= 0) {
            setIsDown(true)
            setCircleNumber(index)
            console.log('Down')
        }
    }

    //ОТСЛЕЖИВАНИЕ НАЖАТИЕ НА ЛИНИИ

    function downLine(index: number, e: React.MouseEvent) {
        setIsDownLine(true)
        setLineNumber(index)
    }

    console.log(paintFiguresKnot)

    function changeColorCircleSelect() {
        if (colorCircleSelection && !delCircleButton) {
            paintFiguresKnot[circleNumber] = (<circle key={circleNumber} onClick={circleSelection} cx={coordinateToArray[circleNumber].x} cy={coordinateToArray[circleNumber].y} style={{ zIndex: 1 }} r="10" fill="green" stroke="yellow" />)
        }
    }
    changeColorCircleSelect()

    //УДАЛЕНИЕ УЗЛА

    document.onkeydown = function (e) {
        if (e.code === "Delete") {
            setDelCircleKey((delCircleKey) ? false : true)
        }
    }

    function delCircleBtn() {
        setDelCircleButton((delCircleButton) ? false : true)
    }

    function delCircle() {

        if (delCircleButton || delCircleKey) {
            let coordinate = [...coordinateToArray]
            coordinate.splice(circleNumber, 1)
            setCoordinateArray(coordinate)

            setDelCircleButton(false)
            setColorCircleSelection(false)
            setDelCircleKey(false)
        }
    }
    delCircle()

    //ОТСЛЕЖИВАНИЕ ПЕРЕМЕЩЕНИЯ ПРИ НАЖАТОЙ КНОПКЕ МЫШИ

    function trackingCoordinatesMove(circleNumber: number, e: any) {   //Ошибка типа при выборе MouseEvent - Свойство "getBoundingClientRect" не существует в типе "EventTarget".
        let offset = e.target.getBoundingClientRect() //отслеживание положения поля
        if (isDown) {
            //Перетаскивание КРУГА
            let coordinate = [...coordinateToArray]
            coordinate[circleNumber] = { x: e.clientX, y: e.clientY }
            setCoordinateArray(coordinate)
        } else if (isDownPolygon && colorFillPolygon !== "none") {
            //Перетаскивание ПОЛИГОНА
            let newCoordinatePolygonX = e.clientX - coordinateToArray[coordinateToArray.length - 1].x
            let newCoordinatePolygonY = e.clientY - coordinateToArray[coordinateToArray.length - 1].y

            let newCoordinatePolygon = coordinateToArray.map(function (element: ICoordinate, index: number) {
                let x = coordinateToArray[index].x + newCoordinatePolygonX
                let y = coordinateToArray[index].y + newCoordinatePolygonY
                return { x: x, y: y }
            })
            setCoordinateArray(newCoordinatePolygon)
        } else if (isDownLine) {
            if (isDownLine && !isDownLineOne) {
                let coordinate = [...coordinateToArray]
                coordinate.splice(isLineNumber, 0, { x: e.clientX, y: e.clientY })
                setCoordinateArray(coordinate)
                setIsDownLineOne(true)
            } else if (isDownLine && isDownLineOne) {
                let coordinate = [...coordinateToArray]
                coordinate.splice(isLineNumber, 1, { x: e.clientX, y: e.clientY })
                setCoordinateArray(coordinate)
            }
        }
    }

    //ПОЛИГОН ПРИ ПЕРЕТАСКИВАНИИ
    function downPolygon() {
        setIsDownPolygon(true)
        console.log('DownPolygon')
    }

    //ОТСЛЕЖИВАНИЕ ОТПУСКАНИЯ КНОПКИ
    function trackingCoordinatesUp(e: React.MouseEvent) {
        setTimeout(() => {
            setIsDown(false)
            setIsDownPolygon(false)
            setIsDownLine(false)
            setIsDownLineOne(false)
        }, 100)
        console.log('Up')
    }

    //СОХРАНЕНИЕ КООРДИНАТ
    function saveCoordinate() {
        if (coordinateToArray.length > 0) {
            localStorage.setItem("CoordinateArray", JSON.stringify(coordinateToArray))
            alert('Coxpaнено')
        } else {
            alert('нарисуйте минимум одну фигуру')
        }
    }

    //ЗАГРУЗКА КООРДИНАТ ИЗ LOCAL STORAGE
    function loadCoordinate() {
        let getCoordinateArray = JSON.parse(localStorage.getItem("CoordinateArray")!)
        if (getCoordinateArray === null) {
            alert("Local Storage пуст")
        } else {
            setCoordinateArray(getCoordinateArray)
        }
    }

    //Очистка SVG поля для рисования
    function buttonRemove() {
        window.location.reload()
    }

    //СОЕДИНЕНИЕ ЛИНИЙ
    // function setCloseLinePath() {
    //   setButtonCloseLinePath((buttonCloseLinePath) ? false : true)
    // }

    //ВЫБОР ФИГУРЫ ЧЕРЕЗ SELECT
    // function handleChangeFigure(event: React.ChangeEvent<HTMLSelectElement>) {
    //   setSelectFigure( event.target.value )
    // }

    //ВЫБОР УЗЛА ЧЕРЕЗ SELECT
    // function handleChangeKnot(event: React.ChangeEvent<HTMLSelectElement>) {
    //   setSelectKnot( event.target.value )
    //   console.log(event.target.value)
    // }

    // function changeCloseLinePath(){
    //   if(selectFigure === 'linePath'){
    //     if (coordinateToArray.length > 2) {
    //       textButtonCloseLinePath = (buttonCloseLinePath)?"Убрать соединение" : "Соединить точки"
    //       }
    //   }
    // }
    // changeCloseLinePath()

    //Отрисовка линии path
    // function createLinePath(element: ICoordinate, index: number) {
    //   let pointM = "M"
    //   let pointL = "L"
    //   return ((index === 0) ? pointM : pointL) + (element.x + " " + element.y)
    // }

    //Отрисовка фигур по условиям
    // function createFigures() {
    //   if (selectFigure === 'line') {
    //     for (let index = 1; index < coordinateToArray.length; index++) {
    //       coordinateLine.push(
    //         <line key={index} x1={coordinateToArray[index - 1].x} x2={coordinateToArray[index].x} y1={coordinateToArray[index - 1].y} y2={coordinateToArray[index].y} stroke={colorСircuit} fill={colorFillPolygon} strokeWidth="1" />
    //       )
    //       console.log("Line", coordinateLine)
    //     }
    //   } else {
    //     (selectFigure === 'polygon')
    //       ?
    //       coordinatePolygon += coordinateToArray.map(createPolygon).join(" ")
    //       :
    //       coordinateLinePath += coordinateToArray.map(createLinePath).join(" ")
    //     console.log(coordinateLinePath)
    //     if (buttonCloseLinePath === true) {
    //       if (coordinateToArray.length > 2) {
    //         coordinateLinePath += " Z "
    //         console.log(coordinateLinePath)
    //       } else {
    //         alert("нарисуйте минимум 2 линии")
    //       }
    //     }
    //   }
    // }

    // createFigures()

    //Рисование кружков или квадратов в узлах

    // function createFiguresKnot(element: ICoordinate, index: number) {
    //   return (selectKnot === 'circle')
    //     ? <circle key={index} cx={element.x} cy={element.y} r="5" fill={colorFillPolygon} stroke={colorСircuit} />
    //     : <rect key={index} x={element.x - 2} y={element.y - 2} width="5" height="5" fill={colorFillPolygon} stroke={colorСircuit} />
    // }

    // function searchLng(e:any){
    //     console.log(e.latlng.lat)
    // }

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

                        map.on('click', function(e:any) {
                            refCoordinate.push({lat: e.latlng.lat, lng: e.latlng.lng})
                            console.log(e.latlng.lat, e.latlng.lng)
                            console.log("refCoordinate", refCoordinate)
                        });
                    }

                    (props as any).children.forEach((child: any) => {
                        if (child.type === Marker) { // т.е. type для компонент - это ф-ия (класс)
                            DG.marker((child.props as IMarker).coords).addTo(map);
                        }
                    })
                }
            }}
            >
            <svg className='fieldsSVG' onMouseUp={trackingCoordinatesUp} onMouseMove={(e) => { trackingCoordinatesMove(circleNumber, e) }} onClick={setCoordinateToArray} xmlns="http://www.w3.org/2000/svg">
                {paintFiguresKnot}
                {/* <circle id="circle" onMouseDown={trackingCoordinatesDown} cx={newCoordinate.x} cy={newCoordinate.y} style={{zIndex:1000}} r="20" fill="black" stroke="black" /> */}
                {coordinateLine}
                <polygon points={coordinatePolygon} onMouseDown={downPolygon} stroke={colorСircuit} fill={colorFillPolygon} strokeWidth="0" fill-opacity=".5"/>
                {/* <path id="line" d={coordinateLinePath} fill={colorFillPolygon} stroke={colorСircuit} /> */}
            </svg>

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
                <button className="buttonPolygon" onClick={() => setColorFill()}> {textButtonFillPolygon} </button>
                <br />

                <button className="deleteCircle" onClick={() => delCircleBtn()}> Удалить узел </button>
                <br />

                <button className="save" onClick={() => saveCoordinate()}> Сохранить </button>
                <button className="save" onClick={() => loadCoordinate()}> Загрузить </button>
                <button className="save" onClick={() => buttonRemove()}> Очистить </button>
                <br />
            </div>
        </div>
    )
}

export default Map
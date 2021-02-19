import React, { useState, useEffect } from 'react';
import './App.scss';
import Element from "./Element/Element";
import ReactHtmlParser from 'react-html-parser';

const elementList = require("./periodicTableInfo.json");

function App() {

  const [molarMass, setMolarMass] = useState(0);
  const [usedElements, setUsedElements] = useState([]);
  const [prettyElementList, setPrettyElementList] = useState([]);
  const [molecule, setMolecule] = useState("");
  const [currentElement, setCurrentElement] = useState({configuration: "", class:"", state:"", number: 0, mass: 0, symbol: ""});

  useEffect(() => {
    var info = elementList.elements[elementList.order.indexOf("hydrogen")];
    setCurrentElement({
      configuration: info.electron_configuration,
      class: info.class,
      state: info.phase,
      symbol: info.symbol,
      number: info.number,
      mass: info["atomic_mass"]
    })
  },[])

  function getElementName (prettyList) {  
    if (!prettyList.length) {    
      setMolecule("N/A")
    } else {
      var tempElList = prettyList;
      var result = "";
      var used = {};
      var usedEls = [];
      for (var i=0; i<tempElList.length; i++) {
          if (usedEls.indexOf(tempElList[i]) < 0) {
              usedEls.push(tempElList[i])
          }
          if (used[tempElList[i]]) {
              used[tempElList[i]]++;
          } else {
              used[tempElList[i]] = 1;
          }
      }
      usedEls.map((el) => {
          var usedMore = used[el] > 1
          var text = usedMore === true ? `${el}<sub>${used[el]}</sub>` : el;
          return result += text + " ";

      });
      setMolecule(result)
    }
  }

  function computeNewMolarMass(usedList, prettyList) {
    var total = 0;
    for (var i=0; i < usedList.length; i++) {
        var indexOfEl = elementList.order.indexOf(usedList[i]);
        var newMass = elementList.elements[indexOfEl].atomic_mass;
        total += newMass;
    }
    total = total.toFixed(5) + " g/mol"
    setMolarMass(total)
    getElementName(prettyList)
  }

  function addNewElementToTotal (elName) {
    setUsedElements(prev => prev.concat(elName))
    var prettyName = elementList.elements[elementList.order.indexOf(elName)].symbol
    setPrettyElementList(prev => prev.concat(prettyName))
    var info = elementList.elements[elementList.order.indexOf(elName)];
    setCurrentElement({
      configuration: info.electron_configuration,
      class: info.class,
      state: info.phase,
      symbol: info.symbol,
      number: info.number,
      mass: info["atomic_mass"].toFixed(5)
    })
    computeNewMolarMass([...usedElements, elName], [...prettyElementList, prettyName])
  }

  return (
    <div className="container">
        <div className="table">
            <div className="reset-button center-text" onClick={() => {
                setMolarMass(0);
                setUsedElements([]);
                setPrettyElementList([]);
                setMolecule("N/A")
            }}>Reset</div>
            <div className="table-title element-display center-text">Element:</div>
            <div id="element-display" className="">{ReactHtmlParser(molecule)}</div>
            <div className="table-title mass-display center-text">Molar Mass:</div>
            <div id="molar-mass-total" className="center-text">{molarMass}</div>
            <div className={`example-element ${currentElement.class}`}>
                <div className="state">{currentElement.state.charAt(0)}</div>
                <div className="info">
                    <div className="number">{currentElement.number}</div>
                    <div className="symbol">{currentElement.symbol}</div>
                    <div className="mass">{currentElement.mass}</div>
                    <div className="name">{currentElement.configuration}</div>
                </div>
            </div>
            {elementList.elements.map((el) => {
                return <Element
                    onClick={() => addNewElementToTotal(el.name.toLowerCase())}
                    xPosition={el.xpos}
                    yPosition={el.ypos}
                    elementClass={el.class}
                    dState={el.phase}
                    atomicNumber={el.number}
                    symbol={el.symbol}
                    atomicMass={el.atomic_mass}
                    name={el.name}
                />
            })}
        </div>
    </div>
  );
}

export default App;

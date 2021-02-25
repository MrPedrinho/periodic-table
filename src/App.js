import React, { useState, useEffect } from 'react';
import './App.scss';
import Element from "./Element/Element";
import ReactHtmlParser from 'react-html-parser';

const elementList = require("./periodicTableInfo.json");

function App() {

  const [molarMass, setMolarMass] = useState(0);
  const [usedElements, setUsedElements] = useState([]);
  const [prettyElementList, setPrettyElementList] = useState([]);
  const [molecule, setMolecule] = useState("N/A");
  const [currentElement, setCurrentElement] = useState({configuration: "", class:"", state:"", number: 0, mass: 0, symbol: ""});
  const [search, setSearch] = useState("");
  const [mass, setMass] = useState(0.0);
  const [mole, setMole] = useState(0);

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
    total = total.toFixed(5)
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
        <input placeholder="Search" onChange={(e) => {
          setSearch(e.target.value)
        }}/>
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
            <div id="molar-mass-total" className="center-text">{molarMass} g/mol</div>
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
                    search={search}
                />
            })}
        </div>
        <div className="mol-calculator">
          <p>Mol calculator</p>
          <input step="0.01" type="number" min="0" placeholder="mass" onChange={(e) => e.target.value ? setMass(parseFloat(e.target.value)) : setMass(0)}/>
          <div>
            <math xmlns='http://www.w3.org/1998/Math/MathML'> <mi> n </mi> <mo> = </mo> <mfrac> <mrow> <mi> {mass} </mi> </mrow> <mrow> <mi> {molarMass} </mi> </mrow> </mfrac> <mo> = </mo> <mn> {(mass / parseFloat(molarMass)).toFixed(5)} mol</mn> </math>
          </div>
        </div>
        <div className="mass-calculator">
          <p>Mass calculator</p>
          <input step="0.01" type="number" min="0" placeholder="mol" onChange={(e) => e.target.value ? setMole(parseFloat(e.target.value)) : setMole(0)}/>
          <div>
            <math xmlns='http://www.w3.org/1998/Math/MathML'> <mi> m </mi> <mo> = </mo> <mi> {mole} </mi> <mo> x </mo> <mi> {molarMass} </mi> <mo> = </mo> <mi> {(mole * parseFloat(molarMass)).toFixed(5)} g</mi> </math> 
          </div>
        </div>
    </div>
  );
}

export default App;

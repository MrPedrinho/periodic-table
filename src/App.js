import './converted.css';
import React from "react";
import ReactHtmlParser from 'react-html-parser';
import Element from "./Element/Element";
const elementList = require("./PeriodicTableJSON.json");

class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            molar_mass: 0,
            usedElements: [],
            prettyElementList: [],
            elementName: "N/A",
            currentElement: {
                name: "",
                class: "",
                state: "",
                symbol: "",
                number: "",
                mass: ""
            }
        }
        this.addNewElementToTotal = this.addNewElementToTotal.bind(this);
        this.computeNewMolarMass = this.computeNewMolarMass.bind(this);
        this.getElementName = this.getElementName.bind(this);
    }


    computeNewMolarMass () {
        var total = 0;
        for (var i=0; i<this.state.usedElements.length; i++) {
            var indexOfEl = elementList.order.indexOf(this.state.usedElements[i]);
            var newMass = elementList.elements[indexOfEl].atomic_mass;
            total += newMass;
        }
        total = total.toFixed(5) + " g/mol"
        this.setState({
            molar_mass: total
        })
        this.getElementName()
    }

    componentDidMount() {
        var info = elementList.elements[elementList.order.indexOf("hydrogen")];
        this.setState({
            currentElement: {
                name: info.name,
                class: info.class,
                state: info.phase,
                symbol: info.symbol,
                number: info.number,
                mass: info["atomic_mass"]
            }
        })
    }

    addNewElementToTotal (elName) {
        this.state.usedElements.push(elName);
        var prettyName = elementList.elements[elementList.order.indexOf(elName)].symbol
        this.state.prettyElementList.push(prettyName)
        var info = elementList.elements[elementList.order.indexOf(elName)];
        this.setState({
            currentElement: {
                name: info.name,
                class: info.class,
                state: info.phase,
                symbol: info.symbol,
                number: info.number,
                mass: info["atomic_mass"].toFixed(5)
            }
        })
        this.computeNewMolarMass()
    }

    getElementName() {
        if (!this.state.prettyElementList.length) {
            this.setState({elementName: "N/A"})
        } else {
            var tempElList = this.state.prettyElementList
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
            usedEls.map(el => {
                var usedMore = used[el] > 1
                var text = usedMore === true ? `${el}<sub>${used[el]}</sub>` : el;
                return result += text + " ";

            });
            this.setState({elementName: result})
        }
    }

    render() {
        return (
            <div className="container">
                <div className="table">
                    <div className="reset-button center-text" onClick={() => {this.setState({molar_mass: 0, usedElements: [], prettyElementList: [], elementName: "N/A"})}}>Reset</div>
                    <div className="table-title element-display center-text">Element:</div>
                    <div id="element-display" className="">{ReactHtmlParser(this.state.elementName)}</div>
                    <div className="table-title mass-display center-text">Molar Mass:</div>
                    <div id="molar-mass-total" className="center-text">{this.state.molar_mass}</div>
                    <div className={`example-element ${this.state.currentElement.class}`}>
                        <div className="state">{this.state.currentElement.state.charAt(0)}</div>
                        <div className="info">
                            <div className="number">{this.state.currentElement.number}</div>
                            <div className="symbol">{this.state.currentElement.symbol}</div>
                            <div className="mass">{this.state.currentElement.mass}</div>
                            <div className="name">{this.state.currentElement.name}</div>
                        </div>
                    </div>
                    {elementList.elements.map(el => {
                        return <Element
                            onClick={() => this.addNewElementToTotal(el.name.toLowerCase())}
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
}

export default App;

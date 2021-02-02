import "./Element.css";
import React from "react";

class Element extends React.Component {
    render() {
        return (
            <div
                onClick={this.props.onClick}
                className={`element ${this.props.elementClass}`}
                style={{
                    gridColumn: this.props.xPosition,
                    gridRow: this.props.yPosition
                }}
            >
                <div className="state">{this.props.dState.charAt(0)}</div>
                <div className="info">
                    <div className="number">{this.props.atomicNumber}</div>
                    <div className="symbol">{this.props.symbol}</div>
                    <div className="mass">{this.props.atomicMass.toFixed(5)}</div>
                    <div className="name">{this.props.name}</div>
                </div>
            </div>
        )
    }
}

export default Element;
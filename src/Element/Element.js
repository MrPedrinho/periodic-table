import React from "react";
import "./ElementStyle.scss";

export default function Element ({onClick,xPosition,yPosition,elementClass,dState,atomicNumber,symbol,atomicMass,name}) {
    return(
        <div
            onClick={onClick}
            className={`element ${elementClass}`}
            style={{
                gridColumn: xPosition,
                gridRow: yPosition
            }}
        >
            <div className="state">{dState.charAt(0)}</div>
            <div className="info">
                <div className="number">{atomicNumber}</div>
                <div className="symbol">{symbol}</div>
                <div className="mass">{atomicMass.toFixed(5)}</div>
                <div className="name">{name}</div>
            </div>
        </div>
    )
}
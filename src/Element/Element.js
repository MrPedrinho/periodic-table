import React from "react";
import "./ElementStyle.scss";

export default function Element ({onClick,xPosition,yPosition,elementClass,dState,atomicNumber,symbol,atomicMass,name,search}) {
    
    var searchParam = search.trim().toLowerCase();
    var matches = symbol.toLowerCase().startsWith(searchParam) || name.toLowerCase().startsWith(searchParam) || search.trim().length === 0 ? false : true
    
    return (
        <div
            onClick={onClick}
            className={`element ${elementClass}`}
            style={{
                gridColumn: xPosition,
                gridRow: yPosition,
                opacity: matches ? 0.5 : 1
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
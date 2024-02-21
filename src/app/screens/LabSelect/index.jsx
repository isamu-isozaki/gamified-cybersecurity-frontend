import './LabSelect.css'

import React, { useState } from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";

function LabSelectContainer({
    labList,
    selectLab
                   }) {

    return (
        <div className="LabSelectContainer">
            {labList.map((labInfo, index) => (
                <LabListing labInfo={labInfo} selectLab={selectLab}/>
            ))}
        </div>
    );
}

function LabListing({labInfo, selectLab}) {
    const {title, machineCount, difficulty} = labInfo;

    return (
        <div className= "LabListing">
            <h1 className={"w-2/5"}>{title}</h1>
            <h1 className={"w-1/5"} >{machineCount}</h1>
            <h1 className={"w-1/5"}>{difficulty}</h1>
            <button onClick={selectLab} className={"font-extrabold"}> START </button>
        </div>
    );
}

LabSelectContainer.propTypes = {
    labList: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string,
            machineCount: PropTypes.number,
            difficulty: PropTypes.number,
        })
    ),
}

LabListing.propTypes = {
    LabInfo: PropTypes.shape({
        title: PropTypes.string,
        machineCount: PropTypes.number,
        difficulty: PropTypes.number,
    }),
}

export default (LabSelectContainer);
import './LabSelect.css'

import React, { useState } from "react";
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const labList = [
    {
        title: 'Introduction',
        machineCount: 3,
        difficulty: 1,
        id: 0,
    },
    {
        title: 'Crazy Challenge',
        machineCount: 10,
        difficulty: 3,
        id: 1,
    },
    {
        title: 'Ultra Hard',
        machineCount: 9999,
        difficulty: 5,
        id: 2,
    }
]

function LabSelectContainer() {
    return (
        <div className="LabSelectContainer">
            {labList.map((labInfo, index) => (
                <LabListing labInfo={labInfo}/>
            ))}
        </div>
    );
}

function LabListing({labInfo}) {
    const {title, machineCount, difficulty, id} = labInfo;

    return (
        <div className= "LabListing">
            <h1 className={"w-2/5"}>{title}</h1>
            <h1 className={"w-1/5"} >{machineCount}</h1>
            <h1 className={"w-1/5"}>{difficulty}</h1>
            <Button asChild className={"font-extrabold"}>
                <Link to={`/${id}`}>Start</Link>
            </Button>
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
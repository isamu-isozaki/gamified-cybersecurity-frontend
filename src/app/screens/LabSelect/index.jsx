import './LabSelect.css'

import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getBackendUrl } from '@/lib/utils';

function LabSelectContainer() {

    const [labs, setLabs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        setIsLoading(true);

        fetch(getBackendUrl("/v1/labs")).then(async (response) => {
            if (response.ok) {
                return response.json();
            }
            else {
                throw new Error(await response.json());
            }
        }).then((labs) => {
            setLabs(labs);
        }).catch((error) => {
            console.error(error);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [])

    return (
        <div className="LabSelectContainer">
            {isLoading ? <span>Loading...</span> : labs.map((labInfo) => (
                <LabListing key={labInfo.name} labInfo={labInfo}/>
            ))}
        </div>
    );
}

function LabListing({labInfo}) {
    const {name, difficulty_rating, number_of_machines} = labInfo;

    return (
        <div className= "LabListing">
            <h1 className={"w-2/5"}>{name}</h1>
            <h1 className={"w-1/5"} >{number_of_machines}</h1>
            <h1 className={"w-1/5"}>{difficulty_rating}</h1>
            <Button asChild className={"font-extrabold"}>
                <Link to={`/${name}`}>Start</Link>
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
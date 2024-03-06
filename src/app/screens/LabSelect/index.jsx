import './LabSelect.css'

import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { getBackendUrl } from '@/lib/utils';
import { DataTable, DataTableColumnHeader } from '@/components/ui/data-table';
import { Menu } from 'lucide-react';

function LabSelectContainer() {
    const [labs, setLabs] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const columns = [
        {
            accessorKey: "name",
            header: ({column}) => {
                return (
                    <DataTableColumnHeader column={column} title="Lab" className="text-white" />
                )
            },
            cell: ({row}) =>  <div className="font-medium">{row.getValue("name")}</div>
        },
        {
            accessorKey: "number_of_machines",
            header: ({column}) => {
                return (
                    <DataTableColumnHeader column={column} title="Number of Machines" className="text-white"/>
                )
            },
            cell: ({row}) =>  <div className="font-medium">{row.getValue("number_of_machines")}</div>
        },
        {
            accessorKey: "difficulty_rating",
            header: ({column}) => {
                return (
                    <DataTableColumnHeader column={column} title="Difficulty" className="text-white"/>
                )
            },
            cell: ({row}) =>  <div className="font-medium">{row.getValue("difficulty_rating")}</div>
        },
        {
            accessorKey: "name",
            header: () => <div className='text-right'></div>,
            cell: ({row}) => {
                return (
                    <div className="text-right font-medium">
                        <Button asChild className="font-extrabold">
                            <Link to={`/${row.getValue("name")}`}>Start</Link>
                        </Button>
                    </div>
                )}
        }
    ]

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
        <div className="flex flex-col p-8">
            <div className="flex flex-row justify-between">
                <Menu color='white' size={40} />
                <h1 className='text-xl text-white font-extrabold'>Hello Devin</h1>
            </div>
            <DataTable className="LabTable grow m-8" columns={columns} data={labs} />
        </div>
    );
}


export default (LabSelectContainer);
import {Cell, CellProps} from "./Cell";
import React from "react";

export interface RowProps {
    cells: CellProps[];
}

export function Row(props: RowProps) {
    return <div className='Row'>
        { props.cells.map((cell, index) => <Cell key={index} {...cell}/>) }
    </div>
}

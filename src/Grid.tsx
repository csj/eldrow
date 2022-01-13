import {Row, RowProps} from "./Row";
import React from "react";
import {Cell, CellStatus} from "./Cell";

export interface GridProps {
    rows: CellStatus[][];
}

interface CellState {
    letter: string;
    isInvalid: boolean;
}

export function Grid(props: GridProps) {
    const numGuesses = props.rows.length
    let [activeRow, setActiveRow] = React.useState(numGuesses - 1);
    let [activeCol, setActiveCol] = React.useState(0);
    let [letters, setLetters] = React.useState(Array(props.rows.length).fill(['', '', '', '', '']));

    function handleClick(row: number, col: number) {
        setActiveRow(row);
        setActiveCol(col);
    }

    function handleKeyPress(letter: string) {
        if ((letter < 'a' || letter > 'z') && letter != ' ') return;
        letter = letter.toUpperCase()

        let newLetters = [...letters.map(row => [...row])];
        newLetters[activeRow][activeCol] = letter;
        setLetters(newLetters);
        let newActiveCol = activeCol + 1;
        let newActiveRow = activeRow;
        if (newActiveCol >= 5) {
            newActiveCol = 0;
            newActiveRow++;
        }
        if (newActiveRow >= props.rows.length) {
            newActiveRow = 0;
        }
        setActiveCol(newActiveCol);
        setActiveRow(newActiveRow);
    }

    function isInvalid(row: number, col: number) {
        if (letters[numGuesses-1].some((c:string) => !c)) return false
        const guessLetter = letters[row][col]
        if (!guessLetter) return false
        const actualLetters = letters[numGuesses-1]

        switch (props.rows[row][col]) {
            case 'None': return !(actualLetters.every((c:string) => c != guessLetter))
            case 'WrongPlace': return !(actualLetters.some((c:string) => c == guessLetter) && actualLetters[col] != guessLetter)
            case 'RightPlace': return !(actualLetters[col] == guessLetter)
        }
    }

    return (
        <div className="grid" tabIndex={0} onKeyDown={e => handleKeyPress(e.key)}>
            {props.rows.map((row, r) => (
                <Row key={r} cells={row.map((cell, c) => ({
                    status: cell,
                    letter: letters[r][c],
                    isActive: activeRow == r && activeCol == c,
                    onClick: () => handleClick(r, c),
                    isInvalid: isInvalid(r,c)
                }))} />
            ))}
        </div>
    );
}

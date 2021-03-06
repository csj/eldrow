import {Row} from "./Row";
import React from "react";
import {CellStatus} from "./Cell";
import {CopyToClipboard} from "react-copy-to-clipboard";
import Coffee from "./Coffee";
import styled from "styled-components";

export interface GridProps {
    rows: CellStatus[][];
    onReset: () => void;
}

export function Grid(props: GridProps) {
    const numGuesses = props.rows.length
    let [activeRow, setActiveRow] = React.useState(numGuesses - 1);
    let [activeCol, setActiveCol] = React.useState(0);
    const empty = Array(props.rows.length).fill(['', '', '', '', ''])
    let [letters, setLetters] = React.useState(empty);

    function clear() {
        setLetters(empty);
    }

    function handleClick(row: number, col: number) {
        setActiveRow(row);
        setActiveCol(col);
    }

    function handleKeyPress(letter: string) {
        if ((letter < 'a' || letter > 'z') && letter !== ' ') return;
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
        if (guessLetter === ' ') return false
        const actualLetters = letters[numGuesses-1]

        switch (props.rows[row][col]) {
            case 'None': return !(actualLetters.every((c:string) => c !== guessLetter))
            case 'WrongPlace': return !(actualLetters.some((c:string) => c === guessLetter) && actualLetters[col] !== guessLetter)
            case 'RightPlace': return !(actualLetters[col] === guessLetter)
        }
    }

    const _MS_PER_DAY = 1000 * 60 * 60 * 24;

    // a and b are javascript Date objects
    function dateDiffInDays(a: Date, b: Date) {
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    function buildCopyText() {
        let retVal = '';
        for (let r = 0; r < props.rows.length; r++) {
            for (let c = 0; c < 5; c++) {
                //let base;
                //base = 0x1F170;
                let modifier = 0;
                if (props.rows[r][c] === 'RightPlace') {
                    //base = 0x1F130;
                    modifier = 0x0332;
                } else if (props.rows[r][c] === 'WrongPlace') {
                    modifier = 0x0323;
                    //base = 0x24B6;
                }
                if (letters[r][c] < 'A' || letters[r][c] > 'Z') return '';
                let base = 0x1D670;
                let hex = base + letters[r][c].charCodeAt(0) - 'A'.charCodeAt(0);
                retVal += String.fromCodePoint(hex)
                if (modifier) retVal += String.fromCodePoint(modifier);
            }
            retVal += '\n';
        }
        const day = dateDiffInDays(new Date('2021-06-20'), new Date())
        return retVal + 'eldrow.online  #EldrowOnline #Wordle #Wordle' + day;
    }

    let copyText = buildCopyText();
    const Button = styled.button`
      margin-right: 5px;
    `

    return (
            <div className="grid" tabIndex={0} onKeyDown={e => handleKeyPress(e.key)}>
                {props.rows.map((row, r) => (
                    <Row key={r} cells={row.map((cell, c) => ({
                        status: cell,
                        letter: letters[r][c],
                        isActive: activeRow === r && activeCol === c,
                        onClick: () => handleClick(r, c),
                        isInvalid: isInvalid(r,c)
                    }))} />
                ))}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: 30}}>
                    <CopyToClipboard text={copyText}>
                        <Button disabled={!copyText}>Copy</Button>
                    </CopyToClipboard>
                    <Button onClick={() => clear()}>Clear</Button>
                    <Button onClick={props.onReset}>Reset</Button>
                    <span style={{width:30}}/>
                    <Coffee/>
                </div>

            </div>
    );
}

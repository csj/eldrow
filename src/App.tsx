import React from 'react';
import './App.css';
import {CellStatus} from "./Cell";
import {Grid, GridProps} from "./Grid";

function App() {
    const [grid, setGrid] = React.useState<GridProps | undefined>(undefined);

    function paste(content: string) {
        const blanks = ['White large square', '⬛', '⬜', '\u2B1B'];
        const wrongs = ['Yellow square', '\u{1F7E8}']
        const rights = ['Green square', '\u{1F7E9}']

        let statuses: CellStatus[][] = []
        for (let line of content.split('\n')) {
            let row: CellStatus[] = []
            loop: for (let i=0; i<5; i++) {
                for (let b of blanks) {
                    if (line.startsWith(b)) {
                        row.push('None')
                        line = line.substring(b.length)
                        continue loop
                    }
                }

                for (let w of wrongs) {
                    if (line.startsWith(w)) {
                        row.push('WrongPlace')
                        line = line.substring(w.length)
                        continue loop
                    }
                }

                for (let r of rights) {
                    if (line.startsWith(r)) {
                        row.push('RightPlace')
                        line = line.substring(r.length)
                        continue loop
                    }
                }
            }
            if (row.length == 5) statuses.push(row)
        }
        setGrid({rows: statuses})
    }

    if (grid) return <Grid {...grid}/>;
    return <ContentPaster onPaste={paste}/>;
}

interface ContentPasterProps {
    onPaste: (content: string) => void;
}
function ContentPaster(props: ContentPasterProps) {
    return <div>
        <div>Paste your Wordle "solution" here:</div>
        <textarea onChange={(e) => { props.onPaste(e.target.value); e.target.value = '';}}/>
    </div>;
}


export default App;

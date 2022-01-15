import React from 'react';
import './App.css';
import {CellStatus} from "./Cell";
import {Grid} from "./Grid";

function App() {
    const [statuses, setStatuses] = React.useState<CellStatus[][] | undefined>(undefined);

    function paste(content: string) {
        const blanks = ['White large square', 'Black large square', '⬛', '⬜', '\u2B1B'];
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
            if (row.length === 5) statuses.push(row)
        }
        setStatuses(statuses);
    }

    return <div style={{display:'flex', justifyContent:'center', marginTop:30}}>
        {statuses ?
            <Grid rows={statuses} onReset={() => setStatuses(undefined)}/> :
            <ContentPaster onPaste={paste}/>
        }
    </div>
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

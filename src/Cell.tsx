export type CellStatus = 'None' | 'WrongPlace' | 'RightPlace'

export interface CellModel {
    letter: string;
    status: CellStatus;
}

export interface CellProps extends CellModel {
    isActive: boolean;
    onClick: () => void;
    isInvalid: boolean;
}

export function Cell(props: CellProps) {
    const { letter, status } = props;
    const className = `cell ${status} ${props.isInvalid ? 'Invalid' : ''}  ${props.isActive ? 'Active' : ''}`;

    return (
        <div className={className} onClick={props.onClick}>
            {letter}
        </div>
    );
}

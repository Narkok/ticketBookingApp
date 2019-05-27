import React from "react";
import './styles/seats.css';

// Помпонент для выбора мест.
export default class Seats extends React.Component
{
    constructor(props)
    {
        super(props)
        this.rows = 8;
        this.cols = 16;
    }

    // Вызывается при нажатии на свободное место.
    seatClick(place)
    {
        let index = this.props.selected.getIndexInArray(place);
        if (index === -1) this.props.selected.push(place);
        else this.props.selected.splice(index, 1);
    }

    render ()
    {
        let seats = [];
        let seatCols = [];
        let seatRows = [];

        for (let j = 1; j <= this.cols; j++) seatCols.push(<div key={j}>{j}</div>)
        for (let i = 1; i <= this.rows; i++) seatRows.push(<div key={i}>{i}</div>)

        for (let i = 1; i <= this.rows; i++)
            for (let j = 1; j <= this.cols; j++)
                seats.push(
                    <div key={j*100+i} className="seatContainer">
                        <Seat i={i} j={j}
                            change={this.props.change}
                            seatClick={this.seatClick.bind(this)}
                            available={this.props.available}
                            selected={this.props.selected}/>
                    </div>
                );

        return(
            <div className="seatsContainer">
                <div className="seatRowsNums">{seatRows}</div>
                <div className="seatColsNums">{seatCols}</div>
                {seats}
            </div>
        );
    }
}

// Компонент места в зале.
class Seat extends React.Component{

    // Вызывается при нажатии на место.
    click()
    {
        if (!this.props.change) return;
        let place = [this.props.i,this.props.j];
        if (this.props.available.getIndexInArray(place) !== -1)
        {
            this.props.seatClick(place);
            this.forceUpdate();
        }
    }

    render ()
    {
        return(
            <div className={getClasses(
                    this.props.i,
                    this.props.j,
                    this.props.available,
                    this.props.selected,
                    this.props.change)}
                onClick={this.click.bind(this)}>
            </div>
        );
    }
}

// Возвращает индекс элемента.
Array.prototype.getIndexInArray = function(obj)
{
    for (let i = 0; i < this.length; i++)
        if ((obj[0] === this[i][0]) && (obj[1] === this[i][1]))
            return i;
    return -1;
}

// Возвращает строку с className в зависимости от значений.
function getClasses(i, j, available, selected, change)
{
    let place = [i,j];
    if ((!change) && (available.getIndexInArray(place) !== -1))
        return "notClickableSeat";
    let ret = "seat";
    if (available.getIndexInArray(place) !== -1) ret += " available";
    if (selected.getIndexInArray(place) !== -1) ret += " seatSelected";
    return ret;
}

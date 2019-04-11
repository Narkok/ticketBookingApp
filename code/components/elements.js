import React from "react";
import './styles/elements.css';

export class Button extends React.Component
{
    render ()
    {
        return(
            <div
                onClick={this.props.click}
                className={"button" + (this.props.className === undefined ?  "" : " " + this.props.className)}>
                {this.props.children}
            </div>
        );
    }
}


export const Screen = () =>
    <div className="screen">
        Экран
    </div>


export const Marks = () =>
    <div className="marks">
        <div className="mark">
            <div className="seatContainer">
                <div className="seat"></div>
            </div>
            <div className="label">&mdash; Занято</div>
        </div>
        <div className="mark">
            <div className="seatContainer">
                <div className="seat available"></div>
            </div>
            <div className="label">&mdash; Свободно</div>
        </div>
    </div>

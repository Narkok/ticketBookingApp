import React from "react";
import './styles/dateSelector.css';

// Компонент для выбора дня.
export default class DateSelector extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {dateSelected: this.props.dateSelected};
        this.dayString = changeDayString(this.state.dateSelected, this.props.date);
        this.changeState = this.changeState.bind(this);
    }

    // Вызывается при изменении дня.
    changeState(newDate)
    {
        this.setState({dateSelected: newDate});
        this.props.dateChanger(newDate);
    }

    render ()
    {
        this.dayString = changeDayString(this.state.dateSelected, this.props.date);
        return(
            <div className="dateSelector">
                Расписание на <b className="dateSelectButton" onClick={DaysShowHide}>{this.dayString}</b>
                <Days
                    chs={this.changeState}
                    date={this.props.date}
                    dateSelected={this.state.dateSelected}/>
            </div>
        );
    }
}

// Панель с кнопками, для выбора дня.
class Days extends React.Component{
    render ()
    {
        let buttons = [];
        for (let i = -7; i <= 7; i++)
            buttons.push(
                <DayButton
                    chs={this.props.chs}
                    key={i} value={i}
                    date={this.props.date}
                    dateSelected={this.props.dateSelected}
                />
            );
        return(<div className="days">{buttons}</div>);
    }
}

// Кнопка.
class DayButton extends React.Component
{
    constructor (props)
    {
        super(props);
        let date = new Date(this.props.date);
        date.setDate(date.getDate() + this.props.value);
        this.day = date.getDate();
        this.month = getMonthName(date.getMonth(), true);
    }

    // Вызывается при изменении дня.
    changeDate()
    {
        this.props.chs(this.props.value);
    }

    render ()
    {
        return (
            <div className={getClasses(this.props.value, this.props.dateSelected)}
                 onClick={this.changeDate.bind(this)}>
                <div className="dayButtonDay">{this.day}</div>
                <div className="dayButtonMonth">{this.month}</div>
            </div>
        )
    }
}

// Возвращает строку с className в зависимости от значения.
function getClasses(val, select)
{
    if (val == select)
        if (val == 0) return "dayButton today dayButtonSelected";
        else return "dayButton dayButtonSelected";
    if (val == 0) return "dayButton today";
    if (val < 0) return "dayButton prevDay";
    return "dayButton";
}

// Меняет заголовок в зависимости от выбранного дня.
function changeDayString(select, date)
{
    let returnString = "";
    if (select == 0) returnString += "сегодня, ";

    let newDate = new Date(date);
    newDate.setDate(newDate.getDate() + select);
    returnString += newDate.getDate() + " " + getMonthName(date.getMonth(), false);

    return returnString;
}

// Возвращает название месяца в зависимости от номера.
function getMonthName(num, shortFlag)
{
    if (num == 0)  return "янв" + (shortFlag ? "" : "аря");
    if (num == 1)  return "фев" + (shortFlag ? "" : "раля");
    if (num == 2)  return "мар" + (shortFlag ? "" : "та");
    if (num == 3)  return "апр" + (shortFlag ? "" : "еля");
    if (num == 4)  return (shortFlag ? "май" : "мая");
    if (num == 5)  return "июн" + (shortFlag ? "" : "я");
    if (num == 6)  return "июл" + (shortFlag ? "" : "я");
    if (num == 7)  return "авг" + (shortFlag ? "" : "уста");
    if (num == 8)  return "сен" + (shortFlag ? "" : "тября");
    if (num == 9)  return "окт" + (shortFlag ? "" : "ября");
    if (num == 10) return "ноя" + (shortFlag ? "" : "бря");
    if (num == 11) return "дек" + (shortFlag ? "" : "абря");
}

// Скрыть/показать панель выбора дней.
let daysHide = false;
function DaysShowHide()
{
    daysHide = !daysHide;
    var days = document.getElementsByClassName("days")[0];
    if (daysHide) days.classList.add("daysHide");
    else days.classList.remove("daysHide");
}

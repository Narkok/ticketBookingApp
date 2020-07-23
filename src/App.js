import React from "react";
import {Button, Screen, Marks} from "./components/elements";
import TimeSelector from "./components/timeSelector";
import DateSelector from "./components/dateSelector";
import Seats from "./components/seats"
import './App.css';

export default class App extends React.Component
{
	constructor(props)
	{
	  	super(props);

		this.date = new Date();

		this.state = {
			time: prepareTime(this.date),
			timeSelected: prepareTime(this.date),
			dateSelected: prepareDate(this.date),
			seatsSelected: 0
		};

		this.dbKey = getLocalStoreKey(prepareTime(this.date), prepareDate(this.date));
		this.dbKeyNow = this.dbKey;
		this.seatAvailable = getAvailableSeats(this.dbKey);
		this.seatSelected = [];

        this.timeChanger = this.timeChanger.bind(this);
		this.dateChanger = this.dateChanger.bind(this);
		this.reserveButton = this.reserveButton.bind(this);
	}

	// Вызывается при изменении времени.
	timeChanger(newTime)
	{
		if (newTime !== this.state.timeSelected)
		{
			console.log("New time: " + newTime);
			this.dbKey = getLocalStoreKey(newTime, this.state.dateSelected);
			this.seatAvailable = getAvailableSeats(this.dbKey);
			this.seatSelected = [];
			this.setState({timeSelected: newTime});
		}
	}

	// Вызывается при изменении дня.
	dateChanger(newDate)
	{
		if (newDate !== this.state.dateSelected)
		{
			console.log("New day: " + newDate);
			this.dbKey = getLocalStoreKey(this.state.timeSelected, newDate);
			this.seatAvailable = getAvailableSeats(this.dbKey);
			this.seatSelected = [];
			this.setState({dateSelected: newDate});
		}
	}

	// Вызывается при нажатии на кнопку "Бронировать".
	reserveButton()
	{
		console.log("Reserve");
		subtractArrays(this.seatAvailable, this.seatSelected);
		localStorage.setItem(this.dbKey, JSON.stringify(this.seatAvailable));
		this.seatSelected = [];
		this.setState({seatsSelected: 0});
	}

	render()
	{
		return (
			<div className="mainContainer">
				<DateSelector
					dateChanger={this.dateChanger}
					dateSelected={this.state.dateSelected}
					date={this.date}
				/>
				<TimeSelector
					timeChanger={this.timeChanger}
					time={this.state.timeSelected}
				/>
				<Screen/>
				<Seats
					change={canChange(this.dbKeyNow, this.dbKey)}
					available={this.seatAvailable}
					selected={this.seatSelected}
				/>
				<Button click={this.reserveButton} className="bookButton">Забронировать</Button>
				<Marks/>
			</div>
		);
	}
}

// Сравнивание ключей текущего времени и выбранного,
// для предоставления возвожности менять данные.
function canChange(keyNow, keySelected)
{
	let kN = keyNow.split(".").map((item) => {return parseInt(item)});
	let kS = keySelected.split(".").map((item) => {return parseInt(item)});

	for (let i = 0; i < kN.length; i++)
		if (kN[i] !== kS[i])
			return (kN[i] < kS[i]);

	return true;
}

// Вычитает второй массив из первого.
function subtractArrays(available, selected)
{
	selected.forEach(function(item)
	{
		let index = available.getIndexInArray(item);
		if (index !== -1) available.splice(index, 1);
	});
}

// На основе выбранного времени и дня возвращает ключ в локальной памяти.
function getLocalStoreKey(time, day)
{
	let date = new Date();
	date.setDate(date.getDate() + day);
	let key = date.getFullYear() + "." + date.getMonth() + "." + date.getDate() + "." + time;
	return key;
}

// По ключу возвращает из памяти массив свободных мест.
// Если в памяти нет ключа - все места свободны.
function getAvailableSeats(key)
{
	let seats = localStorage.getItem(key);
	if (seats !== null)
		return JSON.parse(seats);

	seats = [];
	for (let i = 1; i <= 8 ; i++)
		for (let j = 1; j <= 16 ; j++)
			seats.push([i, j]);
	return seats;
}

// Возвращает время ближайшего сеанса.
function prepareTime(currentDate)
{
	if (currentDate.getHours() < 10) return 10;
	if (currentDate.getHours() > 20) return 10;
	return Math.ceil(Math.ceil(currentDate.getHours()) / 2) * 2;
}

// Возвращает день ближайшего сеанса.
function prepareDate(currentDate)
{
	if (currentDate.getHours() >= 20) return 1;
	return 0;
}

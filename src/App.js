import React, { Component, } from 'react';
import './App.css';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', ];

class App extends Component {
    render() {
        return (
            <div className="container">
              <Table />
              <button type="button">Copy link</button>
            </div>
        );
    }
}

function Table() {
    return (
        <table>
          <Header />
          <Body />
        </table>
    );
}

function HeaderRow() {
    let cells = [];
    for (var i = 0; i < days.length; i++) {
        cells.push(<th id={i} key={i}>{days[i]}</th>);
    }
    return <tr><th>Hours</th>{cells}<th>Hours</th></tr>;
}

function HourCell(props) {
    let hour = String(props.i);
    hour = hour.padStart(2, '0');
    hour = hour + ':00';
    return <th id={props.i}>{hour}</th>;
}

function Header() {
    return (
        <thead>
          <HeaderRow />
        </thead>
    );
}

function Footer() {
    return (
        <tfoot>
        <HeaderRow />
      </tfoot>
    );
}

class Body extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: Array(24).fill(false).map(() => Array(7).fill(false)),
        };
    }

    toggle = (headers) => {
        const keys = headers.split(' '); // 1st = rows, 2nd = column
        this.setState((prevState, props) => {
          const newObj = Object.assign({}, this.state.cells);
          newObj[keys[0]][keys[1]] = !newObj[keys[0]][keys[1]];
          return newObj;
        });
    }

    render() {
        let rows = [];
        for (let i = 0; i < this.state.cells.length; i++) {
            let cells = [];
            for (let j = 0; j < this.state.cells[i].length; j++) {
                const headers = i + ' ' + j;
                let color = '';
                if (this.state.cells[i][j] === true) {
                    color = 'green';
                }
                cells.push(<Cell headers={headers} key={headers} toggle={this.toggle} color={color} value={this.state.cells[i][j]} />);
            }
            rows.push(<tr key={i}><HourCell i={i} />{cells}<HourCell i={i} /></tr>);
        }
        return <tbody>{rows}</tbody>;
    }
}

class Cell extends Component {
    handleClick = () => {
        this.props.toggle(this.props.headers);
    }

    render() {
        return <td headers={this.props.headers} onClick={this.handleClick} style={{backgroundColor: this.props.color}}>{this.props.value}</td>;
    }
}

export default App;

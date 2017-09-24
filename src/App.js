import React, { Component, } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Panel, Button, ButtonGroup, ButtonToolbar, FormGroup, FormControl, Grid, Row, Col, } from 'react-bootstrap';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cells: Array(10).fill(false).map(() => Array(7).fill(false)),
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
        return (
            <div className="appWrapper"> 
                <Grid>
                    <Row>
                        <Col lg={6}>
                            <Table toggle={this.toggle} cells={this.state.cells} />
                        </Col>
                        <Col lg={3}>
                            <Panel style={{textAlign: 'center'}} >
                                Banner placeholder
                            </Panel>
                            <Navigation />
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    addSchedule = () => {

    }

    report = () => {

    }

    render() {
        return (
            <ButtonToolbar>
                <ButtonGroup justified>
                    <Button onClick={this.report}>Report</Button>
                    <Button onClick={this.addSchedule}>Add Schedule</Button>
                </ButtonGroup>
            </ButtonToolbar>
        );
    }
}

function Table(props) {
    return (
        <table>
              <Header />
              <Body toggle={props.toggle} cells={props.cells} />
            </table>
    );
}

function HeaderRow() {
    let cells = [];
    for (var i = 0; i < days.length; i++) {
        cells.push(<th id={i} key={i}>{days[i]}</th>);
    }
    return <tr><th>Hours</th>{cells}</tr>;
}

function HourCell(props) {
    const offset = 9;
    let hour = String(props.i + offset);
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

class Body extends Component {
    render() {
        let rows = [];
        for (let i = 0; i < this.props.cells.length; i++) {
            let cells = [];
            for (let j = 0; j < this.props.cells[i].length; j++) {
                const headers = i + ' ' + j;
                let color = '';
                if (this.props.cells[i][j] === true) {
                    color = 'green';
                }
                cells.push(<Cell headers={headers} key={headers} toggle={this.props.toggle} color={color} value={this.props.cells[i][j]} />);
            }
            rows.push(<tr key={i}><HourCell i={i} />{cells}</tr>);
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

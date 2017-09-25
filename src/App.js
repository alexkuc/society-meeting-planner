import React, { Component, } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import { Panel, Button, ButtonGroup, ButtonToolbar, FormGroup, FormControl, InputGroup, Glyphicon, Grid, Row, Col, } from 'react-bootstrap';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', ];

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            init: Array(10).fill(false).map(() => Array(7).fill(false)),
            schedules: Array(0),
            selection: null,
            report: null,
        };
    }

    toggle = (headers) => {
        const keys = headers.split(' '); // 1st = rows, 2nd = column
        this.setState((prevState, props) => {
            if (prevState.selection === null || prevState.schedules.length < 1) { // catching non-selected schedule update
                return false;
            }
            const newState = Object.assign({}, prevState);
            const i = newState.selection; // alias to make things easier to read
            const schedules = newState.schedules; // same here
            schedules[i].matrix[keys[0]][keys[1]] = !schedules[i].matrix[keys[0]][keys[1]];
            return schedules;
        });
    }

    createSchedule = () => {
        this.setState((prevState, props) => {
            const newState = Object.assign({}, prevState);
            newState.schedules.push({ name: '', matrix: Array(10).fill(false).map(() => Array(7).fill(false)), });
            return newState.schedules;
        });
    }

    updateScheduleName = (i, value) => {
        this.setState((prevState, props) => {
            const newState = Object.assign({}, prevState);
            newState.schedules[i].name = value;
            return newState;
        });
    }

    removeSchedule = (i) => {
        this.setState((prevState, props) => {
            const newState = Object.assign({}, prevState);
            newState.schedules.splice(i, 1);
            newState.selection = newState.selection - 1;
            return newState;
        })
    }

    selectSchedule = (i) => {
        this.setState((prevState, props) => {
            const newState = Object.assign({}, prevState);
            newState.selection = i;
            newState.report = null;
            return newState;
        });
    }

    report = () => {
        this.setState((prevState, props) => {
            const newState = Object.assign({}, prevState);
            const rows = [];
            for (let i = 0; i < this.state.schedules[0].matrix.length; i++) { // i = row
                const cells = [];
                for (let j = 0; j < this.state.schedules[0].matrix[i].length; j++) { // j = cell
                    const arr = [];
                    for (let k = 0; k < this.state.schedules.length; k++) { // k = matrix to compare against
                        arr.push(this.state.schedules[k].matrix[i][j]);
                    }
                    let value = arr.find((el) => {
                        return el === false;
                    })
                    if (typeof value === 'undefined') {
                        value = true;
                    }
                    cells.push(value);
                }
                rows.push(cells);
            }
            newState.report = rows;
            return newState;
        });
    }

    render() {
        let matrix = this.state.init;
        if (typeof this.state.selection === 'string' && this.state.schedules.length > 0) {
            console.log(this.state.selection);
            console.log(this.state.schedules);
            matrix = this.state.schedules[this.state.selection].matrix;
        }
        if (Array.isArray(this.state.report)) {
            matrix = this.state.report;
        }
        return (
            <div className="appWrapper"> 
                <Grid>
                    <Row>
                        <Col lg={6}>
                            <Table toggle={this.toggle} matrix={matrix} />
                        </Col>
                        <Navigation
                            schedules={this.state.schedules} 
                            createSchedule={this.createSchedule}
                            updateScheduleName={this.updateScheduleName}
                            removeSchedule={this.removeSchedule}
                            selectSchedule={this.selectSchedule}
                            report={this.report}
                        />
                    </Row>
                </Grid>
            </div>
        );
    }
}

function Navigation(props) {
    let schedules = [];
    for (let i = 0; i < props.schedules.length; i++) {
        schedules.push(<Schedule 
                                schedule={props.schedules[i]} 
                                updateScheduleName={props.updateScheduleName} 
                                removeSchedule={props.removeSchedule}
                                selectSchedule={props.selectSchedule} 
                                i={i} key={i} 
                            />)
    }
    return (
        <Col lg={3}>
            <Panel style={{textAlign: 'center'}} >
                Banner placeholder
            </Panel>
            <ButtonToolbar>
                <ButtonGroup justified>
                    <Button onClick={props.report}>Report</Button>
                    <Button onClick={props.createSchedule}>Add Schedule</Button>
                </ButtonGroup>
            </ButtonToolbar>
            <form style={{paddingTop: '5%'}}>
                {schedules}
            </form>
        </Col>
    );
}

class Schedule extends Component {
    handleClick = () => {
        this.props.removeSchedule(this.props.i);
    }

    handleChangeText = (e) => {
        this.props.updateScheduleName(this.props.i, e.target.value);
    }

    handleChangeRadio = (e) => {
        this.props.selectSchedule(e.target.value);
    }

    render() {
        return (
            <FormGroup>
                <InputGroup>
                    <InputGroup.Addon>
                        <input type="radio" name="schedule" value={this.props.i} onChange={this.handleChangeRadio} />
                    </InputGroup.Addon>
                    <FormControl onChange={this.handleChangeText} type="text" value={this.props.schedule.name} />
                    <InputGroup.Button>
                        <Button onClick={this.handleClick} bsStyle="danger">
                            <Glyphicon glyph="remove" />
                        </Button>
                    </InputGroup.Button>
                </InputGroup>
            </FormGroup>
        );
    }
}

function Table(props) {
    return (
        <table>
            <Header />
            <Body toggle={props.toggle} matrix={props.matrix} />
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
        const rows = [];
        for (let i = 0; i < this.props.matrix.length; i++) {
            const cells = [];
            for (let j = 0; j < this.props.matrix[i].length; j++) {
                const headers = i + ' ' + j;
                let color = '';
                if (this.props.matrix[i][j] === true) {
                    color = 'green';
                }
                cells.push(<Cell headers={headers} key={headers} toggle={this.props.toggle} color={color} value={this.props.matrix[i][j]} />);
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

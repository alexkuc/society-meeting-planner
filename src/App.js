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
            if (newState.schedules.length === 1) {
                newState.selection = 0;
            }
            return newState;
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
            if (newState.selection !== null && newState.selection > 1) { // if more than one schedule exists
                newState.selection = newState.selection - 1;
            } else { // last schedule is removed; selection counter is reset
                newState.selection = null;
            }
            return newState;
        })
    }

    selectSchedule = (i) => {
        this.setState((prevState, props) => {
            const newState = Object.assign({}, prevState);
            newState.selection = Number(i);
            newState.report = null;
            return newState;
        });
    }

    report = () => {
        if (this.state.schedules.length === 0) {
            return;
        }

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
            newState.selection = null;
            return newState;
        });
    }

    render() {
        let matrix = this.state.init;
        if (typeof this.state.selection === 'number' && this.state.schedules.length > 0) {
            matrix = this.state.schedules[this.state.selection].matrix;
        }
        if (Array.isArray(this.state.report)) {
            matrix = this.state.report;
        }
        const is_reporting = this.state.report !== null;
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
                            selection={this.state.selection}
                            is_reporting={is_reporting}
                        />
                    </Row>
                </Grid>
                <div className="credits">
                    <span>Created by Alexander K.</span>
                </div>
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
                                selection={props.selection}
                            />)
    }
    return (
        <Col lg={3}>
            <Panel style={{textAlign: 'center', fontWeight: 'bold',}} >
                Society Meeting Planner App
            </Panel>
            <ButtonToolbar>
                <ButtonGroup justified>
                    <Button onClick={props.report} active={props.is_reporting}>Report</Button>
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
    handleRemoveSchedule = () => {
        this.props.removeSchedule(this.props.i);
    }

    handleChangeText = (e) => {
        this.props.updateScheduleName(this.props.i, e.target.value);
    }

    handleSelectSchedule = (e) => {
        this.props.selectSchedule(this.props.i);
    }

    render() {
        let is_active = false;
        if (this.props.selection === this.props.i) {
            is_active = true;
        }
        return (
            <FormGroup>
                <InputGroup>
                    <InputGroup.Button>
                        <Button onClick={this.handleSelectSchedule} active={is_active} value={this.props.i}>
                            <Glyphicon glyph="circle-arrow-right" />
                        </Button>
                    </InputGroup.Button>
                    <FormControl onChange={this.handleChangeText} type="text" value={this.props.schedule.name} />
                    <InputGroup.Button>
                        <Button onClick={this.handleRemoveSchedule} bsStyle="danger" value={this.props.i}>
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

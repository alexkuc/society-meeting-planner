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
            cells: Array(10).fill(false).map(() => Array(7).fill(false)),
            schedules: new Array(0),
            selection: null,
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

    addSchedule = () => {
        this.setState(() => {
            const newArr = this.state.schedules.slice();
            newArr.push('');
            return { schedules: newArr };
        });
    }

    updateSchedule = (i, value) => {
        this.setState(() => {
            const newArr = this.state.schedules.slice();
            newArr[i] = value;
            return { schedules: newArr };
        });
    }

    removeSchedule = (i) => {
        this.setState(() => {
            const newArr = this.state.schedules.slice();
            newArr.splice(i, 1);
            return { schedules: newArr };
        })
    }

    selectSchedule = (i) => {
        this.setState(() => {
            return { selection: i };
        });
    }

    report = () => {

    }

    render() {
        return (
            <div className="appWrapper"> 
                <Grid>
                    <Row>
                        <Col lg={6}>
                            <Table toggle={this.toggle} cells={this.state.cells} />
                        </Col>
                        <Navigation 
                            schedules={this.state.schedules}
                            selection={this.state.selection}
                            addSchedule={this.addSchedule}
                            updateSchedule={this.updateSchedule}
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

function Navigation(props){
    let schedules = [];
        for (let i = 0; i < props.schedules.length; i++) {
            schedules.push(<Schedule 
                                text={props.schedules[i]} 
                                updateSchedule={props.updateSchedule} 
                                removeSchedule={props.removeSchedule}
                                selectSchedule={props.selectSchedule} 
                                i={i} key={i} 
                            />)
    }
    return(
        <Col lg={3}>
            <Panel style={{textAlign: 'center'}} >
                Banner placeholder
            </Panel>
            <ButtonToolbar>
                <ButtonGroup justified>
                    <Button onClick={props.report}>Report</Button>
                    <Button onClick={props.addSchedule}>Add Schedule</Button>
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
        this.props.updateSchedule(this.props.i, e.target.value);
    }

    handleChangeRadio = (e) => {
        this.props.selectSchedule(e.target.value);
    }

    render() {
        return (
            <FormGroup>
                <InputGroup>
                    <InputGroup.Addon>
                        <input type="radio" name="radioGroup" value={this.props.i} onChange={this.handleChangeRadio} />
                    </InputGroup.Addon>
                    <FormControl onChange={this.handleChangeText} type="text" value={this.props.text} />
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

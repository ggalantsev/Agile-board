import React from "react";
import ReactDOM from "react-dom";
import client from "./client";
import * as console from "debug/src/browser";

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tickets: [], status: ''};
    }

    componentDidMount() {
        client({method: 'GET', path: "/api/tickets/search/findByStatus?status=" + this.state.status}).done(response => {
            this.setState({tickets: response.entity._embedded.tickets});
        });
    }

    render() {
        return (<div>
            <TicketList tickets={this.state.tickets}/>
            <AddTicketButton status={this.state.status}/>
        </div>)
    }
}

class TodoList extends List {
    constructor(props) {
        super(props);
        this.state = {tickets: [], status: 'TODO'};
    }

    componentWillMount() {
        TodoList.callback = (state) => {
            console.log("Updating TODO list");
            this.setState(state);
        };
    }
}
class InProgressList extends List {
    constructor(props) {
        super(props);
        this.state = {tickets: [], status: 'IN_PROGRESS'};
    }

    componentWillMount() {
        InProgressList.callback = (state) => {
            console.log("Updating IN_PROGRESS list");
            this.setState(state);
        };
    }
}
class DoneList extends List {
    constructor(props) {
        super(props);
        this.state = {tickets: [], status: 'DONE'};
    }

    componentWillMount() {
        DoneList.callback = (state) => {
            console.log("Updating DONE list");
            this.setState(state);
        };
    }
}

class TicketList extends React.Component {
    render() {
        var tickets = this.props.tickets.map(ticket =>
            <Ticket key={ticket._links.self.href} ticket={ticket}/>
        );
        return (<div>
                {tickets}
            </div>
        )
    }
}

class Ticket extends React.Component {
    render() {
        return (
            <a href={"#" + this.props.ticket._links.self.href} className="agile-ticket"
               data-toggle="modal" data-target="#editTicket"
               onClick={() => this.renderModal()}>{this.props.ticket.name}</a>
        )
    }
    renderModal() {
        ReactDOM.render(
            <TicketModalEdit ticket={this.props.ticket}/>,
            document.getElementById('ticketModalEdit')
        );
        TicketModalEdit.callback({ticket:this.props.ticket});
    }
}

class AddTicketButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <a href="#" className="btn btn-primary btn-sm btn-add"
                  data-toggle="modal" data-target="#addTicket"
                  onClick={() => this.renderModal(this.props.status)}>Add ticket</a>
    }

    renderModal(status) {
        ReactDOM.render(
            <TicketModalAdd status={status}/>,
            document.getElementById('ticketModalAdd')
        );
        TicketModalAdd.callback({status:this.props.status});
    }
}

class TicketModalAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {status:this.props.status, value:""};
    }

    componentWillMount() {
        TicketModalAdd.callback = (state) => {
            console.log("updating modal");
            this.setState(state);
        };
    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    save() {
        let xhr = new XMLHttpRequest();
        let url = "/api/tickets/";
        let statusOpt = document.getElementById("status");
        status = statusOpt.options[statusOpt.selectedIndex].value;
        let name = document.getElementById("name").value;
        let description = document.getElementById("description").value;
        document.getElementById("name").value = "";
        document.getElementById("description").value = "";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            updateListState(status);
            let resp = xhr.responseText;
            // console.log("DONE! " + resp + "\n" +
            //     xhr.readyState + " | " + xhr.status + " | ");
        };
        let data = JSON.stringify({"status": status, "name": name, "description": description});
        xhr.send(data);
    }

    render() {
        return (
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Add ticket</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form method="POST" action="#" content="application/json">
                        <div className="row">
                            <div className="form-group col-md">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name"/>
                            </div>
                            <div className="form-group col-md">
                                <label htmlFor="status">Status</label>
                                <select className="form-control" id="status" value={this.state.status} onChange={this.handleChange}>
                                    <option value="TODO">To do</option>
                                    <option value="IN_PROGRESS">In progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea className="form-control" id="description" rows="3"/>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                    <button onClick={() => this.save()} type="button" data-dismiss="modal"
                            className="btn btn-primary btn-sm">Save changes
                    </button>
                </div>
            </div>
        )
    }
}

class TicketModalEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {ticket:this.props.ticket, value:""};
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        TicketModalEdit.callback = (state) => {
            console.log("updating modal");
            this.setState(state);
        };
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    remove(){
        let xhr = new XMLHttpRequest();
        let url = this.state.ticket._links.self.href;
        let status = this.state.ticket.status;
        xhr.open("DELETE", url, true);
        xhr.onreadystatechange = function () {
            updateListState(status);
        };
        xhr.send();
    }

    save() {
        let xhr = new XMLHttpRequest();
        let url = this.state.ticket._links.self.href;
        let statusOld = this.state.ticket.status;
        let statusOptions = document.getElementById("status-edit");
        let status = statusOptions.options[statusOptions.selectedIndex].value;
        let name = document.getElementById("name-edit").value;
        let description = document.getElementById("description-edit").value;
        xhr.open("PATCH", url, true);
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.onreadystatechange = function () {
            updateListState(statusOld);// old status list
            updateListState(status);//new status list
        };
        let data = JSON.stringify({"status": status, "name": name, "description": description});
        xhr.send(data);
    }

    render() {
        return (
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLabel">Edit ticket</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div className="modal-body">
                    <form method="PATCH" action="#" content="application/json">
                        <div className="row">
                            <div className="form-group col-md">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name-edit" defaultValue={this.state.ticket.name} onChange={this.handleChange}/>
                            </div>
                            <div className="form-group col-md">
                                <label htmlFor="status">Status</label>
                                <select className="form-control" id="status-edit" defaultValue={this.state.ticket.status} onChange={this.handleChange}>
                                    <option value="TODO">To do</option>
                                    <option value="IN_PROGRESS">In progress</option>
                                    <option value="DONE">Done</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="description">Description</label>
                            <textarea className="form-control" id="description-edit" rows="3" defaultValue={this.state.ticket.description} onChange={this.handleChange}/>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button onClick={() => this.remove()} type="button" data-dismiss="modal"
                            className="btn btn-outline-danger btn-sm">Remove</button>
                    <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                    <button onClick={() => this.save()} type="button" data-dismiss="modal"
                            className="btn btn-primary btn-sm">Save changes</button>
                </div>
            </div>
        )
    }
}

function renderTicketLists() {
    ReactDOM.render(
        <TodoList/>,
        document.getElementById("todoList")
    );
    ReactDOM.render(
        <InProgressList/>,
        document.getElementById("inProgressList")
    );
    ReactDOM.render(
        <DoneList/>,
        document.getElementById("doneList")
    );
}
renderTicketLists();

function updateListState(s) {
    client({method: 'GET', path: "/api/tickets/search/findByStatus?status=" + s}).done(response => {
        switch (s) {
            case 'TODO':
                TodoList.callback({tickets: response.entity._embedded.tickets, status: 'TODO'});
                break;
            case 'IN_PROGRESS':
                InProgressList.callback({tickets: response.entity._embedded.tickets, status: 'IN_PROGRESS'});
                break;
            case 'DONE':
                DoneList.callback({tickets: response.entity._embedded.tickets, status: 'DONE'});
                break;
            default:
                console.log("update error");
        }
    });
}
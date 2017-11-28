// import React from "react";
// import ReactDOM from "react-dom";

const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {tickets: []};
    }

    componentDidMount() {
        client({method: 'GET', path: "/api/tickets/search/findByStatus?status=" + this.props.status}).done(response => {
            this.setState({tickets: response.entity._embedded.tickets});
        });
    }

    render() {
        // alert('list ' + this.props.status)
        return (<div>
            <TicketList tickets={this.state.tickets}/>
            <AddTicket status={this.props.status}/>
        </div>)
    }
}

class AddTicket extends React.Component {
    constructor(props) {
        super(props);
        // this.renderModal = this.renderModal.bind(this);
    }

    render() {
        return <a href="#addDone" className="btn btn-primary btn-sm btn-add"
                  data-toggle="modal" data-target="#addTicket"
                  onClick={() => this.renderModal()}>Add ticket</a>
    }

    renderModal() {
        ReactDOM.render(
            <TicketModalContent status={this.props.status}/>,
            document.getElementById('ticketModalContent')
        )
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
            <a href={'modal-' + this.props.ticket._links.self.href}
               className="agile-ticket">{this.props.ticket.name}</a>
        )
    }
}

ReactDOM.render(
    <List status="TODO"/>,
    document.getElementById('todoList')
);
ReactDOM.render(
    <List status="IN_PROGRESS"/>,
    document.getElementById('inProgressList')
);
ReactDOM.render(
    <List status="DONE"/>,
    document.getElementById('doneList')
);


class TicketModalContent extends React.Component {
    constructor(props) {
        super(props);
    }

    // componentDidMount() {
    //     alert("mounted");
    // }

    save() {
        alert("saving");
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
                    <form>
                        <div className="row">
                            <div className="form-group col-md">
                                <label htmlFor="name">Name</label>
                                <input type="text" className="form-control" id="name"/>
                            </div>
                            <div className="form-group col-md">
                                <label htmlFor="status">Status</label>
                                <select className="form-control" id="status" value={this.props.status} readOnly>
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
                    {/*<button onClick={() => this.remove()} type="button" className="btn btn-outline-danger btn-sm">Remove</button>*/}
                    <button type="button" className="btn btn-secondary btn-sm" data-dismiss="modal">Close</button>
                    <button onClick={() => this.save()} type="button" className="btn btn-primary btn-sm">Save changes</button>
                </div>
            </div>
        )
    }
}


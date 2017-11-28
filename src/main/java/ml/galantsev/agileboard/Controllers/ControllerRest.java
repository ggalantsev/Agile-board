package ml.galantsev.agileboard.Controllers;

import ml.galantsev.agileboard.Entity.Ticket;
import ml.galantsev.agileboard.Entity.TicketStatus;
import ml.galantsev.agileboard.Repository.TicketRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ControllerRest {

    @Autowired
    TicketRepo ticketRepo;

    @RequestMapping("/all")
    public List<Ticket> allTickets(){
        return ticketRepo.findAll();
    }

    @RequestMapping(value = "/api/find", method = RequestMethod.GET)
    public List<Ticket> name(@RequestParam String name){
        return ticketRepo.findByNameContainingIgnoreCase(name);
    }

    @RequestMapping("/done")
    public List<Ticket> doneTickets(){
        return ticketRepo.findByStatus(TicketStatus.DONE);
    }

    @RequestMapping("/in-progress")
    public List<Ticket> inProgressTickets(){
        return ticketRepo.findByStatus(TicketStatus.IN_PROGRESS);
    }

    @RequestMapping("/todo")
    public List<Ticket> todoTickets(){
        return ticketRepo.findByStatus(TicketStatus.TODO);
    }
}

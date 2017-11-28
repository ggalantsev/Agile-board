package ml.galantsev.agileboard.Repository;

import ml.galantsev.agileboard.Entity.Ticket;
import ml.galantsev.agileboard.Entity.TicketStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface TicketRepo extends MongoRepository<Ticket,String> {

    public List<Ticket> findByNameContainingIgnoreCase(@Param("name") String name);
    public List<Ticket> findByStatus(@Param("status") TicketStatus status);

}

package ml.galantsev.agileboard.Controllers;

import org.springframework.web.bind.annotation.RequestMapping;

@org.springframework.stereotype.Controller
public class Controller {

    @RequestMapping("/")
    public String login(){
        return "login";
    }

    @RequestMapping("/dashboard")
    public String dashboard(){
        return "dashboard";
    }
}

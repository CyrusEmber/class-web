package com.ke;

public class StudentNotFoundException extends RuntimeException{
    public StudentNotFoundException(Integer id){
        super("404: could not find student" + id);
    }

}

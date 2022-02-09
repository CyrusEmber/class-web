package com.ke;

import org.hibernate.annotations.Cascade;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;


@Entity // These tell Hibernate to make a table out of this class
public class Student {
    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    @Column(name = "id")
    private Integer id;
    @Column(name = "name")
    private String name;
    @Column(name = "grade")
    private String grade;
    @Column(name = "payment")
    private int payment;
    @Column(name = "payment_per_class")
    private int paymentPerClass;
    @Column(name = "date")
    private String date;
    @OneToMany(targetEntity=ClassDetail.class, cascade=CascadeType.ALL)
    /*, nullable = false, insertable=false, updatable=false)
    @Cascade(org.hibernate.annotations.CascadeType.MERGE)*/
    private List<ClassDetail> classDetail;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public int getPayment() {
        return payment;
    }

    public void setPayment(int payment) {
        this.payment = payment;
    }

    public void setPaymentPerClass(int paymentPerClass) {
        this.paymentPerClass = paymentPerClass;
    }

    public int getPaymentPerClass() {
        return paymentPerClass;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public List<ClassDetail> getClassDetail() {
        return classDetail;
    }

    public void setClassDetail(List<ClassDetail> classDetails) {
        this.classDetail = classDetails;
    }
}


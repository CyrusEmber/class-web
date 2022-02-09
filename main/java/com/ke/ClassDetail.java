package com.ke;

import javax.persistence.*;

@Entity
@Table (name="class_detail")
public class ClassDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Integer classId;
    @Column(name = "stu_id")
    private Integer id;
    @Column(name = "name") // Student name
    private String name;
    @Column(name = "start")
    private String start;
    @Column(name = "_end")
    private String _end;
    @Column(name = "title")
    private String title;
    @Column(name = "color")
    private String color;
    @Column(name = "description")
    private String description;
    @Column(name = "homework")
    private String homework;
    @Column(name = "recursive")
    private boolean recursive;

//    @ManyToOne(fetch = FetchType.LAZY, cascade=CascadeType.ALL)
//    @JoinColumn(name = "stu_id", nullable = false, insertable = false, updatable = false)
//    private Student student;
//    @ManyToOne(cascade = CascadeType.ALL, optional = false)
//    @JoinColumn(name="country_id")
//    private Country country;

    public Integer getClassId() {
        return classId;
    }

    public void setClassId(Integer classId) {
        this.classId = classId;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String get_end() {
        return _end;
    }

    public void set_end(String _end) {
        this._end = _end;
    }

    public String getHomework() {
        return homework;
    }

    public void setHomework(String homework) {
        this.homework = homework;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getStart() {
        return start;
    }

    public void setStart(String start) {
        this.start = start;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public boolean getRecursive() {
        return recursive;
    }

    public void setRecursive(boolean recursive) {
        this.recursive = recursive;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

/*    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }*/
}


package com.ke;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;


public interface StudentRepository extends CrudRepository<Student, Integer> {
    // TODO error handle

    default Integer findIdByName(String name) {
        Iterable<Student> students = findAll();
        Integer id = 0;
        for (Student student : students) {
            if (student.getName() != null && student.getName().equalsIgnoreCase(name))
                id = student.getId();
        }
        return id;
    }

    default Iterable<Student> findByPrefix(String str) {
        Iterable<Student> students = findAll();
        List<Student> selectedStudent = new ArrayList<>();
        for (Student student : students) {
            if (student.getName() != null && student.getName().toLowerCase().contains(str.toLowerCase()))
                selectedStudent.add(student);
        }
        return selectedStudent;
    }

    default Iterable<ClassDetail> findAllByClassDetails() {
        List<ClassDetail> classDetailList = new ArrayList<>();
        Iterable<Student> students = findAll();
        for (Student student : students) {
            classDetailList.addAll(student.getClassDetail());
        }
        return classDetailList;
    }

    default Optional<Student> deleteByClassId(String name, Integer classId) {
        return findById(findIdByName(name))
                .map(student -> {
                    student.getClassDetail().removeIf(classDetail -> Objects.equals(classDetail.getClassId(), classId));
                    return save(student);
                });
    }

    @Query(value = "SELECT DISTINCT student_id FROM student_class_detail s WHERE s.class_id = :classId",  nativeQuery = true)
    Integer findStuIdByClassId(@Param("classId") Integer classId);

    default Optional<Student> addClass(ClassDetail classDetail) {
        List<ClassDetail> classDetails = new ArrayList<>();
        Student student = new Student();

        Integer stu_id = findIdByName(classDetail.getName());
        if (stu_id != 0) classDetail.setId(stu_id); // find the correspondent student by name
        if (stu_id == 0) {
            student.setName(classDetail.getName());
            classDetails.add(classDetail);
            student.setClassDetail(classDetails);
            return Optional.of(save(student));
        }

        if (classDetail.getClassId() == null) {
            // do not update
            return Optional.of(findById(stu_id).map(student_ -> {
                student_.getClassDetail().add(classDetail);
                return save(student_);
            }).orElseGet(() -> {
                student.setName(classDetail.getName());
                classDetails.add(classDetail);
                student.setClassDetail(classDetails);
                return save(student);
            }));
        }
        else {
            return findById(stu_id).map(student1 -> {
                for (ClassDetail updateClass:student1.getClassDetail()) {
                    // update
                    if (updateClass.getClassId().equals(classDetail.getClassId())) {
                        updateClass.setName(classDetail.getName());
                        updateClass.setTitle(classDetail.getTitle());
                        updateClass.setStart(classDetail.getStart());
                        // if (classDetail.get_end() != null)
                        updateClass.set_end(classDetail.get_end());
                        updateClass.setColor(classDetail.getColor());
                        updateClass.setHomework(classDetail.getHomework());
                        updateClass.setRecursive(classDetail.getRecursive());
                        updateClass.setDescription(classDetail.getDescription());
                        break;
                    }
                }
                return save(student1);
            });
        }

    }

    @Query(value = "SELECT * FROM class_detail c WHERE c.class_id = :classId",  nativeQuery = true)
    Optional<ClassDetail> findEventByClassId(@Param("classId") Integer classId);


}

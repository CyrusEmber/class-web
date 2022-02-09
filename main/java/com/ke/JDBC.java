package com.ke;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class JDBC {
    public static final String user = "postgres";
    public static final String password = "daohaomei77";
    public static final String url = "jdbc:postgresql://localhost:5432/postgres";

    public static void main(String[] args) throws SQLException {
        Connection conn = null;


        //FIXME need to load driver later
        try {
            long start =System.currentTimeMillis();
            // Class.forName("com.postgres.jdbc.Driver");
            conn = DriverManager.getConnection(url, user, password);
            long end =System.currentTimeMillis();
            System.out.println(conn);
            System.out.println("Ping： " + (end - start) + "ms");
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }


}

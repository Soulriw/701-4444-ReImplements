package com.quadgrimoire.config;

import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategy;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

public class CaseSensitiveNamingStrategy implements PhysicalNamingStrategy {
    
    @Override
    public Identifier toPhysicalCatalogName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return name;
    }
    
    @Override
    public Identifier toPhysicalSchemaName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return name;
    }
    
    @Override
    public Identifier toPhysicalTableName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        // Return the identifier as-is without any transformation
        return name;
    }
    
    @Override
    public Identifier toPhysicalSequenceName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        return name;
    }
    
    @Override
    public Identifier toPhysicalColumnName(Identifier name, JdbcEnvironment jdbcEnvironment) {
        // Return the identifier as-is without any transformation
        return name;
    }
}


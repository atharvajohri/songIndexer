dataSource {
    pooled = true
    driverClassName = "org.hsqldb.jdbcDriver"
    username = "sa"
    password = ""
}
hibernate {
    cache.use_second_level_cache = true
    cache.use_query_cache = true
    cache.provider_class = 'net.sf.ehcache.hibernate.EhCacheProvider'
}
// environment specific settings
environments {
    development {
        dataSource {
//            dbCreate = "create-drop" // one of 'create', 'create-drop','update'
//            url = "jdbc:hsqldb:mem:devDB"
			pooled = true
			dbCreate = "update"
			url = "jdbc:mysql://localhost/tracksdb"
			driverClassName = "com.mysql.jdbc.Driver"
			username = "root"
			password = "root"
			properties {
				maxActive = 50
				maxIdle = 25
				minIdle = 10
				initialSize = 10
				minEvictableIdleTimeMillis = 1200000
				timeBetweenEvictionRunsMillis = 1200000
				maxWait = 10000
			}
        }
    }
    test {
        dataSource {
            dbCreate = "update"
            url = "jdbc:hsqldb:mem:testDb"
        }
    }
    production {
        dataSource {
            dbCreate = "update"
            url = "jdbc:hsqldb:file:prodDb;shutdown=true"
        }
    }
}

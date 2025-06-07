import { TypeOrmModuleOptions } from "@nestjs/typeorm";

// TypeOrmModuleOptions 을 붙이면 타입 안정성 때문에 실수로 오타를 내도 컴파일러가 오류를 잡아준다! ex) port가 number인걸 알려준다던가가
export const typeORMConfig : TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'dev',
    password: '1568',
    database: 'escro_table',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true
}
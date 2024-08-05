import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class ProdService implements TypeOrmOptionsFactory {

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      // url: "postgresql://db_blogpessoal_hug8_user:ms1FBX6PAa0V8zkGSyYxm1XCd5AhrW9C@dpg-cqoi420gph6c73b9vu7g-a.ohio-postgres.render.com/db_blogpessoal_hug8",
      url: process.env.DATABASE_URL,
      logging: false,
      dropSchema: false,
      ssl: {
        rejectUnauthorized: false,
      },
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
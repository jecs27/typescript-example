import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseData1716078032751 implements MigrationInterface {
  name = 'BaseData1716078032751';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE TYPE "public"."tasks_priority_enum" AS ENUM("LOW", "MEDIUM", "HIGH", "CRITICAL")');
    await queryRunner.query('CREATE TABLE "tasks" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "id" SERIAL NOT NULL, "user_uuid" uuid NOT NULL, "title" character varying(100) NOT NULL, "description" text, "completed" boolean NOT NULL DEFAULT false, "priority" "public"."tasks_priority_enum" NOT NULL, "due_date" TIMESTAMP, CONSTRAINT "PK_91138888a265b49f33d3a9b0d88" PRIMARY KEY ("uuid", "id"))');
    await queryRunner.query('CREATE INDEX "IDX_0a1551b768063582faf585b87c" ON "tasks" ("user_uuid") ');
    await queryRunner.query('CREATE TABLE "users" ("uuid" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "username" character varying(50) NOT NULL, "password" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, CONSTRAINT "UQ_450a05c0c4de5b75ac8d34835b9" UNIQUE ("password"), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_951b8f1dfc94ac1d0301a14b7e1" PRIMARY KEY ("uuid"))');
    await queryRunner.query('CREATE INDEX "IDX_97672ac88f789774dd47f7c8be" ON "users" ("email") ');
    await queryRunner.query('ALTER TABLE "tasks" ADD CONSTRAINT "FK_0a1551b768063582faf585b87c7" FOREIGN KEY ("user_uuid") REFERENCES "users"("uuid") ON DELETE CASCADE ON UPDATE NO ACTION');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "tasks" DROP CONSTRAINT "FK_0a1551b768063582faf585b87c7"');
    await queryRunner.query('DROP INDEX "public"."IDX_97672ac88f789774dd47f7c8be"');
    await queryRunner.query('DROP TABLE "users"');
    await queryRunner.query('DROP INDEX "public"."IDX_0a1551b768063582faf585b87c"');
    await queryRunner.query('DROP TABLE "tasks"');
    await queryRunner.query('DROP TYPE "public"."tasks_priority_enum"');
  }
}

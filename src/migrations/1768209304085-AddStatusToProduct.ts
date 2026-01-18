import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStatusToProduct1768209304085 implements MigrationInterface {
    name = 'AddStatusToProduct1768209304085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "status" character varying NOT NULL DEFAULT 'AVAILABLE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "status"`);
    }

}

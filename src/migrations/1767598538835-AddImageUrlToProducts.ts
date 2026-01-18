import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageUrlToProducts1767598538835 implements MigrationInterface {
    name = 'AddImageUrlToProducts1767598538835'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "imageUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "imageUrl"`);
    }

}

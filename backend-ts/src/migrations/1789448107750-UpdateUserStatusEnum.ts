import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserStatusEnum1789448107750 implements MigrationInterface {
    name = 'UpdateUserStatusEnum1789448107750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "createdAt" TO "created_at"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "created_at" TO "createdAt"`);
    }

}

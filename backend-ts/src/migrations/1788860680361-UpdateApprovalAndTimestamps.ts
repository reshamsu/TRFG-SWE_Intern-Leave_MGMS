import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateApprovalAndTimestamps1788860680361 implements MigrationInterface {
    name = 'UpdateApprovalAndTimestamps1788860680361'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leave_requests" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "leave_requests" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "leave_requests" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "leave_requests" DROP COLUMN "created_at"`);
    }

}

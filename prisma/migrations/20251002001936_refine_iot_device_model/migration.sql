/*
  Warnings:

  - You are about to drop the column `status` on the `IoTDevice` table. All the data in the column will be lost.
  - Added the required column `name` to the `IoTDevice` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."IoTDevice" DROP CONSTRAINT "IoTDevice_deviceId_fkey";

-- AlterTable
ALTER TABLE "public"."EnergyConsumption" ADD COLUMN     "areaId" TEXT,
ADD COLUMN     "propertyId" TEXT,
ALTER COLUMN "deviceId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "public"."IoTDevice" DROP COLUMN "status",
ADD COLUMN     "areaId" TEXT,
ADD COLUMN     "lastConnectedAt" TIMESTAMP(3),
ADD COLUMN     "lastDisconnectedAt" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "online" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "propertyId" TEXT,
ALTER COLUMN "deviceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."IoTDevice" ADD CONSTRAINT "IoTDevice_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IoTDevice" ADD CONSTRAINT "IoTDevice_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IoTDevice" ADD CONSTRAINT "IoTDevice_deviceId_fkey" FOREIGN KEY ("deviceId") REFERENCES "public"."Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EnergyConsumption" ADD CONSTRAINT "EnergyConsumption_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "public"."Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."EnergyConsumption" ADD CONSTRAINT "EnergyConsumption_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "public"."Area"("id") ON DELETE CASCADE ON UPDATE CASCADE;

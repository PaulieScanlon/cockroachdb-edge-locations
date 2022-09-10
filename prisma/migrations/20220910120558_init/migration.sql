-- CreateTable
CREATE TABLE "locations" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "date" DATE NOT NULL,
    "city" STRING NOT NULL,
    "lat" DECIMAL(65,30) NOT NULL,
    "lng" DECIMAL(65,30) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "date" DATE NOT NULL,
    "city" STRING NOT NULL,
    "lat" INT4 NOT NULL,
    "lng" FLOAT8 NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

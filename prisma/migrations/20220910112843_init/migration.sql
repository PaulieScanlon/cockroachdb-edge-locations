-- CreateTable
CREATE TABLE "locations" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "city" STRING NOT NULL,
    "lat" INT4 NOT NULL,
    "lng" INT4 NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

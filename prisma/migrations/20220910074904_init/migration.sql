-- CreateTable
CREATE TABLE "user_dates" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "location_id" INT8 NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "user_dates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dates" (
    "id" INT8 NOT NULL DEFAULT unique_rowid(),
    "date" DATE NOT NULL,
    "location" STRING NOT NULL,

    CONSTRAINT "dates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "user_dates_date" ON "user_dates"("date");

-- CreateIndex
CREATE INDEX "user_dates_location_id" ON "user_dates"("location_id");

-- AddForeignKey
ALTER TABLE "user_dates" ADD CONSTRAINT "fk_location" FOREIGN KEY ("location_id") REFERENCES "dates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

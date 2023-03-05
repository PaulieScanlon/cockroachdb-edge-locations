CREATE TABLE locations (
  id       UUID DEFAULT gen_random_uuid() PRIMARY KEY,         
  date     DATE,         
  city     VARCHAR,
  lat      DECIMAL,
  lng      DECIMAL,
  runtime  VARCHAR
);
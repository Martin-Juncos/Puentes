ALTER TABLE "AppSettings"
ALTER COLUMN "institutionalPhone" SET DEFAULT '+54 9 3777 679100';

ALTER TABLE "AppSettings"
ALTER COLUMN "whatsappUrl" SET DEFAULT 'https://wa.me/5493777679100?text=Hola%20Puentes';

UPDATE "AppSettings"
SET
  "institutionalPhone" = CASE
    WHEN "institutionalPhone" = '+54 11 5555 0000' THEN '+54 9 3777 679100'
    ELSE "institutionalPhone"
  END,
  "whatsappUrl" = CASE
    WHEN "whatsappUrl" = 'https://wa.me/5491100000000?text=Hola%20Puentes' THEN 'https://wa.me/5493777679100?text=Hola%20Puentes'
    ELSE "whatsappUrl"
  END
WHERE "id" = 'main';

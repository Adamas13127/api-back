// Fichier de configuration TypeORM dédié aux commandes CLI (migrations, etc.).
// Il charge le .env puis instancie un DataSource avec les mêmes paramètres que l'app Nest.
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

config({
  // On charge le .env à la racine du projet (deux niveaux au-dessus de ce fichier)
  path: join(__dirname, '..', '..', '.env'),
});

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS || undefined,
  database: process.env.DB_NAME,
  // On prend toutes les entités du dossier src
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  // Dossier où se trouvent / se créeront les fichiers de migration
  migrations: [join(__dirname, '..', 'migrations', '*.{ts,js}')],
  // Pour les migrations on laisse synchronize à false (bonne pratique)
  synchronize: false,
  // SSL activé pour compatibilité avec certains hébergeurs (ex: Render, Railway)
  ssl: { rejectUnauthorized: false },
});

export default dataSource;


import winston from 'winston';
import { env } from '../config/env';

// Definisikan format warna khusus untuk console di mode development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaString = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] [${level}]: ${message} ${metaString}`;
  })
);

// Definisikan format standar untuk file log (tanpa warna ANSI)
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.json()
);

// Inisialisasi Winston Logger
const transportsList: winston.transport[] = [
  // Selalu tampilkan log ke console terminal
  new winston.transports.Console({
    format: env.NODE_ENV === 'development' ? consoleFormat : fileFormat,
  }),
];

// Jika berada di mode production atau ingin mencatat ke file secara permanen
if (env.NODE_ENV === 'production') {
  transportsList.push(
    // Simpan semua log error khusus ke file error.log
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    // Simpan semua log gabungan (info, warn, error) ke file combined.log
    new winston.transports.File({ filename: 'logs/combined.log' })
  );
}

export const logger = winston.createLogger({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  format: fileFormat,
  transports: transportsList,
  // Mencegah logger crash jika terjadi exception tak terduga
  exitOnError: false,
});
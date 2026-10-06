// Thin DB layer: swap this file for Postgres later; routes only use run/get/all.
import Database from 'better-sqlite3';
import { config } from './config.js';
const d=new Database(config.db);d.pragma('journal_mode = WAL');
d.exec(`CREATE TABLE IF NOT EXISTS users(id INTEGER PRIMARY KEY,name TEXT,email TEXT UNIQUE,phone TEXT,password TEXT,role TEXT,active INTEGER DEFAULT 1,status TEXT DEFAULT 'Available',rating REAL DEFAULT 4.8);
CREATE TABLE IF NOT EXISTS services(id INTEGER PRIMARY KEY,name TEXT,description TEXT,price INTEGER,duration INTEGER,active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS coupons(code TEXT PRIMARY KEY,type TEXT,value INTEGER,active INTEGER DEFAULT 1);
CREATE TABLE IF NOT EXISTS subscription_plans(id INTEGER PRIMARY KEY,name TEXT,price INTEGER,washes INTEGER,features TEXT);
CREATE TABLE IF NOT EXISTS bookings(id TEXT PRIMARY KEY,user_id INTEGER,technician_id INTEGER,service_id INTEGER,vehicle_type TEXT,vehicle_model TEXT,reg_no TEXT,addons TEXT,address TEXT,city TEXT,pincode TEXT,date TEXT,slot TEXT,name TEXT,phone TEXT,email TEXT,subtotal INTEGER,discount INTEGER,tax INTEGER,total INTEGER,coupon TEXT,payment_method TEXT,payment_status TEXT,status TEXT DEFAULT 'Confirmed',checklist TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS reviews(id INTEGER PRIMARY KEY,booking_id TEXT UNIQUE,rating INTEGER,text TEXT);
CREATE TABLE IF NOT EXISTS notifications(id INTEGER PRIMARY KEY,user_id INTEGER,message TEXT,created_at TEXT DEFAULT CURRENT_TIMESTAMP);`);
export const run=(s,...p)=>d.prepare(s).run(...p),get=(s,...p)=>d.prepare(s).get(...p),all=(s,...p)=>d.prepare(s).all(...p);

import 'dotenv/config';
export const config={port:+process.env.PORT||4000,jwt:process.env.JWT_SECRET||'dev-only-secret',db:process.env.DB_PATH||'../database/autoshine.db',origin:process.env.CLIENT_ORIGIN||'http://localhost:5173',demo:process.env.DEMO_MODE!=='false',tax:+process.env.TAX_RATE||0.18,
brand:{name:process.env.BRAND_NAME||'AutoShine',tagline:process.env.BRAND_TAGLINE||'Professional Car Care. At Your Doorstep.',phone:process.env.BUSINESS_PHONE||'',whatsapp:process.env.WHATSAPP_NUMBER||'',email:process.env.BUSINESS_EMAIL||'',city:process.env.CITY||''}};

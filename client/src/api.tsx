import {createContext,useContext,useState,ReactNode,useCallback} from 'react';
export type User={id:number;name:string;email:string;role:'customer'|'technician'|'admin'};
export async function api<T=any>(path:string,opts:{method?:string;body?:unknown}={}):Promise<T>{
  const t=localStorage.getItem('token');
  let res:Response;try{res=await fetch('/api'+path,{method:opts.method||'GET',headers:{'Content-Type':'application/json',...(t?{Authorization:'Bearer '+t}:{})},body:opts.body?JSON.stringify(opts.body):undefined})}catch{throw new Error('Network error – check your connection and retry')}
  const j=await res.json().catch(()=>({success:false,error:'Unexpected server response'}));if(!j.success)throw new Error(j.error||'Request failed');return j.data}
const Ctx=createContext<any>(null);export const useApp=()=>useContext(Ctx);
export function Provider({children}:{children:ReactNode}){
  const [user,setUser]=useState<User|null>(()=>{try{return JSON.parse(localStorage.getItem('user')||'null')}catch{return null}});
  const [toast,setToast]=useState<{m:string;ok:boolean}|null>(null);
  const notify=useCallback((m:string,ok=true)=>{setToast({m,ok});setTimeout(()=>setToast(null),3500)},[]);
  const login=(d:{token:string;user:User})=>{localStorage.setItem('token',d.token);localStorage.setItem('user',JSON.stringify(d.user));setUser(d.user)};
  const logout=()=>{localStorage.clear();setUser(null)};
  return <Ctx.Provider value={{user,login,logout,notify}}>{children}{toast&&<div role="status" className={`fixed bottom-20 left-1/2 z-50 -translate-x-1/2 rounded-xl px-5 py-3 text-white shadow-lg ${toast.ok?'bg-emerald-600':'bg-red-600'}`}>{toast.m}</div>}</Ctx.Provider>}

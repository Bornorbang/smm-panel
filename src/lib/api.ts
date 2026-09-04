export const API_URL=process.env.NEXT_PUBLIC_API_URL||"/backend-api";
export async function api<T>(path:string,options:RequestInit={}):Promise<T>{const response=await fetch(`${API_URL}${path}`,{...options,credentials:"include",headers:{"Content-Type":"application/json",...options.headers}});const data=await response.json().catch(()=>({}));if(!response.ok){if(response.status===423&&typeof window!=="undefined")window.dispatchEvent(new CustomEvent("account-locked"));throw new Error(data.error||"Request failed.")}return data as T}
export type User={id:number;name:string;email:string;role?:"admin"|"user";locked?:number;created_at:string};
export type Service={service:number;name:string;type:string;category:string;rate:string;min:string;max:string;refill:boolean;cancel:boolean};
export type Order={id:number;service_id:number;service_name:string;category:string;link:string;quantity:number;status:string;charge:string;currency:string;start_count:string;remains:string;can_refill:number;can_cancel:number;created_at:string;updated_at:string};
export type Refill={id:number;order_id:number;service_name:string;status:string;created_at:string};

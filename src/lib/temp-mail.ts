export type Inbox={id:number;email:string;status:string;price_paid:string;created_at:string;expires_at:string};
export type MailMessage={id:string;sender:string;subject:string;preview:string;text?:string};
export type MailStatus={inboxes:Inbox[];price_ngn:string;balance:string};
export const mailDate=(value:string)=>new Date(value).toLocaleString("en-GB",{timeZone:"Europe/London",dateStyle:"medium",timeStyle:"short"});
export const mailDay=(value:string)=>new Intl.DateTimeFormat("en-CA",{timeZone:"Europe/London",year:"numeric",month:"2-digit",day:"2-digit"}).format(new Date(value));
export const mailMoney=(value:string|number)=>new Intl.NumberFormat("en-NG",{style:"currency",currency:"NGN"}).format(Number(value));

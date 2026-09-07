import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/public-shell";

export const metadata:Metadata={title:"SMM Panel API Documentation",description:"Integrate SMM Panel Nigeria services, Naira wallet orders, tracking, and refills into your reseller platform."};
const Code=({children}:{children:string})=><pre className="api-code"><code>{children}</code></pre>;
const params=(rows:string[][])=><table><thead><tr><th>Parameter</th><th>Use</th><th>Description</th></tr></thead><tbody>{rows.map(([name,use,description])=><tr key={name}><td><code>{name}</code></td><td>{use}</td><td>{description}</td></tr>)}</tbody></table>;

export default function ApiDocs(){return <PublicShell><section className="page-hero api-docs-hero"><div className="shell"><span className="eyebrow">Developers</span><h1>Reseller API documentation</h1><p>Offer SMM Panel Nigeria services through your own platform using a straightforward HTTP API.</p><div className="hero-actions"><Link className="button" href="/dashboard/api">Get your API key</Link></div></div></section>
<section className="section-pad api-docs"><div className="shell api-docs-layout"><aside><nav><a href="#connection">Connection</a><a href="#services">Services</a><a href="#add">Add order</a><a href="#status">Order status</a><a href="#refill">Refills</a><a href="#balance">Balance</a><a href="#errors">Errors</a></nav></aside><article>
<section id="connection"><h2>Connection</h2><p>Send form-encoded POST requests from your backend. JSON bodies and <code>Authorization: Bearer YOUR_API_KEY</code> are also accepted. Never expose your key in frontend code.</p><div className="api-facts"><div><span>HTTP method</span><strong>POST</strong></div><div><span>API URL</span><strong>https://app.smmpanel.ng/api/v2</strong></div><div><span>Response</span><strong>JSON</strong></div><div><span>Currency</span><strong>NGN</strong></div></div><Code>{`curl -X POST https://app.smmpanel.ng/api/v2 \\\n  -d "key=YOUR_API_KEY" \\\n  -d "action=balance"`}</Code></section>
<section id="services"><h2>Service list</h2>{params([["key","Required","Your API key."],["action","Required","Use services."]])}<Code>{`[{
  "service": 101,
  "name": "Instagram Followers",
  "type": "Default",
  "category": "Instagram",
  "rate": "2500.00",
  "min": "100",
  "max": "10000",
  "refill": true,
  "cancel": false
}]`}</Code><p>Rates are the current retail price per 1,000 units in Naira.</p></section>
<section id="add"><h2>Add order</h2>{params([["key","Required","Your API key."],["action","Required","Use add."],["service","Required","Service ID from the service list."],["link","Required","Public profile, post, video, or page URL."],["quantity","Required*","Quantity within the service limits."],["runs","Optional","Drip-feed runs when supported."],["interval","Optional","Minutes between runs."]])}<p>*Package, custom-comment, and subscription services can require different fields according to their returned type.</p><Code>{`curl -X POST https://app.smmpanel.ng/api/v2 \\
  -d "key=YOUR_API_KEY" \\
  -d "action=add" \\
  -d "service=101" \\
  -d "link=https://example.com/public-post" \\
  -d "quantity=1000"

{ "order": 23501 }`}</Code><p>The response contains your local order ID. Your Naira wallet is charged before submission, and failed submissions are refunded automatically.</p></section>
<section id="status"><h2>Order status</h2><p>Use <code>order</code> for one order or <code>orders</code> for up to 100 comma-separated IDs.</p><Code>{`key=YOUR_API_KEY&action=status&order=23501

{
  "charge": "1250.00",
  "start_count": "3572",
  "status": "In progress",
  "remains": "157",
  "currency": "NGN"
}`}</Code><Code>{`key=YOUR_API_KEY&action=status&orders=23501,23502`}</Code></section>
<section id="refill"><h2>Refills</h2><p>Only orders whose service has <code>refill: true</code> are eligible. Use <code>order</code> or up to 100 comma-separated <code>orders</code>.</p><Code>{`key=YOUR_API_KEY&action=refill&order=23501

{ "refill": "81" }`}</Code><p>Check one refill with <code>refill</code>, or multiple IDs with <code>refills</code>.</p><Code>{`key=YOUR_API_KEY&action=refill_status&refill=81

{ "status": "Completed" }`}</Code></section>
<section id="balance"><h2>User balance</h2><Code>{`key=YOUR_API_KEY&action=balance

{
  "balance": "15000.00",
  "currency": "NGN"
}`}</Code></section>
<section id="errors"><h2>Errors and limits</h2><p>Errors return JSON with an <code>error</code> field and an appropriate HTTP status.</p><Code>{`{ "error": "Insufficient wallet balance. Please fund your wallet before placing this order." }`}</Code><p>The limit is 120 requests per minute per account. Cancellation is unavailable; validate the service, link, and quantity before submitting an order.</p></section>
</article></div></section></PublicShell>}

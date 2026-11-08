// Read-only production regression: compare menus to ToqueHub, independently of dates health.
import assert from 'node:assert/strict';
import {mkdir, writeFile} from 'node:fs/promises';
import {buildBrunchMenuResponse} from '../lib/brunch-widget.ts';
const site = process.env.SITE_URL || 'https://kahvilathefrench.cafe';
const upstream = process.env.TOQUEHUB_RESERVATIONS_API_BASE || 'https://toquehub.tailb29047.ts.net:8443';
const output = process.env.EVIDENCE_DIR;
async function get(base,path) {
 const response=await fetch(new URL(path,base),{cache:'no-store',signal:AbortSignal.timeout(25000)});
 assert.equal(response.status,200,`${path}: HTTP ${response.status}`);
 const body=await response.json();
 return {body,requestId:response.headers.get('x-nf-request-id')};
}
if(output) await mkdir(output,{recursive:true});
const dates=(await get(site,'/api/brunch/dates')).body;
assert.equal(dates.ok,true);
assert.equal(dates.offer.pricePerPerson,45);
assert.ok(dates.items.length>0);
const evidence=[];
for (const locale of ['fr','en','fi']) {
 const {body:offer}=await get(upstream,`/api/public/v1/reservations/offers/brunch?locale=${locale}`);
 for (const {date,slots} of dates.items) {
  assert.deepEqual(slots,['10:45','13:00']);
  const source=offer.dates.find(d=>d.date===date);
  assert.equal(source.occurrences.length,2);
  const first=source.occurrences[0].menu;
  assert.equal(first.status,'PUBLISHED');
  for (const occurrence of source.occurrences) {
   assert.equal(occurrence.menu.id,first.id);
   assert.deepEqual(occurrence.menu.items,first.items);
   assert.ok(occurrence.menu.items.every(i=>i.catalogMonth===Number(date.slice(5,7))));
   for (const item of occurrence.menu.items) {
    assert.equal(item.publicDisplay.complete,true);
    assert.equal(item.publicDisplay.locale,locale);
    assert.equal(item.publicDisplay.name,item.publicContent.name[locale]);
   }
  }
  const expected=buildBrunchMenuResponse(offer,date,locale);
  const {body:actual,requestId}=await get(site,`/api/brunch/menu?date=${date}&locale=${locale}`);
  assert.deepEqual(actual,expected);
  assert.ok(actual.items.length>0,`${date}: menu unexpectedly empty`);
  assert.deepEqual([...new Set(actual.items.map(i=>i.category))].sort(),['drinks','savory','sweet']);
  evidence.push({date,locale,status:200,menuId:actual.menu.id,itemCount:actual.items.length,requestId});
  if(output) await writeFile(`${output}/menu-${date}-${locale}.json`,JSON.stringify(actual,null,2));
 }
}
const health=(await get(site,'/api/brunch/health')).body;
assert.equal(health.ok,true);
if(output) await writeFile(`${output}/verification-api.json`,JSON.stringify({checkedAt:new Date(),health,results:evidence},null,2));
console.log(JSON.stringify({checkedAt:new Date(),health,results:evidence},null,2));

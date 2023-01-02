/*
https://www.w3.org/TR/activitypub/#Overview
A server to server federation protocol (so decentralized 
websites can share information)
*/

import jsonld from 'npm:jsonld';
const SPARQLDB = 'https://oxigraph-ldary24-dev.apps.sandbox-m2.ll9k.p1.openshiftapps.com/';

async function getActivityData(url) {
  const data = await fetch(url,{
    headers:{
      'Content-Type':'application/ld+json;profile="https://www.w3.org/ns/activitystreams"',
      'Accept':'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
    }
  });
  const doc = await data.json();
  const nquads = await jsonld.toRDF(doc, {format: 'application/n-quads'});
  updateSPARQL(nquads);
  return doc;
}

async function updateSPARQL(data) {
  await fetch(SPARQLDB+'update', {
    method:'POST', 
    headers:{'Content-Type':'application/sparql-update;'},
    body:`INSERT DATA {${data}}`
  });
}

async function getProfileData(url) {
  const user = await getActivityData(url);
  const followData = await getActivityData(user['following']);
  const following = await getActivityData(followData['first']);
  for await (const p of following['orderedItems']) {
    const profile = await getActivityData(p);
    const profileFollowData = await getActivityData(profile['following']);
    const profileFollowing = await getActivityData(profileFollowData['first']);
  }
  return following;
}

const follows = await getProfileData('https://fosstodon.org/@nzakas')

close();
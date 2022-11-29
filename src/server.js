/*
https://www.w3.org/TR/activitypub/#Overview
A server to server federation protocol (so decentralized 
websites can share information)
*/

import jsonld from 'npm:jsonld';
import oxigraph from 'npm:oxigraph/node.js';
//import { RdfParser } from 'npm:rdf-parse';
//import {JsonLdParser} from "npm:jsonld-streaming-parser";

//const parser = new RdfParser.RdfParser();
// const doc = {
//     "http://schema.org/name": "Manu Sporny",
//     "http://schema.org/url": {"@id": "http://manu.sporny.org/"},
//     "http://schema.org/image": {"@id": "http://manu.sporny.org/images/manu.png"}
// };
// const context = {
//     "name": "http://schema.org/name",
//     "homepage": {"@id": "http://schema.org/url", "@type": "@id"},
//     "image": {"@id": "http://schema.org/image", "@type": "@id"}
// };

// // compact a document according to a particular context
// const compacted = await jsonld.compact(doc, context);
// console.log(JSON.stringify(compacted, null, 2));
/* Output:
{
  "@context": {...},
  "name": "Manu Sporny",
  "homepage": "http://manu.sporny.org/",
  "image": "http://manu.sporny.org/images/manu.png"
}
*/

//const data = await fetch('https://fosstodon.org/@nzakas',{
const data = await fetch('https://fosstodon.org/users/nzakas/following?page=1',{
  headers:{
    'Content-Type':'application/ld+json;profile="https://www.w3.org/ns/activitystreams"',
    'Accept':'application/ld+json; profile="https://www.w3.org/ns/activitystreams"'
  }
});
// const doc = {
//   "@context": [
//     "https://www.w3.org/ns/activitystreams",
//     "https://w3id.org/security/v1",
//     {
//       manuallyApprovesFollowers: "as:manuallyApprovesFollowers",
//       toot: "http://joinmastodon.org/ns#",
//       featured: { "@id": "toot:featured", "@type": "@id" },
//       featuredTags: { "@id": "toot:featuredTags", "@type": "@id" },
//       alsoKnownAs: { "@id": "as:alsoKnownAs", "@type": "@id" },
//       movedTo: { "@id": "as:movedTo", "@type": "@id" },
//       schema: "http://schema.org#",
//       PropertyValue: "schema:PropertyValue",
//       value: "schema:value",
//       discoverable: "toot:discoverable",
//       Device: "toot:Device",
//       Ed25519Signature: "toot:Ed25519Signature",
//       Ed25519Key: "toot:Ed25519Key",
//       Curve25519Key: "toot:Curve25519Key",
//       EncryptedMessage: "toot:EncryptedMessage",
//       publicKeyBase64: "toot:publicKeyBase64",
//       deviceId: "toot:deviceId",
//       claim: { "@type": "@id", "@id": "toot:claim" },
//       fingerprintKey: { "@type": "@id", "@id": "toot:fingerprintKey" },
//       identityKey: { "@type": "@id", "@id": "toot:identityKey" },
//       devices: { "@type": "@id", "@id": "toot:devices" },
//       messageFranking: "toot:messageFranking",
//       messageType: "toot:messageType",
//       cipherText: "toot:cipherText",
//       suspended: "toot:suspended",
//       focalPoint: { "@container": "@list", "@id": "toot:focalPoint" }
//     }
//   ],
//   id: "https://fosstodon.org/users/nzakas",
//   type: "Person",
//   following: "https://fosstodon.org/users/nzakas/following",
//   followers: "https://fosstodon.org/users/nzakas/followers",
//   inbox: "https://fosstodon.org/users/nzakas/inbox",
//   outbox: "https://fosstodon.org/users/nzakas/outbox",
//   featured: "https://fosstodon.org/users/nzakas/collections/featured",
//   featuredTags: "https://fosstodon.org/users/nzakas/collections/tags",
//   preferredUsername: "nzakas",
//   name: "Nicholas C. Zakas",
//   summary: "<p>Creator of ESLint. Author, programmer, speaker, coach.</p>",
//   url: "https://fosstodon.org/@nzakas",
//   manuallyApprovesFollowers: false,
//   discoverable: true,
//   published: "2022-11-04T00:00:00Z",
//   devices: "https://fosstodon.org/users/nzakas/collections/devices",
//   publicKey: {
//     id: "https://fosstodon.org/users/nzakas#main-key",
//     owner: "https://fosstodon.org/users/nzakas",
//     publicKeyPem: "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0AjG911v0SthFjM/YQoc\nUopvWu3u..."
//   },
//   tag: [],
//   attachment: [],
//   endpoints: { sharedInbox: "https://fosstodon.org/inbox" },
//   icon: {
//     type: "Image",
//     mediaType: "image/jpeg",
//     url: "https://cdn.fosstodon.org/accounts/avatars/109/286/678/672/897/748/original/00c2135a4cc9fdab.jpg"
//   }
// }
const doc = await data.json();
// console.log(JSON.stringify(doc));
// const expand = await jsonld.expand(doc);
// console.log(expand);
const nquads = await jsonld.toRDF(doc, {format: 'application/n-quads'});
// parser.parse(doc, { contentType: 'application/ld+json', baseIRI: 'https://fosstodon.org/users/nzakas' })
//     .on('data', (quad) => console.log(quad))
//     .on('error', (error) => console.error(error))
//     .on('end', () => console.log('All done!'));

console.log(nquads);
const store = new oxigraph.Store();
store.load(nquads, 'application/n-quads','https://paa.pub');
const following = [...store.query("SELECT ?obj ?name WHERE { ?obj <http://www.w3.org/1999/02/22-rdf-syntax-ns#first> ?name }")].map(obj=>obj.get('name').value);
console.log(following);
close();
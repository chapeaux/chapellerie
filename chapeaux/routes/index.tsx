import { Head } from "$fresh/runtime.ts";
import SolidLogin from "../islands/SolidLogin.tsx";
import {
  getSolidDataset,
  getThing,
  setThing,
  getStringNoLocale,
  setStringNoLocale,
  saveSolidDatasetAt
} from "npm:@inrupt/solid-client";
import { Session } from "npm:@inrupt/solid-client-authn-browser";
import { VCARD } from "npm:@inrupt/vocab-common-rdf";

const SOLID_IDENTITY_PROVIDER = "https://solid.dary.ltd";

export default function Home() {
  return (
    <>
      <Head>
        <title>Fresh App</title>
      </Head>
      <div>
        <img
          src="/logo.svg"
          width="128"
          height="128"
          alt="the fresh logo: a sliced lemon dripping with juice"
        />
        <p>
          Welcome to `fresh`. Try updating this message in the ./routes/index.tsx
          file, and refresh.
        </p>
      </div>
      
      <div>
      <SolidLogin linkText="Login" provider={SOLID_IDENTITY_PROVIDER} /> | <a href="https://solid.dary.ltd/idp/register/">Register</a>
      </div>
    </>
  );
}

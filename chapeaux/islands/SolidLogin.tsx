import { useEffect, useState } from "preact/hooks";
import { Anchor } from "../components/Anchor.tsx";

interface SolidLoginProps {
  provider: string;
  linkText: string;
}

export default function SolidLogin(props: SolidLoginProps) {
  const [provider, setProvider] = useState(props.provider);
  const [linkText, setLinkText] = useState(props.linkText);

  useEffect(() => {

  }, [props.])

  return (
    <Anchor target="_blank" href={provider}>{linkText}</Anchor>
  );
}
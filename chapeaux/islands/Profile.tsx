import { useEffect, useState } from "preact/hooks";
import { Input } from "../components/Input.tsx";

interface ProfileProps {
  id: string;
  name: string;
  url: string;
  summary: string;
  type: string;
}

export default function Profile(props: ProfileProps) {
  const [name, setName] = useState(props.name);
  return (
    <div>
      <p>{name}</p>
      <Input value={name} onChange={this.handleChange} />
    </div>
  );
}
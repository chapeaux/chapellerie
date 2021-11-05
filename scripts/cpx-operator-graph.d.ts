declare class SkipRange {
  constructor(range: string);
  min: string;
  max: string;
}
declare class CPXOperatorVersion extends HTMLElement {
  static get tag(): string;
  get html(): string;
  constructor(op: any);
  connectedCallback(): void;
  package: string;
  channel_name: string;
  csv_name: string;
  latest_in_channel: boolean;
  ocp_version: string;
  version: string;
  skips: Array<string>;
  skip_range: SkipRange;
  replaces: string;
  channels: Array<string>;
  _active: boolean;
  get active(): boolean;
  set active(val: boolean);
  activeListener(evt: any): void;
  get escVer(): string;
  get escChannel(): string;
}
declare class OperatorChannel {
  constructor(name: string, version?: CPXOperatorVersion);
  versions: Map<string, CPXOperatorVersion>;
  name: string;
  getVersions(ord?: string): string[];
}
declare class OperatorIndex {
  constructor(version: string, channel?: OperatorChannel);
  channels: Map<string, OperatorChannel>;
  version: string;
  getAllVersions(): Map<any, any>;
}
declare class OperatorBundle {
  constructor(data: Array<CPXOperatorVersion>);
  indices: Map<string, OperatorIndex>;
  getChannelsByIndex(index: any): void;
  getVersionsByChannel(channel: any): void;
}
export declare class CPXOperatorGraph extends HTMLElement {
  static get tag(): string;
  static get tmpl(): string;
  _url: string;
  get url(): string;
  set url(val: string);
  bundle: OperatorBundle;
  _data: any[];
  get data(): any[];
  set data(val: any[]);
  _order: string;
  get order(): string;
  set order(val: string);
  _index: string;
  get index(): string;
  set index(val: string);
  _channel: string;
  get channel(): string;
  set channel(val: string);
  _all: boolean;
  get all(): boolean;
  set all(val: boolean);
  _body: any;
  get body(): any;
  constructor(url: string);
  connectedCallback(): void;
  static get observedAttributes(): string[];
  attributeChangedCallback(attr: any, oldVal: any, newVal: any): void;
  setChannels(): void;
  render(): void;
}
export {};

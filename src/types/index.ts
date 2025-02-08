export interface Group {
  channelId: string;
  roleId: string;
  name: string;
}

export interface BroadcastConfig {
  groups: Group[];
  moderatorRoleId: string;
  cooldownMs: number;
}

export interface BroadcastResult {
  successful: string[];
  failed: string[];
}

export interface PlayerActivityItem {
  displayName: string;
  isCurrentPlayer: boolean;
  hasSubmitted: boolean;
  connected: boolean;
}

export interface HostActivityItem {
  alias: string;
  aliasId: string;
  hasSubmitted: boolean;
  connected: boolean;
}

export type ActivityItem = PlayerActivityItem | HostActivityItem;

export interface HostManagePlayer {
  aliasId: string;
  alias: string;
  connected: boolean;
  hasSubmitted: boolean;
}

export interface PlayerActivityItem {
  participantId?: string;
  displayName: string;
  isCurrentPlayer: boolean;
  hasSubmitted: boolean;
  hasGuessed?: boolean;
  connected: boolean;
  score?: number;
  role?: string;
}

export interface LeaderboardItem {
  participantId: string;
  displayName: string;
  score: number;
  rank: number;
  connected: boolean;
  role: string;
}

export interface HostActivityItem {
  alias: string;
  aliasId: string;
  hasSubmitted: boolean;
  hasGuessed?: boolean;
  connected: boolean;
}

export type ActivityItem = PlayerActivityItem | HostActivityItem;

export interface HostManagePlayer {
  aliasId: string;
  alias: string;
  connected: boolean;
  hasSubmitted: boolean;
}

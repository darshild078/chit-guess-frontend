export interface AnonymousChit {
  anonymousChitId: string;
  alias: string;
  body: string;
  submittedAt: string;
  isRead: boolean;
  isGuessed: boolean;
}

export interface AnonymousInbox {
  roundNumber: number;
  aliasEpoch: number;
  chits: AnonymousChit[];
}

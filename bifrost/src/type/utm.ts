export interface UTM {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

export function limparUtm(utms: UTM): UTM {
  return {
    source: utms.source?.trim() || undefined,
    medium: utms.medium?.trim() || undefined,
    campaign: utms.campaign?.trim() || undefined,
    term: utms.term?.trim() || undefined,
    content: utms.content?.trim() || undefined,
  };
}
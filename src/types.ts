export interface ChallengerEntry {
  day: string;             // 12/11/26
  authorName: string;      // author name
  handle: string;          // nickname
  avatarUrl: string;       // avator link
  tags: string[];          // Key skills / materials (example, ["vitrage", "ceramic", "murals"])
  previews: string[];      // mooboard references
  paypalUrl?: string;      // Support links (Donor Point)
}
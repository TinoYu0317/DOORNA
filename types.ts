export enum AppState {
  S0_LOBBY_DOOR = 'S0_LOBBY_DOOR',
  S1_HOME_PAGED = 'S1_HOME_PAGED',
  S2_HOME_SINGLEPAGE = 'S2_HOME_SINGLEPAGE',
  S3_FRAME_EXPANDED = 'S3_FRAME_EXPANDED',
  S4_AI_EDIT = 'S4_AI_EDIT',
  S5_KEY_LOCKED = 'S5_KEY_LOCKED',
  S6_KEY_UNLOCKED = 'S6_KEY_UNLOCKED',
}

export enum ViewMode {
  PAGED = 'PAGED',
  SINGLE = 'SINGLE',
}

export enum KeyAuth {
  LOCKED = 'LOCKED',
  UNLOCKED = 'UNLOCKED',
}

export enum FrameType {
  TODAY = 'TODAY',
  CALENDAR = 'CALENDAR',
  REMINDER = 'REMINDER',
  NOTE = 'NOTE',
  FINANCE = 'FINANCE',
  KEY = 'KEY',
  SETTINGS = 'SETTINGS',
}

export interface DoornaItem {
  id: string;
  createdAt: number;
  source: string;
  rawText: string;
  type: FrameType;
  title: string;
  payload: any;
  status: 'active' | 'draft' | 'done';
  tags?: string[];
  genre?: string; // AI-assigned category (e.g., "Food", "Sport")
}

export interface RoutingResult {
  type: FrameType;
  title: string;
  summary: string;
  payload: any;
  genre?: string;
}

export interface GestureState {
  touches: number;
  startX: number;
  startY: number;
  currX: number;
  currY: number;
  startTime: number;
  isTracking: boolean;
  initialSpacing?: number;
}
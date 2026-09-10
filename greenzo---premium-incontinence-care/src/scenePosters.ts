const files = import.meta.glob('./photo/scenes/*.webp', { eager: true, import: 'default' }) as Record<string, string>;
const scenes = [
  ['01-powerline', '高空巡线', 'Power-line inspection'],
  ['02-security', '安保执勤', 'Security duty'],
  ['03-business-travel', '商务通勤', 'Business travel'],
  ['04-fishing', '户外垂钓', 'Fishing'],
  ['05-supported-outing', '陪伴外出', 'Supported outings'],
  ['06-concert', '剧院观演', 'Concert visits'],
  ['07-bird-photography-v2', '观鸟摄影', 'Bird photography'],
  ['08-flight-real-cabin-v5', '长途飞行', 'Long-haul flights'],
  ['09-senior-gathering', '老友相聚', 'Friends together'],
  ['10-senior-shopping', '结伴逛街', 'Shopping together'],
] as const;
export const scenePosters = scenes.map(([id, zh, en]) => ({
  id, src: files[`./photo/scenes/${id}.webp`], zh, en,
}));

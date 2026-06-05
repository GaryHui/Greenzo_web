type SolarTerm = {
  index: number;
  name: string;
  month: number;
  centuryConstant: number;
};

const solarTermImages = import.meta.glob('./photo/24/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const solarTerms: SolarTerm[] = [
  { index: 1, name: '立春', month: 2, centuryConstant: 3.87 },
  { index: 2, name: '雨水', month: 2, centuryConstant: 18.73 },
  { index: 3, name: '惊蛰', month: 3, centuryConstant: 5.63 },
  { index: 4, name: '春分', month: 3, centuryConstant: 20.646 },
  { index: 5, name: '清明', month: 4, centuryConstant: 4.81 },
  { index: 6, name: '谷雨', month: 4, centuryConstant: 20.1 },
  { index: 7, name: '立夏', month: 5, centuryConstant: 5.52 },
  { index: 8, name: '小满', month: 5, centuryConstant: 21.04 },
  { index: 9, name: '芒种', month: 6, centuryConstant: 5.678 },
  { index: 10, name: '夏至', month: 6, centuryConstant: 21.37 },
  { index: 11, name: '小暑', month: 7, centuryConstant: 7.108 },
  { index: 12, name: '大暑', month: 7, centuryConstant: 22.83 },
  { index: 13, name: '立秋', month: 8, centuryConstant: 7.5 },
  { index: 14, name: '处暑', month: 8, centuryConstant: 23.13 },
  { index: 15, name: '白露', month: 9, centuryConstant: 7.646 },
  { index: 16, name: '秋分', month: 9, centuryConstant: 23.042 },
  { index: 17, name: '寒露', month: 10, centuryConstant: 8.318 },
  { index: 18, name: '霜降', month: 10, centuryConstant: 23.438 },
  { index: 19, name: '立冬', month: 11, centuryConstant: 7.438 },
  { index: 20, name: '小雪', month: 11, centuryConstant: 22.36 },
  { index: 21, name: '大雪', month: 12, centuryConstant: 7.18 },
  { index: 22, name: '冬至', month: 12, centuryConstant: 21.94 },
  { index: 23, name: '小寒', month: 1, centuryConstant: 5.4055 },
  { index: 24, name: '大寒', month: 1, centuryConstant: 20.12 },
];

const chinaDateFormatter = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Shanghai',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

const getChinaDateParts = (date: Date) => {
  const parts = chinaDateFormatter.formatToParts(date);
  const getPart = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
  };
};

const getSolarTermDay = (year: number, term: SolarTerm) => {
  const shortYear = year % 100;
  return (
    Math.floor(shortYear * 0.2422 + term.centuryConstant) -
    Math.floor((shortYear - 1) / 4)
  );
};

export const getTodaysSolarTerm = (date = new Date()) => {
  const today = getChinaDateParts(date);

  return solarTerms.find((term) => {
    if (term.month !== today.month) return false;
    return getSolarTermDay(today.year, term) === today.day;
  });
};

export const getTodaysSolarTermImage = (date = new Date()) => {
  const term = getTodaysSolarTerm(date);
  if (!term) return undefined;

  return solarTermImages[`./photo/24/${term.index}.jpg`];
};

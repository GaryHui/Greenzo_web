type SolarTerm = {
  index: number;
  name: string;
  month: number;
  centuryConstant: number;
};

type SolarTermWithDate = SolarTerm & {
  year: number;
  day: number;
  serialDate: number;
};

const solarTermImages = import.meta.glob('./photo/24/*.jpg', {
  eager: true,
  import: 'default',
}) as Record<string, string>;

const solarTerms: SolarTerm[] = [
  { index: 1, name: 'lichun', month: 2, centuryConstant: 3.87 },
  { index: 2, name: 'yushui', month: 2, centuryConstant: 18.73 },
  { index: 3, name: 'jingzhe', month: 3, centuryConstant: 5.63 },
  { index: 4, name: 'chunfen', month: 3, centuryConstant: 20.646 },
  { index: 5, name: 'qingming', month: 4, centuryConstant: 4.81 },
  { index: 6, name: 'guyu', month: 4, centuryConstant: 20.1 },
  { index: 7, name: 'lixia', month: 5, centuryConstant: 5.52 },
  { index: 8, name: 'xiaoman', month: 5, centuryConstant: 21.04 },
  { index: 9, name: 'mangzhong', month: 6, centuryConstant: 5.678 },
  { index: 10, name: 'xiazhi', month: 6, centuryConstant: 21.37 },
  { index: 11, name: 'xiaoshu', month: 7, centuryConstant: 7.108 },
  { index: 12, name: 'dashu', month: 7, centuryConstant: 22.83 },
  { index: 13, name: 'liqiu', month: 8, centuryConstant: 7.5 },
  { index: 14, name: 'chushu', month: 8, centuryConstant: 23.13 },
  { index: 15, name: 'bailu', month: 9, centuryConstant: 7.646 },
  { index: 16, name: 'qiufen', month: 9, centuryConstant: 23.042 },
  { index: 17, name: 'hanlu', month: 10, centuryConstant: 8.318 },
  { index: 18, name: 'shuangjiang', month: 10, centuryConstant: 23.438 },
  { index: 19, name: 'lidong', month: 11, centuryConstant: 7.438 },
  { index: 20, name: 'xiaoxue', month: 11, centuryConstant: 22.36 },
  { index: 21, name: 'daxue', month: 12, centuryConstant: 7.18 },
  { index: 22, name: 'dongzhi', month: 12, centuryConstant: 21.94 },
  { index: 23, name: 'xiaohan', month: 1, centuryConstant: 5.4055 },
  { index: 24, name: 'dahan', month: 1, centuryConstant: 20.12 },
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

const toSerialDate = (year: number, month: number, day: number) =>
  year * 10000 + month * 100 + day;

const getSolarTermsForYear = (year: number): SolarTermWithDate[] =>
  solarTerms.map((term) => {
    const day = getSolarTermDay(year, term);

    return {
      ...term,
      year,
      day,
      serialDate: toSerialDate(year, term.month, day),
    };
  });

export const getCurrentSolarTerm = (date = new Date()) => {
  const today = getChinaDateParts(date);
  const todaySerialDate = toSerialDate(today.year, today.month, today.day);
  const candidates = [
    ...getSolarTermsForYear(today.year - 1),
    ...getSolarTermsForYear(today.year),
  ].sort((a, b) => a.serialDate - b.serialDate);

  return candidates.reduce<SolarTermWithDate | undefined>((current, term) => {
    if (term.serialDate > todaySerialDate) return current;
    if (!current || term.serialDate > current.serialDate) return term;
    return current;
  }, undefined);
};

export const getCurrentSolarTermImage = (date = new Date()) => {
  const term = getCurrentSolarTerm(date);
  if (!term) return undefined;

  return solarTermImages[`./photo/24/${term.index}.jpg`];
};

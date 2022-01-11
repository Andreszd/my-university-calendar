const colors = [
  {
    className: 'color-1',
    code: '#f5eafd',
    isUsed: false,
  },
  {
    className: 'color-2',
    code: '#fee9ec',
    isUsed: false,
  },
  {
    className: 'color-3',
    code: '#fef6e8',
    isUsed: false,
  },
  {
    className: 'color-4',
    code: '#eeeffd',
    isUsed: false,
  },
  {
    className: 'color-5',
    code: '#e8f5e9',
    isUsed: false,
  },
  {
    className: 'color-6',
    code: '#eceff1',
    isUsed: false,
  },
  {
    className: 'color-7',
    code: '#fff3e0',
    isUsed: false,
  },
  {
    className: 'color-8',
    code: '#e0f7fa',
    isUsed: false,
  },
];

export const getClassColor = () => {
  let idx = 0;
  let className = null;
  //FIXME refactor
  if (isAllClassUsed()) return 'default-color';

  while (!className) {
    idx = getRandomNumber(0, colors.length - 1);
    if (colors[idx] && !colors[idx].isUsed) {
      colors[idx].isUsed = true;
      console.log(colors[idx]);
      return colors[idx].className;
    }
  }
};

const isAllClassUsed = () => {
  return colors.every(({ isUsed }) => isUsed === true);
};

const getRandomNumber = (max, min) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

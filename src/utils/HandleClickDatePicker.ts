export const handleClickDatePicker = (): void => {
  const year = Array.from(
    document.getElementsByClassName('ant-picker-year-btn') as HTMLCollectionOf<HTMLElement>
  );
  year.map(x => (x.style.pointerEvents = 'none'));
  const month = Array.from(
    document.getElementsByClassName('ant-picker-month-btn') as HTMLCollectionOf<HTMLElement>
  );
  month.map(x => (x.style.pointerEvents = 'none'));
  const next = Array.from(
    document.getElementsByClassName(
      'ant-picker-header-super-next-btn'
    ) as HTMLCollectionOf<HTMLElement>
  );
  next.map(x => (x.style.display = 'none'));
  const prev = Array.from(
    document.getElementsByClassName(
      'ant-picker-header-super-prev-btn'
    ) as HTMLCollectionOf<HTMLElement>
  );
  prev.map(x => (x.style.display = 'none'));
};

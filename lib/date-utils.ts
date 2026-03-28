export const createDfDt = (day: string, month: string, year: string) => {
  const d = day ? parseInt(day) : null;
  const m = month ? parseInt(month) : null;
  const y = year ? parseInt(year) : null;

  let df, dt;

  if (d && m && y) {
    df = dt = new Date(y, m - 1, d);
  } else if (m && y && !d) {
    df = new Date(y, m - 1, 1);
    dt = new Date(y, m, 0);
  } else if (y && !m && !d) {
    df = new Date(y, 0, 1);
    dt = new Date(y, 11, 31);
  } else if (!d && !m && !y) {
    return ""
  } else {
    throw new Error("Dữ liệu nhập vào không đúng quy tắc lọc.");
  }

  const formatDisplay = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const displayString =
    df === dt
      ? `Ngày ${formatDisplay(df)}`
      : `Từ ${formatDisplay(df)} đến ${formatDisplay(dt)}`;

  return displayString;
};

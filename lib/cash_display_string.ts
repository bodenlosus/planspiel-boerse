export function to_display_string(
  amount: number,
  dec_places: number,
  absolute?: boolean,
): string {
  const money_amount: number = (absolute === true) ? Math.abs(amount) : amount;

  const abbreviations: Map<number, string> = new Map([
    [1, ""],
    [1000, "k"],
    [1000 * 1000, "M"],
    [1000 * 1000 * 1000, "B"],
  ]);

  let display_string: string = "";
  let biggest_divisor: number = 0;

  const pre_round_fac = Math.pow(10, dec_places);

  abbreviations.forEach((short: string, divisor: number) => {
    if (biggest_divisor < divisor && money_amount >= divisor) {
      biggest_divisor = divisor;
      display_string = `${
        Math.round(money_amount / divisor * pre_round_fac) / pre_round_fac
      }${short}`;
    }
  });

  return display_string;
}

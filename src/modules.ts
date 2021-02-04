const modules = {
  setEndingDate(
    time: string,
    output: string,
    allow0: boolean
  ): Promise<string> {
    let result;
    const d = new Date();
    let year = d.getFullYear();
    let month = d.getMonth() + 1;
    let day = d.getDate();
    let hour = d.getHours();
    let minutes = d.getMinutes();

    return new Promise<string>((resolve, reject) => {
      const arg = time;

      if (!arg) {
        result = 'Nie podałes czasu.';
        reject(result);
      }

      if (arg.length > 3 && arg.length < 2) {
        result =
          'Zły czas, pamiętaj że długość może się składać max z 2 liczb i jednej litery.';
        reject(result);
      } else {
        // eslint-disable-next-line no-empty
        if (allow0 == false && /^[1-9][0-9]?[mhd]$/i.test(arg)) {
          // eslint-disable-next-line no-empty
        } else if (allow0 == true && /^[0-9][0-9]?[mhd]$/i.test(arg)) {
        } else {
          result = 'Podałeś zły czas!';
          reject(result);
        }

        const args = arg.split('');
        let i;

        if (args[2] == null) {
          i = 1;
        } else {
          i = 2;
        }

        if (args[i] == 'm' || args[i] == 'M') {
          minutes += parseInt(args[0] + args[1]);
        } else if (args[i] == 'h' || args[i] == 'H') {
          hour += parseInt(args[0] + args[1]);
        } else {
          day += parseInt(args[0] + args[1]);
        }

        for (;;) {
          if (minutes > 59) {
            hour++;
            minutes = minutes - 60;
            continue;
          }

          if (hour > 23) {
            day++;
            hour = hour - 24;
            continue;
          }

          if (day > 31 && [1, 3, 5, 7, 8, 10, 12].includes(month)) {
            month++;
            day = day - 31;
            continue;
          }

          if (day > 30 && [4, 6, 9, 11].includes(month)) {
            month++;
            day = day - 30;
            continue;
          }

          if (day > 29 && month == 2 && year % 4 == 0) {
            month++;
            day = day - 29;
            continue;
          }

          if (day > 28 && month == 2 && year % 4 != 0) {
            month++;
            day = day - 28;
            continue;
          }

          if (month > 12) {
            year++;
            month = month - 12;
            continue;
          }

          break;
        }

        const syear = String(year);
        let smonth = String(month);
        let sday = String(day);
        let shour = String(hour);
        let sminutes = String(minutes);

        if (month.toString().length == 1) {
          smonth = '0' + month;
        }

        if (day.toString().length == 1) {
          sday = '0' + day;
        }

        if (hour.toString().length == 1) {
          shour = '0' + hour;
        }

        if (minutes.toString().length == 1) {
          sminutes = '0' + minutes;
        }

        let ending: string;
        ending = String(syear) + smonth + sday + shour + sminutes;

        switch (output) {
          case 'db':
            break;
          case 'text':
            ending = [ending.slice(0, 10), ':', ending.slice(10)].join('');
            ending = [ending.slice(0, 8), ' ', ending.slice(8)].join('');
            ending = [ending.slice(0, 6), '-', ending.slice(6)].join('');
            ending = [ending.slice(0, 4), '-', ending.slice(4)].join('');
            break;
        }

        resolve(ending);
      }
    });
  },
  delay(ms: number): Promise<unknown> {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  },
};

export default modules;

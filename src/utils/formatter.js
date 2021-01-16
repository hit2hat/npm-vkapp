import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

const DAY = 60 * 60 * 24;
const WEEK = 7 * DAY;
const MONTH = 4 * WEEK;
const QUARTAL = 3 * MONTH;
const YEAR = 4 * QUARTAL;

const L = {
    format: {
        time: (date) => {
            const obj = new Date(date);
            const hours = obj.getUTCHours();
            const minutes = obj.getUTCMinutes();
            return `${`${hours < 10 ? '0' : ''}${hours}`}:${`${minutes < 10 ? '0' : ''}${minutes}`}`;
        },
        weekDay: (date) => {
            const obj = new Date(date);
            const day = obj.getDate();
            let month = obj.getMonth();

            switch (month) {
                case 0: {
                    month = 'янв';
                    break;
                }
                case 1: {
                    month = 'фев';
                    break;
                }
                case 2: {
                    month = 'мар';
                    break;
                }
                case 3: {
                    month = 'апр';
                    break;
                }
                case 4: {
                    month = 'май';
                    break;
                }
                case 5: {
                    month = 'июн';
                    break;
                }
                case 6: {
                    month = 'июл';
                    break;
                }
                case 7: {
                    month = 'авг';
                    break;
                }
                case 8: {
                    month = 'сен';
                    break;
                }
                case 9: {
                    month = 'окт';
                    break;
                }
                case 10: {
                    month = 'ноя';
                    break;
                }
                case 11: {
                    month = 'дек';
                    break;
                }
            }

            return `${`${day < 10 ? '0' : ''}${day}`} ${month}`;
        }
    }
};

export const formatDateAxisLabel = (minDate, maxDate) => (date) => {
    const secondsDelta = (maxDate - minDate) / 1000;

    if (secondsDelta < 2 * DAY) {
        return L.format.time(date);
    } else if (secondsDelta < WEEK) {
        return L.format.time(date);
        // return `${L.format.weekDay(dateObject.day(), { short: true })} ${L.format.time(date)}`;
    } else if (secondsDelta < QUARTAL) {
        return L.format.weekDay(date);
        // return L.format.date(date, { shortMonth: true, alwaysDate: true });
    } else if (secondsDelta < YEAR) {
        // return L.format.monthOf(dateObject.month(), { short: true });
    }

    // return `${L.format.monthOf(dateObject.month(), { short: true })} ${dateObject.year()}`;
};

const SIGNIFICANT_DIGITS_AFTER_DOT = 2;
const MAX_DIGITS_AFTER_DOT = 8;

export const prettifyRateValue = (number) => {
    const parts = number.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join(',');
};

export const formatRateAxisLabel = (minRate, maxRate) => {
    const [minRateInteger, minRateReal = '0'] = String(minRate).split('.');
    const [maxRateInteger, maxRateReal = '0'] = String(maxRate).split('.');
    const integerDelta = Number(maxRateInteger) - Number(minRateInteger);

    let digitsAfterDot = 0;

    if (integerDelta === 0) {
        while (
            minRateReal.length > digitsAfterDot &&
            maxRateReal.length > digitsAfterDot &&
            minRateReal[digitsAfterDot] === maxRateReal[digitsAfterDot]
            ) {
            digitsAfterDot++;
        }
        digitsAfterDot = Math.min(digitsAfterDot + SIGNIFICANT_DIGITS_AFTER_DOT, MAX_DIGITS_AFTER_DOT);
    } else if (integerDelta < 5) {
        digitsAfterDot = 2;
    } else if (integerDelta < 10) {
        digitsAfterDot = 1;
    }

    return (rate) => prettifyRateValue(rate.toFixed(digitsAfterDot));
};
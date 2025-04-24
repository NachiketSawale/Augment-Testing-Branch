import { Injectable } from '@angular/core';
import * as dateFnLocales from 'date-fns/locale';
import { format } from 'date-fns';
import { formatInTimeZone, toDate, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

@Injectable({
	providedIn: 'root'
})
export class PlatformDateService {

	private currentZoneOffset: number = 0;
	public systemTimezone = '';
	private selectedCulture: string = 'en-GB';
	private dateLocales: { [key: string]: Locale } = {
		'cs': dateFnLocales.cs,
		'da': dateFnLocales.da,
		'de': dateFnLocales.de,
		'de-ch': dateFnLocales.de,
		'en': dateFnLocales.enGB,
		'en-us': dateFnLocales.enUS,
		'es': dateFnLocales.es,
		'fi': dateFnLocales.fi,
		'fr': dateFnLocales.fr,
		'fr-ch': dateFnLocales.frCH,
		'hu': dateFnLocales.hu,
		'id': dateFnLocales.id,
		'it': dateFnLocales.it,
		'it-ch': dateFnLocales.itCH,
		'ja': dateFnLocales.ja,
		'ko': dateFnLocales.ko,
		'lt': dateFnLocales.lt,
		'nb': dateFnLocales.nb,
		'nl': dateFnLocales.nl,
		'nl-be': dateFnLocales.nlBE,
		'pl': dateFnLocales.pl,
		'pt': dateFnLocales.pt,
		'ro': dateFnLocales.ro,
		'ru': dateFnLocales.ru,
		'sk': dateFnLocales.sk,
		'sv': dateFnLocales.sv,
		'th': dateFnLocales.th,
		'vi': dateFnLocales.vi,
		'zh': dateFnLocales.zhCN,
		'zh-hant': dateFnLocales.zhTW,
	};

	/***
	 * Service constructor
	 */
	public constructor() {
		this.currentZoneOffset = new Date().getTimezoneOffset();
		this.systemTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	}

	/***
	 * Sets the locale
	 * @param culture
	 */
	public setLocale(culture: string) {
		this.selectedCulture = culture;
		// fire event
	}

	/***
	 * Gets the current utc date
	 */
	public getCurrentUtcDate() {
		return new Date();
	}

	/***
	 * Returns the formatted date string in local time
	 * @param inputDate
	 * @param formatStr
	 */
	public formatLocal(inputDate: Date | string | number, formatStr: string = 'yyyy.MM.dd hh:mm:ss'): string {

		const date = toDate(inputDate);
		if (isNaN(date.getTime())) {
			throw new Error('Invalid date format');
		}

		const localDate = utcToZonedTime(date, this.systemTimezone);

		return format(localDate, formatStr, {locale: this.dateLocales[this.selectedCulture]}); // Adjust the formatted date as per your desired output
	}

	/***
	 * Converts a local date to utc and returns the formatted date string
	 * @param localDate
	 * @param formatStr
	 */
	public formatUTC(localDate: Date | string | number, formatStr: string = 'yyyy.MM.dd hh:mm:ss') {
		let inputDate = toDate(localDate);
		if (isNaN(inputDate.getTime())) {
			throw new Error('Invalid date format');
		}
		inputDate = zonedTimeToUtc(inputDate, this.systemTimezone);
		return formatInTimeZone(inputDate, 'UTC', formatStr, {locale: this.dateLocales[this.selectedCulture]});
	}

	/***
	 * Gets a date in local timezone
	 * if no parameter is given, current time is returned
	 * if Date object is given, a date object in local timezone is returned
	 * if number is given, converted to Date object in local timezone and returned
	 * if string is given, converted to Date object in local timezone and returned
	 * @param input
	 */
	public getLocal(input?: Date | string | number) {
		if (!input) {
			input = new Date();
		}
		const dateObj = toDate(input, {timeZone: this.systemTimezone});
		if (isNaN(dateObj.getTime())) {
			throw new Error('Invalid date format');
		}
		return dateObj;
	}

	/***
	 * Gets a date in UTC timezone
	 * if no parameter is given, current time is returned
	 * if Date object is given, a date object in UTC timezone is returned
	 * if number is given, converted to Date object in UTC timezone and returned
	 * if string is given, converted to Date object in UTC timezone and returned
	 * @param input
	 */
	public getUTC(input?: Date | string | number) {
		if (!input) {
			input = new Date();
		}
		const utcDate = zonedTimeToUtc(toDate(input, {timeZone: 'UTC'}), this.systemTimezone);

		if (isNaN(utcDate.getTime())) {
			throw new Error('Invalid date format');
		}

		return utcDate;
	}
}

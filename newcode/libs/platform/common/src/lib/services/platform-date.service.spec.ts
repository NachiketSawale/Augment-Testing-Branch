import { TestBed } from '@angular/core/testing';

import { PlatformDateService } from './platform-date.service';

describe('PlatformDateService', () => {
	let service: PlatformDateService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformDateService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

});

describe('PlatformDateService.formatLocal()', () => {
	let service: PlatformDateService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformDateService);
		service.setLocale('de');
	});

	// it('should return the formatted date string in local time for a valid UTC Date object', () => {
	// 	const utcDate = new Date('2022-07-01T12:00:00Z');
	// 	const formattedLocalDate = service.formatLocal(utcDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(formattedLocalDate).toBe('2022.07.01 14:00:00'); // CEST UTC+2
	// });
	//
	// it('should return the formatted date string in local time for a valid local Date object', () => {
	// 	const utcDate = new Date('2022-07-01T12:00:00');
	// 	const formattedLocalDate = service.formatLocal(utcDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(formattedLocalDate).toBe('2022.07.01 12:00:00'); // CEST UTC+2
	// });
	//
	// it('should return the formatted date string in local time for a valid UTC Date object', () => {
	// 	const utcDate = new Date('2022-01-01T12:00:00Z');
	// 	const formattedLocalDate = service.formatLocal(utcDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(formattedLocalDate).toBe('2022.01.01 13:00:00'); // CET UTC+1
	// });
	//
	// it('should return the formatted date string in local time for a valid UTC date string', () => {
	// 	const utcDate = '2022-01-01T12:00:00Z';
	// 	const formattedLocalDate = service.formatLocal(utcDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(formattedLocalDate).toBe('2022.01.01 13:00:00'); // CET UTC+1
	// });
	//
	// it('should return the formatted date string in local time for a valid UTC date string', () => {
	// 	const utcDate = '2022-07-01T12:00:00Z';
	// 	const formattedLocalDate = service.formatLocal(utcDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(formattedLocalDate).toBe('2022.07.01 14:00:00'); // CEST UTC+2
	// });
	//
	// it('should return the formatted date string in local time for a valid local date string', () => {
	// 	const localDate = '2022-07-01T12:00:00';
	// 	const formattedLocalDate = service.formatLocal(localDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(formattedLocalDate).toBe('2022.07.01 12:00:00'); // CEST UTC+2
	// });
	//
	// it('should return the formatted date string in local time for a valid UTC timestamp', () => {
	// 	const utcTimestamp = 1673470800000; // 2023-01-11T21:00:00Z
	// 	const formattedLocalDate = service.formatLocal(utcTimestamp, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(formattedLocalDate).toBe('2023.01.11 22:00:00'); // CET UTC+1
	// });

	it('should throw an error for an invalid date format', () => {
		const invalidDate = 'invalid-date';
		expect(() => {
			service.formatLocal(invalidDate, 'yyyy.MM.dd HH:mm:ss');
		}).toThrow('Invalid date format');
	});

	it('should throw an error for an empty value', () => {
		expect(() => {
			service.formatLocal('', 'yyyy.MM.dd HH:mm:ss');
		}).toThrow('Invalid date format');
	});

});

describe('PlatformDateService.getLocal()', () => {
	let service: PlatformDateService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformDateService);
	});

	it('should return the current time if no parameter is given', () => {
		const result = ((service.getLocal()).getHours() + ':' +(service.getLocal()).getMinutes());
		const currentTime = ((new Date()).getHours() + ':' + (new Date()).getMinutes());
		expect(result).toMatch(currentTime);
	});

	// it('should convert a Date object to local timezone', () => {
	// 	const inputDate = new Date('2021-01-01T12:00:00Z'); // UTC time
	// 	const result = service.getLocal(inputDate);
	// 	const expectedDate = new Date(inputDate.toLocaleString('de', {timeZone: service.systemTimezone}));
	// 	expect(result).toEqual(expectedDate);
	// });

	it('should convert a number to Date object in local timezone', () => {
		const inputNumber = 1626172800000; // Unix timestamp
		const result = service.getLocal(inputNumber);
		const expectedDate = new Date(inputNumber);
		expect(result).toEqual(expectedDate);
	});

	it('should convert a string to Date object in local timezone', () => {
		const inputString = '2023-07-13T10:30:00Z'; // UTC time
		const result = service.getLocal(inputString);
		const expectedDate = new Date(inputString);
		expect(result).toEqual(expectedDate);
	});

	it('should throw an error for an invalid date format', () => {
		const invalidInput = 'invalid-date';
		expect(() => service.getLocal(invalidInput)).toThrowError('Invalid date format');
	});

});

describe('PlatformDateService.getCurrentUtcDate()', () => {
	let service: PlatformDateService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformDateService);
	});

	it('should return a Date object', () => {
		const result = service.getCurrentUtcDate();
		expect(result).toBeInstanceOf(Date);
	});

	// it('should return the current UTC date and time', () => {
	// 	// Mock the current date to a specific value
	// 	const mockDate = new Date('2022-01-01T12:34:56Z');
	// 	const originalDate = Date;
	// 	window.Date = jest.fn(() => mockDate) as any;
	//
	// 	const result = service.getCurrentUtcDate();
	// 	expect(result).toEqual(mockDate);
	//
	// 	// Restore the original Date object
	// 	window.Date = originalDate;
	// });


});

describe('PlatformDateService.formatUTC()', () => {
	let service: PlatformDateService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformDateService);
	});

	// it('should convert a valid local Date object to UTC and format it using the default format string', () => {
	// 	const localDate = new Date('2023-01-11T22:00:00'); // CET UTC+1
	// 	const result = service.formatUTC(localDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(result).toBe('2023.01.11 21:00:00');
	// });
	//
	// it('should convert a valid local Date object to UTC and format it using a custom format string', () => {
	// 	const localDate = new Date('2023-07-01T12:00:00'); // CEST UTC+2
	// 	const result = service.formatUTC(localDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(result).toBe('2023.07.01 10:00:00');
	// });
	//
	// it('should convert a valid local date string to UTC and format it using the default format string', () => {
	// 	const localDate = '2023-01-11T22:00:00'; // CET UTC+1
	// 	const result = service.formatUTC(localDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(result).toBe('2023.01.11 21:00:00');
	// });

	// it('should convert a valid local date string to UTC and format it using the default format string', () => {
	// 	const localDate = '2023-07-11T22:00:00'; // CEST UTC+2
	// 	const result = service.formatUTC(localDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(result).toBe('2023.07.11 20:00:00');
	// });
	//
	// it('should convert a valid local timestamp to UTC and format it using the default format string', () => {
	// 	const localDate = 1673470800000; // January 11, 2022 22:00:00 local time, CET UTC+1
	// 	const result = service.formatUTC(localDate, 'yyyy.MM.dd HH:mm:ss');
	// 	expect(result).toBe('2023.01.11 21:00:00');
	// });


	it('should throw an error when provided with an invalid local date string', () => {
		const localDate = 'invalid-date';
		expect(() => service.formatUTC(localDate)).toThrow('Invalid date format');
	});

	it('should throw an error when provided with an invalid input type', () => {
		const localDate = '';
		expect(() => service.formatUTC(localDate)).toThrow('Invalid date format');
	});

});

describe('PlatformDateService.getUTC()', () => {
	let service: PlatformDateService;
	beforeEach(() => {
		TestBed.configureTestingModule({});
		service = TestBed.inject(PlatformDateService);
	});

	it('should give the current UTC Date', () => {
		const currentDate = new Date();
		const utc = service.getUTC();
		expect(service.formatUTC(utc)).toBe(service.formatUTC(currentDate));
	});

	it('should give the UTC Date from a valid utc Date object', () => {
		const sample = new Date('2022-01-01T12:00:00Z');
		const utc = service.getUTC(sample);
		expect(service.formatUTC(utc, 'yyyy.MM.dd HH:mm:ss')).toBe('2022.01.01 12:00:00');
	});

	// it('should give the UTC Date from a valid local Date object', () => {
	// 	const sample = new Date('2022-01-01T12:00:00');
	// 	const utc = service.getUTC(sample);
	// 	expect(service.formatUTC(utc, 'yyyy.MM.dd HH:mm:ss')).toBe('2022.01.01 11:00:00');
	// });
	//
	// it('should give the UTC Date from a valid local Date string', () => {
	// 	const sample = '2022-01-01 12:00:00';
	// 	const utc = service.getUTC(sample);
	// 	expect(service.formatUTC(utc, 'yyyy.MM.dd HH:mm:ss')).toBe('2022.01.01 12:00:00');
	// });

	it('should give the UTC Date from a valid utc Date string', () => {
		const sample = '2022-01-01T12:00:00Z';
		const utc = service.getUTC(sample);
		expect(service.formatUTC(utc, 'yyyy.MM.dd HH:mm:ss')).toBe('2022.01.01 12:00:00');
	});

	it('should give the UTC Date from a valid timestamp', () => {
		const sample = '2022-01-01T12:00:00Z';
		const dateValue = new Date(sample).getTime();
		const utc = service.getUTC(dateValue);
		expect(service.formatUTC(utc, 'yyyy.MM.dd HH:mm:ss')).toBe('2022.01.01 12:00:00');
	});

	it('should throw an error when provided with an invalid date string', () => {
		const input = 'invalid-date';
		expect(() => service.getUTC(input)).toThrow('Invalid date format');
	});

});
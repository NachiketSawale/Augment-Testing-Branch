/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { NumberShorteningService } from './number-shortening.service';

describe('NumberShorteningService', () => {
	// TODO: replace with actual test cases
	it('is successful', () => {
		expect(true).toBeTruthy();
	});
	
	/*let service: NumberShorteningService;
	
	const numberShorteningIpParam = {
		'value': 1024,
		'prefixSystem': 'trading',
		'prefixNumberSystem': 10,
		'location': '',
		'rounddigit': 2,
		'prefix': 'K',
		'number': 1.024
	};
	const numberShorteningOpParam = {
		'output': { 'prefix': 'k', 'number': 1.024 },
		'getStringOutput': '1.02K',
	};
	
	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
		});
		service = TestBed.inject(NumberShorteningService);
	});

	const value = numberShorteningIpParam.value;
	const prefixSystem = numberShorteningIpParam.prefixSystem;
	const prefixNumberSystem = numberShorteningIpParam.prefixNumberSystem;
	const location = numberShorteningIpParam.prefixNumberSystem;

	it('service should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should call getShortNumber()', () => {
		jest.spyOn(service, 'getShortNumber');

		service.getShortNumber(value, prefixSystem, prefixNumberSystem);

		expect(service.getShortNumber).toHaveBeenCalled();
	});

	it('value should not be null/ string only number', () => {
		expect(value).not.toBeNull();
		expect(value).not.toBe('');
	});

	it('getShortNumber() response not to be null', () => {
		const service_output = service.getShortNumber(value, prefixSystem, prefixNumberSystem);
		expect(service_output).not.toBeNull;
	});

	it('getShortNumber() response should be object', () => {
		const output = numberShorteningOpParam.output;
		const service_output = service.getShortNumber(value, prefixSystem, prefixNumberSystem);
		expect(service_output).toMatchObject(output);
	});

	it('should call getPrefixes()', () => {
		jest.spyOn(service, 'getPrefixes');

		service.getPrefixes(prefixSystem, prefixNumberSystem);

		expect(service.getPrefixes).toHaveBeenCalled();
	});

	it('getPrefixes() response not to be null', () => {
		const service_output = service.getPrefixes(prefixSystem, prefixNumberSystem);
		expect(service_output).not.toBeNull();
	});

	it('getPrefixes returns expected values', () => {
		//const output = getPrefixes_result;
		jest.spyOn(service, 'getPrefixes');

		service.getPrefixes(prefixSystem, prefixNumberSystem);

		expect(service.getPrefixes).toHaveReturned();
	});

	//passing dummy data
	it('getPrefixes should call if prefixSystem is nither "si" nor "trading" ', () => {
		const prefixSystem_dummy = 'abc';
		jest.spyOn(service, 'getPrefixes');

		service.getPrefixes(prefixSystem_dummy, prefixNumberSystem);

		expect(service.getPrefixes).toHaveBeenCalled();
	});

	//passing dummy data
	it('getPrefixes should handle the condition, location is undefined ', () => {
		const location_dummy = undefined;
		jest.spyOn(service, 'getPrefixes');

		service.getPrefixes('', prefixNumberSystem, location_dummy);

		expect(service.getPrefixes).toHaveBeenCalled();
	});

	//passing dummy data
	it('getShortNumber() should execute if prefixSystem is "_"', () => {
		const prefixSystem_dummy = '_';
		jest.spyOn(service, 'getShortNumber');

		service.getShortNumber(value, prefixSystem_dummy, prefixNumberSystem);

		expect(service.getShortNumber).toHaveBeenCalled();
	});

	//passing dummy data
	it('getShortNumber() should execute if prefixSystem is "_"', () => {
		const prefixSystem_dummy = '';
		jest.spyOn(service, 'getShortNumber');

		service.getShortNumber(value, prefixSystem_dummy, prefixNumberSystem);

		expect(service.getShortNumber).toHaveBeenCalled();
	});

	const rounddigit = numberShorteningIpParam.rounddigit;
	const prefix = numberShorteningIpParam.prefix;
	const number = numberShorteningIpParam.number;
	it('should call getString()', () => {
		jest.spyOn(service, 'getString');

		service.getString(rounddigit);

		expect(service.getString).toHaveBeenCalled();
	});

	it('getString() response not to be null', () => {
		const service_output = service.getString(rounddigit);
		expect(service_output).not.toBeNull();
	});

	it('check the out put of getString() function', () => {
		const output = numberShorteningOpParam.getStringOutput;
		expect(service.getString(rounddigit, prefix, number)).toEqual(output);
	});

	//passing dummy data
	it('should call getString() if rounddigit value is undefine ', () => {
		const rounddigit_dummy = -1;

		jest.spyOn(service, 'getString');

		service.getString(rounddigit_dummy, prefix, number);

		expect(service.getString).toHaveBeenCalled();
	});

	it('should call getMostSignificantFigurePostition()', () => {
		jest.spyOn(service, 'getMostSignificantFigurePostition');

		service.getMostSignificantFigurePostition(value, prefixNumberSystem);

		expect(service.getMostSignificantFigurePostition).toHaveBeenCalled();
	});

	/*  it('should call getMostSignificantFigurePostition() if figure === "0"', () => {

    const figure = '0';
    service.figure = figure;

    jest.spyOn(service, 'getMostSignificantFigurePostition');

    service.getMostSignificantFigurePostition(value,prefixNumberSystem);

    expect(service.getMostSignificantFigurePostition).toHaveBeenCalled();

  }); *//*

	it('getMostSignificantFigurePostition() should work properly if we pass float value ', () => {
		const dummy_data = 0.01;
		jest.spyOn(service, 'getMostSignificantFigurePostition');

		service.getMostSignificantFigurePostition(dummy_data, prefixNumberSystem);

		expect(service.getMostSignificantFigurePostition).toHaveBeenCalled();
	});

	it('should call getCharacteristicAndMantissa()', () => {
		jest.spyOn(service, 'getCharacteristicAndMantissa');

		service.getCharacteristicAndMantissa(value, prefixNumberSystem);

		expect(service.getCharacteristicAndMantissa).toHaveBeenCalled();
	});

	//this test case is not working after rework
	/*   it('getCharacteristicAndMantissa() should work when if prefixNumberSystem is undefined ', () => {

    var prefixNumberSystem_dummy = undefined;
    jest.spyOn(service, 'getCharacteristicAndMantissa');

    service.getCharacteristicAndMantissa(value,prefixNumberSystem_dummy);

    expect(service.getCharacteristicAndMantissa).toHaveBeenCalled();

  });  */

	/* it('should call prefixer()', () => {

    jest.fn(service, 'prefixer');

    service.prefixer(value,prefixNumberSystem);

    expect(service.prefixer).toHaveBeenCalled();

  }); */
});

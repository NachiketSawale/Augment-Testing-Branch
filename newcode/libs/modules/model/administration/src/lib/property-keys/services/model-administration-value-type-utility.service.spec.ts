/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';

import { PlatformHttpService } from '@libs/platform/common';
import { ModelAdministrationValueTypeUtilityService } from './model-administration-value-type-utility.service';

describe('ModelAdministrationValueTypeUtilityService', () => {
	let service: ModelAdministrationValueTypeUtilityService;

	const httpMock = {
		getData: <{
			[url: string]: object
		}>{},

		async get(url: string): Promise<object> {
			if (url in this.getData) {
				return this.getData[url];
			}

			throw new Error(`The URL ${url} is not supported in this test case.`);
		}
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [{
				provide: PlatformHttpService,
				useValue: httpMock
			}],
			imports: []
		});
		service = TestBed.inject(ModelAdministrationValueTypeUtilityService);
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should cope with empty input data', async () => {
		httpMock.getData['basics/customize/modelvaluetype/vtmapping'] = [];

		const result = await service.getBasicValueTypeMapping();

		expect(result.typeToBaseType.size).toBe(0);
		expect(result.baseTypeToType.size).toBe(0);
	});

	it('should generate a map', async () => {
		httpMock.getData['basics/customize/modelvaluetype/vtmapping'] = <{
			Ids: number[];
			ValueType: number;
		}[]>[{
			Ids: [2, 6, 9],
			ValueType: 4
		}, {
			Ids: [7, 4, 1, 3],
			ValueType: 2
		}];

		const result = await service.getBasicValueTypeMapping();

		expect(result.baseTypeToType.size).toBe(2);
		expect(result.baseTypeToType.has(2)).toBeTruthy();
		expect(result.baseTypeToType.has(4)).toBeTruthy();

		expect(result.baseTypeToType.get(2)?.sort()).toEqual([1, 3, 4, 7]);
		expect(result.baseTypeToType.get(4)?.sort()).toEqual([2, 6, 9]);

		expect(result.typeToBaseType.size).toBe(7);
		expect(result.typeToBaseType.get(2)).toBe(4);
		expect(result.typeToBaseType.get(6)).toBe(4);
		expect(result.typeToBaseType.get(9)).toBe(4);
		expect(result.typeToBaseType.get(1)).toBe(2);
		expect(result.typeToBaseType.get(3)).toBe(2);
		expect(result.typeToBaseType.get(4)).toBe(2);
		expect(result.typeToBaseType.get(7)).toBe(2);
	});
});

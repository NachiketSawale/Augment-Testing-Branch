/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PlatformConfigurationService } from '@libs/platform/common';
import { EstimateAssembliesBaseValidationService } from './estimate-assemblies-base-validation.service';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';
import { DataServiceFlatRoot } from '@libs/platform/data-access';
import { LineItemBaseComplete } from '../../line-item/model/estimate-line-item-base-complete.class';
import { IAssemblyDataService } from '../model/assembly-data-service.interface';
import { EstimateTestDataBuilderService } from '../../unit-test-data/estimate-test-data-builder.service';
import { BasicsSharedCostCodeLookupService, BasicsSharedMaterialLookupService, BasicsSharedUomLookupService, IMaterialSearchEntity } from '@libs/basics/shared';
import { IBasicsUomEntity, ICostCodeEntity } from '@libs/basics/interfaces';

describe('EstimateAssembliesBaseValidationService additional tests', () => {
	let service: EstimateAssembliesBaseValidationService;
	let assemblyDataService: DataServiceFlatRoot<IEstLineItemEntity, LineItemBaseComplete> & IAssemblyDataService;
	let httpTestingController: HttpTestingController;
	let webApiBaseUrl: string;
	let testDataBuilderService: EstimateTestDataBuilderService;
	let basicsSharedCostCodeLookupService: BasicsSharedCostCodeLookupService<IEstLineItemEntity>;
	let basicsSharedUomLookupService: BasicsSharedUomLookupService;
	let basicsSharedMaterialLookupService: BasicsSharedMaterialLookupService<IEstLineItemEntity>;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			providers: [
				{ provide: DataServiceFlatRoot<IEstLineItemEntity, LineItemBaseComplete>, useValue: {} },
				{ provide: BasicsSharedCostCodeLookupService<IEstLineItemEntity>, useValue: {} },
				{ provide: BasicsSharedUomLookupService, useValue: {} },
				{ provide: BasicsSharedMaterialLookupService<IEstLineItemEntity>, useValue: {} },
			],
		});
		assemblyDataService = TestBed.inject(DataServiceFlatRoot<IEstLineItemEntity, LineItemBaseComplete>) as unknown as DataServiceFlatRoot<IEstLineItemEntity, LineItemBaseComplete> & IAssemblyDataService;
		service = TestBed.runInInjectionContext(() => {
			return new EstimateAssembliesBaseValidationService(assemblyDataService);
		});
		httpTestingController = TestBed.inject(HttpTestingController);
		basicsSharedCostCodeLookupService = TestBed.inject(BasicsSharedCostCodeLookupService<IEstLineItemEntity>);
		basicsSharedUomLookupService = TestBed.inject(BasicsSharedUomLookupService);
		basicsSharedMaterialLookupService = TestBed.inject(BasicsSharedMaterialLookupService<IEstLineItemEntity>);
		webApiBaseUrl = TestBed.inject(PlatformConfigurationService).webApiBaseUrl;
		testDataBuilderService = TestBed.inject(EstimateTestDataBuilderService);

		//mock assemblyDataService
		assemblyDataService.getList = jest.fn().mockReturnValue([testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L001' }), testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L002' })]);

		//mock basicsSharedCostCodeLookupService
		basicsSharedCostCodeLookupService.getList = jest.fn().mockReturnValue([{ Id: 1, UomFk: 1001 } as ICostCodeEntity, { Id: 2, UomFk: 1001 } as ICostCodeEntity, { Id: 3, UomFk: 1002 } as ICostCodeEntity]);

		//mock basicsSharedUomLookupService
		basicsSharedUomLookupService.getList = jest
			.fn()
			.mockReturnValue([
				{ Id: 1001, LengthDimension: 1, TimeDimension: 1, MassDimension: 1 } as IBasicsUomEntity,
				{ Id: 1002, LengthDimension: 1, TimeDimension: 1, MassDimension: 1 } as IBasicsUomEntity,
				{ Id: 1003, LengthDimension: 1, TimeDimension: 1, MassDimension: 2 } as IBasicsUomEntity,
			]);

		//mock basicsSharedMaterialLookupService
		basicsSharedMaterialLookupService.getList = jest.fn().mockReturnValue([{ Id: 1, BasUomFk: 1001 } as IMaterialSearchEntity, { Id: 2, BasUomFk: 1001 } as IMaterialSearchEntity, { Id: 3, BasUomFk: 1002 } as IMaterialSearchEntity]);
	});

	it('validateCode expects valid is false when the info value is undefined', () => {
		const validResult = service.validateCode({
			entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L001' }),
			value: undefined,
			field: 'Code',
		});

		expect(validResult.valid).toBeFalsy();
	});

	it('validateCode expects valid is false when there are some assembly with the same code', () => {
		const validResult = service.validateCode({
			entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L001' }),
			value: 'L001',
			field: 'Code',
		});

		expect(validResult.valid).toBeFalsy();
	});

	it('validateCode expects valid is false when there are not some assembly with the same code', () => {
		const validResult = service.validateCode({
			entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003' }),
			value: 'L003',
			field: 'Code',
		});

		expect(validResult.valid).toBeTruthy();
	});

	it('asyncValidateCode expects valid is false when there are not some assembly with the same code', () => {
		service
			.asyncValidateCode({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003' }),
				value: 'L003',
				field: 'Code',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});

		const req = httpTestingController.expectOne(`${webApiBaseUrl}estimate/assemblies/isuniquecode`);
		req.flush(true);
	});

	it('asyncValidateCode expects valid is false when there are some assembly with the same code', () => {
		service
			.asyncValidateCode({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003' }),
				value: 'L003',
				field: 'Code',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeFalsy();
			});

		const req = httpTestingController.expectOne(`${webApiBaseUrl}estimate/assemblies/isuniquecode`);
		req.flush(false);
	});

	it('asyncValidateEstAssemblyCatFk expects valid is false when EstAssemblyCatFk is not valid', () => {
		service
			.asyncValidateEstAssemblyCatFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003' }),
				value: 'L003',
				field: 'EstAssemblyCatFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeFalsy();
			});

		const req = httpTestingController.expectOne(`${webApiBaseUrl}estimate/assemblies/isvalidassemblycat`);
		req.flush(false);
	});

	it('asyncValidateEstAssemblyCatFk expects valid is false when EstAssemblyCatFk is valid and assembly is not unique', () => {
		service
			.asyncValidateEstAssemblyCatFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003' }),
				value: 'L003',
				field: 'EstAssemblyCatFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeFalsy();
			});

		const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/assemblies/isvalidassemblycat`);
		req1.flush(true);

		const req2 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/assemblies/isuniquecode`);
		req2.flush(false);
	});

	it('asyncValidateEstAssemblyCatFk expects valid is true when EstAssemblyCatFk is valid and assembly is unique', () => {
		service
			.asyncValidateEstAssemblyCatFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003' }),
				value: 'L003',
				field: 'EstAssemblyCatFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});

		const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/assemblies/isvalidassemblycat`);
		req1.flush(true);

		const req2 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/assemblies/isuniquecode`);
		req2.flush(true);
	});

	it('asyncValidateIsGc expects valid is true when assemblyResourceDataService is null', () => {
		assemblyDataService.getAssemblyResourceDataService = jest.fn().mockReturnValue(null);
		service
			.asyncValidateIsGc({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003' }),
				value: 'L003',
				field: 'IsGc',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateIsDisabled expects valid is true when assemblyResourceDataService is null', () => {
		assemblyDataService.getAssemblyResourceDataService = jest.fn().mockReturnValue(null);
		service
			.asyncValidateIsDisabled({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003' }),
				value: 'L003',
				field: 'IsDisabled',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateMdcCostCodeFk expects valid is true when mdcCostCodeFk is undefined', () => {
		basicsSharedCostCodeLookupService.getItemByKey = jest.fn().mockReturnValue({
			UomFk: 1001,
		} as ICostCodeEntity);
		service
			.asyncValidateMdcCostCodeFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1001 }),
				value: undefined,
				field: 'MdcCostCodeFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateMdcCostCodeFk expects valid is false when costCodeEntity.UomFk not equal with info.entity.UomFk', () => {
		basicsSharedCostCodeLookupService.getItemByKey = jest.fn().mockReturnValue({
			UomFk: 1001,
		} as ICostCodeEntity);
		service
			.asyncValidateMdcCostCodeFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1,
				field: 'MdcCostCodeFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeFalsy();
			});
	});

	it('asyncValidateMdcCostCodeFk expects valid is true when costCodeEntity.UomFk equal with info.entity.UomFk', () => {
		basicsSharedCostCodeLookupService.getItemByKey = jest.fn().mockReturnValue({
			UomFk: 1001,
		} as ICostCodeEntity);
		service
			.asyncValidateMdcCostCodeFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1003 }),
				value: 1,
				field: 'MdcCostCodeFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeFalsy();
			});
	});

	it('asyncValidateMdcCostCodeFk expects valid is true when costCodeEntity.Dimension equal with info.entity Uom Dimension', () => {
		basicsSharedCostCodeLookupService.getItemByKey = jest.fn().mockReturnValue({
			UomFk: 1001,
		} as ICostCodeEntity);
		service
			.asyncValidateMdcCostCodeFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1,
				field: 'MdcCostCodeFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateMdcMaterialFk expects valid is true when mdcCostCodeFk is undefined', () => {
		basicsSharedMaterialLookupService.getItemByKey = jest.fn().mockReturnValue({
			BasUomFk: 1001,
		} as IMaterialSearchEntity);
		service
			.asyncValidateMdcMaterialFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1001 }),
				value: undefined,
				field: 'MdcMaterialFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateMdcMaterialFk expects valid is false when materialEntity.BasUomFk not equal with info.entity.UomFk', () => {
		basicsSharedMaterialLookupService.getItemByKey = jest.fn().mockReturnValue({
			BasUomFk: 1001,
		} as IMaterialSearchEntity);
		service
			.asyncValidateMdcMaterialFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 3,
				field: 'MdcMaterialFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeFalsy();
			});
	});

	it('asyncValidateMdcMaterialFk expects valid is true when materialEntity.BasUomFk equal with info.entity.UomFk', () => {
		basicsSharedMaterialLookupService.getItemByKey = jest.fn().mockReturnValue({
			BasUomFk: 1001,
		} as IMaterialSearchEntity);
		service
			.asyncValidateMdcMaterialFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1003 }),
				value: 1,
				field: 'MdcMaterialFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateMdcMaterialFk expects valid is true when materialEntity.Dimension equal with info.entity Uom Dimension', () => {
		basicsSharedMaterialLookupService.getItemByKey = jest.fn().mockReturnValue({
			BasUomFk: 1001,
		} as IMaterialSearchEntity);
		service
			.asyncValidateMdcMaterialFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1,
				field: 'MdcMaterialFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateBasUomFk expects valid is true when info.value is undefined', () => {
		service
			.asyncValidateBasUomFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1,
				field: 'BasUomFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateBasUomFk expects valid is true when info.entity.MdcCostCodeFk is null and info.entity.MdcMaterialFk is null', () => {
		service
			.asyncValidateBasUomFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1,
				field: 'BasUomFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateBasUomFk expects valid is false when info.entity.MdcCostCodeFk is not null and CostCodeEntity.Dimension not equal with BasUom.Dimension', () => {
		basicsSharedCostCodeLookupService.getItemByKey = jest.fn().mockReturnValue({
			UomFk: 1001,
		} as ICostCodeEntity);
		service
			.asyncValidateBasUomFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1003,
				field: 'BasUomFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeFalsy();
			});
	});

	it('asyncValidateBasUomFk expects valid is true when info.entity.MdcCostCodeFk is not null and CostCodeEntity.Dimension equal with BasUom.Dimension', () => {
		basicsSharedCostCodeLookupService.getItemByKey = jest.fn().mockReturnValue({
			UomFk: 1001,
		} as ICostCodeEntity);
		service
			.asyncValidateBasUomFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1002,
				field: 'BasUomFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});

	it('asyncValidateBasUomFk expects valid is false when info.entity.MdcMaterialFk is not null and materialEntity.Dimension not equal with BasUom.Dimension', () => {
		basicsSharedMaterialLookupService.getItemByKey = jest.fn().mockReturnValue({
			BasUomFk: 1001,
		} as IMaterialSearchEntity);
		service
			.asyncValidateBasUomFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1003,
				field: 'BasUomFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeFalsy();
			});
	});

	it('asyncValidateBasUomFk expects valid is true when info.entity.MdcMaterialFk is not null and materialEntity.Dimension equal with BasUom.Dimension', () => {
		basicsSharedMaterialLookupService.getItemByKey = jest.fn().mockReturnValue({
			BasUomFk: 1001,
		} as IMaterialSearchEntity);
		service
			.asyncValidateBasUomFk({
				entity: testDataBuilderService.createLineItem({ EstAssemblyCatFk: 1, Code: 'L003', UomFk: 1002 }),
				value: 1002,
				field: 'BasUomFk',
			})
			.then((validResult) => {
				expect(validResult.valid).toBeTruthy();
			});
	});
});

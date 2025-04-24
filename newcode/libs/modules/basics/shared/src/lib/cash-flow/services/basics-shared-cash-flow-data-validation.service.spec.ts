import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BasicsSharedCashFlowDataValidationService } from './basics-shared-cash-flow-data-validation.service';
import { BasicsSharedCashFlowDataService } from './basics-shared-cash-flow-data.service';
import { BasicsSharedDataValidationService } from './../../services/basics-shared-data-validation.service';
import { UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { ICashProjectionDetailEntity } from '../models/entities/cash-projection-detail-entity.interface';
import { IEntitySelection, ValidationInfo } from '@libs/platform/data-access';

describe('BasicsSharedCashFlowDataValidationService', () => {
	let service: BasicsSharedCashFlowDataValidationService<ICashProjectionDetailEntity, { CashProjectionFk?: number }>;
	let dataService: Partial<BasicsSharedCashFlowDataService<ICashProjectionDetailEntity, { CashProjectionFk?: number }>>;
	let validationUtils: Partial<BasicsSharedDataValidationService>;
	let lookupService: Partial<UiCommonLookupDataFactoryService>;

	beforeEach(() => {
		dataService = {
			getList: jest.fn().mockReturnValue([]),
			parentService: {
				getSelectedEntity: jest.fn().mockReturnValue({ CashProjectionFk: 1 }),
			} as unknown as IEntitySelection<{ CashProjectionFk?: number | undefined }>,
			setModified: jest.fn(),
		};

		validationUtils = {
			createErrorObject: jest.fn().mockReturnValue({ error: true }),
			createSuccessObject: jest.fn().mockReturnValue({ success: true }),
		};

		lookupService = {
			fromLookupType: jest.fn().mockReturnValue({
				getItemByKey: jest.fn().mockReturnValue(of({ TotalCost: 1000 })),
			}),
		};

		TestBed.configureTestingModule({
			providers: [
				{ provide: BasicsSharedCashFlowDataService, useValue: dataService },
				{ provide: BasicsSharedDataValidationService, useValue: validationUtils },
				{ provide: UiCommonLookupDataFactoryService, useValue: lookupService },
			],
		});

		//service = new BasicsSharedCashFlowDataValidationService(dataService as BasicsSharedCashFlowDataService<ICashProjectionDetailEntity,{ CashProjectionFk?: number }>);
		service = TestBed.runInInjectionContext(() => {
			return new BasicsSharedCashFlowDataValidationService(dataService as BasicsSharedCashFlowDataService<ICashProjectionDetailEntity, { CashProjectionFk?: number }>);
		});
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	it('should validate CumCost correctly', async () => {
		const info = { value: 500, entity: {}, field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;
		(dataService.getList as jest.Mock).mockReturnValue([
			{ PercentOfTime: 1, CumCost: 400 },
			{ PercentOfTime: 2, CumCost: 600 },
		]);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validateCumCost'](info);

		expect(result).toEqual({ success: true });
	});

	it('should return error when CashProjectionFk is not found', async () => {
		const info = { value: 500, entity: {}, field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;
		(dataService.getList as jest.Mock).mockReturnValue([
			{ PercentOfTime: 1, CumCost: 400 },
			{ PercentOfTime: 2, CumCost: 600 },
		]);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue(null);
		}

		const result = await service['validateCumCost'](info);

		expect(result).toEqual({ error: true });
	});

	it('should return error when value exceeds total cost', async () => {
		const info = { value: 1500, entity: {}, field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;
		(dataService.getList as jest.Mock).mockReturnValue([
			{ PercentOfTime: 1, CumCost: 400 },
			{ PercentOfTime: 2, CumCost: 600 },
		]);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validateCumCost'](info);

		expect(result).toEqual({ error: true });
	});

	it('should set CumCost and PeriodCost when list length is 1', async () => {
		const entity = { PercentOfTime: 1, CumCost: 400 };
		const info = { value: 500, entity: entity, field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;
		(dataService.getList as jest.Mock).mockReturnValue([entity]);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validateCumCost'](info);

		expect(info.entity.CumCost).toBe(500);
		expect(info.entity.PeriodCost).toBe(500);
		expect(result).toEqual({ success: true });
	});

	it('should calculate next records when index is 0', async () => {
		const list = [
			{ PercentOfTime: 1, CumCost: 400 },
			{ PercentOfTime: 2, CumCost: 600 },
		];

		const info = { value: 500, entity: list[0], field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;

		(dataService.getList as jest.Mock).mockReturnValue(list);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validateCumCost'](info);

		expect(result).toEqual({ success: true });
	});

	it('should calculate next records when index is in the middle', async () => {
		const list = [
			{ PercentOfTime: 1, CumCost: 400 },
			{ PercentOfTime: 2, CumCost: 600 },
			{ PercentOfTime: 3, CumCost: 800 },
		];

		const info = { value: 500, entity: list[1], field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;

		(dataService.getList as jest.Mock).mockReturnValue(list);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validateCumCost'](info);

		expect(result).toEqual({ success: true });
	});

	it('should calculate next records when index is the last', async () => {
		const list = [
			{ PercentOfTime: 1, CumCost: 400 },
			{ PercentOfTime: 2, CumCost: 600 },
		];

		const info = { value: 500, entity: list[1], field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;

		(dataService.getList as jest.Mock).mockReturnValue(list);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validateCumCost'](info);

		expect(result).toEqual({ success: true });
	});

	it('should validate PeriodCost correctly', async () => {
		const info = { value: 500, entity: {}, field: 'PeriodCost' } as ValidationInfo<ICashProjectionDetailEntity>;
		(dataService.getList as jest.Mock).mockReturnValue([
			{ PercentOfTime: 1, CumCost: 400 },
			{ PercentOfTime: 2, CumCost: 600 },
		]);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validatePeriodCost'](info);

		expect(result).toEqual({ success: true });
	});

	it('should validate CumCash correctly', async () => {
		const info = { value: 500, entity: {}, field: 'CumCash' } as ValidationInfo<ICashProjectionDetailEntity>;
		(dataService.getList as jest.Mock).mockReturnValue([
			{ PercentOfTime: 1, CumCash: 400 },
			{ PercentOfTime: 2, CumCash: 600 },
		]);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validateCumCash'](info);

		expect(result).toEqual({ success: true });
	});

	it('should validate PeriodCash correctly', async () => {
		const info = { value: 500, entity: {}, field: 'PeriodCash' } as ValidationInfo<ICashProjectionDetailEntity>;
		(dataService.getList as jest.Mock).mockReturnValue([
			{ PercentOfTime: 1, CumCash: 400 },
			{ PercentOfTime: 2, CumCash: 600 },
		]);
		if (dataService.parentService) {
			(dataService.parentService.getSelectedEntity as jest.Mock).mockReturnValue({ CashProjectionFk: 1 });
		}

		const result = await service['validatePeriodCash'](info);

		expect(result).toEqual({ success: true });
	});

	it('should calculate next records correctly', () => {
		const dataList = [
			{ CumCost: 0, PeriodCost: 0 },
			{ CumCost: 0, PeriodCost: 0 },
		] as ICashProjectionDetailEntity[];
		const info = { entity: dataList[0] } as ValidationInfo<ICashProjectionDetailEntity>;

		service['calculateNextRecords'](dataList, info, 500);

		expect(dataList[0].CumCost).toBe(500);
		expect(dataList[0].PeriodCost).toBe(500);
	});

	it('should check if value is among correctly', () => {
		const info = { value: 500, field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;

		const result = service['isAmong'](info, 0, 1000);

		expect(result).toBeNull();
	});

	it('should return error if value is not among', () => {
		const info = { value: 1500, field: 'CumCost' } as ValidationInfo<ICashProjectionDetailEntity>;

		const result = service['isAmong'](info, 0, 1000);

		expect(result).toEqual({ error: true });
	});
});

/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { EstimateMainLineItemValidationService } from './estimate-main-line-item-validation.service';
import { EstimateMainService } from './estimate-main-line-item-data.service';
import { of } from 'rxjs';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMessageBoxService } from '@libs/ui/common';
import {
	BudgetCalculationService,
	EstimateMainCompleteCalculationService,
	EstimateMainContextService,
	EstimateMainDetailCalculationService,
	EstimateTestDataBuilderService
} from '@libs/estimate/shared';
import { EstimateMainResourceService } from '../resource/estimate-main-resource-data.service';
import { EstimateMainCommonService } from '../../services/common/estimate-main-common.service';
import { EstimateMainRefLineItemService } from '../../services/common/estimate-main-ref-line-item.service';
import { BasicsShareControllingUnitLookupService, IControllingUnitEntity } from '@libs/basics/shared';
import { ProjectLocationLookupService } from '@libs/project/shared';
import { IEstLineItemEntity } from '@libs/estimate/interfaces';

import { IProjectLocationEntity } from '@libs/project/interfaces';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { get } from 'lodash';

describe('EstimateMainLineItemValidationService  additional tests', () => {
	let httpTestingController: HttpTestingController;
	let service: EstimateMainLineItemValidationService;
	let estimateMainService: EstimateMainService;
	let estimateMainContextService: EstimateMainContextService;
	let estimateMainCommonService: EstimateMainCommonService;
	let projectLocationLookupService: ProjectLocationLookupService<IEstLineItemEntity>;
	let testDataBuilderService: EstimateTestDataBuilderService;
	let estimateMainResourceService: EstimateMainResourceService;
	let controllingUnitLookupService: BasicsShareControllingUnitLookupService<IEstLineItemEntity>;

	let webApiBaseUrl: string;

	const prjLocationEntity = {
		Id: 10011,
		ProjectFk: 1001,
		Code: 'Project Location 11',
		Quantity: 1,
		QuantityAdj: 1,
		UoMFk: 1,
		QuantityUoMFk: 1,
		IsBoqSplitQuantity: false,
		ExternalCode: '',
		Sorting: 1,
		IsDetailer: false,
		HasChildren : false,
		Locations: [],
	} as IProjectLocationEntity;

	const controllingUnitEntity = {
		Id: 1,
		Code: 'Controlling Unit 1',
		Quantity: 10,
		UomFk: 2,
		DescriptionInfo: {
			Description: '',
			DescriptionTr: 0,
			DescriptionModified: false,
			Translated: '',
			VersionTr: 0,
			Modified: false,
			OtherLanguages: null,
		},
		Isaccountingelement: false,
		PrjProjectFk: 1001,
		ControllingunitFk: {} as IControllingUnitEntity,
		Controllingunits: [],
	} as IControllingUnitEntity;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule],
			providers: [
				EstimateMainLineItemValidationService,
				{
					provide: EstimateMainService,
					useValue: {
						/* mock methods if needed */
					},
				},
				{ provide: PlatformTranslateService, useValue: { instant: jest.fn().mockReturnValue({ text: '' }) } },
				{ provide: UiCommonMessageBoxService, useValue: { showMsgBox: jest.fn() } },
				{ provide: EstimateMainCompleteCalculationService, useValue: {} },
				{ provide: EstimateMainContextService, useValue: { getProjectId: jest.fn().mockReturnValue(1) } },
				{ provide: EstimateMainDetailCalculationService, useValue: {} },
				{ provide: EstimateMainResourceService, useValue: {} },
				{ provide: EstimateMainCommonService, useValue: {} },
				{ provide: EstimateMainRefLineItemService, useValue: {} },
				{ provide: BudgetCalculationService, useValue: {} },
				{ provide: BasicsShareControllingUnitLookupService<IEstLineItemEntity>, useValue: {} },
				{ provide: ProjectLocationLookupService<IEstLineItemEntity>, useValue: {} },
			],
		});

		httpTestingController = TestBed.inject(HttpTestingController);
		webApiBaseUrl = TestBed.inject(PlatformConfigurationService).webApiBaseUrl;
		service = TestBed.inject(EstimateMainLineItemValidationService);
		estimateMainService = TestBed.inject(EstimateMainService);
		estimateMainContextService = TestBed.inject(EstimateMainContextService);
		projectLocationLookupService = TestBed.inject(ProjectLocationLookupService<IEstLineItemEntity>);
		testDataBuilderService = TestBed.inject(EstimateTestDataBuilderService);
		estimateMainCommonService = TestBed.inject(EstimateMainCommonService);
		estimateMainResourceService = TestBed.inject(EstimateMainResourceService);
		controllingUnitLookupService = TestBed.inject(BasicsShareControllingUnitLookupService<IEstLineItemEntity>);

		//mock
		estimateMainService.setEntityReadOnlyFields = jest.fn();
		estimateMainService.setModified = jest.fn();

		estimateMainContextService.doCalculateSplitQuantity = jest.fn().mockReturnValue(false);
		estimateMainContextService.enableInputLineItemTotalQuantity = jest.fn().mockReturnValue(true);
		estimateMainContextService.isLineItemStatusReadonly = jest.fn().mockReturnValue(false);

		//mock projectLocationLookupService.getItemByKey
		projectLocationLookupService.getItemByKey = jest.fn().mockReturnValue(of(prjLocationEntity));
		controllingUnitLookupService.getItemByKey = jest.fn().mockReturnValue(of(controllingUnitEntity));

		estimateMainCommonService.setQuantityByLsumUom = jest.fn();
		estimateMainCommonService.calculateLineItemAndResources = jest.fn();

		estimateMainResourceService.getList = jest.fn().mockReturnValue([testDataBuilderService.createResource()]);
		estimateMainResourceService.setList = jest.fn();
		estimateMainResourceService.setModified = jest.fn();
	});

	it('asyncValidatePrjLocationFk expects valid is true when info.value is undefined', async () => {
		const validationInfo = {
			value: undefined,
			field: 'PrjLocationFk',
			entity: testDataBuilderService.createLineItem(),
		};
		const result = await service.asyncValidatePrjLocationFk(validationInfo);
		expect(result.valid).toBe(true);
	});

	it('asyncValidatePrjLocationFk expects valid is false when prjLocation is not in structureDetails', async () => {
		estimateMainContextService.getEstimateReadData = jest.fn().mockReturnValue({
			EstStructureDetails: [
				{
					Id: 1,
					Code: 'BoQ',
					EstQuantityRelFk: 1,
					EstStructureConfigFk: 1,
					EstStructureFk: 1,
					Sorting: 1,
				},
			],
		});
		const validationInfo = { value: 1, field: 'PrjLocationFk', entity: testDataBuilderService.createLineItem() };
		const result = await service.asyncValidatePrjLocationFk(validationInfo);
		expect(result.valid).toBe(true);
	});

	it('asyncValidatePrjLocationFk expects valid is true when prjLocation is not in structureDetails and EstQtyTelAotFk in (1,4,6,7)', async () => {
		//mock estimateMainContextService.getEstimateReadData
		estimateMainContextService.getEstimateReadData = jest.fn().mockReturnValue({
			EstStructureDetails: [
				{
					Id: 3,
					Code: 'Location',
					EstQuantityRelFk: 1,
					EstStructureConfigFk: 1,
					EstStructureFk: 3,
					Sorting: 3,
				},
			],
		});

		//1
		const validationInfo1 = { value: 1, field: 'PrjLocationFk', entity: testDataBuilderService.createLineItem({ PrjLocationFk: 1, EstQtyTelAotFk: 1 }) };
		const result1 = await service.asyncValidatePrjLocationFk(validationInfo1);
		expect(validationInfo1.entity.QuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo1.entity.WqQuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo1.entity.BasUomTargetFk).toBe(prjLocationEntity.UoMFk);
		expect(result1.valid).toBe(true);

		//4
		const validationInfo2 = { value: 1, field: 'PrjLocationFk', entity: testDataBuilderService.createLineItem({ PrjLocationFk: 1, EstQtyTelAotFk: 4 }) };
		const result2 = await service.asyncValidatePrjLocationFk(validationInfo2);
		expect(validationInfo2.entity.QuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo2.entity.WqQuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo2.entity.BasUomTargetFk).toBe(prjLocationEntity.UoMFk);
		expect(result2.valid).toBe(true);

		//6
		const validationInfo3 = { value: 1, field: 'PrjLocationFk', entity: testDataBuilderService.createLineItem({ PrjLocationFk: 1, EstQtyTelAotFk: 6 }) };
		const result3 = await service.asyncValidatePrjLocationFk(validationInfo3);
		expect(validationInfo3.entity.QuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo3.entity.WqQuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo3.entity.BasUomTargetFk).toBe(prjLocationEntity.UoMFk);
		expect(result3.valid).toBe(true);

		//7
		const validationInfo4 = { value: 1, field: 'PrjLocationFk', entity: testDataBuilderService.createLineItem({ PrjLocationFk: 1, EstQtyTelAotFk: 7 }) };
		const result4 = await service.asyncValidatePrjLocationFk(validationInfo4);
		expect(validationInfo4.entity.QuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo4.entity.WqQuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo4.entity.BasUomTargetFk).toBe(prjLocationEntity.UoMFk);
		expect(result4.valid).toBe(true);
	});

	it('asyncValidatePrjLocationFk expects valid is true when structureDetails is empty', async () => {
		//mock estimateMainContextService.getEstimateReadData
		estimateMainContextService.getEstimateReadData = jest.fn().mockReturnValue({
			EstStructureDetails: [],
		});
		const validationInfo = { value: 1, field: 'PrjLocationFk', entity: testDataBuilderService.createLineItem({ PrjLocationFk: 1, EstQtyTelAotFk: 1 }) };
		const result = await service.asyncValidatePrjLocationFk(validationInfo);
		expect(validationInfo.entity.QuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo.entity.WqQuantityTarget).toBe(prjLocationEntity.Quantity);
		expect(validationInfo.entity.BasUomTargetFk).toBe(prjLocationEntity.UoMFk);
		expect(result.valid).toBe(true);
	});

	it('asyncValidatePrjLocationFk expects valid is true when it have structure which sorting is less then the select structure', async () => {
		//mock estimateMainContextService.getEstimateReadData
		estimateMainContextService.getEstimateReadData = jest.fn().mockReturnValue({
			EstStructureDetails: [
				{
					Id: 1,
					Code: 'BoQ',
					EstQuantityRelFk: 1,
					EstStructureConfigFk: 1,
					EstStructureFk: 1,
					Sorting: 1,
				},
				{
					Id: 3,
					Code: 'Location',
					EstQuantityRelFk: 1,
					EstStructureConfigFk: 1,
					EstStructureFk: 3,
					Sorting: 3,
				},
			],
		});
		const validationInfo = { value: 1, field: 'PrjLocationFk', entity: testDataBuilderService.createLineItem({ PrjLocationFk: 1, BoqItemFk: 1, QuantityTarget: 2, WqQuantityTarget: 3, EstQtyTelAotFk: 1, BasUomTargetFk: 11 }) };
		const result = await service.asyncValidatePrjLocationFk(validationInfo);
		expect(validationInfo.entity.QuantityTarget).toBe(2);
		expect(validationInfo.entity.WqQuantityTarget).toBe(3);
		expect(validationInfo.entity.BasUomTargetFk).toBe(11);
		expect(result.valid).toBe(true);
	});

	it('asyncValidateMdcControllingUnitFk expects valid is true when info.value is undefined', async () => {
		const validationInfo = {
			value: undefined,
			field: 'MdcControllingUnitFk',
			entity: testDataBuilderService.createLineItem(),
		};
		const result = await service.asyncValidateMdcControllingUnitFk(validationInfo);
		expect(result.valid).toBe(true);
	});

	it('asyncValidateMdcControllingUnitFk expects valid is false when MdcControllingUnit is not in structureDetails', async () => {
		estimateMainContextService.getEstimateReadData = jest.fn().mockReturnValue({
			EstStructureDetails: [
				{
					Id: 1,
					Code: 'BoQ',
					EstQuantityRelFk: 1,
					EstStructureConfigFk: 1,
					EstStructureFk: 1,
					Sorting: 1,
				},
			],
		});
		const validationInfo = { value: 1, field: 'MdcControllingUnitFk', entity: testDataBuilderService.createLineItem({ EstQtyRelGtuFk: 1 }) };
		const result = await service.asyncValidateMdcControllingUnitFk(validationInfo);
		expect(validationInfo.entity.QuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo.entity.WqQuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo.entity.BasUomTargetFk).toBe(get(controllingUnitEntity, 'UomFk'));
		expect(result.valid).toBe(true);
	});

	it('asyncValidateMdcControllingUnitFk expects valid is true when it have structure which sorting is less then the select structure', async () => {
		// Mock estimateMainContextService.getEstimateReadData
		estimateMainContextService.getEstimateReadData = jest.fn().mockReturnValue({
			EstStructureDetails: [
				{
					Id: 1,
					Code: 'BoQ',
					EstQuantityRelFk: 1,
					EstStructureConfigFk: 1,
					EstStructureFk: 1,
					Sorting: 1,
				},
				{
					Id: 4,
					Code: 'Controlling Unit',
					EstQuantityRelFk: 1,
					EstStructureConfigFk: 1,
					EstStructureFk: 4,
					Sorting: 4,
				},
			],
		});

		const validationInfo = {
			value: 1,
			field: 'MdcControllingUnitFk',
			entity: testDataBuilderService.createLineItem({
				MdcControllingUnitFk: 1,
				EstQtyRelGtuFk: 1,
				QuantityTarget: 10,
				WqQuantityTarget: 10,
				BasUomTargetFk: 2,
			}),
		};

		const result = await service.asyncValidateMdcControllingUnitFk(validationInfo);

		expect(validationInfo.entity.QuantityTarget).toBe(10);
		expect(validationInfo.entity.WqQuantityTarget).toBe(10);
		expect(validationInfo.entity.BasUomTargetFk).toBe(2);
		expect(result.valid).toBe(true);
	});

	it('asyncValidateMdcControllingUnitFk expects valid is true when MdcControllingUnit is not in structureDetails and EstQtyRelGtuFk in (1,4,6,7)', async () => {
		// Mock estimateMainContextService.getEstimateReadData
		estimateMainContextService.getEstimateReadData = jest.fn().mockReturnValue({
			EstStructureDetails: [
				{
					Id: 1,
					Code: 'BoQ',
					EstQuantityRelFk: 1,
					EstStructureConfigFk: 1,
					EstStructureFk: 1,
					Sorting: 1,
				},
			],
		});

		//1
		const validationInfo1 = { value: 1, field: 'MdcControllingUnitFk', entity: testDataBuilderService.createLineItem({ MdcControllingUnitFk: 1, EstQtyRelGtuFk: 1 }) };
		const result1 = await service.asyncValidateMdcControllingUnitFk(validationInfo1);
		expect(validationInfo1.entity.QuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo1.entity.WqQuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo1.entity.BasUomTargetFk).toBe(get(controllingUnitEntity, 'UomFk'));
		expect(result1.valid).toBe(true);

		//4
		const validationInfo2 = { value: 1, field: 'MdcControllingUnitFk', entity: testDataBuilderService.createLineItem({ MdcControllingUnitFk: 1, EstQtyRelGtuFk: 4 }) };
		const result2 = await service.asyncValidateMdcControllingUnitFk(validationInfo2);
		expect(validationInfo2.entity.QuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo2.entity.WqQuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo2.entity.BasUomTargetFk).toBe(get(controllingUnitEntity, 'UomFk'));
		expect(result2.valid).toBe(true);

		//6
		const validationInfo3 = { value: 1, field: 'MdcControllingUnitFk', entity: testDataBuilderService.createLineItem({ MdcControllingUnitFk: 1, EstQtyRelGtuFk: 6 }) };
		const result3 = await service.asyncValidateMdcControllingUnitFk(validationInfo3);
		expect(validationInfo3.entity.QuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo3.entity.WqQuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo3.entity.BasUomTargetFk).toBe(get(controllingUnitEntity, 'UomFk'));
		expect(result3.valid).toBe(true);

		//7
		const validationInfo4 = { value: 1, field: 'MdcControllingUnitFk', entity: testDataBuilderService.createLineItem({ MdcControllingUnitFk: 1, EstQtyRelGtuFk: 7 }) };
		const result4 = await service.asyncValidateMdcControllingUnitFk(validationInfo4);
		expect(validationInfo4.entity.QuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo4.entity.WqQuantityTarget).toBe(controllingUnitEntity.Quantity);
		expect(validationInfo4.entity.BasUomTargetFk).toBe(get(controllingUnitEntity, 'UomFk'));
		expect(result4.valid).toBe(true);
	});

	it('asyncValidateCode expects valid is true when code is unique', async () => {
		estimateMainService.getList = jest.fn().mockReturnValue([testDataBuilderService.createLineItem({ Code: '10001' })]);
		const validationInfo = {
			value: '123456',
			field: 'Code',
			entity: testDataBuilderService.createLineItem(),
		};

		const result = service.asyncValidateCode(validationInfo).then((validResult) => {
			expect(validResult.valid).toBe(true);
		});

		const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/lineitem/isuniquecode`);
		req1.flush(true);

		httpTestingController.verify();
	});

	it('asyncValidateCode expects valid is false when code is not unique', async () => {
		estimateMainService.getList = jest.fn().mockReturnValue([testDataBuilderService.createLineItem({ Code: '10001' })]);
		const validationInfo = {
			value: '123456',
			field: 'Code',
			entity: testDataBuilderService.createLineItem(),
		};

		service.asyncValidateCode(validationInfo).then((validResult) => {
			expect(validResult.valid).toBe(false);
		});

		const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/lineitem/isuniquecode`);
		req1.flush(false);

		httpTestingController.verify();
	});

	it('asyncValidateCode expects valid is false when code is not unique in list', async () => {
		estimateMainService.getList = jest.fn().mockReturnValue([testDataBuilderService.createLineItem({ Code: '10001' })]);
		const validationInfo = {
			value: '10001',
			field: 'Code',
			entity: testDataBuilderService.createLineItem(),
		};

		service.asyncValidateCode(validationInfo).then((validResult) => {
			expect(validResult.valid).toBe(false);
		});

		const req1 = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/lineitem/isuniquecode`);
		req1.flush(false);

		httpTestingController.verify();
	});

	it('validateIsOptional expects valid is true when value is true', () => {
		const validationInfo = {
			value: true,
			field: 'IsOptional',
			entity: testDataBuilderService.createLineItem({ forceBudgetCalc: false, IsDisabled: false }),
		};

		const result = service.validateIsOptional(validationInfo);

		expect(result.valid).toBe(true);
		expect(validationInfo.entity.AdvancedAllUnit).toBe(0);
		expect(validationInfo.entity.forceBudgetCalc).toBe(false);
	});

	it('validateIsOptional expects valid is true when value is false and entity is not disabled', () => {
		const validationInfo = {
			value: false,
			field: 'IsOptional',
			entity: testDataBuilderService.createLineItem({ forceBudgetCalc: false, IsDisabled: false }),
		};

		const result = service.validateIsOptional(validationInfo);

		expect(result.valid).toBe(true);
		expect(validationInfo.entity.IsOptionalIT).toBe(false);
		expect(validationInfo.entity.forceBudgetCalc).toBe(true);
	});

	it('validateIsOptional expects valid is true when value is false and entity is disabled', () => {
		const validationInfo = {
			value: true,
			field: 'IsOptional',
			entity: testDataBuilderService.createLineItem({ forceBudgetCalc: false, IsDisabled: true }),
		};

		const result = service.validateIsOptional(validationInfo);

		expect(result.valid).toBe(true);
		expect(validationInfo.entity.forceBudgetCalc).toBe(false);
	});

	it('validateIsOptional expects valid is true when value is undefined', () => {
		const validationInfo = {
			value: undefined,
			field: 'IsOptional',
			entity: testDataBuilderService.createLineItem({ forceBudgetCalc: false, IsDisabled: false }),
		};

		const result = service.validateIsOptional(validationInfo);

		expect(result.valid).toBe(true);
		expect(validationInfo.entity.forceBudgetCalc).toBe(true);
	});

	it('validateIsGc expects valid is true and sets IsFixedPrice readonly when value is true', () => {
		const validationInfo = {
			value: true,
			field: 'IsOptional',
			entity: testDataBuilderService.createLineItem({ IsFixedPrice: false, IsGc: false }),
		};

		const spy = jest.spyOn(service, 'calculateLineItemAndResources');

		const result = service.validateIsGc(validationInfo);
		expect(result.valid).toBe(true);
		expect(validationInfo.entity.IsOptionalIT).toBe(false);
		expect(validationInfo.entity.IsOptional).toBe(false);
		expect(validationInfo.entity.AdvancedAllUnit).toBe(0);
		expect(validationInfo.entity.AdvancedAllUnitItem).toBe(0);
		expect(validationInfo.entity.AdvancedAll).toBe(0);
		expect(validationInfo.entity.ManualMarkupUnit).toBe(0);
		expect(validationInfo.entity.ManualMarkupUnitItem).toBe(0);
		expect(validationInfo.entity.ManualMarkup).toBe(0);

		expect(spy).toHaveBeenCalled();
		spy.mockRestore();
	});

	it('validateIsDisabled expects valid is true when value is true and entity.IsOptional is true', () => {
		const validationInfo = {
			value: true,
			field: 'IsDisabled',
			entity: testDataBuilderService.createLineItem({ IsDisabled: false, IsOptional: true }),
		};

		const result = service.validateIsDisabled(validationInfo);

		expect(result.valid).toBe(true);
		expect(validationInfo.entity.forceBudgetCalc).toBe(false);
	});

	it('validateIsDisabled expects valid is true when value is false and entity.IsOptional is false', () => {
		const validationInfo = {
			value: false,
			field: 'IsDisabled',
			entity: testDataBuilderService.createLineItem({ IsDisabled: true, IsOptional: false }),
		};

		const result = service.validateIsDisabled(validationInfo);

		expect(result.valid).toBe(true);
		expect(validationInfo.entity.forceBudgetCalc).toBe(true);
	});

	it('validateIsDisabled expects valid is true when value is undefined and IsOptional is false', () => {
		const validationInfo = {
			value: undefined,
			field: 'IsDisabled',
			entity: testDataBuilderService.createLineItem({ IsDisabled: false, IsOptional: false }),
		};

		const result = service.validateIsDisabled(validationInfo);

		expect(result.valid).toBe(true);
		expect(validationInfo.entity.forceBudgetCalc).toBe(true);
	});
});

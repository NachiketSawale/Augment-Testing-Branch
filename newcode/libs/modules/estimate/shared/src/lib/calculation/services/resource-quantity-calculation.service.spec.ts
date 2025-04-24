/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { ResourceQuantityCalculationService } from './resource-quantity-calculation.service';
import { EstimateMainRoundingService } from '../../common/services/rounding/estimate-main-rounding.service';
import { EstimateMainContextService } from '../../common/services/estimate-main-context.service';
import { EstimateMainResourceTypeService } from '../../common/services/estimate-main-resource-type.service';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { EstimateTestDataBuilderService } from '../../unit-test-data/estimate-test-data-builder.service';

describe('ResourceQuantityCalculationService', () => {
	let service: ResourceQuantityCalculationService;
	let roundingService: EstimateMainRoundingService;
	let contextService: EstimateMainContextService;
	let resourceTypeService: EstimateMainResourceTypeService;
	let testDataBuilderService: EstimateTestDataBuilderService;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				ResourceQuantityCalculationService,
				{ provide: EstimateMainRoundingService, useValue: { roundInitialQuantities: jest.fn() } },
				{ provide: EstimateMainContextService, useValue: {} },
				{ provide: EstimateMainResourceTypeService, useValue: { isEquipmentAssembly: jest.fn() } },
			],
		});

		service = TestBed.inject(ResourceQuantityCalculationService);
		roundingService = TestBed.inject(EstimateMainRoundingService);
		contextService = TestBed.inject(EstimateMainContextService);
		resourceTypeService = TestBed.inject(EstimateMainResourceTypeService);
		testDataBuilderService = TestBed.inject(EstimateTestDataBuilderService);

		//mock doRoundingValue function
		roundingService.doRoundingValue = jest.fn((x, y) => {
			return y;
		});

		resourceTypeService.isSubItemOrCompositeAssembly = jest.fn(e => e.EstResourceTypeFk === 5);
	});

	it('calculateQuantityOfResource set QuantityTotal to zero when Quantity is zero and resource IsLumpsum is true ', () => {
		const resource: IEstResourceEntity = testDataBuilderService.createResource({ Quantity: 0, IsLumpsum: true });
		const lineItem: IEstLineItemEntity = testDataBuilderService.createLineItem();

		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(0);
		expect(resource.QuantityInternal).toBe(0);
		expect(resource.QuantityUnitTarget).toBe(0);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity when resource IsLumpsum is true and all Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(10);
		expect(resource.QuantityTotal).toBe(10);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity * QuantityFactor1 when IsLumpsum is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, QuantityFactor1: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(20);
		expect(resource.QuantityInternal).toBe(20);
		expect(resource.QuantityUnitTarget).toBe(20);
		expect(resource.QuantityTotal).toBe(20);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity * QuantityFactor2 when IsLumpsum is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, QuantityFactor2: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(20);
		expect(resource.QuantityInternal).toBe(20);
		expect(resource.QuantityUnitTarget).toBe(20);
		expect(resource.QuantityTotal).toBe(20);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity * QuantityFactor3 when IsLumpsum is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, QuantityFactor3: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(20);
		expect(resource.QuantityInternal).toBe(20);
		expect(resource.QuantityUnitTarget).toBe(20);
		expect(resource.QuantityTotal).toBe(20);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity * QuantityFactor4 when IsLumpsum is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, QuantityFactor4: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(20);
		expect(resource.QuantityInternal).toBe(20);
		expect(resource.QuantityUnitTarget).toBe(20);
		expect(resource.QuantityTotal).toBe(20);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity * ProductivityFactor when IsLumpsum is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, ProductivityFactor: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(20);
		expect(resource.QuantityInternal).toBe(20);
		expect(resource.QuantityUnitTarget).toBe(20);
		expect(resource.QuantityTotal).toBe(20);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity * QuantityFactorCc when IsLumpsum is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, QuantityFactorCc: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(20);
		expect(resource.QuantityInternal).toBe(20);
		expect(resource.QuantityUnitTarget).toBe(20);
		expect(resource.QuantityTotal).toBe(20);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity / EfficiencyFactor1 when IsLumpsum is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, EfficiencyFactor1: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(5);
		expect(resource.QuantityInternal).toBe(5);
		expect(resource.QuantityUnitTarget).toBe(5);
		expect(resource.QuantityTotal).toBe(5);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity / EfficiencyFactor2 when IsLumpsum is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, EfficiencyFactor2: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(5);
		expect(resource.QuantityInternal).toBe(5);
		expect(resource.QuantityUnitTarget).toBe(5);
		expect(resource.QuantityTotal).toBe(5);
	});

	// it('calculateQuantityOfResource should throw exception when EfficiencyFactor1 is zero and IsLumpsum is true', ()=>{
	// 	const resource = testDataBuilderService.createResource({Quantity : 10, IsLumpsum: true, EfficiencyFactor1: 0});
	// 	const lineItem = testDataBuilderService.createLineItem();
	// 	expect(() => service.calculateQuantityOfResource(resource, lineItem, null)).toThrow();
	// });
	//
	// it('calculateQuantityOfResource should throw exception when EfficiencyFactor2 is zero and IsLumpsum is true', ()=>{
	// 	const resource = testDataBuilderService.createResource({Quantity : 10, IsLumpsum: true, EfficiencyFactor2: 0});
	// 	const lineItem = testDataBuilderService.createLineItem();
	// 	expect(() => service.calculateQuantityOfResource(resource, lineItem, null)).toThrow();
	// });

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity when IsLumpsum is true, IsCalcTotalWithWQ is true and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, WqQuantityTarget: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		contextService.IsCalcTotalWithWQ = true;
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(10);
		expect(resource.QuantityTotal).toBe(10);
	});

	it('calculateQuantityOfResource set QuantityTotal equal to Quantity when IsLumpsum is true, IsCalcTotalWithWQ is false and other Quantity factor is 1', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, QuantityTarget: 2 });
		const lineItem = testDataBuilderService.createLineItem();
		contextService.IsCalcTotalWithWQ = false;
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(10);
		expect(resource.QuantityTotal).toBe(10);
	});

	it('calculateQuantityOfResource set QuantityTotal to zero when IsDisabled is true and IsLumpsum is true', () => {
		const resource: IEstResourceEntity = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, IsDisabled: true });
		const lineItem: IEstLineItemEntity = testDataBuilderService.createLineItem();

		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(0);
		expect(resource.QuantityInternal).toBe(0);
		expect(resource.QuantityUnitTarget).toBe(0);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource set QuantityTotal to zero when IsDisabledPrc is true and IsLumpsum is true', () => {
		const resource: IEstResourceEntity = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true, IsDisabledPrc: true });
		const lineItem: IEstLineItemEntity = testDataBuilderService.createLineItem();

		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(0);
		expect(resource.QuantityInternal).toBe(0);
		expect(resource.QuantityUnitTarget).toBe(0);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource set QuantityTotal to zero when lineItem IsDisabled is true and resource IsLumpsum is true', () => {
		const resource: IEstResourceEntity = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true });
		const lineItem: IEstLineItemEntity = testDataBuilderService.createLineItem({ IsDisabled: true });

		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(0);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource set QuantityTotal to zero when lineItem IsDisabled is true and resource IsLumpsum is true', () => {
		const resource: IEstResourceEntity = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true });
		const lineItem: IEstLineItemEntity = testDataBuilderService.createLineItem({ IsDisabled: true });

		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(0);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource set QuantityTotal to zero when lineItem IsOptional is true, IsOptionalIT is false and resource IsLumpsum is true', () => {
		const resource: IEstResourceEntity = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: true });
		const lineItem: IEstLineItemEntity = testDataBuilderService.createLineItem({ IsOptional: true, IsOptionalIT: false });

		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(0);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource sets correct values when IsLumpsum is false and parentResource is null', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: false });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(lineItem.QuantityUnitTarget * 10);
		expect(resource.QuantityTotal).toBe(lineItem.QuantityTotal * 10);
	});

	it('calculateQuantityOfResource sets QuantityTotal to zero when IsDisabled is true and IsLumpsum is false', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: false, IsDisabled: true });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(0);
		expect(resource.QuantityInternal).toBe(0);
		expect(resource.QuantityUnitTarget).toBe(0);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource sets QuantityTotal to zero when IsDisabledPrc is true and IsLumpsum is false', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: false, IsDisabledPrc: true });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(0);
		expect(resource.QuantityInternal).toBe(0);
		expect(resource.QuantityUnitTarget).toBe(0);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource expect QuantityTotal is correct when lineItem IsDisabled is true and resource IsLumpsum is false', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: false });
		const lineItem = testDataBuilderService.createLineItem({ IsDisabled: true });
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(10);
		expect(resource.QuantityTotal).toBe(10);
	});

	it('calculateQuantityOfResource sets QuantityTotal to zero when lineItem IsOptional is true, IsOptionalIT is false and resource IsLumpsum is false', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: false });
		const lineItem = testDataBuilderService.createLineItem({ IsOptional: true, IsOptionalIT: false });
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(10);
		expect(resource.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfResource sets QuantityTotal correctly when lineItem IsOptional is true, IsOptionalIT is true and resource IsLumpsum is false', () => {
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: false });
		const lineItem = testDataBuilderService.createLineItem({ IsOptional: true, IsOptionalIT: true });
		service.calculateQuantityOfResource(resource, lineItem, null);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(10);
		expect(resource.QuantityUnitTarget).toBe(lineItem.QuantityUnitTarget * 10);
		expect(resource.QuantityTotal).toBe(lineItem.QuantityTotal * 10);
	});

	it('calculateQuantityOfResource expects QuantityTotal is correct when parent is not null and resource IsLumpsum is false', () => {
		const parentResource = testDataBuilderService.createResource({ QuantityInternal: 2 });
		const resource = testDataBuilderService.createResource({ Quantity: 10, IsLumpsum: false });
		const lineItem = testDataBuilderService.createLineItem();
		service.calculateQuantityOfResource(resource, lineItem, parentResource);

		expect(resource.QuantityReal).toBe(10);
		expect(resource.QuantityInternal).toBe(20);
		expect(resource.QuantityUnitTarget).toBe(lineItem.QuantityUnitTarget * 20);
		expect(resource.QuantityTotal).toBe(lineItem.QuantityTotal * 20);
	});

	it('calculateQuantityTotalOfResources calculates correctly for first level resources', () => {
		const lineItem = testDataBuilderService.createLineItem();
		const resources = [testDataBuilderService.createResource({ EstResourceFk: null, Quantity: 10, IsLumpsum: false }), testDataBuilderService.createResource({ EstResourceFk: null, Quantity: 5, IsLumpsum: false })];
		const getChildren = jest.fn().mockReturnValue([]);
		service.calculateQuantityTotalOfResources(lineItem, resources, getChildren);

		expect(resources[0].QuantityTotal).toBe(lineItem.QuantityTotal * 10);
		expect(resources[1].QuantityTotal).toBe(lineItem.QuantityTotal * 5);
	});

	it('calculateQuantityTotalOfResources calculates correctly for nested resources', () => {
		const lineItem = testDataBuilderService.createLineItem();
		const parentResource = testDataBuilderService.createResource({ EstResourceFk: null, Quantity: 10, IsLumpsum: false, EstResourceTypeFk: 5 });
		const childResource = testDataBuilderService.createResource({ EstResourceFk: parentResource.Id, Quantity: 5, IsLumpsum: false });
		const resources = [parentResource];
		const getChildren = jest.fn().mockReturnValue([childResource]);
		service.calculateQuantityTotalOfResources(lineItem, resources, getChildren);

		expect(parentResource.QuantityTotal).toBe(lineItem.QuantityTotal * 10);
		expect(childResource.QuantityTotal).toBe(lineItem.QuantityTotal * 10 * 5);
	});

	it('calculateQuantityTotalOfResources handles resources with IsOptional and IsOptionalIT flags', () => {
		const lineItem = testDataBuilderService.createLineItem({ IsOptional: true, IsOptionalIT: false });
		const resources = [testDataBuilderService.createResource({ EstResourceFk: null, Quantity: 10, IsLumpsum: false })];
		const getChildren = jest.fn().mockReturnValue([]);
		service.calculateQuantityTotalOfResources(lineItem, resources, getChildren);

		expect(resources[0].QuantityTotal).toBe(0);
	});
});

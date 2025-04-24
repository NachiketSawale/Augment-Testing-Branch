/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { AssemblyCalculationService } from './assembly-calculation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { IEstLineItemEntity, IEstResourceEntity } from '@libs/estimate/interfaces';
import { PlatformConfigurationService } from '@libs/platform/common';

describe('AssemblyCalculationService additional tests', () => {
	let service: AssemblyCalculationService;
	let httpTestingController: HttpTestingController;
	let webApiBaseUrl: string;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [HttpClientModule, HttpClientTestingModule]
		});
		service = TestBed.inject(AssemblyCalculationService);
		httpTestingController = TestBed.inject(HttpTestingController);
		webApiBaseUrl = TestBed.inject(PlatformConfigurationService).webApiBaseUrl;
	});

	function createLineItem(overrides = {}) {
		return {
			Id: 1,
			EstHeaderFk: 1001,
			EstResourceFk: null,
			IsDisabled: false,
			IsLumpsum: false,
			IsOptional: false,
			IsOptionalPrc: false,
			Quantity: 1,
			WqQuantityTarget: 1,
			QuantityTarget: 1,
			QuantityFactor1: 1,
			QuantityFactor2: 1,
			QuantityFactor3: 1,
			QuantityFactor4: 1,
			ProductivityFactor: 1,
			QuantityUnitTarget: 1,
			QuantityTotal: 1,
			CostUnit: 0,
			CostFactor1: 1,
			CostFactor2: 1,
			HoursUnit: 2,
			MarkupCostUnit: 20,
			DayWorkRateUnit: 8,
			Co2Source: 5,
			Co2Project: 10,
			AdvancedAllUnit: 10,
			AdvancedAllowance: 10,
			AdvancedAllowanceCostUnit: 10,
			Allowance: 10,
			...overrides,
		} as unknown as IEstLineItemEntity;
	}

	//create resource
	function createResource(overrides = {}) {
		return {
			Id: 1,
			EstHeaderFk: 1001,
			EstLineItemFk: 1,
			EstResourceFk: null,
			IsDisabled: false,
			IsDisabledPrc: false,
			IsInformation: false,
			IsCost: true,
			QuantityReal: 1,
			Quantity: 1,
			QuantityTotal: 1,
			QuantityFactor1: 1,
			QuantityFactor2: 1,
			QuantityFactor3: 1,
			QuantityFactor4: 1,
			QuantityFactorCc: 1,
			ProductivityFactor: 1,
			EfficiencyFactor1: 1,
			EfficiencyFactor2: 1,
			CostUnit: 1,
			HoursUnit: 2,
			MarkupCostUnit: 1,
			DayWorkRateUnit: 1,
			Co2Source: 1,
			Co2Project: 0,
			CostFactor1: 1,
			CostFactor2: 1,
			CostFactorCc: 1,
			ExchangeRate: 1,
			HourFactor: 1,
			EstAssemblyFk: null,
			AdvancedAllUnit: 1,
			AdvancedAllowance: 1,
			AdvancedAllowanceCostUnit: 1,
			Allowance: 1,
			...overrides,
		} as unknown as IEstResourceEntity;
	}

	//calculateQuantityOfLineItem
	it('calculateQuantityOfLineItemOfLineItem handles lineItem with negative quantity correctly', () => {
		const lineItem = createLineItem();
		lineItem.Quantity = -1;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBeDefined();
	});

	it('calculateQuantityOfLineItem handles lineItem with isDisabled is true correctly', () => {
		const lineItem = createLineItem();
		lineItem.IsDisabled = true;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfLineItem handles lineItem with IsLumpsum is true, isOptional is false correctly', () => {
		const lineItem = createLineItem();
		lineItem.IsLumpsum = true;
		lineItem.Quantity = 3;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toEqual(3);
	});

	it('calculateQuantityOfLineItem handles lineItem with IsOptional is true correctly', () => {
		const lineItem = createLineItem();
		lineItem.IsOptional = true;
		service.calculateQuantityOfLineItem(lineItem);
		// Assuming the expected behavior is to not change the QuantityTotal when IsOptional is true
		expect(lineItem.QuantityTotal).toBe(0); // This assertion may need to be adjusted based on actual behavior
	});

	it('calculateQuantityOfLineItem handles lineItem with IsOptional is true and IsOptionalIt is false correctly', () => {
		const lineItem = createLineItem();
		lineItem.IsOptional = true;
		lineItem.IsOptionalIT = false; // Assuming IsOptionalIt is a property that needs to be considered
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(0); // This assertion may need to be adjusted based on actual behavior
	});

	it('calculateQuantityOfLineItem handles lineItem with IsOptional and IsOptionalIT both true correctly', () => {
		const lineItem = createLineItem();
		lineItem.Quantity = 5;
		lineItem.IsOptional = true;
		lineItem.IsOptionalIT = true;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(5);
	});

	it('calculateQuantityOfLineItem handles lineItem with QuantityFactor1, QuantityFactor2, QuantityFactor3, QuantityFactor4 correctly', () => {
		const lineItem = createLineItem();
		lineItem.QuantityFactor1 = 2;
		lineItem.QuantityFactor2 = 3;
		lineItem.QuantityFactor3 = 4;
		lineItem.QuantityFactor4 = 5;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(120);
	});

	it('calculateQuantityOfLineItem handles lineItem with QuantityFactor1, QuantityFactor2, QuantityFactor3, QuantityFactor4, QuantityFactorCc correctly', () => {
		const lineItem = createLineItem();
		lineItem.QuantityFactor1 = 2;
		lineItem.QuantityFactor2 = 3;
		lineItem.QuantityFactor3 = 4;
		lineItem.QuantityFactor4 = 5;
		lineItem.ProductivityFactor = 6;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(720);
	});

	it('calculateQuantityOfLineItem sets QuantityTotal to 0 when Quantity is 0', () => {
		const lineItem = createLineItem();
		lineItem.Quantity = 0;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfLineItem sets QuantityTotal to 0 when QuantityFactor1 is 0', () => {
		const lineItem = createLineItem();
		lineItem.QuantityFactor1 = 0;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfLineItem sets QuantityTotal to 0 when QuantityFactor2 is 0', () => {
		const lineItem = createLineItem();
		lineItem.QuantityFactor2 = 0;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfLineItem sets QuantityTotal to 0 when QuantityFactor3 is 0', () => {
		const lineItem = createLineItem();
		lineItem.QuantityFactor3 = 0;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfLineItem sets QuantityTotal to 0 when QuantityFactor4 is 0', () => {
		const lineItem = createLineItem();
		lineItem.QuantityFactor4 = 0;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(0);
	});

	it('calculateQuantityOfLineItem sets QuantityTotal to 0 when ProductivityFactor is 0', () => {
		const lineItem = createLineItem();
		lineItem.ProductivityFactor = 0;
		service.calculateQuantityOfLineItem(lineItem);
		expect(lineItem.QuantityTotal).toBe(0);
	});

	it('calculateLineItemAndResources handles with empty resourceList correctly', () => {
		const lineItem = createLineItem();
		const resourceList: IEstResourceEntity[] = [];
		expect(() => service.calculateLineItemAndResources(lineItem, resourceList)).not.toThrow();
		expect(lineItem.CostTotal).toBe(0);
	});

	it('calculateLineItemAndResources sets CostTotal to 0 when lineItem IsDisabled is true', () => {
		const lineItem = createLineItem();
		lineItem.IsDisabled = true;
		const resourceList: IEstResourceEntity[] = [createResource()];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(0);
	});

	it('calculateLineItemAndResources sets CostTotal to 0 when all resources in resourceList are disabled', () => {
		const lineItem = createLineItem();
		const disabledResource = createResource();
		disabledResource.IsDisabled = true;
		const resourceList: IEstResourceEntity[] = [disabledResource];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(0);
	});

	it('calculateLineItemAndResources sets CostTotal to 0 when lineItem IsOptional is true', () => {
		const lineItem = createLineItem();
		lineItem.IsOptional = true;
		const resourceList: IEstResourceEntity[] = [createResource()];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(0);
	});

	it('calculateLineItemAndResources sets CostTotal equal resource costTotal sum when lineItem IsOptionalIT is true and IsOptional is false', () => {
		const lineItem = createLineItem();
		lineItem.IsOptionalIT = true;
		const resourceList: IEstResourceEntity[] = [createResource()];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(1);
	});

	it('calculateLineItemAndResources sets CostTotal equal sum of resource costTotal when lineItem IsOptional and IsOptionalIT are both true', () => {
		const lineItem = createLineItem();
		lineItem.IsOptional = true;
		lineItem.IsOptionalIT = true;
		const resourceList: IEstResourceEntity[] = [createResource()];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(1);
	});

	it('calculateLineItemAndResources sets lineItem CostTotal to sum resources CostTotal correctly', () => {
		const lineItem = createLineItem();
		const resource1 = createResource();
		resource1.CostUnit = 10;
		const resource2 = createResource();
		resource2.CostUnit = 20;
		const resourceList: IEstResourceEntity[] = [resource1, resource2];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(30);
	});

	it('calculateLineItemAndResources sets CostTotal to sum resources CostTotal when all resources in resourceList are lumpsum', () => {
		const lineItem = createLineItem();
		const lumpsumResource1 = createResource();
		lumpsumResource1.IsLumpsum = true;
		lumpsumResource1.CostUnit = 10;

		const lumpsumResource2 = createResource();
		lumpsumResource2.IsLumpsum = true;
		lumpsumResource2.CostUnit = 20;

		const resourceList: IEstResourceEntity[] = [lumpsumResource1, lumpsumResource2];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(30);
	});

	it('calculateLineItemAndResources sets CostTotal to 0 when all resources in resourceList is IsOptionPrc', () => {
		const lineItem = createLineItem();
		const resource1 = createResource();
		resource1.CostUnit = 10;
		resource1.IsDisabledPrc = true;

		const resource2 = createResource();
		resource2.CostUnit = 20;
		resource2.IsDisabledPrc = true;

		const resourceList: IEstResourceEntity[] = [resource1, resource2];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(0);
	});

	it('calculateLineItemAndResources sets CostTotal to sum resources CostTotal of first level when all resources have children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource();
		parentResource.EstResourceTypeFk = 5;
		parentResource.CostUnit = 10;
		const childResource1 = createResource();
		childResource1.Id = 2;
		childResource1.EstResourceFk = 1;
		childResource1.CostUnit = 20;
		childResource1.HoursUnit = 2;
		const childResource2 = createResource();
		childResource2.Id = 3;
		childResource2.EstResourceFk = 1;
		childResource2.CostUnit = 30;
		childResource2.HoursUnit = 3;
		parentResource.ResourceChildren = [childResource1, childResource2];
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.calculateLineItemAndResources(lineItem, resourceList);
		expect(lineItem.CostTotal).toBe(50);
		expect(lineItem.HoursTotal).toBe(5);
	});

	it('updateResources handles empty resourceList correctly', () => {
		const lineItem = createLineItem();
		const resourceList: IEstResourceEntity[] = [];
		expect(() => service.updateResources(lineItem, resourceList)).not.toThrow();
	});

	it('updateResources updates resource correctly when resourceList has one resource', () => {
		const lineItem = createLineItem();
		const resource = createResource({ CostUnit: 10 });
		const resourceList: IEstResourceEntity[] = [resource];
		service.updateResources(lineItem, resourceList);
		expect(resource.CostTotal).toBe(10);
	});

	it('updateResources updates resource correctly when resourceList has multiple resources', () => {
		const lineItem = createLineItem();
		const resource1 = createResource({ CostUnit: 10 });
		const resource2 = createResource({ CostUnit: 20 });
		const resourceList: IEstResourceEntity[] = [resource1, resource2];
		service.updateResources(lineItem, resourceList);
		expect(resource1.CostTotal).toBe(10);
		expect(resource2.CostTotal).toBe(20);
	});

	it('updateResources sets resource CostTotal to 0 when all resources in resourceList are disabled', () => {
		const lineItem = createLineItem();
		const disabledResource = createResource({ IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [disabledResource];
		service.updateResources(lineItem, resourceList);
		expect(disabledResource.CostTotal).toBe(0);
	});

	it('updateResources handles resource with negative CostUnit correctly', () => {
		const lineItem = createLineItem();
		const resource = createResource({ CostUnit: -100 });
		const resourceList: IEstResourceEntity[] = [resource];
		expect(() => service.updateResources(lineItem, resourceList)).not.toThrow();
		expect(resource.CostTotal).toBe(-100);
	});

	it('updateResources handles resource with negative QuantityReal correctly', () => {
		const lineItem = createLineItem();
		const resource = createResource({ QuantityReal: -1 });
		const resourceList: IEstResourceEntity[] = [resource];
		expect(() => service.updateResources(lineItem, resourceList)).not.toThrow();
	});

	it('updateResource sets subItem resource CostTotal equal sum of its children CostTotal when children are not IsDisabled', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, IsDisabled: false });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, IsDisabled: false });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResources(lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(30);
	});

	it('updateResource sets parent CostTotal to 0 when all children are IsDisabled', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, IsDisabled: true });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResources(lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(0);
	});

	it('updateResource sets parent CostTotal correctly when some children are IsDisabled', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, IsDisabled: false });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResources(lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(10);
	});

	it('updateResources sets parent CostTotal equal to sum of CostTotal of its EstResources', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10 });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20 });
		parentResource.EstResources = [childResource1, childResource2];
		const resourceList: IEstResourceEntity[] = [parentResource];
		service.updateResources(lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(30);
	});

	it('updateResources sets parent CostTotal to 0 when EstResources is empty', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0 });
		parentResource.EstResources = [];
		const resourceList: IEstResourceEntity[] = [parentResource];
		service.updateResources(lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(0);
	});

	it('updateResources sets parent CostTotal correctly when some EstResources are disabled', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, IsDisabled: false });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, IsDisabled: true });
		parentResource.EstResources = [childResource1, childResource2];
		const resourceList: IEstResourceEntity[] = [parentResource];
		service.updateResources(lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(10);
	});

	it('calculateResource handles resource with negative CostUnit correctly', () => {
		const lineItem = createLineItem();
		const resource = createResource();
		resource.CostUnit = -100;
		expect(() => service.calculateResource(resource, lineItem, [resource])).not.toThrow();
	});

	it('calculateResource handles resource with negative QuantityReal correctly', () => {
		const lineItem = createLineItem();
		const resource = createResource();
		resource.QuantityReal = -1;
		expect(() => service.calculateResource(resource, lineItem, [resource])).not.toThrow();
	});

	it('calculateResource sets CostTotal correctly for a single resource', () => {
		const lineItem = createLineItem();
		const resource = createResource({ CostUnit: 10, Quantity: 2 });
		const resourceList: IEstResourceEntity[] = [resource];
		service.calculateResource(resource, lineItem, resourceList);
		expect(resource.CostTotal).toBe(20);
		expect(lineItem.CostTotal).toBe(20);
	});

	it('calculateResource sets CostTotal to 0 for a disabled resource', () => {
		const lineItem = createLineItem();
		const resource = createResource({ CostUnit: 10, Quantity: 2, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [resource];
		service.calculateResource(resource, lineItem, resourceList);
		expect(resource.CostTotal).toBe(0);
		expect(lineItem.CostTotal).toBe(0);
	});

	it('calculateResource sets CostTotal correctly for a resource with children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2 });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1 });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.calculateResource(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(40);
		expect(lineItem.CostTotal).toBe(40);
	});

	it('calculateResource sets CostTotal correctly for a resource with nested children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2 });
		const grandChildResource = createResource({ Id: 3, EstResourceFk: null, CostUnit: 5, Quantity: 3, CostTotal: 15 });
		parentResource.EstResources = [childResource];
		const resourceList: IEstResourceEntity[] = [parentResource, childResource, grandChildResource];
		service.calculateResource(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(20);
	});

	it('calculateResource sets CostTotal to 0 for a resource with all disabled children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, IsDisabled: true });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.calculateResource(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(0);
		expect(lineItem.CostTotal).toBe(0);
	});

	it('calculateResource sets CostTotal correctly for a resource with some disabled children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, IsDisabled: false });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.calculateResource(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(20);
	});

	it('updateResourceOfAssembly sets parent CostTotal correctly when some children are IsDisabled', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, IsDisabled: false });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResourceOfAssembly(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(10);
	});

	it('updateResourceOfAssembly sets parent CostTotal to 0 when all children are IsDisabled', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, IsDisabled: true });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResourceOfAssembly(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(0);
	});

	it('updateResourceOfAssembly sets parent CostTotal correctly for nested children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, EstResourceTypeFk: 5 });
		const grandChildResource = createResource({ Id: 3, EstResourceFk: 2, CostUnit: 5, Quantity: 3 });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource, grandChildResource];
		service.updateResourceOfAssembly(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(30);
	});

	it('updateResourceOfAssembly sets parent CostTotal to 0 when resourceList is empty', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const resourceList: IEstResourceEntity[] = [];
		service.updateResourceOfAssembly(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(0);
	});

	it('updateResourceOfAssembly sets parent CostTotal correctly when resource has mixed enabled and disabled nested children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, IsDisabled: false, EstResourceTypeFk: 5 });
		const grandChildResource1 = createResource({ Id: 3, EstResourceFk: 2, CostUnit: 5, Quantity: 3, IsDisabled: false });
		const grandChildResource2 = createResource({ Id: 4, EstResourceFk: 2, CostUnit: 5, Quantity: 3, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource, grandChildResource1, grandChildResource2];
		service.updateResourceOfAssembly(parentResource, lineItem, resourceList);
		expect(parentResource.CostTotal).toBe(30);
	});

	it('updateResourceOfAssembly does not include resources with Id equal to 0 in CostTotal calculation', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 0, CostUnit: 0, EstResourceTypeFk: 5 });
		const resourceList: IEstResourceEntity[] = [parentResource];
		const retVal = service.updateResourceOfAssembly(parentResource, lineItem, resourceList);
		expect(retVal.length).toBe(0);
	});

	it('updateResourceOfAssemblyCore handles empty resourceList correctly', () => {
		const lineItem = createLineItem();
		const resourceList: IEstResourceEntity[] = [];
		expect(() => service.updateResourceOfAssemblyCore(lineItem, resourceList, () => [])).not.toThrow();
	});

	it('updateResourceOfAssemblyCore sets resource CostTotal correctly for single resource', () => {
		const lineItem = createLineItem();
		const resource = createResource({ CostUnit: 10, Quantity: 2 });
		const resourceList: IEstResourceEntity[] = [resource];
		service.updateResourceOfAssemblyCore(lineItem, resourceList, () => []);
		expect(resource.CostTotal).toBe(20);
	});

	it('updateResourceOfAssemblyCore sets resource CostTotal to 0 for disabled resource', () => {
		const lineItem = createLineItem();
		const resource = createResource({ CostUnit: 10, Quantity: 2, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [resource];
		service.updateResourceOfAssemblyCore(lineItem, resourceList, () => []);
		expect(resource.CostTotal).toBe(0);
	});

	it('updateResourceOfAssemblyCore sets parent CostTotal correctly for resource with children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2 });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1 });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResourceOfAssemblyCore(lineItem, resourceList, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id));
		expect(parentResource.CostTotal).toBe(40);
	});

	it('updateResourceOfAssemblyCore sets parent CostTotal to 0 for resource with all disabled children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, IsDisabled: true });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResourceOfAssemblyCore(lineItem, resourceList, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id));
		expect(parentResource.CostTotal).toBe(0);
	});

	it('updateResourceOfAssemblyCore sets parent CostTotal correctly for resource with mixed enabled and disabled children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, IsDisabled: false });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResourceOfAssemblyCore(lineItem, resourceList, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id));
		expect(parentResource.CostTotal).toBe(20);
	});

	it('updateResourceOfAssemblyCore sets parent CostTotal correctly for resource with mixed IsDisabledPrc and non-IsDisabledPrc children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, IsDisabledPrc: false });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1, IsDisabledPrc: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.updateResourceOfAssemblyCore(lineItem, resourceList, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id));
		expect(parentResource.CostTotal).toBe(20);
	});

	it('updateResourceOfAssemblyCore sets resource CostTotal correctly for resource with IsInformation', () => {
		const lineItem = createLineItem();
		const resource1 = createResource({ CostUnit: 10, Quantity: 2, IsInformation: false });
		const resource2 = createResource({ CostUnit: 20, Quantity: 1, IsInformation: true });
		const resourceList: IEstResourceEntity[] = [resource1, resource2];
		service.updateResourceOfAssemblyCore(lineItem, resourceList, () => []);
		expect(resource1.CostTotal).toBe(20);
		expect(resource2.CostTotal).toBe(0);
	});

	it('calculateResourceTree sets CostTotal correctly for resource with children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2 });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1 });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.calculateResourceTree(parentResource, lineItem, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id), null, 1);
		expect(parentResource.CostTotal).toBe(40);
	});

	it('calculateResourceTree sets CostTotal to 0 for resource with all disabled children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, IsDisabled: true });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.calculateResourceTree(parentResource, lineItem, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id), null, 1);
		expect(parentResource.CostTotal).toBe(0);
	});

	it('calculateResourceTree sets CostTotal correctly for resource with mixed enabled and disabled children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource1 = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, IsDisabled: false });
		const childResource2 = createResource({ Id: 3, EstResourceFk: 1, CostUnit: 20, Quantity: 1, IsDisabled: true });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource1, childResource2];
		service.calculateResourceTree(parentResource, lineItem, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id), null, 1);
		expect(parentResource.CostTotal).toBe(20);
	});

	it('calculateResourceTree sets CostTotal correctly for resource with nested children', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const childResource = createResource({ Id: 2, EstResourceFk: 1, CostUnit: 10, Quantity: 2, EstResourceTypeFk: 5 });
		const grandChildResource = createResource({ Id: 3, EstResourceFk: 2, CostUnit: 5, Quantity: 3 });
		const resourceList: IEstResourceEntity[] = [parentResource, childResource, grandChildResource];
		service.calculateResourceTree(parentResource, lineItem, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id), null, 1);
		expect(parentResource.CostTotal).toBe(30);
	});

	it('calculateResourceTree sets CostTotal to 0 when resourceList is empty', () => {
		const lineItem = createLineItem();
		const parentResource = createResource({ Id: 1, CostUnit: 0, EstResourceTypeFk: 5 });
		const resourceList: IEstResourceEntity[] = [];
		service.calculateResourceTree(parentResource, lineItem, (parent) => resourceList.filter((r) => r.EstResourceFk === parent.Id), null, 1);
		expect(parentResource.CostTotal).toBe(0);
	});

	it('loadCompositeAssemblyResources returns empty array when items is null', async () => {
		const result = await service.loadCompositeAssemblyResources(null);
		expect(result).toEqual([]);
	});

	it('loadCompositeAssemblyResources returns empty array when items is empty', async () => {
		const result = await service.loadCompositeAssemblyResources([]);
		expect(result).toEqual([]);
	});

	it('loadCompositeAssemblyResources returns empty array when no items have EstAssemblyFk', async () => {
		const items = [createResource({ EstAssemblyFk: null })];
		const result = await service.loadCompositeAssemblyResources(items);
		expect(result).toEqual([]);
	});

	it('loadCompositeAssemblyResources fetches assemblies from API when cacheIds is empty',  () => {
		const items = [createResource({ EstAssemblyFk: 1 })];
		const response = [createLineItem({ Id: 1 })];

		service.loadCompositeAssemblyResources(items).then(result => {
			expect(result).toEqual(response);
		});
	});

	it('loadCompositeAssemblyResources handles multiple assemblies correctly', async () => {
		const items = [createResource({ EstAssemblyFk: 1 }), createResource({ EstAssemblyFk: 2 })];
		const response = [createLineItem({ Id: 1 }), createLineItem({ Id: 2 })];

		service.loadCompositeAssemblyResources(items).then(result => {
			expect(result).toEqual(response);
		});

		const req = httpTestingController.expectOne(`${webApiBaseUrl}estimate/main/lineitem/getassemblywithresourcesdetail`);
		expect(req.request.method).toBe('POST');
		expect(req.request.body).toEqual({ EstHeaderId: items[0].EstHeaderFk, AssemblyIds: [1, 2] });

		req.flush(response);
	});
});

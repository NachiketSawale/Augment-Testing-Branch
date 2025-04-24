//TODO-BOQ: Added due to handle compile time error.
// In future below code will be no longer used.
describe('BoqItemCalculateLogic.Class', () => {
	it('should create an instance', () => {
	});
});


// //TODO-BOQ: There is dependency of the supported class 'BoqItemRoundingLogic' which is not ready yet .In future above test cases code will be modify.

// import { BoqItemCalculateLogic, IBoqItemCalculateOptions } from "../model/boq-main-boq-item-calculate-logic.class";
// import { BoqItemDataService } from "../services/boq-main-boq-item-data.service";
// import { IEntityBase, PlatformConfigurationService } from "@libs/platform/common";
// import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
// import { TestBed } from "@angular/core/testing";
// import { BoqItemRoundingLogic } from "../model/boq-main-boq-item-rounding.logic";
// import { HttpClient } from "@angular/common/http";
// import { delay, of } from "rxjs";
// import { IBoqItemEntity, IBoqRoundingConfigDetailEntity, IBoqRoundingConfigEntity, IBoqStructureEntity } from "@libs/boq/main";

// describe('BoqItemCalculateLogic.Class', () => {
// 	let boqItemCalculateLogic: BoqItemCalculateLogic;
// 	let boqItemDataService: BoqItemDataService;
// 	let platformConfigurationService : PlatformConfigurationService;
// 	let boqRoundingService : BoqItemRoundingLogic;
// 	let httpTestingController: HttpTestingController;
// 	let httpClient : HttpClient;

//Mock data for the ''roundingConfigDetails.
// 	let roundingConfigDetails : IBoqRoundingConfigDetailEntity[] | null = [
// 		{
// 			BasRoundToFk: 1,
// 			BasRoundingMethodFk:0,
// 			BoqRoundingConfigFk:0,
// 			BoqRoundingconfigEntity:null,
// 			ColumnId:1,
// 			Id:1,
// 			IsWithoutRounding:false,
// 			RoundTo:0,
// 			Sorting:0,
// 			UiDisplayTo:0
// 		}
// 	];

// 	let boqStructure : IBoqStructureEntity = {
// 		BoqCatAssignTypeId :1,
// 		EditBoqCatalogConfigType:true,
// 		AutoAtCopy: false,
// 		BoqRoundingConfigFk: 1,
// 		CalcFromUrb: false,
// 		CopyEstimateOrAssembly: false,
// 		DefaultSpecification: false,
// 		DiscountAllowed: false,
// 		EnforceStructure: false,
// 		Id: 0,
// 		Isdefault: false,
// 		KeepBudget: false,
// 		KeepQuantity: false,
// 		KeepRefNo: false,
// 		KeepUnitRate: false,
// 		LeadingZeros: false,
// 		SectionAllowed: false,
// 		SkippedHierarchiesAllowed: false,
// 		Sorting: 0,
// 		SpecificationLimit: 0,
// 		TotalHour: true,
// 		BoqCatalogAssignDesc:'',
// 		BoqRoundingConfig:null
// 	};

// 	let boqItem: IBoqItemEntity = require('../unit-test/mock-data/boqitem.json');
// 	let flatBoqItemList: IBoqItemEntity[];
// 	let boqItemCalculateOptions : IBoqItemCalculateOptions;
// 	let roundingConfig: string | number | Date | IEntityBase | Array<IEntityBase> | (() => boolean) | undefined | null | boolean | IBoqRoundingConfigEntity = {
// 		BoqRoundingconfigdetailEntities:[],
// 		BoqRoundingconfigtypeEntities:[],
// 		CloneThisEntity: false,
// 		DescriptionInfo:null ,
// 		Id:0,
// 		RoundedColumns2DetailTypes:{}
// 	};

// 	beforeEach(() => {
// 		TestBed.configureTestingModule({
// 			imports: [HttpClientTestingModule],
// 			providers: [
// 				BoqItemDataService,
// 				BoqItemRoundingLogic,
// 				PlatformConfigurationService,
// 				{
// 					provide: HttpClient ,
// 					useValue: { get: () => of([]).pipe(delay(0)) },
// 				},
//
// 			],
// 		});
// 		boqItemDataService = TestBed.get(BoqItemDataService);
// 		platformConfigurationService = TestBed.get(PlatformConfigurationService);
// 		boqRoundingService = TestBed.get(BoqItemRoundingLogic);
// 		httpTestingController = TestBed.get(HttpTestingController);
// 		roundingConfig = (typeof boqStructure?.BoqRoundingConfigFk==='number' && boqStructure?.BoqRoundingConfigFk!==0) ? boqStructure?.BoqRoundingConfig : null;
// 		//roundingConfigDetails = (Array.isArray(roundingConfig?.BoqRoundingconfigdetailEntities) ? roundingConfig?.BoqRoundingconfigdetailEntities : null) || null;
// 		boqItemCalculateLogic = new BoqItemCalculateLogic(boqStructure,flatBoqItemList,boqItemCalculateOptions);
// 		boqRoundingService = new BoqItemRoundingLogic(roundingConfig , roundingConfigDetails);
// 	});
//
// 	// it('should create an instance', () => {
// 	// 	//expect(boqItemCalculateLogic).toBeTruthy();
// 	// });
//
// 	// it('should call function "loadBoqRoundedColumns2DetailTypes"', () => {
// 	// 	expect(BoqItemCalculateLogic.loadBoqRoundedColumns2DetailTypes(httpClient,platformConfigurationService)).toBeCalled();
// 	// });
//
// 	// it('should call function "doCalculateOverGross"', () => {
		//Protected member is not accessible
// 	// 	boqItemCalculateLogic.doCalculateOverGross();
// 	// 	expect(boqItemCalculateLogic.doCalculateOverGross).toBeTruthy();
// 	// });
//
// 	// it('should call function "getSubdescriptionsTotal"', () => {
		//Protected member is not accessible
// 	// 	boqItemCalculateLogic.getSubdescriptionsTotal(boqItem, true);
// 	// 	expect(boqItemCalculateLogic.getSubdescriptionsTotal).toBeTruthy();
// 	// });
//
// 	// it('should call function "getCurrentlyRelevantQuantityForBudget"', () => {
		//Protected member is not accessible
// 	// 	boqItemCalculateLogic.getCurrentlyRelevantQuantityForBudget(boqItem);   //Protected member is not accessible
// 	// 	expect(boqItemCalculateLogic.getCurrentlyRelevantQuantityForBudget).toBeTruthy();
// 	// });
//
// 	// it('should call function "calcBoq"', () => {
// 	// 	//boqItemCalculateLogic.calcBoq(boqItem);
// 	// 	expect(boqItemCalculateLogic.calcBoq).toBeCalled();
// 	// 	///boqItemCalculateLogic.calcBoq(boqItem,0,[])
// 	// });
// });


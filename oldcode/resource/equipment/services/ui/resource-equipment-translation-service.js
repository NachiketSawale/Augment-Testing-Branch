(function (angular) {
	'use strict';

	const resourceEquipmentModule = 'resource.equipment';
	const resourceGroupModule = 'resource.equipmentgroup';
	const customizeModule = 'basics.customize';
	const cloudCommonModule = 'cloud.common';
	const projectCostCodesModule = 'project.costcodes';
	const logisticModule = 'logistic.job';
	const cardModule = 'logistic.card';
	const resReservationModule = 'resource.reservation';
	const resourceWotModule = 'resource.wot';
	const resCommonModule = 'resource.common';
	const basicsClerkModule = 'basics.clerk';
	const projectMainModule = 'project.main';

	/**
	 * @ngdoc service
	 * @name resourceEquipmentTranslationService
	 * @description provides translation for object Main module
	 */
	angular.module(resourceEquipmentModule).factory('resourceEquipmentTranslationService', [
		'_',
		'platformTranslationUtilitiesService',
		'resourceCommonTranslationService',

		function (_, platformTranslationUtilitiesService, resourceCommonTranslationService) {
			var service = {};

			var data = {
				toTranslate: {},
				translate: null,
				updateCallback: null,
				allUsedModules: [
					resourceEquipmentModule,
					customizeModule,
					cloudCommonModule,
					resourceGroupModule,
					'resource.catalog',
					projectCostCodesModule,
					logisticModule,
					resReservationModule,
					resourceWotModule,
					resCommonModule,
					'services.schedulerui',
					cardModule
				]
			};
			data.words = {
				dangerousGoods: { location: resourceEquipmentModule, identifier: 'entityDangerousGoods' },
				configuration: { location: resourceEquipmentModule, identifier: 'entityConfiguration' },
				vehicleManagement: { location: resourceEquipmentModule, identifier: 'vehicleManagement' },
				entityPlant: { location: resourceEquipmentModule, identifier: 'entityPlant' },
				plantListTitle: { location: resourceEquipmentModule, identifier: 'plantListTitle' },
				plantDetailTitle: { location: resourceEquipmentModule, identifier: 'plantDetailTitle' },
				plantPoolJobPlantLocationListTitle: { location: resourceEquipmentModule, identifier: 'plantPoolJobPlantLocationListTitle' },
				plantPoolJobPlantLocationDetailTitle: { location: resourceEquipmentModule, identifier: 'plantPoolJobPlantLocationDetailTitle' },
				ValidFrom: { location: cloudCommonModule, identifier: 'entityValidFrom' },
				Email: { location: cloudCommonModule, identifier: 'email', initial: 'Email' },
				TelephoneNumberFk: { location: cloudCommonModule, identifier: 'telephoneNumberFk', initial: 'Telephone Number' },
				FirstName: { location: cloudCommonModule, identifier: 'firstName', initial: 'First Name' },
				RoleFk: { location: resourceEquipmentModule, identifier: 'entityRole', initial: 'Role' },
				LastName: { location: cloudCommonModule, identifier: 'lastName', initial: 'Last Name' },
				TelephoneNumberMobileFk: { location: cloudCommonModule, identifier: 'telephoneNumberMobileFk', initial: 'Mobile Number' },

				ValidTo: { location: cloudCommonModule, identifier: 'entityValidTo' },
				EquipmentContextFk: { location: customizeModule, identifier: 'equipmentcontext' },
				EquipmentDivisionFk: { location: customizeModule, identifier: 'equipmentdivision' },
				AlternativeCode: { location: resourceEquipmentModule, identifier: 'entityAlternativeCode' },
				PlantStatusFk: { location: resourceEquipmentModule, identifier: 'plantStatus' },
				IsLive: { location: cloudCommonModule, identifier: 'entityIsLive' },
				PlantGroupFk: { location: resourceEquipmentModule, identifier: 'entityResourceEquipmentGroup' },
				Matchcode: { location: resourceEquipmentModule, identifier: 'entityMatchCode' },
				PlantTypeFk: { location: resourceEquipmentModule, identifier: 'planttype' },
				ProcurementStructureFk: { location: resourceEquipmentModule, identifier: 'entityProcurementStructure' },
				PlantKindFk: { location: resourceEquipmentModule, identifier: 'plantkind' },
				RegNumber: { location: resourceEquipmentModule, identifier: 'entityRegNumber' },
				CompanyFk: { location: cloudCommonModule, identifier: 'entityCompany' },
				CommentText: { location: cloudCommonModule, identifier: 'entityComment' },
				Specification: { location: resourceEquipmentModule, identifier: 'entitySpecification' },
				PartnerTypeFk: { location: resourceEquipmentModule, identifier: 'entityPartnerTypeFk' },
				Barcode: { location: resourceEquipmentModule, identifier: 'entityBarcode' },
				BusinessPartnerFk: { location: cloudCommonModule, identifier: 'entityBusinessPartner' },
				PlantDocumentTypeFk: { location: resourceEquipmentModule, identifier: 'entityPlantDocumentTypeFk' },
				Percentage: { location: resourceEquipmentModule, identifier: 'entityPercentage' },
				DocumentTypeFk: { location: resourceEquipmentModule, identifier: 'entityDocumentTypeFk' },
				FixedAssetFk: { location: resourceEquipmentModule, identifier: 'entityFixedAsset' },
				SubsidiaryFk: { location: cloudCommonModule, identifier: 'entitySubsidiary' },
				Date: { location: cloudCommonModule, identifier: 'entityDate' },
				WarrantyDate: { location: resourceEquipmentModule, identifier: 'entityWarrantyDate' },
				FileArchiveDocFk: { location: resourceEquipmentModule, identifier: 'entityFileArchiveDoc' },
				AccessoryTypeFk: { location: resourceEquipmentModule, identifier: 'plantAccessoryType' },
				Plant2Fk: { location: resourceEquipmentModule, identifier: 'plantPlant2Fk' },
				LongDescriptionInfo: { location: resourceEquipmentModule, identifier: 'entityLongDescription' },
				PictureDate: { location: resourceEquipmentModule, identifier: 'entityPictureData' },
				OriginFileName: { location: cloudCommonModule, identifier: 'documentOriginFileName' },
				PlantComponentTypeFk: { location: resourceEquipmentModule, identifier: 'entityPlantComponentTypeFk' },
				PlantCompMaintSchemaFk: { location: resourceEquipmentModule, identifier: 'entityPlantCompMaintSchemaFk' },
				MeterNo: { location: resourceEquipmentModule, identifier: 'entityMeterNo' },
				UomFk: { location: cloudCommonModule, identifier: 'entityUoM' },
				CatalogFk: { location: resourceEquipmentModule, identifier: 'entityCatalogFk' },
				LookupCode: { location: resourceEquipmentModule, identifier: 'entityLookupCode' },
				Reinstallment: { location: resourceEquipmentModule, identifier: 'entityReInstatmentCost' },
				ReinstallmentYear: { location: resourceEquipmentModule, identifier: 'entityReInstatmentYear' },
				DeviceParameter1: { location: resourceEquipmentModule, identifier: 'entityDeviceParameter1' },
				DeviceParameter2: { location: resourceEquipmentModule, identifier: 'entityDeviceParameter2' },
				CatalogRecordFk: { location: resourceEquipmentModule, identifier: 'entityCatalogRecordFk' },
				IsTire: { location: resourceEquipmentModule, identifier: 'entityIsTire' },
				IsInterpolated: { location: resourceEquipmentModule, identifier: 'entityIsInterpolated' },
				IsManual: { location: resourceEquipmentModule, identifier: 'entityIsManual' },
				PlantComponentFk: { location: resourceEquipmentModule, identifier: 'entityPlantComponent' },
				StartDate: { location: cloudCommonModule, identifier: 'entityStartDate' },
				EndDate: { location: cloudCommonModule, identifier: 'entityEndDate' },
				IsFixedDays: { location: customizeModule, identifier: 'isfixeddays' },
				DaysAfter: { location: customizeModule, identifier: 'daysafter' },
				IsPerformanceBased: { location: customizeModule, identifier: 'isperformancebased' },
				Duration: { location: resourceEquipmentModule, identifier: 'entityDuration' },
				MaintenanceStatusFk: { location: cloudCommonModule, identifier: 'entityStatus' },
				PricePortion1: { location: resourceEquipmentModule, identifier: 'entityPricePortion1' },
				PricePortion2: { location: resourceEquipmentModule, identifier: 'entityPricePortion2' },
				PricePortion3: { location: resourceEquipmentModule, identifier: 'entityPricePortion3' },
				PricePortion4: { location: resourceEquipmentModule, identifier: 'entityPricePortion4' },
				PricePortion5: { location: resourceEquipmentModule, identifier: 'entityPricePortion5' },
				PricePortion6: { location: resourceEquipmentModule, identifier: 'entityPricePortion6' },
				PricePortionSum: { location: resourceEquipmentModule, identifier: 'entityPricePortionSum' },
				QualityFactor: { location: resourceEquipmentModule, identifier: 'entityQualityFactor' },
				PricelistFk: { location: resourceEquipmentModule, identifier: 'entityPricelist' },
				WorkOperationTypeFk: { location: resourceEquipmentModule, identifier: 'entityWorkOperationTypeFk' },
				MaintenanceSchemaFk: { location: resourceEquipmentModule, identifier: 'maintenanceSchema' },
				EndWarranty: { location: resourceEquipmentModule, identifier: 'entityEndWarranty' },
				JobCode: { location: resourceEquipmentModule, identifier: 'entityJobCode' },
				ProjectName: { location: resourceEquipmentModule, identifier: 'entityProjectName' },
				ProjectNo: { location: resourceEquipmentModule, identifier: 'entityProjectNo' },
				JobFk: { location: projectCostCodesModule, identifier: 'lgmJobFk' },
				ProjectFk: { location: cloudCommonModule, identifier: 'entityProject' },
				HomeProjectFk: { location: resourceEquipmentModule, identifier: 'homeProject' },
				ProjectLocationFk: { location: resourceEquipmentModule, identifier: 'homeLocation' },
				CompanyInCode: { location: resourceEquipmentModule, identifier: 'entityCompanyInCode' },
				CompanyInName: { location: resourceEquipmentModule, identifier: 'entityCompanyInName' },
				CompanyOutCode: { location: resourceEquipmentModule, identifier: 'entityCompanyOutCode' },
				CompanyOutName: { location: resourceEquipmentModule, identifier: 'entityCompanyOutName' },
				AllocatedFrom: { location: logisticModule, identifier: 'allocatedFrom' },
				AllocatedTo: { location: logisticModule, identifier: 'allocatedTo' },
				Quantity: { location: cloudCommonModule, identifier: 'entityQuantity' },
				ControllingUnitFk: { location: cloudCommonModule, identifier: 'entityControllingUnit' },
				ReservationFk: { location: resReservationModule, identifier: 'entityReservation' },
				DispatchHeaderInFk: { location: resourceEquipmentModule, identifier: 'entityDispatchHeaderInFk' },
				DispatchHeaderOutFk: { location: resourceEquipmentModule, identifier: 'entityDispatchHeaderOutFk' },
				ProjectContextFk: { location: customizeModule, identifier: 'projectcontext' },
				Recorded: { location: resourceEquipmentModule, identifier: 'recorded' },
				IsBulk: { location: resCommonModule, identifier: 'isBulk' },
				PlantFk: { location: resourceEquipmentModule, identifier: 'entityPlant' },
				RubricCategoryFk: { location: resourceEquipmentModule, identifier: 'RubricCategoryFk' },
				CertificateFk: { location: resourceEquipmentModule, identifier: 'entityPlantCertificate' },
				CertificateTypeFk: { location: resourceEquipmentModule, identifier: 'entityCertificateType' },
				ClerkFk: { location: basicsClerkModule, identifier: 'entityClerk' },
				ContactFk: { location: resourceEquipmentModule, identifier: 'entityContactFk'},
				SupplierFk: { location: cloudCommonModule, identifier: 'entitySupplier'},
				SerialNumber: { location: resourceEquipmentModule, identifier: 'entitySerialNumber' },
				JobCardFk: { location: customizeModule, identifier: 'jobcardfk' },
				ItemKind: { location: resourceEquipmentModule, identifier: 'entityItemKind' },
				DisplayInPlant: { location: resourceEquipmentModule, identifier: 'entityDisplayInPlant' },
				JobDescription: { location: resourceEquipmentModule, identifier: 'entityJobDescription' },
				JobUserdefined1: { location: resourceEquipmentModule, identifier: 'entityJobUserdefined1' },
				JobValidfrom: { location: resourceEquipmentModule, identifier: 'entityJobValidfrom' },
				JobValidto: { location: resourceEquipmentModule, identifier: 'entityJobValidto' },
				JobTypeDescription: { location: resourceEquipmentModule, identifier: 'entityJobTypeDescription' },
				Projectno: { location: resourceEquipmentModule, identifier: 'entityProjectno' },
				ItemheaderDate: { location: resourceEquipmentModule, identifier: 'entityItemheaderDate' },
				ItemheaderCode: { location: resourceEquipmentModule, identifier: 'entityItemheaderCode' },
				ItemheaderDescription: { location: resourceEquipmentModule, identifier: 'entityItemheaderDescription' },
				ItemheaderFrom: { location: resourceEquipmentModule, identifier: 'entityItemheaderFrom' },
				ItemheaderTo: { location: resourceEquipmentModule, identifier: 'entityItemheaderTo' },
				Currency: { location: resourceEquipmentModule, identifier: 'entityCurrency' },
				ItemPrcStructureCode: { location: resourceEquipmentModule, identifier: 'entityItemPrcStructureCode' },
				ItemPrcStructureDescription: { location: resourceEquipmentModule, identifier: 'entityItemPrcStructureDescription' },
				ItemDescription1: { location: resourceEquipmentModule, identifier: 'entityItemDescription1' },
				ItemDescription2: { location: resourceEquipmentModule, identifier: 'entityItemDescription2' },
				ItemQuantity: { location: resourceEquipmentModule, identifier: 'entityItemQuantity' },
				ItemQuantityMultiplier: { location: resourceEquipmentModule, identifier: 'entityItemQuantityMultiplier' },
				ItemPriceportion1: { location: resourceEquipmentModule, identifier: 'entityItemPriceportion1' },
				ItemPriceportion2: { location: resourceEquipmentModule, identifier: 'entityItemPriceportion2' },
				ItemPriceportion3: { location: resourceEquipmentModule, identifier: 'entityItemPriceportion3' },
				ItemPriceportion4: { location: resourceEquipmentModule, identifier: 'entityItemPriceportion4' },
				ItemPriceportion5: { location: resourceEquipmentModule, identifier: 'entityItemPriceportion5' },
				ItemPriceportion6: { location: resourceEquipmentModule, identifier: 'entityItemPriceportion6' },
				ItemPriceTotal: { location: resourceEquipmentModule, identifier: 'entityItemPriceTotal' },
				ItemTotalCost: { location: resourceEquipmentModule, identifier: 'entityItemTotalCost' },
				ItemUnitInfo: { location: resourceEquipmentModule, identifier: 'entityItemUnitInfo' },
				SettlementstatusIsStorno: { location: resourceEquipmentModule, identifier: 'entitySettlementstatusIsStorno' },
				ContractStatusIsRejected: { location: resourceEquipmentModule, identifier: 'entityContractStatusIsRejected' },
				InvoiceHeaderStatusIsCanceled: { location: resourceEquipmentModule, identifier: 'entityInvoiceHeaderStatusIsCanceled' },
				jobGroup: { location: resourceEquipmentModule, identifier: 'detailJobGroupTitel' },
				jobTypeGroup: { location: resourceEquipmentModule, identifier: 'detailJobTypeGroupTitel' },
				itemGroup: { location: resourceEquipmentModule, identifier: 'detailItemGroupTitel' },
				itemHeaderGroup: { location: resourceEquipmentModule, identifier: 'detailItemHeaderGroupTitel' },
				MaintSchemaFk: { location: resourceEquipmentModule, identifier: 'entityMaintschemaFk' },
				Validfrom: { location: resourceEquipmentModule, identifier: 'entityValidfrom' },
				Validto: { location: resourceEquipmentModule, identifier: 'entityValidto' },
				NextMaintPerf: { location: resourceEquipmentModule, identifier: 'entityNextMaintPerf' },
				HasAllMaintenanceGenerated: { location: resourceEquipmentModule, identifier: 'entityHasAllMaintenanceGenerated' },
				NextMaintDate: { location: resourceEquipmentModule, identifier: 'entityNextMaintDate' },
				NextMaintDays: { location: resourceEquipmentModule, identifier: 'entityNextMaintDays' },
				NfcId: { location: resourceEquipmentModule, identifier: 'nfcId' },
				JobGroupFk: { location: customizeModule, identifier: 'jobgroup' },
				PlantIsBulk: { location: logisticModule, identifier: 'plantIsBulkEntity' },
				CompanyCode: { location: logisticModule, identifier: 'plantLocation2CompanyCodeEntity' },
				CompanyName: { location: logisticModule, identifier: 'plantLocation2CompanyNameEntity' },
				ClerkOwnerFk: { location: resourceEquipmentModule, identifier: 'entityClerkOwner' },
				ClerkResponsibleFk: { location: resourceEquipmentModule, identifier: 'entityClerkResponsible' },
				DangerClassFk: { location: resourceEquipmentModule, identifier: 'entityDangerClass' },
				PackageTypeFk: { location: resourceEquipmentModule, identifier: 'entityPackageTypeFk' },
				UomDcFk: { location: resourceEquipmentModule, identifier: 'entityUomDcFk' },
				DangerCapacity: { location: resourceEquipmentModule, identifier: 'entityDangerCapacity' },
				JobCardTemplateFk: { location: resourceEquipmentModule, identifier: 'cardTemplateEntity' },
				Longitude: { location: resourceEquipmentModule, identifier: 'longitude' },
				Latitude: { location: resourceEquipmentModule, identifier: 'latitude' },
				Url: { location: resourceEquipmentModule, identifier: 'url', initial: 'Url' },
				PlantCode: { location: resourceEquipmentModule, identifier: 'entityPlantCode', initial: 'Plant Code' },
				MaintenanceCode: { location: resourceEquipmentModule, identifier: 'entityMaintenanceCode', initial: 'Maintenance Code' },
				MaintenanceDescription: { location: resourceEquipmentModule, identifier: 'entityMaintenanceDescription', initial: 'Maintenance Description' },
				BasUomTranspsizeFk: { location: resourceEquipmentModule, identifier: 'basUomTranspsizeFk' },
				BasUomTranspweightFk: { location: resourceEquipmentModule, identifier: 'basUomTranspweightFk' },
				Transportlength: { location: resourceEquipmentModule, identifier: 'transportlength' },
				Transportwidth: { location: resourceEquipmentModule, identifier: 'transportwidth' },
				Transportheight: { location: resourceEquipmentModule, identifier: 'transportheight' },
				Transportweight: { location: resourceEquipmentModule, identifier: 'transportweight' },
				MaintSchemaRecFk: { location: resourceEquipmentModule, identifier: 'maintenanceSchemaRecord' },
				TrafficLightFk: { location: resourceEquipmentModule, identifier: 'trafficlight' },
				PlantDescription: { location: resCommonModule, identifier: 'plantDescription' },
				HasPoolJob: { location: resourceEquipmentModule, identifier: 'hasPoolJob' },
				PlantEstimatePriceListFk: { location: resourceEquipmentModule, identifier: 'entityPlantEstimatePriceList' },
				FixedAssetUrl: { location: resourceEquipmentModule, identifier: 'entityFixedAssetUrl' },
				LoadingCostFk: { location: resourceEquipmentModule, identifier: 'entityLoadingCostFk' },
				WarrantyTypeFk: { location: customizeModule, identifier: 'plantwarrantytype' },
				WarrantyStatusFk: { location: customizeModule, identifier: 'plantwarrantystatus' },
				Hours: { location: resourceEquipmentModule, identifier: 'entityHours'},
				WarrantyStart: { location: resourceEquipmentModule, identifier: 'entityWarrantyStart'},
				WarrantyEnd: { location: resourceEquipmentModule, identifier: 'entityWarrantyEnd'},
				IsExtrapolated: { location: resourceEquipmentModule, identifier: 'entityIsExtrapolated' },
				CardNumber: { location: resourceEquipmentModule, identifier: 'cardNumber' },
				IsHiddenInPublicApi: { location: resourceEquipmentModule, identifier: 'isHiddenInPublicApi' },
				IsRecalcDates: { location: resourceEquipmentModule, identifier: 'entityIsRecalcDates' },
				ProjectChangeFk: {location: cloudCommonModule, identifier: 'entityProjectChange'},
				ProjectChangeStatusFk: {location: customizeModule, identifier: 'projectchangestatus', initial: 'Project Change Status'},
				PlantEurolistFk: { location: resourceEquipmentModule, identifier: 'entityPlantEurolistFk' },
				Total: { location: resourceEquipmentModule, identifier: 'entityTotal' },
				Pricetotal: { location: resourceEquipmentModule, identifier: 'entityPricetotal' },
				ItemFk: { location: resourceEquipmentModule, identifier: 'entityItemFk' },
				ItemProcurementStructureCode: { location: resourceEquipmentModule, identifier: 'entityItemPrcStructureCode' },
				ItemProcurementStructureDescription: { location: resourceEquipmentModule, identifier: 'entityItemPrcStructureDescription' },
				ItemControllingUnitCode: { location: resourceEquipmentModule, identifier: 'entityItemControllingUnitCode' },
				ItemControllingUnitDescription: { location: resourceEquipmentModule, identifier: 'entityItemControllingUnitDescription' },
				DateOrdered: { location: resourceEquipmentModule, identifier: 'entityDateOrdered' },
				ContractDescription: { location: resourceEquipmentModule, identifier: 'entityContractDescription' },
				ContractControllingUnitCode: { location: resourceEquipmentModule, identifier: 'entityContractControllingUnitCode' },
				ContractControllingUnitDescription: { location: resourceEquipmentModule, identifier: 'entityContractControllingUnitDescription' },
				ContractStatusFk: { location: resourceEquipmentModule, identifier: 'entityContractStatusFk' },
				ContractHeaderFk: { location: resourceEquipmentModule, identifier: 'entityContractHeaderFk' },
				ContractControllingUnitFk: { location: resourceEquipmentModule, identifier: 'entityContractControllingUnitFk' },
				ProcurementHeaderFk: { location: resourceEquipmentModule, identifier: 'entityProcurementHeaderFk' },
				ItemControllingUnitFk: { location: resourceEquipmentModule, identifier: 'entityItemControllingUnitFk' },
				itemData: { location: resourceEquipmentModule, identifier: 'entityItemData' },
				Assignment01:{location: resourceEquipmentModule, identifier:'entityAssignment01'},
				Assignment02:{location: resourceEquipmentModule, identifier:'entityAssignment02'},
				Assignment03:{location: resourceEquipmentModule, identifier:'entityAssignment03'},
				Assignment04:{location: resourceEquipmentModule, identifier:'entityAssignment04'},
				Assignment05:{location: resourceEquipmentModule, identifier:'entityAssignment05'},
				Assignment06:{location: resourceEquipmentModule, identifier:'entityAssignment06'},
				Assignment07:{location: resourceEquipmentModule, identifier:'entityAssignment07'},
				Assignment08:{location: resourceEquipmentModule, identifier:'entityAssignment08'},
				Assignment09:{location: resourceEquipmentModule, identifier:'entityAssignment09'},
				Assignment10:{location: resourceEquipmentModule, identifier:'entityAssignment10'},
				ControllingUnitStatusFk:{location:resourceEquipmentModule,identifier:'entityControllingUnitStatus'},
				IsBillingElement:{location:resourceEquipmentModule,identifier:'entityIsBillingElement'},
				IsPlanningElement:{location:resourceEquipmentModule,identifier:'entityIsPlanningElement'},
				IsPlantManagement:{location:resourceEquipmentModule,identifier:'entityIsPlantManagement'},
				IsAssetManagement:{location:resourceEquipmentModule,identifier:'entityIsAssetManagement'},
				EstimateCost: { location: resourceEquipmentModule, identifier: 'entityEstimateCost' },
				IsRecalcPerformance: { location: resourceEquipmentModule, identifier: 'entityIsRecalcPerformance' },
				SpecificValueTypeFk: {location: customizeModule, identifier: 'specificvaluetype'},
				UomFromTypeFk: {location: resourceEquipmentModule, identifier: 'uomFromTypeFk'},
				Factor:{location:resourceEquipmentModule, identifier:'factor'},
				Value:{location:resourceEquipmentModule, identifier:'value'},
				CostCodeFk: {location: customizeModule, identifier: 'costCode'},
				ControllingUnitDescription: { location: resourceEquipmentModule, identifier: 'controllingUnitDescription' },
				PlantAssemblyTypeFk:{location: customizeModule, identifier: 'plantassemblytype'},
				PurchaseDate:{location: resourceEquipmentModule, identifier: 'purchaseDate'},
				PurchasePrice:{location: resourceEquipmentModule, identifier: 'purchasePrice'},
				ReplacementDate:{location: resourceEquipmentModule, identifier: 'replacementDate'},
				ReplacementPrice:{location: resourceEquipmentModule, identifier: 'replacementPrice'},
				CommissioningDate:{location: resourceEquipmentModule, identifier: 'commissioningDate'},
				PlannedDecommissioningDate:{location: resourceEquipmentModule, identifier: 'plannedDecommissioningDate'},
				DecommissioningDate:{location: resourceEquipmentModule, identifier: 'decommissioningDate'},
				LicensePlate:{location: resourceEquipmentModule, identifier: 'licensePlate'},

				ExternalCode:{location: resourceEquipmentModule, identifier: 'externalCode'},
				ClerkTechnicalFk:{location: resourceEquipmentModule, identifier: 'clerkTechnicalFk'},
				CompanyResponsibleFk: {
					location: projectMainModule,
					identifier: 'entityProfitCenter',
					initial: 'Profit Center'
				},
				IsResource:{location: resourceEquipmentModule, identifier: 'isResource'},
				FactorDetail: {location: resourceGroupModule, identifier: 'factorDetail'},
				QuantityDetail: {location: resourceGroupModule, identifier: 'quantityDetail'},
				DropPointFk:{location: resourceEquipmentModule, identifier: 'entityDroppoint'},
				TotalQuantity:{location: resourceEquipmentModule, identifier: 'entityTotalquantity'},
				YardQuantity:{location: resourceEquipmentModule, identifier: 'entityYardquantity'},
				ConstructionProjectFk:{location: resourceEquipmentModule, identifier: 'entityConstructionproject'},
				ConstructionDropPointFk:{location: resourceEquipmentModule, identifier: 'entityConstructiondroppoint'},
				ProjectQuantity:{location: resourceEquipmentModule, identifier: 'entityProjectquantity'}
			};

			service.addCompatibleMaterialWords = function addCompatibleMaterialWords(words) {
				words.MaterialCatalog = { location: cloudCommonModule, identifier: 'entityMaterialCatalog' };
				words.MaterialFk = { location: resourceEquipmentModule, identifier: 'entityMaterial' };
				words.MaterialCatalogDesc = { location: cloudCommonModule, identifier: 'entityMaterialCatalogDescription' };
				words.MaterialCatalogType = { location: customizeModule, identifier: 'materialcatalogtype' };
				words.MaterialCatalogCategoryShortDesc = { location: resourceEquipmentModule, identifier: 'catCategoryShort' };
				words.MaterialCatalogCategoryDesc = { location: resourceEquipmentModule, identifier: 'catCategory' };
				words.BizPartner = { location: cloudCommonModule, identifier: 'businessPartner' };
				words.BizPartnerName1 = { location: cloudCommonModule, identifier: 'entityBusinessPartnerName1' };
				words.BizPartnerName2 = { location: cloudCommonModule, identifier: 'entityBusinessPartnerName2' };
				words.BizPartnerInternet = { location: cloudCommonModule, identifier: 'internet' };
				words.BizPartnerEMail = { location: cloudCommonModule, identifier: 'email' };
				words.BizPartnerState = { location: resourceEquipmentModule, identifier: 'bizPartnerState' };
				words.BizPartnerStateDesc = { location: resourceEquipmentModule, identifier: 'bizPartnerStateDesc' };
				words.BizPartnerIsApproved = { location: customizeModule, identifier: 'isapproved' };
				words.BizPartnerCommunicationChannel = { location: customizeModule, identifier: 'communiationchannel' };
				words.Contracted = { location: cloudCommonModule, identifier: 'entityContract' };
				words.ContractedDesc = { location: cloudCommonModule, identifier: 'entityContractDescription' };
				words.ContractedState = { location: resourceEquipmentModule, identifier: 'contractedState' };
				words.ContractedStateDesc = { location: resourceEquipmentModule, identifier: 'contractedStateDesc' };
				words.ContractedIsAccepted = { location: customizeModule, identifier: 'isaccepted' };
				words.materialInfo = { location: resourceEquipmentModule, identifier: 'materialInfo' };
				words.businessPartnerInfo = { location: resourceEquipmentModule, identifier: 'businessPartnerInfo' };
				words.contractInfo = { location: resourceEquipmentModule, identifier: 'contractInfo' };
			};

			service.addControllingGroupDetailsWords = function addControllingGroupDetailsWords(words) {
				let preFix = 'Detail0';
				/* jshint -W106 */ // For me there is no cyclomatic complexity
				for (let j = 1; j <= 10; ++j) {
					let codeName = preFix + j + 'Code';
					let descName = preFix + j + 'Desc';
					let commentName = preFix + j + 'Comment';
					words[codeName] = {location: resourceEquipmentModule, identifier: 'entityGroupDetailByNumber', param: {number: '' + j}};
					words[descName] = {location: resourceEquipmentModule, identifier: 'entityGroupDetailDescByNumber', param: {number: '' + j}};
					words[commentName] = {location: resourceEquipmentModule, identifier: 'entityGroupDetailCommentByNumber', param: {number: '' + j}};

					if (j === 9) {
						preFix = 'Detail';
					}
				}
			};

			// Get some predefined packages of words used in project
			service.addCompatibleMaterialWords(data.words);
			service.addControllingGroupDetailsWords(data.words);
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words, 'basicData');
			platformTranslationUtilitiesService.addHistoryTranslation(data.words);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefined', '0');
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addUserDefinedIntegerTranslation(data.words, 5, 'UserDefinedInt', '0', 'userDefIntegerGroup');
			platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0', 'userDefDateGroup');
			platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0', 'userDefNumberGroup');

			// Get some predefined packages of words used in project
			resourceCommonTranslationService.provideEquipmentWords(data.words);

			// Convert word list into a format used by platform translation service
			let modules = ['logistic', 'resource', 'basics', 'project', 'documents'];
			data.allUsedModules = _.concat(data.allUsedModules, platformTranslationUtilitiesService.getAllSubmodules(modules));

			data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

			// Prepare interface of service and load translations
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
			platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
			platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 6, 'UserDefinedText', '0');
			platformTranslationUtilitiesService.addUserDefinedDateTranslation(data.words, 5, 'UserDefinedDate', '0');
			platformTranslationUtilitiesService.addUserDefinedNumberTranslation(data.words, 5, 'UserDefinedNumber', '0');
			platformTranslationUtilitiesService.loadModuleTranslation(data);
			platformTranslationUtilitiesService.registerModules(data);

			return service;
		},
	]);
})(angular);

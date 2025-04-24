(function (angular) {
	'use strict';

	var productionplanningCommonModule = 'productionplanning.common';
	var cloudCommonModule = 'cloud.common';
	var transportplanningPackageModule = 'transportplanning.package';
	var ppsItemModule = 'productionplanning.item';
	var ppsMountingModule = 'productionplanning.mounting';
	var basCustomizeModule = 'basics.customize';
	var projectCostCodesModule = 'project.costcodes';
	var basicsCommonModule = 'basics.common';
	var ppsEngModule = 'productionplanning.engineering';
	var procurementCommonModule = 'procurement.common';
	var trsRequisitionModule = 'transportplanning.requisition';
	var ppsMaterialModule = 'productionplanning.ppsmaterial';
	var projectMainModule = 'project.main';
	var bizPartnerModule = 'businesspartner.main';
	var basicsClerkModule = 'basics.clerk';
	var ppsStrandpatternModule = 'productionplanning.strandpattern';
	var ppsProductTemplateModule = 'productionplanning.producttemplate';
	const productionplanningProductModule = 'productionplanning.product';

	/**
	 * @ngdoc service
	 * @name resourceMasterTranslationService
	 * @description provides translation for resource Master module
	 */
	angular.module(productionplanningCommonModule).factory('productionplanningCommonTranslationService', ProductionplanningCommonTranslationService);

	ProductionplanningCommonTranslationService.$inject = ['platformTranslationUtilitiesService', 'ppsCommonCustomColumnsServiceTranslationExtension'];

	function ProductionplanningCommonTranslationService(platformTranslationUtilitiesService, customColumnsServiceTranslationExtension) {
		var service = {};

		var data = {
			toTranslate: {},
			translate: null,
			updateCallback: null,
			allUsedModules: [productionplanningCommonModule, cloudCommonModule, transportplanningPackageModule,
				ppsItemModule, ppsMountingModule, basCustomizeModule, projectCostCodesModule, basicsCommonModule, basicsClerkModule,
				ppsEngModule, procurementCommonModule, trsRequisitionModule, ppsMaterialModule, projectMainModule,bizPartnerModule, ppsStrandpatternModule,
				ppsProductTemplateModule, productionplanningProductModule]
		};

		data.words = {
			header: { location: productionplanningCommonModule, identifier: 'header.headerTitle', initial: 'Header' },
			production: { location: productionplanningCommonModule, identifier: 'header.production', initial: 'Production' },
			BasFilearchivedocFk: { location: productionplanningCommonModule, identifier: 'header.basFilearchivedocFk', initial: 'File archive doc' },
			BasClerkPrpFk: { location: productionplanningCommonModule, identifier: 'header.basClerkPrpFk', initial: 'Preparation Clerk' },
			EstHeaderFk: { location: productionplanningCommonModule, identifier: 'estHeaderFk', initial: 'Estimate Header' },
			OrdHeaderFk: { location: productionplanningCommonModule, identifier: 'ordHeaderFk', initial: 'Order Header' },
			MdlModelFk: { location: productionplanningCommonModule, identifier: 'header.mdlModelFk', initial: 'Model' },
			HeaderGroupFk: { location: productionplanningCommonModule, identifier: 'header.headerGroupFk', initial: 'PPS Group' },
			BasSiteFk: { location: productionplanningCommonModule, identifier: 'header.basSiteFk', initial: 'Site' },
			HeaderStatusFk: { location: productionplanningCommonModule, identifier: 'header.headerStatusFk', initial: 'Status' },
			PrjLocationFk: { location: productionplanningCommonModule, identifier: 'prjLocationFk', initial: 'Location' },
			PuPrjLocationFk: { location: productionplanningCommonModule, identifier: 'puPrjLocationFk', initial: '*Location PU' },
			TrsRequisitionFk: {location: trsRequisitionModule, identifier: 'entityRequisition', initial: '*Transport Requisition'},
			TrsRequisitionDate: {location: trsRequisitionModule, identifier: 'entityRequisitionDate', initial: '*TrsRequisition Date'},
			PrjProjectFk: { location: productionplanningCommonModule, identifier: 'prjProjectFk', initial: 'Project No' },
			ProjectId: { location: productionplanningCommonModule, identifier: 'prjProjectFk', initial: 'Project No' },
			EngDrawingFk: { location: productionplanningCommonModule, identifier: 'product.drawing', initial: '*Drawing' },
			MaterialFk: { location: productionplanningCommonModule, identifier: 'product.material', initial: '*Material'},
			IsActive: { location: productionplanningCommonModule, identifier: 'header.isActive', initial: 'Is Active' },
			IsLive: { location: productionplanningCommonModule, identifier: 'header.isLive', initial: 'Is Live' },

			product: { location: productionplanningCommonModule, identifier: 'product.productTitle', initial: 'Product' },
			dimensions: { location: productionplanningCommonModule, identifier: 'product.dimensions', initial: 'Dimensions' },
			ProductDescriptionFk: { location: productionplanningCommonModule, identifier: 'product.productDescriptionFk', initial: '*Product Template' },
			ProductionSetFk: { location: productionplanningCommonModule, identifier: 'product.productionSetFk', initial: 'Production Set' },
			ProductStatusFk: { location: productionplanningCommonModule, identifier: 'product.productStatusFk', initial: 'Product Status' },
			TrsProductBundleFk: { location: productionplanningCommonModule, identifier: 'product.trsProductBundleFk', initial: 'Bundle' },
			Length: { location: productionplanningCommonModule, identifier: 'product.length', initial: 'Length' },
			Width: { location: productionplanningCommonModule, identifier: 'product.width', initial: 'Width' },
			Height: { location: productionplanningCommonModule, identifier: 'product.height', initial: 'Height' },
			Weight: { location: productionplanningCommonModule, identifier: 'product.weight', initial: 'Weight' },
			Weight2: { location: productionplanningCommonModule, identifier: 'product.weight2', initial: 'Weight2' },
			Weight3: { location: productionplanningCommonModule, identifier: 'product.weight3', initial: 'Weight3' },
			ActualWeight: { location: productionplanningCommonModule, identifier: 'product.actualWeight', initial: 'Actual Weight' },
			Area: { location: productionplanningCommonModule, identifier: 'product.area', initial: 'Area' },
			Area2: { location: productionplanningCommonModule, identifier: 'product.area2', initial: 'Area2' },
			Area3: { location: productionplanningCommonModule, identifier: 'product.area3', initial: 'Area3' },
			Volume: { location: productionplanningCommonModule, identifier: 'product.volume', initial: '*Volume' },
			Volume2: { location: productionplanningCommonModule, identifier: 'product.volume2', initial: '*Volume2' },
			Volume3: { location: productionplanningCommonModule, identifier: 'product.volume3', initial: '*Volume3' },
			productparam: {location: productionplanningCommonModule, identifier: 'product.paramTitle', initial: 'Product Parameters'},
			BasUomFk: {location: productionplanningCommonModule, identifier: 'product.uomFk', initial: 'UOM'},
			BasUomLengthFk: { location: productionplanningCommonModule, identifier: 'product.lengthUoM', initial: 'Length UoM' },
			BasUomWidthFk: { location: productionplanningCommonModule, identifier: 'product.widthUoM', initial: 'Width UoM' },
			BasUomHeightFk: { location: productionplanningCommonModule, identifier: 'product.heightUoM', initial: 'Height UoM' },
			BasUomWeightFk: { location: productionplanningCommonModule, identifier: 'product.weightUoM', initial: 'Weight UoM' },
			BasUomAreaFk: { location: productionplanningCommonModule, identifier: 'product.areaUoM', initial: 'Area UoM' },
			BasUomVolumeFk: { location: productionplanningCommonModule, identifier: 'product.volumeUoM', initial: 'Volume UoM' },
			UnitPrice: { location: productionplanningCommonModule, identifier: 'product.unitPrice', initial: '*Unit Price' },
			BillQuantity: { location: productionplanningCommonModule, identifier: 'product.billQuantity', initial: '*Bill Quantity' },
			BasUomBillFk: { location: productionplanningCommonModule, identifier: 'product.billUoM', initial: '*Bill Uom' },
			PlanQuantity: { location: productionplanningCommonModule, identifier: 'product.planQuantity', initial: '*Plan Quantity' },
			BasUomPlanFk: { location: productionplanningCommonModule, identifier: 'product.planUoM', initial: '*Plan Uom' },
			ExternalCode: { location: productionplanningCommonModule, identifier: 'product.externalCode', initial: '*External Code' },
			UserdefinedByProddesc1: { location: productionplanningCommonModule, identifier: 'product.userdefinedbyproddesc1', initial: '*Text By Template 1' },
			UserdefinedByProddesc2: { location: productionplanningCommonModule, identifier: 'product.userdefinedbyproddesc2', initial: '*Text By Template 2' },
			UserdefinedByProddesc3: { location: productionplanningCommonModule, identifier: 'product.userdefinedbyproddesc3', initial: '*Text By Template 3' },
			UserdefinedByProddesc4: { location: productionplanningCommonModule, identifier: 'product.userdefinedbyproddesc4', initial: '*Text By Template 4' },
			UserdefinedByProddesc5: { location: productionplanningCommonModule, identifier: 'product.userdefinedbyproddesc5', initial: '*Text By Template 5' },
			PpsProcessFk: { location: productionplanningCommonModule, identifier: 'product.Process', initial: '*Process' },

			VariableName: {location: productionplanningCommonModule, identifier: 'product.variableName', initial: 'Variable Name'},

			TrsPackageFk: { location: transportplanningPackageModule, identifier: 'entityPackage', initial: 'Transport Package' },

			event: { location: productionplanningCommonModule, identifier: 'event.eventTitle', initial: 'Event' },
			eventOf: { location: productionplanningCommonModule, identifier: 'event.eventOf', initial: 'Event Of' },
			ResTypeFk: { location: productionplanningCommonModule, identifier: 'event.resTypeFk', initial: 'Resource Type' },
			ProductFk: { location: productionplanningCommonModule, identifier: 'event.productFk', initial: 'PPS Product' },
			PsdActivityFk: { location: productionplanningCommonModule, identifier: 'event.psdActivityFk', initial: 'Activity' },
			CalCalendarFk: { location: productionplanningCommonModule, identifier: 'event.calCalendarFk', initial: 'Calendar' },
			ItemFk: { location: productionplanningCommonModule, identifier: 'event.itemFk', initial: 'PPS Item' },
			HeaderFk: { location: productionplanningCommonModule, identifier: 'event.headerFk', initial: 'PPS Header' },
			EventTypeFk: { location: productionplanningCommonModule, identifier: 'event.eventTypeFk', initial: 'Event Type' },
			PlannedStart: { location: productionplanningCommonModule, identifier: 'event.plannedStart', initial: 'Planned Start Date' },
			PlannedFinish: { location: productionplanningCommonModule, identifier: 'event.plannedFinish', initial: 'Planned Finish Date' },
			EarliestStart: { location: productionplanningCommonModule, identifier: 'event.earliestStart', initial: 'Earliest Start Date' },
			LatestStart: { location: productionplanningCommonModule, identifier: 'event.latestStart', initial: 'Latest Start Date' },
			EarliestFinish: { location: productionplanningCommonModule, identifier: 'event.earliestFinish', initial: 'Earliest Finish Date' },
			LatestFinish: { location: productionplanningCommonModule, identifier: 'event.latestFinish', initial: 'Latest Finish Date' },
			IsLocked: {location: productionplanningCommonModule, identifier: 'event.isLocked', initial: '*Locked'},
			userFlagGroup:  {location: productionplanningCommonModule, identifier: 'event.userFlagGroup', initial: '*Userdefined Flags'},
			Userflag1:  {location: productionplanningCommonModule, identifier: 'event.userflag1', initial: '*Userflag1'},
			Userflag2:  {location: productionplanningCommonModule, identifier: 'event.userflag2', initial: '*Userflag2'},

			basic:{ location: productionplanningCommonModule, identifier: 'document.basic', initial: '*Basic Data' },

			OriginFileName:{ location: cloudCommonModule, identifier: 'documentOriginFileName', initial: '*Original File Name' },
			DocumentTypeFk:{ location: productionplanningCommonModule, identifier: 'document.documentTypeFk', initial: '*Document Type' },
			PpsDocumentTypeFk:{ location: productionplanningCommonModule, identifier: 'document.ppsDocumentTypeFk', initial: '*PPS Document Type' },
			Description:{ location: cloudCommonModule, identifier: 'entityDescription', initial: '*Description' },
			CommentText:{ location: cloudCommonModule, identifier: 'entityComment', initial: '*Comments' },

			version:{ location: productionplanningCommonModule, identifier: 'document.basic', initial: '*Version' },
			Revision:{ location: cloudCommonModule, identifier: 'documentsRevision', initial: '*Document Revision' },

			binding:{ location: productionplanningCommonModule, identifier: 'document.basic', initial: '*Binding' },
			PpsItemFk:{ location: ppsItemModule, identifier: 'entityItem', initial: '*Item' },
			MntActivityFk:{ location: productionplanningCommonModule, identifier: 'document.mntActivityFk', initial: '*Mounting Activity' },
			MntReportFk:{ location: productionplanningCommonModule, identifier: 'document.mntReportFk', initial: '*Mounting Report' },
			UomFk: { location: cloudCommonModule, identifier: 'entityUoM', initial: 'UoM' },
			leadingStructuresGroup:{ location: productionplanningCommonModule, identifier: 'leadingStructuresGroup', initial: '*Leading StructuresGroup'},
			Assignment:{ location: productionplanningCommonModule, identifier: 'assignment', initial: '*Assignment' },
			LicCostGroup1Fk:{ location: basCustomizeModule, identifier: 'licCostGroup1Fk', initial: '*CostGroup 1' },
			LicCostGroup2Fk:{ location: basCustomizeModule, identifier: 'licCostGroup2Fk', initial: '*CostGroup 2' },
			LicCostGroup3Fk:{ location: basCustomizeModule, identifier: 'licCostGroup3Fk', initial: '*CostGroup 3' },
			LicCostGroup4Fk:{ location: basCustomizeModule, identifier: 'licCostGroup4Fk', initial: '*CostGroup 4' },
			LicCostGroup5Fk:{ location: basCustomizeModule, identifier: 'licCostGroup5Fk', initial: '*CostGroup 5' },
			PrjCostGroup1Fk:{ location: basCustomizeModule, identifier: 'prjCostGroup1Fk', initial: '*PrjCostGroup1' },
			PrjCostGroup2Fk:{ location: basCustomizeModule, identifier: 'prjCostGroup2Fk', initial: '*PrjCostGroup2' },
			PrjCostGroup3Fk:{ location: basCustomizeModule, identifier: 'prjCostGroup3Fk', initial: '*PrjCostGroup3' },
			PrjCostGroup4Fk:{ location: basCustomizeModule, identifier: 'prjCostGroup4Fk', initial: '*PrjCostGroup4' },
			PrjCostGroup5Fk:{ location: basCustomizeModule, identifier: 'prjCostGroup5Fk', initial: '*PrjCostGroup5' },

			MdcControllingunitFk:{ location: productionplanningCommonModule, identifier: 'mdcControllingUnitFk', initial: '*Controlling Unit' },
			LgmJobFk:{ location: projectCostCodesModule, identifier: 'lgmJobFk', initial: '*Logistic Job' },
			ActualStart: {location: productionplanningCommonModule, identifier: 'event.actualStart', initial: '* Actual StartDate'},
			ActualFinish: {location: productionplanningCommonModule, identifier: 'event.actualFinish', initial: '* Actual FinishDate'},

			ClerkRoleFk: {location: basicsCommonModule, identifier: 'entityClerkRole', initial: '*Clerk Role'},
			ClerkFk: {location: basicsCommonModule, identifier: 'entityClerk', initial: '*Clerk'},
			ValidFrom: {location: basicsCommonModule, identifier: 'entityValidFrom', initial: '*Valid From'},
			ValidTo: {location: basicsCommonModule, identifier: 'entityValidTo', initial: '*Valid To'},
			EngHeaderFk: {location: ppsEngModule, identifier: 'entityEngHeader', initial: '*Engineering Header'},
			Quantity: {location: productionplanningCommonModule, identifier: 'entityQuantity', initial: '*Quantity'},
			PrjStockFk: {location: procurementCommonModule, identifier: 'entityPrjStock', initial: '*Stock'},
			PrjStockLocationFk: {location: procurementCommonModule, identifier: 'entityPrjStockLocation', initial: '*Stock Location'},
			ProductionTime: {location: productionplanningCommonModule, identifier: 'productionTime', initial: '*Production Finished'},

			//log layout
			Date: {location: productionplanningCommonModule, identifier: 'logLayout.date', initial: '*Date'},
			PpsItemCode: {location: productionplanningCommonModule, identifier: 'logLayout.planningUnit', initial: '*Planning Unit'},
			PpsEntityDescription: {location: productionplanningCommonModule, identifier: 'logLayout.ppsEntityDescription', initial: '*PPS Entity'},
			RecordCode: {location: productionplanningCommonModule, identifier: 'logLayout.recordCode', initial: '*Code'},
			RecordDescription: {location: productionplanningCommonModule, identifier: 'logLayout.recordDescription', initial: '*Description'},
			RecordType: {location: productionplanningCommonModule, identifier: 'logLayout.recordType', initial: '*Type'},
			ColumnName: {location: productionplanningCommonModule, identifier: 'logLayout.columnName', initial: '*Column Name'},
			OldValueDescription: {location: productionplanningCommonModule, identifier: 'logLayout.oldValueDescription', initial: '*Old Value'},
			NewValueDescription: {location: productionplanningCommonModule, identifier: 'logLayout.newValueDescription', initial: '*New Value'},
			Reason: {location: productionplanningCommonModule, identifier: 'logLayout.reasonDescription', initial: '*Reason'},
			Remark: {location: productionplanningCommonModule, identifier: 'logLayout.remark', initial: '*Remark'},
			Updater: {location: productionplanningCommonModule, identifier: 'logLayout.updater', initial: '*Update By (Name)'},
			AutoGenerated: {location: productionplanningCommonModule, identifier: 'logLayout.autoGenerated', initial: '*Auto Generated'},
			RecordId: {location: productionplanningCommonModule, identifier: 'logLayout.recordId', initial: '*Record Id'},
			EventCode: { location: productionplanningCommonModule, identifier: 'event.eventCode', initial: '*Event Code' },
			transport: {location: productionplanningCommonModule, identifier: 'transport', initial: '*Transport'},
			From: { location: productionplanningCommonModule, identifier: 'from', initial: '*From'  },
			DateshiftMode: { location: productionplanningCommonModule, identifier: 'event.dateshiftMode', initial: '*DateShift Mode' },
			propertiesGroup: { location: ppsMaterialModule, identifier: 'productDescription.propertiesGroup', initial: '*Properties' },
			IsolationVolume: { location: ppsMaterialModule, identifier: 'productDescription.isolationVolume', initial: '*Isolation Volume' },
			ConcreteVolume: { location: ppsMaterialModule, identifier: 'productDescription.concreteVolume', initial: '*Concrete Volume' },
			ConcreteQuality: { location: ppsMaterialModule, identifier: 'productDescription.concreteQuality', initial: '*Concrete Quality' },
			Source: {location: productionplanningCommonModule, identifier: 'notification.source', initial: '*Source'},
			Message: {location: productionplanningCommonModule, identifier: 'notification.message', initial: '*Message'},
			basicData: {location: cloudCommonModule, identifier: 'entityProperties', initial: 'Basic Data'},
			BusinessPartnerFk: {location: basCustomizeModule, identifier: 'businesspartnerfk', initial: '*Business Partner'},
			ContactFk: {location: projectMainModule, identifier: 'entityContact', initial: '*Contact'},
			RoleFk: {location: projectMainModule, identifier: 'entityRole', initial: '*Role'},
			RoleTypeFk: {location: basCustomizeModule, identifier: 'projectcontractroletype', initial: '*Contact Role Type'},
			SubsidiaryFk: { location: projectMainModule, identifier: 'entitySubsidiary', initial: '*Subsidiary'},
			TelephoneNumberFk: {location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: '*Telephone Number'},
			TelephoneNumber2Fk: {location: bizPartnerModule, identifier: 'telephoneNumber2', initial: '*Other Tel.'},
			TelephoneNumberMobileFk: {location: cloudCommonModule, identifier: 'mobile', initial: '*Telephone Mobil'},
			TelephoneNumberString: {location: cloudCommonModule, identifier: 'TelephoneDialogPhoneNumber', initial: '*Telephone Number'},
			TelephoneNumber2String: {location: bizPartnerModule, identifier: 'telephoneNumber2', initial: '*Other Tel.'},
			TelephoneNumberMobileString: {location: cloudCommonModule, identifier: 'mobile', initial: '*Telephone Mobil'},
			Email: {location: cloudCommonModule, identifier: 'email', initial: '*Email'},
			FirstName: {location: basicsClerkModule, identifier: 'entityFirstName', initial: '*First Name'},
			ProductionOrder:{ location: productionplanningCommonModule, identifier: 'product.productionOrder', initial: '*Production Order'},
			Reproduced: { location: productionplanningCommonModule, identifier: 'product.reproduced', initial: '*Reproduced'},
			PpsStrandPatternFk: { location: ppsStrandpatternModule, identifier: 'entityStrandPattern', initial: '*Strand Pattern'},
			EndDate : {location: productionplanningCommonModule, identifier: 'product.date', initial: '*Date'},
			IsIncoming: { location: productionplanningCommonModule, identifier: 'product.type', initial: '*Type'},
			JobFk: { location: projectCostCodesModule, identifier: 'lgmJobFk', initial: '*Logistic Job' },
			TimeStamp: { location: productionplanningCommonModule, identifier: 'product.timeStamp', initial: '*Time Stamp'},
			Module: { location: productionplanningCommonModule, identifier: 'product.module', initial: '*Module'},
			EntityCode: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
			EntityDescription: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'},
			PpsProductionSetSubFk: { location: productionplanningCommonModule, identifier: 'product.subProductionSet', initial: '*Sub Production Set'},
			PpsCostCodeFk: {location: cloudCommonModule, identifier: 'entityCostCode', initial: '*Cost Code'},
			BasSiteProdAreaFk: {location: productionplanningCommonModule, identifier: 'empolyeeAssignment.basSiteProdAreaFk', initial: '*Production Area'},
			TksEmployeeFk:{location: productionplanningCommonModule, identifier: 'empolyeeAssignment.eksEmployeeFk', initial: '*Employee'},
			Percentage:{location: productionplanningCommonModule, identifier: 'empolyeeAssignment.percentage', initial: '*Percentage'},
			Guid: {location: ppsProductTemplateModule, identifier: 'GUID', initial: '*GUID'},
			FabriCode: {location: productionplanningCommonModule, identifier: 'product.FabriCode', initial: '*Fabrication Unit Code'},
			FabriExternalCode: {location: productionplanningCommonModule, identifier: 'product.FabriExternalCode', initial: '*Fabrication Unit ExternalCode'},
			ProdPlaceFk: {location: productionplanningProductModule, identifier: 'productionPlace.productionPlace', initial: '*Production Place'},
			PpsEntityFk: {location: productionplanningCommonModule, identifier: 'ppsEntity', initial: '*PPS Entity'},
			CurrentLocationJobFk: {location: productionplanningCommonModule, identifier: 'product.entityJobFromHistory', initial: '*Current Location Job'},
			InstallSequence: {location: productionplanningCommonModule, identifier: 'product.installSequence', initial: '*Installation Sequence No.'},
			Sequence: {location: productionplanningCommonModule, identifier: 'product.sequence', initial: '*Sequence No.'},
			PpsItemStockFk: {location: productionplanningCommonModule, identifier: 'product.ppsItemStockFk', initial: '*Origin Stock Planning Unit'},
			StatusId: {location: cloudCommonModule, identifier: 'entityStatus', initial: '*Status'},
			LengthCalculated: { location: ppsItemModule, identifier: 'lengthcalculated', initial: 'Length Calculated' },
			WidthCalculated: { location: ppsItemModule, identifier: 'widthcalculated', initial: 'Width Calculated' },
			HeightCalculated: { location: ppsItemModule, identifier: 'heightcalculated', initial: 'Height Calculated' },
			WeightCalculated: { location: ppsItemModule, identifier: 'weightcalculated', initial: 'Weight Calculated' },
			ProductTemplateCode: {location: productionplanningCommonModule, identifier: 'product.productDescriptionFk', initial: '*ProductTemplateCode'},
		};

		var documentRevisionWords = {
			Barcode: {
				location: productionplanningCommonModule,
				identifier: 'document.revision.barcode',
				initial: '*Barcode'
			},
			Description: {
				location: productionplanningCommonModule,
				identifier: 'document.revision.description',
				initial: '*Description'
			},
			CommentText: {
				location: productionplanningCommonModule,
				identifier: 'document.revision.commenttext',
				initial: '*Comment'
			},
			Revision: {
				location: productionplanningCommonModule,
				identifier: 'document.revision.revision',
				initial: '*Revision'
			}
		};
		_.extend(data.words, documentRevisionWords);

		//Get some predefined packages of words used in project
		platformTranslationUtilitiesService.addHistoryTranslation(data.words);
		platformTranslationUtilitiesService.addCloudCommonBasicWords(data.words);
		platformTranslationUtilitiesService.addUserDefinedTextTranslation(data.words, 5, 'Userdefined');

		//Convert word list into a format used by platform translation service
		data.toTranslate = platformTranslationUtilitiesService.initializeTranslation(data.allUsedModules, data.words);

		//Prepare interface of service and load translations
		platformTranslationUtilitiesService.addTranslationServiceInterface(service, data);
		platformTranslationUtilitiesService.loadModuleTranslation(data);
		platformTranslationUtilitiesService.registerModules(data);

		customColumnsServiceTranslationExtension.addMethodsForCustomColumnsTranslation(service, data, ['productionplanning.common.header', 'productionplanning.common.product']);

		service.data = data;
		return service;
	}
})(angular);

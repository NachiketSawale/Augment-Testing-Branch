(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	// procurementCommonTotalListController
	angular.module(moduleName).factory('procurementContractTotalDataService', ['procurementContextService', 'procurementContractHeaderDataService', 'procurementCommonTotalDataService',
		function (moduleContext, parentService, dataServiceFactory) {
			moduleContext.setLeadingService(parentService);
			moduleContext.setMainService(parentService);
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonPrcItemListController
	angular.module(moduleName).factory('procurementContractItemDataService', ['procurementContractHeaderDataService', 'procurementCommonPrcItemDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonDeliveryScheduleListController
	angular.module(moduleName).factory('procurementContractDeliveryScheduleDataService', ['procurementContractHeaderDataService', 'procurementCommonDeliveryScheduleDataService', 'procurementCommonPrcItemDataService',
		function (parentService, dataServiceFactory, itemDataService) {
			var itemService = itemDataService.getService(parentService);
			return dataServiceFactory.getService(itemService);
		}]);

	// certificate
	angular.module(moduleName).factory('procurementContractCertificateNewDataService', ['procurementContractHeaderDataService', 'procurementCommonCertificateNewDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonMilestoneListController
	angular.module(moduleName).factory('procurementContractMilestoneDataService', ['procurementContractHeaderDataService', 'procurementCommonMilestoneDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonPaymentScheduleListController
	angular.module(moduleName).factory('procurementContractPaymentScheduleDataService', ['procurementContractHeaderDataService', 'procurementCommonPaymentScheduleDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonDocumentListController
	angular.module(moduleName).factory('procurementContractDocumentCoreDataService', ['procurementContractHeaderDataService', 'procurementCommonDocumentCoreDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonSubcontractorListController
	angular.module(moduleName).factory('procurementContractSubcontractorDataService', ['procurementContractHeaderDataService', 'procurementCommonSubcontractorDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonGeneralsListController
	angular.module(moduleName).factory('procurementContractGeneralsDataService', ['procurementContractHeaderDataService', 'procurementCommonGeneralsDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonPrcBoqListController
	angular.module(moduleName).factory('procurementContractBoqDataService', ['procurementContractHeaderDataService', 'procurementCommonPrcBoqService', 'prcBoqMainService',
		function (parentService, dataServiceFactory, prcBoqMainService) {
			var contractBoqMainService = prcBoqMainService.getService(parentService);
			return dataServiceFactory.getService(parentService, contractBoqMainService);
		}]);

	// BoqStructureController
	angular.module(moduleName).factory('procurementContractBoqItemService', ['procurementContractHeaderDataService', 'procurementCommonPrcBoqService', 'prcBoqMainService',
		function (parentService, dataServiceFactory, prcBoqMainService) {
			return prcBoqMainService.getService(parentService);
		}]);

	// documentsProjectDocumentController
	angular.module(moduleName).factory('procurementContractDocumentDataService', ['procurementContractHeaderDataService', 'documentsProjectDocumentDataService',
		function (parentService, dataServiceFactory) {
			dataServiceFactory.register({
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'ConHeaderFk', dataField: 'Id', readOnly: false},
					{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
					{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
					{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
					{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'PrcStructureFk', readOnly: false, dataField: 'PrcHeaderEntity.StructureFk'}
				]
			});
			return dataServiceFactory.getService({
				moduleName: moduleName
			});
		}]);

	// documentsProjectDocumentRevisionController
	angular.module(moduleName).factory('procurementContractDocumentRevisionDataService', ['procurementContractHeaderDataService', 'documentsProjectDocumentRevisionDataService', 'documentsProjectDocumentDataService',
		function (parentService, dataServiceFactory, documentsProjectDocumentDataService) {
			var config = {
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'ConHeaderFk', dataField: 'Id', readOnly: false},
					{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
					{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
					{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
					{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'PrcStructureFk', readOnly: false, dataField: 'PrcHeaderEntity.StructureFk'}
				],
				title: moduleName
			};

			var revisionConfig = angular.copy(config);

			revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

			return dataServiceFactory.getService(revisionConfig);
		}]);

	// businesspartnerCertificateActualCertificateListController
	angular.module(moduleName).factory('procurementContractCertificateActualDataService', ['businesspartnerCertificateCertificateContainerServiceFactory', 'procurementContractHeaderDataService',
		function (dataServiceFactory, parentService) {
			return dataServiceFactory.getDataService(moduleName, parentService);
		}]);

	// procurementCommonOverviewController
	angular.module(moduleName).factory('procurementContractOverviewDataService', ['procurementContractHeaderDataService', 'procurementCommonOverviewDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonHeaderTextController and plainText
	angular.module(moduleName).factory('procurementContractHeaderTextNewDataService', ['procurementContractHeaderDataService', 'procurementCommonHeaderTextNewDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonItemTextController and plainText
	angular.module(moduleName).factory('procurementContractItemTextNewDataService', ['procurementContractHeaderDataService', 'procurementCommonItemTextNewDataService',
		'procurementContextService', 'procurementCommonPrcItemDataService',
		function (parentService, dataServiceFactory, moduleContext, procurementCommonPrcItemDataService) {
			moduleContext.setLeadingService(parentService);
			moduleContext.setMainService(parentService);
			moduleContext.setItemDataService(procurementCommonPrcItemDataService.getService(parentService));
			return dataServiceFactory.getService(moduleContext.getItemDataService());
		}]);

	// basicsUserFormFormDataController
	angular.module(moduleName).factory('procurementContractFormDataDataService', ['$injector', 'basicsUserFormFormDataDataService', 'procurementContractHeaderDataService',
		function ($injector, dataServiceFactory, parentService) {
			var rubricId = 26,// value same as basicsUserFormFormDataController in json file "procurement.contract.module-containers.json"
				uuid = '13FD1F28813A4772A4CE9074FAEFCB0A',
				title = 'procurement.contract.formData';

			return dataServiceFactory.getService(parentService, {
				uuid: uuid,
				rubricId: rubricId,
				title: title
			});
		}]);

	// procurementCommonPrcBoqDetailController
	angular.module(moduleName).factory('procurementContractPrcBoqDetailDataService', ['prcBoqMainService', 'procurementContractHeaderDataService',
		function (dataServiceFactory, parentService) {
			return dataServiceFactory.getService(parentService);
		}]);

	// prcBoqMainNodeController
	angular.module(moduleName).factory('procurementContractBoqMainNodeDataService', ['prcBoqMainService', 'procurementContractHeaderDataService',
		function (dataServiceFactory, parentService) {
			return dataServiceFactory.getService(parentService);
		}]);

	// characteristic
	angular.module(moduleName).factory('procurementContractCharacteristicDataService', ['basicsCharacteristicDataServiceFactory', 'procurementContractHeaderDataService',
		function (dataServiceFactory, parentService) {
			var sectionId = 8;
			var uuid = 'd2b5525ef2ee49e4b820de6004dfb8c4';
			return dataServiceFactory.getService(parentService, sectionId, uuid);
		}]);

	// procurementContractGrpSetDTLDataService
	angular.module(moduleName).factory('procurementContractGrpSetDTLDataService', ['procurementContractHeaderDataService', 'controllingStructureGrpSetDTLDataService', 'procurementCommonPrcItemDataService',
		function (parentService, dataService, itemDataService) {
			var itemService = itemDataService.getService(parentService);
			return dataService.createService(itemService, 'procurementContractGrpSetDTLDataService');
		}]);

})(angular);
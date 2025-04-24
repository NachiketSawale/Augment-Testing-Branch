(function (angular) {

	'use strict';
	let moduleName = 'procurement.requisition';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	// procurementCommonTotalListController
	angular.module(moduleName).factory('procurementRequisitionTotalDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonTotalDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonPrcItemListController
	angular.module(moduleName).factory('procurementRequisitionItemDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonPrcItemDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonDeliveryScheduleListController
	angular.module(moduleName).factory('procurementRequisitionDeliveryScheduleDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonDeliveryScheduleDataService', 'procurementCommonPrcItemDataService',
		function (parentService, dataServiceFactory, itemDataService) {
			let itemService = itemDataService.getService(parentService);
			return dataServiceFactory.getService(itemService);
		}]);

	// procurementCommonContactController
	angular.module(moduleName).factory('procurementRequisitionContactDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonContactDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// certificate
	angular.module(moduleName).factory('procurementRequisitionCertificateNewDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonCertificateNewDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonMilestoneListController
	angular.module(moduleName).factory('procurementRequisitionMilestoneDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonMilestoneDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonPaymentScheduleListController
	angular.module(moduleName).factory('procurementRequisitionPaymentScheduleDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonPaymentScheduleDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonDocumentListController
	angular.module(moduleName).factory('procurementRequisitionDocumentCoreDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonDocumentCoreDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonSubcontractorListController
	angular.module(moduleName).factory('procurementRequisitionSubcontractorDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonSubcontractorDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonGeneralsListController
	angular.module(moduleName).factory('procurementRequisitionGeneralsDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonGeneralsDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonPrcBoqListController
	angular.module(moduleName).factory('procurementRequisitionBoqDataService', ['procurementRequisitionHeaderDataService', 'procurementCommonPrcBoqService', 'prcBoqMainService',
		function (parentService, dataServiceFactory, prcBoqMainService) {
			let requisitionBoqMainService = prcBoqMainService.getService(parentService);
			return dataServiceFactory.getService(parentService, requisitionBoqMainService);
		}]);

	// BoqStructureController
	angular.module(moduleName).factory('procurementRequisitionBoqItemService', ['procurementRequisitionHeaderDataService', 'procurementCommonPrcBoqService', 'prcBoqMainService',
		function (parentService, dataServiceFactory, prcBoqMainService) {
			return prcBoqMainService.getService(parentService);
		}]);

	// documentsProjectDocumentController
	angular.module(moduleName).factory('procurementRequisitionDocumentDataService', ['procurementRequisitionHeaderDataService', 'documentsProjectDocumentDataService',
		function (parentService, dataServiceFactory) {
			dataServiceFactory.register({
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
					{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
					{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
					{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
					{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
					{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
				]
			});
			return dataServiceFactory.getService({
				moduleName: moduleName
			});
		}]);

	// documentsProjectDocumentRevisionController
	angular.module(moduleName).factory('procurementRequisitionDocumentRevisionDataService', ['procurementRequisitionHeaderDataService', 'documentsProjectDocumentRevisionDataService', 'documentsProjectDocumentDataService',
		function (parentService, dataServiceFactory, documentsProjectDocumentDataService) {
			let config = {
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'ReqHeaderFk', dataField: 'Id', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'MdcControllingUnitFk', dataField: 'ControllingUnitFk', readOnly: false},
					{documentField: 'BpdBusinessPartnerFk', dataField: 'BusinessPartnerFk', readOnly: false},
					{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
					{documentField: 'PrcStructureFk', dataField: 'PrcHeaderEntity.StructureFk', readOnly: false},
					{documentField: 'MdcMaterialCatalogFk', dataField: 'MaterialCatalogFk', readOnly: false},
					{documentField: 'PrcPackageFk', dataField: 'PackageFk', readOnly: false}
				],
				title: moduleName
			};

			let revisionConfig = angular.copy(config);

			revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

			return dataServiceFactory.getService(revisionConfig);
		}]);

	// procurementRequisitionGrpSetDTLDataService
	angular.module(moduleName).factory('procurementRequisitionGrpSetDTLDataService', ['procurementRequisitionHeaderDataService', 'controllingStructureGrpSetDTLDataService', 'procurementCommonPrcItemDataService',
		function (parentService, dataService, itemDataService) {
			let itemService = itemDataService.getService(parentService);
			return dataService.createService(itemService, 'procurementRequisitionGrpSetDTLDataService');
		}]);

})(angular);
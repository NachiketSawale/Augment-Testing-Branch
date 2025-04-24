(function (angular) {

	'use strict';
	var moduleName = 'procurement.package';

	// procurementCommonTotalListController
	angular.module(moduleName).factory('procurementPackageTotalDataService', ['procurementContextService', 'procurementPackageDataService', 'procurementPackagePackage2HeaderService', 'procurementCommonTotalDataService',
		function (moduleContext, leadingService, parentService, dataServiceFactory) {
			moduleContext.setLeadingService(leadingService);
			moduleContext.setMainService(parentService);
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonPrcItemListController
	angular.module(moduleName).factory('procurementPackageItemDataService', ['procurementPackagePackage2HeaderService', 'procurementCommonPrcItemDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonDeliveryScheduleListController
	angular.module(moduleName).factory('procurementPackageDeliveryScheduleDataService', ['procurementPackageDataService', 'procurementCommonDeliveryScheduleDataService', 'procurementCommonPrcItemDataService',
		function (parentService, dataServiceFactory, itemDataService) {
			var itemService = itemDataService.getService(parentService);
			return dataServiceFactory.getService(itemService);
		}]);

	// certificate
	angular.module(moduleName).factory('procurementPackageCertificateNewDataService', ['procurementPackagePackage2HeaderService', 'procurementCommonCertificateNewDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonMilestoneListController
	angular.module(moduleName).factory('procurementPackageMilestoneDataService', ['procurementPackageDataService', 'procurementCommonMilestoneDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonDocumentListController
	angular.module(moduleName).factory('procurementPackageDocumentCoreDataService', ['procurementPackageDataService', 'procurementCommonDocumentCoreDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonSubcontractorListController
	angular.module(moduleName).factory('procurementPackageSubcontractorDataService', ['procurementPackageDataService', 'procurementCommonSubcontractorDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonGeneralsListController
	angular.module(moduleName).factory('procurementPackageGeneralsDataService', ['procurementPackagePackage2HeaderService', 'procurementCommonGeneralsDataService',
		function (parentService, dataServiceFactory) {
			return dataServiceFactory.getService(parentService);
		}]);

	// procurementCommonPrcBoqListController
	angular.module(moduleName).factory('procurementPackageBoqDataService', ['procurementPackagePackage2HeaderService', 'procurementCommonPrcBoqService', 'prcBoqMainService',
		function (parentService, dataServiceFactory, prcBoqMainService) {
			var packageBoqMainService = prcBoqMainService.getService(parentService);
			return dataServiceFactory.getService(parentService, packageBoqMainService);
		}]);

	// BoqStructureController
	angular.module(moduleName).factory('procurementPackageBoqItemService', ['procurementPackagePackage2HeaderService', 'procurementCommonPrcBoqService', 'prcBoqMainService',
		function (parentService, dataServiceFactory, prcBoqMainService) {
			return prcBoqMainService.getService(parentService);
		}]);

	// documentsProjectDocumentController
	angular.module(moduleName).factory('procurementPackageDocumentDataService', ['procurementPackageDataService', 'documentsProjectDocumentDataService',
		function (parentService, dataServiceFactory) {
			dataServiceFactory.register({
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'PrcPackageFk', dataField: 'Id', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'PrcStructureFk', dataField: 'StructureFk', readOnly: false},
					{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
					{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
				]
			});
			return dataServiceFactory.getService({
				moduleName: moduleName
			});
		}]);

	// documentsProjectDocumentRevisionController
	angular.module(moduleName).factory('procurementPackageDocumentRevisionDataService', ['procurementPackageDataService', 'documentsProjectDocumentRevisionDataService', 'documentsProjectDocumentDataService',
		function (parentService, dataServiceFactory, documentsProjectDocumentDataService) {
			var config = {
				moduleName: moduleName,
				parentService: parentService,
				columnConfig: [
					{documentField: 'PrcPackageFk', dataField: 'Id', readOnly: false},
					{documentField: 'PrjProjectFk', dataField: 'ProjectFk', readOnly: false},
					{documentField: 'PrcStructureFk', dataField: 'StructureFk', readOnly: false},
					{documentField: 'PsdActivityFk', dataField: 'ActivityFk', readOnly: false},
					{documentField: 'PsdScheduleFk', dataField: 'ScheduleFk', readOnly: false}
				],
				title: moduleName
			};

			var revisionConfig = angular.copy(config);

			revisionConfig.parentService = documentsProjectDocumentDataService.getService(config);

			return dataServiceFactory.getService(revisionConfig);
		}]);

	// procurementPackageGrpSetDTLDataService
	angular.module(moduleName).factory('procurementPackageGrpSetDTLDataService', ['procurementContractHeaderDataService', 'controllingStructureGrpSetDTLDataService', 'procurementCommonPrcItemDataService',
		function (parentService, dataService, itemDataService) {
			var itemService = itemDataService.getService(parentService);
			return dataService.createService(itemService, 'procurementPackageGrpSetDTLDataService');
		}]);

	// procurementCommonPaymentScheduleListController
	angular.module(moduleName).factory('procurementPackagePaymentScheduleDataService', ['procurementContextService', 'procurementPackageDataService', 'procurementPackagePackage2HeaderService', 'procurementCommonPaymentScheduleDataService',
		function (moduleContext, leadingService, parentService, dataServiceFactory) {
			moduleContext.setLeadingService(leadingService);
			moduleContext.setMainService(parentService);
			return dataServiceFactory.getService(parentService);
		}]);

})(angular);
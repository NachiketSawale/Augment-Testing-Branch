(function (angular) {

	'use strict';
	let moduleName = 'procurement.requisition';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	// procurementCommonPrcItemListController
	angular.module(moduleName).factory('procurementRequisitionItemValidationService',
		['procurementRequisitionItemDataService', 'procurementCommonPrcItemValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonTotalListController
	angular.module(moduleName).factory('procurementRequisitionTotalValidationService',
		['procurementRequisitionTotalDataService', 'procurementCommonTotalValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonDeliveryScheduleListController
	angular.module(moduleName).factory('procurementRequisitionDeliveryScheduleValidationService',
		['procurementRequisitionDeliveryScheduleDataService', 'procurementCommonDeliveryScheduleValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonContactListController
	angular.module(moduleName).factory('procurementRequisitionContactValidationService',
		['procurementRequisitionContactDataService', 'procurementCommonContactValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonCertificatesController
	angular.module(moduleName).factory('procurementRequisitionCertificatesValidationService',
		['procurementRequisitionCertificateNewDataService', 'procurementCommonCertificatesValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonMilestoneListController
	angular.module(moduleName).factory('procurementRequisitionMilestoneValidationService',
		['procurementRequisitionMilestoneDataService', 'procurementCommonMilestoneValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonDocumentListControllers
	angular.module(moduleName).factory('procurementRequisitionDocumentValidationService',
		['procurementRequisitionDocumentCoreDataService', 'procurementCommonDocumentValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonSubcontractorListController
	angular.module(moduleName).factory('procurementRequisitionSubcontractorValidationService',
		['procurementRequisitionSubcontractorDataService', 'procurementCommonSubcontractorValidationDataService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonGeneralsListController
	angular.module(moduleName).factory('procurementRequisitionGeneralsValidationService',
		['procurementRequisitionGeneralsDataService', 'procurementCommonGeneralsValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonPrcBoqListController
	angular.module(moduleName).factory('procurementRequisitionPrcBoqValidationService',
		['procurementRequisitionBoqDataService', 'procurementCommonPrcBoqValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);
	// procurementCommonPaymentScheduleListController
	angular.module(moduleName).factory('procurementRequisitionPaymentScheduleValidationService',
		['procurementRequisitionHeaderDataService', 'procurementCommonPaymentScheduleDataService', 'procurementCommonPaymentScheduleValidationService',
			function (parentService, dataServiceFactory, validationServiceFactory) {
				let dataService = dataServiceFactory.getService(parentService);
				return validationServiceFactory.getService(dataService);
			}]);

})(angular);
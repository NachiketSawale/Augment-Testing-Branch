(function (angular) {

	'use strict';
	var moduleName = 'procurement.contract';
	// eslint-disable-next-line no-redeclare
	/* global angular */
	// procurementCommonPrcItemListController
	angular.module(moduleName).factory('procurementContractItemValidationService',
		['procurementContractItemDataService', 'procurementCommonPrcItemValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonTotalListController
	angular.module(moduleName).factory('procurementContractTotalValidationService',
		['procurementContractTotalDataService', 'procurementCommonTotalValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonDeliveryScheduleListController
	angular.module(moduleName).factory('procurementContractDeliveryScheduleValidationService',
		['procurementContractDeliveryScheduleDataService', 'procurementCommonDeliveryScheduleValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonCertificatesController
	angular.module(moduleName).factory('procurementContractCertificatesValidationService',
		['procurementContractCertificateNewDataService', 'procurementCommonCertificatesValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonMilestoneListController
	angular.module(moduleName).factory('procurementContractMilestoneValidationService',
		['procurementContractMilestoneDataService', 'procurementCommonMilestoneValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonPaymentScheduleListController
	angular.module(moduleName).factory('procurementContractPaymentScheduleValidationService',
		['procurementContractHeaderDataService', 'procurementCommonPaymentScheduleDataService', 'procurementCommonPaymentScheduleValidationService',
			function (parentService, dataServiceFactory, validationServiceFactory) {
				var dataService = dataServiceFactory.getService(parentService);
				return validationServiceFactory.getService(dataService);
			}]);

	// procurementCommonDocumentListControllers
	angular.module(moduleName).factory('procurementContractDocumentValidationService',
		['procurementContractDocumentCoreDataService', 'procurementCommonDocumentValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonSubcontractorListController
	angular.module(moduleName).factory('procurementContractSubcontractorValidationService',
		['procurementContractSubcontractorDataService', 'procurementCommonSubcontractorValidationDataService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonGeneralsListController
	angular.module(moduleName).factory('procurementContractGeneralsValidationService',
		['procurementContractGeneralsDataService', 'procurementCommonGeneralsValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonPrcBoqListController
	angular.module(moduleName).factory('procurementContractPrcBoqValidationService',
		['procurementContractBoqDataService', 'procurementCommonPrcBoqValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonOverviewController
	angular.module(moduleName).factory('procurementContractOverviewValidationService',
		['procurementContractOverviewDataService', 'procurementCommonDataValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonHeaderTextController
	angular.module(moduleName).factory('procurementContractHeaderTextValidationService',
		['procurementContractHeaderTextNewDataService', 'procurementCommonHeaderTextValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonItemTextController and plainText
	angular.module(moduleName).factory('procurementContractItemTextValidationService',
		['procurementContractItemTextNewDataService', 'procurementCommonItemTextValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// businesspartnerCertificateActualCertificateListController
	angular.module(moduleName).factory('procurementContractCertificateActualValidationService',
		['procurementContractCertificateActualDataService', 'businesspartnerCertificateCertificateValidationServiceFactory',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory.create(dataService);
			}]);

})(angular);
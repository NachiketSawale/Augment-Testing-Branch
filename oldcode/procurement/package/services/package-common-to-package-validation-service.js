(function (angular) {

	'use strict';
	var moduleName = 'procurement.package';

	// procurementCommonPrcItemListController
	angular.module(moduleName).factory('procurementPackageItemValidationService',
		['procurementPackageItemDataService', 'procurementCommonPrcItemValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonTotalListController
	angular.module(moduleName).factory('procurementPackageTotalValidationService',
		['procurementPackageTotalDataService', 'procurementCommonTotalValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonDeliveryScheduleListController
	angular.module(moduleName).factory('procurementPackageDeliveryScheduleValidationService',
		['procurementPackageDeliveryScheduleDataService', 'procurementCommonDeliveryScheduleValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonCertificatesController
	angular.module(moduleName).factory('procurementPackageCertificatesValidationService',
		['procurementPackageCertificateNewDataService', 'procurementCommonCertificatesValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonMilestoneListController
	angular.module(moduleName).factory('procurementPackageMilestoneValidationService',
		['procurementPackageMilestoneDataService', 'procurementCommonMilestoneValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonDocumentListControllers
	angular.module(moduleName).factory('procurementPackageDocumentValidationService',
		['procurementPackageDocumentCoreDataService', 'procurementCommonDocumentValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonSubcontractorListController
	angular.module(moduleName).factory('procurementPackageSubcontractorValidationService',
		['procurementPackageSubcontractorDataService', 'procurementCommonSubcontractorValidationDataService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonGeneralsListController
	angular.module(moduleName).factory('procurementPackageGeneralsValidationService',
		['procurementPackageGeneralsDataService', 'procurementCommonGeneralsValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonPrcBoqListController
	angular.module(moduleName).factory('procurementPackagePrcBoqValidationService',
		['procurementPackageBoqDataService', 'procurementCommonPrcBoqValidationService',
			function (dataService, validationServiceFactory) {
				return validationServiceFactory(dataService);
			}]);

	// procurementCommonPaymentScheduleListController
	angular.module(moduleName).factory('procurementPackagePaymentScheduleValidationService',
		['procurementPackagePackage2HeaderService', 'procurementCommonPaymentScheduleDataService', 'procurementCommonPaymentScheduleValidationService',
			function (parentService, dataServiceFactory, validationServiceFactory) {
				var dataService = dataServiceFactory.getService(parentService);
				return validationServiceFactory.getService(dataService);
			}]);

})(angular);
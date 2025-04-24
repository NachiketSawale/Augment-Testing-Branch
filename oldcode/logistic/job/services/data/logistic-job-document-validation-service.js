(function (angular) {
	'use strict';

	var moduleName = 'logistic.job';
	/**
	 * @ngdoc service
	 * @name logisticJobDocumentValidationService
	 * @description provides validation methods for text module entities
	 */
	angular.module(moduleName).service('logisticJobDocumentValidationService', LogisticJobDocumentValidationService);

	LogisticJobDocumentValidationService.$inject = ['platformValidationServiceFactory', 'logisticJobDocumentDataService'];

	function LogisticJobDocumentValidationService(platformValidationServiceFactory, logisticJobDocumentDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
				typeName: 'JobDocumentDto',
				moduleSubModule: 'Logistic.Job'
			}, {
				mandatory: ['DocumentTypeFk', 'JobDocumentTypeFk', 'FileArchiveDocFk','JobFk']
			},
			self,
			logisticJobDocumentDataService);
	}
})(angular);
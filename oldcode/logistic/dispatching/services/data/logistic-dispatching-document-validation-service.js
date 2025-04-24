/**
 * Created by baf on 30.01.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingDocumentValidationService
	 * @description provides validation methods for logistic dispatching record entities
	 */
	angular.module(moduleName).service('logisticDispatchingDocumentValidationService', LogisticDispatchingDocumentValidationService);

	LogisticDispatchingDocumentValidationService.$inject = ['platformValidationServiceFactory', 'logisticDispatchingDocumentDataService'];

	function LogisticDispatchingDocumentValidationService(platformValidationServiceFactory, logisticDispatchingDocumentDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'DispatchDocumentDto',
			moduleSubModule: 'Logistic.Dispatching'
		}, {
			mandatory: ['DocumentTypeFk', 'DispatchDocumentTypeFk', 'FileArchiveDocFk','DispatchHeaderFk','CompanyFk']
		},
		self,
		logisticDispatchingDocumentDataService);
	}
})(angular);

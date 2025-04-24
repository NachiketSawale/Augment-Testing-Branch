/**
 * Created by baf on 21.09.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingLinkageValidationService
	 * @description provides validation methods for logistic dispatching linkage entities
	 */
	angular.module(moduleName).service('logisticDispatchingLinkageValidationService', LogisticDispatchingLinkageValidationService);

	LogisticDispatchingLinkageValidationService.$inject = ['platformValidationServiceFactory', 'logisticDispatchingLinkageDataService'];

	function LogisticDispatchingLinkageValidationService(platformValidationServiceFactory, logisticDispatchingLinkageDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'DispatchHeaderLinkageDto',
			moduleSubModule: 'Logistic.Dispatching'
		}, {
			mandatory: ['LinkageTypeFk', 'LinkageReasonFk', 'DispatchHeaderFk','CompanyFk']
		},
		self,
		logisticDispatchingLinkageDataService);
	}

})(angular);

/**
 * Created by baf on 21.09.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingHeaderRequisitionValidationService
	 * @description provides validation methods for logistic dispatching headerRequisition entities
	 */
	angular.module(moduleName).service('logisticDispatchingHeaderRequisitionValidationService', LogisticDispatchingHeaderRequisitionValidationService);

	LogisticDispatchingHeaderRequisitionValidationService.$inject = ['platformValidationServiceFactory', 'logisticDispatchingConstantValues', 'logisticDispatchingHeaderRequisitionDataService'];

	function LogisticDispatchingHeaderRequisitionValidationService(platformValidationServiceFactory, logisticDispatchingConstantValues, logisticDispatchingHeaderRequisitionDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticDispatchingConstantValues.schemes.header2Requisition, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticDispatchingConstantValues.schemes.header2Requisition)
		},
		self,
		logisticDispatchingHeaderRequisitionDataService);
	}
})(angular);

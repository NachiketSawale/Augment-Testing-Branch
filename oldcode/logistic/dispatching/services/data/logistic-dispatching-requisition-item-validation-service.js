/**
 * Created by nitsche on 15.09.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRequisitionItemValidationService
	 * @description provides validation methods for logistic dispatching requisitionItem entities
	 */
	angular.module(moduleName).service('logisticDispatchingRequisitionItemValidationService', LogisticDispatchingRequisitionItemValidationService);

	LogisticDispatchingRequisitionItemValidationService.$inject = ['platformValidationServiceFactory', 'logisticDispatchingConstantValues', 'logisticDispatchingRequisitionItemDataService'];

	function LogisticDispatchingRequisitionItemValidationService(platformValidationServiceFactory, logisticDispatchingConstantValues, logisticDispatchingRequisitionItemDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticDispatchingConstantValues.schemes.requisitionItem, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticDispatchingConstantValues.schemes.requisitionItem)
		},
		self,
		logisticDispatchingRequisitionItemDataService);
	}
})(angular);

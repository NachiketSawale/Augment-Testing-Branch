/**
 * Created by Shankar on 7.09.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingNoteTotalWeightValidationService
	 * @description provides validation methods for logistic dispatching weight info entities
	 */
	angular.module(moduleName).service('logisticDispatchingNoteTotalWeightValidationService', LogisticDispatchingNoteTotalWeightValidationService);

	LogisticDispatchingNoteTotalWeightValidationService.$inject = ['platformValidationServiceFactory', 'logisticDispatchingConstantValues', 'logisticDispatchingNoteTotalWeightDataService'];

	function LogisticDispatchingNoteTotalWeightValidationService(platformValidationServiceFactory, logisticDispatchingConstantValues, logisticDispatchingNoteTotalWeightDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticDispatchingConstantValues.schemes.dispatchNoteTotalWeight, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticDispatchingConstantValues.schemes.dispatchNoteTotalWeight)
		},
		self,
		logisticDispatchingNoteTotalWeightDataService);
	}
})(angular);

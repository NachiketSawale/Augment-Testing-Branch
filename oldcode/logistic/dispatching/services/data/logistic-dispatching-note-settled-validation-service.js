/**
 * Created by baf on 21.09.2021
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingNoteSettledValidationService
	 * @description provides validation methods for logistic dispatching headerRequisition entities
	 */
	angular.module(moduleName).service('logisticDispatchingNoteSettledValidationService', LogisticDispatchingNoteSettledValidationService);

	LogisticDispatchingNoteSettledValidationService.$inject = ['platformValidationServiceFactory', 'logisticDispatchingConstantValues', 'logisticDispatchingNoteSettledDataService'];

	function LogisticDispatchingNoteSettledValidationService(platformValidationServiceFactory, logisticDispatchingConstantValues, logisticDispatchingNoteSettledDataService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticDispatchingConstantValues.schemes.dispatchNoteSettled, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticDispatchingConstantValues.schemes.dispatchNoteSettled)
		},
		self,
			logisticDispatchingNoteSettledDataService);
	}
})(angular);

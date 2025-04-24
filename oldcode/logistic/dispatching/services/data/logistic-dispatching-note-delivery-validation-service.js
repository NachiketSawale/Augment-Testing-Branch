/**
 * Created by henkel on 29/09/2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticNoteDeliveryValidationService
	 * @description provides validation methods for logistic note delivery entities
	 */
	angular.module(moduleName).service('logisticDispatchingNoteDeliveryValidationService', LogisticDispatchingNoteDeliveryValidationService);

	LogisticDispatchingNoteDeliveryValidationService.$inject = ['platformValidationServiceFactory', 'logisticDispatchingConstantValues', 'logisticDispatchingNoteDeliveryDataService'];

	function LogisticDispatchingNoteDeliveryValidationService(platformValidationServiceFactory, logisticDispatchingConstantValues, logisticDispatchingNoteDeliveryDataService) {
		var self = this;
		//
		// platformValidationServiceFactory.addValidationServiceInterface(logisticDispatchingConstantValues.schemes.noteDelivery, {
		// 		mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticDispatchingConstantValues.schemes.noteDelivery)
		// 	},
		// 	self,
		// 	logisticDispatchingNoteDeliveryDataService);
	}
})(angular);

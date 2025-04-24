/**
 * Created by Shankar on 19.07.2023
 */

(function (angular) {
	'use strict';
	const moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc service
	 * @name logisticDispatchingRecordLoadingInfoValidationService
	 * @description provides validation methods for logistic dispatching loading info entities
	 */
	angular.module(moduleName).service('logisticDispatchingRecordLoadingInfoValidationService', LogisticDispatchingRecordLoadingInfoValidationService);

	LogisticDispatchingRecordLoadingInfoValidationService.$inject = ['platformValidationServiceFactory', 'logisticDispatchingConstantValues', 'logisticDispatchingRecordLoadingInfoDataService'];

	function LogisticDispatchingRecordLoadingInfoValidationService(platformValidationServiceFactory, logisticDispatchingConstantValues, logisticDispatchingRecordLoadingInfoDataService) {
		let self = this;

		platformValidationServiceFactory.addValidationServiceInterface(logisticDispatchingConstantValues.schemes.dispatchRecordLoadingInfo, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(logisticDispatchingConstantValues.schemes.dispatchRecordLoadingInfo)
		},
		self,
		logisticDispatchingRecordLoadingInfoDataService);
	}
})(angular);

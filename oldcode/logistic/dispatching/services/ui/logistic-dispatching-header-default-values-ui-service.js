/**
 * Created by nitsche on 17.02.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'logistic.dispatching';

	/**
	 * @ngdoc controller
	 * @name logisticDispatchingHeaderDefaultValuesLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  logistic dispatching headerDefaultValues entity.
	 **/
	angular.module(moduleName).service('logisticDispatchingHeaderDefaultValuesLayoutService', LogisticDispatchingHeaderDefaultValuesLayoutService);

	LogisticDispatchingHeaderDefaultValuesLayoutService.$inject = [
		'platformSchemaService', 'platformUIConfigInitService', 'logisticDispatchingContainerInformationService',
		'logisticDispatchingConstantValues', 'logisticDispatchingTranslationService'];

	function LogisticDispatchingHeaderDefaultValuesLayoutService(
		platformSchemaService, platformUIConfigInitService, logisticDispatchingContainerInformationService,
		logisticDispatchingConstantValues, logisticDispatchingTranslationService
	) {
		let service = {};
		let dtoScheme = platformSchemaService.getSchemaFromCache({
			moduleSubModule: 'Logistic.Dispatching',
			typeName: 'DispatchHeaderDto'
		}).properties;
		service.getFormConfig = function getFormConfig() {
			return platformUIConfigInitService.provideConfigForDetailView(
				logisticDispatchingContainerInformationService.getLogisticDispatchingHeaderDefaultSettingsDialogLayout(),
				dtoScheme,
				logisticDispatchingTranslationService,
				null
			);
		};
		return service;
	}
})(angular);
/**
 * Created by Shankar on 22.01.2025
 */

(function (angular) {
	'use strict';
	let moduleName = 'logistic.action';

	/**
	 * @ngdoc controller
	 * @name logisticActionItemTemplatesLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  Action Item Templates  entity.
	 **/
	angular.module(moduleName).service('logisticActionItemTemplatesLayoutService', LogisticActionItemTemplatesLayoutService);

	LogisticActionItemTemplatesLayoutService.$inject = ['platformUIConfigInitService', 'logisticActionContainerInformationService', 'logisticActionConstantValues', 'logisticActionTranslationService'];

	function LogisticActionItemTemplatesLayoutService(platformUIConfigInitService, logisticActionContainerInformationService, logisticActionConstantValues, logisticActionTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: logisticActionContainerInformationService.getActionItemTemplatesLayout(),
			dtoSchemeId: logisticActionConstantValues.schemes.actionItemTemplates,
			translator: logisticActionTranslationService
		});
	}
})(angular);
/**
 * Created by nitsche on 21.08.2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeMainLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  change main  entity.
	 **/
	angular.module(moduleName).service('changeMainChange2ExternalLayoutService', ChangeMainChange2ExternalLayoutService);

	ChangeMainChange2ExternalLayoutService.$inject = ['platformUIConfigInitService', 'changeMainContainerInformationService', 'changeMainTranslationService', 'changeMainConstantValues'];

	function ChangeMainChange2ExternalLayoutService(platformUIConfigInitService, changeMainContainerInformationService, changeMainTranslationService, changeMainConstantValues) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: changeMainContainerInformationService.getChange2ExternalDefaultLayout(),
			dtoSchemeId: changeMainConstantValues.schemes.chang2Externals,
			translator: changeMainTranslationService
		});
	}
})(angular);
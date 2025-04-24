/**
 * Created by baf on 08.05.2023
 */

(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc controller
	 * @name changeMainReferenceLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  change main reference entity.
	 **/
	angular.module(moduleName).service('changeMainReferenceLayoutService', ChangeMainReferenceLayoutService);

	ChangeMainReferenceLayoutService.$inject = ['platformUIConfigInitService', 'changeMainContainerInformationService', 'changeMainConstantValues', 'changeMainTranslationService'];

	function ChangeMainReferenceLayoutService(platformUIConfigInitService, changeMainContainerInformationService, changeMainConstantValues, changeMainTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: changeMainContainerInformationService.getChangeMainReferenceLayout(),
			dtoSchemeId: changeMainConstantValues.schemes.changeReference,
			translator: changeMainTranslationService
		});
	}
})(angular);
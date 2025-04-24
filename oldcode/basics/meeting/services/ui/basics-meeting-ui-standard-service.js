/**
 * Created by chd on 12/9/2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.meeting';

	/**
	 * @ngdoc service
	 * @name basicsMeetingUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of logistic entities
	 */
	angular.module(moduleName).service('basicsMeetingUIStandardService', BasicsMeetingUIStandardService);

	BasicsMeetingUIStandardService.$inject = ['platformUIConfigInitService', 'basicsMeetingConstantValues',
		'basicsMeetingContainerInformationService', 'basicsMeetingTranslationService'];

	function BasicsMeetingUIStandardService(platformUIConfigInitService, basicsMeetingConstantValues,
		basicsMeetingContainerInformationService, basicsMeetingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsMeetingContainerInformationService.getBasicsMeetingLayout(),
			dtoSchemeId: basicsMeetingConstantValues.schemes.meeting,
			translator: basicsMeetingTranslationService
		});
	}
})(angular);
/**
 * Created by chd on 12/22/2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.meeting';

	/**
	 * @ngdoc service
	 * @name basicsMeetingDocumentUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of document entities
	 */
	angular.module(moduleName).service('basicsMeetingDocumentUIStandardService', BasicsMeetingDocumentUIStandardService);

	BasicsMeetingDocumentUIStandardService.$inject = ['platformUIConfigInitService', 'basicsMeetingConstantValues',
		'basicsMeetingContainerInformationService', 'basicsMeetingTranslationService'];

	function BasicsMeetingDocumentUIStandardService(platformUIConfigInitService, basicsMeetingConstantValues,
		basicsMeetingContainerInformationService, basicsMeetingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsMeetingContainerInformationService.getBasicsMeetingDocumentLayout(),
			dtoSchemeId: basicsMeetingConstantValues.schemes.document,
			translator: basicsMeetingTranslationService
		});
	}
})(angular);
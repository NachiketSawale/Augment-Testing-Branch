/**
 * Created by chd on 12/15/2021.
 */
(function (angular) {
	'use strict';
	let moduleName = 'basics.meeting';

	/**
	 * @ngdoc service
	 * @name BasicsMeetingAttendeeUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of attendee entities
	 */
	angular.module(moduleName).service('basicsMeetingAttendeeUIStandardService', BasicsMeetingAttendeeUIStandardService);

	BasicsMeetingAttendeeUIStandardService.$inject = ['platformUIConfigInitService', 'basicsMeetingConstantValues',
		'basicsMeetingContainerInformationService', 'basicsMeetingTranslationService'];

	function BasicsMeetingAttendeeUIStandardService(platformUIConfigInitService, basicsMeetingConstantValues,
		basicsMeetingContainerInformationService, basicsMeetingTranslationService) {
		platformUIConfigInitService.createUIConfigurationService({
			service: this,
			layout: basicsMeetingContainerInformationService.getBasicsMeetingAttendeeLayout(),
			dtoSchemeId: basicsMeetingConstantValues.schemes.attendee,
			translator: basicsMeetingTranslationService
		});
	}
})(angular);
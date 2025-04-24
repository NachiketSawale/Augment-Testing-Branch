/**
 * Created by baf on 05.09.2014
 */

(function () {
	'use strict';
	var moduleName = 'basics.clerk';

	/**
	 * @ngdoc service
	 * @name basicsClerkAbsenceUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layots for different containers of clerkAbsence entities
	 */
	angular.module(moduleName).factory('basicsClerkAbsenceUIStandardService', ['platformUIStandardConfigService', 'basicsClerkTranslationService', 'basicsClerkAbsenceConfigurationValue','platformSchemaService',

		function (platformUIStandardConfigService, basicsClerkTranslationService, basicsClerkAbsenceConfigurationValue,platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var basicsClerkAbsenceAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ClerkAbsenceDto', moduleSubModule: 'Basics.Clerk'} );
			basicsClerkAbsenceAttributeDomains = basicsClerkAbsenceAttributeDomains.properties;

			function ClerkAbsenceUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			ClerkAbsenceUIStandardService.prototype = Object.create(BaseService.prototype);
			ClerkAbsenceUIStandardService.prototype.constructor = ClerkAbsenceUIStandardService;

			return new BaseService(basicsClerkAbsenceConfigurationValue, basicsClerkAbsenceAttributeDomains, basicsClerkTranslationService);
		}
	]);
})();

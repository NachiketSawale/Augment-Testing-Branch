/**
 * Created by reimer on 11.12.2014.
 */

(function () {

	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name basicsUserformUIStandardService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).factory('basicsUserformUIStandardService', [
		'platformUIStandardConfigService',
		'basicsUserformTranslationService',
		'basicsUserformFormDetailLayout',
		'platformSchemaService',
		function (platformUIStandardConfigService,
			basicsUserformTranslationService,
			basicsUserformFormDetailLayout,
			platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({typeName: 'FormDto', moduleSubModule: 'Basics.UserForm'});

			function UserformUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UserformUIStandardService.prototype = Object.create(BaseService.prototype);
			UserformUIStandardService.prototype.constructor = UserformUIStandardService;

			return new BaseService(basicsUserformFormDetailLayout, domainSchema.properties, basicsUserformTranslationService);

		}
	]);

})();

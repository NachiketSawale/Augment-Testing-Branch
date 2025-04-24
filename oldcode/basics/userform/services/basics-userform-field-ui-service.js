/**
 * Created by reimer on 11.12.2014.
 */

(function () {

	'use strict';

	var moduleName = 'basics.userform';

	/**
	 * @ngdoc service
	 * @name basicsUserformFieldUIService
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).factory('basicsUserformFieldUIService', [
		'platformUIStandardConfigService',
		'basicsUserformTranslationService',
		'basicsUserformFieldLayoutService',
		'platformSchemaService',
		function (platformUIStandardConfigService,
			basicsUserformTranslationService,
			basicsUserformFieldLayoutService,
			platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({typeName: 'FormFieldDto', moduleSubModule: 'Basics.UserForm'});

			function UserformUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UserformUIStandardService.prototype = Object.create(BaseService.prototype);
			UserformUIStandardService.prototype.constructor = UserformUIStandardService;

			return new BaseService(basicsUserformFieldLayoutService.getLayout(), domainSchema.properties, basicsUserformTranslationService);
		}
	]);

})();

/**
 * Created by reimer on 11.12.2014.
 */

(function () {

	'use strict';

	var moduleName = 'basics.dependentdata';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).factory('basicsDependentDataUIStandardService', ['platformUIStandardConfigService', 'basicsDependentDataTranslationService', 'basicsDependentDataDependentDataLayout', 'platformSchemaService',

		function (platformUIStandardConfigService, basicsDependentDataTranslationService, basicsDependentDataDependentDataLayout, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'DependentDataDto', moduleSubModule: 'Basics.DependentData'} );

			function UserformUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UserformUIStandardService.prototype = Object.create(BaseService.prototype);
			UserformUIStandardService.prototype.constructor = UserformUIStandardService;

			return new BaseService(basicsDependentDataDependentDataLayout, domainSchema.properties, basicsDependentDataTranslationService);
		}
	]);

})();

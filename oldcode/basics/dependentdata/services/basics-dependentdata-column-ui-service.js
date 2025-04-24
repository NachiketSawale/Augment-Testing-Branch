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
	angular.module(moduleName).factory('basicsDependentDataColumnUIService', ['platformUIStandardConfigService', 'basicsDependentDataTranslationService', 'basicsDependentDataColumnLayoutService', 'platformSchemaService',

		function (platformUIStandardConfigService, basicsDependentDataTranslationService, basicsDependentDataColumnLayoutService, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var layoutConfig = basicsDependentDataColumnLayoutService.getLayout();
			var domainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'DependentDataColumnDto', moduleSubModule: 'Basics.DependentData'} );

			function UserformUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UserformUIStandardService.prototype = Object.create(BaseService.prototype);
			UserformUIStandardService.prototype.constructor = UserformUIStandardService;

			return new BaseService(layoutConfig, domainSchema.properties, basicsDependentDataTranslationService);
		}
	]);

})();

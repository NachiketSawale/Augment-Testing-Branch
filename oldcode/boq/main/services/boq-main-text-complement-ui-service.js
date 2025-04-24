/**
 * Created by reimer on 07.12.2016
 */

(function () {

	'use strict';

	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name
	 * @function
	 *
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).factory('boqMainTextComplementUIService', [
		'platformUIStandardConfigService',
		'boqMainTranslationService',
		'boqMainTextComplementConfigService',
		'platformSchemaService',
		function (platformUIStandardConfigService,
			translationService,
			layoutService,
			platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({typeName: 'BoqTextComplementDto', moduleSubModule: 'Boq.Main'});

			function UserformUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UserformUIStandardService.prototype = Object.create(BaseService.prototype);
			UserformUIStandardService.prototype.constructor = UserformUIStandardService;

			return new BaseService(layoutService.getLayout(), domainSchema.properties, translationService);
		}
	]);

})();

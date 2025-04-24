(function config() {
	'use strict';
	var moduleName = 'basics.assetmaster';

	/**
	 * @ngdoc service
	 * @name basicsAssetMasterStandardConfigurationService
	 * @function
	 *
	 * @description
	 * asset master standard configuration
	 */
	angular.module(moduleName).factory('basicsAssetMasterStandardConfigurationService', ['platformUIStandardConfigService', 'basicsAssetMasterTranslationService', 'basicsAssetMasterUIConfigurationService', 'platformSchemaService',

		function basicsAssetMasterStandardConfigurationService(platformUIStandardConfigService, basicsAssetMasterTranslationService, basicsAssetMasterUIConfigurationService, platformSchemaService) {

			var BaseService = platformUIStandardConfigService;

			var assetMasterAttributeDomains = platformSchemaService.getSchemaFromCache({
				typeName: 'AssetMasterDto',
				moduleSubModule: 'Basics.AssetMaster'
			});
			if (assetMasterAttributeDomains) {
				assetMasterAttributeDomains = assetMasterAttributeDomains.properties;
			}

			function AssetMasterUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			AssetMasterUIStandardService.prototype = Object.create(BaseService.prototype);
			AssetMasterUIStandardService.prototype.constructor = AssetMasterUIStandardService;


			return new BaseService(basicsAssetMasterUIConfigurationService, assetMasterAttributeDomains, basicsAssetMasterTranslationService);
		}
	]);
})();

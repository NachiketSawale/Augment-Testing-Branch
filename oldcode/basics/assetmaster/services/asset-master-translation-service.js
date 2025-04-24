(function config(angular) {
	'use strict';

	var moduleName = 'basics.assetmaster';
	angular.module(moduleName).factory('basicsAssetMasterTranslationService', ['platformUIBaseTranslationService', 'basicsAssetMasterUIConfigurationService',
		function basicsAssetMasterTranslationService(PlatformUIBaseTranslationService, assetMasterLayout) {

			function AssetMasterTranslationService(layout) {
				PlatformUIBaseTranslationService.call(this, layout);
			}

			AssetMasterTranslationService.prototype = Object.create(PlatformUIBaseTranslationService.prototype);
			AssetMasterTranslationService.prototype.constructor = AssetMasterTranslationService;

			return new AssetMasterTranslationService([assetMasterLayout]);
		}
	]);
})(angular);
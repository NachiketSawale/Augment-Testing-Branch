/**
 * Created by baf on 29.12.2016.
 */
(function config(angular) {
	'use strict';
	var assetMasterModule = angular.module('basics.assetmaster');

	/**
	 * @ngdoc service
	 * @name changeMainAffectedByChangeContainerService
	 * @function
	 *
	 * @description
	 *
	 */
	assetMasterModule.service('basicsAssetMasterBelongsToContainerService', BasicsAssetMasterBelongsToContainerService);

	BasicsAssetMasterBelongsToContainerService.$inject = ['_', '$injector', 'platformModuleInitialConfigurationService', 'basicsAssetMasterBelongsToLayoutServiceFactory'];

	function BasicsAssetMasterBelongsToContainerService(_, $injector, platformModuleInitialConfigurationService, basicsAssetMasterBelongsToLayoutServiceFactory) {
		this.prepareGridConfig = function prepareGridConfig(containerUid, scope, changeMainCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Basics.AssetMaster');

			var config = basicsAssetMasterBelongsToLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			changeMainCIS.takeDynamic(containerUid, config);
		};

		this.prepareDetailConfig = function prepareDetailConfig(containerUid, scope, changeMainCIS) {
			var modConf = platformModuleInitialConfigurationService.get('Basics.AssetMaster');

			var config = basicsAssetMasterBelongsToLayoutServiceFactory.prepareConfig(containerUid, scope, modConf);
			changeMainCIS.takeDynamic(containerUid, config);
		};
	}
})(angular);
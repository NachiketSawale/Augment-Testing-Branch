/**
 * Created by Joshi on 26.02.2015.
 */
(function config(angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basicsAssetMasterLookupDataService
	 * @function
	 *
	 * @description
	 * basicsAssetMasterLookupDataService is the data service for all Asset Master related functionality.
	 */
	var moduleName = 'basics.assetmaster';
	angular.module(moduleName).factory('basicsAssetMasterLookupDataService', ['globals', 'platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', function basicsAssetMasterLookupDataService(globals, platformLookupDataServiceFactory, ServiceDataProcessArraysExtension) {

		var assetMasterLookupDataServiceConfig = {
			httpRead: {route: globals.webApiBaseUrl + 'basics/assetmaster/', endPointRead: 'lookuptree'},
			dataProcessor: [new ServiceDataProcessArraysExtension(['AssetMasterChildren'])],
			tree: {parentProp: 'AssetMasterParentFk', childProp: 'AssetMasterChildren'}
		};

		return platformLookupDataServiceFactory.createInstance(assetMasterLookupDataServiceConfig).service;
	}]);
})(angular);

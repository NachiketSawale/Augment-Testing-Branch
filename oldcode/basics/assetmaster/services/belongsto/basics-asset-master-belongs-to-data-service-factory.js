/**
 * Created by baf on 29.12.2016.
 */

(function config(angular) {
	'use strict';

	var moduleName = 'basics.assetmaster';

	/**
	 * @ngdoc service
	 * @name basicsAssetMasterBelongsToDataServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('basicsAssetMasterBelongsToDataServiceFactory', BasicsAssetMasterBelongsToDataServiceFactory);

	BasicsAssetMasterBelongsToDataServiceFactory.$inject = ['_', 'globals', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'basicsAssetMasterService','platformRuntimeDataService'];

	function BasicsAssetMasterBelongsToDataServiceFactory(_, globals, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, basicsAssetMasterService, platformRuntimeDataService) {
		var instances = {};

		var self = this;
		this.createDataService = function createDataService(templInfo) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName(templInfo) {
			return 'basicsAssetMaster' + self.getNameInfix(templInfo) + 'BelongsToAssetDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo) {
			var basicsAssetMasterBelongsToDataServiceOption = {
				flatLeafItem: {
					module: angular.module('basics.assetmaster'),
					serviceName: dsName,
					entityNameTranslationID: 'basics.assetmaster.belongsTo',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'toAsset',
						initReadData: function (readData) {
							readData.filter = '?assetId=' + basicsAssetMasterService.getSelected().Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: templInfo.dto,
						moduleSubModule: templInfo.assembly
					}),{processItem: processItem}],
					presenter: {list: {}},
					actions: {delete: false, create: false},
					entityRole: {
						leaf: {
							itemName: 'BelongsToAsset' + self.getNameInfix(templInfo),
							parentService: basicsAssetMasterService
						}
					}
				}
			};

			function processItem(item) {
				platformRuntimeDataService.readonly(item, true);
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsAssetMasterBelongsToDataServiceOption);

			return serviceContainer.service;
		};
	}
})(angular);

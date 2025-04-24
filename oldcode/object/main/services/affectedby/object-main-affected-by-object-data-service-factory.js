/**
 * Created by baf on 29.12.2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'object.main';

	/**
	 * @ngdoc service
	 * @name objectMainAffectedByObjectDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('objectMainAffectedByObjectDataServiceFactory', ObjectMainAffectedByObjectDataServiceFactory);

	ObjectMainAffectedByObjectDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'objectMainUnitService', 'basicsLookupDataRichLineItemProcessor'];

	function ObjectMainAffectedByObjectDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, objectMainUnitService, basicsLookupDataRichLineItemProcessor) {
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
			return 'objectMain' + self.getNameInfix(templInfo) + 'AffectedByObjectDataService';
		};

		this.takeNewItem = function takeNewItem(item, dto) {
			var dsName = 'objectMain' + dto + 'AffectedByObjectDataService';
			var service = null;
			if (dsName in instances) {
				service = instances[dsName];
			}
			//1. Gibt es den Bid datenservice
			//var service = null;
			//2. Wenn Ja dann diesem datenservice die bid übergeben
			if (service !== null) {
				service.takeNewInstance(item);
			}
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo) {
			var changeMainAffectedByChangeServiceOption = {
				flatLeafItem: {
					module: angular.module('object.main'),
					serviceName: dsName,
					entityNameTranslationID: 'object.main.affectedby',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'toobject',
						initReadData: function (readData) {
							readData.filter = '?objectUnitId=' + objectMainUnitService.getSelected().Id;
						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: templInfo.dto,
						moduleSubModule: templInfo.assembly
					}), basicsLookupDataRichLineItemProcessor],
					presenter: {list: {}},
					actions: {delete: false, create: false},
					entityRole: {
						leaf: {
							itemName: 'AffectedByObject' + self.getNameInfix(templInfo),
							parentService: objectMainUnitService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(changeMainAffectedByChangeServiceOption);
			serviceContainer.service.takeNewInstance = function (instance) {
				serviceContainer.data.itemList.push(instance);
				serviceContainer.data.listLoaded.fire();
			};

			return serviceContainer.service;
		};
	}
})(angular);

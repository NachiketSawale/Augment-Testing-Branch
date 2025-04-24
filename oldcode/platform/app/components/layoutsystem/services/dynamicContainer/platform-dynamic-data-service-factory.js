/**
 * Created by baf on 2019/01/31.
 */

(function (angular) {
	'use strict';

	var platformModule = angular.module('platform');

	/**
	 * @ngdoc service
	 * @name projectMainForProjectExecutionDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	platformModule.service('platformDynamicDataServiceFactory', PlatformDynamicDataServiceFactory);

	PlatformDynamicDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension'];

	function PlatformDynamicDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {
		var self = this;

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName(templInfo, moduleInfo) {
			return _.camelCase(moduleInfo.name) + self.getNameInfix(templInfo) + moduleInfo.postFix;
		};

		this.getProcessor = function getProcessor(templInfo, moduleInfo) {
			var processors = moduleInfo.processors || [];

			processors.push(platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: templInfo.dto,
				moduleSubModule: templInfo.assembly
			}));

			return processors;
		};

		this.createDataService = function createDataService(templInfo, moduleInfo) {
			var projectMainAffectedByProjectServiceOption = {
				flatLeafItem: {
					module: moduleInfo.instance,
					serviceName: self.getDataServiceName(templInfo, moduleInfo),
					entityNameTranslationID: moduleInfo.translationKey,
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: moduleInfo.readEndPoint,
						initReadData: function (readData) {
							let selelctedChange = moduleInfo.parentService.getSelected();
							let relatedId = !_.isNil(moduleInfo.parentSRelationProb) ? selelctedChange[moduleInfo.parentSRelationProb] : selelctedChange.Id;
							readData.filter = '?' + moduleInfo.filterName + '=' + relatedId;
						}
					},
					dataProcessor: self.getProcessor(templInfo, moduleInfo),
					presenter: {list: {}},
					actions: {delete: false, create: false},
					entityRole: {
						leaf: {
							itemName: moduleInfo.itemName,
							parentService: moduleInfo.parentService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(projectMainAffectedByProjectServiceOption);

			return serviceContainer.service;
		};
	}

})(angular);

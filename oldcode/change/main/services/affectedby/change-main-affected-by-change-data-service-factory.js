/**
 * Created by baf on 29.12.2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeMainAffectedByChangeDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('changeMainAffectedByChangeDataServiceFactory', ChangeMainAffectedByChangeDataServiceFactory);

	ChangeMainAffectedByChangeDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		'changeMainService', 'basicsLookupDataRichLineItemProcessor', 'changeMainAffectedByChangeStatusProcessor'];

	function ChangeMainAffectedByChangeDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension,
	                                                      changeMainService, basicsLookupDataRichLineItemProcessor, changeMainAffectedByChangeStatusProcessor) {
		var instances = {};

		var self = this;
		this.createDataService = function createDataService(templInfo, readOnly) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo, readOnly);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName(templInfo) {
			return 'changeMain' + self.getNameInfix(templInfo) + 'AffectedByChangeDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo/*, readOnly*/) {
			var changeMainAffectedByChangeServiceOption = {
				flatLeafItem: {
					module: angular.module('change.main'),
					serviceName: dsName,
					entityNameTranslationID: 'change.main.affectedby',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'tochange',
						initReadData: function (readData) {
							var selectedChange = changeMainService.getSelected();
							readData.filter = '?changeId=' + selectedChange.Id + '&projectId=' + selectedChange.ProjectFk;						}
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: templInfo.dto,
						moduleSubModule: templInfo.assembly
					}), basicsLookupDataRichLineItemProcessor, changeMainAffectedByChangeStatusProcessor],
					presenter: {list: {}},
					actions: {delete: false, create: false},
					entityRole: {
						leaf: {
							itemName: 'AffectedByChange' + self.getNameInfix(templInfo),
							parentService: changeMainService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(changeMainAffectedByChangeServiceOption);

			return serviceContainer.service;
		};
	}

})(angular);

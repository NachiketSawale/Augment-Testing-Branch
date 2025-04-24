/**
 * Created by nit on 21.12.2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainForProjectExecutionDataServiceFactory
	 * @description provides validation methods for all kind of change entities
	 */
	angular.module(moduleName).service('projectMainForProjectExecutionDataServiceFactory', ProjectMainForProjectExecutionDataServiceFactory);

	ProjectMainForProjectExecutionDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'projectMainService', 'basicsLookupDataRichLineItemProcessor'];

	function ProjectMainForProjectExecutionDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, projectMainService, basicsLookupDataRichLineItemProcessor) {
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
			return 'projectMain' + self.getNameInfix(templInfo) + 'ForProjectExecutionDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo, readOnly) {
			var projectMainAffectedByProjectServiceOption = {
				flatLeafItem: {
					module: angular.module('project.main'),
					serviceName: dsName,
					entityNameTranslationID: 'project.main.forProjectExecution',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'ownedByProject',
						initReadData: function (readData) {
							var selelctedChange = projectMainService.getSelected();
							readData.filter = '?projectFk=' + selelctedChange.Id;
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
							itemName: 'ForProjectExecution' + self.getNameInfix(templInfo),
							parentService: projectMainService
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(projectMainAffectedByProjectServiceOption);

			return serviceContainer.service;
		};
	}

})(angular);

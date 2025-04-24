/**
 * Created by baf on 29.12.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	var moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainRequiredByActivityDataServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('schedulingMainRequiredByActivityDataServiceFactory', SchedulingMainRequiredByActivityDataServiceFactory);

	SchedulingMainRequiredByActivityDataServiceFactory.$inject = ['_', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension', 'schedulingMainService', 'platformRuntimeDataService'];

	function SchedulingMainRequiredByActivityDataServiceFactory(_, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension, schedulingMainService, platformRuntimeDataService) {
		var instances = {};

		var self = this;
		this.createDataService = function createDataService(templInfo) {
			var dsName = self.getDataServiceName();

			var srv = instances[dsName];
			if(_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName() {
			return 'resourceRequisitionRequiredByActivityDataService';
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo) {
			var schedulingMainRequiredByActivityDataServiceOption = {
				flatLeafItem: {
					module: angular.module('resource.requisition'),
					serviceName: dsName,
					entityNameTranslationID: 'resource.requisition.entityRequisition',
					httpRead: {
						route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'requiredby', usePostForRead: true,
						initReadData: function (readData) {
							readData.Id = 1;
							readData.PKey1 = schedulingMainService.getSelected().Id;
						}
					},
					httpCreate: {
						route: globals.webApiBaseUrl + templInfo.http + '/'
					},
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: templInfo.dto,
						moduleSubModule: templInfo.assembly
					}), {
						processItem: function (item) {
							platformRuntimeDataService.readonly(item, [{field: 'ActivityFk', readonly: true},
								{field: 'ProjectFk', readonly: true}]);
						}
					}],
					presenter: { list: {
						handleCreateSucceeded: function handleCreateSucceeded(newData) {
							var selected = schedulingMainService.getSelected();
							if(selected){
								newData.ActivityFk = selected.Id;
								newData.ProjectFk = selected.ProjectFk;
								newData.ScheduleFk = selected.ScheduleFk;
							}
							return newData;
						}
					} },
					actions: {delete: true, create: 'flat' },
					entityRole: {
						leaf: {
							itemName: 'RequiredBy' + self.getNameInfix(templInfo),
							parentService: schedulingMainService } }
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainRequiredByActivityDataServiceOption);

			return serviceContainer.service;
		};
	}
})(angular);

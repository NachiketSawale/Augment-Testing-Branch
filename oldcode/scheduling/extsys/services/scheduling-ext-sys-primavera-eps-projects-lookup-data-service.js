/**
 * Created by csalopek on 13.03.2018.
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'scheduling.extsys';
	var schedulingExtSysModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name schedulingExtSysPrimaveraEpsProjectsLookupDataService
	 * @function
	 *
	 * @description
	 * schedulingExtSysPrimaveraEpsProjectsLookupDataService is the data service for primavera EPS/Projects lookup in scheduling extsys
	 */
	schedulingExtSysModule.factory('schedulingExtSysPrimaveraEpsProjectsLookupDataService',
		['$q', 'platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator', 'schedulingExtSysPrimaveraImageProcessor',
			function ($q, platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator, schedulingExtSysPrimaveraImageProcessor) {
				var service = {},
					readData = {PKey1: null, PKey2: null};

				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingExtSysPrimaveraEpsProjectsLookupDataService', {
					valMember: 'ObjectId',
					dispMember: 'Name',
					showIcon: false,
					columns: [
						{
							id: 'idField',
							field: 'Id',
							name: 'Id',
							formatter: 'comment',
							width: 100,
							name$tr$: 'cloud.common.entityId'
						},
						{
							id: 'nameField',
							field: 'Name',
							name: 'Name',
							formatter: 'comment',
							width: 175,
							name$tr$: 'cloud.common.entityName'
						}
					],
					uuid: '437977a6f1a64ab2bb306790247d7226'
				});

				var schedulingExtSysServiceOptions = {
					httpRead: {
						route: globals.webApiBaseUrl + 'scheduling/extsys/primavera/import/',
						endPointRead: 'epsprojectstree'
					},
					filterParam: readData,
					prepareFilter: function prepareFilter(item) {
						readData.PKey1 = item.configurationId;
						readData.PKey2 = item.databaseId;
						return readData;
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['EpsItems']), schedulingExtSysPrimaveraImageProcessor],
					tree: {parentProp: 'ParentObjectId', childProp: 'EpsItems'},
					selectableCallback: function (dataItem) {
						var isSelectable = false;
						if (dataItem.Type !== 1) {
							isSelectable = true;
						}
						return isSelectable;
					}
				};

				service = platformLookupDataServiceFactory.createInstance(schedulingExtSysServiceOptions).service;

				return service;
			}]);
})();

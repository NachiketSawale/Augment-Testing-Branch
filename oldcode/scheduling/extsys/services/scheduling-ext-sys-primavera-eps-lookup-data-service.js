/**
 * Created by csalopek on 20.12.2017.
 */

(function () {
	/* global globals */
	'use strict';
	var moduleName = 'scheduling.extsys';
	var schedulingExtSysModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name schedulingExtSysPrimaveraEpsLookupDataService
	 * @function
	 *
	 * @description
	 * schedulingExtSysPrimaveraEpsLookupDataService is the data service for primavera EPS lookup in scheduling extsys
	 */
	schedulingExtSysModule.factory('schedulingExtSysPrimaveraEpsLookupDataService',
		['$q', 'platformLookupDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataConfigGenerator', 'schedulingExtSysPrimaveraImageProcessor',
			function ($q, platformLookupDataServiceFactory, ServiceDataProcessArraysExtension, basicsLookupdataConfigGenerator, schedulingExtSysPrimaveraImageProcessor) {
				var service = {},
					readData = {PKey1: null, PKey2: null};

				basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingExtSysPrimaveraEpsLookupDataService', {
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
					uuid: 'a5d029b8a9f44bdc95d5d0bbb2c5d403'
				});

				var schedulingExtSysServiceOptions = {
					httpRead: {
						route: globals.webApiBaseUrl + 'scheduling/extsys/primavera/export/',
						endPointRead: 'epstree'
					},
					filterParam: readData,
					prepareFilter: function prepareFilter(item) {
						readData.PKey1 = item.configurationId;
						readData.PKey2 = item.databaseId;
						return readData;
					},
					dataProcessor: [new ServiceDataProcessArraysExtension(['EpsItems']), schedulingExtSysPrimaveraImageProcessor],
					tree: {parentProp: 'ParentObjectId', childProp: 'EpsItems'}
				};

				service = platformLookupDataServiceFactory.createInstance(schedulingExtSysServiceOptions).service;

				return service;
			}]);
})();

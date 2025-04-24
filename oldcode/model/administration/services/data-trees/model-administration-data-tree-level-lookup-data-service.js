/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelAdministrationDataTreeLevelLookupDataService
	 * @function
	 *
	 * @description
	 * A data service for a lookup of data tree levels.
	 */
	angular.module('basics.lookupdata').factory('modelAdministrationDataTreeLevelLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec(
				'modelAdministrationDataTreeLevelLookupDataService', {
					valMember: 'Id',
					dispMember: 'LevelIndex',
					columns: [
						{
							id: 'index',
							field: 'LevelIndex',
							name: 'Index',
							formatter: 'integer',
							width: 120,
							name$tr$: 'model.administration.levelIndex'
						},
						{
							id: 'PropName',
							field: 'PropertyKeyEntity.PropertyName',
							name: 'Property Name',
							formatter: 'description',
							width: 150,
							name$tr$: 'model.administration.levelPropertyKeyName'
						}
					],
					uuid: 'c2a9d5d021e44cb3bfc6051495f42d04'
				});

			var lookupDataSvcConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'model/administration/datatreelevel/',
					endPointRead: 'listenriched'
				},
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataSvcConfig).service;
		}]);
})(angular);

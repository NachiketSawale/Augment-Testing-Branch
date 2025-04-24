/**
 * Created by Roberson Luo on 15.03.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelMainObjectLookupDataService
	 * @function
	 * @description
	 *
	 * data service for model main object lookup.
	 */
	angular.module('basics.lookupdata').factory('modelMainObjectLookupDataService', [
		'platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelMainObjectLookupDataService', {
				valMember: 'Id',
				dispMember: 'Description',
				columns: [
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'meshid',
						field: 'MeshId',
						name: 'MeshId',
						width:100,
						toolTip: 'MeshId',
						formatter: 'integer',
						name$tr$: 'model.main.objectMeshId'
					},
					{
						id: 'cpiid',
						field: 'CpiId',
						name: 'CpiId',
						width:100,
						toolTip: 'CpiId',
						formatter: 'description',
						name$tr$: 'model.main.objectCpiId'
					},
					{
						id: 'cadidint',
						field: 'CadIdInt',
						name: 'CadIdInt',
						width:100,
						toolTip: 'CadIdInt',
						formatter: 'description',
						name$tr$: 'model.main.objectCadIdInt'
					}
				],
				uuid: 'cc00b1c960bc419bb9d91852ca9eb0d7'
			});

			var lookupDataServiceConfig = {
				httpRead: {route: globals.webApiBaseUrl + 'model/main/object/', endPointRead: 'list'},
				filterParam: 'mainItemID'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})(angular);

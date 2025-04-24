/*
 * $Id: model-project-versioned-model-lookup-data-service.js 624440 2021-02-22 11:56:25Z haagf $
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	
	/**
	 * @ngdoc service
	 * @name modelProjectVersionedModelLookupDataService
	 * @function
	 *
	 * @description
	 * modelProjectVersionedModelLookupDataServiceConfig is the data service for models with extended properties of model revision and model revision
	 */
	angular.module('basics.lookupdata').factory('modelProjectVersionedModelLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelProjectVersionedModelLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						width: 100,
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						width: 150,
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'modelversion',
						field: 'ModelVersion',
						name: 'Version',
						formatter: 'integer',
						width: 300,
						name$tr$: 'model.project.modelVersion'
					},
					{
						id: 'modelrevision',
						field: 'ModelRevision',
						name: 'Revision',
						formatter: 'description',
						width: 300,
						name$tr$: 'model.project.modelRevision'
					}
				
				],
				uuid: '7dc75d8975f94b92b1ad3f9c69036310'
			});
			
			var modelProjectVersionedModelLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/project/model/', endPointRead: 'list' },
				filterParam: 'mainItemId'
			};
			
			return platformLookupDataServiceFactory.createInstance(modelProjectVersionedModelLookupDataServiceConfig).service;
		}]);
})(angular);

/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name modelProjectAllVersionedModelLookupDataService
	 * @function
	 *
	 * @description
	 * modelProjectAllVersionedModelLookupDataServiceConfig is the data service for models with extended properties of model revision and model revision
	 */
	angular.module('basics.lookupdata').factory('modelProjectAllVersionedModelLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('modelProjectAllVersionedModelLookupDataService', {
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

			const modelProjectAllVersionedModelLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'model/project/model/', endPointRead: 'listVersions' },
				filterParam: 'mainItemId'
			};

			return platformLookupDataServiceFactory.createInstance(modelProjectAllVersionedModelLookupDataServiceConfig).service;
		}]);
})(angular);

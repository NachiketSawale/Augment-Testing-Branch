/**
 * Created by Frank on 25.03.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name projectChangeLookupDataService
	 * @function
	 *
	 * @description
	 * projectChangeLookupDataService is the data service for all project change look ups
	 */
	angular.module('scheduling.lookup').factory('schedulingActivityTemplateLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingActivityTemplateLookupDataService', {
				valMember: 'Id',
				dispMember: 'Code',
				columns: [
					{
						id: 'Code',
						field: 'Code',
						name: 'Code',
						formatter: 'code',
						name$tr$: 'cloud.common.entityCode'
					},
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: '44d331af6ada4474bc0b9ece214851fa'
			});

			var schedulingActivityTemplateLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/template/activitytemplate/', endPointRead: 'listall' }
				// filterParam: 'mainItemId'
			};

			var container = platformLookupDataServiceFactory.createInstance(schedulingActivityTemplateLookupDataServiceConfig);
			
			// container.data.filter = '';
			
			return container.service;
		}]);
})(angular);

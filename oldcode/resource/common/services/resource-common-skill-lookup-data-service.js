/**
 * Created by baf on 2018/10/04.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceCommonSkillLookupDataService
	 * @function
	 *
	 * @description
	 * resourceCommonSkillLookupDataService is a data service based lookup for resource skills
	 */
	angular.module('resource.common').factory('resourceCommonSkillLookupDataService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('resourceCommonSkillLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						width: 300,
						name$tr$: 'cloud.common.entityDescription'
					}
				],
				uuid: 'f4341c6fa21b412587468fd0c14ca8ab'
			});

			var resourceCommonSkillLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'resource/skill/', endPointRead: 'byrestype' },
				filterParam: 'parentResTypeId',
				prepareFilter: function (resTypeFk) {
					return '?parentResTypeId=' + resTypeFk;
				}
			};

			return platformLookupDataServiceFactory.createInstance(resourceCommonSkillLookupDataServiceConfig).service;
		}]);
})(angular);

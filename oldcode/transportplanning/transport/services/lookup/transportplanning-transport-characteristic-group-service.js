/**
 * Created by zov on 21/11/2018.
 */
(function (angular) {
	'use strict';
	/* global globals, angular */
	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('trsTransportCharacteristicGrpLookupDataService', [
		'basicsLookupdataConfigGenerator',
		'platformLookupDataServiceFactory',
		function (basicsLookupdataConfigGenerator,
				  platformLookupDataServiceFactory) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('trsTransportCharacteristicGrpLookupDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				uuid: 'cd89459653ae4ed8a1ba52931edf9f4d',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			});

			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'basics/characteristic/group/',
					endPointRead: 'treebysection?sectionId=41' //41 means logistic.dispatching
				},
				tree: {
					childProp: 'Groups',
					initialState: 'expanded',
				},
				dataProcessor: [{
					processItem: function (item) {
						item.image = 'control-icons ico-criterion-at';
						if(item.Groups instanceof Array && item.Groups.length > 0){
							item.image = 'control-icons ico-criterion-at-fo';
						}
					}
				}]
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;

		}
	]);
})(angular);
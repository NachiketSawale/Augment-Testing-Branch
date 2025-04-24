/**
 * Created by zov on 17/06/2019.
 */
(function (){
	'use strict';
	/*global angular*/
	var moduleName = 'productionplanning.common';
	angular.module(moduleName).factory('ppsCommentsLookupDataService', [
		'basicsLookupdataConfigGenerator',
		'platformLookupDataServiceFactory',
		function (basicsLookupdataConfigGenerator,
				  platformLookupDataServiceFactory) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('ppsCommentsLookupDataService', {
				valMember: 'Description',
				dispMember: 'DescriptionInfo.Translated',
				uuid: '4f55ddda24b446bfa8ef3e0f6e9451d5',
				columns: [
					{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						displayMember: 'DescriptionInfo.Translated',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}
				]
			});

			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/common/comment/',
					endPointRead: 'getByProperties'
				},
				/* prepareFilter and filterParam is used to set filter on web request*/
				prepareFilter: function (filter) { // filter is entity modified
					if (filter) {
						return {
							modifiedProperties: filter.modifiedProperties,
							dtoName: filter.dtoName
						};
					} else {
						return filter;
					}
				},
				filterParam: true,

				modifyLoadedData: function (commentList) {
					if(commentList){
						// add property Description to set as valueMember
						commentList.forEach(function (comment) {
							comment.Description = comment.DescriptionInfo.Translated;
						});
					}
				}
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}
	]);
})();
(function (angular) {
	'use strict';
	/* global globals */
	/**
	 * @ngdoc service
	 * @name schedulingLookupEventDataService
	 * @function
	 *
	 * @description
	 * schedulingLookupEventDataService is the data service for calendar look ups
	 */
	angular.module('scheduling.template').factory('schedulingTemplateLookupEventDataService', ['platformLookupDataServiceFactory','basicsLookupdataConfigGenerator',

		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {

			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('schedulingTemplateLookupEventDataService', {
				valMember: 'Id',
				dispMember: 'DescriptionInfo.Translated',
				columns: [
					{
						id: 'DescriptionInfo',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					},
					{
						id: 'EventTypeFk',
						field: 'EventTypeFk',
						name: 'Event Type',
						formatter: 'lookup',
						formatterOptions: {
							lookupSimpleLookup: true,
							lookupModuleQualifier: 'basics.customize.eventtype',
							displayMember: 'Description',
							valueMember: 'Id',
						},
						name$tr$: 'scheduling.template.eventType'
					}
				],
				uuid: '853b859b175a493084c67aedbbbba9a1'
			});

			var schedulingEventLookupDataServiceConfig = {
				lookupType: 'schedulingTemplateLookupEventDataService',
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/template/eventtemplate/', endPointRead: 'list'},
				filterParam: 'mainItemId',
				selectableCallback: function select(dataItem, entity){
					return dataItem.Id !== entity.Id;
				}
			};

			return platformLookupDataServiceFactory.createInstance(schedulingEventLookupDataServiceConfig).service;
		}]);
})(angular);

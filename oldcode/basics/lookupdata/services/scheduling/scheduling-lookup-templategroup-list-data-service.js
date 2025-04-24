/**
 * Created by leo on 22.06.2015.
 */
(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name scheduling-lookup-templategroup-data-service.js
	 * @function
	 *
	 * @description
	 * scheduling-lookup-templategroup-data-service.js is the data service for all project cost-group1 look ups
	 */
	angular.module('basics.lookupdata').factory('schedulingTemplateGroupListLookupDataService', ['platformLookupDataServiceFactory',

		function (platformLookupDataServiceFactory) {

			var schedulingTemplateGroupLookupDataServiceConfig = {
				httpRead: { route: globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/', endPointRead: 'list' },
				uuid: 'ba1b5070e2914046aac80c9dba448e8c'
			};

			return platformLookupDataServiceFactory.createInstance(schedulingTemplateGroupLookupDataServiceConfig).service;
		}]);
})(angular);
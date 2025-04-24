/**
 * Created by leo on 13.04.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainTemplateGroupService
	 * @function
	 *
	 * @description
	 * schedulingMainTemplateGroupService is the data service for all activitytemplategroups .
	 */
	angular.module('scheduling.lookup').factory('schedulingLookupTemplateGroupService', ['platformDataServiceFactory',

		function (platformDataServiceFactory) {

			var schedulingMainTemplateGroupServiceOption = {
				hierarchicalRootItem: {
					serviceName: 'schedulingLookupTemplateGroupService',
					httpRead: { route: globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/', endRead: 'tree' },
					actions: {},
					presenter: {
						tree: {
							parentProp: 'ActivityTemplateGroupFk', childProp: 'ActivityTemplateGroups'
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainTemplateGroupServiceOption);
			var service = serviceContainer.service;
			service.setFilter('startId=0');
			service.load();

			return service;
		}
	]);
})(angular);
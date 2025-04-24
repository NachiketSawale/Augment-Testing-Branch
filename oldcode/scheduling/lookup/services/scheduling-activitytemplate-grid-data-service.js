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
	angular.module('scheduling.lookup').factory('schedulingLookupActivityTemplateService', ['$http', '$q', 'platformDataServiceFactory',

		function ($http, $q, platformDataServiceFactory) {

			var schedulingMainTemplateGroupServiceOption = {
				flatRootItem: {
					serviceName: 'schedulingLookupActivityTemplateService',
					httpRead: { route: globals.webApiBaseUrl + 'scheduling/template/activitytemplate/', endRead: 'list' },
					actions: {},
					presenter: { list: {}}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainTemplateGroupServiceOption);
			var service = serviceContainer.service;

			service.getAllActivityTemplates = function(){
				var result = $q.defer();
				$http.get(globals.webApiBaseUrl + 'scheduling/template/activitytemplate/listall').then(function (response) {
					result.resolve(response.data);
				}, function (error) {
					console.log('fail to load data for lookup type: activitytemplatefk ' + globals.webApiBaseUrl + 'scheduling/template/activitytemplate/listall');
					result.reject(error);
					result = null;
				});
				return result.promise;
			};

			return service;
		}
	]);
})(angular);
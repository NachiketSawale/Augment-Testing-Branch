/**
 * Created by leo on 17.11.2014.
 */
(function () {
	/* global globals */
	'use strict';
	var templateModule = angular.module('scheduling.template');

	/**
	 * @ngdoc service
	 * @name schedulingTemplateMainService
	 * @function
	 *
	 * @description
	 * schedulingTemplateMainService is the data service for all template related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	templateModule.factory('schedulingTemplateGrpMainService', ['platformDataServiceFactory','platformPermissionService', 'schedulingLookupService', 'basicsLookupdataLookupDescriptorService',
		function (platformDataServiceFactory, platformPermissionService, schedulingLookupService, basicsLookupdataLookupDescriptorService) {

			// The instance of the main service - to be filled with functionality below

			// The instance of the main service - to be filled with functionality below
			var templateServiceInfo = {
				module: templateModule,
				serviceName: 'schedulingTemplateGrpMainService',
				entityNameTranslationID: 'scheduling.template.translationDescActivitiesGroup',
				httpRead: {route: globals.webApiBaseUrl + 'scheduling/template/activitytemplategroup/', endRead: 'filtered', usePostForRead: true},
				presenter: {
					tree: {
						parentProp: 'ActivityTemplateGroupFk', childProp: 'ActivityTemplateGroups'
					}
				},
				actions: {},
				entitySelection: {}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(templateServiceInfo);
			var service = serviceContainer.service;
			service.loadNew = false;
			// service.setFilter('startId=0');
			if (platformPermissionService.hasRead('afecde4a08404395855258b70652d04c')) {
				service.load();
			}
			function setActivityGroupTemplateFk() {
				basicsLookupdataLookupDescriptorService.updateData('activitytemplategroupfk', serviceContainer.service.getList());
			}

			service.registerListLoaded(setActivityGroupTemplateFk);
			service.setLoadedNew = function () {
				service.loadNew = true;
			};
			return service;

		}]);
})();

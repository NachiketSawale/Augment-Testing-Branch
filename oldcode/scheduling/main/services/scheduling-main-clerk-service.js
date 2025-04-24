/**
 * Created by baf on 02.10.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainClerkService
	 * @function
	 *
	 * @description
	 * schedulingMainClerkService is the data service for all activityRelationship related functionality.
	 */
	schedulingMainModule.factory('schedulingMainClerkService', ['schedulingMainService', 'platformDataServiceFactory',

		function (schedulingMainService, platformDataServiceFactory) {

			var schedulingMainClerkServiceOption = {
				flatLeafItem: {
					module: schedulingMainModule,
					serviceName: 'schedulingMainClerkService',
					entityNameTranslationID: 'basics.clerk.entityClerk',
					httpCreate: { route: globals.webApiBaseUrl + 'scheduling/main/clerk/' },
					httpRead: { route: globals.webApiBaseUrl + 'scheduling/main/clerk/' },
					actions: { delete: true, create: 'flat' },
					entityRole: { leaf: { itemName: 'Clerks', parentService: schedulingMainService  } },
					presenter: {
						list: {
							initCreationData: function initCreationData(creationData) {
								var selected = schedulingMainService.getSelected();
								creationData.PKey1 = selected.Id;
								creationData.PKey2 = selected.ScheduleFk;
							}
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainClerkServiceOption);

			serviceContainer.service.canCreate = function canCreate() {
				return !schedulingMainService.isCurrentTransientRoot();
			};

			return serviceContainer.service;
		}
	]);
})(angular);
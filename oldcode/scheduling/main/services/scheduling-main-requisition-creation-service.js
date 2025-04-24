/**
 * Created by baf on 02.10.2014.
 */
(function (angular) {
	/* global globals */
	'use strict';
	var schedulingMainModule = angular.module('scheduling.main');

	/**
	 * @ngdoc service
	 * @name schedulingMainRequisitionCreationService
	 * @function
	 *
	 * @description
	 * schedulingMainClerkService is the data service for all activityRelationship related functionality.
	 */
	schedulingMainModule.factory('schedulingMainRequisitionCreationService', ['schedulingMainService', 'platformDataServiceFactory',

		function (schedulingMainService, platformDataServiceFactory) {

			var schedulingMainRequisitionServiceOption = {
				flatLeafItem: {
					module: schedulingMainModule,
					serviceName: 'schedulingMainRequisitionCreationService',
					entityNameTranslationID: 'scheduling.main.entityRequisition',
					httpRead: { route: globals.webApiBaseUrl + 'scheduling/main/requisition/' },
					actions: { delete: false, create: false },
					entityRole: { leaf: { itemName: 'Requisitions', parentService: schedulingMainService  } }
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(schedulingMainRequisitionServiceOption);

			return serviceContainer.service;
		}
	]);
})(angular);
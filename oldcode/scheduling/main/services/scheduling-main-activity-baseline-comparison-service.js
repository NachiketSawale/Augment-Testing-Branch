/**
 * Created by welss on 04.04.2017.
 */
(function () {
	/* global globals */
	'use strict';
	let moduleName = 'scheduling.main';
	let mainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name schedulingCalendarExceptionDayService
	 * @function
	 *
	 * @description
	 * schedulingCalendar is the data service for all exception day related functionality.
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	mainModule.factory('schedulingMainActivityBaseLineComparisonService', ['schedulingMainService', 'platformDataServiceFactory', 'platformDataServiceProcessDatesBySchemeExtension',
		function (schedulingMainService, platformDataServiceFactory, platformDataServiceProcessDatesBySchemeExtension) {

			let exceptServiceOption = {
				flatNodeItem: {
					module: mainModule,
					serviceName: 'schedulingMainActivityBaseLineComparisonService',
					entityNameTranslationID: 'scheduling.main.activitybaselinecmp',
					dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
						typeName: 'ActivityBaselineCmpVDto',
						moduleSubModule: 'Scheduling.Main'
					})],
					actions: { delete: false, create: false },
					httpRead: {route: globals.webApiBaseUrl + 'scheduling/main/activitybaselinecmp/', endRead: 'list'},
					presenter: {
						list: {}
					},
					entityRole: { node: { itemName: 'ActivityBaselineCmp', parentService: schedulingMainService  }},
					entitySelection: {}
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(exceptServiceOption);

			return serviceContainer.service;
		}
	]);
})
();

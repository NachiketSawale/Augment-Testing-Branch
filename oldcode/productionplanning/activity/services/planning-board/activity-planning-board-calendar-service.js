/**
 * todo is this factory still needed? reviewed 2.12.2021
 *
 * Created by anl on 3/12/2018.
 */

(function (angular) {
	/* global globals */
	'use strict';
	/**
	 * @ngdoc service
	 * @name ppsActivityPlanningBoardCalendarService
	 * @function
	 *
	 * @description
	 * productionplanningActivityPlanningBoardCalendarService is the data service for all pps activity calendar related functionality.
	 */
	var moduleName = 'productionplanning.activity';
	var resourceModule = angular.module(moduleName);
	resourceModule.factory('productionplanningActivityPlanningBoardCalendarService', ['platformDataServiceFactory', '$injector', 'moment',
		function (platformDataServiceFactory, $injector, moment) {

			var factoryOptions = {
				flatRootItem: {
					module: resourceModule,
					serviceName: 'productionplanningActivityPlanningBoardCalendarService',
					entityNameTranslationID: 'resource.equipment.entityPlant',
					httpRead: {
						route: globals.webApiBaseUrl + 'basics/site/calendar/', usePostForRead: true, // HACK FOR DUMMY SERVICE!!
						initReadData: function (readdata) {
							var parentService = $injector.get('platformPlanningBoardDataService'); //todo planningboarddataservice directly injected?
							readdata.DateFrom = parentService.getDateStart();
							readdata.DateTo = parentService.getDateEnd();
						}
					},

					entitySelection: {supportsMultiSelection: true},
					entityRole: {
						root: {
							itemName: 'Days',
							moduleName: 'productionplanning.activity',
							addToLastObject: true,
							lastObjectModuleName: moduleName,
							useIdentification: true
						}
					},
					dataProcessor: [{
						processItem: function processItem(dateValue) {
							dateValue = new moment.utc(dateValue);
						}
					}]
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(factoryOptions);

			var service = serviceContainer.service;
			service.loadAfterNavigation = function loadAfterNavigation(item, triggerField) {
				if (triggerField === 'Id') {
					service.load();
				}
			};
			return service;
		}]);
})(angular);

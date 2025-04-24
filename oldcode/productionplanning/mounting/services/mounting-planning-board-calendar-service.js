(function (angular) {
    /* global globals */
    'use strict';
    /**
     *
     *  todo is this factory still needed? reviewed 2.12.2021
     *
     * @ngdoc service
     * @name ppsMountingPlanningBoardCalendarService
     * @function
     *
     * @description
     * ppsMountingPlanningBoardCalendarService is the data service for all pps mounting calendar related functionality.
     */
    var moduleName = 'productionplanning.mounting';
    var resourceModule = angular.module(moduleName);
    resourceModule.factory('ppsMountingPlanningBoardCalendarService', ['platformDataServiceFactory', '$injector', 'moment',
        function (platformDataServiceFactory, $injector, moment) {

            var factoryOptions = {
                flatRootItem: {
                    module: resourceModule,
                    serviceName: 'ppsMountingPlanningBoardCalendarService',
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
                            moduleName: 'ppsMounting.moduleNames',
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
                    // ,
                    // sidebarSearch: {
                    // 	options: {
                    // 		moduleName: moduleName,
                    // 		enhancedSearchEnabled: true,
                    // 		pattern: '',
                    // 		pageSize: 100,
                    // 		useCurrentClient: false,
                    // 		includeNonActiveItems: false,
                    // 		showOptions: true,
                    // 		showProjectContext: false,
                    // 		withExecutionHints: true
                    // 	}
                    // }
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

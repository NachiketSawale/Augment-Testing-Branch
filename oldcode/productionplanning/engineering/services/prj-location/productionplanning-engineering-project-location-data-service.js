/**
 * Created by las on 7/4/2018.
 */


(function () {
    'use strict';
    var moduleName = 'productionplanning.engineering';
    var ppsEngineeringModule = angular.module(moduleName);

    ppsEngineeringModule.factory('productionplanningEngineeringProjectLocationDataService', ['platformDataServiceFactory', 'ServiceDataProcessArraysExtension', 'basicsLookupdataLookupDescriptorService',
        'productionplanningCommonStructureFilterService', 'productionplanningEngineeringMainService', 'projectLocationMainImageProcessor',
        function (platformDataServiceFactory, ServiceDataProcessArraysExtension,basicsLookupdataLookupDescriptorService, PpsCommonStructureFilterService, EngineeringMainService, projectLocationMainImageProcessor) {

            var serviceOption = {
                hierarchicalRootItem: {
                    module: ppsEngineeringModule,
                    serviceName: 'productionplanningEngineeringProjectLocationmDataService',
                    httpRead: {   route: globals.webApiBaseUrl + 'project/location/',
                        initReadData: function (readData) {
                            readData.filter = '?projectId=' + EngineeringMainService.getSelectedProjectId();
                        }
                    },

                    dataProcessor: [new ServiceDataProcessArraysExtension(['Locations']), projectLocationMainImageProcessor],
                    useItemFilter: true,
                    presenter: {tree:
                    {parentProp: 'LocationParentFk', childProp: 'Locations',
                        incorporateDataRead: function (readData, data) {
                            var allIds = PpsCommonStructureFilterService.getAllFilterIds('productionplanningEngineeringMainService');
                            if(allIds)
                            {
                                // Must be Upper Case and equal to filterName in CommonLogic
                                var filterKey = 'PEOJECTLOCATION';
                                var markerIds = allIds[filterKey];
                                if(markerIds && markerIds.length > 0){
                                    setItemMarkers(readData, markerIds);
                                }
                            }
                            basicsLookupdataLookupDescriptorService.attachData(readData);
                            return serviceContainer.data.handleReadSucceeded(readData, data);
                        }
                    }},
                    entityRole: {root: {
                        moduleName: 'productionplanning.engineering',
                        itemName: 'ProjectLocation'
                    }
                    },
                    actions: {} // no create/delete actions
                }
            };
            /* jshint -W003 */
            var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption),
                service = serviceContainer.service;

            service.setShowHeaderAfterSelectionChanged(null);

            service.collectPrjLocationIds = function collectPrjLocationIds(SelectedPrjLocation) {
                return _.map(PpsCommonStructureFilterService.collectItems(SelectedPrjLocation, 'Locations'), 'Id');
            };

            service.extendByFilter = function extendByFilter(mainServiceName, id, filterService) {

                var PrjLocationFk = 'PrjLocationFk';
                var allIds = [];

                // filter leading structure by line items
                if (angular.isFunction(filterService.addLeadingStructureFilterSupport)){
                    filterService.addLeadingStructureFilterSupport(mainServiceName, service, PrjLocationFk);
                }

                service.markersChanged = function markersChanged(itemList) {
                    // Must be Upper Case and equal to filterName in CommonLogic
                    var filterKey = 'PEOJECTLOCATION';
                    if (_.isArray(itemList) && _.size(itemList) > 0) {
                        allIds.length = 0;
                        // get all child prj cost group (for each item)
                        _.each(itemList, function (item) {
                            var Ids = service.collectPrjLocationIds(item);
                            allIds = allIds.concat(Ids);
                        });
                        if (_.isFunction(filterService.setFilterIds)) {
                            filterService.setFilterIds(mainServiceName, filterKey, allIds);
                        }
                        filterService.addFilter(id, service, function (lineItem) {
                            return allIds.indexOf(lineItem[PrjLocationFk]) >= 0;
                        }, {id: filterKey, iconClass: 'tlb-icons ico-filter-location', captionId: 'prjLocationFilter' }, PrjLocationFk);
                    } else {
                        if (_.isFunction(filterService.setFilterIds)) {
                            filterService.setFilterIds(mainServiceName, filterKey, []);
                        }
                        filterService.removeFilter(id);
                    }
                };
            };

            function setItemMarkers(ppsItems, markerIds) {
                _.each(ppsItems, function (ProjectLocation) {
                    ProjectLocation.IsMarked = markerIds.indexOf(ProjectLocation.Id) >= 0;
                    setItemMarkers(ProjectLocation.ChildItems, markerIds);
                });
            }

            if(EngineeringMainService.getSelectedProjectId() > 0)
            {
                service.load();
            }

            return service;

        }]);
})();
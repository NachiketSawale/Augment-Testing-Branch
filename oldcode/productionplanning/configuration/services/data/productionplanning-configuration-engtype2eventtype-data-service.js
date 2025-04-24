(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningConfigurationEngtype2eventtypeDataService
     * @function
     *
     * @description
     * productionplanningConfigurationEngtype2eventtypeDataService is the data service for engtype2eventtype.
     */

    angModule.factory('productionplanningConfigurationEngtype2eventtypeDataService', DataService);
    DataService.$inject = [
        '$injector',
        'platformDataServiceFactory',
        'platformDataServiceProcessDatesBySchemeExtension',
        'basicsLookupdataLookupDescriptorService',
        'basicsCommonMandatoryProcessor',
        'basicsLookupdataLookupFilterService',
        'productionplanningConfigurationMainService',
        'productionplanningConfigurationEngtype2eventtypeProcessor'
    ];

    function DataService($injector,
                         platformDataServiceFactory,
                         platformDataServiceProcessDatesBySchemeExtension,
                         basicsLookupdataLookupDescriptorService,
                         basicsCommonMandatoryProcessor,
                         basicsLookupdataLookupFilterService,
                         parentService,
                         processor) {

        var serviceInfo = {
            flatLeafItem: {
                module: angModule,
                serviceName: 'productionplanningConfigurationEngtype2eventtypeDataService',
                entityNameTranslationID: 'productionplanning.configuration.entityEventType2ResType',
                dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                    typeName: 'EngType2PpsEventTypeDto',
                    moduleSubModule: 'ProductionPlanning.Configuration'
                }), processor],
                httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/configuration/engtype2ppseventtype/'},
                httpRead: {route: globals.webApiBaseUrl + 'productionplanning/configuration/engtype2ppseventtype/'},
                entityRole: {
                    leaf: {
                        itemName: 'EngType2PpsEventType',
                        parentService: parentService,
                        parentFilter: 'eventTypeId'
                    }
                },
                presenter: {
                    list: {
                        incorporateDataRead: function (readData, data) {
                            basicsLookupdataLookupDescriptorService.attachData(readData);
                            var dtos = (angular.isArray(readData) && !readData.Main) ? readData : readData.Main;

                            var result = {
                                FilterResult: readData.FilterResult,
                                dtos: dtos || []
                            };
                            return container.data.handleReadSucceeded(result, data);
                        },
                        initCreationData: function (creationData) {
                            creationData.Id = parentService.getSelected().Id;
                        }
                    }
                },
                actions: {
                    delete: {},
                    create: 'flat',
                    canCreateCallBackFunc: function () {
                        var parentItem = parentService.getSelected();
                        var engTaskEntityType = 5;
                        return parentItem && parentItem.PpsEntityFk === engTaskEntityType;
                    }
                    /*
                    canDeleteCallBackFunc: function (selectedItem) {
                        if (selectedItem.Version <= 0) {
                            return true;
                        }
                        var parentItem = parentService.getSelected();
                        return parentItem && !parentItem.IsSystemType;
                    }*/
                }


            }
        };

        /* function registerLookupFilters() {
         var filters = [{
         key: 'resource-master-resource-filter',

         fn: function (item) {
         if (item) {
         return item.PpsEntityFk !== null && item.PpsEntityFk === 1;
         }
         return false;
         }
         }];
         basicsLookupdataLookupFilterService.registerFilter(filters);
         }*/

        /* jshint -W003 */
        var container = platformDataServiceFactory.createNewComplete(serviceInfo);
        //container.data.usesCache = true;
        container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
            typeName: 'EventType2ResTypeDto',
            moduleSubModule: 'ProductionPlanning.Configuration',
            validationService: 'productionplanningConfigurationEngtype2eventtypeValidationService'
        });
        //registerLookupFilters();
        container.service.name = 'engtype2eventtypeServ';
        return container.service;
    }
})(angular);

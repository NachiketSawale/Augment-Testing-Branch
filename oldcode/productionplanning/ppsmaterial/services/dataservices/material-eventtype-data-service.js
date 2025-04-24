(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    var masterModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningPpsMaterialEventTypeDataService
     * @function
     *
     * @description
     * productionplanningPpsMaterialEventTypeDataService is the data service for Material Event Type.
     */

    masterModule.factory('productionplanningPpsMaterialEventTypeDataService', productionplanningPpsMaterialEventTypeDataService);
    productionplanningPpsMaterialEventTypeDataService.$inject = [
        '$injector', 'productionplanningPpsMaterialRecordMainService', 'platformDataServiceFactory',
        'platformDataServiceProcessDatesBySchemeExtension',
        'basicsLookupdataLookupDescriptorService',
        'basicsCommonMandatoryProcessor',
        'productionplanningPpsMaterialEventTypeSortingProcessor',
        'basicsLookupdataLookupFilterService'
    ];

    function productionplanningPpsMaterialEventTypeDataService($injector, parentService, platformDataServiceFactory,
                                                               platformDataServiceProcessDatesBySchemeExtension,
                                                               basicsLookupdataLookupDescriptorService,
                                                               basicsCommonMandatoryProcessor,
                                                               productionplanningPpsMaterialEventTypeSortingProcessor,
                                                               basicsLookupdataLookupFilterService) {

        var serviceInfo = {
            flatLeafItem: {
                module: moduleName,
                serviceName: 'productionplanningPpsMaterialEventTypeDataService',
                entityNameTranslationID: 'productionplanning.ppsmaterial.materialEventType.entityMaterialEventType',
                dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                    typeName: 'MaterialEventTypeDto',
                    moduleSubModule: 'ProductionPlanning.PpsMaterial'
                }), productionplanningPpsMaterialEventTypeSortingProcessor],
                httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/materialeventtype/'},
                httpRead: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/materialeventtype/'},
                entityRole: {
                    leaf: {
                        itemName: 'MaterialEventType',
                        parentService: parentService,
                        parentFilter: 'mainItemId'
                    }
                },

                presenter: {
                    list: {
                        incorporateDataRead: function (readData, data) {
                            basicsLookupdataLookupDescriptorService.attachData(readData);
                            var result = {
                                FilterResult: readData.FilterResult,
                                dtos: readData || []
                            };
                            return container.data.handleReadSucceeded(result, data);
                            //if (dataRead.length >= 1) {
                            //    container.service.setSelected(dataRead[0]);
                            //}
                        },
                        initCreationData: function (creationData) {
                            creationData.Id = parentService.getSelected().Id;
                        }
                    }
                }
            }
        };

        initialize();
        /* jshint -W003 */
        var container = platformDataServiceFactory.createNewComplete(serviceInfo);

        container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
            typeName: 'MaterialEventTypeDto',
            moduleSubModule: 'ProductionPlanning.PpsMaterial',
            validationService: 'productionplanningPpsMaterialEventTypeValidationService',
            mustValidateFields: ['LagTime', 'VarDuration', 'Sorting']
        });

        return container.service;

        function initialize() {
            var ppsEventTypeFilter = {
                key: 'productionplanning-ppsmaterial-ppseventtype-filter',
                serverSide: true,
                fn: function () {
                    return {IsSystemEvent: false};
                }
            };
            basicsLookupdataLookupFilterService.registerFilter(ppsEventTypeFilter);
        }
    }

})(angular);

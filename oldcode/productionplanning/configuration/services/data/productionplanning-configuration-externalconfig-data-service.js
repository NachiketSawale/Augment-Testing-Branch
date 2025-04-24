(function (angular) {
    /*global angular, globals, _*/
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name ppsExternalConfigurationDataService
     * @function
     *
     * @description
     * ppsExternalConfigurationDataService is the data service for External Configuration.
     */

    angModule.factory('ppsExternalConfigurationDataService', DataService);
    DataService.$inject = [
        '$injector',
        'platformDataServiceFactory',
        'platformDataServiceProcessDatesBySchemeExtension',
        'basicsLookupdataLookupDescriptorService',
        'basicsCommonMandatoryProcessor',
        'basicsLookupdataLookupFilterService',
        'productionplanningConfigurationExternalConfigSortingProcessor',
        'ppsConfigExternalSourceLookupService'
    ];

    function DataService($injector,
                         platformDataServiceFactory,
                         platformDataServiceProcessDatesBySchemeExtension,
                         basicsLookupdataLookupDescriptorService,
                         basicsCommonMandatoryProcessor,
                         basicsLookupdataLookupFilterService,
                         sortingProcessor,
                         ppsConfigExternalSourceLookupService) {

        var serviceInfo = {
            flatRootItem: {
                module: moduleName + '.enternalcongif',
                serviceName: 'ppsExternalConfigurationDataService',
                entityNameTranslationID: 'productionplanning.configuration.entityExternalConfig',
                dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                    typeName: 'PpsExternalconfigDto',
                    moduleSubModule: 'ProductionPlanning.Configuration'
                }),sortingProcessor],
                httpCRUD: {
                    route: globals.webApiBaseUrl + 'productionplanning/configuration/externalconfig/',
                    endRead: 'filtered',
                    endDelete: 'deleteconfig',
                    usePostForRead: true
                },
                entityRole: {
                    root: {
                        itemName: 'PpsExternalconfig',
                        moduleName: 'productionplanning.configuration.entityExternalConfig',
                        descField: 'Description'
                    }
                },
                presenter: {
                    list: {
                        incorporateDataRead: function (readData, data) {
                            basicsLookupdataLookupDescriptorService.attachData(readData);
                            var result = {
                                FilterResult: readData.FilterResult,
                                dtos: readData.dtos || []
                            };
                            return container.data.handleReadSucceeded(result, data);
                        },

                    }
                }
            }
        };
        /* jshint -W003 */
        var container = platformDataServiceFactory.createNewComplete(serviceInfo);

        var filters = [{
            key: 'ppsconfig-bas-external-resource-filter',
            fn: function (item) {
                var externalConfig = container.service.getSelected();
                if(externalConfig && externalConfig.BasExternalSourceTypeFk !== null){
                    var itemEntity = _.find(ppsConfigExternalSourceLookupService.getItemList(), {Id:item.Id });
                    if(itemEntity && itemEntity.ExternalsourcetypeFk){
                        return itemEntity.ExternalsourcetypeFk === externalConfig.BasExternalSourceTypeFk;
                    }
                   return false;
                }
                return  false;
            }
        }];

        basicsLookupdataLookupFilterService.registerFilter(filters);

        container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
            typeName: 'PpsExternalconfigDto',
            moduleSubModule: 'ProductionPlanning.Configuration',
            validationService: 'ppsExternalConfigurationValidationService'
        });
        container.service.name = 'ppsExternalConfigurationDataService';
        return container.service;
    }
})(angular);

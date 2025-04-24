(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningConfigurationEngtypeDataService
     * @function
     *
     * @description
     * productionplanningConfigurationEngtypeDataService is the data service for engtype.
     */

    angModule.factory('productionplanningConfigurationEngtypeDataService', DataService);
    DataService.$inject = [
        '$injector',
        'platformDataServiceFactory',
        'platformDataServiceProcessDatesBySchemeExtension',
        'basicsLookupdataLookupDescriptorService',
        'basicsCommonMandatoryProcessor',
        'productionplanningConfigurationEngtypeSortingProcessor',
        'basicsLookupdataLookupFilterService'
    ];

    function DataService($injector,
                         platformDataServiceFactory,
                         platformDataServiceProcessDatesBySchemeExtension,
                         basicsLookupdataLookupDescriptorService,
                         basicsCommonMandatoryProcessor,
                         sortingProcessor,
                         basicsLookupdataLookupFilterService) {

        var serviceInfo = {
            flatRootItem: {
                module: moduleName + '.engtype',
                serviceName: 'productionplanningConfigurationEngtypeDataService',
                entityNameTranslationID: 'productionplanning.configuration.entityEngType',
                dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                    typeName: 'EngTypeDto',
                    moduleSubModule: 'ProductionPlanning.Configuration'
                }), sortingProcessor],
                httpCRUD: {
                    route: globals.webApiBaseUrl + 'productionplanning/configuration/engtype/',
                    endRead: 'filtered',
                    usePostForRead: true
                },
                entityRole: {
                    root: {
                        itemName: 'EngType',
                        moduleName: 'productionplanning.configuration.moduleDisplayNameEngType',
                        descField: 'DescriptionInfo.Translated'
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
                        handleCreateSucceeded:function (newItem) {
                            //reset field RubricCategoryFk value with null for newItem, because value 0 is valid in RubricCategory lookup data.
                            if(newItem.Version === 0 && newItem.RubricCategoryFk === 0){
                                newItem.RubricCategoryFk = null;
                            }
                        }
                    }
                },

                translation: {
                    uid: 'productionplanningConfigurationEngtypeService',
                    title: 'productionplanning.configuration.entityEngType',
                    columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
                    dtoScheme: {
                        typeName: 'EngTypeDto',
                        moduleSubModule: 'ProductionPlanning.Configuration'
	                },
                }
            }
        };

        initialize();
        /* jshint -W003 */
        var container = platformDataServiceFactory.createNewComplete(serviceInfo);

        container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
            typeName: 'EngTypeDto',
            moduleSubModule: 'ProductionPlanning.Configuration',
            validationService: 'productionplanningConfigurationEngtypeValidationService'
        });
        container.service.name = 'configurationServ';
        return container.service;

        function initialize() {
            var filters = [{
                        key: 'productionplanning-configuration-engtype-rubric-category',
				            serverKey: 'rubric-category-by-rubric-company-lookup-filter',
				            serverSide: true,
				            fn: function () {
					            return { Rubric: 77 };//77 is rubric for Engineering.
				            }
                    }];
            basicsLookupdataLookupFilterService.registerFilter(filters);

        }
    }
})(angular);

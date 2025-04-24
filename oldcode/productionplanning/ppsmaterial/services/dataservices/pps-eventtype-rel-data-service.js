(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    var masterModule = angular.module(moduleName);

    /**
     * @ngdoc service
     * @name productionplanningPpsMaterialPpsEventTypeRelationDataService
     * @function
     *
     * @description
     * productionplanningPpsMaterialEventTypeDataService is the data service for Pps Event Type Relation.
     */

    masterModule.factory('productionplanningPpsMaterialPpsEventTypeRelationDataService', productionplanningPpsMaterialPpsEventTypeRelationDataService);
    productionplanningPpsMaterialPpsEventTypeRelationDataService.$inject = ['$injector', 'productionplanningPpsMaterialRecordMainService', 'platformDataServiceFactory',
        'platformDataServiceProcessDatesBySchemeExtension', 'basicsLookupdataLookupDescriptorService','basicsCommonMandatoryProcessor'];

    function productionplanningPpsMaterialPpsEventTypeRelationDataService($injector, parentService, platformDataServiceFactory,
                                                                          platformDataServiceProcessDatesBySchemeExtension, basicsLookupdataLookupDescriptorService,basicsCommonMandatoryProcessor) {

        var serviceInfo = {
            flatLeafItem: {
                module: moduleName,
                serviceName: 'productionplanningPpsMaterialPpsEventTypeRelationDataService',
                entityNameTranslationID: 'productionplanning.ppsmaterial.ppsEventTypeRelation.entityPpsEventTypeRelation',
                dataProcessor: [platformDataServiceProcessDatesBySchemeExtension.createProcessor({
                    typeName: 'PpsEventTypeRelDto',
                    moduleSubModule: 'ProductionPlanning.PpsMaterial'
                })],
                httpCreate: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/ppseventtyperel/'},
                httpRead: {route: globals.webApiBaseUrl + 'productionplanning/ppsmaterial/ppseventtyperel/'},
                entityRole: {
                    leaf: {
                        itemName: 'PpsEventTypeRel',
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
                        },
                        initCreationData: function (creationData) {
                            creationData.Id = parentService.getSelected().Id;
                        }
                    }
                }
            }
        };

        /* jshint -W003 */
        var container = platformDataServiceFactory.createNewComplete(serviceInfo);

        container.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
            typeName: 'PpsEventTypeRelDto',
            moduleSubModule: 'ProductionPlanning.PpsMaterial',
            validationService: 'productionplanningPpsMaterialPpsEventTypeRelationValidationService',
            mustValidateFields:['FixLagTime','FixDuration']
        });

        return container.service;
    }

})(angular);

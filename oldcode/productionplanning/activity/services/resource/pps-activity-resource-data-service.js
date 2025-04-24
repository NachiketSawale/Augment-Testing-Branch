/**
 * Created by anl on 3/7/2018.
 */


(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.activity';
    var masterModule = angular.module(moduleName);

    masterModule.factory('productionplanningActivityResourceForActivityDataService', ResourceForActivityDataService);

    ResourceForActivityDataService.$inject = [
        '$translate',
        'treeviewListDialogDataService',
        'basicsLookupdataLookupDescriptorService',
        'platformDataServiceFactory',
        'productionplanningActivityActivityDataService',
        'productionplanningMountingActivityResourceProcessor'];

    function ResourceForActivityDataService($translate,
                                            dialogDataService,
                                            basicsLookupdataLookupDescriptorService,
                                            platformDataServiceFactory,
                                            parentService,
                                            actResourceProcessor) {
        var systemOption = {
            flatLeafItem: {
                serviceName: 'productionplanningActivityResourceForActivityDataService',
                httpRead: {
                    route: globals.webApiBaseUrl + 'resource/master/resource/',
                    endRead: 'listForMntActivity'
                },
                entityRole: {
                    leaf: {
                        itemName: 'ActResource',
                        parentService: parentService
                    }
                },
                dataProcessor: [actResourceProcessor],
                presenter: {
                    list: {
                        incorporateDataRead: function (readData, data) {

                            basicsLookupdataLookupDescriptorService.attachData(readData);
                            var result = readData.Main ? {
                                FilterResult: readData.FilterResult,
                                dtos: readData.Main || []
                            } : readData;
                            return serviceContainer.data.handleReadSucceeded(result, data);
                        }
                    }
                },
                actions: {}
            }
        };

        var serviceContainer = platformDataServiceFactory.createNewComplete(systemOption); // jshint ignore:line

        serviceContainer.data.setFilter = function (filter) {
            var parentItem = parentService.getSelected();
            if (parentItem && angular.isDefined(parentItem.PpsEventFk)) {
                serviceContainer.data.filter = 'PpsEventId=' + parentItem.PpsEventFk;
            } else {
                serviceContainer.data.filter = filter;
            }
        };

        return serviceContainer.service;
    }
})(angular);
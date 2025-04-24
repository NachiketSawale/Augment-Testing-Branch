/**
 * Created by waz on 11/27/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';

    angular
        .module(moduleName)
        .factory('productionplanningMountingTrsRequisitionDialogBundleDataService', ProductionplanningMountingTrsRequisitionDialogBundleDataService);
    ProductionplanningMountingTrsRequisitionDialogBundleDataService.$inject = ['platformDataServiceFactory', 'productionplanningMountingTrsRequisitionDialogRequisitionDataService'];
    function ProductionplanningMountingTrsRequisitionDialogBundleDataService(platformDataServiceFactory, parentService) {
        var serviceContainer;
        var serviceOptions = {
            flatLeafItem: {
                serviceName: 'productionplanningMountingTrsRequisitionDialogBundleDataService',
                httpRead: {
                    route: globals.webApiBaseUrl + 'transportplanning/bundle/bundle/',
                    endRead: 'listForRequisition'
                },
                presenter: {
                    list: {
                        incorporateDataRead: function (readData, data) {
                            var result = readData.Main ? {
                                FilterResult: readData.FilterResult,
                                dtos: readData.Main || []
                            }: readData;

                            return serviceContainer.data.handleReadSucceeded(result, data);
                        }
                    }
                },
                entityRole: {
                    leaf: {
                        itemName: 'Bundle',
                        parentService: parentService,
                        parentFilter: 'requisitionId'
                    }
                }
            }
        };

        serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
        return serviceContainer.service;
    }
})(angular);
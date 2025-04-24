/**
 * Created by waz on 11/27/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.activity';

    angular
        .module(moduleName)
        .factory('productionplanningActivityTrsRequisitionDialogBundleDataService', productionplanningActivityTrsRequisitionDialogBundleDataService);
    productionplanningActivityTrsRequisitionDialogBundleDataService.$inject = ['platformDataServiceFactory', 'productionplanningActivityTrsRequisitionDialogRequisitionDataService'];
    function productionplanningActivityTrsRequisitionDialogBundleDataService(platformDataServiceFactory, parentService) {
        var serviceContainer;
        var serviceOptions = {
            flatLeafItem: {
                serviceName: 'productionplanningActivityTrsRequisitionDialogBundleDataService',
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
        //serviceContainer.data.usesCache = false;
        return serviceContainer.service;
    }
})(angular);
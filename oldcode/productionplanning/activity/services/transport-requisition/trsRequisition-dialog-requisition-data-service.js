/**
 * Created by waz on 11/27/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.activity';

    angular
        .module(moduleName)
        .factory('productionplanningActivityTrsRequisitionDialogRequisitionDataService', productionplanningActivityTrsRequisitionDialogRequisitionDataService);
    productionplanningActivityTrsRequisitionDialogRequisitionDataService.$inject = ['platformDataServiceFactory', 'productionplanningActivityActivityDataService'];
    function productionplanningActivityTrsRequisitionDialogRequisitionDataService(platformDataServiceFactory, parentService) {
        var serviceContainer;
        var serviceOptions = {
            flatNodeItem: {
                serviceName: 'productionplanningActivityTrsRequisitionDialogRequisitionDataService',
                httpRead: {
                    route: globals.webApiBaseUrl + 'transportplanning/requisition/',
                    endRead: 'listByProjectAndMntActivity',
                    initReadData: function (readData) {
                        readData.filter = '?projectId=' + parentService.getSelected().ProjectId;
                    }
                },
                entityRole: {
                    node: {
                        itemName: 'Requisition',
                        parentService: parentService
                    }
                },
                entitySelection: {supportsMultiSelection: true},
                presenter: {
                    list: {
                        incorporateDataRead: function (readData, data) {
                            var result = {
                                FilterResult: readData.FilterResult,
                                dtos: readData || []
                            };

                            return serviceContainer.data.handleReadSucceeded(result, data);
                        }
                    }
                }
            }
        };

        serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
        serviceContainer.data.doNotLoadOnSelectionChange = true;
        return serviceContainer.service;
    }
})(angular);
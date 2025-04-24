/**
 * Created by zov on 12/18/2019.
 */
(function () {
    'use strict';
    /*global globals, angular*/
    var moduleName = 'productionplanning.item';
    var itemModule = angular.module(moduleName);

    itemModule.factory('ppsItemLogDataService', srv);
    srv.$inject = ['platformDataServiceFactory', 'ppsCommonLoggingHelper',
        'productionplanningItemTranslationService', 'productionplanningItemDataService'];
    function srv(platformDataServiceFactory, ppsCommonLoggingHelper,
                 translationService, ppsItemDataService) {
        var container = null,
            service = null;

        var serviceInfo = {
            flatRootItem: {
                module: itemModule,
                serviceName: 'ppsItemLogDataService',
                httpCRUD: {
                    route: globals.webApiBaseUrl + 'productionplanning/common/logreport/',
                    endRead: 'logsForPpsItem'
                },
                entityRole: {
                    leaf: {
                        itemName: 'ItemLog',
                        parentService: ppsItemDataService,
                        parentFilter: 'itemId'
                    }
                },
                actions: {},
                presenter: {
                    list: {
                        incorporateDataRead: function(readData, data) {
                            var result = container.data.handleReadSucceeded(readData, data);
                            ppsCommonLoggingHelper.translateLogColumnName(service.getList(), translationService, service);
                            return result;
                        }
                    }
                },
                entitySelection: {supportsMultiSelection: true}
            }
        };

        container = platformDataServiceFactory.createNewComplete(serviceInfo);
        service = container.service; // must set service before return
        return service;
    }
})();
/**
 * Created by anl on 2/6/2018.
 */

/**
 * Created by anl on 8/22/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.activity';
    var module = angular.module(moduleName);

    module.factory('productionplanningActivityActivityBundleDataService', PpsActivityActivityBundleDataService);

    PpsActivityActivityBundleDataService.$inject = ['$injector',
        'transportplanningBundleDataServiceContainerBuilder',
        'productionplanningActivityActivityDataService'];
    function PpsActivityActivityBundleDataService($injector, ServiceBuilder, parentService) {

        var mainOptionsType = 'flatNodeItem';
        var serviceInfo = {
            module: module,
            serviceName: 'productionplanningActivityActivityBundleDataService'
        };
        var validationService = '';
        var httpResource = {
            endRead: 'listForActivity'
        };
        var entityRole = {
            node: {
                itemName: 'ActBundle',
                parentService: parentService,
                parentFilter: 'ActivityId'
            }
        };
        var actions = {
            delete: {}
        };

        var builder = new ServiceBuilder(mainOptionsType);
        var serviceContainer = builder
            .setServiceInfo(serviceInfo)
            .setValidationService(validationService)
            .setHttpResource(httpResource)
            .setEntityRole(entityRole)
            .setActions(actions)
            .build();

        //serviceContainer.data.usesCache = false;

        return serviceContainer.service;
    }
})(angular);
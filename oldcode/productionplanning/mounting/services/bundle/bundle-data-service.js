/**
 * Created by anl on 8/22/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';
    var module = angular.module(moduleName);

    module.factory('productionplanningMountingActivityBundleDataService', ProductionplanningMountingActivityBundleDataService);

    ProductionplanningMountingActivityBundleDataService.$inject = [
        '$injector',
        'transportplanningBundleDataServiceContainerBuilder',
        'productionplanningMountingContainerInformationService'];

    function ProductionplanningMountingActivityBundleDataService($injector, ServiceBuilder, mountingContainerInformationService) {

        var activityGUID = '3a37c9d82f4e45c28ccd650f1fd2bc1f';
        var dynamicActivityService = mountingContainerInformationService.getContainerInfoByGuid(activityGUID).dataServiceName;
		 // eslint-disable-next-line no-console
        console.log(dynamicActivityService);

        var mainOptionsType = 'flatNodeItem';
        var serviceInfo = {
            module: module,
            serviceName: 'productionplanningMountingActivityBundleDataService'
        };
        var validationService = 'productionplanningMountingTrsRequisitionBundleValidationService';
        var httpResource = {
            endRead: 'listForActivity'
        };
        var entityRole = {
            node: {
                itemName: 'ActBundle',
                parentService: dynamicActivityService,
                parentFilter: 'ActivityId'
            }
        };
        var monitor = {
            listen: [{
                syncSameItem: true,
                service: 'productionplanningMountingTrsRequisitionBundleDataService'
            }]
        };
        var actions = {
            delete: true
        };

        var builder = new ServiceBuilder(mainOptionsType);
        var serviceContainer = builder
            .setServiceInfo(serviceInfo)
            .setValidationService(validationService)
            .setHttpResource(httpResource)
            .setEntityRole(entityRole)
            .setMonitor(monitor)
            .setActions(actions)
            .build();

        return serviceContainer.service;
    }
})(angular);

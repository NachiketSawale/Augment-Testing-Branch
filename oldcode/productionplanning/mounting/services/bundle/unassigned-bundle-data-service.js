/**
 * Created by waz on 1/10/2018.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';
    var module = angular.module(moduleName);
    module.factory('productionplanningMountingUnassignedBundleDataService', ProductionplanningMountingUnassignedBundleDataService);
    ProductionplanningMountingUnassignedBundleDataService.$inject = [
        'productionplanningMountingRequisitionDataService',
        'transportplanningBundleUnassignedDataServiceBuilder'];
    function ProductionplanningMountingUnassignedBundleDataService(parentService, ServiceBuilder) {

        var mainOptionsType = 'flatNodeItem';
        var serviceInfo = {
            module: module,
            serviceName: 'productionplanningMountingUnassignedBundleDataService'
        };
        var parentFilter = 'ProjectFk';
        var entityRole = {
            node: {
                itemName: 'Bundle',
                parentService: parentService
            }
        };
        var actions = {
            createReference: true
        };

        var builder = new ServiceBuilder(mainOptionsType);
        var serviceContainer = builder
            .setServiceInfo(serviceInfo)
            .setParentFilter(parentFilter)
            .setEntityRole(entityRole)
            .setActions(actions)
            .setNeedAssignDataService('productionplanningMountingTrsRequisitionBundleDataService')
            .build();

        return serviceContainer.service;
    }

})(angular);
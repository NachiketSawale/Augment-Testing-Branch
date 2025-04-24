/**
 * Created by waz on 2/1/2018.
 */
(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.requisition';
    var module = angular.module(moduleName);
    module.factory('transportplanningRequisitionUnassignedBundleDataService', BundleDataService);

    BundleDataService.$inject = [
        'transportplanningRequisitionMainService',
        'transportplanningBundleUnassignedDataServiceBuilder'];
    function BundleDataService(parentService, ServiceBuilder) {

        var serviceInfo = {
            module: module,
            serviceName: 'transportplanningRequisitionUnassignedBundleDataService'
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

        var builder = new ServiceBuilder('flatNodeItem');
        var serviceContainer = builder
            .setServiceInfo(serviceInfo)
            .setParentFilter(parentFilter)
            .setEntityRole(entityRole)
            .setActions(actions)
            .enablePpsItemFilter(false)
            .setNeedAssignDataService('transportplanningRequisitionBundleDataService')
            .build();

        serviceContainer.service.moveItem = serviceContainer.data.moveItem;

        return serviceContainer.service;
    }
})(angular);
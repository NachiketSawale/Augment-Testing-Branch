/**
 * Created by anl on 8/30/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';
    var module = angular.module(moduleName);
    module.factory('productionplanningMountingTrsRequisitionBundleDataService', ProductionplanningMountingTrsRequisitionBundleDataService);

    ProductionplanningMountingTrsRequisitionBundleDataService.$inject = [
        'transportplanningBundleReferenceDataServiceBuilder',
        'productionplanningMountingTrsRequisitionDataService',
        'transportplanningBundleGoodsSynchronizeFactory'];

    function ProductionplanningMountingTrsRequisitionBundleDataService(ServiceBulider,
                                                                       parentService,
                                                                       bundleGoodsSynchronizeFactory) {

        var mainOptionsType = 'flatNodeItem';
        var serviceInfo = {
            module: module,
            serviceName: 'productionplanningMountingTrsRequisitionBundleDataService'
        };
        var validationService = 'productionplanningMountingTrsRequisitionBundleValidationService';
        var httpResource = {
            endRead: 'listForRequisition'
        };
        var entityRole = {
            node: {
                itemName: 'Bundle',
                parentService: parentService,
                parentFilter: 'requisitionId'
            }
        };
        var actions = {
            createReference: true,
            deleteReference: true,
            referenceForeignKeyProperty: 'TrsRequisitionFk',
            referenceSourceDataService: 'productionplanningMountingUnassignedBundleDataService'
        };

        var builder = new ServiceBulider(mainOptionsType);
        var serviceContainer = builder
            .setServiceInfo(serviceInfo)
            .setValidationService(validationService)
            .setHttpResource(httpResource)
            .setEntityRole(entityRole)
            .setActions(actions)
            .build();

        serviceContainer.service.registerReferenceDeleted(function (e, items) {
            //synchronize with trsGood
            var bundleGoodSynchronizeService = bundleGoodsSynchronizeFactory.getService(moduleName);
            bundleGoodSynchronizeService.synDeletedBundle(items);
        });

        serviceContainer.service.registerReferenceCreated(function (e, items) {
            //synchronize with trsGood
            var bundleGoodSynchronizeService = bundleGoodsSynchronizeFactory.getService(moduleName);
            bundleGoodSynchronizeService.synAddedBundle(items);
        });

        return serviceContainer.service;
    }
})(angular);
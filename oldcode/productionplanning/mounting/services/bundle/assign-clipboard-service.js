/**
 * Created by waz on 1/9/2018.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';
    angular.module(moduleName).factory('productionplanningMountingBundleClipBoardService', ProductionplanningMountingBundleClipBoardService);
    ProductionplanningMountingBundleClipBoardService.$inject = ['transportplanningBundleAssignClipboardServiceFactory'];
    function ProductionplanningMountingBundleClipBoardService(serviceFactory) {
        var config = {
            sourceDataService: 'productionplanningMountingUnassignedBundleDataService',
            sourceType: 'unassignedBundle',
            targetDataService: 'productionplanningMountingTrsRequisitionBundleDataService',
            targetType: 'trsRequisitionBundle',
            foreignKey: 'TrsRequisitionFk'
        };
        return serviceFactory.createService(config);
    }

})(angular);
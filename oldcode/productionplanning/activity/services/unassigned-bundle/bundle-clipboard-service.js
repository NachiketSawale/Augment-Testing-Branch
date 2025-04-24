/**
 * Created by anl on 2/6/2018.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.activity';
    angular.module(moduleName).factory('productionplanningActivityBundleClipBoardService', ProductionplanningMountingBundleClipBoardService);
    ProductionplanningMountingBundleClipBoardService.$inject = ['transportplanningBundleAssignClipboardServiceFactory'];
    function ProductionplanningMountingBundleClipBoardService(serviceFactory) {
        var config = {
            sourceDataService: 'productionplanningActivityUnassignedBundleDataService',
            sourceType: 'unassignedBundle',
            targetDataService: 'productionplanningActivityTrsRequisitionBundleDataService',
            targetType: 'trsRequisitionBundle',
            foreignKey: 'TrsRequisitionFk'
        };
        return serviceFactory.createService(config);
    }

})(angular);
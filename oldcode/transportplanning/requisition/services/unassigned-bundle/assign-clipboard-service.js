/**
 * Created by waz on 2/1/2018.
 */
(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.requisition';
    var module = angular.module(moduleName);
    module.factory('transportplanningRequisitionBundleAssignClipboardService', AssignClipboardService);

    AssignClipboardService.$inject = ['transportplanningBundleAssignClipboardServiceFactory'];
    function AssignClipboardService(serviceFactory) {

        var config = {
            sourceDataService: 'transportplanningRequisitionUnassignedBundleDataService',
            sourceType: 'trsRequisitionUnassignedBundle',
            targetDataService: 'transportplanningRequisitionBundleDataService',
            targetType: 'trsRequisitionBundle',
            foreignKey: 'TrsRequisitionFk'
        };
        return serviceFactory.createService(config);
    }
})(angular);
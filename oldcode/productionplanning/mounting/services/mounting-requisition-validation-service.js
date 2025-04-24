/**
 * Created by anl on 10/18/2017.
 */


(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('productionpalnningMountingRequisitionValidationService', RequisitionValidationService);

    RequisitionValidationService.$inject = ['productionpalnningMountingRequisitionValidationFactory', 'productionplanningMountingRequisitionDataService'];

    function RequisitionValidationService(mntRequisitionValidationFactory, dataService) {
        return mntRequisitionValidationFactory.createValidationService(dataService);
    }

})(angular);
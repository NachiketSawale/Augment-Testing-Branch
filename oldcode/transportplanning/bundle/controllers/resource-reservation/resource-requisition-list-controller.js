/**
 * Created by waz on 11/16/2017.
 */
(function (angular) {
    'use strict';

    var module = 'transportplanning.bundle';

    angular
        .module(module)
        .controller('transportplanningBundleResourceReservationListController', TransportplanningBundleResourceReservationListController);
    TransportplanningBundleResourceReservationListController.$inject = [
        '$scope', 'platformGridControllerService', 'resourceReservationUIStandardService',
        'resourceRequisitionValidationService', 'transportplanningBundleResourceReservationDataService'];

    function TransportplanningBundleResourceReservationListController($scope,
                                                                      platformGridControllerService,
                                                                      uiStandardService,
                                                                      validationService,
                                                                      dataService) {

        var gridConfig = {initCalled: false, columns: []};
        platformGridControllerService.initListController($scope, uiStandardService, dataService, validationService, gridConfig);
    }
})(angular);
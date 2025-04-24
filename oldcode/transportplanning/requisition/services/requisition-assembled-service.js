/**
 * Created by waz on 2/27/2018.
 */
(function (angular) {

    'use strict';

    /**
     * @ngdoc service
     * @name transportplanningRequisitionAssembledService
     * @description
     * A service used to assemble necssaray data into transport requisition
     * */

    var moduleName = 'transportplanning.requisition';
    var BundleModul = angular.module(moduleName);

    BundleModul.factory('transportplanningRequisitionAssembledService', RequisitionAssembledService);
    RequisitionAssembledService.$inject = ['basicsLookupdataLookupDescriptorService'];

    function RequisitionAssembledService(basicsLookupdataLookupDescriptorService) {

        function assemble(items) {
            _.forEach(items, function (item) {
                assembleRequisition(item);
            });
        }

        function assembleRequisition(item) {
            item.status = basicsLookupdataLookupDescriptorService.getLookupItem('TrsRequisitionStatus', item.TrsReqStatusFk);
        }

        return {
            assemble: assemble
        };
    }
})(angular);
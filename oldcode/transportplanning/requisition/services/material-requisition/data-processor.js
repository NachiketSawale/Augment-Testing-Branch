/**
 * Created by waz on 12/6/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'transportplanning.requisition';

    angular.module(moduleName).factory('transportplanningRequisitionMatRequisitionDataProcessor', TransportplanningRequisitionMatRequisitionDataProcessor);

    TransportplanningRequisitionMatRequisitionDataProcessor.$inject = ['platformRuntimeDataService'];

    function TransportplanningRequisitionMatRequisitionDataProcessor(platformRuntimeDataService) {

        function processItem(item) {
            if (item.Version > 0 && item.TrsRequisitionFk !== null) {
                setColumnReadOnly(item, 'TrsRequisitionFk', true);
            }
        }

        function setColumnReadOnly(item, column, flag) {
            var fields = [
                {field: column, readonly: flag}
            ];
            platformRuntimeDataService.readonly(item, fields);
        }

        return {
            processItem: processItem
        };
    }

})(angular);
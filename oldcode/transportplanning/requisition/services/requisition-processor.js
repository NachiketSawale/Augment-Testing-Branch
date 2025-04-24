/**
 * Created by waz on 8/22/2017.
 */
(function (angular) {
    'use strict';
    var moduleName = 'transportplanning.requisition';
    /**
     * @ngdoc service
     * @name transportplanningRequisitionProcessor
     * @description
     * A service to process requisition item
     *
     */
    angular.module(moduleName).factory('transportplanningRequisitionDataProcessor', TransportplanningRequisitionDataProcessor);

    TransportplanningRequisitionDataProcessor.$inject = ['platformRuntimeDataService'];

    function TransportplanningRequisitionDataProcessor(platformRuntimeDataService) {

        function processItem(item, data) {
            if (data.isItemAccepted(item)) {
                _.each(item, function (value, key) {
                    setColumnReadOnly(item, key, true);
                });
            }
            if (item.Version > 0) {
                setColumnReadOnly(item, 'IsPickup', true);
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
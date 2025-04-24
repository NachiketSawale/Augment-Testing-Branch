/**
 * Created by anl on 9/21/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.mounting';

    angular.module(moduleName).factory('productionplanningMountingActivityResourceProcessor', ActResourceProcessor);

    ActResourceProcessor.$inject = ['platformRuntimeDataService'];

    function ActResourceProcessor(platformRuntimeDataService) {
        var service = {};

        service.processItem = function (item){
            service.setColumnReadOnly(item, 'IsLive', true);
        };

        service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
            var fields = [
                {field: column, readonly: flag}
            ];
            platformRuntimeDataService.readonly(item, fields);
        };


        return service;
    }

})(angular);
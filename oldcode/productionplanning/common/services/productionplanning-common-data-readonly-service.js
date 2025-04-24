
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.common';
    angular.module(moduleName).factory('productionplanningCommonDataReadonlyService', readonlyService);

    readonlyService.$inject = ['platformRuntimeDataService'];

    function readonlyService(platformRuntimeDataService) {
        var service = {};

        service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
            var fields = [];
            _.each(columns,function (column) {
                fields.push({field: column, readonly: flag});
            });
            platformRuntimeDataService.readonly(item, fields);
        };

        return service;
    }

})(angular);


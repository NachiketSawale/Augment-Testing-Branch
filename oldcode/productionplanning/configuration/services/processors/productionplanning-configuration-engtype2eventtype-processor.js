(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).factory('productionplanningConfigurationEngtype2eventtypeProcessor', Processor);
    Processor.$inject = ['$injector', 'platformRuntimeDataService'];
    function Processor($injector, platformRuntimeDataService) {

        var service = {};

        service.processItem = function processItem(item) {
            var parentItem = $injector.get('productionplanningConfigurationMainService').getSelected();
            var engTaskEntityType = 5;
            var flag = parentItem && parentItem.PpsEntityFk === engTaskEntityType;
            var columns = ['EngTypeFk'];
            service.setColumnsReadOnly(item,columns,!flag);
        };

        service.setColumnsReadOnly = function setColumnsReadOnly(item, columns, flag) {
            var fields = [];
            _.each(columns, function (column) {
                fields.push({field: column, readonly: flag});
            });
            platformRuntimeDataService.readonly(item, fields);
        };

        return service;
    }
})(angular);

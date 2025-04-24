(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).factory('productionplanningConfigurationLogConfigurationProcessor', processor);
    function processor() {
        var service = {};
        service.processItem = function processItem(item) {
            item.LogName = item.EntityId + '-' + item.PropertyId + '-' + item.EntityType;
        };
        return service;
    }
})(angular);

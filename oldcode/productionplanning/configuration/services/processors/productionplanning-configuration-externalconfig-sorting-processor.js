(function (angular) {
    /*global angular, _*/
    'use strict';
    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).factory('productionplanningConfigurationExternalConfigSortingProcessor', Processor);
    Processor.$inject = ['$injector'];
    function Processor($injector) {

        var service = {};

        service.processItem = function processItem(item) {
            if (item.Version === 0) {
                var dataServ = $injector.get('ppsExternalConfigurationDataService');
                var list = dataServ.getList();
                if (list.length > 0) {
                    item.Sorting = _.max(_.map(list, 'Sorting')) + 1;
                } else {
                    item.Sorting = 1;
                }
            }

        };

        return service;
    }
})(angular);

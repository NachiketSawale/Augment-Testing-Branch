(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.ppsmaterial';
    angular.module(moduleName).factory('productionplanningPpsMaterialProductDescParameterSortingProcessor', productionplanningPpsMaterialProductDescParameterSortingProcessor);
    productionplanningPpsMaterialProductDescParameterSortingProcessor.$inject = ['$injector'];
    function productionplanningPpsMaterialProductDescParameterSortingProcessor($injector) {

        var service = {};

        service.processItem = function processItem(item) {
            if (item.Version === 0) {
                var dataServ = $injector.get('productionplanningPpsMaterialProductDescParameterDataService');
                var list = dataServ.getList();
                var maxSorting = 0;
                list.forEach(function (element) {
                    if (maxSorting < element.Sorting) {
                        maxSorting = element.Sorting;
                    }
                });
                item.Sorting = maxSorting + 1;
            }

        };

        return service;
    }
})(angular);

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.ppsmaterial';

    function extendGrouping(gridColumns) {
        angular.forEach(gridColumns, function (column) {
            angular.extend(column, {
                grouping: {
                    title: column.name$tr$,
                    getter: column.field,
                    aggregators: [],
                    aggregateCollapsed: true
                }
            });
        });
        return gridColumns;
    }

    angular.module(moduleName).value('productionplanningPpsMaterialProductDescParameterLayoutConfig', {
        'addition': {
            'grid': extendGrouping([])
        }
    });

    //master Layout
    angular.module(moduleName).factory('productionplanningPpsMaterialProductDescParameterLayout', productionplanningPpsMaterialProductDescParameterLayout);
    productionplanningPpsMaterialProductDescParameterLayout.$inject = ['basicsLookupdataConfigGenerator'];
    function productionplanningPpsMaterialProductDescParameterLayout(basicsLookupdataConfigGenerator) {
        return {
            'fid': 'productionplanning.ppsmaterial.productionplanningPpsMaterialProductDescParameterLayout',
            'version': '1.0.0',
            'showGrouping': true,
            'addValidationAutomatically': true,
            'groups': [
                {
                    gid: 'basicData',
                    attributes: [
                        'descriptioninfo', 'variablename', 'quantity', 'uomfk', 'sorting'
                    ]
                }

            ],
            'overloads': {
                'uomfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                    dataServiceName: 'basicsUnitLookupDataService',
                    cacheEnable: true
                })
            }
        };
    }

})(angular);
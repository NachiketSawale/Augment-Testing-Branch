/**
 * Created by lid on 7/12/2017.
 */

(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.common';

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

    //item Layout
    angular.module(moduleName).value('productionplanningComonProductParamLayoutConfig', {
        addition: {
            grid: extendGrouping([
            ])
        }
    });

    angular.module(moduleName).factory('productionplanningComonProductParamLayout', PPSProductdescParamLayout);
    PPSProductdescParamLayout.$inject = ['basicsLookupdataConfigGenerator'];
    function PPSProductdescParamLayout(basicsLookupdataConfigGenerator) {
        return {
            'fid': 'productionplanning.common.productParamLayout',
            'version': '1.0.0',
            'showGrouping': true,
            'addValidationAutomatically': true,
            'groups': [
                {
                    gid: 'productparam',
                    attributes: ['descriptioninfo', 'variablename', 'quantity', 'basuomfk', 'sorting']
                }
            ],
            'overloads': {
                basuomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
                    dataServiceName: 'basicsUnitLookupDataService',
                    cacheEnable: true
                }),
                'quantity':{
                    disallowNegative: true
                }
            }
        };

    }

})(angular);

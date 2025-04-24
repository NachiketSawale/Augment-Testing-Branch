(function (angular) {
    'use strict';
    var moduleName = 'productionplanning.configuration';
    var angModule = angular.module(moduleName);

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

    //engtype2eventtype Layout Config
    angModule.value('productionplanningConfigurationEngtype2eventtypeLayoutConfig', {
        'addition': {
            'grid': extendGrouping([])
        }
    });

    //engtype2eventtype Layout
    angModule.factory('productionplanningConfigurationEngtype2eventtypeLayout', Layout);
    Layout.$inject = ['basicsLookupdataConfigGenerator'];
    function Layout(basicsLookupdataConfigGenerator) {
        return {
            'fid': 'productionplanning.configuration.engtype2eventtype.detailForm',
            'version': '1.0.0',
            'showGrouping': true,
            'addValidationAutomatically': true,
            'groups': [
                {
                    gid: 'baseGroup',
                    attributes: [
                        //'eventtypefk',
                        'engtypefk'
                    ]
                },
                {
                    gid: 'entityHistory',
                    isHistory: true
                }
            ],
            'overloads': {
                engtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.engineeringtype')

            }
        };
    }

})(angular);
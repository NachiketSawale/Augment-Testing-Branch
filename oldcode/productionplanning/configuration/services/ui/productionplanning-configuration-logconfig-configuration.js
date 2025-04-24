/**
 * Created by zov on 10/17/2019.
 */
(function () {
    'use strict';
    /*global angular*/

    var moduleName = 'productionplanning.configuration';
    angular.module(moduleName).factory('ppsConfigurationLogConfigLayout', ppsConfigurationLogConfigLayout);
    ppsConfigurationLogConfigLayout.$inject = ['platformLayoutHelperService', 'basicsLookupdataLookupFilterService',
        'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupDescriptorService',
        'ppsConfigurationLogConfigTypeService', '$injector'];
    function ppsConfigurationLogConfigLayout(platformLayoutHelperService, basicsLookupdataLookupFilterService,
                                             basicsLookupdataConfigGenerator, basicsLookupdataLookupDescriptorService,
                                             logConfigTypeService, $injector) {

        var lookupInfo = createEntityTypeLookupInfo();
        var tableFilterKey = 'pps-logconfig-table-filter';
        var columnFilterKey = 'pps-logconfig-column-filter';
        var layout = platformLayoutHelperService.getMultipleGroupsBaseLayout('1.0.0', 'pps.logconfig',
            ['description', 'entityid', 'propertyid', 'entitytype', 'logconfigtype', 'ppslogreasongroupfk', 'commenttext']);
        layout.overloads = {
            entityid: {
                grid: {
                    formatter: 'lookup',
                    formatterOptions: {
                        lookupType: 'PpsDDTable',
                        displayMember: 'TableName',
                        version: 3
                    },
                    editor: 'lookup',
                    editorOptions: {
                        lookupDirective: 'pps-ddtable-lookup',
                        lookupOptions: {
                            displayMember: 'TableName',
                            filterKey: tableFilterKey
                        }
                    }
                },
                detail: {
                    type: 'directive',
                    directive: 'pps-ddtable-lookup',
                    options: {
                        displayMember: 'TableName',
                        filterKey: tableFilterKey
                    }
                }
            },
            propertyid: {
                grid: {
                    formatter: 'lookup',
                    formatterOptions: {
                        lookupType: 'PpsDDColumn',
                        displayMember: 'ColumnName',
                        version: 3
                    },
                    editor: 'lookup',
                    editorOptions: {
                        lookupDirective: 'pps-ddcolumn-lookup',
                        lookupOptions: {
                            displayMember: 'ColumnName',
                            filterKey: columnFilterKey
                        }
                    }
                },
                detail: {
                    type: 'directive',
                    directive: 'pps-ddcolumn-lookup',
                    options: {
                        displayMember: 'ColumnName',
                        filterKey: columnFilterKey
                    }
                }
            },
            ppslogreasongroupfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.ppslogreasongroup'),
            entitytype: getEntityTypeOverLoad(),
            logconfigtype: {
                grid: {
                    formatter: 'select',
                    formatterOptions: {
                        items: logConfigTypeService.getLogConfigTypes(),
                        valueMember: 'id',
                        displayMember: 'description'
                    },
                    editor: 'select',
                    editorOptions: {
                        items: logConfigTypeService.getLogConfigTypes(),
                        valueMember: 'id',
                        displayMember: 'description'
                    }
                }
            }
        };

        function createEntityTypeLookupInfo() {
            var result = {
                PPS_EVENT: {
                    lookup: createOptionsForLookup('productionplanningEventconfigurationTemplateLayout', 'eventtypefk')
                },
                PPS_ITEM: {
                    lookup: createOptionsForLookup('productionplanningItemLayout', 'itemtypefk')
                },
                TRS_REQUISITION: {
                    lookup: createOptionsForLookup('transportplanningRequisitionDetailLayout', 'eventtypefk')
                },
                ENG_TASK: {
                    lookup: createOptionsForLookup('productionplanningEngineeringTaskDetailLayout', 'eventtypefk')
                },
                PPS_PRODUCTION_SET: {
                    lookup: createOptionsForLookup('productionplanningProductionsetDetailLayout', 'eventtypefk')
                },
                TRS_ROUTE: {
                    lookup: createOptionsForLookup('transportplanningTransportLayout', 'eventtypefk')
                },
                ENG_TASK2BAS_CLERK: {
                  lookup: createOptionsForLookup('ppsEngTask2ClerkLayout', 'clerkrolefk')
                }
            };

            Object.getOwnPropertyNames(result).forEach(function (pName) {
                result[pName].column = 'EntityType';
            });

            return result;
        }

        function createOptionsForLookup(layoutName, propName) {
            var lookupGridCfg = $injector.get(layoutName).overloads[propName].grid;
            return{
                directive: lookupGridCfg.editorOptions.lookupDirective || lookupGridCfg.editorOptions.directive,
                options: lookupGridCfg.editorOptions.lookupOptions,
                formatter: lookupGridCfg.formatter,
                formatterOptions: lookupGridCfg.formatterOptions
            };
        }

        function getEntityTypeLookupInfo(key) {
            var tbName = key;
            if(typeof tbName === 'number'){ // convert ddTable ID to TABLE_NAME
                tbName = basicsLookupdataLookupDescriptorService.getLookupItem('PpsDDTable', key).TableName;
                if(lookupInfo[tbName]) {
                    lookupInfo[key] = lookupInfo[tbName];
                    lookupInfo.tableName = tbName; // just for debugging
                }
            }

            return tbName && typeof tbName === 'string' ? lookupInfo[tbName] : lookupInfo;
        }

        function getEntityTypeOverLoad() {

            var lookupInfo = getEntityTypeLookupInfo();

            return {
                detail: {
                    type: 'directive',
                    directive: 'pps-dynamic-grid-and-form-lookup',
                    options: {
                        isTextEditable: false,
                        dependantField: 'EntityId',
                        lookupInfo: lookupInfo,
                        grid: false,
                        dynamicLookupMode: true,
                        showClearButton: true
                    }
                },
                grid: {
                    editor: 'dynamic',
                    formatter: 'dynamic',
                    domain: function (item, column, flag) {
                        var info = item.EntityId ? getEntityTypeLookupInfo(item.EntityId) : undefined;
                        if (info) {
                            column.editorOptions = {
                                directive: 'pps-dynamic-grid-and-form-lookup',
                                dependantField: 'EntityId',
                                lookupInfo: lookupInfo,
                                isTextEditable: false,
                                dynamicLookupMode: true,
                                grid: true,
                                showClearButton: true
                            };
                            column.formatterOptions = info.lookup.formatterOptions;
                            if (!column.formatterOptions) {
                                var prop = info.lookup.options;
                                column.formatterOptions = {
                                    lookupSimpleLookup: prop.lookupSimpleLookup,
                                    lookupModuleQualifier: prop.lookupModuleQualifier,
                                    lookupType: prop.lookupType,
                                    valueMember: 'Id',
                                    displayMember: prop.displayMember,
                                    dataServiceName: prop.dataServiceName,
                                    version: prop.version,
                                    imageSelector: prop.imageSelector
                                };
                            }
                        } else {
                            column.editorOptions = {readonly: true};
                            column.formatterOptions = null;
                        }

                        return flag ? 'directive' : 'lookup';
                    }
                }
            };
        }

        var excludeColumnNames = ['ID', 'WHOISR', 'INSERTED', 'WHOUPD', 'UPDATED'];
        var enableLoggingTables = ['MNT_REQUISITION', 'PPS_ITEM', 'PPS_EVENT', 'TRS_REQUISITION', 'TRS_ROUTE', 'PPS_PRODUCTION_SET', 'ENG_TASK', 'ENG_TASK2BAS_CLERK'];

        basicsLookupdataLookupFilterService.registerFilter([{
            key: columnFilterKey,
            fn: function (lookupItem, entity) {
                return lookupItem.BasDdTableFk === entity.EntityId && !lookupItem.IsRelationSet &&
                    excludeColumnNames.indexOf(lookupItem.ColumnName) < 0;
            }
        }, {
            key: tableFilterKey,
            fn: function (lookupItem) {
                return enableLoggingTables.indexOf(lookupItem.TableName) > -1;
            }
        }]);

        return layout;
    }
})();
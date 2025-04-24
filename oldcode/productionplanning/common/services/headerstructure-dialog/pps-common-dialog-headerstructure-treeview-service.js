/**
 * Created by lid on 7/27/2017.
 */

/* global globals, angular */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.common';

    angular.module(moduleName).value('ppsCommonDialogHeaderStructureTreeviewColumns', {
        getStandardConfigForListView: function () {
            return {
                columns: [
                    {
                        id: 'code',
                        field: 'Code',
                        name: 'Code',
                        name$tr$: 'cloud.common.entityCode',
                        readonly: true,
                        editor: null
                    },
                    {
                        id:'rowdes',
                        field:'RowDes',
                        name:'Row Description',
                        readonly:true,
                        name$tr$: 'productionplanning.common.headerstructure.rowDes',
                        editor:null,
                        width:120
                    },
                    {
                        id: 'description',
                        field: 'DescriptionInfo',
                        name: 'Description',
                        name$tr$: 'cloud.common.entityDescription',
                        formatter: 'translation',
                        editor: null,
                        readonly: true,
                        width: 300
                    }
                ]
            };
        }
    });

    angular.module(moduleName).factory('ppsCommonDialogHeaderStructureTreeviewService',PpsCommonDialogHeaderStructureTreeviewService);
    PpsCommonDialogHeaderStructureTreeviewService.$inject=['treeviewListDialogTreeviewFactoryService', 'ppsCommonHeaderStructureImageProcessor',
        'ServiceDataProcessArraysExtension'];
    function PpsCommonDialogHeaderStructureTreeviewService(treeviewListDialogTreeviewFactoryService, ppsCommonHeaderStructureImageProcessor,
                                                ServiceDataProcessArraysExtension ) {

        var moduleId='qwertyuiopasdfghjklzxcvbnm789654';

        var serviceOptions = {
            hierarchicalRootItem: {
                module: angular.module(moduleName),
                serviceName: 'treeviewListDialogHeaderStructureTreeviewService',
                httpRead: { route: globals.webApiBaseUrl + 'productionplanning/common/headerstructure/', endRead: 'tree', usePostForRead: true },
                actions: {},
                presenter: {
                    tree: {
                        parentProp: 'ParentFk',
                        childProp: 'ChildItems',
                        childSort : true, isDynamicModified : true
                    }

                },
                dataProcessor: [new ServiceDataProcessArraysExtension(['ChildItems']), ppsCommonHeaderStructureImageProcessor, {processItem: processData}],
                useItemFilter: true,
                entityRole: {
                    root: {
                        codeField: 'ParentFk',
                        itemName: 'HeaderStructureV',
                        moduleName: moduleName
                    }
                }
            }
        };

        var service= treeviewListDialogTreeviewFactoryService.getService(moduleId,serviceOptions);

        function processData() {
            return service.processData;
        }

        return service;

    }
})(angular);
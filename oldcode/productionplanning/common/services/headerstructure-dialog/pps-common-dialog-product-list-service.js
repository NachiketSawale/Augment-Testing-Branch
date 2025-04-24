/**
 * Created by lid on 7/26/2017.
 */
(function (angular) {
    'use strict';

    var moduleName = 'productionplanning.common';

    angular.module(moduleName).value('ppsCommonDialogProductListColumns', {
        getStandardConfigForListView: function () {
            return {
                columns: [
                    {
                        id: 'code',
                        field: 'Code',
                        name: 'Code',
                        name$tr$: 'cloud.common.entityCode',
                        readonly: true,
                        sortable: true,
                        editor: null

                    },
                    {
                        id: 'description',
                        field: 'DescriptionInfo',
                        name: 'Description',
                        name$tr$: 'cloud.common.entityDescription',
                        formatter: 'translation',
                        editor: null,
                        sortable: true,
                        readonly: true
                    },
                    {
                        id: 'productionset',
                        field: 'ProductionSetFk',
                        name: 'Production Set',
                        name$tr$: 'productionplanning.common.product.productionSetFk',
                        readonly: true,
                        editor: null,
                        formatter: 'lookup',
                        sortable: true,
                        formatterOptions: {
                            lookupType:'ProductionsetLookup',
                            displayMember: 'DescriptionInfo.Translated',
                            version: 3
                        }
                    }
                ]
            };
        }
    });

    angular.module(moduleName).factory('ppsCommonDialogProductListService',PpsCommonDialogProductListService);
    PpsCommonDialogProductListService.$inject=['$http', '$log', '$q', '$injector', 'PlatformMessenger', 'treeviewListDialogListFactoryService', 'ppsCommonDialogHeaderStructureTreeviewService'];
    function PpsCommonDialogProductListService($http, $log, $q, $injector, PlatformMessenger, treeviewListDialogListFactoryService, treeviewService) {

        var moduleId='qwertyuiopasdfghjklzxcvbnm123456';
        var serviceOptions = {
            flatRootItem: {
                module: angular.module(moduleName),
                serviceName: 'treeviewListDialogProductListService',
                httpRead: { route: globals.webApiBaseUrl + 'productionplanning/common/product/', endRead: 'listForHeaderStructure' },
                actions: {},
                entityRole: { leaf: { itemName: 'Product', parentService: treeviewService, parentFilter: 'headerStructureFk' } }
            }
        };
        //add  getUrlFilter for fixing error about "c.getUrlFilter is not a function" in treeviewListDialogListFactoryService
        serviceOptions.getUrlFilter = function getUrlFilter() {
            return '';
        };
        var treeviewConfig={
            treeviewService:treeviewService,
            foreignKeyName:'ProductDescriptionFk'
        };
        return treeviewListDialogListFactoryService.getService(moduleId,serviceOptions,treeviewConfig);

    }
})(angular);
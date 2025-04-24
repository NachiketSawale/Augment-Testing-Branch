/*
 * Copyright(c) RIB Software GmbH
 */
/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
    'use strict';
    let moduleName = 'estimate.assemblies';
    /**
     * @ngdoc directive
     * @name estimateAssembliesTransferMaterialGrid
     * @element div
     * @restrict A
     * @description Shows a grid in which users can select model reference types.
     */
    angular.module(moduleName).directive('estimateAssembliesTransferMaterialGrid', ['$compile', '$timeout',
        'platformGridAPI', 'platformTranslateService','$injector','basicsLookupdataLookupFilterService','basicsLookupdataLookupDescriptorService','$translate',
        function ($compile, $timeout, platformGridAPI, platformTranslateService,$injector,basicsLookupdataLookupFilterService,basicsLookupdataLookupDescriptorService,$translate) {

            let additionalPriceVersions=[{
                Id: -1,
                PriceListFk: -1,
                PriceListDescription:$translate.instant('estimate.assemblies.transferCostcodeOrMaterialWizard.materialBaseVersion'),
                MaterialPriceVersionDescriptionInfo: {
                    Description: $translate.instant('estimate.assemblies.transferCostcodeOrMaterialWizard.materialBaseVersion'),
                    Translated: $translate.instant('estimate.assemblies.transferCostcodeOrMaterialWizard.materialBaseVersion')
                }
            }];
            return {
                restrict: 'A',
                scope: {
                    model: '='
                },
                link: function ($scope, elem) {
                    $scope.gridId = 'w9h873c1e65047k432k1959e8533d2fo';
                    $scope.gridData = {
                        state: $scope.gridId
                    };

                    if (platformGridAPI.grids.exist($scope.gridId)) {
                        platformGridAPI.grids.unregister($scope.gridId);
                    }

                    var grid = {
                        data: [],
                        lazyInit: true,
                        enableConfigSave: false,
                        columns: [{
                            id: 'checked',
                            name$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.checked',
                            formatter: 'boolean',
                            editor: 'boolean',
                            field: 'IsSelected',
                            isTransient: true,
                            headerChkbox: true,
                            readonly: false,
                            width: 110
                        }, {
                            id: 'code',
                            name$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.code',
                            formatter: 'description',
                            field: 'Code',
                            width: 120,
                            readonly: true
                        }, {
                            id: 'priceversion',
                            field: 'MaterialPriceVerFk',
                            name$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.priceVersion',
                            editor: 'lookup',
                            editorOptions: {
                                directive: 'basics-material-catalog-price-version-lookup',
                                lookupOptions: {
                                    filterKey: 'project-material-transfer-price-version-filter',
                                    valueMember: 'Id',
                                    displayMember: 'MaterialPriceVersionDescriptionInfo.Translated',
                                    lookupType: 'MaterialPriceVersion',
                                    showClearButton: true,
                                    additionalData:additionalPriceVersions,
                                    events: [
                                        {
                                            name: 'onSelectedItemChanged',
                                            handler: function (e, args) {
                                                if (args && args.entity && args.entity.MaterialPriceList && args.selectedItem) {
                                                    let priceVersion = args.entity.MaterialPriceList.find(e => e.PriceVersionFk === args.selectedItem.Id);
                                                    if(priceVersion){
                                                        args.entity.MdcPriceListFK = priceVersion.Id;
                                                        args.entity.PriceList = priceVersion.PriceList;
                                                    }
                                                }
                                                else if(!args.selectedItem){
                                                    args.entity.MdcPriceListFK = null;
                                                    args.entity.PriceList = null;
                                                }
                                            }
                                        }
                                    ]
                                }
                            },
                            formatter: 'lookup',
                            formatterOptions: {
                                lookupType: 'MaterialPriceVersion',
                                displayMember: 'MaterialPriceVersionDescriptionInfo.Translated'
                            },
                            width: 200
                        }, {
                            id: 'pricelist',
                            field:'PriceList',
                            name$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.pricelist',
                            name: 'Price List',
                            formatter: 'description',
                            width: 200,
                            readonly: true
                        }
                        ],
                        id: $scope.gridId,
                        options: {
                            skipPermissionCheck: true,
                            tree: false,
                            indicator: false,
                            idProperty: 'Id'
                        }
                    };

                    function init() {
                        basicsLookupdataLookupDescriptorService.updateData('materialpriceversion',additionalPriceVersions);
                    }
                    init();
                    platformTranslateService.translateObject(grid.columns, 'name');
                    platformGridAPI.grids.config(grid);

                    elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));
                    var filters = [
                        {
                            key: 'project-material-transfer-price-version-filter',
                            serverSide: false,
                            fn: function (item,entity) {
                                if (item && entity) {
                                    let priceVersion = entity.MaterialPriceList.find(e => e.PriceVersionFk === item.Id);
                                    if (priceVersion) {
                                        return true;
                                    }
                                    return false;
                                }
                            }
                        }
                    ];

                    basicsLookupdataLookupFilterService.registerFilter(filters);
                    platformGridAPI.items.data($scope.gridId, $scope.model);
                    $scope.$watch('model', function (newValue) {
                        platformGridAPI.items.data($scope.gridId, newValue);
                        platformGridAPI.grids.refresh($scope.gridId);
                    });
                }
            };
        }]);
})();

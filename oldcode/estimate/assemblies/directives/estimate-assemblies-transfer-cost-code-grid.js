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
     * @name estimateAssembliesTransferCostCodeGrid
     * @element div
     * @restrict A
     * @description Shows a grid in which users can select model reference types.
     */
    angular.module(moduleName).directive('estimateAssembliesTransferCostCodeGrid', ['$compile', '$timeout',
        'platformGridAPI', 'platformTranslateService', '$injector','basicsLookupdataLookupDescriptorService','$translate',
        function ($compile, $timeout, platformGridAPI, platformTranslateService,$injector,basicsLookupdataLookupDescriptorService,$translate) {

            let additionalPriceVersions=[{
                Id: -1,
                PriceListFk: -1,
                PriceListDescription:$translate.instant('estimate.assemblies.transferCostcodeOrMaterialWizard.costCodeBaseVersion'),
                DescriptionInfo: {
                    Description: $translate.instant('estimate.assemblies.transferCostcodeOrMaterialWizard.costCodeBaseVersion'),
                    Translated: $translate.instant('estimate.assemblies.transferCostcodeOrMaterialWizard.costCodeBaseVersion')
                }
            }];
            return {
                restrict: 'A',
                scope: {
                    model: '='
                },
                link: function ($scope, elem) {
                    $scope.gridId = 'f9h772c1e65047e432k1959e8563d1fb';
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
                            name$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.priceVersion',
                            editor: 'lookup',
                            editorOptions: {
                                directive: 'basics-cost-codes-price-version-lookup',
                                lookupOptions: {
                                    filterKey: 'project-main-costcodes-price-price-version-filter',
                                    valueMember: 'Id',
                                    displayMember: 'DescriptionInfo.Translated',
                                    lookupType: 'CostCodePriceVersion',
                                    showClearButton: true,
                                    additionalData: $injector.get('projectCostCodesPriceListForJobDataService').additionalPriceVersions,
                                    events: [
                                        {
                                            name: 'onSelectedItemChanged',
                                            handler: function (e, args) {
                                                if (args && args.entity && args.selectedItem) {
                                                    let priceList = args.entity.PriceListForUpdate.find(e => e.PriceVersionFk === args.selectedItem.Id);
                                                    if(priceList){
                                                        args.entity.MdcPriceListFK = priceList.Id;
                                                        args.entity.PriceList = priceList.PriceVersion;
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
                                lookupType: 'CostCodePriceVersion',
                                displayMember: 'DescriptionInfo.Translated'
                            },
                            field: 'CostCodePriceVerFk',
                            width: 200
                        }, {
                            id: 'pricelist',
                            field:'PriceList',
                            name$tr$: 'estimate.assemblies.transferCostcodeOrMaterialWizard.pricelist',
                            name: 'Price List',
                            formatter: 'description',
                            width: 200
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
                        basicsLookupdataLookupDescriptorService.updateData('costcodepriceversion',additionalPriceVersions);
                    }
                    init();

                    platformTranslateService.translateObject(grid.columns, 'name');
                    platformGridAPI.grids.config(grid);

                    elem.append($compile('<div class="flex-box flex-column"><div data-platform-Grid class="subview-container flex-basis-auto" data="gridData"></div></div>')($scope));

                    platformGridAPI.items.data($scope.gridId, $scope.model);
                    $scope.$watch('model', function (newValue) {
                        platformGridAPI.items.data($scope.gridId, newValue);
                    });
                }
            };
        }]);
})();

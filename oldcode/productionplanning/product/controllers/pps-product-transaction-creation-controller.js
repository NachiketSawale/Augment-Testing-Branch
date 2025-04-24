/**
 * Created by zov on 8/1/2019.
 */
(function () {
    'use strict';
    /*global angular*/
    var moduleName = 'productionplanning.product';
    angular.module(moduleName).controller('ppsProductTransactionCreationController', ppsProductTransactionController);
    ppsProductTransactionController.$inject = ['$scope',
        'platformTranslateService',
        '$translate'];

    function ppsProductTransactionController($scope,
                                             platformTranslateService,
                                             $translate) {
        var createItemFormCfg;

        $scope.customBtn1 = $scope.customBtn2 = false;
        $scope.showOkButton = $scope.showCancelButton = true;

        $scope.dataItem = {
            PrjStockFk: 0,
            MdcMaterialFk: 0
        };

        $scope.modalOptions = {
            isDisabled: function (button) {
                var disable = false;
                if (button === 'ok') {
                    var dataItem = $scope.dataItem;
                    disable = !dataItem.PrjStockFk || !dataItem.MdcMaterialFk;
                }
                return disable;
            }
        };

        $scope.onOK = function () {
            $scope.$close($scope.dataItem);
        };

        $scope.onCancel = function () {
            $scope.$close(false);
        };

        $scope.formContainerOptions = {
            formOptions: {configure: getFromCfg4CreateItem()},
            setTools: function () {
            }
        };

        //adjust latest template
        _.extend($scope.modalOptions, {
            headerText: $translate.instant('productionplanning.producttemplate.createPdtTransactionDialogTitle'),
            cancel: $scope.onCancel
        });


        function getFromCfg4CreateItem() {
            if (!createItemFormCfg) {
                createItemFormCfg = {
                    fid: 'productionplanning.item.createItemModal',
                    version: '1.0.0',
                    showGrouping: false,
                    groups: [
                        {
                            gid: 'baseGroup'
                        }
                    ],
                    rows: [
                        {
                            gid: 'baseGroup',
                            type: 'directive',
                            directive: 'basics-lookupdata-lookup-composite',
                            rid: 'prjstockfk',
                            model: 'PrjStockFk',
                            sortOrder: 1,
                            label: 'Stock',
                            label$tr$: 'procurement.stock.moduleName',
                            options: {
                                descriptionField: 'Description',
                                descriptionMember: 'Description',
                                lookupDirective: 'basics-site-stock-lookup-dialog',
                            },
                            required: true
                        },
                        {
                            gid: 'baseGroup',
                            type: 'directive',
                            rid: 'mdcmaterialfk',
                            model: 'MdcMaterialFk',
                            sortOrder: 2,
                            label: 'Material Code',
                            label$tr$: 'procurement.stock.stocktotal.MdcMaterialFk',
                            directive: 'basics-material-material-lookup',
                            required: true
                        }
                    ]
                };
                platformTranslateService.translateFormConfig(createItemFormCfg);
            }

            return createItemFormCfg;
        }
    }
})();
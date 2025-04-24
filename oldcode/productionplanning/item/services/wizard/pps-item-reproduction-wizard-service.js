/**
 * Created by las on 10/9/2019.
 */

(function (angular) {
    'use strict';
    /* global angular, moment, Slick, globals, _ */
    var moduleName = 'productionplanning.item';

    angular.module(moduleName).factory('productionplanningItemReproductionWizardService', reproductionWizardService);
    reproductionWizardService.$inject = ['$http', '$injector', 'platformTranslateService', 'platformGridAPI', 'productionplanningItemDataService', 'basicsLookupdataLookupDescriptorService',
    '$translate', 'productionplanningItemReproductionReasonLookupService','platformModalService'];

    function reproductionWizardService($http, $injector, platformTranslateService, platformGridAPI, itemDataService, lookupDescriptorService,
                                       $translate, reproductionReasonLookupService,platformModalService) {

        var service = {};

        function getFormConfig() {
            //get the data from basics.customize

            return {
                fid: 'productionplanning.item.reproduction',
                showGrouping: false,
                groups: [
                    {
                        gid: 'baseGroup'
                    }
                ],
                rows: [
                    {
                        gid: 'baseGroup',
                        rid: 'reason',
                        model: 'Reason',
                        sortOrder: 1,
                        label$tr$: 'productionplanning.item.wizard.reproduction.reason',
                        type: 'directive',
                        directive: 'basics-lookupdata-simple',
                        options: {
                            lookupDirective: 'basics.customize.ppsreproductionreason',
	                        valueMember: 'Id',
                            displayMember: 'Description',
	                        lookupModuleQualifier:'basics.customize.ppsreproductionreason',
                        }
                    },
                    {
                        gid: 'baseGroup',
                        rid: 'deliveryDate',
                        model: 'DeliveryDate',
                        sortOrder: 2,
                        label$tr$: 'productionplanning.item.wizard.reproduction.deliveryStart',
                        type: 'dateutc',
                        editor: 'dateutc'
                    }
                ]
            };
        }

        function getGridConfig($scope) {
            _.forEach($scope.products, function (product) {
                product.Checked = false;
                product.ReusableWidth = 0;
                product.ReusableLength = 0;
            });
            return {
                id: '86f916478f814b7e9d7402b8838302c9',
                state: '86f916478f814b7e9d7402b8838302c9',
                columns: [
                    {
                        id: 'Checked',
                        field: 'Checked',
                        model: 'Checked',
                        formatter: 'boolean',
                        editor: 'boolean',
                        name$tr$: 'productionplanning.item.wizard.reproduction.reproduce',
                        width: 80
                    },
                    {
                        id: 'stack',
                        field: 'EngineeringStackCode',
                        name: 'stack',
                        formatter: 'code',
                        name$tr$: 'productionplanning.item.wizard.reproduction.stack',
                        width: 100
                    },
                    {
                        id: 'Code',
                        field: 'Code',
                        name: 'Code',
                        formatter: 'code',
                        name$tr$: 'productionplanning.item.wizard.reproduction.element',
                        width: 120
                    },
	                {
		                id: 'width',
		                field: 'Width',
		                name: 'width',
		                formatter: 'decimal',
		                editor: null,
		                name$tr$: 'productionplanning.item.wizard.reproduction.width',
		                width: 100,
		                hidden: !$scope.isReusable
	                },
	                {
		                id: 'newWidth',
		                field: 'ReusableWidth',
		                name: 'newWidth',
		                formatter: 'decimal',
		                editor: 'decimal',
		                name$tr$: 'productionplanning.item.wizard.reproduction.newWidth',
		                width: 100,
		                hidden: !$scope.isReusable
	                },
	                {
		                id: 'length',
		                field: 'Length',
		                name: 'length',
		                formatter: 'decimal',
		                editor: null,
		                name$tr$: 'productionplanning.item.wizard.reproduction.length',
		                width: 100,
		                hidden: !$scope.isReusable
	                },
	                {
		                id: 'newLength',
		                field: 'ReusableLength',
		                name: 'newLength',
		                formatter: 'decimal',
		                editor: 'decimal',
		                name$tr$: 'productionplanning.item.wizard.reproduction.newLength',
		                width: 100,
		                hidden: !$scope.isReusable
	                }

                ],
                options: {
                    indicator: true,
                    selectionModel: new Slick.RowSelectionModel()
                },
                data: $scope.products
            };
        }


        function createItemData($scope) {
	        var selected = itemDataService.getSelected();
	        if(_.isNil(selected)){
	            return {};
            }
            //var drawing = lookupDescriptorService.getLookupItem('EngDrawing', selected.EngDrawingDefFk);
            var quantity = 0;
            _.forEach($scope.products, function (product) {
                if (product.Checked === true) {
                    quantity += product.Area;
                }
            });

            var ppsItemStatusId = 1;
            var ppsItemStatus;
            var ppsItemStatuses = lookupDescriptorService.getData('basics.customize.ppsitemstatus');
            if (!_.isNil(ppsItemStatuses)) {
                if (!withoutEngineering($scope.entity.Reason)) {
                    ppsItemStatus = _.find(ppsItemStatuses, function (status) { return status.Userflag1 === true; });
                    if (!_.isNil(ppsItemStatus)) {
                        ppsItemStatusId = ppsItemStatus.Id;
                    }
                } else {
                    ppsItemStatus = _.find(ppsItemStatuses, function (status) { return status.Userflag2 === true; });
                    if (!_.isNil(ppsItemStatus)) {
                        ppsItemStatusId = ppsItemStatus.Id;
                    }
                }
            }

            if (selected) {
                return {
                    eventsEndDate: moment.utc($scope.entity.DeliveryDate),
                    MaterialGroupFk: selected.MaterialGroupFk,
                    MdcMaterialFk: selected.MdcMaterialFk,
                    SiteFk: selected.SiteFk,
                    Quantity: quantity,
                    PPSItemOriginFk: selected.Id,
                    PPSItemStatusFk: ppsItemStatusId,
                    ItemTypeFk: 1,
                    PPSHeaderFk: selected.PPSHeaderFk,
                    ClerkTecFk: selected.ClerkTecFk,
                    UomFk: selected.UomFk,
                    Code: selected.Code + '-RP',
                    LgmJobFk: selected.LgmJobFk,
                    IsLive: 1,
                    PPSReprodReasonFk: $scope.entity.Reason,
                    Reference: 1,
                    ProjectFk : selected.ProjectFk,
                    PrjLocationFk: selected.PrjLocationFk,
                    BusinessPartnerFk : selected.BusinessPartnerFk,
                    BusinessPartnerOrderFk: selected.BusinessPartnerOrderFk,
                    IsLeaf: 1
                };
            }
        }

        function withoutEngineering(reasonId) {
            if(reasonId > 0){
                var reason =  lookupDescriptorService.getLookupItem('basics.customize.ppsreproductionreason', reasonId);
                if(reason === undefined || reason === null){
                    return undefined;
                }
                return !reason.IsWithEngineering;
            }
            return undefined;
        }

        service.initial = function initial($scope, $options) {
            _.extend($scope, $options);

            var filterFormConfig = getFormConfig();
            $scope.formOptions = { configure: platformTranslateService.translateFormConfig(filterFormConfig) };
            $scope.entity = {DeliveryDate: !$options.deliveryDate ? null : moment.utc($options.deliveryDate)};

            var gridConfig = getGridConfig($scope);
            gridConfig.columns.current = gridConfig.columns;
            platformGridAPI.grids.config(gridConfig);
            $scope.grid = gridConfig;

            if(!$scope.isReusable){
	            $scope.alerts = [{
		            title: $translate.instant('productionplanning.item.wizard.reproduction.alertTitle'),
		            message: $translate.instant('productionplanning.item.wizard.reproduction.noFittingHeader'),
		            css: 'alert-info'
	            }];
            }

	        let okDisabledByReason = function okDisabledByReason(){
		        if($scope.entity.Reason === undefined){
			        return true;
		        }
		        else if(withoutEngineering($scope.entity.Reason) === true){

			        return !(_.some($scope.grid.data, {Checked: true} ));
		        }
		        else{
			        return false;
		        }
	        };

            $scope.isOKDisabled = function () {
                return _.isNil($scope.entity.DeliveryDate) || okDisabledByReason();
            };

            $scope.handleOK = function () {
	            platformGridAPI.grids.commitEdit($scope.grid.id); // commit changes
                var data = createItemData($scope);
                var selected = _.clone(itemDataService.getSelected());
                var withoutEng = withoutEngineering($scope.entity.Reason);
                if(withoutEng === true){
                    data.EngDrawingDefFk =  !selected ? null : selected.EngDrawingDefFk;
                }
                var productsCopy = [];
                if($scope.grid.data.length > 0) {
                    _.forEach($scope.grid.data, function (product) {
                        if (product.Checked === true) {
                            productsCopy.push({Id:product.Id, width: product.ReusableWidth, length:product.ReusableLength});
                        }
                    });
                }

                $http.post(globals.webApiBaseUrl + 'productionplanning/item/createitemforreproduction', data).then(function (respone) {
	                var newItem = respone.data.Main[0];

	                var postData = {ppsItemFk: newItem.Id, Products: productsCopy, withoutEng: withoutEng};
	                $http.post(globals.webApiBaseUrl + 'productionplanning/common/product/reproductionproducts', postData).then(function (reproductionInfo) {
		                itemDataService.createSucceededwithWizard(newItem, data);
		                let reusableCounts = _.filter(productsCopy, function (product) {
			                return product.length > 0 || product.width > 0;
		                });
		                if (reusableCounts.length > 0) {
			                if (productsCopy.length === reproductionInfo.data.length) {
				                let successItems = $translate.instant('productionplanning.item.wizard.reproduction.msgCreatedSuccessfully');//'Reusable products successfully created as bellow:';
				                successItems += '<br>';
				                _.forEach(reproductionInfo.data, function (reusableItem) {
					                successItems += 'Product: ' + reusableItem.product.Code + ' -> ' + 'Planning Unit: ' + reusableItem.item.Code + '<br>';
				                });
				                platformModalService.showMsgBox($translate.instant('productionplanning.item.wizard.reproduction.msgAllCreatedSuccessfully') + successItems, '', 'info');
			                } else {
				                if (reproductionInfo.data.length > 0) {
					                let successItems = $translate.instant('productionplanning.item.wizard.reproduction.msgCreatedSuccessfully');
					                successItems += '<br>';
					                _.forEach(reproductionInfo.data, function (reusableItem) {
						                successItems += 'Product: ' + reusableItem.product.Code + ' -> ' + 'Planning Unit: ' + reusableItem.item.Code + '<br>';
					                });
					                successItems += $translate.instant('productionplanning.item.wizard.reproduction.msgSomeCreatedFailed');
					                platformModalService.showMsgBox(successItems, '', 'warning');
				                } else {
					                platformModalService.showMsgBox($translate.instant('productionplanning.item.wizard.reproduction.msgAllCreatedFailed'), '', 'warning');
				                }
			                }
		                }
	                });
                });

                $scope.$close(true);
            };

            $scope.modalOptions = {
                headerText: $translate.instant('productionplanning.item.wizard.reproduction.reproductionDlgTitle'),
                cancel: close
            };

            function close() {
                return $scope.$close(false);
            }
        };

        return service;
    }

})(angular);

(function (angular) {
		'use strict';
		/*global globals, angular, _*/
		var moduleName = 'productionplanning.drawing';
		angular.module(moduleName).factory('ppsDrawingPickComponentsService', PpsDrawingPickComponentsService);
	PpsDrawingPickComponentsService.$inject = [
			'$injector',
			'$http',
			'$translate',
			'platformTranslateService',
			'platformGridAPI',
			'platformModalService',
			'ppsCommonGridToolbarBtnService',
		   'productionplanningDrawingComponentDataService',
			'ppsDrawingPickComponentsUIStandardService'];

		function PpsDrawingPickComponentsService(
			$injector,
			$http,
			$translate,
			platformTranslateService,
			platformGridAPI,
			platformModalService,
			gridToolbarBtnService,
			drawingComponentDataService,
			pickComponentsUIStandardService) {
			var service = {};
			service.showDialog = function (selected){
				function showPickupComponentsDialog(mdcComponents) {
					var modalCreateConfig = {
						width: '80%',
						height: '80%',
						resizeable: true,
						templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-pick-components-dialog.html',
						controller: 'ppsDrawingPickComponentsController',
						resolve: {
							'$options': function () {
								return {
									parentItem: selected,
									mdcComponents: mdcComponents
								};
							}
						}
					};
					platformModalService.showDialog(modalCreateConfig);
				}

				function getDrwCompBillQtyInfoRequest(mdcComponents) {
					const materialIds = Array.from(new Set(mdcComponents.map(e => e.MdcMaterialFk).filter(e => !_.isNil(e))));
					const costCodeIds = Array.from(new Set(mdcComponents.map(e => e.MdcCostCodeFk).filter(e => !_.isNil(e))));
					const request = {
						PPSHeaderId: selected.PPSHeaderFk,
						PUId: selected.Id,
						MaterialIds: materialIds,
						CostCodeIds: costCodeIds
					}
					return request;
				}

				function processCompsForBillQty(response2, mdcComponents) {
					if (response2.data) {
						const materialIdToBillingQtyFactor = response2.data.MaterialIdToBillingQtyFactor;
						const costCodeIdToBillingQtyFactor = response2.data.CostCodeIdToBillingQtyFactor;
						mdcComponents.forEach(comp => {
							if (comp.MdcMaterialFk) {
								comp.BillQtyFactor = materialIdToBillingQtyFactor[comp.MdcMaterialFk] ?? 1;
							} else if (comp.MdcCostCodeFk) {
								comp.BillQtyFactor = costCodeIdToBillingQtyFactor[comp.MdcCostCodeFk] ?? 1;
							}
							// comp.IsProportionalBill = true;
							//comp.BillingQuantity = comp.Quantity * comp.BillQtyFactor;
						});
					}
				}

				if (selected) {
					var proDescId = selected.ProductDescriptionFk;
					$http.get(globals.webApiBaseUrl + 'productionplanning/ppsmaterial/mdcdrawingcomponent/listbyprodesId?ProductDescriptionFk=' + proDescId)
						.then(function (response) {
							let mdcComponents = [];
							if (response.data && response.data.length > 0) {
								mdcComponents = response.data;
								const request = getDrwCompBillQtyInfoRequest(mdcComponents);
								$http.post(globals.webApiBaseUrl + 'productionplanning/formulaconfiguration/plannedquantity/getdrwcomponentsbillingqtyinforesult', request)
									.then(function (response2) {
										processCompsForBillQty(response2, mdcComponents);
										showPickupComponentsDialog(mdcComponents);
									});
							} else {
								showPickupComponentsDialog(mdcComponents);
							}
						});
				}
				else{
					platformModalService.showErrorBox('productionplanning.item.wizard.moreItemsWarn',
						'productionplanning.item.upstreamItemSplit.dialogTitle', 'warning');
				}
			};

			service.initial = function ($scope, $options){
				_.extend($scope, $options);
				_.forEach($scope.mdcComponents, function (mdcComponent) {
					mdcComponent.Checked = false;
				});
				let gridConfig = pickComponentsUIStandardService.getGridConfig();
				gridConfig.data = $scope.mdcComponents;
				gridConfig.columns.current = gridConfig.columns;
				$scope.grid = gridConfig;
				$scope.grid.gridId = $scope.grid.state;
				$scope.tempLookupControllerForLayoutBtns = gridToolbarBtnService.addToolsIncludesLayoutBtns($scope.grid);
				if (!platformGridAPI.grids.exist($scope.grid.gridId)) {
					platformGridAPI.grids.config(gridConfig);
				}

				$scope.isOKDisabled = function () {
					var checkItems = _.filter($scope.grid.data, function (mdcComp){
						return mdcComp.Checked === true;
					});
					if(!_.isNil(checkItems) && checkItems.length > 0){
						return false;
					}
					return true;
				};

				$scope.handleOK = function () {
					platformGridAPI.grids.commitAllEdits();
					const drwCompCreationInfoArray = $scope.grid.data.filter(e => e.Checked === true)
						.map(mdcComp => {
							return {
								MdcDrawingComponentId: mdcComp.Id,
								Quantity: mdcComp.Quantity,
								Quantity2: mdcComp.Quantity2,
								Quantity3: mdcComp.Quantity3,
								BillingQuantity: mdcComp.BillingQuantity
							};
						});
					if(drwCompCreationInfoArray.length > 0){
						const postData = {proDesId: $scope.parentItem.ProductDescriptionFk, creationInfoes: drwCompCreationInfoArray};
						$http.post(globals.webApiBaseUrl + 'productionplanning/drawing/component/createbymdccomponent', postData).then(function (response) {
							var engComponents = response.data;
							var drawingService = drawingComponentDataService.getService({'serviceKey': 'productionplanning.item.component'});
							var flatItems = drawingService.getUnfilteredList();
							_.forEach(engComponents, function (entity){
								flatItems.push(entity);
							});
							drawingService.markEntitiesAsModified(engComponents);
							drawingService.gridRefresh();
						});
					}
					$scope.$close(true);
				};

				$scope.modalOptions = {
					headerText: $translate.instant('productionplanning.drawing.pickComponents.dialogTitle'),
					cancel: function (){
					$scope.$close(false);
					}
				};
			};
			return service;
			}
		})(angular);
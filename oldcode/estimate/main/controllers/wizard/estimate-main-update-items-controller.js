/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).controller('estimateMainUpdateItemsController', ['_', '$scope','$sce','$translate','$timeout', '$http', 'platformGridAPI', 'platformRuntimeDataService', 'platformTranslateService', 'platformFormConfigService', 'estimateMainUpdateItemsService', 'estimateMainService',
		function (_, $scope, $sce, $translate,$timeout, $http, platformGridAPI, platformRuntimeDataService, platformTranslateService, platformFormConfigService, estimateMainUpdateItemsService, estimateMainService) {

			$scope.trustAsHtml = $sce.trustAsHtml;
			$scope.optionalWarning = $translate.instant('estimate.main.bidCreationWizard.optionalBoqWarning');

			$scope.path = globals.appBaseUrl;
			$scope.modalOptions.headerText = estimateMainUpdateItemsService.getDialogTitle();
			$scope.dataItem = $scope.entity = estimateMainUpdateItemsService.getDataItem();

			$scope.formOptions = {
				configure: estimateMainUpdateItemsService.getFormConfiguration($scope)
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};


			$scope.optionalGridId = '402e0a30c8a54a90b3af9ec03d591329';
			$scope.isShowOptionalWarning=false;

			let isGetLineItemQtyTotalToStr = $scope.$parent.modalOptions.options && $scope.$parent.modalOptions.options.isGetLineItemQtyTotalToStr;

			$scope.getLineItemQtyTotalInfo = {
				show: $scope.dataItem.updBoq && isGetLineItemQtyTotalToStr,
				messageCol: 1,
				message: $translate.instant('estimate.main.getLineItemQuantityTotalTo'),
				iconCol: 1,
				type: 2
			};


			configOptionalGrid();

			$scope.$broadcast('form-config-updated', {});
			refreshOptionalGrid();

			$scope.refreshForm = function(){
				$scope.formOptions.configure = estimateMainUpdateItemsService.getFormConfiguration($scope);
				platformFormConfigService.initialize($scope.formOptions, $scope.formOptions.configure);
				$scope.getLineItemQtyTotalInfo.show = $scope.dataItem.updBoq && isGetLineItemQtyTotalToStr;
				$scope.$broadcast('form-config-updated', {});
				refreshOptionalGrid();
			};

			$scope.isDisable = function isDisable() {
				if($scope.dataItem){
					if(!$scope.dataItem.updPrjCC && !$scope.dataItem.updPrjMat && !$scope.dataItem.calcRuleParam && !$scope.dataItem.updBoq && !$scope.dataItem.updPrjAssembly && !$scope.dataItem.updCur && !$scope.dataItem.reCalEsc && !$scope.dataItem.updRisk && !$scope.dataItem.updPrjPlantAssembly && !$scope.dataItem.updFromBoq && !$scope.dataItem.updateDurationFrmActivity){
						return true;
					}
				}
				return false;
			};

			$scope.onOK = function () {
				// changeLineItemsFromOptionalGrid();
				if(platformGridAPI.items && platformGridAPI.items.data($scope.optionalGridId)){
					estimateMainUpdateItemsService.setUpdateLineItemList(platformGridAPI.items.data($scope.optionalGridId));
				}
				$scope.$close({ok: true, data: $scope.dataItem});
			};

			$scope.onCancel = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.dataItem.HighlightAssignments = 0;
				$scope.$close({});
			};

			$scope.modalOptions.cancel = function () {
				$scope.dataItem.__rt$data.errors = null;
				$scope.dataItem.HighlightAssignments = 0;
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {
				if($scope.optionalGridId && platformGridAPI.grids.exist($scope.optionalGridId)){
					platformGridAPI.events.unregister($scope.optionalGridId, 'onDblClick', onGridDblClick);
					platformGridAPI.grids.unregister($scope.optionalGridId);
				}
			});

			function onGridDblClick(e, args) {// jshint ignore:line
				// reload data with groupfk
				let entity = args.grid.getDataItem(args.row);
				if (entity && !entity.GroupFk) {
					refreshOptionalGrid(entity.Id);
				}
			}

			function refreshOptionalGrid(groupId){
				if ($scope.dataItem && $scope.dataItem.updBoq)
				{
					let estimateFilterData = {
						ProjectId: estimateMainService.getSelectedProjectId(),
						EstHeaderFk: estimateMainService.getSelectedEstHeaderId(),
						StructureType: 1,
						StructureMainId: 0,
						EstimateScope: 0,
						FilterRequest: groupId ? estimateMainService.getLastFilter() : null,
						MajorLineItems: true,
						ProjectChangeLineItems:false,
						GroupFk: groupId,
					};
					$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/isanyassignmentbystructure', estimateFilterData).then(function (result) {
						result.data.ShowOptionalGrid = false;
						$scope.isShowOptionalWarning = $scope.dataItem.updBoq && result.data.ShowOptionalGrid;
						if ($scope.isShowOptionalWarning) {

							result.data.OptionalTreeItems.forEach(item=>{
								// set isOptional value
								if (item.Total === item.IsOptionalCount) {
									item.OriginOptional = true;
								} else if (item.IsOptionalCount === 0) {
									item.OriginOptional = false;
								} else {
									item.OriginOptional = 'indeterminate';
								}

								// set isOptionalIt value
								if (item.Total === item.IsOptionalItCount) {
									item.OriginOptionalIt = true;
								} else if (item.IsOptionalItCount === 0) {
									item.OriginOptionalIt = false;
								} else {
									item.OriginOptionalIt = 'indeterminate';
								}

								// set isfixedprice value
								if (item.Total === item.IsFixedPriceCount) {
									item.IsFixedPriceLineItem = true;
								} else if (item.IsFixedPriceCount === 0) {
									item.IsFixedPriceLineItem = false;
								} else {
									item.IsFixedPriceLineItem = 'indeterminate';
								}

								if(result.data.GroupFk){
									item.GroupChildren = _.filter(result.data.OptionalChildrenItems, {'GroupFk': item.Id});
									item.HasChildren = item.GroupChildren && item.GroupChildren.length > 0;
									if(item.HasChildren){
										_.each(item.GroupChildren, function (child) {
											child.IsOptional = item.IsOptional;
											child.IsOptionalIt = item.IsOptionalIt;
											child.IsFixedPrice = item.IsFixedPrice;
											// icon for lineitem
											child.image = child.EstLineItemFk > 0 ? 'ico-reference-line' : 'ico-base-line';
										});

										_.each(item.GroupChildren, function (child) {
											let fields = [{field: 'IsOptional', readonly: true}, {field: 'IsOptionalIt', readonly: true}];
											if (child.__rt$data) {
												child.__rt$data.readonly = [];
											}
											if (child && child.Id) {
												platformRuntimeDataService.readonly(child, fields);
											}
										});
									}
								}
							});

							platformGridAPI.grids.invalidate($scope.optionalGridId);
							platformGridAPI.items.data($scope.optionalGridId, result.data.OptionalTreeItems);
							resize();
							platformGridAPI.grids.refresh($scope.optionalGridId);

						}
					});
				}
				else
				{
					$scope.isShowOptionalWarning =  false;
				}
			}

			// optionalGrid
			function configOptionalGrid(){
				let optionalGridColumnsConfig =[
					{
						id: 'originOptional',
						field: 'OriginOptional',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							let html;
							if (value === true) {
								html = '<input disabled="disabled" type="checkbox" checked />';
							} else if (value === 'indeterminate') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input disabled="disabled" type="checkbox"/>';
							} else {
								html = '<input disabled="disabled" type="checkbox" unchecked/>';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						name: 'Optional(Origin)',
						name$tr$: 'estimate.main.estOriginOptional',
						width: 87,
						readonly: true
					},
					{
						id: 'isOptional',
						field: 'IsOptional',
						formatter: 'boolean',
						name: 'Optional',
						name$tr$: 'estimate.main.estIsOptional',
						// editor: 'boolean',
						width: 50,
						validator: 'optionalSelectedChange',
						readonly: true
					},
					{
						id: 'originOptionalIt',
						field: 'OriginOptionalIt',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							let html;
							if (value === true) {
								html = '<input disabled="disabled" type="checkbox" checked />';
							} else if (value === 'indeterminate') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input disabled="disabled" type="checkbox"/>';
							} else {
								html = '<input disabled="disabled" type="checkbox" unchecked/>';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						name: 'Optional It(Origin)',
						name$tr$: 'estimate.main.estOriginOptionalIt',
						width: 87,
						readonly: true
					},
					{
						id: 'isOptionalIt',
						field: 'IsOptionalIt',
						formatter: 'boolean',
						name: 'Optional It',
						name$tr$: 'estimate.main.estIsOptionalIt',
						// editor: 'boolean',
						width: 50,
						validator: 'optionalSelectedChange',
						readonly: true
					},
					{
						id: 'IsFixedPrice',
						field: 'IsFixedPrice',
						formatter: 'boolean',
						name: 'IsFixedPrice(BoQ)',
						name$tr$: 'estimate.main.boqFixedPrice',
						width: 50,
						validator: 'optionalSelectedChange',
						readonly: true
					},
					{
						id: 'IsFixedPriceLineItem',
						field: 'IsFixedPriceLineItem',
						formatter: function (row, cell, value, columnDef, dataContext, plainText, uniqueId) {
							let html;
							if (value === true) {
								html = '<input disabled="disabled" type="checkbox" checked />';
							} else if (value === 'indeterminate') {
								setTimeout(function () {
									angular.element('#' + uniqueId).find('input[type=checkbox]').prop('indeterminate', true);
								});

								html = '<input disabled="disabled" type="checkbox"/>';
							} else {
								html = '<input disabled="disabled" type="checkbox" unchecked/>';
							}
							return '<div class="text-center" >' + html + '</div>';
						},
						name: 'IsFixedPrice(LineItem)',
						name$tr$: 'estimate.main.lineItemFixedPrice',
						width: 50,
						validator: 'optionalSelectedChange',
						readonly: true
					},
					{
						id: 'code',
						field: 'Code',
						name: 'Code',
						name$tr$: 'cloud.common.entityCode',
						formatter: 'code',
						width: 80,
						readonly: true,
					},
					{
						id: 'description',
						field: 'DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						formatter: 'translation',
						width: 120,
						readonly: true,
					},
					{
						id: 'BasItemTypeFk',
						field: 'BasItemTypeFk',
						name: 'BasItemTypeFk',
						name$tr$: 'boq.main.BasItemTypeFk',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.lookup.boqitemtype',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100,
						readonly: true,
					},
					{
						id: 'BasItemType2Fk',
						field: 'BasItemType2Fk',
						name: 'BasItemType2Fk',
						name$tr$: 'boq.main.BasItemType2Fk',
						formatter: 'lookup',
						formatterOptions: {
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.lookup.boqitemtype2',
							lookupSimpleLookup: true,
							valueMember: 'Id'
						},
						width: 100,
						readonly: true,

					}
				];

				let optionalGridConfig = {
					height: '120px',
					showGrouping:true,
					columns:angular.copy(optionalGridColumnsConfig) ,
					data: [],
					id: $scope.optionalGridId,
					lazyInit: false,
					presenter: {
						tree: {
							parentProp: 'GroupFk',
							childProp: 'GroupChildren',
							showChildrenItems: true
						}
					},
					options: {
						height: '120px',
						tree: true,
						indicator: false,
						idProperty: 'Id',
						iconClass: '',
						parentProp: 'GroupFk',
						childProp: 'GroupChildren',
						collapsed: false
					}
				};

				$scope.optionalGridData = {
					state: $scope.optionalGridId
				};

				$scope.optionalSelectedChange = function (entity, value, model) {

					if (entity && value && model === 'IsOptional') {
						entity.BasItemTypeFk = 2;
						// set children flag
						if (entity.GroupChildren) {
							entity.GroupChildren.forEach(item=>{
								item.IsOptional = value;
							});

							platformGridAPI.grids.refresh($scope.optionalGridId, true);
						}
					}
					else {
						entity.BasItemTypeFk = 1;
						// set children flag
						if (entity.GroupChildren) {
							entity.GroupChildren.forEach(item=>{
								item.IsOptional = value;
							});
							platformGridAPI.grids.refresh($scope.optionalGridId, true);
						}
					}
				};

				if (!platformGridAPI.grids.exist($scope.optionalGridId)) {
					platformGridAPI.grids.config(optionalGridConfig);
					platformTranslateService.translateGridConfig(optionalGridConfig.columns);
					platformGridAPI.events.register($scope.optionalGridId, 'onDblClick', onGridDblClick);
				}

				refreshOptionalGrid();
			}

			function  resize()
			{
				$timeout(function (){
					platformGridAPI.grids.resize($scope.optionalGridId);
				});

			}

		}]);
})(angular);

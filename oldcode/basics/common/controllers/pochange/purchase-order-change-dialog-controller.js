(function (angular) {
	'use strict';

	var moduleName = 'basics.common';

	angular.module(moduleName).controller('basicsCommonPurchaseOrderChangeDialogController',
		['$scope', '$filter', 'cloudDesktopSidebarService', '$http', '$injector', '$translate', 'basicsCommonChangeStatusService', 'basicsWorkflowInstanceStatus', 'platformCreateUuid', 'basicsCommonPurchaseOrderChangeService', 'platformModalService', 'procurementCommonPrcItemValidationService', '_', 'moment', '$',
			function ($scope, $filter, cloudDesktopSidebarService, $http, $injector, $translate, basicsCommonChangeStatusService, wfStatus, platformCreateUuid, basicsCommonPurchaseOrderChangeService, platformModalService, procurementCommonPrcItemValidationService, _, moment, $) {
				$scope.options = $scope.$parent.modalOptions;
				var extraDays = 0, totalOc = 0, expOc = 0;
				$scope.data = {
					totalPrice: '',
					expressFree: '',
					remark: '',
					homeCurrency: ''
				};
				init();

				function init() {
					var itemDataService = $scope.options.itemDataService();
					if (itemDataService && itemDataService.getList().length > 0) {
						var itemDataList = itemDataService.getList();
						itemDataList.forEach(function (item) {
							if (item.NewQuantity !== undefined || item.NewQuantity > 0) {
								item.NewQuantity = '';
							}
						});
					}
					basicsCommonPurchaseOrderChangeService.setItemNewQty($scope.options.currentItem.olditemData[0].Quantity);
					var currency = $scope.options.entity.BasCurrencyFk;
					basicsCommonPurchaseOrderChangeService.getHomeCurrency(currency).then(function (reuslt) {
						if (reuslt !== null) {
							$scope.data.homeCurrency = reuslt.Currency;
						}
					});
					if ($scope.options.currentItem.olditemData.length > 0) {
						extraDays = $scope.options.currentItem.olditemData[0].LeadTimeExtra;
						if (extraDays < 0) {
							extraDays = (-1) * extraDays;
						}
						/*                        if($scope.options.currentItem.olditemData[0].PrcPriceConditionFk==27){
                            $scope.options.currentItem.pfChecked=true;
                            if(  $scope.options.currentItem.pfChecked && $scope.options.currentItem.olditemData[0].PriceExtraOc!=0){
                                $scope.options.currentItem.IsChecked=true;
                                $scope.options.currentItem.pfSelectedChecked=true;
                            }
                        } */
						basicsCommonPurchaseOrderChangeService.getPriceCondition($scope.options.currentItem.olditemData[0].Id).then(function (reuslt) {
							if (reuslt.Main !== null) {
								reuslt.Main.forEach(function (item) {
									totalOc = totalOc + item.TotalOc;
									if (item.PriceConditionType.Code === 'EXPRESS') {
										expOc = item.TotalOc;
										$scope.options.currentItem.pfChecked = true;
										if ($scope.options.currentItem.pfChecked && $scope.options.currentItem.olditemData[0].PriceExtra !== 0 && $scope.options.currentItem.olditemData[0].PriceExtraOc !== 0) {
											$scope.options.currentItem.IsChecked = true;
											$scope.options.currentItem.pfSelectedChecked = true;
										}
									}
								});
							}

						});

					}
				}

				function getExtraDate(extraDays, datime) {
					datime = moment(datime).format('YYYY-MM-DD');
					let d = new Date(datime).valueOf();
					d = d + extraDays * 24 * 60 * 60 * 1000;
					d = new Date(d);
					return d;
				}

				var modalOptionsQuestion = {
					headerTextKey: $translate.instant('basics.common.poChange.controller.modalQuestion.headerTextKey'),
					bodyTextKey: $translate.instant('basics.common.poChange.controller.modalQuestion.bodyTextKey'),
					showYesButton: true, showNoButton: true,
					iconClass: 'ico-question'
				};
				var modalOptionsInfo = {
					headerTextKey: $translate.instant('basics.common.poChange.controller.modalInfo.headerTextKey'),
					showOkButton: true,
					iconClass: 'ico-info'
				};
				$scope.modalOptions = {};
				$scope.modalOptions = {
					chkItems: [
						{
							value: '1',
							text: $translate.instant('basics.common.poChange.controller.modalOptions.chkItems.DecreaseQty'),
							isChecked: true
						},
						{
							value: '2',
							text: $translate.instant('basics.common.poChange.controller.modalOptions.chkItems.DeliveryDate'),
							isChecked: false
						},
						{
							value: '3',
							text: $translate.instant('basics.common.poChange.controller.modalOptions.chkItems.DeliveryAddress'),
							isChecked: false
						},
						{
							value: '4',
							text: $translate.instant('basics.common.poChange.controller.modalOptions.chkItems.CancelPO'),
							isChecked: false
						}],
					isDecreaseQty: true,
					isDeliveryDate: false,
					isDeleveryAddress: false,
					isCancelPO: false,
					text: {
						closeButtonText: $translate.instant('basics.common.button.close'),
						actionButtonText: $translate.instant('basics.common.button.ok'),
						runingMessage: $translate.instant('basics.common.poChange.workflowRunning'),
						premiumFreight: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.PremiumFreight'),
						totalPrice: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.TotalPrice'),
						expressFree: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.ExpressFree')
					}
				};

				$scope.modalOptions.isPF = $scope.modalOptions.isDeliveryDate && $scope.options.currentItem.pfChecked;
				$scope.modalOptions.unPF = $scope.modalOptions.isDeliveryDate && !$scope.options.currentItem.pfChecked;
				$scope.modalOptions.isSelectedPF = $scope.modalOptions.isDeliveryDate && $scope.options.currentItem.pfChecked && $scope.options.currentItem.pfSelectedChecked;
				$scope.modalOptions.isUnSelectedPF = $scope.modalOptions.isDeliveryDate && !$scope.options.currentItem.pfChecked && (!$scope.options.currentItem.pfSelectedChecked);

				$scope.modalOptions.setAction = function (value) {
					angular.forEach($scope.modalOptions.chkItems, function (item) {
						if (item.value === value) {
							if (item.isChecked === true) {
								item.isChecked = false;
							} else {
								item.isChecked = true;
							}
						}

						/* Decrease Qty */
						if (item.value === '1' && item.isChecked) {
							$scope.modalOptions.isDecreaseQty = true;
							$scope.options.currentItem.isChangeQty = true;
							$scope.modalOptions.isCancelPO = false;
							angular.forEach($scope.modalOptions.chkItems, function (item) {
								if (item.value === '4') {
									item.isChecked = false;
								}
							});
							$scope.AdjustPremiumFreight();
						} else if (item.value === '1' && !item.isChecked) {
							$scope.modalOptions.isDecreaseQty = false;
							$scope.options.currentItem.isChangeQty = false;
							$scope.AdjustPremiumFreight();
						}

						/* Change Delivery Date */
						if (item.value === '2' && item.isChecked) {
							$scope.modalOptions.isDeliveryDate = true;
							$scope.options.currentItem.isChangeDate = true;
							angular.forEach($scope.modalOptions.chkItems, function (item) {
								if (item.value === '4') {
									item.isChecked = false;
								}
							});
							$scope.AdjustPremiumFreight();
						} else if (item.value === '2' && !item.isChecked) {
							$scope.modalOptions.isDeliveryDate = false;
							$scope.options.currentItem.isChangeDate = false;
							$scope.AdjustPremiumFreight();
						}

						/* Change Delivery Address */
						if (item.value === '3' && item.isChecked) {
							$scope.modalOptions.isDeleveryAddress = true;
							$scope.options.currentItem.isChangeAddress = true;
							angular.forEach($scope.modalOptions.chkItems, function (item) {
								if (item.value === '4') {
									item.isChecked = false;
								}
							});
							$scope.AdjustPremiumFreight();
							const oldaddre = $scope.options.currentItem.oldaddress;
							const currentItem = $scope.options.currentItem;
							basicsCommonPurchaseOrderChangeService.updateReadOnly(currentItem, oldaddre, value);
						} else if (item.value === '3' && !item.isChecked) {
							$scope.modalOptions.isDeleveryAddress = false;
							$scope.options.currentItem.isChangeAddress = false;
							$scope.AdjustPremiumFreight();
						}

						/* Cancel PO */
						if (item.value === '4' && item.isChecked) {
							$scope.modalOptions.isCancelPO = true;
							$scope.modalOptions.isDecreaseQty = false;
							$scope.modalOptions.isDeleveryAddress = false;
							$scope.modalOptions.isDeliveryDate = false;
							$scope.options.currentItem.isCancelPO = true;
							angular.forEach($scope.modalOptions.chkItems, function (item) {
								if (item.value !== '4') {
									item.isChecked = false;
								}
							});
							$scope.AdjustPremiumFreight();
						} else if (item.value === '4' && !item.isChecked) {
							$scope.modalOptions.isCancelPO = false;
							$scope.options.currentItem.isCancelPO = false;
							$scope.AdjustPremiumFreight();
						}
					});
				};

				function translateNumber(count) {
					return count.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
				}

				$scope.AdjustPremiumFreight = function () {
					var quantity = basicsCommonPurchaseOrderChangeService.getItemNewQty();
					if ($scope.modalOptions.isDeliveryDate) {
						$scope.modalOptions.isPF = $scope.modalOptions.isDeliveryDate && $scope.options.currentItem.pfChecked;// stand for material whether support Exp
						$scope.modalOptions.unPF = $scope.modalOptions.isDeliveryDate && !$scope.options.currentItem.pfChecked;
						$scope.modalOptions.isSelectedPF = $scope.modalOptions.isDeliveryDate && $scope.options.currentItem.pfChecked && $scope.options.currentItem.pfSelectedChecked;// stand for current material selected Exp
						$scope.modalOptions.isUnSelectedPF = $scope.modalOptions.isDeliveryDate && $scope.options.currentItem.pfChecked && (!$scope.options.currentItem.pfSelectedChecked);
						if ($scope.modalOptions.isPF) {
							if ($scope.options.currentItem.pfSelectedChecked) {
								$scope.modalOptions.isPF = false;
								$scope.modalOptions.unPF = false;
								if ($scope.options.currentItem.IsChecked) {
									$scope.modalOptions.isSelectedPF = true;
									$scope.modalOptions.isUnSelectedPF = false;
								} else {
									$scope.options.currentItem.newdate = getExtraDate(extraDays, $scope.options.currentItem.olddate);
									$scope.options.currentItem.newdate = $filter('date')($scope.options.currentItem.newdate, 'yyyy-MM-dd');
									$scope.modalOptions.isUnSelectedPF = true;
									$scope.modalOptions.isSelectedPF = false;
								}
							} else {
								$scope.modalOptions.isSelectedPF = false;
								$scope.modalOptions.isUnSelectedPF = false;
								if ($scope.options.currentItem.IsChecked) {
									$scope.modalOptions.isPF = true;
									$scope.modalOptions.unPF = false;
								} else {
									$scope.modalOptions.unPF = true;
									$scope.modalOptions.isPF = false;

								}
							}
						} else {
							$scope.modalOptions.isSelectedPF = false;
							$scope.modalOptions.isUnSelectedPF = false;
							$scope.modalOptions.unPF = true;
							$scope.modalOptions.isPF = false;
						}
					} else {
						$scope.modalOptions.isSelectedPF = false;
						$scope.modalOptions.isUnSelectedPF = false;
						$scope.modalOptions.unPF = false;
						$scope.modalOptions.isPF = false;
					}
					if ($scope.modalOptions.isDeliveryDate) {

						var itemDataService = $scope.options.itemDataService();
						if (itemDataService && itemDataService.getList().length > 0) {
							var itemDataList = itemDataService.getList();
							itemDataList.forEach(function (item) {
								if ($scope.options.currentItem.IsChecked) {
									if (quantity !== 0) {
										$scope.data.totalPrice = translateNumber((totalOc + item.PriceOc) * quantity);
										$scope.data.expressFree = translateNumber(totalOc * quantity);
										$scope.options.currentItem.updateQty = quantity;
									} else {
										$scope.data.totalPrice = translateNumber((totalOc + item.PriceOc) * (item.Quantity));
										$scope.data.expressFree = translateNumber(totalOc * item.Quantity);
										$scope.options.currentItem.updateQty = item.Quantity;
									}
								} else {
									if (quantity !== 0) {
										$scope.data.totalPrice = translateNumber((item.PriceOc) * (quantity));
										$scope.options.currentItem.updateQty = quantity;
										if (!$scope.pfSelectedChecked) {
											$scope.data.expressFree = 0;
										} else {
											$scope.data.expressFree = translateNumber((-1) * (totalOc * quantity));
										}
									} else {
										$scope.data.totalPrice = translateNumber((item.PriceOc) * (item.Quantity));
										$scope.options.currentItem.updateQty = item.Quantity;
										if (!$scope.pfSelectedChecked) {
											$scope.data.expressFree = 0;
										} else {
											$scope.data.expressFree = translateNumber((-1) * (totalOc * item.Quantity));
										}
									}
								}
								$scope.options.currentItem.expressFree = totalOc;

							});
						}

					}

				};
				var dDformConfigPF = {
					showGrouping: true,
					groups: [
						{
							gid: 'dDChange',
							header: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dDChange'),
							header$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dDChange'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: 'dDChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
							type: 'date',
							model: 'olddate',
							readonly: true,
							visible: true,
							sortOrder: 2,
						},
						{
							gid: 'dDChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
							type: 'date',
							model: 'leadTime',
							visible: true,
							readonly: true,
							disabled: false,
							sortOrder: 2
						}
					]
				};

				var dDformConfig = {
					showGrouping: true,
					groups: [
						{
							gid: 'dDChange',
							header: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dDChange'),
							header$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dDChange'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: 'dDChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
							type: 'date',
							model: 'olddate',
							readonly: true,
							visible: true,
							sortOrder: 2,
						},
						{
							gid: 'dDChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
							type: 'date',
							model: 'newdate',
							visible: true,
							disabled: false,
							sortOrder: 2
						}
					]
				};
				var dDformConfigPFSelected = {
					showGrouping: true,
					groups: [
						{
							gid: 'dDChange',
							header: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dDChange'),
							header$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dDChange'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: 'dDChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
							type: 'date',
							model: 'olddate',
							readonly: true,
							visible: true,
							sortOrder: 2,
						},
						{
							gid: 'dDChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
							type: 'date',
							model: 'olddate',
							readonly: true,
							visible: true,
							sortOrder: 2
						}
					]
				};
				var dDformConfigPFUnSelected = {
					showGrouping: true,
					groups: [
						{
							gid: 'dDChange',
							header: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dDChange'),
							header$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dDChange'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: [
						{
							gid: 'dDChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldDate'),
							type: 'date',
							model: 'olddate',
							readonly: true,
							visible: true,
							sortOrder: 2,
						},
						{
							gid: 'dDChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewDate'),
							type: 'date',
							model: 'newdate',
							visible: true,
							disabled: false,
							sortOrder: 2
						}
					]
				};
				var dAformConfig = {
					showGrouping: true,
					groups: [
						{
							gid: 'dAChange',
							header: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dAChange'),
							header$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.dAChange'),
							isOpen: true,
							visible: true,
							sortOrder: 1
						}],
					rows: [
						{
							gid: 'dAChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldAddress'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.OldAddress'),
							model: 'oldaddress',
							directive: 'basics-common-address-dialog',
							type: 'directive',
							visible: true,
							// options: {
							//    filterKey: 'po-address-dialog-state-filter'
							// },
							sortOrder: 1
						},
						{
							gid: 'dAChange',
							label: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewAddress'),
							label$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.rows.NewAddress'),
							model: 'newaddress',
							directive: 'basics-common-address-dialog',
							type: 'directive',
							visible: true,
							options: {
								showClearButton: true,
								// filterKey:'po-address-dialog-state-filter'
							},
							sortOrder: 2
						}]
				};

				var cPOformConfig = {
					showGrouping: true,
					groups: [
						{
							gid: 'cPOChange',
							header: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.cPOChange'),
							header$tr$: $translate.instant('basics.common.poChange.controller.dDformConfig.groups.cPOChange'),
							isOpen: true,
							visible: true,
							readonly: false,
							sortOrder: 1
						}],
					rows: [
						{
							gid: 'cPOChange',
							model: 'itemDataService',
							type: 'directive',
							directive: 'purchase-Order-Change-Items-Lookup',
							visible: true, sortOrder: 1
						}]
				};

				function validateChange() {
					var canContinueObj = {canContinue: true};
					var itemDataService = $scope.options.itemDataService();
					if (itemDataService && itemDataService.getList().length > 0) {
						var itemDataListobj = _.find(itemDataService.getList(), function (item) {
							return item.Quantity > 0;
						});
						if (itemDataListobj === undefined) {
							$.extend(canContinueObj, {
								canContinue: false,
								msg: $translate.instant('basics.common.poChange.controller.modalInfo.CancelPOMeg')
							});
							return canContinueObj;
						}
					} else {
						$.extend(canContinueObj, {
							canContinue: false,
							msg: $translate.instant('basics.common.poChange.controller.modalInfo.CancelPOMeg')
						});
						return canContinueObj;
					}

					if ($scope.modalOptions.isDecreaseQty === true) {
						var itemDataList = itemDataService.getList();
						var hasNewQuantityPty = false;
						itemDataList.forEach(function (item) {
							if (item.NewQuantity !== undefined && item.NewQuantity !== '')
								hasNewQuantityPty = true;
						});
						if (!hasNewQuantityPty) {
							canContinueObj.canContinue = false;
							return canContinueObj;
						}
						itemDataList.forEach(function (item) {
							var sellUnit = item.SellUnit;
							var minQty = item.MinQuantity;
							if (item.NewQuantity === 0 || item.NewQuantity >= item.Quantity || item.NewQuantity < minQty) {
								canContinueObj.canContinue = false;
								return canContinueObj;
							}
							if (sellUnit !== 0) {
								var spq = (item.Quantity - item.NewQuantity) % sellUnit;
								if (spq) {
									canContinueObj.canContinue = false;
									return canContinueObj;
								}
							}
						});
					}

					if ($scope.modalOptions.isDeliveryDate === true) {
						var olddate = new Date($scope.options.currentItem.olddate);
						var newdate = new Date($scope.options.currentItem.newdate);
						//                        var leadTime=new Date($scope.options.currentItem.leadTime);
						var extraDateTime = getExtraDate(extraDays, olddate);
						if ($scope.options.currentItem.pfChecked) {
							if ($scope.options.currentItem.pfSelectedChecked) {
								if (!$scope.options.currentItem.IsChecked) {
									if ($filter('date')(extraDateTime, 'yyyyMMdd') > $filter('date')(newdate, 'yyyyMMdd'))
										$.extend(canContinueObj, {
											canContinue: false,
											msg: $translate.instant('basics.common.poChange.controller.modalInfo.DeliveryDateMeg')
										});
								}
							}
							/*                            else{
                                if($scope.options.currentItem.IsChecked){
                                    if($filter('date')(olddate,'yyyyMMdd')>=$filter('date')(leadTime,'yyyyMMdd'))
                                        $.extend(canContinueObj,{canContinue:false,msg:$translate.instant('basics.common.poChange.controller.modalInfo.DeliveryDateMeg')});
                                }
                            } */
						} else {
							if ($filter('date')(olddate, 'yyyyMMdd') > $filter('date')(newdate, 'yyyyMMdd'))
								$.extend(canContinueObj, {
									canContinue: false,
									msg: $translate.instant('basics.common.poChange.controller.modalInfo.DeliveryDateMeg')
								});
						}
						/*                        if(!$scope.options.currentItem.IsChecked)
                        {
                            var olddate=new Date($scope.options.currentItem.olddate);
                            var newdate=new Date($scope.options.currentItem.newdate);
                            if($filter('date')(olddate,'yyyyMMdd')>=$filter('date')(newdate,'yyyyMMdd'))
                                $.extend(canContinueObj,{canContinue:false,msg:$translate.instant('basics.common.poChange.controller.modalInfo.DeliveryDateMeg')});
                        } */
					}

					if ($scope.modalOptions.isDeleveryAddress === true) {
						if ($scope.options.currentItem.oldaddress === $scope.options.currentItem.newaddress) {
							canContinueObj.canContinue = false;
						}
						// var newcountry=$scope.options.currentItem.newaddress.CountryFk;
						// var old=$scope.options.currentItem.oldaddress.CountryFk;
						// if (newcountry!==old) {
						//    $.extend(canContinueObj,{canContinue:false,msg:$translate.instant('basics.common.poChange.controller.modalInfo.DeliveryAddressCountryMeg')});
						// }
					}

					return canContinueObj;
				}

				$scope.modalOptions.dDformContainerOptionsPF = {};
				$scope.modalOptions.dDformContainerOptionsPF.formOptions = {
					configure: dDformConfigPF,
					showButtons: [],
					validationMethod: function () {
					}
				};

				$scope.modalOptions.dDformContainerOptions = {};
				$scope.modalOptions.dDformContainerOptions.formOptions = {
					configure: dDformConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};
				$scope.modalOptions.dDformContainerOptionsSelectedPF = {};
				$scope.modalOptions.dDformContainerOptionsSelectedPF.formOptions = {
					configure: dDformConfigPFSelected,
					showButtons: [],
					validationMethod: function () {
					}
				};

				$scope.modalOptions.dDformContainerOptionsUnSelectedPF = {};
				$scope.modalOptions.dDformContainerOptionsUnSelectedPF.formOptions = {
					configure: dDformConfigPFUnSelected,
					showButtons: [],
					validationMethod: function () {
					}
				};
				$scope.modalOptions.dAformContainerOptions = {};
				$scope.modalOptions.dAformContainerOptions.formOptions = {
					configure: dAformConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};

				$scope.modalOptions.cPOformContainerOptions = {};
				$scope.modalOptions.cPOformContainerOptions.formOptions = {
					configure: cPOformConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};

				$scope.modalOptions.ok = function onOK() {
					$scope.$emit('updateRequested');
					var validateResult = validateChange();
					if (!validateResult.canContinue) {
						if (validateResult.msg === undefined) {
							$.extend(modalOptionsInfo, {bodyTextKey: $translate.instant('basics.common.poChange.controller.modalInfo.bodyTextKey')});
						} else {
							$.extend(modalOptionsInfo, {bodyTextKey: validateResult.msg});
						}
						platformModalService.showDialog(modalOptionsInfo);
						//    .then(function() {
						//    if ($scope.modalOptions.isDeleveryAddress === true ) {
						//        $scope.options.currentItem.newaddress=$scope.options.currentItem.oldaddress;
						//    }
						// });
						return;
					}
					platformModalService.showDialog(modalOptionsQuestion).then(function (result) {
						if (!result || result.no) {
							return;
						} else {
							$scope.isRuingWorkFlow = true;
							if ($scope.modalOptions.isDecreaseQty === true) {
								let validate = procurementCommonPrcItemValidationService($scope.options.itemDataService());
								$scope.options.itemDataService().getList().forEach(function (item) {
									if (item && item.NewQuantity >= item.MinQuantity && item.NewQuantity <= item.Quantity) {
										validate.validateNewQuantity(item, item.NewQuantity, 'Quantity');
									}
								});
							}

							if ($scope.modalOptions.isCancelPO === true) {
								let validate = procurementCommonPrcItemValidationService($scope.options.itemDataService());
								$scope.options.itemDataService().getList().forEach(function (item) {
									if (item) {
										validate.validateQuantity(item, 0, 'Quantity');
									}
								});
							}
							basicsCommonPurchaseOrderChangeService.changePurchaseOrder($scope.options, $scope.data.remark)
								.then(function (result) {
									if (result.changed) {
										$scope.$close(result);
									}
								});
						}
					});
				};

				$scope.$watch('options.itemDataService().getList()[0].QuantityAskedfor', function () {
					$scope.AdjustPremiumFreight();
					//                   console.log($scope.options.itemDataService().getList()[0].QuantityAskedfor);
				});
				$scope.modalOptions.close = function onCancel() {
					$scope.$dismiss({yes: false});
				};

			}]);
})(angular);
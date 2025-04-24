/**
 * Created by lvi on 8/20/2014.
 */
/* global moment */

// eslint-disable-next-line no-redeclare
/* global angular,globals */
(function (angular, globals) {
	'use strict';
	var moduleName = 'procurement.ticketsystem';
	angular.module(moduleName)
		.factory('procurementTicketsystemSubmitDialogConfigurations',
			['$translate', function ($translate) {
				return {
					'fid': 'ticketsystem.submit.cart',
					'version': '1.1.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': '1',
							'id': 'submitDialog',
							'header': 'submitDialog',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': '1.1',
							'gid': '1',
							'id': 'ReqConSelection',
							'label': $translate.instant('procurement.ticketsystem.submitDialog.create'),
							'type': 'directive',
							'directive': 'procurement-ticket-system-req-con-selection-combobox',
							'model': 'Type',
							'readonly': false,
							'options': {
								'showClearButton': false
							},
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'ReqConSelection',
								'displayMember': 'Description',
								'imageSelector': 'platformStatusIconService'
							},
							validator: function (entity, value) {
								if (value === 2) { // 1: contract 2: requisition
									entity.CreateReqOrConBySupplier = false;
									entity.CreateSeparateContractForEachItem = false;
								} else {
									entity.CreateReqOrConBySupplier = true;
								}
							}
						},
						{
							'rid': '1.4',
							'gid': '1',
							'id': 'Project',
							'label': $translate.instant('procurement.ticketsystem.submitDialog.Project'),
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'model': 'ProjectFK',
							'options': {
								lookupDirective: 'procurement-project-lookup-dialog',
								descriptionField: 'ProjectDescriptor.Description',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									initValueField: 'ProjectNo',
									showClearButton: false,
									lookupKey: 'prc-req-header-project-property',
									filterKey: 'prc-req-header-project-filter'
								}
							}
						},
						{
							'rid': '1.2',
							'gid': '1',
							'id': 'Required',
							'label': $translate.instant('procurement.ticketsystem.submitDialog.DateRequire'),
							'type': 'dateutc',
							'model': 'DateRequire',
							'readonly': false
						},
						{
							'rid': '1.3',
							'gid': '1',
							'id': 'Remark',
							'label': $translate.instant('procurement.ticketsystem.submitDialog.Remark'),
							'type': 'remark',
							'model': 'Remark',
							'readonly': false
						}

					]
				};
			}]
		);

	/**
	 * @ngdoc controller
	 * @name procurementTicketsystemCartItemController
	 * @require $scope
	 * @description controller for ticket system
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('procurementTicketsystemSubmitDialogController',
		['$scope', 'platformContextService', 'procurementTicketsystemSubmitCartDataService',
			'procurementTicketsystemSubmitDialogConfigurations', 'platformModalService',
			'$translate', 'procurementContextService', '$rootScope', 'procurementTicketsystemCartDataService',
			'procurementRequisitionWizardCreateContractService',// 'platformRuntimeDataService','_',
			function ($scope, platformContextService, procurementTicketsystemSubmitCartDataService,
				procurementTicketsystemSubmitCartConfigurations, platformModalService,
				$translate, procurementContextService, $rootScope, cartService, createContractService// ,platformRuntimeDataService,_
			) {

				$scope.submitcart = {};
				// $scope.isFlex = false;// is flex supplier .default false.
				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					refreshButtonText: $translate.instant('procurement.ticketsystem.submitDialog.refreshDate'),
					headerText: $translate.instant('procurement.ticketsystem.submitDialog.headerText'),
					dialogLoading: false,
					loadingInfo: ''
				};
				var errorType = {
					info: 1,
					error: 3
				};

				var feekBack = function (isShow, message, type) {
					$scope.error = {
						show: isShow,
						messageCol: 1,
						message: message,
						type: type
					};
				};

				$scope.formOptions = {
					configure: procurementTicketsystemSubmitCartConfigurations,
					validationMethod: $scope.validateModel
				};

				$scope.showCreateSeparateContractForEachItem = function () {
					return $scope.submitcart.Type === 1; // create contract
				};

				$scope.disableCreateReqOrConBySupplier = function () {
					if ($scope.submitcart.CreateSeparateContractForEachItem === true) {
						$scope.submitcart.CreateReqOrConBySupplier = false;
						return true;
					} else if ($scope.submitcart.Type === 1) {
						$scope.submitcart.CreateReqOrConBySupplier = true;
						return true;
					} else {
						return false;
					}
				};

				$scope.refreshDeliverDate = function () {
					var daterequire = $scope.$parent.$parent.$parent.modalOptions.value.deliverDate;
					if (daterequire) {
						$scope.submitcart.DateRequire = moment.utc(daterequire);
					}

				};

				$scope.isSubmitting = false;
				$scope.isSubmitSuccess = false;
				var loadData = function loadData() {
					$scope.modalOptions.dialogLoading = true;
					var projectFK=procurementContextService.loginProject;
					var projectId=!_.isNil(projectFK)?projectFK:-1;
					procurementTicketsystemSubmitCartDataService.loadSubmitCart(projectId).then(function (item) {
						var daterequire = $scope.$parent.$parent.$parent.modalOptions.value.deliverDate;
						var arrPriceConditions = [];
						var cartlist = $scope.$parent.$parent.$parent.modalOptions.value.cartList;
						// var ticketsystemsuppliermode=$scope.$parent.$parent.$parent.modalOptions.value.ticketsystemsuppliermode;

						for (var i = 0; i < cartlist.length; i++) {
							var material = cartlist[i].Material;
							var priceConditions = material.PriceConditions;
							if (priceConditions) {
								for (var j = 0; j < priceConditions.length; j++) {
									var priceCondition = priceConditions[j];
									if (priceCondition.IsActivated) {
										arrPriceConditions.push(priceCondition.Id);
									}
								}
							}
						}

						item.data.PriceConditions = arrPriceConditions;
						item.data.DateRequire = daterequire ? moment.utc(daterequire) : moment.utc(item.data.DateRequire);
						$scope.submitcart = item.data;
						$scope.submitcart.ProjectFK = procurementContextService.loginProject;
						$scope.submitcart.CompanyId = platformContextService.getContext().clientId;
						$scope.modalOptions.dialogLoading = false;

					}, function () {
						$scope.modalOptions.dialogLoading = false;
					});
				};

				$scope.validateModel = function () {
					return true;
				};

				$scope.modalOptions.close = function () {
					$scope.$close(false);
				};

				$scope.modalOptions.ok = function () {
					if (!$scope.isSubmitSuccess) {

						if ($scope.submitcart.ProjectFK !== null && !$scope.isSubmitting) {

							if ($scope.submitcart.Type === 1) { // create contract
								procurementTicketsystemSubmitCartDataService.checkIfEachCartItemHasSupplierInfo().then(function (res) {

									if (res.data[0]) {
										$scope.isSubmitting = true;// in case of double submit
										$scope.modalOptions.dialogLoading = true;
										doSubmit();
									} else {
										var options = {
											headerText: $translate.instant('procurement.common.wizard.item.createContract'),
											showYesButton: true,
											showIgnoreButton: true,
											disableIgnoreButton: !res.data[1],
											showCancelButton: true,
											ignoreBtnText: $translate.instant('procurement.ticketsystem.ignoreNProceed'),
											iconClass: 'ico-question',
											bodyText: $translate.instant('procurement.ticketsystem.createContractBodyText')
										};
										platformModalService.showDialog(options).then(function (result) {
											if (result.yes) {

												createContractService.showDialogFromTicketSystem({isTicketSystem: true}).then(function (bpId) {
													if (angular.isNumber(bpId)) {
														$scope.submitcart.BusinessPartnerId = bpId;
														$scope.isSubmitting = true;
														$scope.modalOptions.dialogLoading = true;
														doSubmit();
													}
												});

											} else if (result.ignore) {
												$scope.isSubmitting = true;
												$scope.modalOptions.dialogLoading = true;
												doSubmit();
											} else {
												$scope.$close(false);
											}
										});
									}
								});
							} else {
								$scope.isSubmitting = true;
								$scope.modalOptions.dialogLoading = true;
								doSubmit();
							}
						} else if ($scope.submitcart.ProjectFK !== null) {
							$scope.$close(false);
						} else {
							feekBack(true, $translate.instant('procurement.ticketsystem.submitDialog.projectError'), errorType.error);
						}
					} else {
						$scope.$close(false);
					}

					function doSubmit() {
						procurementTicketsystemSubmitCartDataService.saveSubmitCart($scope.submitcart).then(function (result) {
							if (result.data) {
								cartService.clearSave(result.data.CartItems);
								$scope.modalOptions.dialogLoading = false;

								var type = result.data.Type; // 1: contract 2: requisition
								var headerText = type === 2 ? $translate.instant('procurement.common.sidebar.req') : $translate.instant('procurement.common.sidebar.con');
								var bodyText = type === 2 ? $translate.instant('procurement.ticketsystem.createReqSuccessTitle') : $translate.instant('procurement.ticketsystem.createConSuccessTitle');

								var modalOptions = {
									headerText: headerText,
									bodyText: bodyText,
									type: type,
									itemList: result.data.Items,
									templateUrl: globals.appBaseUrl + 'procurement.ticketsystem/partials/sibmit-success-dialog.html'
								};
								platformModalService.showDialog(modalOptions);

								$scope.isSubmitSuccess = true;
								$scope.isSubmitting = false;
								$scope.$close(false);
								$rootScope.$broadcast('submitCartItem');
							} else {
								feekBack(true, result.data.Message, errorType.error);

								$scope.modalOptions.dialogLoading = false;
							}

						}, function () {
							$scope.isSubmitting = false;
							feekBack(true, $translate.instant('procurement.ticketsystem.submitDialog.submitError'), errorType.error);
							$scope.modalOptions.dialogLoading = false;
						});
					}
				};

				loadData();
			}]);
})(angular, globals);

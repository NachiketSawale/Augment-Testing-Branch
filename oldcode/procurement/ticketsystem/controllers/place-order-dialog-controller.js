/**
 * Created by lvi on 8/20/2014.
 */
// eslint-disable-next-line no-redeclare
/* global angular,globals,_ */
(function (angular, globals) {
	'use strict';

	var moduleName = 'procurement.ticketsystem';

	angular.module(moduleName)
		.factory('procurementTicketsystemPlaceOrderDialogConfigurations',
			['$translate', '$injector', function ($translate, $injector) {
				return {
					'fid': 'ticketsystem.place.order',
					'version': '1.1.0',
					'showGrouping': false,
					'groups': [
						{
							'gid': '1',
							'id': 'placeOrderDialog',
							'header': 'placeOrderDialog',
							'isOpen': true,
							'visible': true,
							'sortOrder': 1
						}
					],
					'rows': [
						{
							'rid': '1.1',
							'gid': '1',
							'id': 'Description',
							'label': $translate.instant('cloud.common.entityDescription'),
							'type': 'description',
							'model': 'Description',
							'readonly': false
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
							'label': $translate.instant('cloud.common.entityDeliveryAddress'),
							'type': 'directive',
							'model': 'AddressEntity',
							'readonly': false,
							'directive': 'basics-common-address-dialog',
							'options': {
								'foreignKey': 'AddressFK',
								'titleField': 'cloud.common.entityDeliveryAddress',
								'showClearButton': true
							}
						},
						{
							'rid': '1.3',
							'gid': '1',
							'id': 'StructureFK',
							'label': $translate.instant('procurement.ticketsystem.submitDialog.structure'),
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'model': 'StructureFK',
							'options': {
								lookupDirective: 'basics-procurementstructure-structure-dialog',
								descriptionField: 'Id',
								descriptionMember: 'DescriptionInfo.Description',
								lookupOptions: {
									showClearButton: true
								}
							},
							'readonly': false
						},
						{
							'rid': '1.3',
							'gid': '1',
							'id': 'ResponsibleOwner',
							'label': $translate.instant('procurement.ticketsystem.submitDialog.owner'),
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'model': 'ClerkFK',
							'options': {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionField: 'Id',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							},
							'readonly': false
						},
						{
							'rid': '1.3',
							'gid': '1',
							'id': 'Responsible',
							'label': $translate.instant('procurement.ticketsystem.submitDialog.Responsible'),
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'model': 'ClerkResponsibleFK',
							'options': {
								lookupDirective: 'cloud-clerk-clerk-dialog',
								descriptionField: 'Id',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							},
							'readonly': false
						},
						{
							'rid': '1.5',
							'gid': '1',
							'id': 'Controllingunit',
							'label': $translate.instant('procurement.ticketsystem.submitDialog.entityCtrlCode'),
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'model': 'ControllingUnitFk',
							'options': {
								lookupDirective: 'controlling-structure-dialog-lookup',
								descriptionField: 'Id',
								descriptionMember: 'DescriptionInfo.Translated',
								lookupOptions: {
									filterKey: 'prc-ticketsystem-controlling-by-prj-filter',
									showClearButton: true,
									considerPlanningElement: true,
									selectableCallback: function (dataItem) {
										return $injector.get('procurementCommonControllingUnitFactory').checkIsAccountingElement(dataItem, null);
									}
								}
							},
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
	angular.module(moduleName).controller('procurementTicketsystemPlaceOrderDialogController',
		['$scope', '$http', '$q', 'platformContextService', 'procurementTicketsystemSubmitCartDataService',
			'procurementTicketsystemPlaceOrderDialogConfigurations', 'platformModalService', '$injector',
			'$translate', 'procurementContextService', '$rootScope', 'procurementTicketsystemCartDataService', 'procurementCommonCodeHelperService', 'moment', 'basicsLookupdataLookupFilterService',
			function ($scope, $http, $q, platformContextService, procurementTicketsystemSubmitCartDataService,
				procurementTicketsystemPlaceOrderDialogConfigurations, platformModalService, $injector,
				$translate, procurementContextService, $rootScope, cartService, codeHelperService, moment, basicsLookupdataLookupFilterService) {

				$scope.submitcart = {};
				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant('procurement.ticketsystem.placeOrderDialog.title'),
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
				function getClerkFkByStructureAndProject(entity,structureId,projectId){
						var structureId = structureId !== null ? structureId : -1;
						var projectId = projectId !== null ? projectId : -1;
						var clerkId=entity.ClerkFK>0?entity.ClerkFK:-1;
						var clerkResponsibleId=entity.ClerkResponsibleFK>0?entity.ClerkResponsibleFK:-1;
						return $http.get(globals.webApiBaseUrl + 'procurement/ticketsystem/submitcart/getClerkByStructure?structureFk=' + structureId + '&projectFk=' + projectId+'&clerkFk='+clerkId+'&clerkResponsibleFk='+clerkResponsibleId).then(function (response) {
							if (!_.isNil(response.data)) {
								if(!_.isNil(response.data.ClerkFK)) {
									entity.ClerkFK = response.data.ClerkFK;
								}
								if(!_.isNil(response.data.ClerkResponsibleFK)) {
									entity.ClerkResponsibleFK = response.data.ClerkResponsibleFK;
								}
							}
						});
				}

				var structureRow = _.find(procurementTicketsystemPlaceOrderDialogConfigurations.rows, {model: 'StructureFK'});

				structureRow.validator=function(entity, modelValue, model){
					var projectId=entity.ProjectFK;
					getClerkFkByStructureAndProject(entity,modelValue,projectId);
				};



				var projectRow = _.find(procurementTicketsystemPlaceOrderDialogConfigurations.rows, {model: 'ProjectFK'});

				projectRow.asyncValidator = function (entity, modelValue, model) {
					getClerkFkByStructureAndProject(entity,entity.StructureFK,modelValue);
					if (!_.isNil(modelValue)) {
						$scope.error = null;
						entity[model] = modelValue;
						var q = $http.get(globals.webApiBaseUrl + 'procurement/ticketsystem/submitcart/address?projectFk=' + modelValue).then(function (response) {
							if (!_.isNil(response.data)) {
								entity.AddressEntity = response.data;
								entity.AddressFK = entity.AddressEntity.Id;

							}
						});
						var oldControllingUnitFk = entity.ControllingUnitFk;
						$scope.isValidating = true;
						feekBack(true, $translate.instant('procurement.ticketsystem.placeOrderDialog.loadControllingUnitByProject'), errorType.info);
						var p = $injector.get('procurementCommonControllingUnitFactory').getControllingUnit(modelValue, oldControllingUnitFk);
						return $q.all([p, q]).then(function (res) {
							if (res[0] !== '' && res[0] !== null) {
								entity.ControllingUnitFk = res[0];
							}
							$scope.isValidating = false;
							$scope.error = null;
						});
					} else {
						return $q.when(true);
					}
				};

				$scope.formOptions = {
					configure: procurementTicketsystemPlaceOrderDialogConfigurations,
					validationMethod: $scope.validateModel
				};

				$scope.isValidating = false;
				$scope.isSubmitting = false;
				$scope.isSubmitSuccess = false;
				var loadData = function loadData() {
					$scope.modalOptions.dialogLoading = true;
					var projectFK=procurementContextService.loginProject;
					var projectId=!_.isNil(projectFK)?projectFK:-1;
					procurementTicketsystemSubmitCartDataService.loadSubmitCart(projectId).then(function (item) {
						var arrPriceConditions = [];
						var priceListConds = [];
						var cartlist = $scope.$parent.$parent.$parent.modalOptions.value.cartList;

						for (var i = 0; i < cartlist.length; i++) {
							var material = cartlist[i].Material;
							var priceConditions = material.PriceConditions;
							if (priceConditions) {
								for (var j = 0; j < priceConditions.length; j++) {
									var priceCondition = priceConditions[j];
									if (priceCondition.IsActivated) {
										if (_.isNil(material.MaterialPriceListFk)) {
											arrPriceConditions.push(priceCondition.Id);
										} else {
											priceListConds.push(priceCondition.Id);
										}
									}
								}
							}
						}
						item.data.PriceConditions = arrPriceConditions;
						item.data.PriceListConditions = priceListConds;
						$scope.submitcart = item.data;
						$scope.submitcart.ProjectFK = procurementContextService.loginProject;
						$scope.submitcart.CompanyId = platformContextService.getContext().clientId;
						// initialize project delivery address
						if (!_.isNil(procurementContextService.loginProject)) {
							$http.get(globals.webApiBaseUrl + 'procurement/ticketsystem/submitcart/address?projectFk=' + procurementContextService.loginProject).then(function (response) {
								if (!_.isNil(response.data)) {
									$scope.submitcart.AddressEntity = response.data;
									$scope.submitcart.AddressFK = $scope.submitcart.AddressEntity.Id;
								}
							});
						}
						$scope.modalOptions.dialogLoading = false;
					}, function () {
						$scope.modalOptions.dialogLoading = false;
					});
				};

				$scope.validateModel = function () {
					return true;
				};

				$scope.modalOptions.cancel = function () {
					$scope.$close(false);
				};

				var groups = cartService.getSelectedCatalogs();
				var params = {
					hasRequisition: false,
					hasContract: false
				};

				params.hasContract = groups.some(function (group) {
					return group.prcType === 1;
				});

				params.hasRequisition = groups.some(function (group) {
					return group.prcType === 2;
				});

				$scope.params = params;

				$scope.modalOptions.ok = function () {
					if (!$scope.isSubmitSuccess) {
						if ($scope.submitcart.ProjectFK !== null && !$scope.isSubmitting) {
							$scope.isSubmitting = true;
							$scope.modalOptions.dialogLoading = true;
							doSubmit();
						} else if ($scope.submitcart.ProjectFK !== null) {
							$scope.$close(false);
						} else {
							feekBack(true, $translate.instant('procurement.ticketsystem.submitDialog.projectError'), errorType.error);
						}
					} else {
						$scope.$close(false);
					}

					function doSubmit() {
						$scope.submitcart.Groups = groups.map(function (group) {
							return {
								Type: group.prcType,
								BusinessPartnerId: group.businessPartnerFk,
								DateRequire: moment(group.requireDate).format('YYYY-MM-DD'),
								MaterialIds: group.items.map(function (cartItem) {
									return cartItem.Material.Id;
								}),
								Documents: group.docs,
								ConfigurationFk: group.configurationFk,
								CartItemVEntities:group.items.map(function (cartItem) {
									return {
										MdcMaterialFk : cartItem.Material.Id,
										Co2Project : cartItem.Material.Co2Project,
										Co2Source : cartItem.Material.Co2Source
									};
								})
							};
						});

						procurementTicketsystemSubmitCartDataService.placeOrder($scope.submitcart).then(function (result) {
							if (result.data) {
								cartService.clearSave(result.data.CartItems);
								$scope.modalOptions.dialogLoading = false;

								var headerText = $translate.instant('procurement.ticketsystem.placeOrderSuccess');

								var modalOptions = {
									resizeable: true,
									headerText: headerText,
									itemList: result.data.Items,
									params: params,
									templateUrl: globals.appBaseUrl + 'procurement.ticketsystem/partials/place-order-success-dialog.html'
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

				var filters = [{
					key: 'prc-ticketsystem-controlling-by-prj-filter',
					serverSide: true,
					serverKey: 'prc.ticketsystem.controllingunit.by.prj.filterkey',
					fn: function (entity) {
						return {
							CompanyFk: entity.companyId,
							PrjProjectFk: entity.ProjectFk,
							ExtraFilter: true,
							ByStructure: true
						};
					}
				}];

				basicsLookupdataLookupFilterService.registerFilter(filters);

				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});
			}]);
})(angular, globals);

(function (angular) {
	'use strict';

	var moduleName = 'controlling.actuals';

	angular.module(moduleName).controller('ControllingActualsGeneratePreliminaryActualsController',
		['globals', '_', '$scope', '$timeout', '$translate', '$injector', '$http', 'basicsLookupdataLookupFilterService', 'platformContextService', 'platformModalService',
			function (globals, _, $scope, $timeout, $translate, $injector, $http, basicsLookupdataLookupFilterService, platformContextService, platformModalService) {
				$scope.options = $scope.$parent.modalOptions;
				var currentItem = $scope.options.currentItem;
				$scope.currentItem = {
					CompanyYearFk: currentItem === null ? null : currentItem.CompanyYearFk,
					CompanyYearFkStartDate: currentItem === null ? null : currentItem.CompanyYearFkStartDate,
					CompanyYearFkEndDate: currentItem === null ? null : currentItem.CompanyYearFkEndDate,
					CompanyPeriodFk: currentItem === null ? null : currentItem.CompanyPeriodFk,
					CompanyPeriodFkStartDate: currentItem === null ? null : currentItem.CompanyPeriodFkStartDate,
					CompanyPeriodFkEndDate: currentItem === null ? null : currentItem.CompanyPeriodFkEndDate,
					IsSuccess: false,
					IsDelete: true
				};

				$scope.enableOK = function () {
					currentItem = $scope.currentItem;
					return !((!!currentItem) && (!!currentItem.CompanyYearFk) && (!!currentItem.CompanyPeriodFk));
				};

				var options =
					{
						showGrouping: false,
						groups: [
							{
								gid: '1',
								header: '',
								header$tr$: '',
								isOpen: true,
								visible: true,
								sortOrder: 1
							}
						],
						rows: [
							{
								gid: '1',
								rid: 'CompanyYearFk',
								label: $translate.instant('controlling.actuals.wizard.actuals.companyYear'),
								type: 'directive',
								model: 'CompanyYearFk',
								directive: 'basics-company-year-lookup',
								visible: true,
								sortOrder: 1,
								width: 150,
								options: {
									showClearButton: false,
									filterKey: 'basics-company-companyyear-filter',
									displayMember: 'TradingYear'
								},
								validator: function (/* entity, value, model */) {

								}
							}, {
								gid: '1',
								rid: 'companyYearFkStartDate',
								label: $translate.instant('controlling.actuals.entityStartDate'),
								type: 'directive',
								model: 'CompanyYearFk',
								directive: 'basics-company-year-lookup',
								options: {
									showClearButton: false,
									filterKey: 'basics-company-companyyear-filter',
									displayMember: 'StartDate',
									formatter: 'dateutc'
								},
								readonly: true,
								visible: true,
								sortOrder: 1,
								width: 150
							}, {
								gid: '1',
								rid: 'companyYearFkEndDate',
								label: $translate.instant('controlling.actuals.entityEndDate'),
								type: 'directive',
								model: 'CompanyYearFk',
								directive: 'basics-company-year-lookup',
								options: {
									showClearButton: false,
									filterKey: 'basics-company-companyyear-filter',
									displayMember: 'EndDate',
									formatter: 'dateutc'
								},
								readonly: true,
								visible: true,
								sortOrder: 1,
								width: 150
							},
							{
								gid: '1',
								rid: 'CompanyPeriodFk',
								label: $translate.instant('controlling.actuals.wizard.actuals.companyPeriod'),
								type: 'directive',
								model: 'CompanyPeriodFk',
								directive: 'basics-company-company-period-lookup',
								visible: true,
								sortOrder: 1,
								width: 150,
								options: {
									showClearButton: false,
									filterKey: 'basics-company-period-filter',
									displayMember: 'TradingPeriod'
								},
								validator: function (/* entity, value, model */) {

								}
							}, {
								gid: '1',
								rid: 'companyPeriodFkStartDate',
								label: $translate.instant('controlling.actuals.entityStartDate'),
								type: 'directive',
								model: 'CompanyPeriodFk',
								directive: 'basics-company-company-period-lookup',
								options: {
									showClearButton: false,
									filterKey: 'basics-company-period-filter',
									displayMember: 'StartDate',
									formatter: 'dateutc'
								},
								readonly: true,
								visible: true,
								sortOrder: 1,
								width: 150
							}, {
								gid: '1',
								rid: 'companyPeriodFkEndDate',
								label: $translate.instant('controlling.actuals.entityEndDate'),
								type: 'directive',
								model: 'CompanyPeriodFk',
								directive: 'basics-company-company-period-lookup',
								options: {
									showClearButton: false,
									filterKey: 'basics-company-period-filter',
									displayMember: 'EndDate',
									formatter: 'dateutc'
								},
								readonly: true,
								visible: true,
								sortOrder: 1,
								width: 150
							}, {
								gid: '1',
								rid: 'IsSuccess',
								label: $translate.instant('controlling.actuals.wizard.isSuccess'),
								fill: false,
								tooltip: $translate.instant('controlling.actuals.wizard.successText'),
								type: 'boolean',
								model: 'IsSuccess',
								visible: true,
								sortOrder: 1,
								width: 150
							}, {
								gid: '1',
								rid: 'IsDelete',
								label: $translate.instant('controlling.actuals.wizard.isDelete'),
								fill: false,
								tooltip: $translate.instant('controlling.actuals.wizard.deleteText'),
								type: 'boolean',
								model: 'IsDelete',
								visible: true,
								sortOrder: 1,
								width: 150
							}
						]
					};
				$scope.step = 0;
				$scope.modalTitle = $translate.instant('controlling.actuals.wizard.actuals.title');
				$scope.modalOptions.headerText = $scope.modalTitle;
				$scope.configureOptions = {
					configure: options
				};
				$scope.onOk = function () {
					$scope.modalOptions.ok();
				};

				$scope.onCancel = function () {
					$scope.modalOptions.cancel();
				};
				$scope.modalOptions.ok = function onOK() {
					$scope.isLoading = true;
					var parentService = $scope.options.parentService;
					var param = {
						CompanyYearFk: $scope.currentItem.CompanyYearFk,
						CompanyPeriodFk: $scope.currentItem.CompanyPeriodFk,
						IsSuccess: $scope.currentItem.IsSuccess,
						IsDelete: $scope.currentItem.IsDelete
					};
					var parentServiceSelect = parentService.getSelected();
					if (parentServiceSelect && parentServiceSelect.CompanyFk) {
						param.CompanyFk = parentServiceSelect.CompanyFk;
						param.HeaderId = parentServiceSelect.Id;
					}
					$http.post(globals.webApiBaseUrl + 'controlling/actuals/wizard/checkpreliminaryactuals', param)
						.then(function (response) {
							if (angular.isUndefined(response.data) || response.data === '') {
								$scope.isLoading = true;
								postGeneratepreliminaryactuals(param, parentService);
							} else {
								var modalOptions1 = {
									headerTextKey: $translate.instant('controlling.actuals.wizard.actuals.title'),
									bodyText: response.data + '. ' + $translate.instant('controlling.actuals.wizard.actuals.continue'),
									showCancelButton: true,
									showOkButton: true,
									actionButtonText: $translate.instant('cloud.common.ok'),
									cancelButtonText: $translate.instant('cloud.common.cancel'),
									iconClass: 'ico-info'
								};
								platformModalService.showDialog(modalOptions1).then(function(result){
									if(result.ok){
										$scope.isLoading = true;
										postGeneratepreliminaryactuals(param, parentService);
									}else{
										$scope.isLoading = false;
										$scope.$parent.$close(false);
									}
								},function(){
									$scope.isLoading = false;
									$scope.$parent.$close(false);
								});
							}
						});
				};

				function postGeneratepreliminaryactuals(param, parentService) {
					$http.post(globals.webApiBaseUrl + 'controlling/actuals/wizard/generatepreliminaryactuals', param)
						.then(function () {
							var parentServiceSelect = parentService.getSelected();
							$scope.isLoading = false;
							$scope.$parent.$close(false);
							parentService.gridRefresh();
							parentService.load();
							if (parentServiceSelect) {
								var currentItem = _.orderBy(parentService.getList(), 'Id');
								parentService.setSelected(currentItem);
							}
							var costDataService = $injector.get('controllingActualsCostDataListService');
							if (costDataService) {
								costDataService.gridRefresh();
							}
						}, function () {
							$scope.isLoading = false;
							$scope.$parent.$close(false);
						});
				}

				$scope.close = function () {
					$scope.$parent.$close(false);
				};
				$scope.modalOptions.cancel = $scope.close;

				var filters = [{
					key: 'basics-company-companyyear-filter',
					serverSide: true,
					fn: function () {
						return 'CompanyFk=' + platformContextService.getContext().clientId;
					}
				}, {
					key: 'basics-company-period-filter',
					serverSide: true,
					fn: function (item) {
						return 'CompanyYearFk=' + item.CompanyYearFk;
					}
				}];
				basicsLookupdataLookupFilterService.registerFilter(filters);
				$scope.$on('$destroy', function () {
					basicsLookupdataLookupFilterService.unregisterFilter(filters);
				});
			}
		]);
})(angular);

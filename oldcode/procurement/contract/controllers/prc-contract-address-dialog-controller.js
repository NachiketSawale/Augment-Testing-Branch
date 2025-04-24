(function () {
	'use strict';
	let moduleName = 'procurement.contract';
	angular.module(moduleName).controller('procurementContractAddressDialogController',
		['$scope', '_', 'globals', '$http', '$injector', 'params', '$translate', 'platformTranslateService', 'platformGridAPI', 'basicsLookupdataLookupControllerFactory',
			function ($scope, _, globals, $http, $injector, params, $translate, platformTranslateService, platformGridAPI, lookupControllerFactory) {
				let addressEty;
				let mainItem = params.serviceName.getSelected();
				let mainService = params.serviceName;
				// if ($scope.$parent.currentModule === 'project.main') {
				// mainService = $injector.get('projectMainService');
				// mainItem = $injector.get('projectMainService').getSelected();
				// } else if ($scope.$parent.currentModule === 'procurement.contract') {
				// mainService = $injector.get('procurementContractHeaderDataService');
				// mainItem = $injector.get('procurementContractHeaderDataService').getSelected();
				// }else if($scope.$parent.currentModule === 'procurement.package'){
				// mainService = $injector.get('procurementPackageDataService');
				// mainItem = $injector.get('procurementPackageDataService').getSelected();
				// }
				// if (!mainItem) {
				// return;
				// }
				$scope.actionButtonText = $translate.instant('basics.common.ok');
				$scope.cancelButtonText = $translate.instant('basics.common.cancel');
				$scope.gridId = 'E9F9813B7B19477AA37020B904A9483F';
				$scope.gridTitle = $translate.instant('procurement.contract.addressDialogTitle');
				$scope.grid = {
					state: $scope.gridId
				};
				$scope.data = {
					state: $scope.gridId
				};
				$scope.modalOptions = {
					gridTitle: 'cloud.common.searchResults'
				};
				let settings = getColumns();
				let gridConfig = {
					columns: settings,
					data: [],
					id: $scope.gridId,
					gridId: $scope.gridId,
					lazyInit: true,
					options: {
						skipPermissionCheck: true,
						iconClass: 'control-icons',
						idProperty: 'Id',
						collapsed: false,
					}
				};
				if (!platformGridAPI.grids.exist($scope.gridId)) {
					platformGridAPI.grids.config(gridConfig);
					platformTranslateService.translateGridConfig(gridConfig);
				}
				if (!$scope.tools) {
					lookupControllerFactory.create({
						grid: true,
						dialog: true,
						search: false
					}, $scope, gridConfig);
				}
				let formConfig = getFormContainerOptions();
				$scope.modalOptions = {
					headerText: 'headerMainText',
				};
				platformTranslateService.translateFormConfig(formConfig);
				$scope.formContainerOptions = {};
				$scope.formContainerOptions.formOptions = {
					configure: formConfig,
					showButtons: [],
					validationMethod: function () {
					}
				};
				$scope.close = () => {
					$scope.$close(false);
				};
				$scope.search = (searchValue) => {
					let formEty;
					if ($scope.currentItem.CompanyFk) {
						formEty = {'CompanyFk': $scope.currentItem.CompanyFk};
						if ($scope.currentItem.ProjectFk) {
							formEty = {'CompanyFk': $scope.currentItem.CompanyFk, 'ProjectFk': $scope.currentItem.ProjectFk};
						}
					}
					let additionalParam;
					if ($scope.currentItem.CompanyFk) {
						additionalParam = {'CompanyFk': $scope.currentItem.CompanyFk};
						if ($scope.currentItem.ProjectFk) {
							additionalParam = {'CompanyFk': $scope.currentItem.CompanyFk, 'ProjectFk': $scope.currentItem.ProjectFk};
						}
					}
					let searchFields = {
						AdditionalParameters: additionalParam,
						SearchFields: ['AddressLine', 'Zipcode', 'Address'],
						SearchText: searchValue = _.isNil(searchValue) ? '' : searchValue,
						FormEntity: formEty,
						TreeState: {'StartId': null, 'Depth': null}
					};
					$http.post(globals.webApiBaseUrl + 'basics/lookupdata/masternew/getsearchlist?lookup=addresslookupservice', searchFields).then(function (response) {
						if (response || response.data) {
							let data = response.data.SearchList;
							platformGridAPI.items.data($scope.gridId, data);
						}
					});
				};
				$scope.currentItem = {
					CompanyFk: mainItem.CompanyFk,
					ProjectFk: mainItem.ProjectFk
				};
				$scope.ok = () => {
					if (Object.prototype.hasOwnProperty.call(mainItem, 'AddressEntity')) {
						mainItem.AddressEntity = addressEty;
						mainItem.AddressEntity.CountryFk = addressEty.BasCountryFk;
						mainItem.AddressEntity.StateFk = addressEty.BasStateFk;
					} else if (Object.prototype.hasOwnProperty.call(mainItem, 'Address')) {
						mainItem.Address = addressEty;
						mainItem.Address.CountryFk = addressEty.BasCountryFk;
						mainItem.Address.StateFk = addressEty.BasStateFk;
					}

					mainService.markItemAsModified(mainItem);
					$scope.$close(false);
				};
				platformGridAPI.events.register($scope.gridId, 'onDblClick', rtnVal);
				platformGridAPI.events.register($scope.gridId, 'onClick', onClickFuc);
				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onDblClick', rtnVal);
					platformGridAPI.events.unregister($scope.gridId, 'onClick', onClickFuc);
				});

				function rtnVal(e, arg) {
					let selectedItem = arg.grid.getDataItem(arg.row);
					if (Object.prototype.hasOwnProperty.call(mainItem, 'AddressEntity')) {
						mainItem.AddressEntity = selectedItem;
						mainItem.AddressEntity.CountryFk = addressEty.BasCountryFk;
						mainItem.AddressEntity.StateFk = addressEty.BasStateFk;
					} else if (Object.prototype.hasOwnProperty.call(mainItem, 'Address')) {
						mainItem.Address = selectedItem;
						mainItem.Address.CountryFk = addressEty.BasCountryFk;
						mainItem.Address.StateFk = addressEty.BasStateFk;
					}


					mainService.markItemAsModified(mainItem);
					$scope.$close(false);
				}

				function onClickFuc(e, arg) {
					addressEty = null;
					addressEty = arg.grid.getDataItem(arg.row);
				}

				function getFormContainerOptions() {
					return {
						'fid': 'procurement.contract.showAddressDialog',
						'version': '1.1.0',
						showGrouping: false,
						title$tr$: '',
						'groups': [
							{
								'gid': 'baseGroup',
								'isOpen': true,
								'visible': true,
								'sortOrder': 1
							}
						],
						'rows': [
							{
								'rid': 'company',
								'gid': 'baseGroup',
								'label$tr$': 'cloud.common.entityCompany',
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-assigned-company-lookup',
									descriptionMember: 'CompanyName',
									lookupOptions: {
										showClearButton: true,
										events: [
											{
												name: 'onSelectedItemChanged',
												handler: function onSelectedItemChangedHandler(e, args) {
													if (args && args.entity) {
														let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
														if (!args.selectedItem) {
															args.entity.ProjectFk = null;
															platformRuntimeDataService.readonly(args.entity, [{field: 'ProjectFk', readonly: true}]);
														} else {
															if (args.selectedItem.Id !== args.entity.CompanyFk) {
																args.entity.ProjectFk = null;
															}
															platformRuntimeDataService.readonly(args.entity, [{field: 'ProjectFk', readonly: false}]);
														}
													}
												}
											}
										]
									}
								},
								model: 'CompanyFk'
							},
							{
								'rid': 'project',
								'gid': 'baseGroup',
								'label$tr$': 'cloud.common.entityProject',
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'model': 'ProjectFk',
								options: {
									lookupDirective: 'procurement-project-lookup-dialog',
									descriptionMember: 'ProjectName',
									lookupOptions: {
										lookupType: 'PrcProject',
										filterKey: 'project-main-project-for-rfq-requisition-filter',
										showClearButton: true
									}
								},
								readonly: false
							}
						]
					};
				}

				function getColumns() {
					return [
						{id: 'zipcode', formatter: 'description', field: 'Zipcode', name: 'Zip Code', name$tr$: 'cloud.common.entityZipCode'},
						{id: 'addressline', formatter: 'description', field: 'AddressLine', name: 'Delivery Address', name$tr$: 'cloud.common.entityDeliveryAddress'},
						{id: 'address', formatter: 'description', field: 'Address', name: 'Address', name$tr$: 'cloud.common.entityAddress'}
					];
				}
			}
		]);
})();
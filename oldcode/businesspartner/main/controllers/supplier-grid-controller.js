(function () {
	'use strict';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').controller('businesspartnerMainSupplierListController',
		['$scope','$timeout', '$translate', 'PlatformMessenger', 'businesspartnerMainSupplierDataService', 'businessPartnerMainSupplierUIStandardService', 'platformGridControllerService',
			'businesspartnerMainSupplierValidationService', 'platformModalService', '_', 'platformContextService',
			function ($scope, $timeout, $translate, PlatformMessenger, businesspartnerMainSupplierDataService, businessPartnerMainSupplierUIStandardService, platformGridControllerService,
				businesspartnerMainSupplierValidationService, platformModalService, _, platformContextService) {
				let myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function () {
						businesspartnerMainSupplierDataService.propertyChanged();
					},
					rowChangeCallBack: function () {
						// TODO chi: workaround - because the container's button's state is not refreshed
						$timeout(function () {
							$scope.$apply();
							// businesspartnerMainSupplierDataService.gridRefresh();
						}, 0);
					}
				};
				let userInfo = platformContextService.getContext();
				businesspartnerMainSupplierDataService.getSubledgerContextByCompanyId(userInfo.signedInClientId);
				let createSupplierCompanyBtnConfig = {
					id: 't-newSupplierCompany',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbarDefineCompanyRestriction'),
					iconClass: 'tlb-icons ico-add-customer-company',
					disabled: function () {
						let parentService = businesspartnerMainSupplierDataService;
						if(!_.isEmpty(parentService.getSelected())) {
							if(parentService.isReadOnly()) {
								return true;
							}
							return parentService.currentSubledgerContextFk !== parentService.getSelected().SubledgerContextFk;
						}
						return true;
					},
					fn: function () {
						let modalOptions = {
							width: '700px',
							height: '350px',
							resizeable: true,
							headerTitleText: 'businesspartner.main.screenSupplierCompanyDailogTitle',
							templateUrl: 'businesspartner.main/partials/screen-business-partner-customercompany-or-suppliercompany-modal.html',
							canSave: true,
							dataService: 'businessPartnerSupplierCompanyDataService'
						};
						platformModalService.showDialog(modalOptions);
					}
				};

				function initContainer() {
					$scope.tools.items.splice(0, 0, createSupplierCompanyBtnConfig);

					// Work around to fix the issue: the button disappears when using grouping.
					let superSetTools = $scope.setTools;
					$scope.setTools = function (tools, cached) {
						if (!_.some(tools.items, item => item.id === 't-newSupplierCompany')) {
							tools.items.splice(0, 0, createSupplierCompanyBtnConfig);
						}
						superSetTools(tools, cached);
						$scope.tools.items.splice(_.findIndex(tools.items, item => item.id === 't-newSupplierCompany'), 1);
						$scope.tools.items.splice(0, 0, createSupplierCompanyBtnConfig);
					};

					$scope.triggerUpdateEvent = new PlatformMessenger();
					updateToolbarStatusList();
					businesspartnerMainSupplierDataService.registerListLoaded(updateToolbarStatusList);

				}

				function updateToolbarStatusList() {
					if ($scope.tools) {
						$scope.tools.update();
					}
					// Only the grid events call the updateButtons function. This events are out of the
					// digest cycle of angular. Therefor we have to start an new digest.
					$timeout(function () {
						$scope.$apply();
					});
				}

				businesspartnerMainSupplierDataService.registerSelectionChanged(onSelectedRowsChanged);

				function onSelectedRowsChanged() {
					let mainItemId = businesspartnerMainSupplierDataService.getIfSelectedIdElse(-1);
					businesspartnerMainSupplierDataService.loadSupplierCompanyItem(mainItemId);
					updateToolbarStatusList();
				}

				businesspartnerMainSupplierDataService.updateCompanyData();
				let validator = businesspartnerMainSupplierValidationService(businesspartnerMainSupplierDataService);
				platformGridControllerService.initListController($scope, businessPartnerMainSupplierUIStandardService, businesspartnerMainSupplierDataService, validator, myGridConfig);

				businesspartnerMainSupplierDataService.fillReadonlyModels(businessPartnerMainSupplierUIStandardService.getStandardConfigForListView());
				initContainer();

				$scope.$on('$destroy', function () {
					businesspartnerMainSupplierDataService.unregisterSelectionChanged(onSelectedRowsChanged);
					businesspartnerMainSupplierDataService.unregisterListLoaded(updateToolbarStatusList);

				});
			}
		]);
})();
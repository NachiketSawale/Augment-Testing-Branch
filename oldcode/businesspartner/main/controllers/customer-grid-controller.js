(function () {
	'use strict';

	angular.module('businesspartner.main').controller('businesspartnerMainCustomerListController',
		['$scope', '$http', '$timeout', '$translate', 'platformModalService', 'businesspartnerMainHeaderDataService',
			'PlatformMessenger', 'platformGridAPI',
			'businesspartnerMainCustomerDataService', 'businessPartnerMainCustomerUIStandardService', 'platformGridControllerService', 'businesspartnerMainCustomerValidationService', '_', 'platformContextService',
			/* jshint -W072 */ // many parameters because of dependency injection
			function ($scope, $http, $timeout, $translate, platformModalService, businesspartnerMainHeaderDataService,
				PlatformMessenger, platformGridAPI,
				businesspartnerMainCustomerDataService, businessPartnerMainCustomerUIStandardService, platformGridControllerService, businesspartnerMainCustomerValidationService, _, platformContextService) {

				let myGridConfig = {
					initCalled: false,
					columns: [],
					cellChangeCallBack: function () {
						businesspartnerMainCustomerDataService.propertyChanged();
					},
					rowChangeCallBack: function () {
						// TODO chi: workaround - because the container's button's state is not refreshed
						$timeout(function () {
							$scope.$apply();
							// businesspartnerMainCustomerDataService.gridRefresh();
						}, 0);
					}
				};
				let userInfo = platformContextService.getContext();
				businesspartnerMainCustomerDataService.getSubledgerContextByCompanyId(userInfo.signedInClientId);
				let createCustomerCompanyBtnConfig = {
					id: 't-newCustomerCompany',
					type: 'item',
					caption: $translate.instant('businesspartner.main.toolbarDefineCompanyRestriction'),
					iconClass: 'tlb-icons ico-add-customer-company',
					disabled: function () {
						let parentService = businesspartnerMainCustomerDataService;
						let bpDataService = businesspartnerMainCustomerDataService.parentService();
						let item = bpDataService.getSelected();
						if (_.isEmpty(parentService.getSelected())) {
							return true;
						} else if (bpDataService.isBpStatusHasRight(item, 'AccessRightDescriptorFk', 'statusWithCreateRight')
							&& parentService.currentSubledgerContextFk === parentService.getSelected().SubledgerContextFk) {
							return false;
						}
						return true;
					},
					fn: function () {
						let modalOptions = {
							width: '700px',
							height: '350px',
							resizeable: true,
							headerTitleText: 'businesspartner.main.screenCustomerCompanyDailogTitle',
							templateUrl: 'businesspartner.main/partials/screen-business-partner-customercompany-or-suppliercompany-modal.html',
							canSave: true,
							dataService: 'businessPartnerCustomerCompanyDataService'
						};
						platformModalService.showDialog(modalOptions);
					}
				};

				function initContainer() {
					$scope.tools.items.splice(0, 0, createCustomerCompanyBtnConfig);

					// Work around to fix the issue: the button disappears when using grouping.
					let superSetTools = $scope.setTools;
					$scope.setTools = function (tools, cached) {
						if (!_.some(tools.items, item => item.id === 't-newCustomerCompany')) {
							tools.items.splice(0, 0, createCustomerCompanyBtnConfig);
						}
						superSetTools(tools, cached);
						$scope.tools.items.splice(_.findIndex(tools.items, item => item.id === 't-newCustomerCompany'), 1);
						$scope.tools.items.splice(0, 0, createCustomerCompanyBtnConfig);
					};

					$scope.triggerUpdateEvent = new PlatformMessenger();
					updateToolbarStatusList();
					businesspartnerMainCustomerDataService.registerListLoaded(updateToolbarStatusList);

				}

				businesspartnerMainCustomerDataService.registerSelectionChanged(onSelectedRowsChanged);

				function onSelectedRowsChanged() {
					let mainItemId = businesspartnerMainCustomerDataService.getIfSelectedIdElse(-1);
					businesspartnerMainCustomerDataService.loadCustomerCompanyItem(mainItemId);
					updateToolbarStatusList();
				}

				function updateToolbarStatusList() {
					if ($scope.tools) {
						$scope.tools.update();
					}
				}

				let validator = businesspartnerMainCustomerValidationService(businesspartnerMainCustomerDataService);
				platformGridControllerService.initListController($scope, businessPartnerMainCustomerUIStandardService, businesspartnerMainCustomerDataService, validator, myGridConfig);

				businesspartnerMainCustomerDataService.fillReadonlyModels(businessPartnerMainCustomerUIStandardService.getStandardConfigForListView());
				initContainer();

				$scope.$on('$destroy', function () {
					businesspartnerMainCustomerDataService.unregisterSelectionChanged(onSelectedRowsChanged);
					businesspartnerMainCustomerDataService.unregisterListLoaded(updateToolbarStatusList);

				});
			}
		]);
})();
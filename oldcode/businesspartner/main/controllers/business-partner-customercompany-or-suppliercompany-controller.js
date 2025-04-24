/**
 * Created by zpa on 2016/10/10.
 */
(function (angular) {
	'use strict';
	var moduleName = 'businesspartner.main';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('businessPartnerCustomerCompanyOrSupplierCompanyController',
		['$scope', '$injector', '$translate', 'platformGridAPI', 'basicsCommonDialogGridControllerService', 'businessPartnerMainSupplierOrCustomerCompanyValidationService','_',
			function ($scope, $injector, $translate, platformGridAPI, basicsCommonDialogGridControllerService, validatorService,_
			) {

				var myGridConfig = {
					initCalled: false,
					columns: [],
					uuid: 'B0F91870D5804749BE358015D372B8F3',
					skipPermissionCheck: true
				};
				var dataService = $injector.get($scope.modalOptions.dataService);
				var headerText = $scope.modalOptions.headerTitleText;

				$scope.modalOptions = {
					closeButtonText: $translate.instant('cloud.common.cancel'),
					actionButtonText: $translate.instant('cloud.common.ok'),
					headerText: $translate.instant(headerText)
				};

				$scope.modalOptions.cancel = function () {
					dataService.clearCache();
					$scope.$dismiss('cancel');
				};

				$scope.modalOptions.ok = function (result) {
					platformGridAPI.grids.commitEdit(myGridConfig.uuid);
					var customResult = result || {};
					dataService.storeData();
					if (_.isObject($scope.modalOptions.value)) {
						customResult.value = $scope.modalOptions.value;
					}
					customResult['ok'] = true; // jshint ignore:line
					$scope.$close(customResult);
				};

				$scope.setTools = function (tools) {
					tools.update = function () {
						tools.refreshVersion += 1;
					};
					$scope.tools = tools;
					tools.refreshVersion = Math.random();
					tools.refresh = function () {
						tools.refreshVersion += 1;
					};
				};

				if (dataService.getServiceName() === 'businessPartnerCustomerCompanyDataService') {
					basicsCommonDialogGridControllerService.initListController($scope, $injector.get('businessPartnerCustomerCompanyUIStandardService'), dataService, validatorService(dataService), myGridConfig);
				} else {
					basicsCommonDialogGridControllerService.initListController($scope, $injector.get('businessPartnerSupplierCompanyUIStandardService'), dataService, validatorService(dataService), myGridConfig);
				}
				// eslint-disable-next-line no-undef
				platformGridAPI.grids.element('id', $scope.gridId).options.editorLock = new Slick.EditorLock();

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't1',
							sort: 0,
							caption: 'cloud.common.taskBarNewRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-new',
							disabled: function () {
								return dataService.disableCreate();
							},
							fn: function () {
								dataService.createItem();
							}
						},
						{
							id: 't2',
							sort: 10,
							caption: 'cloud.common.taskBarDeleteRecord',
							type: 'item',
							iconClass: 'tlb-icons ico-rec-delete',
							disabled: function () {
								return !dataService.getSelected() || dataService.disableDelete();
							},
							fn: function () {
								if (dataService.hasSelection()) {
									dataService.deleteItem(dataService.getSelected());
								}

							}

						}
					]
				});

				$scope.$on('$destroy', function () {
					platformGridAPI.grids.unregister($scope.gridId);
				});

				dataService.loadItemList();
			}
		]);
})(angular);
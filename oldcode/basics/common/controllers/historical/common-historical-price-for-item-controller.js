(function (angular) {

	'use strict';
	const moduleName = 'basics.common';
	angular.module(moduleName).controller('commonHistoricalPriceForItemController', [
		'$scope',
		'$translate',
		'$injector',
		'procurementContextService',
		'procurementCommonPrcItemDataService',
		'platformGridControllerService',
		'procurementCommonItemPriceService',
		'procurementCommonItemPriceLayout',
		'_',
		'$q',
		function (
			$scope,
			$translate,
			$injector,
			moduleContext,
			dataServiceFactory,
			platformGridControllerService,
			dataService,
			itemPriceLayout,
			_,
			$q) {

			const uuid = $scope.getContentValue('uuid');
			const configServiceName = $scope.getContentValue('configService');
			let configService = $injector.get(configServiceName);
			const isDynamicParent = $scope.getContentValue('isDynamicParent');
			if (isDynamicParent) {
				const dynamicParent = dataServiceFactory.getService(moduleContext.getMainService());
				configService = configService.getService(dynamicParent);
			}
			const parentService = configService.parentService;
			configService.init({onRowDeselected: resetData, onItemSelected: loadHistory});

			$scope.currentItem = {
				queryNeutralMaterial: true,
				queryFromMaterialCatalog: true,
				queryFromQuotation: true,
				queryFromContract: true,
				startDate: null,
				endDate: null,
				pricecondition: null,
				priceRange: '',
				rt$hasError: function () {
					return $scope.currentItem.startDate && $scope.currentItem.endDate && $scope.currentItem.startDate > $scope.currentItem.endDate;
				},
				rt$errorText: function () {
					if ($scope.currentItem.rt$hasError()) {
						return $translate.instant('basics.material.updatePriceWizard.DateError', {
							startDate: 'Start date',
							endDate: 'End date'
						});
					}
					return '';
				}
			};
			$scope.currentItem.pricecondition = -1;
			$scope.gridId = uuid;
			const gridConfig = {
				initCalled: false,
				lazyInit: true,
				parentProp: '',
				childProp: 'Children',
				grouping: false,
				columns: [],
				uuid: uuid,
				idProperty: 'Index',
				enableSkeletonLoading: false
			};

			$scope.getMaterialCodeDesc = function () {
				let moduleName = configService.parentService.getModule().name;
				if (moduleName === 'basics.material') {
					if ($scope.selectedItem) {
						let descriptionInfo = $scope.selectedItem.DescriptionInfo1;
						if (descriptionInfo) {
							let description = ($scope.selectedItem && descriptionInfo && descriptionInfo.Description) ? descriptionInfo.Description : '';
							return $scope.selectedItem.Code + '-' + description;
						}
					}
				}
				else {
					const description = ($scope.selectedItem && $scope.selectedItem.Description1) ? $scope.selectedItem.Description1 : '';
					const lookupItem = _.find(configService.getMaterial(), {Id: $scope.selectedItem ? $scope.selectedItem.MdcMaterialFk : null});
					if (!description && !lookupItem) {
						return '';
					}
					return (lookupItem ? lookupItem.Code : '') + '-' + description;
				}
			};

			$scope.isFromPriceCom = true;
			dataService = dataService.getService(parentService, {
				doCallHTTPRead: function () {
					return $q.when([]);
				}
			});
			itemPriceLayout = itemPriceLayout.getUI(dataService, {hasSelected: false});
			platformGridControllerService.initListController($scope, itemPriceLayout, dataService, null, gridConfig);

			loadHistory();

			function loadHistory() {
				$scope.currentItem.priceRange = '';
				const selectedParentItem = configService.getSelectedParentItem();
				if (!selectedParentItem) {
					resetData();
					return;
				}
				$scope.selectedItem = configService.getSelectedPrcItem(selectedParentItem);
				if ($scope.selectedItem) {
					$scope.formDisabled = false;
					const headerParentItem = configService.getHeaderParentItem();
					dataService.setGridDataForItems($scope.selectedItem, [configService.getPrcItemId($scope.selectedItem)], $scope.currentItem, configService.getMaterialId($scope.selectedItem), headerParentItem);
				} else {
					resetData();
				}
			}

			function resetData() {
				$scope.selectedItem = null;
				$scope.formDisabled = true;
				$scope.currentItem.priceRange = '';
				dataService.clearContent();
			}

			$scope.search = function () {
				loadHistory();
			};

			$scope.materialCatalogChange = function () {
				if (!$scope.currentItem.queryFromMaterialCatalog) {
					$scope.currentItem.pricecondition = null;
					$scope.currentItem.queryNeutralMaterial = false;
				} else {
					$scope.currentItem.pricecondition = -1;
				}
			};

			$scope.$on('$destroy', function () {
				configService.unregister();
			});
		}
	]);

})(angular);
(function (angular) {
	'use strict';
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module('businesspartner.main').controller('businessPartnerRelationChartController',
		['$scope', '$timeout', '$translate', 'platformObjectHelper', 'basicsLookupdataLookupDescriptorService', 'businesspartnerMainHeaderDataService', 'businessPartnerRelationChartService', 'PlatformMessenger', '$rootScope',
			'_',
			function ($scope, $timeout, $translate, platformObjectHelper, lookupDescriptorService, businesspartnerMainHeaderDataService, businessPartnerRelationChartService, PlatformMessenger, $rootScope,_) {

				let selectionChanged = function (noUseCache) {
					businessPartnerRelationChartService.load(5, noUseCache).then(function (data) {
						$scope.refresh = $scope.refresh ? $scope.refresh : $scope.$$childHead.refresh;
						$scope.refresh(data, {relationArrows: businessPartnerRelationChartService.relationArrows});
					});
				};

				function selectionChangedNoUseCache()
				{
					selectionChanged(true);
				}

				let unRegisterGenwiz = $rootScope.$on('genwiz:bpChanged', function () {
					selectionChanged();
				});

				$scope.setTools = $scope.setTools ? $scope.setTools : _.noop;

				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't-showBranch',
							type: 'check',
							caption: $translate.instant('businesspartner.main.toolbarShowBranch'),
							iconClass: 'tlb-icons ico-refresh-all',
							fn: function (btnId, btn) {
								businessPartnerRelationChartService.showBranchDimension = btn.value;
								selectionChanged(true);
							}
						},
						{
							id: 'd1',
							prio: 50,
							type: 'divider',
							isSet: true
						},
						{
							id: 't-refresh',
							type: 'item',
							caption: $translate.instant('businesspartner.main.toolbarSvgRefresh'),
							iconClass: 'tlb-icons ico-refresh',
							fn: function () {
								selectionChanged(true);
							}
						},
						{
							id: 't-all',
							type: 'item',
							caption: $translate.instant('businesspartner.main.toolbarSvgWhole'),
							iconClass: 'tlb-icons ico-zoom-100',
							fn: function () {
								$scope.showAll();
							}
						},
						{
							id: 't-central',
							type: 'item',
							caption: $translate.instant('businesspartner.main.toolbarSvgCentral'),
							iconClass: 'tlb-icons ico-zoom-fit',
							fn: function () {
								$scope.central();
							}
						},
						{
							id: 't-zoom-in',
							type: 'item',
							caption: $translate.instant('businesspartner.main.toolbarSvgZoomIn'),
							iconClass: 'tlb-icons ico-zoom-in',
							fn: function () {
								$scope.zoomIn();
							}
						},
						{
							id: 't-zoom-out',
							type: 'item',
							caption: $translate.instant('businesspartner.main.toolbarSvgZoomOut'),
							iconClass: 'tlb-icons ico-zoom-out',
							fn: function () {
								$scope.zoomOut();
							}
						}
					]
				});
				$scope.triggerUpdateEvent = new PlatformMessenger();
				businesspartnerMainHeaderDataService.registerItemModified(selectionChanged);
				businesspartnerMainHeaderDataService.registerSelectionChanged(selectionChangedNoUseCache);
				$scope.$on('$destroy', function () {
					businesspartnerMainHeaderDataService.unregisterSelectionChanged(selectionChangedNoUseCache);
					businesspartnerMainHeaderDataService.unregisterItemModified(selectionChanged);
				});

				$timeout(selectionChanged, 500);
				$scope.$on('splitter.ResizeChanged', function () {
					$scope.triggerUpdateEvent.fire();
					unRegisterGenwiz();
				});

			}]);
})(angular);
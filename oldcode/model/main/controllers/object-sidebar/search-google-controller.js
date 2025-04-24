/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global $ */
	'use strict';
// jshint -W072
// jshint +W098
	/**
 @ngdoc controller
	 * @name cloudSettingsDialogController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	angular.module('model.main').controller('modelMainObjectSidebarSearchGoogleController',
		['$scope', 'cloudDesktopSidebarService', 'platformTranslateService', '$translate', '$timeout',
			'modelViewerModelSelectionService', 'modelViewerFreeTextSearchService', 'modelViewerObjectTreeService',
			'modelViewerModelIdSetService', 'modelViewerStandardFilterService', '$q',
			function ($scope, cloudDesktopSidebarService, platformTranslateService, $translate, $timeout,
			          modelSelectionService, modelViewerFreeTextSearchService, modelViewerObjectTreeService,
			          modelViewerModelIdSetService, modelViewerStandardFilterService, $q) {

				$scope.searchOptions = {
					filterInfo: cloudDesktopSidebarService.filterInfo,
					filterRequest: {
						pinningOptions: {
							isActive: true,
							showPinningContext: [{
								show: true,
								token: 'project.main'
							}, {
								show: true,
								token: 'model.main'
							}]
						}
					},
					useCurrentClientChk: {
						ctrlId: 'useCurrentClientId',
						labelText: $translate.instant('cloud.desktop.sdGoogleBelongtoBPChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleBelongtoBPChk'
					},
					includeNonActiveItemsChk: {
						ctrlId: 'includeNonActiveItemsId',
						labelText: $translate.instant('cloud.desktop.sdGoogleInactiveChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleInactiveChk'
					},
					showRecordsInfo: true,
					//noSearchResult: 'No Search results',
					//noSearchResult$tr$: 'cloud.desktop.sdGoogleNoSearchResult',

					onClearSearch: function () {
						$scope.filterRequest.pattern = '';
					},
					onStartSearch: function () {
						//console.log('search button pressed', this.pattern);
						executeFreeTextSearch();
						//cloudDesktopSidebarService.filterStartSearch({resetPageNumber: true});
					},
					onPageBackward: function () {
						//startSearch(this.pattern);
						cloudDesktopSidebarService.filterPageBackward();
						cloudDesktopSidebarService.filterStartSearch();
					},
					onPageForward: function () {
						cloudDesktopSidebarService.filterPageForward();
						cloudDesktopSidebarService.filterStartSearch();
					},
					onClearProjectContext: function () {
						cloudDesktopSidebarService.clearProjectContext();
					},
					onPageFirst: function () {
						cloudDesktopSidebarService.filterPageFirst();
						cloudDesktopSidebarService.filterStartSearch();
					},
					onPageLast: function () {
						cloudDesktopSidebarService.filterPageLast();
						cloudDesktopSidebarService.filterStartSearch();
					}
				};

				function executeFreeTextSearch() {
					var filter = modelViewerStandardFilterService.getFilterById('objectSearchSidebar');
					if (filter.isPending) {
						return;
					}
					filter.isPending = true;

					modelViewerFreeTextSearchService($scope.filterRequest ? $scope.filterRequest.pattern : '').then(function (results) {
						var treeInfo = modelViewerObjectTreeService.getTree();
						if (treeInfo) {
							var resultMap = modelViewerModelIdSetService.createFromCompressedStringWithArrays(results);
							resultMap = resultMap.useSubModelIds();
							filter.getResultController().setIncludedMeshIds(treeInfo.objectToMeshIds(resultMap));
						}
						filter.isPending = false;
					}, function () {
						filter.isPending = false;
						return $q.reject();
					});
				}

				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject($scope.searchOptions, ['labelText', 'noSearchResult']);
				};


				/**
				 * selfexplaining....
				 */
				function setFocusToSearchInput() {
					// must run in new digest cycle, otherwise focus not working, we delay it slightly to be sure focus
					// move to this input field
					$timeout(function () {
						var elem = $('#GoogleSearchInput');
						if (elem) {
							elem.focus().select();
						}
					}, 100);
				}

				/**
				 * trigger in case of Sidebar Search is opened
				 * @param cmdId
				 */
				function onOpenSidebar(cmdId) {
					if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().search)) {
						setFocusToSearchInput();
					}
				}

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				// register translation changed event
				cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);

				setFocusToSearchInput();

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
					cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
				});


			}]);
})(angular);

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

// eslint-disable-next-line no-redeclare
/* global angular,$,_ */
angular.module('procurement.common').controller('procurementCommonSearchGoogleController',
	['$scope', 'cloudDesktopSidebarService', 'platformTranslateService', '$translate', '$timeout', 'cloudDesktopSidebarAutofilterService',
		function ($scope, cloudDesktopSidebarService, platformTranslateService, $translate, $timeout, cloudDesktopSidebarAutofilterService) {
			'use strict';

			$scope.searchOptions = {
				filterInfo: cloudDesktopSidebarService.filterInfo,
				filterRequest: cloudDesktopSidebarService.filterRequest,
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
				includeChainedItemsChk: {
					ctrlId: 'includeChainedItemsId',
					labelText: $translate.instant('procurement.common.sdGoogleInChainedChk'),
					labelText$tr$: 'procurement.common.sdGoogleInChainedChk'
				},
				quotesFromSameRFQChk: {
					ctrlId: 'quotesFromSameRFQId',
					labelText: $translate.instant('procurement.common.sdGoogleQuotesFromRFQChk'),
					labelText$tr$: 'procurement.common.sdGoogleQuotesFromRFQChk'
				},
				onlyDisplayLatestQuoteVersionChk: {
					ctrlId: 'onlyDisplayLatestQuoteVersionId',
					labelText: $translate.instant('procurement.common.sdGoogleOnlyDisplayLatestQuoteVersionChk'),
					labelText$tr$: 'procurement.common.sdGoogleOnlyDisplayLatestQuoteVersionChk'
				},
				includeDateSearchChk: {
					ctrlId: 'includeDateSearchId',
					labelText: $translate.instant('cloud.desktop.sdGoogleDateSearchChk'),
					labelText$tr$: 'cloud.desktop.sdGoogleDateSearchChk'
				},
				showRecordsInfo: true,
				// noSearchResult: 'No Search results',
				// noSearchResult$tr$: 'cloud.desktop.sdGoogleNoSearchResult',

				onClearSearch: function () {
					$scope.searchOptions.filterRequest.pattern = '';
					cloudDesktopSidebarService.filterResetPattern();
				},
				onStartSearch: function () {
					// console.log('search button pressed', this.pattern);
					var pattern = $scope.searchOptions.filterRequest.pattern;
					var furtherFilters = [
						{Token: 'includeChainedItems', Value: $scope.searchOptions.filterRequest.includeChainedItems},
						{Token: 'quotesFromSameRFQ', Value: $scope.searchOptions.filterRequest.quotesFromSameRFQ},
						{Token: 'onlyDisplayLatestQuoteVersion', Value: $scope.searchOptions.filterRequest.onlyDisplayLatestQuoteVersion}
					];

					cloudDesktopSidebarService.filterRequest.furtherFilters = furtherFilters;
					saveAutofilterDefinition($scope.searchOptions.filterRequest);
					cloudDesktopSidebarService.filterSearchFromPattern(pattern, furtherFilters, $scope.searchOptions.filterRequest.projectContextId, $scope.searchOptions.filterRequest.pinningContext);
				},
				onPageBackward: function () {
					// startSearch(this.pattern);
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
				onPageLast: function() {
					cloudDesktopSidebarService.filterPageLast();
					cloudDesktopSidebarService.filterStartSearch();
				},
				onKeyUp: function(){
					cloudDesktopSidebarService.updateNavbarRefreshTooltip($scope.searchOptions.filterRequest.pattern);
				}
			};
			// show title like in enhanced and searchform
			$scope.option = {
				title: $translate.instant('cloud.desktop.searchGoogle.maintitle'),
				mainMenuDeclaration: {
					disabled: true
				}
			};

			$scope.optionSearch = {
				title: $translate.instant('cloud.desktop.sdSearchOptionLabel'),
				mainMenuDeclaration: {
					disabled: true
				}
			};

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
					cloudDesktopSidebarService.updateNavbarRefreshTooltip(elem.val());
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

			function reduceAutoFilter(filter) {
				var includedProperties = ['furtherFilters', 'includeDateSearch', 'includeNonActiveItems', 'includeResultIds', 'orderBy', 'pageNumber', 'pageSize', 'pattern', 'restoreEntities', 'useCurrentClient', 'withExecutionHints'];
				return _.pickBy(filter, function (v, k) {
					return _.includes(includedProperties, k);
				});
			}

			function saveAutofilterDefinition(filterRequest) {
				var reducedFilter = reduceAutoFilter(_.cloneDeep(filterRequest));
				var params = cloudDesktopSidebarService.getAutoFilter('google', true);
				var autoFilterDef = {
					filter: reducedFilter,
					enhancedFilter: undefined,
					settings: {
						searchType: cloudDesktopSidebarService.currentSearchType,
						settingsActive: cloudDesktopSidebarService.settingsActive,
						parameters: params
					}
				};
				cloudDesktopSidebarAutofilterService.saveAutofilterDefinition(filterRequest.moduleName, 'u', autoFilterDef, 'sidebarSearch');
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

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
angular.module('cloud.desktop').controller('cloudDesktopSearchGoogleController',
	['$scope', 'cloudDesktopSidebarService', 'platformTranslateService', '$translate', '$timeout', 'platformDialogService', '_', 'basicsCompanyLoginContextService',
		function ($scope, cloudDesktopSidebarService, platformTranslateService, $translate, $timeout, platformDialogService, _, basicsCompanyLoginContextService) {
			'use strict';
			$scope.lodash = _;

			function initScope() {
				var customOptions = cloudDesktopSidebarService.filterRequest.customOptionChk;

				$scope.searchOptions = {
					filterInfo: cloudDesktopSidebarService.filterInfo,
					filterRequest: cloudDesktopSidebarService.filterRequest,
					useCurrentClientChk: {
						ctrlId: 'useCurrentClientId',
						labelText: $translate.instant('cloud.desktop.sdGoogleBelongtoBPChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleBelongtoBPChk'
					},
					useCurrentProfitCenterChk: {
						ctrlId: 'useCurrentProfitCenterId',
						labelText: $translate.instant('cloud.desktop.sdGoogleBelongToProfitCenterChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleBelongToProfitCenterChk',
						readonly: basicsCompanyLoginContextService.isVisibilityRestrictedToProfitCenter()
					},
					includeNonActiveItemsChk: {
						ctrlId: 'includeNonActiveItemsId',
						labelText: $translate.instant('cloud.desktop.sdGoogleInactiveChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleInactiveChk'
					},
					includeReferenceLineItemsChk: {
						ctrlId: 'includeReferenceLineItemsId',
						labelText: $translate.instant('cloud.desktop.sdGoogleIncludeRefLineItemsChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleIncludeRefLineItemsChk'
					},
					includeDateSearchChk: {
						ctrlId: 'includeDateSearchId',
						labelText: $translate.instant('cloud.desktop.sdGoogleDateSearchChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleDateSearchChk'
					},
					includeRadiusSearchChk: {
						ctrlId: 'includeRadiusSearchId',
						labelText: $translate.instant('cloud.desktop.sdGoogleRadiusSearchChk'),
						labelText$tr$: 'cloud.desktop.sdGoogleRadiusSearchChk'
					},
					showRecordsInfo: true,
					dateParameters: {},
					radiusParameters: {},

					onClearSearch: function () {
						cloudDesktopSidebarService.filterResetPattern();
					},
					onStartSearch: function () {
						// console.log('search button pressed', this.pattern);
						cloudDesktopSidebarService.filterRequest.pattern = $('#GoogleSearchInput').val();
						cloudDesktopSidebarService.evaluateCustomOptionDataOptions(cloudDesktopSidebarService.filterRequest);

						filterStartSearch(true);
					},
					onPageBackward: function () {
						// startSearch(this.pattern);
						cloudDesktopSidebarService.filterPageBackward();
						filterStartSearch();
					},
					onPageForward: function () {
						cloudDesktopSidebarService.filterPageForward();
						filterStartSearch();
					},
					onClearProjectContext: function () {
						cloudDesktopSidebarService.clearProjectContext();
					},
					onPageFirst: function () {
						cloudDesktopSidebarService.filterPageFirst();
						filterStartSearch();
					},
					onPageLast: function () {
						cloudDesktopSidebarService.filterPageLast();
						filterStartSearch();
					},
					onKeyUp: function(){
						cloudDesktopSidebarService.updateNavbarRefreshTooltip($scope.searchOptions.filterRequest.pattern);
					}
				};
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
				// reset so ngIf will trigger when set in $timeout
				$scope.searchOptions.customOptionChk = null;
				$timeout(function () {
					$scope.searchOptions.customOptionChk = customOptions;
				});
			}

			// loads or updates translated strings
			var loadTranslations = function () {
				platformTranslateService.translateObject($scope.searchOptions, ['labelText', 'noSearchResult']);
			};

			function filterStartSearch(resetPageNumber) {
				cloudDesktopSidebarService.filterStartSearch(resetPageNumber, true);
			}

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
				initScope();
				if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().search)) {
					setFocusToSearchInput();
				}
			}

			initScope();
			// register translation changed event
			platformTranslateService.translationChanged.register(loadTranslations);

			// register translation changed event
			cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);

			setFocusToSearchInput();

			/*
				for testing. will be removed later
			 */
			$scope.showSendRfqDialog = function () {
				var modalOptions =
					{
						headerText$tr$: 'basics.workflow.sendrfqdialog.header',
						bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-send-rfq-dialog.html',
						showOkButton: true,
						showCancelButton: true,
						height: '90%',
						minWidth: '90%'
					};

				platformDialogService.showDialog(modalOptions);
			};

			// un-register on destroy
			$scope.$on('$destroy', function () {
				platformTranslateService.translationChanged.unregister(loadTranslations);
				cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
				$scope.searchOptions.customOptionChk = null;
			});
		}]);

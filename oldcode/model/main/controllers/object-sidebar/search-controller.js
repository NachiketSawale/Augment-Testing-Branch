/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	/**
 @ngdoc controller
	 * @name cloudSettingsDialogController
	 * @function
	 *
	 * @description
	 * Controller for the Document Properties Structure Details view.
	 */
	angular.module('model.main').controller('modelMainObjectSidebarSearchController',
		['$scope', 'platformTranslateService', 'modelMainObjectSidebarService', 'cloudDesktopSidebarService',
			'modelViewerModelSelectionService', 'modelViewerHoopsSlaveService',
			function ($scope, platformTranslateService, modelMainObjectSidebarService, cloudDesktopSidebarService,
			          modelSelectionService, modelViewerHoopsSlaveService) { // jshint ignore:line

				function canSearchInModel() {
					const selModel = modelSelectionService.getSelectedModel();
					return selModel && !selModel.info.isPreview;
				}

				$scope.isPinnedModelSelected = modelSelectionService.getItemSource() === 'pinnedModel';
				$scope.searchOptions = {
					translated: false,
					title$tr$: 'model.main.objectSidebar.searchTitle',
					toolBarDefs: null,
					// searchType: 'google',
					searchGoogleUrl: globals.appBaseUrl + 'model.main/templates/object-sidebar/sidebar-search-google.html',
					searchEnhancedUrl: globals.appBaseUrl + 'model.main/templates/object-sidebar/sidebar-search-enhanced.html',
					searchSettingsUrl: globals.appBaseUrl + 'model.main/templates/object-sidebar/sidebar-search-settings.html',
					enhancedSearchAvailable: function () {
						return true;
					},
					canSearchInModel: canSearchInModel
				};
				/* define further properties */
				Object.defineProperties($scope.searchOptions, {
					'searchType': {
						get: function () {
							return modelMainObjectSidebarService.currentSearchType;
						},
						set: function (value) {
							modelMainObjectSidebarService.currentSearchType = value;
						}, enumerable: true
					}
				});

				$scope.searchOptions.searchType = 'google';
				$scope.searchOptions.settingsActive = false;

				var tools = [{
					type: 'sublist',
					list: {
						cssClass: 'radio-group',
						showTitles: true,
						items: [{
							id: 'gSearch',
							caption$tr$: 'cloud.desktop.sdMainSearchBtnGoogle',
							type: 'radio',
							value: 'google',
							cssClass: 'tlb-icons ico-sdb-search1',
							fn: function () {
								$scope.searchOptions.searchType = this.value;
							},
							disabled: () => !canSearchInModel()
						}, {
							id: 'eSearch',
							caption$tr$: 'cloud.desktop.sdMainSearchBtnEnhanced',
							type: 'radio',
							value: 'enhanced',
							cssClass: 'tlb-icons ico-sdb-search2',
							fn: function () {
								$scope.searchOptions.searchType = this.value;
							},
							disabled: () => !canSearchInModel()
						}]
					}
				}, { // TODO: delete?
					id: 'eSettings',
					caption$tr$: 'cloud.desktop.sdMainSearchBtnSettings',
					type: 'check',
					buttonTemplate: '<button type="button" ##disabled## class="##cssClass##" title="##title##" ng-click="searchSettingsFn()" ##currentButtonId## ##attr## ##model##>##title##</button>',
					iconClass: 'tlb-icons ico-settings searchSettings',
					//fn: function () {
					//	//console.log('checked',$scope.searchOptions.settingsActive);
					//	$scope.searchOptions.settingsActive = !$scope.searchOptions.settingsActive;
					//},
					value: false,
					disabled: () => !canSearchInModel()
				}];

				if (modelViewerHoopsSlaveService.isSlaveEnabled()) {
					tools.push({
						id: 'extWindow',
						caption$tr$: 'model.viewer.filterResultsViewerWindow',
						type: 'item',
						iconClass: 'tlb-icons ico-view-extwindow',
						fn: function () {
							modelViewerHoopsSlaveService.showViewerWindow('objectSearchSidebar');
						}
					});
				}

				$scope.searchOptions.toolBarDefs = {
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: tools
				};

				/*
					Settings-Button it doesnt work at the first click. Ng-click has not reacted.
				 */
				$scope.searchSettingsFn = function () {
					$scope.searchOptions.settingsActive = !$scope.searchOptions.settingsActive;
				};

				// loads or updates translated strings
				var loadTranslations = function () {
					platformTranslateService.translateObject($scope.searchOptions, ['title', 'caption']);
					$scope.translate = platformTranslateService.instant({
						'cloud.desktop': ['sdGoogleSearchFilter', 'sdSettingsPageInfoLabel', 'sdSettingSupportLabel', 'sdSettingsHeader']
					});
					$scope.searchOptions.translated = true;
				};


				/**
				 *
				 * @param options
				 */
				function onModuleChanged(/*options*/) { // jshint ignore:line
					$scope.searchOptions.searchType = 'google'; // default search option is google search
					//$timeout(function(){
					//	$scope.$digest();
					//},0);
				}


				// register a module - translation table will be reloaded if module isn't available yet
				if (!platformTranslateService.registerModule('cloud.desktop')) {
					// if translation is already available, call loadTranslation directly
					loadTranslations();
				}

				// register translation changed event
				platformTranslateService.translationChanged.register(loadTranslations);

				cloudDesktopSidebarService.onModuleChanged.register(onModuleChanged);

				// un-register on destroy
				$scope.$on('$destroy', function () {
					platformTranslateService.translationChanged.unregister(loadTranslations);
					cloudDesktopSidebarService.onModuleChanged.unregister(onModuleChanged);
				});
			}
		]);
})(angular);

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
angular.module('cloud.desktop').controller('cloudDesktopSearchController',
	['$scope', 'platformTranslateService', 'cloudDesktopSidebarService', '$timeout', 'platformPermissionService',
		function ($scope, platformTranslateService, cloudDesktopSidebarService, $timeout, platformPermissionService) { // jshint ignore:line
			'use strict';

			var accessRightDescriptors = ['b8f132391686474884e2f0b6eda15c87','7a0ecac2425646679719a7d28cb67684'];
			platformTranslateService.registerCustomTranslation('searchForms');

			var enhancedSearchPermssionUuid = 'b8f132391686474884e2f0b6eda15c87';
			var StandardSearchPermssionUuid = '7a0ecac2425646679719a7d28cb67684';

			$scope.searchOptions = {
				translated: false,
				title$tr$: 'cloud.desktop.sdMainSearchTitle',
				toolBarDefs: null,
				// searchType: 'google',
				searchGoogleUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-google.html',
				searchEnhancedUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-enhanced.html',
				searchFormUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-form.html',
				searchEnhancedBulkUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-enhanced-bulk.html',
				bulkSearchFormUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-bulk-search-form.html',
				searchSettingsUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/sidebar-search-settings.html',
				enhancedSearchAvailable: function () {
					if (!platformPermissionService.hasExecute(enhancedSearchPermssionUuid)) {
						return false;
					}

					if (cloudDesktopSidebarService.filterRequest.enhancedSearchEnabled &&
						cloudDesktopSidebarService.filterRequest.enhancedSearchVersion === '1.0') {
						return ($scope.searchOptions.searchType === 'enhanced');
					} else {

						// if enhanced selected from previous state, switch to google
						if ($scope.searchOptions.searchType === 'enhanced') {
							$scope.searchOptions.searchType = 'google'; // switch back to google search
						}

						return false;
					}
				},
				bulkSearchAvailable: function () {
					if (!platformPermissionService.hasExecute(enhancedSearchPermssionUuid)) {
						return false;
					}

					if (cloudDesktopSidebarService.filterRequest.enhancedSearchEnabled &&
						cloudDesktopSidebarService.filterRequest.enhancedSearchVersion === '2.0') {
						return ($scope.searchOptions.searchType === 'bulk');
					} else {

						// if enhanced selected from previous state, switch to google
						if ($scope.searchOptions.searchType === 'bulk') {
							$scope.searchOptions.searchType = 'google'; // switch back to google search
						}

						return false;
					}
				},
				cssClass: {
					hintsChk: false
				}
			};
			/* define further properties */
			Object.defineProperties($scope.searchOptions, {
				'searchType': {
					get: function () {
						return cloudDesktopSidebarService.currentSearchType;
					},
					set: function (value) {
						cloudDesktopSidebarService.currentSearchType = value;
					}, enumerable: true
				}
			});
			Object.defineProperties($scope.searchOptions, {
				'settingsActive': {
					get: function () {
						return cloudDesktopSidebarService.settingsActive;
					},
					set: function (value) {
						cloudDesktopSidebarService.settingsActive = value;
					}, enumerable: true
				}
			});

			$scope.searchOptions.searchType = $scope.searchOptions.searchType || 'google';
			$scope.searchOptions.settingsActive = $scope.searchOptions.settingsActive || false;

			var toolbarItems = [];

			platformPermissionService.loadPermissions(accessRightDescriptors).then(function () {
				if (platformPermissionService.hasExecute(StandardSearchPermssionUuid)) {
				// push Standard search
				toolbarItems.push({
						id: 'gSearch',
						caption$tr$: 'cloud.desktop.sdMainSearchBtnGoogle',
						type: 'radio',
						value: 'google',
						cssClass: 'tlb-icons ico-sdb-search1',
						fn: function () {
							$scope.searchOptions.searchType = this.value;
						}
					});
				}
				// push search forms
				toolbarItems.push({
					id: 'fSearch',
					caption$tr$: 'cloud.desktop.searchform.maintitle',
					type: 'radio',
					value: 'form',
					cssClass: 'tlb-icons ico-sdb-search3',
					disabled: function () {
						var enabled = cloudDesktopSidebarService.filterRequest.enhancedSearchEnabled;
						this.hideItem = enabled === null || cloudDesktopSidebarService.filterRequest.enhancedSearchVersion !== '1.0';
						return !enabled;
					},
					fn: function () {
						$scope.searchOptions.searchType = this.value;
					}
				});
				// push bulk search forms
				toolbarItems.push({
					id: 'bSearch',
					caption$tr$: 'cloud.desktop.searchform.maintitle',
					type: 'radio',
					value: 'bulkForm',
					cssClass: 'tlb-icons ico-sdb-search3',
					disabled: function () {
						var enabled = cloudDesktopSidebarService.filterRequest.enhancedSearchEnabled;
						this.hideItem = enabled === null || cloudDesktopSidebarService.filterRequest.enhancedSearchVersion !== '2.0';
						return !enabled;
					},
					fn: function () {
						$scope.searchOptions.searchType = this.value;
					}
				});
				if (platformPermissionService.hasExecute('b8f132391686474884e2f0b6eda15c87')) {
					// push enhanced search
					toolbarItems.push({
						id: 'eSearch',
						caption$tr$: 'cloud.desktop.sdMainSearchBtnEnhanced',
						type: 'radio',
						value: 'enhanced',
						cssClass: 'tlb-icons ico-sdb-search2',
						disabled: function () {
							var enabled = cloudDesktopSidebarService.filterRequest.enhancedSearchEnabled;
							this.hideItem = enabled === null || cloudDesktopSidebarService.filterRequest.enhancedSearchVersion !== '1.0';
							return !enabled;
						},
						fn: function () {
							$scope.searchOptions.searchType = this.value;
						}
					});

					// push bulk enhanced search
					toolbarItems.push({
						id: 'bSearch',
						caption$tr$: 'cloud.desktop.sdMainSearchBtnEnhanced',
						type: 'radio',
						value: 'bulk',
						cssClass: 'tlb-icons ico-sdb-search2',
						disabled: function () {
							var enabled = cloudDesktopSidebarService.filterRequest.enhancedSearchEnabled;
							this.hideItem = enabled === null || cloudDesktopSidebarService.filterRequest.enhancedSearchVersion !== '2.0';
							return !enabled;
						},
						fn: function () {
							$scope.searchOptions.searchType = this.value;
						}
					});
				}
				
            
				var updateSearchFormClass = function () {
					toolbarItems.forEach(item => {
						// Add "active" class to the selected search type
						if (item.value === $scope.searchOptions.searchType) {
							item.cssClass = item.cssClass.includes('active') ? item.cssClass : item.cssClass + ' active';
						} else {
							// Remove "active" class from non-selected items
							item.cssClass = item.cssClass.replace(' active', '').trim();
						}
					});
				};

				const isGooglePresent = toolbarItems.some(item => item.value === 'google');
				
				toolbarItems.forEach(item => {
					if (item.id === 'fSearch' || item.id === 'bSearch') {
						if (!isGooglePresent) {
							$scope.searchOptions.searchType = 'bulkForm';
							updateSearchFormClass();
							$scope.searchOptions.activeValue ='bulkForm';
						}
					}
				});
				
				// Call updateSearchFormClass whenever the searchType changes
				$scope.$watch('searchOptions.searchType', function () {
					updateSearchFormClass();
				});
				
			
				// Update toolbar items in the $scope
				$scope.searchOptions.toolBarDefs.items[0].list.items = toolbarItems;
				// Update the toolbar
				$scope.searchOptions.toolBarDefs.refreshVersion++;
			});


			$scope.searchOptions.toolBarDefs = {
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				// showSelected: true,
				items: [
					{
						type: 'sublist',
						list: {
							cssClass: 'radio-group',
							// activeValue: see Object.defineProperty (...) below
							showTitles: true,
							items: toolbarItems
						}
					},
					{
						id: 'eSettings',
						caption$tr$: 'cloud.desktop.sdMainSearchBtnSettings',
						type: 'check',
						buttonTemplate: '<button type="button" ##disabled## class="##cssClass##" title="##title##" data-ng-click="searchSettingsFn()" ##currentButtonId## ##attr## ##model##>##title##</button>',
						iconClass: 'tlb-icons ico-settings searchSettings',
						// fn: function () {
						//	//console.log('checked',$scope.searchOptions.settingsActive);
						//	$scope.searchOptions.settingsActive = !$scope.searchOptions.settingsActive;
						// },
						value: $scope.searchOptions.settingsActive
					}

				]
			};

			/*
				Settings-Button it doesnt work at the first click. Ng-click has not reacted.
			 */
			$scope.searchSettingsFn = function () {
				$scope.searchOptions.settingsActive = !$scope.searchOptions.settingsActive;
			};

			/* define further properties */
			Object.defineProperties($scope.searchOptions.toolBarDefs.items[0].list, {
				'activeValue': {
					get: function () {
						return $scope.searchOptions.searchType;
					},
					set: function (p) {
						$scope.searchOptions.searchType = p;
					}, enumerable: true
				}
			});
			Object.defineProperties($scope.searchOptions.toolBarDefs.items[1], {
				'value': {
					get: function () {
						return $scope.searchOptions.settingsActive;
					},
					set: function (v) {
						$scope.searchOptions.settingsActive = v;
					}, enumerable: true
				}
			});
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
			function onModuleChanged(options) { // jshint ignore:line
				$scope.searchOptions.searchType = 'google'; // default search option is google search
				// $timeout(function(){
				//	$scope.$digest();
				// },0);
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

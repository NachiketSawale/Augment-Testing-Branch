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
angular.module('cloud.desktop').controller('cloudDesktopFavoritesController',
	['globals', '_', '$rootScope', '$scope', 'platformTranslateService', '$state', '$translate', 'cloudDesktopSidebarService', 'cloudDesktopSidebarFavoritesService', 'platformModalService', 'basicsLookupdataLookupViewService',
		'$injector',
		function (globals, _, $rootScope, $scope, platformTranslateService, $state, $translate, cloudDesktopSidebarService, sidebarFavoritesService, platformModalService, lookupViewService,
			$injector) {// jshint ignore:line
			'use strict';

			var sidebarIsOpen = false;
			if (cloudDesktopSidebarService.checkedInLocalStorage(cloudDesktopSidebarService.getSidebarIds().favorites)) {
				sidebarIsOpen = true;
			}

			$scope.favOpts = {
				refreshPending: false,
				projectModel: null,
				settings: false,
				settingsUrl: '',
				watchListUrl: '',
				onRefresh: onRefresh,
				onDeleteClick: onProjectDeleteClick,
				onAddProject: onAddProject,
				onProjectClick: onProjectClick,
				onExpanded: onExpanded,
				onFavTypeClick: onFavTypeClick,
				onLeaveItemClick: onLeaveItemClick,
				processSortable: processSortable,
				addSortable: addSortable,
				disableSortable: disableSortable,
				isSortable: isSortable
			};

			$scope.version = 0;
			$scope.favData = [];
			$scope.btnCheckValue = false;

			$scope.tooltipSortable = {
				title: 'Infos zur Favoritensortierung',
				caption: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam',
				hasDefaultWidth: true,
				width: 400
			};

			function processSortable() {
				if (!$scope.btnCheckValue) {
					$scope.isAddProjectDisabled = true;
					$scope.isRefreshDisabled = true;
					$scope.favOpts.addSortable();
				} else {
					$scope.isAddProjectDisabled = false;
					$scope.isRefreshDisabled = false;
					$scope.favOpts.disableSortable();
				}
			}

			/**
			 * @jsdoc function
			 * @name showInputDialog
			 * @methodOf platform.platformModalService
			 * @description An standard dialog to get any input from the user.
			 * @returns {result} Returns the result of the dialog.
			 */
			function showAddProjectDialog() {
				var projectlookupCfg = {
					lookupType: 'project',
					valueMember: 'Id', displayMember: 'ProjectNo',
					initialSearchValue: '',  // setting the initial search edit box
					version: 3,
					eagerSearch: false,  // auto search when open dialog.
					columns: [{
						id: 'ProjectNo', field: 'ProjectNo',
						name: $translate.instant('cloud.common.entityProjectNo'),
						width: 200
					},
					{
						id: 'ProjectName', field: 'ProjectName', width: 300,
						name: $translate.instant('cloud.common.entityProjectName')
					}],
					title: {
						name: $translate.instant('cloud.desktop.favorites.addProjectDlgTitle')
					},
					gridOptions: {
						multiSelect: true // control multiple/single selection
					}
				};

				lookupViewService.showDialog(projectlookupCfg).then(function (result) {
					// handle result here.
					// console.log(result);
					if (result && result.isOk) {
						// console.log('Selected Project was ', dlgScope.AddProjectDialogParams);
						if (result.data && result.data.length > 0) {
							_.forEach(result.data, function (item) {
								sidebarFavoritesService.addProjectToFavorites(item.Id, item.ProjectNo, true);
							});

							sidebarFavoritesService.saveFavoritesSetting().then(function () {
								onRefresh();
							});
						}
					}
				});

				// var dlgScope = $scope.$new();
				// var customModalOptions = {
				// //backdrop: 'static',
				// define template
				// templateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/favoritesprojectselectdialog.html',
				// showCancelButton: true,
				// showOkButton: true,
				// dialogTitle: $translate.instant('cloud.desktop.favorites.addProjectDlgTitle'),
				// dialogHint: $translate.instant('cloud.desktop.favorites.addProjectDlgHint'),
				// scope: dlgScope // pass parameters to dialog via current scope
				// };
				// dlgScope.AddProjectDialogParams = {selectedProject: null};
				// return platformModalService.showDialog(customModalOptions).then(function (result) {
				// if (result.ok) {
				//  console.log('Selected Project was ', dlgScope.AddProjectDialogParams);
				//  sidebarFavoritesService.addProjectToFavorites(dlgScope.AddProjectDialogParams.selectedProject, 'n/a', null);
				//  sidebarFavoritesService.saveFavoritesSetting().then(function () {
				//   onRefresh();
				//  });
				// }
				// dlgScope.$destroy();
				// });
			}

			function addDragHandler() {
				$scope.favData.favDropHandler = {
					accept: function (sourceItemHandleScope) {
						let elemPosition = sourceItemHandleScope.itemScope.element[0].getBoundingClientRect();
						let htmlContent = $('.content-inner');
						let topPosition = $('#sidebar-favorites .content .toolbar')[0].getBoundingClientRect().bottom;
						let elemHeight = elemPosition.height; // Depending on the element-height, the scroller has to be scrolled accordingly

						if(elemPosition.bottom >= (window.innerHeight - 50)) {
							htmlContent.scrollTop(elemPosition.bottom + elemHeight + 100);
						}
						else if(elemPosition.top <= topPosition) {
							htmlContent.scrollTop(elemPosition.top - elemHeight - 100);
						}

						return true;
					},
					orderChanged: function () {
						processSortItems();
						sidebarFavoritesService.saveFavoritesSetting();
					}
				};
			}

			function setToolbarButtonEditMode(_boolean) {
				$scope.btnCheckValue = _boolean;
				$scope.isAddProjectDisabled = _boolean;
				$scope.isRefreshDisabled = _boolean;
			}

			function onRefresh() {
				if (!sidebarIsOpen) {
					return;
				}

				// console.log('Project Favorites Refresh pressed');
				$scope.favOpts.refreshPending = true;

				sidebarFavoritesService.readFavorites().then(function (data) {
					$scope.favOpts.refreshPending = false;
					if(data) {
						data.sortable = ($scope.favData && $scope.favData.sortable) ? $scope.favData.sortable : false;
					} else {
						setToolbarButtonEditMode(false);
					}

					$scope.favData = data; // .projectInfo;

					if($scope.favData) {
						addDragHandler();
					}
				}, function () {
					$scope.favOpts.refreshPending = false;
				});
			}

			function processSortItems() {
				for(let i=0; i < $scope.favData.sortedFavProjects.length; i++) {
					let item = $scope.favData.favoritesSetting[$scope.favData.sortedFavProjects[i].projectId] || {};
					let _projectName = sidebarFavoritesService.IsJsonObj(item.projectName) ? JSON.parse(item.projectName).projectName : item.projectName;
					item.projectName = JSON.stringify({projectName: _projectName, sort: i});
				}
			}

			/**     *       */
			function onLeaveItemClick(item, projectId) {
				// console.log('onLeaveItemClick', item);
				// var favTypeInfo = sidebarFavoritesService.favtypeInfo[item.favType];
				doNavigate(item.favType, item.id, projectId);
			}

			/**     *       */
			function onProjectClick(projectId) {
				if(isSortable()) {
					// Edit Mode -> Removing the Click Event
					return;
				}

				// var item = $scope.favData.projectInfo[projectId];
				// console.log('onProjectClick', item);
				doNavigate(0, projectId, projectId);
			}

			/**
			 *
			 * @param type
			 * @param projectId
			 * @param favType
			 * @returns {*}
			 */
			// eslint-disable-next-line no-unused-vars
			function onExpanded(type, projectId, favType) { // jshint ignore:line
				// var a = getSettings(projectId, favType);
				// console.log('onExpandToggleClick', projectId, favType, a);
				$scope.favOpts.refreshPending = true;
				return sidebarFavoritesService.saveFavoritesSetting().then(function () {
					$scope.favOpts.refreshPending = false;
					// console.log('favorite setting saved');
				});
			}

			/**     *       */
			function onFavTypeClick(projectId, favType) {
				// console.log('onFavTypeClick', item);
				// var item = $scope.favData.projectInfo[projectId].itemToFavType[favType];
				doNavigate(favType, undefined);
			}

			/**
			 *
			 * @param favType
			 * @param objectId
			 * @param projectId
			 */
			function doNavigate(favType, objectId, projectId) {
				if (!_.isUndefined(favType)) {
					var favTypeInfo = sidebarFavoritesService.favtypeInfo[favType];
					if (favTypeInfo.moduleName) {
						var navOptions = {
							moduleName: favTypeInfo.moduleName,
							objectId: objectId,
							furtherFilters: favTypeInfo.furtherFilters,
							naviServiceConnector: favTypeInfo.naviServiceConnector
						};
						navOptions.projectContextId = (favTypeInfo.projectContext) ? projectId : undefined;
						onNavigateToObject(navOptions);
					} else {
						platformModalService.showErrorBox('There is no module defined...', 'Navigation Error');
					}
				}
			}

			/**     *       */
			function onProjectDeleteClick(projectId) {
				var item = $scope.favData.projectInfo[projectId];
				platformModalService.showYesNoDialog($translate.instant('cloud.desktop.favorites.delProjectConfirm', {p1: item.projectDescription}), $translate.instant('cloud.desktop.favorites.delProjectTitle'))
					.then(function (result) {
						if (result.yes) {
							$scope.favOpts.refreshPending = true;
							sidebarFavoritesService.removeProjectToFavorites(projectId);
							sidebarFavoritesService.saveFavoritesSetting().then(function () {
								onRefresh();
							});
						}
					});
			}

			/**     *       */
			function onAddProject() {
				// console.log('Project Favorites Add Project pressed');
				showAddProjectDialog();
			}

			function addSortable() {
				if($scope.favData) {
					$scope.favData.sortable = true;
					$scope.version++;
				}
			}

			function disableSortable() {
				if($scope.favData) {
					$scope.favData.sortable = false;
					$scope.version++;
					sidebarFavoritesService.saveFavoritesSetting();
				}
			}

			function isSortable() {
				return $scope.favData.sortable;
			}

			var lastCallingToken = null;

			/**
			 * @function onNavigateToObject
			 * @param lo {moduleName: {string}, objectId: {int}}
			 */
			function onNavigateToObject(lo) {
				var url = globals.defaultState + '.' + lo.moduleName.replace('.', '');
				if (lo.naviServiceConnector) {
					$rootScope.$emit('navigateTo', lo.moduleName);
					var currentCallingToken = {};
					lastCallingToken = currentCallingToken;
					lo.naviServiceConnector.retrieveItem(lo.objectId, lo.projectContextId).then(function (item) {
						if (lastCallingToken !== currentCallingToken) {
							return;
						} else {
							lastCallingToken = null;
						}

						var naviService = $injector.get('platformModuleNavigationService');
						var navigator = naviService.getNavigator(lo.moduleName);
						naviService.navigate(navigator, item);
					});
					return;
				}

				var furtherFilters;
				if (lo.furtherFilters) { // map key into Value of furtherFilters
					lo.furtherFilters.Value = lo.objectId;
					furtherFilters = [lo.furtherFilters];
				}

				if (_.startsWith($state.current.name, url)) {
					cloudDesktopSidebarService.filterSearchFromPKeys([lo.objectId], furtherFilters, lo.projectContextId);
				} else {
					try {
						// first setup StartupFilter since checkStartupFilter() will be called in main controller
						cloudDesktopSidebarService.setStartupFilter({filter: [lo.objectId], furtherFilter: furtherFilters, projectContextId: lo.projectContextId});
						$state.go(url).then(function () {
							$rootScope.$emit('navigateTo', lo.moduleName);
							// platformContextService.setApplicationValue('cloud.desktop.StartupParameter', {filter: [lo.proxy.ObjectId]});
						});
					} catch (ex) {
						cloudDesktopSidebarService.removeStartupFilter();
						throw new Error('Navigate to module ' + url + ' failed');
					}
				}
			}

			/**
			 * trigger in case of Sidebar Search is opened
			 * @param cmdId
			 */
			function onOpenSidebar(cmdId) {
				if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().favorites)) {
					sidebarIsOpen = true;
					if (!$scope.initialDataLoaded) {
						onRefresh();
						$scope.initialDataLoaded = true;
					}

				}
			}

			function onClosingSidebar(cmdId) {
				if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().favorites)) {
					sidebarIsOpen = false;
					// resetLastObjects();
				}
			}

			// loads or updates translated strings
			function loadTranslations() {
				// load translation ids and convert result to object
				// $scope.modalOptions.headerText = $translate.instant('cloud.desktop.settingsFormTitle');
				// platformTranslateService.translateFormConfig(cloudSettingsDialogFormConfig);
			}

			// register a module - translation table will be reloaded if module isn't available yet
			if (!platformTranslateService.registerModule('cloud.desktop')) {
				// if translation is already available, call loadTranslation directly
				loadTranslations();
				onRefresh();
			}

			// register translation changed event
			cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);
			cloudDesktopSidebarService.onClosingSidebar.register(onClosingSidebar);

			// register translation changed event
			// platformTranslateService.translationChanged.register(loadTranslations);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
				cloudDesktopSidebarService.onClosingSidebar.unregister(onClosingSidebar);
				// platformTranslateService.translationChanged.unregister(loadTranslations);
			});

		}]);

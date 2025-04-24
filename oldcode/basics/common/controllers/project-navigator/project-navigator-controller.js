/**
 @ngdoc controller
 * @name basicsCommonProjectNavigatorController
 * @function
 *
 * @description
 * Controller for the Project Navigator.
 */
angular.module('basics.common').controller('basicsCommonProjectNavigatorController',
	['globals', '_', '$rootScope', '$scope', 'platformTranslateService', '$state', '$translate', '$http', 'cloudDesktopSidebarService',
		'basicsCommonProjectNavigatorService','platformDialogService', 'basicsLookupdataLookupViewService',
		'$injector', 'basicsCommonProjectNavigatorConfig', 'basicsLookupdataPopupService', 'cloudDesktopPinningContextService',
		'$templateCache', 'projectMainPinnableEntityService',
		function (globals, _, $rootScope, $scope, platformTranslateService, $state, $translate, $http, cloudDesktopSidebarService,
			basicsCommonProjectNavigatorService, platformDialogService, lookupViewService, $injector,
			basicsCommonProjectNavigatorConfig, basicsLookupdataPopupService, cloudDesktopPinningContextService, $templateCache, projectMainPinnableEntityService) {

			'use strict';

			let sidebarIsOpen = false;
			let projectListIsOpen = false;
			let hasProject = false;
			let instance = null;

			const naviService = $injector.get('platformModuleNavigationService');

			$scope.naviProject = null;

			$scope.naviOpts = {
				refreshPending: false,
				loadingMessage: "",
				onRefresh: onRefresh,
				onAddProject: onAddProject,
				onProjectClick: onProjectClick,
				onLeaveItemClick: onLeaveItemClick,
				onProjectListClick: onProjectListClick,
				onProjectListItemClick: onProjectListItemClick,
				onToggleFavorite: onToggleFavorite,
				onGetAllFilterOptions: onGetAllFilterOptions,
				onFilterOptionClick: onFilterOptionClick,
				onFilterBadgeClick: onFilterBadgeClick,
				onModuleExpanded: onModuleExpanded
			};

			$scope.naviProjectList = {
				favourite: [],
				recent: []
			};
			let naviConfig = _.cloneDeep(basicsCommonProjectNavigatorConfig);

			function initialize(){
				if (cloudDesktopSidebarService.checkedInLocalStorage(cloudDesktopSidebarService.getSidebarIds().projectNavi)) {
					sidebarIsOpen = true;
				}

				// Get project list when controller initialize
				basicsCommonProjectNavigatorService.getProjectList().then( function(projectList){

					updateProjectList(projectList);
					// register a module - translation table will be reloaded if module isn't available yet
					if (!platformTranslateService.registerModule('cloud.desktop')) {
						onRefresh();
					}
				});

			}

			function updateProjectList(dataToUpdate){

				const processRecent = (array2process) => {
					if(array2process.length > 15){
						// Projects not in Favourites and not included in the latest 15 items will be deleted
						const settingIdToDelete = array2process.filter((prj, index) => index >= 15 && prj.IsFavourite === false).map(prj => prj.Id);
						if(settingIdToDelete.length > 0){
							basicsCommonProjectNavigatorService.deleteProjectNavigatorSetting(settingIdToDelete);
						}
					}
					return array2process.slice(0, 15);
				};

				if(_.isArray(dataToUpdate)){
					dataToUpdate = dataToUpdate.sort((a, b) => a.Sort - b.Sort);
					$scope.naviProjectList.favourite = dataToUpdate.filter(data => data.IsFavourite);
					$scope.naviProjectList.recent = processRecent(dataToUpdate); //Only the 15 latest project will be save
				} else {
					const updateArray = (array, shouldAdd) => {
						const idx = array.findIndex(item => item.ProjectFk === dataToUpdate.ProjectFk);
						if(shouldAdd && idx === -1) {
							// if shouldAdd = true and not in the array, add to array
							array.unshift(dataToUpdate);
						}
						else if (idx !== -1) {
							if(shouldAdd){
								// if shouldAdd = true and already in the array, then update IsFavourite
								array[idx].IsFavourite = dataToUpdate.IsFavourite;
							} else {
								// if shouldAdd = false and already in the array, then remove in array
								array.splice(idx, 1);
							}
						}
					};

					// Update the favourite list based on IsFavourite flag
					updateArray($scope.naviProjectList.favourite, dataToUpdate.IsFavourite);

					// Update the recent list, ensuring it only keeps the latest 15 items
					updateArray($scope.naviProjectList.recent, true);
					$scope.naviProjectList.recent = processRecent($scope.naviProjectList.recent);
				}
			}

			function convertProjectFavorite() {
				basicsCommonProjectNavigatorService.getProjectFavoriteCount().then(function (prjCount) {
					if (prjCount > 0) {
						platformDialogService.showYesNoDialog($translate.instant('basics.common.projectNavi.questionConvertProjectFav', {p1: prjCount}),
							$translate.instant('basics.common.projectNavi.convertProjectDlgTitle'))
							.then(function (result) {
								if (result.yes) {
									getProjectNavigatorSettings(true);
								}
							});
					}
				});
			}

			function removeEventActiveCSSClass(event) {
				if(event){
					angular.element(event.target).parents('button').removeClass('active');
				}
			}
			/**
			 * Refresh project navigator base on data in server
			 */
			function onRefresh($event) {
				if (!sidebarIsOpen) {
					return;
				}

				if($event){
					angular.element($event.target).parents('button').addClass('active');
				}

				$scope.naviOpts.refreshPending = true;
				$scope.naviOpts.loadingMessage =  $translate.instant("basics.common.loading");


				const defaultPrj = basicsCommonProjectNavigatorService.getDefaultProject();
				if (defaultPrj) {
					// If naviProject is available, save user setting first
					let savePromise = $scope.naviProject ? basicsCommonProjectNavigatorService.saveProjectNavigatorSetting() : Promise.resolve(); // Create a promise, either save or immediately resolve

					savePromise.then(function() {
						$scope.naviProject = null;
						return basicsCommonProjectNavigatorService.getProjectNavigatorSettingById(defaultPrj.ProjectFk);
					})
						.then(function(data) {
							$scope.naviProject = data;
						})
						.finally(function() {
							$scope.naviOpts.refreshPending = false;
							removeEventActiveCSSClass($event);
						});
				} else {
					$scope.naviOpts.refreshPending = false;
				}
			}

			function getProjectNavigatorSettings(forceConvertPrjFav = false){

				$scope.naviOpts.refreshPending = true;
				$scope.naviOpts.loadingMessage =  $translate.instant("basics.common.loading");
				if(forceConvertPrjFav){
					$scope.naviOpts.loadingMessage =  $translate.instant("basics.common.projectNavi.convertProjectLoading");
				}

				basicsCommonProjectNavigatorService.getProjectList().then(function(data){
					hasProject = data.length > 0;
					updateProjectList(data);
					onRefresh();
					$scope.naviOpts.refreshPending = false;
				}, function () {
					$scope.naviOpts.refreshPending = false;
				})
			}

			function onGetAllFilterOptions(moduleItem){
				return basicsCommonProjectNavigatorService.getFilterOptions(moduleItem);
			}

			function onFilterOptionClick(moduleItem){
				basicsCommonProjectNavigatorService.getFilteredData(moduleItem);
			}

			function onFilterBadgeClick(event, moduleItem, filterKey, filterValue){
				event.preventDefault();
				event.stopPropagation();
				moduleItem = basicsCommonProjectNavigatorService.removeFilterOption(moduleItem, filterKey, filterValue);
				basicsCommonProjectNavigatorService.getFilteredData(moduleItem);
			}

			function onModuleExpanded(moduleItem){
				// Do filter data when module expanded
				if(moduleItem.moduleSetting.expanded){
					onFilterOptionClick(moduleItem);
				}
			}

			function onLeaveItemClick(moduleItem, projectId, itemId, forceNewTab) {
				const moduleName = moduleItem.moduleInfo.moduleName;
				const hideData = moduleItem.moduleInfo.hideData ?? false;
				if(!hideData) {
					if (Array.isArray(itemId)) {
						itemId = moduleItem.moduleData.filter(md => md.dataItem.dataUserSetting.isVisible && itemId.includes(md.dataItem.id)).map(md => md.dataItem.id);
					} else {
						itemId = moduleItem.moduleData.find(md => md.dataItem.dataUserSetting.isVisible && md.dataItem.id === itemId) ? itemId : null;
					}
				}
				doNavigate({ moduleName, projectId, itemId, forceNewTab });
			}

			function onProjectClick(projectId, forceNewTab) {
				doNavigate({ moduleName: 'project.main', projectId, forceNewTab });
			}

			function onProjectListItemClick(projectItem) {
				basicsCommonProjectNavigatorService.setDefaultProject(projectItem.ProjectFk);
				basicsCommonProjectNavigatorService.saveProjectNavigatorSetting().then(function () {
					onRefresh();
				});

				// Close project list after an item is clicked
				if(projectListIsOpen){
					basicsLookupdataPopupService.hidePopup(0);
					projectListIsOpen = !projectListIsOpen;
				}
			}

			function onProjectListClick(evt) {
				if(projectListIsOpen){
					basicsLookupdataPopupService.hidePopup(0);
				} else {
					angular.element(evt.target).parents('button').addClass('active');
					const prjListPopupTemplate = $templateCache.get('project-navigator/submenu-projectlist.html');
					instance = basicsLookupdataPopupService.showPopup({
						scope: $scope,
						multiPopup: false,
						plainMode: true,
						hasDefaultWidth: false,
						focusedElement: angular.element(evt.target),
						template: prjListPopupTemplate
					});

					if (!_.isNil(instance)) {
						instance.closed.then(function () {
							angular.element(evt.target).parents('button').removeClass('active');
						});
					}
				}
				projectListIsOpen = !projectListIsOpen;
			}

			function onToggleFavorite(projectId){
				const updatedPrj = basicsCommonProjectNavigatorService.toggleProjectFromFavourite(projectId).find(
					setting => setting.ProjectFk === projectId);
				if($scope.naviProject.ProjectFk === updatedPrj.ProjectFk){
					$scope.naviProject.IsFavourite = updatedPrj.IsFavourite;
				}
				basicsCommonProjectNavigatorService.saveProjectNavigatorSetting();
				updateProjectList(updatedPrj);
			}

			/**
			 *
			 * @param moduleName
			 * @param projectId
			 * @param forceNewTab
			 * @param objectId
			 */
			function doNavigate({ moduleName, projectId, forceNewTab = false, itemId = null }) {
				if (!_.isUndefined(moduleName)) {
					let moduleInfo = _.find(naviConfig, {moduleName: moduleName});
					if (moduleInfo) {
						let navOptions = {
							moduleName: moduleInfo.moduleName,
							objectId: itemId || projectId || undefined,
							furtherFilters: moduleInfo.furtherFilters,
							naviServiceConnector: moduleInfo.naviServiceConnector,
							forceNewTab: forceNewTab,
						};
						navOptions.projectContextId = (moduleInfo.projectContext) ? projectId : undefined;
						onNavigateToObject(navOptions);
					} else {
						platformDialogService.showErrorBox('There is no module defined...', 'Navigation Error');
					}
				}
			}

			/**     *       */
			function onAddProject() {
				showAddProjectDialog();
			}

			/**
			 * @jsdoc function
			 * @name showInputDialog
			 * @methodOf platform.platformDialogService
			 * @description An standard dialog to get any input from the user.
			 * @returns {result} Returns the result of the dialog.
			 */
			function showAddProjectDialog() {
				let projectlookupCfg = {
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
						name: $translate.instant('basics.common.projectNavi.addProjectDlgTitle')
					},
					gridOptions: {
						multiSelect: true // control multiple/single selection
					}
				};

				lookupViewService.showDialog(projectlookupCfg).then(async function (result) {
					if (result && result.isOk) {
						if (result.data && result.data.length > 0) {
							await basicsCommonProjectNavigatorService.addProjectsToNavigator(result.data.map(data => data.Id));
							basicsCommonProjectNavigatorService.setDefaultProject(result.data[0].Id);

							basicsCommonProjectNavigatorService.saveProjectNavigatorSetting().then(function (settings) {
								updateProjectList(settings);
								const defaultProject = basicsCommonProjectNavigatorService.getDefaultProject();
								if(defaultProject){
									onRefresh();
								}
							});
						}
					}
				});
			}

			function setProjectPinningContext(projectId){
				if (projectId) {
					let ids = {};
					projectMainPinnableEntityService.appendId(ids, projectId);
					projectMainPinnableEntityService.pin(ids);
				}
			}

			async function onSetPinningContext(currentPinningContext){
				// Add project to navigator when project context is pinned
				let prjPinningContext = _.find(currentPinningContext, {token: "project.main"});
				if(prjPinningContext){
					const prjId = parseInt(prjPinningContext.id, 10);
					if(!isNaN(prjId)){
						const prjExist = $scope.naviProjectList.recent?.some(rec => rec.ProjectFk === prjId) ||
							$scope.naviProjectList.favourite?.some(rec => rec.ProjectFk === prjId);
						if(!prjExist){
							await basicsCommonProjectNavigatorService.addProjectToNavigator(prjId);
							basicsCommonProjectNavigatorService.setDefaultProject(prjId);
							basicsCommonProjectNavigatorService.saveProjectNavigatorSetting().then(function (settings) {
								updateProjectList(settings);
								const defaultProject = basicsCommonProjectNavigatorService.getDefaultProject();
								if(defaultProject && $scope.naviProject && defaultProject.ProjectFk !== $scope.naviProject.ProjectFk){
									//$scope.naviProject = defaultProject;
									onRefresh();
								}
							});
						}
					} else {
						console.error("Error parsing pinning context project id: " + prjPinningContext.id);
					}
				}
			}

			let lastCallingToken = null;

			/**
			 * @function onNavigateToObject
			 */
			function onNavigateToObject(lo) {
				// get common props
				const { moduleName, objectId, furtherFilters: inputFilters, projectContextId, forceNewTab, naviServiceConnector } = lo || {};
				const url = globals.defaultState + '.' + moduleName.replace('.', '');
				const pKeys = _.isArray(objectId) ? objectId : [objectId];
				const furtherFilters = inputFilters ? pKeys.map(id => ({ ...inputFilters, Value: id })) : undefined;

				let navigator = naviService.getNavigator(lo.moduleName);
				if (!navigator) {
					console.error(`Navigator for module ${lo.moduleName} not found.`);
					return;
				}

				try {
					navigator.forceNewTab = forceNewTab;

					// Set project pinning context
					if(projectContextId) {
						setProjectPinningContext(projectContextId);
					}

					if (naviServiceConnector) {
						const currentCallingToken = {};
						lastCallingToken = currentCallingToken;

						const requestUrl = naviServiceConnector.getUrl(objectId, projectContextId);

						if (!forceNewTab) {
							$rootScope.$emit('navigateTo', moduleName);
						}

						$http.get(requestUrl)
							.then(response => {
								if (lastCallingToken !== currentCallingToken) return;
								lastCallingToken = null;
								naviService.navigate(navigator, response.data);
							})
							.catch(error => {
								console.error("Error retrieving item:", error);
							});
						return;
					}

					if (_.startsWith($state.current.name, url) && !forceNewTab) {
						// If a new tab is not required and the user is already in the same module,
						// directly apply filtering using cloudDesktopSidebarService instead of triggering navigation.
						cloudDesktopSidebarService.removeStartupFilter();
						cloudDesktopSidebarService.filterSearchFromPKeys(pKeys, furtherFilters, lo.projectContextId);

						return;
					}

					naviService.navigate(navigator, {Ids: pKeys.join(','), FromGoToBtn: true, furtherFilters, projectContextId: lo.projectContextId}, 'Ids');

				} catch (ex) {
					throw new Error('Navigate to module ' + url + ' failed. Error message: ' + ex);
				}
			}

			/**
			 * trigger in case of Sidebar Search is opened
			 * @param cmdId
			 */
			function onOpenSidebar(cmdId) {
				if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().projectNavi)) {
					sidebarIsOpen = true;
					onRefresh();
					if(!hasProject){
						convertProjectFavorite();
					}
				}
			}

			function onClosingSidebar(cmdId) {
				if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().projectNavi)) {
					basicsCommonProjectNavigatorService.saveProjectNavigatorSetting().then(function () {
						if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().projectNavi)) {
							sidebarIsOpen = false;
						}
					});
				}
			}


			// initialize project navigator sidebar
			initialize();

			cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);
			cloudDesktopSidebarService.onClosingSidebar.register(onClosingSidebar);
			cloudDesktopPinningContextService.onSetPinningContext.register(onSetPinningContext);

			// un-register on destroy
			$scope.$on('$destroy', function () {
				cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
				cloudDesktopSidebarService.onClosingSidebar.unregister(onClosingSidebar);
				cloudDesktopPinningContextService.onSetPinningContext.unregister(onSetPinningContext);
			});

		}]);

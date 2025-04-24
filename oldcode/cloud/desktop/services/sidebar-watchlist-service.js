// noinspection JSValidateTypes
/* global Platform:false */

/**
 * Created by rei on 20.11.2015.
 */

(function (angular) {
	'use strict';

	/**
	 *
	 */
	angular.module('cloud.desktop').factory('cloudDesktopSidebarWatchListService', cloudDesktopSidebarWatchListService);

	cloudDesktopSidebarWatchListService.$inject = ['globals', '_', 'moment', '$q', '$http', '$translate', 'platformContextService', 'initApp', 'cloudDesktopSidebarService',
		'permissions', 'platformUserInfoService', 'platformPermissionService', 'platformModalService', 'platformContextMenuTypes'];

	function cloudDesktopSidebarWatchListService(globals, _, moment, $q, $http, $translate, platformContextService, initAppService, sidebarService,
		permissions, platformUserInfoService, platformPermissionService, platformModalService, platformContextMenuTypes) {

		// sidebar messengers
		const openWatchListDialog = new Platform.Messenger();
		const refreshContainerView = new Platform.Messenger();

		const user = {id: 'U', description: $translate.instant('cloud.desktop.watchlist.titleuserwl')};
		const role = {id: 'R', description: $translate.instant('cloud.desktop.watchlist.titlerolewl')};
		const company = {id: 'C', description: $translate.instant('cloud.desktop.watchlist.titlecompanywl')};
		let watchListAreaItems;

		const watchListBaseUrl = globals.webApiBaseUrl + 'cloud/common/watchlist/';

		let initialized = false;
		let initPendingPromise;
		let watchListInitialReadDone;

		// permission check
		const UserPermission = '4c1e056c35e044a993b4ac1c85563b6d';
		const RolePermission = '647c8391677246be8101e950a5ce34be';
		const CompanyPermission = 'f9772d9722ac4cc8b352cb957b42f36b';

		let hasUserAccess = false;
		let hasRoleAccess = false;
		let hasCompanyAccess = false;

		let saveDialogLastParameter = {}; // save last setting of Save Watchlist dialog, for further usage

		let watchListSettings = {};
		let watchLists = [];
		let watchListItems = [];
		let currentModuleName = '';
		let currentDataService;
		let watchListOptions = {};

		/**
		 * @description loads all filter permission from backend and check for system/user save filter rights
		 */
		function loadFilterPermissions() {
			const thePermissions = [UserPermission, RolePermission, CompanyPermission];

			return platformPermissionService.loadPermissions(thePermissions).then(function () {
				// updated scope or state object for binding
				// ... do whatever you want ...
				hasUserAccess = platformPermissionService.has(UserPermission, permissions.write);
				hasRoleAccess = platformPermissionService.has(RolePermission, permissions.write);
				hasCompanyAccess = platformPermissionService.has(CompanyPermission, permissions.write);

				watchListAreaItems = [];
				if (hasUserAccess) {
					watchListAreaItems.push(user);
				}
				if (hasRoleAccess) {
					watchListAreaItems.push(role);
				}
				if (hasCompanyAccess) {
					watchListAreaItems.push(company);
				}
			});
		}

		function checkWatchListButtonDisabled() {

			if (currentDataService) {
				const selected = currentDataService.getSelected();
				return (!(selected && selected.Id));
			}
			return true;
		}

		function onSelectionChanged(action, entity) {  // jshint ignore:line

			if (!_.isEmpty(entity)) {
				_.noop();
			}

		}

		/**
		 *
		 * @param modulname
		 * @param pWatchListOptions
		 * @param dataService
		 * @returns {promise}
		 */
		function initialize(modulname, pWatchListOptions, dataService) {

			// if there is already one registered, we unregister first
			if (currentDataService) {
				currentDataService.unregisterSelectionChanged(onSelectionChanged);
			}

			currentModuleName = modulname;
			currentDataService = dataService;
			watchListOptions = pWatchListOptions;
			if (!currentModuleName) {
				console.error('watchlistserver initialize) failed, modulename must be valid', modulname);
			}

			if (currentDataService) {
				currentDataService.registerSelectionChanged(onSelectionChanged);
			}

			return initService();  // make sure permission initialized
		}

		/**
		 *
		 * @returns {promise}
		 */
		function resetWatchListService() {

			currentModuleName = '';

			if (currentDataService) {
				currentDataService.unregisterSelectionChanged(onSelectionChanged);
				currentDataService = undefined;
			}
			saveDialogLastParameter = {};

			watchListSettings = {};
			watchLists = [];
			watchListItems = [];
			watchListOptions = {};
			watchListInitialReadDone = false;
		}

		/**
		 * return current watchList Area Items depending on the user rights
		 * @returns {*}
		 */
		function getWatchListAreaItems() {
			return watchListAreaItems;
		}

		/**
		 * Constructor function for creating a new watchlist
		 * @param name
		 * @param type
		 * @constructor
		 */
		function WatchList(name, type) {
			this.id = 0;
			this.type = type;
			this.name = name;
			this.itemCount = 0;
			this.lastModifiedDate = undefined;
			this.lastModifiedBy = undefined;
			this.watchListElementIds = [];
			this.version = 0;
		}

		/**
		 * this function return the list of available watchlists
		 * the returned list only contains unique items by name
		 *
		 * @returns {Array}  {name: name} unique list
		 */
		function getWatchListforInputSelect(selected) {
			let selectedItem= selected? selected : watchListAreaItems[0];
			function prepareWatchList() {
				let retList = [];
				if (watchLists) {
					_.forEach(watchLists, function (item) {
						if(item.type===selectedItem.id)
						{
							retList.push({id:item.type,name: item.name});
						}

					});
				}
				return _.uniq(retList, function (item) {
					return item.name;
				});
			}

			if (!watchListInitialReadDone) {
				return readWatchLists().then(function () {
					return prepareWatchList();
				});
			}
			return $q.when(prepareWatchList());
		}

		/**
		 * This function resolves the lastuserId to a readable text string using platform service function
		 *
		 * @returns {*}
		 */
		function resolveUserNames() {
			const userIds = _.compact(_.map(watchLists, 'lastModifiedById'));
			return platformUserInfoService.loadUsers(userIds).then(function (/* result */) {

				_.forEach(watchLists, function (wl) {
					wl.lastModifiedBy = platformUserInfoService.name(wl.lastModifiedById) || 'n/a';
				});
				// console.log ('resolveUserNames done', watchLists);

				return watchLists;
			});
		}

		/**
		 *
		 * @param moduleName
		 * @returns {*}
		 */
		function readWatchLists(moduleName) {// jshint ignore:line
			// const inquiryGetAddressesBaseUrl = favoritesBaseUrl + 'getprojectfavorites';
			if ((!_.isNil(moduleName) && moduleName !== '') || (!_.isNil(currentModuleName) && currentModuleName !== '')) {
				return $http.get(
					watchListBaseUrl + 'getwatchlists',
					{params: {moduleName: moduleName || currentModuleName}}
				).then(function success(response) {
					watchLists = [];
					watchListInitialReadDone = true;
					if (response.data) {
						watchLists = response.data.watchLists;
						watchListSettings = response.data.watchListSetting || {};
						// check if default watchlist is valid
						if (!_.find(watchLists, {id: watchListSettings.defaultWatchListId})) {
							watchListSettings.defaultWatchListId = undefined;
						}
						return resolveUserNames();  // forward promise
					}
					return watchLists;
				}, function failed(response) {
					watchLists = [];
					return response.data;
				});
			} else {
				return $q.when(true);
			}

		}

		/**
		 *
		 * @param moduleName
		 * @param watchListId
		 * @returns {*}
		 */
		function readWatchListItems(moduleName, watchListId) {// jshint ignore:line
			// const inquiryGetAddressesBaseUrl = favoritesBaseUrl + 'getprojectfavorites';
			return $http.get(
				watchListBaseUrl + 'getwatchlistitems',
				{params: {moduleName: moduleName || currentModuleName, watchListId: watchListId}}
			).then(function success(response) {
				watchListItems = [];
				if (response.data) {
					watchListItems = response.data;
				}
				return watchListItems;
			}, function failed(response) {
				watchListItems = [];
				return response.data;
			});
		}

		/**
		 * create a new watchlist, if there are watchlist elements available, the elements will be attached to the new
		 * created watchlist.
		 * @param {string}  [moduleName] if not supplied default modulename is used
		 * @param {object}  watchList the watchlist
		 * @returns {*}
		 */
		function createWatchList(moduleName, watchList) {

			const createWatchListDto = {
				moduleName: moduleName || currentModuleName,
				watchListInfo: watchList
			};

			return $http.post(
				watchListBaseUrl + 'createwatchlist',
				createWatchListDto
			).then(function success(response) {
				return response.data;
			}, function failed(response) {
				return response.data;
			});
		}

		/**
		 *
		 * @param moduleName
		 * @param watchListId
		 * @returns {*}
		 */
		function removeWatchList(moduleName, watchListId) {

			return $http.get(
				watchListBaseUrl + 'removewatchlist',
				{params: {watchListId: watchListId}}
			).then(function success(response) {
				return response.data;
			}, function failed(response) {
				return response.data;
			});
		}

		/**
		 * This function updates the watchlist including watchlist elements.
		 *
		 * @param {string}          [moduleName]      if not supplied default modulename is used
		 * @param {object}   [watchList] the watchlist
		 * @returns {object}           The watchlist info
		 */
		function updateWatchList(moduleName, watchList) {
			const UpdateWatchListDto = {
				moduleName: moduleName || currentModuleName,
				watchListInfo: watchList
			};

			return $http.post(
				watchListBaseUrl + 'updatesavewatchlist',
				UpdateWatchListDto
			).then(function success(response) {
				return response.data;
			}, function failed(response) {
				return response.data;
			});
		}

		/**
		 *
		 * @returns {*}
		 */
		function saveWatchListSetting() {

			return $http.post(
				watchListBaseUrl + 'savewatchlistsetting',
				watchListSettings
			).then(function success(response) {
				return response.data;
			}, function failed(response) {
				return response.data;
			});
		}

		function clearStandardWatchList() {
			if (watchListSettings.defaultWatchListId) {
				watchListSettings.defaultWatchListId = undefined;
				return true;
			}
			return false;
		}

		function isStandardWatchList(id) {
			return (watchListSettings.defaultWatchListId && watchListSettings.defaultWatchListId === id);
		}

		function isExpanded(type) {
			return watchListSettings.expanded && watchListSettings.expanded[type];
		}

		function setExpanded(type, state) {
			watchListSettings.expanded = watchListSettings.expanded || {};
			watchListSettings.expanded [type] = state;
		}

		function getStandardWatchList() {
			return watchListSettings.defaultWatchListId;
		}

		function setStandardWatchList(id) {
			watchListSettings.defaultWatchListId = id;
		}

		function getWatchLists() {
			return watchLists;
		}

		/**
		 *
		 * @param watchListName
		 * @param watchListType
		 */
		function getWatchListByNameType(watchListName, watchListType) {
			return _.find(watchLists, {name: watchListName, type: watchListType});
		}

		/**
		 * returns watchlist to specific watchListId
		 * @param watchListId
		 */
		function getWatchList(watchListId) {

			return _.find(watchLists, {id: watchListId});
		}

		function getWatchListItems() {
			return watchListItems;
		}

		/**
		 * W a t c h L i s t s
		 * The function delete a complete watchlist
		 * @param {int} watchListId
		 */
		function deleteWatchListsItem(watchListId) {

			return removeWatchList(undefined, watchListId).then(function (result) {

				refreshContainerView.fire();
				return result;
			});

		}

		/**
		 * W a t c h L i s t s  I t e m s
		 * This function delete a watchlist entry from a watchlist
		 * @param {int} watchListId
		 * @param {int} watchListItemId
		 */
		function deleteWatchListItem(watchListId, watchListItemId) {

			// console.error('deleteWatchListItem()', watchListId, watchListItemId);
			let watchlist = getWatchList(watchListId);
			let removed = _.remove(watchlist.watchListElementIds, function (itemId) {
				return (itemId === watchListItemId);
			});
			if (!!removed || removed.length > 0) {
				watchlist.itemCount--;
				return updateWatchList(undefined, watchlist).then(function (result) {
					// _.noop();
					refreshContainerView.fire();
					return result;
				});
			}
			return $q.when(true);
		}

		/**
		 * Inititalize function for this service.
		 * @returns {promise} true if resolved
		 * @constructor
		 */
		function initService() {
			if (initialized) {
				return $q.when(true); // return resolved promise;
			}
			if (initPendingPromise) {
				return initPendingPromise;
			}
			if (!initialized) {
				initPendingPromise = loadFilterPermissions().then(function () {
					initialized = true;
					return true;
				});
			}
			return initPendingPromise; // return resolved promise;
		}

		/**
		 * Checks access (write) for User, Role, Company
		 * @param {string}    type: U User, R Role, C Company
		 * @returns {boolean} if access is granted =>>> return true else false
		 */
		function checkPermissionByType(type) {
			switch (type) {
				case 'U':
					return hasUserAccess;
				case 'R':
					return hasRoleAccess;
				case 'C':
					return hasCompanyAccess;
			}
			return false;
		}

		/**
		 * Checks access (write) for User, Role, Company
		 * @param {int}    watchlistId  id of the watchlist to be checked for access
		 * @returns {boolean} if access is granted =>>> return true else false
		 */
		function checkPermissionById(watchlistId) {

			if (!watchlistId) {
				return false;
			}

			const watchlist = getWatchList(watchlistId);
			switch (watchlist.type || {}) {
				case 'U':
					return hasUserAccess;
				case 'R':
					return hasRoleAccess;
				case 'C':
					return hasCompanyAccess;
			}
			return false;
		}

		/**
		 * this function returns the standard watchlist id or false
		 * @returns {boolean}
		 */
		function checkAccessRightandStandardList() {

			let stdWlId = getStandardWatchList();
			if (stdWlId) {
				if (checkPermissionById(stdWlId)) {
					return stdWlId;
				}
			}
			return false;
		}

		/**
		 * This function add and remove watchlist buttons into the toolbar.
		 *
		 * @param $scope
		 * @param dataService
		 */
		function getWatchListToolbarButtons($scope, dataService) {

			/**
			 *
			 * @param theWatchList
			 * @param newElements
			 */
			function addElementsToExistingWatchList(theWatchList, newElements) {
				// element already in list?
				let alreadyExistingCount = 0;
				let validUpdate = false;
				newElements.map(function (element) {
					const isThere = _.indexOf(theWatchList.watchListElementIds, element.Id);
					if (isThere === -1) {
						validUpdate = true;
						theWatchList.watchListElementIds.push(element.Id);
					} else {
						alreadyExistingCount++;
					}
				});

				if (validUpdate) {
					updateWatchList(undefined, theWatchList).then(function (/* result */) {
						// console.log ('added element to watchlist', result);
						refreshContainerView.fire();
					});
				}

				if (alreadyExistingCount > 0) {
					if (alreadyExistingCount === newElements.length) {
						platformModalService.showMsgBox('cloud.desktop.watchlist.infoalreadyinlist', 'cloud.desktop.watchlist.infoalltitle', 'info');
					} else {
						platformModalService.showMsgBox('cloud.desktop.watchlist.infoFewInList', 'cloud.desktop.watchlist.infoalltitle', 'info');
					}

				}
			}

			function hasIdField(elements) {
				let valid = true;
				elements.map(function (el) {
					if (!el.Id) {
						valid = false;
					}
				});
				return valid;
			}

			function addToWatchList() {
				if (!dataService) {
					return;
				}

				let newWatchListElementsMulti = dataService.getSelectedEntities();
				if (!newWatchListElementsMulti || newWatchListElementsMulti.length === 0 || !hasIdField(newWatchListElementsMulti)) {
					return;
				}

				let elemCount = 1;
				let stdWatchListId = checkAccessRightandStandardList();
				if (stdWatchListId) {  // standard list set and i have access, added element(s) to this list
					let stdWatchList = getWatchList(stdWatchListId);
					stdWatchList.watchListElementIds = stdWatchList.watchListElementIds || [];  // make sure there is an array
					addElementsToExistingWatchList(stdWatchList, newWatchListElementsMulti);

					return;
				}

				if (!(watchListAreaItems && watchListAreaItems.length >= 0)) {
					return;
				}

				// no standard list is set, we need to ask user for Name and Area of new dialog
				const saveDialogParams = {
					watchListName: saveDialogLastParameter.watchListName || '',
					selectedItem: _.find(watchListAreaItems, {id: saveDialogLastParameter.areaId}) || watchListAreaItems[0],
					newElememtsCounts: elemCount
				};
				openWatchListDialog.fire(saveDialogParams).then(function (dialogResult) {

					if (dialogResult.valid) {

						const value = dialogResult.value;
						saveDialogLastParameter.watchListName = value.watchListName;
						saveDialogLastParameter.areaId = value.selectedItem.id;

						// check if watchlist already exists
						const wlExists = getWatchListByNameType(value.watchListName, value.selectedItem.id);
						if (wlExists) {
							addElementsToExistingWatchList(wlExists, newWatchListElementsMulti);

						} else {
							// create new watchlist and add the new elements
							// watchlist might already exist, in this case a the new element and save and force refresh
							let newWl = new WatchList(value.watchListName, value.selectedItem.id);

							newWatchListElementsMulti.map(function (item) {
								newWl.watchListElementIds.push(item.Id);
							});

							createWatchList(undefined, newWl).then(function (/* newWatchList */) {
								refreshContainerView.fire();
							});
						}
					}
				});
			}

			// do i have to permission to add items to any watchlist ?
			const disableAddToWatchList = !(watchListAreaItems && watchListAreaItems.length >= 0);
			if (disableAddToWatchList) {
				return null;  // no do not have permission
			}

			const watchListButton = {
				id: 't-addtowatchlist',
				type: 'item',
				caption: $translate.instant('cloud.desktop.watchlist.addtowatchlisttp'),
				iconClass: 'tlb-icons ico-watchlist-add',  // must be unique in whole itemList
				disabled: checkWatchListButtonDisabled,
				fn: addToWatchList,
				contextAreas: [platformContextMenuTypes.gridRow.type]
			};

			return [watchListButton];
		}

		// all method support by this service listed here
		return {
			getWatchListAreaItems: getWatchListAreaItems,

			// platform messenger events
			openWatchListDialog: openWatchListDialog,
			refreshContainerView: refreshContainerView,

			readWatchLists: readWatchLists,
			saveWatchListSetting: saveWatchListSetting,
			readWatchListItems: readWatchListItems,
			updateWatchList: updateWatchList,
			createWatchList: createWatchList,
			removeWatchList: removeWatchList,
			clearStandardWatchList: clearStandardWatchList,
			isStandardWatchList: isStandardWatchList,
			setStandardWatchList: setStandardWatchList,
			isExpanded: isExpanded,
			setExpanded: setExpanded,
			getWatchLists: getWatchLists,
			getWatchList: getWatchList,
			getWatchListItems: getWatchListItems,
			getStandardWatchList: getStandardWatchList,
			deleteWatchListsItem: deleteWatchListsItem,
			deleteWatchListItem: deleteWatchListItem,
			checkPermissionByType: checkPermissionByType,
			checkPermissionById: checkPermissionById,

			initService: initService,
			initialize: initialize,
			resetWatchListService: resetWatchListService,

			deActivateWatchlist: resetWatchListService,
			getWatchListToolbarButtons: getWatchListToolbarButtons,
			getWatchListforInputSelect: getWatchListforInputSelect
			// fixture: fixture
		};
	}
})(angular);

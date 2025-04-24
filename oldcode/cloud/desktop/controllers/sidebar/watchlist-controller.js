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

angular.module('cloud.desktop').controller('cloudDesktopWatchListController', CloudDesktopWatchListController);

CloudDesktopWatchListController.$inject = ['globals', '_', '$q', '$scope', 'platformTranslateService', 'moment', '$templateCache', '$translate',
	'cloudDesktopSidebarService', 'cloudDesktopSidebarWatchListService', 'platformModalService', '$sanitize'];

function CloudDesktopWatchListController(globals, _, $q, $scope, platformTranslateService, moment, $templateCache, $translate,
	cloudDesktopSidebarService, watchListService, platformModalService, $sanitize) {

	'use strict';
	let ctrl = this;

	// init scope
	ctrl.watchListItems = [];

	ctrl.loading = true;        // used as indicator for the UI while loading, saving etc. is running
	ctrl.nowatchlists = true;   // used as indicator for the UI while there are no watchlists found or loaded

	ctrl.list = true;           // true if list view active
	ctrl.detail = false;        // true if detail view active

	// ctrl.itemTemplate = $templateCache.get('watchlist/list-items.html');
	ctrl.groupTemplate = $templateCache.get('watchlist/accordion-group.html');

	ctrl.itemTemplate = $templateCache.get('watchlist/list-items-submenu.html');

	ctrl.detailItemsTemplate = $templateCache.get('watchlist/watchlist-item.html');
	ctrl.detailWatchList = undefined;
	ctrl.detailEditable = false;
	// ctrl.onWatchListNameChange;

	ctrl.listConfig = {};

	const summaryMissingText = $translate.instant('cloud.desktop.watchlist.summarymissing');

	/**
	 *
	 * @returns {{showImages: boolean, showTitles: boolean, showSelected: boolean, items: *[]}}
	 */
	function getWatchlistsConfig(watchLists) {

		var userExpanded = watchListService.isExpanded('u');
		var roleExpanded = watchListService.isExpanded('r');
		var companyExpanded = watchListService.isExpanded('c');

		var userItem = {
			id: 0,
			customType: 'u',
			text: $translate.instant('cloud.desktop.watchlist.titleuserwl'),
			// groupIconClass: 'sidebar-icons ico-wiz-change-status',
			groupIconClass: 'control-icons ' + (watchListService.checkPermissionByType('U') ? 'ico-watchlist-user' : 'ico-watchlist-user-prot'),
			visible: userExpanded,
			subitems: []
		};

		var roleItem = {
			id: 1,
			customType: 'r',
			text: $translate.instant('cloud.desktop.watchlist.titlerolewl'),
			// groupIconClass: 'sidebar-icons ico-wiz-change-status',
			groupIconClass: 'control-icons ' + (watchListService.checkPermissionByType('R') ? 'ico-watchlist-role' : 'ico-watchlist-role-prot'),
			visible: roleExpanded,
			subitems: []
		};
		var companyItem = {
			id: 2,
			customType: 'c',
			text: $translate.instant('cloud.desktop.watchlist.titlecompanywl'),
			// groupIconClass: 'sidebar-icons ico-wiz-change-status',
			groupIconClass: 'control-icons ' + (watchListService.checkPermissionByType('C') ? 'ico-watchlist-company' : 'ico-watchlist-company-prot'),
			visible: companyExpanded,
			subitems: []
		};

		var config = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			items: []
		};

		// process watchlist and sort by type
		var userWatchLists = [];
		var roleWatchLists = [];
		var companyWatchLists = [];

		/**
		 *
		 * @param groupid
		 */
		ctrl.getConfigItemById = function getConfigItemById(groupid) {
			return _.find(config.items, {id: groupid});
		};

		// id: 12,
		// groupId: 1,
		// text: 'Disable Record',
		// text$tr$: 'businesspartner.main.wizardDisableRecord',
		// type: 'item',
		// showItem: true,
		// fn: function(){...}
		/**
		 *
		 * @param watchlist
		 * @param groupId
		 * @constructor
		 */
		function WatchListSubItem(groupId, watchlist) {
			this.id = watchlist.id;
			this.groupId = groupId;
			this.name = _.isString(watchlist.name) ? $sanitize(watchlist.name) : '';  // rei@27.10.21, protect from xss attacks
			this.itemCount = watchlist.itemCount;
			this.text = moment(watchlist.lastModifiedDate).format('L LT') + ' / ' + watchlist.lastModifiedBy;

			this.type = 'item';
			this.showImages = true;
			var isStdWl = watchListService.isStandardWatchList(this.id);
			this.hideStdWl = !watchListService.checkPermissionByType(watchlist.type) || isStdWl;
			this.isStdWlClass = isStdWl ? 'control-icons ico-pin2' : '';
		}

		_.forEach(watchLists || [], function (wl) {
			if (wl.type === 'U') {
				userWatchLists.push(wl);
			}
			if (wl.type === 'R') {
				roleWatchLists.push(wl);
			}
			if (wl.type === 'C') {
				companyWatchLists.push(wl);
			}
		});

		_.forEach([userWatchLists, roleWatchLists, companyWatchLists], function (grouplists, idx) {
			var item = (idx === 0) ? userItem : (idx === 1) ? roleItem : (idx === 2) ? companyItem : null;
			_.forEach(grouplists, function (watchlist) {
				var newWatchList = new WatchListSubItem(item.id, watchlist);
				item.subitems.push(newWatchList);
			});
			if (item.subitems.length > 0) {
				config.items.push(item);
			}
		});

		return config;
	}

	ctrl.refreshWatchLists = function refreshWatchLists() {

		ctrl.loading = true;

		return watchListService.initService().then(function (/* done */) {

			return watchListService.readWatchLists().then(function (/* response */) {

				// ctrl.watchLists = watchListService.getWatchLists();
				var wls = watchListService.getWatchLists();
				ctrl.listConfig = getWatchlistsConfig(wls);
				ctrl.loading = false;
				ctrl.nowatchlists = !(wls && wls.length > 0);
			});
		});
	};

	ctrl.refreshWatchListItems = function refreshWatchListItems() {

		var watchlistId = ctrl.detailWatchList ? ctrl.detailWatchList.id : undefined;
		if (!watchlistId) {
			return;
		}

		ctrl.loading = true;
		watchListService.readWatchListItems(undefined, watchlistId).then(function () {

			ctrl.loading = false;
			ctrl.watchListItems = []; // watchListService.getWatchListItems();
			var theWlItems = watchListService.getWatchListItems();

			_.forEach(theWlItems, function (item) {
				ctrl.watchListItems.push({
					id: item.objectId,
					summary: _.isString(item.summary) ? $sanitize(item.summary) : summaryMissingText, // +'['+item.objectId+']',
					firstDetail: item.firstDetail,
					canDelete: ctrl.detailEditable
				});
			});

			// fix eventually wrong number of items or wrong items
			if (theWlItems && ctrl.detailWatchList.itemCount !== theWlItems.length) {
				ctrl.detailWatchList.itemCount = theWlItems.length;
				// ctrl.detailWatchList.watchListItems = _.map(theWlItems, 'id');
			}

		});
	};

	ctrl.clearStandardWatchList = function () {
		if (watchListService.clearStandardWatchList()) {
			return watchListService.saveWatchListSetting().then(function () {
				return ctrl.refreshWatchLists();
			});
		}
	};

	ctrl.canClearStandardWatchList = function () {
		return !!watchListService.getStandardWatchList();
	};

	ctrl.isDefaultWatchList = function (id) {
		return watchListService.isStandardWatchList(id);
	};

	function setDefaultWatchList(watchlistId) {

		if (!checkAccessPermission(watchlistId)) {
			platformModalService.showErrorBox('cloud.desktop.watchlist.errnotallowedbody', 'cloud.desktop.watchlist.errnotallowedtitle');
			return;
		}

		watchListService.setStandardWatchList(watchlistId);
		return watchListService.saveWatchListSetting().then(function () {
			return ctrl.refreshWatchLists();
		});
	}

	// ctrl.onOpenWatchListSubMenu = function (watchlistId) {
	// console.log ('onOpenWatchListSubMenu ', watchlistId);
	// };

	function checkAccessPermission(watchlistId) {
		return watchListService.checkPermissionById(watchlistId);
	}

	function deleteWatchList(watchListId) {
		// modal dialog ask for confirm deletion
		// console.log ('deleteWatchList ', watchListId);
		if (!checkAccessPermission(watchListId)) {
			platformModalService.showErrorBox('cloud.desktop.watchlist.errnotallowedbody', 'cloud.desktop.watchlist.errnotallowedtitle');
			return;
		}
		platformModalService.showYesNoDialog('cloud.desktop.watchlist.deletewatchlistbody', 'cloud.desktop.watchlist.deletewatchlisttitle')
			.then(function (result) {
				if (result.yes) {
					ctrl.loading = true;
					watchListService.deleteWatchListsItem(watchListId).then(function () {
						ctrl.loading = false;
					});
				}
			});
	}

	/**
	 * This function deletes un item from a watchlist
	 * @param {int} watchListItemid
	 */
	function onDeleteWatchListItem(watchListItemid) {
		// modal dialog ask for confirm deletion
		platformModalService.showYesNoDialog('cloud.desktop.watchlist.deletewatchlistelembody', 'cloud.desktop.watchlist.deletewatchlistelemtitle')
			.then(function (result) {
				if (result.yes) {
					ctrl.loading = true;
					watchListService.deleteWatchListItem(ctrl.detailWatchList.id, watchListItemid).then(function (/* result */) {
						ctrl.loading = false;

					});
				}
			});

	}

	ctrl.onToogleWatchListGroup = function (groupId) {
		// console.log ('onToogleWatchListGroup ', groupId);
		var item = ctrl.getConfigItemById(groupId);
		watchListService.setExpanded(item.customType, item.visible);
		watchListService.saveWatchListSetting();
	};

	/**
	 * w a t c h l i s t i t e m
	 * handler for watchListItems,
	 * @param dispatcherId
	 * @param watchlistItemId
	 */
	ctrl.onClickWatchListItem = function (dispatcherId, watchlistItemId) {

		if (dispatcherId === 'onshowitem') {
			onWatchListShowItem(watchlistItemId);
		} else if (dispatcherId === 'ondelete') {
			onDeleteWatchListItem(watchlistItemId);
		}
	};

	/**
	 * W a t c h l i s t
	 * handler for watchListsItems, i.e. Watchlist from users group
	 * @param dispatcherId
	 * @param watchlistId
	 */
	ctrl.onClickWatchListsItem = function (dispatcherId, watchlistId) {
		ctrl.listConfig.selectedId = watchlistId;

		if (dispatcherId === 'onexecute') {
			onWatchListsExecute(watchlistId);
		} else if (dispatcherId === 'onedit') {
			ctrl.onWatchListsItemClick(watchlistId);

		} else if (dispatcherId === 'onsubmenu') {
			// ctrl.onOpenWatchListSubMenu(watchlistId);
			// watchListSubMenuPopup(watchlistId);
			_.noop();
		} else if (dispatcherId === 'ondelete') {
			deleteWatchList(watchlistId);

		} else if (dispatcherId === 'onsetdefault') {
			setDefaultWatchList(watchlistId);
		}
	};

	function onWatchListsExecute(itemId) {

		var theWatchList = watchListService.getWatchList(itemId);
		if (theWatchList.itemCount <= 0) {
			platformModalService.showMsgBox('cloud.desktop.watchlist.infonoitembody', 'cloud.desktop.watchlist.infonoitemtitle', 'info');
		}
		if (theWatchList.watchListElementIds) {
			cloudDesktopSidebarService.filterSearchFromPKeys(theWatchList.watchListElementIds);
		}

	}

	function onWatchListShowItem(watchlistItemId) {

		if (watchlistItemId) {
			cloudDesktopSidebarService.filterSearchFromPKeys([watchlistItemId]);
		}

	}

	/**
	 *
	 * @param itemId
	 */
	ctrl.onWatchListsItemClick = function (itemId) {

		ctrl.detailWatchList = watchListService.getWatchList(itemId);

		ctrl.detailEditable = watchListService.checkPermissionById(itemId);

		ctrl.refreshWatchListItems();
		ctrl.list = false;
		ctrl.detail = true;
	};

	/**
	 *
	 */
	ctrl.onReturnWatchListViewClick = function (/* itemId */) {

		ctrl.detailWatchList = undefined;
		ctrl.list = true;
		ctrl.detail = false;
		ctrl.detailEditable = false;
		ctrl.refreshWatchLists();
	};

	ctrl.onWatchListNameChange = function () {

		ctrl.loading = true;
		watchListService.updateWatchList(undefined, ctrl.detailWatchList).then(function (/* result */) {
			ctrl.loading = false;
		});
	};

	/**
	 * trigger in case of Sidebar Search is opened
	 * @param cmdId
	 */
	function onOpenSidebar(cmdId) {
		if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().watchlist)) {
			ctrl.refreshWatchLists();
		}
	}

	function onClosingSidebar(cmdId) {
		if (cmdId && cmdId === cloudDesktopSidebarService.getSidebarIdAsId(cloudDesktopSidebarService.getSidebarIds().watchlist)) {
			// resetLastObjects();
		}
	}

	function saveAsWatchListDialog(watchListName, selectedItem, newElememtsCounts) {

		var watchlistNameOptions = {
			// displayMember: 'displayname',
			displayMember: 'name',
			valueMember: 'name',
			serviceName: 'cloudDesktopSidebarWatchListService',
			serviceDataFunction: 'getWatchListforInputSelect',
			items: [],
			modelIsObject: false,
			inputDomain: 'description',
			watchlistSelected: function (item) {
				console.log('watchlistSelected', item);
			}
		};

		$scope.dlgOptions = {
			headerTextKey: $translate.instant('cloud.desktop.watchlist.adddlgtitle', {p1: newElememtsCounts}),
			bodyTextKey: 'cloud.desktop.watchlist.addtowatchlisttp',
			bodyTemplateUrl: globals.appBaseUrl + 'cloud.desktop/templates/sidebar/watchlist/watchlist-save-dialog.html',

			areaLabelText: $translate.instant('cloud.desktop.watchlist.adddlglblarea'),
			nameLabelText: $translate.instant('cloud.desktop.watchlist.adddlglblname'),

			showOkButton: true,
			showCancelButton: true,
			watchlistNameOptions: watchlistNameOptions,
			value: {selectedItem: selectedItem, watchListName: watchListName},
			areaItems: watchListService.getWatchListAreaItems(),
			namePlaceHolder: $translate.instant('cloud.desktop.watchlist.editwatchlistnameph'),

			disableOkButton: function isvalid() {
				if (!$scope.dlgOptions) {// || !$scope.dlgOtions.result) {
					return true;
				}
				var t = $scope.dlgOptions.value;
				return !(t.selectedItem && t.watchListName && t.watchListName.length > 0);
			},
			selectedItemChanged:function selectedItemChanged(selected)
			{
				if (selected) {
					watchListService.getWatchListforInputSelect(selected).then(function (response) {
						$scope.dlgOptions.value.watchListName='';
						$scope.dlgOptions.watchlistNameOptions.items = [];
						$scope.dlgOptions.watchlistNameOptions.items = response;
				  });
			  } else {
					$scope.dlgOptions.watchlistNameOptions = [];
			  }

			},

		};

		return platformModalService.showDialog($scope.dlgOptions).then(function (result) {
			if (result.ok) {
				var value = result.value;
				return {valid: true, value: value};
			}
			return {valid: false};
		});
	}

	function openWatchListDialog(options) {
		if (options) {
			return saveAsWatchListDialog(options.watchListName, options.selectedItem, options.newElememtsCounts);
		}
		return $q.when(false);
	}

	/**
	 * this function dispatches a view refresh depending on active view.
	 */
	function onrefreshContainerView() {
		if (ctrl.detail) {
			ctrl.refreshWatchListItems();
		} else {
			ctrl.refreshWatchLists();
		}
	}

	if (cloudDesktopSidebarService.checkedInLocalStorage(cloudDesktopSidebarService.getSidebarIds().watchlist)) {
		ctrl.refreshWatchLists();
	}

	// register events
	watchListService.openWatchListDialog.register(openWatchListDialog);
	watchListService.refreshContainerView.register(onrefreshContainerView);

	cloudDesktopSidebarService.onOpenSidebar.register(onOpenSidebar);
	cloudDesktopSidebarService.onClosingSidebar.register(onClosingSidebar);

	// un-register on destroy
	$scope.$on('$destroy', function () {
		cloudDesktopSidebarService.onOpenSidebar.unregister(onOpenSidebar);
		cloudDesktopSidebarService.onClosingSidebar.unregister(onClosingSidebar);

		watchListService.openWatchListDialog.unregister(openWatchListDialog);
		watchListService.refreshContainerView.unregister(onrefreshContainerView);
	});
}

/**
 * Created by rei on 11.06.2015.
 global console
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 *
	 */
	angular.module('cloud.desktop').factory('cloudDesktopSidebarInquiryService', cloudDesktopSidebarInquiryService);

	cloudDesktopSidebarInquiryService.$inject = ['_', '$q', '$http', '$translate', 'platformContextService', 'initApp', 'cloudDesktopSidebarService', 'cloudDesktopSidebarRadiusSearchService'];

	function cloudDesktopSidebarInquiryService(_, $q, $http, $translate, platformContextService, initAppService, sidebarService, radiusSearchService) { // jshint ignore:line
		var inquiryBaseUrl = globals.webApiBaseUrl + 'basics/api/inquiry/';

		var service = {};
		var inquiryItemsMap = new Map(); // map of item, key is item.id, value is item
		var inquiryRequestId;         // request id supplied by caller, normally a unique identifier like a guid
		var inquiryModuleName;        // module name coming from navInfo.module
		var inquiryNavInfo;           // complete navInfo coming from navInfo
		var providerInfo;
		var inquirySingleSelection = false;   // if true, we want to have single selection, otherewise multiple
		var addItemsDisabled = false; // it's true no longer allowed to add item

		/**
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @param {object} providerOptions {modulename: io.modulename, getSelectedItemsFn: io.getSelectedItemsFn, getResultsSetFn: io.getResultsSetFn}
		 *
		 */
		function registerProvider(providerOptions) {
			if (providerInfo === null || providerInfo === undefined) {
				providerInfo = providerOptions;
				providerInfo.active = false; // by default not active
			}
		}

		/**
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @param none
		 *     * {object} providerOptions {modulename: io.modulename, getSelectedItemsFn: io.getSelectedItemsFn, getResultsSetFn: io.getResultsSetFn}
		 *
		 */
		service.unRegisterProvider = function unRegisterProvider() {
			providerInfo = null;
			inquiryItemsMap.clear();
			inquiryRequestId = null;
			inquiryModuleName = null;
			inquiryNavInfo = null;
			inquirySingleSelection = null;
		};

		/**
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @param {boolean} activate set/reset of provider
		 */
		service.activateSidebarInquiryProvider = function activateSidebarInquiryProvider(activate) {
			if (providerInfo) {
				providerInfo.active = activate;
			}
		};

		function readValues(fct, withAdd) {
			var result = null;
			if (providerInfo && providerInfo.active && _.isFunction(fct)) {

				result = fct();
				if (result && withAdd) {
					addInquiryItems(result);
				}
			}
			return result;
		}

		/**
		 * This function calls the callback method for getting all SelectedItems for actually resultset
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @param {boolean} withAdd if true we add the new item into the inquiryItemslist
		 *
		 */
		service.onAddSelectedItems = function onAddSelectedItems(withAdd) {

			return readValues(providerInfo.getSelectedItemsFn, withAdd);

		};

		/**
		 * This function calls the callback method for getting all Items for actually resultset
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @param {boolean} withAdd if true we add the new item into the inquiryItemslist
		 *
		 */
		service.onAddAllItems = function onAddAllItems(withAdd) {

			return readValues(providerInfo.getResultsSetFn, withAdd);

		};

		/**
		 * This function checks if there is a callback method
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @param none
		 * @returns  {boolean} returns true if there is a callback method, otherwise false
		 */
		service.canAddAllItems = function canAddAllItems() {
			return !service.isInquiryFinished && (!inquirySingleSelection && providerInfo && providerInfo.active && _.isFunction(providerInfo.getResultsSetFn));
		};

		/**
		 * only allow when not disabled and items in map
		 * @returns {boolean}
		 */
		function canCancelInquiry() {
			return !service.isInquiryFinished && (providerInfo && providerInfo.active);
		}

		/**
		 * This function checks if there is a callback method
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @param none
		 * @returns  {boolean} returns true if there is a callback method, otherwise false
		 */
		function canAddSelectedItems() {
			return !service.isInquiryFinished && (providerInfo && providerInfo.active && _.isFunction(providerInfo.getSelectedItemsFn));
		}

		/**
		 *
		 * @param itemOrItems
		 */
		function addInquiryItems(itemOrItems) {

			if (addItemsDisabled) { // disable adding of further items. Nop message here !!!!
				return;
			}
			if (!_.isObject(itemOrItems)) {
				return;
			}
			var items = _.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

			if (inquirySingleSelection) {
				inquiryItemsMap.clear();
				var item = items[0];
				inquiryItemsMap.set(item.id, item);  // add first, if there are multiple
			} else {
				_.forEach(items, function (item) {
					inquiryItemsMap.set(item.id, item);
				});
			}
		}

		/**
		 * return true if delete all is allowed and items in map
		 *
		 */
		function canDeleteAll() {
			return !addItemsDisabled && (inquiryItemsMap.size > 0);
		}

		/**
		 *
		 * @param itemOrItems
		 * @param all           if true we remove all items
		 */
		function deleteInquiryItems(itemOrItems, all) {
			if (!(itemOrItems || all)) {
				return;
			}

			if (all) {
				inquiryItemsMap.clear();
			} else {
				var items = _.isArray(itemOrItems) ? itemOrItems : [itemOrItems];

				_.forEach(items, function (itemId) {
					inquiryItemsMap.delete(itemId);
				});
			}
		}

		/**
		 * returns the inquiry items by reading them from the inquire items map
		 * @returns {array} inquiryItems
		 */
		function getInquiryItems() {
			var retArr = [];
			inquiryItemsMap.forEach(function (value) {
				retArr.push(value);
			});
			return retArr;
		}

		/**
		 * this function jsonfies the current inquiry items and returns the whole array object as json string
		 * @param {bool}      compactFormat  if true, we do not send name and description property to the server
		 * @returns {string}  the inquiry items as json string
		 */
		function getInquiryItemsJsonfied(compactFormat) {

			var items = getInquiryItems();
			var asJson = '';
			if (items.length > 0) {
				if (compactFormat) {  // we remove name and description (item is not cloned) !!!!
					var compactedArr = [];
					_.forEach(items, function (item) {
						var itemC = _.extend({}, item);
						itemC.name = itemC.description = undefined;
						compactedArr.push(itemC);
					});
					items = compactedArr;
				}
				asJson = JSON.stringify(items);
			}

			return asJson;
		}

		/**
		 * This method returns the number of inquiry items
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @returns {int}  returns size of gathered inquiry items
		 */
		function getInquiryItemsCount() {
			return inquiryItemsMap.size;
		}

		/**
		 * returns the getInquiredItems for sending via PostMessage
		 * rei@12.7.22
		 **/
		function getInquiredItems() {
			const inquiryItems = {
				requestid: inquiryRequestId,
				modulename: inquiryModuleName,
				status: 1,  // request finish successful
				itemlist: getInquiryItemsJsonfied(true /* compacted */)
			};
			return inquiryItems;
		}

		/**
		 * return the cancelinfo for sending via PostMessage
		 * rei@12.7.22
		 */
		function getCancelInfo() {
			const cancelInfo = {
				requestid: inquiryRequestId,
				modulename: inquiryModuleName,
				status: -1  // request cancel by user
			};
			return cancelInfo;
		}

		/**
		 * This method save the inquiry data in the request by make an entry in the inquiry request table with:
		 *  requestid:   inquiryRequestId
		 *  status:      canceled
		 * @method deleteFilterDefinition
		 * @param moduleName {string}   none
		 * @param filterDef {FilterDefinition}   none
		 **/
		function saveInquiry() {
			var params = {
				requestid: inquiryRequestId,
				modulename: inquiryModuleName,
				status: 1,  // request finish successful
				itemlist: getInquiryItemsJsonfied(true /* compacted */),
				includeCleanup: true
			};

			return $http.post(
				inquiryBaseUrl + 'saveinquiries',
				params
			).then(function success(response) {
				// readInquiryAddresses();
				return response.data;
			}
			);
		}

		/**
		 * This method save the inquiry data in the request by make an entry in the inquiry request table with:
		 *  requestid:   inquiryRequestId
		 *  status:      canceled
		 * @method deleteFilterDefinition
		 * @param moduleName {string}   none
		 * @param filterDef {FilterDefinition}   none
		 **/
		function readInquiryAddresses() {// jshint ignore:line
			var inquiryGetAddressesBaseUrl = globals.webApiBaseUrl + 'businesspartner/main/api/';
			var params = {
				requestId: inquiryRequestId
			};
			return $http.post(
				inquiryGetAddressesBaseUrl + 'getInquiryAddresses',
				params /* , { headers: {'errorDialog': false} } */)
				.then(function success(response) {
					return response.data;
				},
				function failed(response) {
					return response.data;
				}
				);
		}

		/**
		 * This method cancel the inquiry request by make an entry in the inquiry request table with:
		 *  requestid:   inquiryRequestId
		 *  status:      canceled
		 * @method deleteFilterDefinition
		 * @param moduleName {string}   none
		 * @param filterDef {FilterDefinition}   none
		 **/
		function cancelInquiry() {
			var params = {
				requestid: inquiryRequestId,
				modulename: inquiryModuleName,
				status: -1,  // request cancel by user
				includeCleanup: true
			};

			return $http.post(
				inquiryBaseUrl + 'cancelinquiry',
				params /* , { headers: {'errorDialog': false} } */)
				.then(function success(response) {
					return response.data;
				}
				);

		}

		/**
		 *
		 */
		function readInquiryStartupInfo() {

			var appStartupInfo = initAppService.getStartupInfo();
			if (appStartupInfo && appStartupInfo.navInfo && _.isEqual(appStartupInfo.navInfo.operation, 'inquiry')) {
				return appStartupInfo;
			}
			return null;
		}

		/**
		 *
		 */
		function checkStartupInfoforInquiry() {

			var appStartupInfo = readInquiryStartupInfo();
			if (appStartupInfo) {
				let url_str = appStartupInfo.url;
				let hash = url_str.substring(url_str.indexOf('#'));
				const params = new URLSearchParams(hash);
				let projectFk = params.get('rfqProjectFk');
				let companyFk = params.get('rfqCompanyFk');
				if(!_.isNil(projectFk) || !_.isNil(companyFk))
				{
					radiusSearchService.getRegisterRfqDetail(projectFk, companyFk);
				}
				sidebarService.registerSidebarContainer(sidebarService.getSidebarIds().inquiry, true);
				inquiryNavInfo = appStartupInfo.navInfo;
				inquiryRequestId = inquiryNavInfo.requestid;
				inquiryModuleName = inquiryNavInfo.module;
				inquirySingleSelection = inquiryNavInfo.selection ? inquiryNavInfo.selection === 'single' : false;

				return true;
			}
			return false;
		}

		/**
		 * returns the confirm flag from api?...&confirnm=0|1....
		 * @returns {boolean}7
		 */
		function useConfirmDialog() {
			if (inquiryNavInfo && inquiryNavInfo.confirm === '1') {
				return true;
			}
			return false;
		}

		/**
		 *
		 */
		function isInquiryPending(modulename) {

			var appStartupInfo = readInquiryStartupInfo();
			return (appStartupInfo && _.isEqual(modulename, appStartupInfo.module));
		}

		/**
		 * return true if inquiry is set to active
		 * @returns {boolean}
		 */
		function isInquiryActive() {
			return (providerInfo || {}).active ? true : false;
		}

		function checkButtonVisibility() {
			return isInquiryActive();
		}

		function removeInquiryToolbarButtons($scope) {
			var itemsToRemove = ['tlb-icons ico-add-selected highlight', 'tlb-icons ico-add-all highlight'];
			$scope.removeToolByClass(itemsToRemove);
		}

		/**
		 * This function returns the inquiry toolbar buttons if the inquiry provider is set
		 * and active ( providerInfo.active = true)
		 * @param {boolean} includeAllButtons if true result array contains all button(s) as well
		 * @param {object} dataservice actually not used
		 * @returns []  returns an array array with additional toolbar button or an empty array.
		 */
		function getInquiryToolbarButtons(includeAllButtons, dataservice) {

			function getToolbarButton(dataService) { // jshint ignore:line
				var inquiryButtons = [];
				if (includeAllButtons) {
					inquiryButtons.push({
						id: 't-inquiryall',
						type: 'item',
						caption: $translate.instant('cloud.desktop.inquiry.addallselected'),
						iconClass: 'tlb-icons ico-add-all highlight',  // must be unique in whole itemList
						hide: function () {
							return checkButtonVisibility();
						},
						fn: function x() {
							if (service.onAddAllItems(true)) {
								service.onInquiryListChanged.fire();
							}
						}
					});
				}
				inquiryButtons.push({
					id: 't-inquiryselected',
					type: 'item',
					caption: $translate.instant('cloud.desktop.inquiry.addselected'),
					iconClass: 'tlb-icons ico-add-selected highlight',  // must be unique in whole itemList
					hide: function () {
						return checkButtonVisibility();
					},
					fn: function x() {
						if (service.onAddSelectedItems(true)) {
							service.onInquiryListChanged.fire();
						}
					}
				});
				return inquiryButtons;
			}

			return isInquiryActive() ? getToolbarButton(dataservice) : [];
		}

		/**
		 * This function add and remove inquiry buttons into the toolbar.
		 * requirement:
		 * there is a InquiryToolbar pending (call from external is pending)
		 *
		 * The scope parameter must contain a valid container scope with existing toolbar
		 * the will be a watch on isInquiryPending, as soon as inquiry is finished, the toolbar buttons will be removed and the
		 * watch are remove as well.
		 *
		 * @param {$scope}  the container scope holding the tools.items property
		 * @param {boolean} includeAllButtons if true result array contains all button(s) as well
		 */

		function handleInquiryToolbarButtons($scope, includeAllButtons) {
			// var inquiryService = $injector.get('cloudDesktopSidebarInquiryService');
			if (isInquiryPending() && $scope.tools.items) {
				// extend toolbar with new items, only if inquiry is active
				var newItems = getInquiryToolbarButtons(inquirySingleSelection ? false : includeAllButtons);
				$scope.setTools({
					showImages: true,
					showTitles: true,
					cssClass: 'tools',
					items: newItems
				});

				var removeWatcherFct = $scope.$watch(function () {
					return isInquiryPending();
				}, function (newValue, oldValue) { // jshint ignore:line
					if (!newValue) {
						removeInquiryToolbarButtons($scope);
						$scope.tools.update();
						removeWatcherFct();
					}
				});
			}
		}

		function disableAddInquiryItems() {
			addItemsDisabled = true;
			service.isInquiryFinished = true;
		}

		/**
		 * enable restart of inquiry without restarting whole application
		 */
		function reEnableInquiry () {
			addItemsDisabled = false;
			service.isInquiryFinished = false;
			deleteInquiryItems(null, true);
		}

		/**
		 * method closeSidebarandUnPine()
		 * closes sidebar inquiry and unpine it
		 */
		function closeSidebarandUnPine() {
			sidebarService.closeSidebar.fire(false /* unpin sidebar' */);
		}

		/**
		 * method openSidebarandPine()
		 * open sidebar inquiry and pine it
		 */
		function openSidebarandPine() {
			sidebarService.openSidebar.fire(
				sidebarService.getSidebarIdAsId(sidebarService.getSidebarIds().inquiry), true);
		}

		// sidebar messengers
		service.onInquiryListChanged = new Platform.Messenger();

		// extern service method declaration here
		service.saveInquiry = saveInquiry;
		service.getInquiredItems = getInquiredItems;

		service.isInquiryFinished = false; // used for finished indicator in sidebar

		service.canCancelInquiry = canCancelInquiry;
		service.canAddSelectedItems = canAddSelectedItems;
		service.canDeleteAll = canDeleteAll;

		service.reEnableInquiry = reEnableInquiry;
		service.getCancelInfo = getCancelInfo;
		service.addInquiryItems = addInquiryItems;
		service.cancelInquiry = cancelInquiry;
		service.deleteInquiryItems = deleteInquiryItems;
		service.getInquiryItems = getInquiryItems;
		service.getInquiryItemsCount = getInquiryItemsCount;
		service.getInquiryToolbarButtons = getInquiryToolbarButtons;
		service.checkStartupInfoforInquiry = checkStartupInfoforInquiry;
		service.registerProvider = registerProvider;
		service.clearStartupInfo = initAppService.clearStartupInfo;
		service.handleInquiryToolbarButtons = handleInquiryToolbarButtons;
		service.disableAddInquiryItems = disableAddInquiryItems;
		service.openSidebarandPine = openSidebarandPine;
		service.closeSidebarandUnPine = closeSidebarandUnPine;
		service.useConfirmDialog = useConfirmDialog;

		/**
		 * check if there is an inquiry active for the current module
		 *
		 * @memberOf cloudDesktopSidebarInquiryService
		 * @param    {string} modulename  module.submodule convention from BAS_MODULE
		 * @returns  {boolean} returns 'true' if there is a inquiry pending, else `false`.
		 * @example
		 * cloudDesktopSidebarInquiryService.isInquiryPending('boq.main')
		 */
		service.isInquiryPending = isInquiryPending;

		// mockData(service);
		return service;
	}

})(angular);

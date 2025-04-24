/**
 * Created by lja on 2015/12/22.
 * global CefSharp
 */
(function (angular) {
	'use strict';

	var moduleName = 'basics.materiallookup';

	/*jshint -W072*/// this function has too many parameters
	angular.module(moduleName).controller('basicsMateriallookupExtendApiController', [
		'$scope',
		'$translate',
		'basicsMaterialLookupExtendApiService',
		'cloudDesktopSidebarInquiryService',
		'platformModalService',
		'initApp',
		'$http',
		'$q',
		'$rootScope',
		'cloudDesktopSidebarService',
		'$templateCache',
		function ($scope,
			$translate,
			dataService,
			cloudDesktopSidebarInquiryService,
			platformModalService,
			initAppService,
			$http,
			$q,
			$rootScope,
			cloudDesktopSidebarService,
			$templateCache) {

			//todo: permission
			//platformPermissionService.hasExecute('A5AC5566D808464BA6D04EB58BB2B7FE')
			//platformPermissionService.hasRead('A5AC5566D808464BA6D04EB58BB2B7FE')
			//hasRead: can search
			//hasExecute: can select

			//for get the param in the url
			//{navInfo}
			// navInfo =
			// company: "C"
			// id: undefined
			// module: "basics.materiallookup"
			// navigate: "true"
			// operation:"inquiry"
			// requestid: "5836598a922b4a9eadbfcd487e884f45"
			// search: "Felde,"
			// selection: "single"
			//function readInquiryStartupInfo() {
			//
			//	var appStartupInfo = initAppService.getStartupInfo();
			//	if (appStartupInfo && appStartupInfo.navInfo && _.isEqual(appStartupInfo.navInfo.operation, 'inquiry')) {
			//		return appStartupInfo;
			//	}
			//	return null;
			//}

			//var info = readInquiryStartupInfo();
			//var searchText = info ? info.navInfo.search : '';
			var flag = false;
			var providerInfo = {
				active: true,
				moduleName: moduleName,
				getSelectedItemsFn: getSelectedItems,
				getResultsSetFn: getResultsSet
			};

			$scope.resultInfo = {
				show: function () {
					return cloudDesktopSidebarInquiryService.isInquiryFinished;
				},
				msg: $translate.instant('cloud.desktop.inquiry.datasendpleasewait')
			};

			cloudDesktopSidebarInquiryService.registerProvider(providerInfo);
			cloudDesktopSidebarInquiryService.activateSidebarInquiryProvider(true);
			cloudDesktopSidebarInquiryService.checkStartupInfoforInquiry(true);

			function getSelectedItems() {
				return dataService.getSelectedItems().map(getInquiryItem);
			}

			function getInquiryItem(selected) {
				return {
					id: selected.Id,
					materialId: selected.Id,
					materialPriceListFk: selected.MaterialPriceListFk,
					name: selected.Code,
					description: selected.DescriptionInfo.Translated || (selected.DescriptionInfo.Description || '')
				};
			}

			function getResultsSet() {
				return null;
			}

			function onSelectedChanged(entity) {
				entity.selected ? addInquiryItem(entity) : removeInquiryItem(entity);
				cloudDesktopSidebarInquiryService.onInquiryListChanged.fire();
			}

			/**
			 * sendPostMessage
			 * @param theMessage
			 */
			function sendPostMessage(theMessage) {
				const message = {timestamp: moment().format(), msgType: 'inquiry', data: theMessage};
				if (typeof (chrome) === 'object' && chrome.webview && typeof (chrome.webview.postMessage) === 'function') {
					chrome.webview.postMessage(JSON.stringify({
						action: 'inquiry',
						data: JSON.stringify(message)
					}));
				} else if (typeof (CefSharp) === 'object' && typeof (CefSharp.PostMessage) === 'function') {
					CefSharp.PostMessage(JSON.stringify(message));
				}
			}

			function onRowDoubleClick(entity) {
				if (flag) {
					platformModalService.showErrorBox('basics.materiallookup.dialog.multipleSubmit', 'basics.materiallookup.dialog.header');
					return;
				}
				addInquiryItem(entity);
				cloudDesktopSidebarInquiryService.disableAddInquiryItems();
				cloudDesktopSidebarInquiryService.closeSidebarandUnPine(); // rei@24.10.18 make sure sidebar is unpinned ...
				cloudDesktopSidebarInquiryService.saveInquiry().then(function () {
					flag = true;
					/* copy from sidebar-inquiry-controller.js from rei@12.7.2022
					if there is a chromium running we send the resultset via PostMessage to chromium host */
					const inquiredItems = cloudDesktopSidebarInquiryService.getInquiredItems();
					sendPostMessage(inquiredItems);
					//platformModalService.showMsgBox('basics.materiallookup.dialog.success', 'basics.materiallookup.dialog.header', 'ico-info');
					// 	platformModalService.showMsgBox('cloud.desktop.inquiry.closeinquirywindowbody', 'cloud.desktop.inquiry.closeinquirywindowheader', 'ico-info');
					// rei@19.10.18 disable, to prevent disappaering of message unregisterInquiryFromSidebar();
					unregisterInquiryFromSidebar();
					// disable inquiry sidebar save&close button after double click to save data.
					removeInquiryItem(entity);
				}, function () {
					platformModalService.showErrorBox('basics.materiallookup.dialog.error', 'basics.materiallookup.dialog.header');
				});
			}

			function addInquiryItem(selectedItem) {
				dataService.setSelected(selectedItem);
				cloudDesktopSidebarInquiryService.onAddSelectedItems(getInquiryItem(selectedItem));
			}

			function removeInquiryItem(selectedItem) {
				dataService.removeSelected(selectedItem);
				cloudDesktopSidebarInquiryService.deleteInquiryItems(selectedItem.Id);
			}

			function unregisterInquiryFromSidebar() {  // jshint ignore:line
				cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().inquiry, true);
				cloudDesktopSidebarInquiryService.clearStartupInfo();
			}

			var getTemplate = function (key) {
				var template = $templateCache.get(key + '.html');
				if (!template) {
					throw new Error('Template ' + key + ' not found');
				}
				return template;
			};

			$scope.searchViewOptions = {
				searchOptions: {
					FilterString: ''
				},
				searchService: dataService,
				onRowDoubleClick: onRowDoubleClick,
				rowButtonPanelHtml: getTemplate('rowButtonPanel'),
				initContextFilter: () => Promise.resolve(),
				getFilterByHeaderStructureSystemOption: () => false,
				multipleSelection: true,
				onSelectedChanged_redesign: onSelectedChanged,
				selectedAllOfPage: function (items, isSelected) {
					items.forEach(function (item) {
						item.selected = isSelected;
						onSelectedChanged(item);
					});
					$rootScope.safeApply();
				},
				clearSelectedItems: function () {
					// it is a necessary option but no need to clear selections in this case
				}
			};

			const superDeleteInquiryItems = cloudDesktopSidebarInquiryService.deleteInquiryItems;

			cloudDesktopSidebarInquiryService.deleteInquiryItems = (itemOrItems, all) => {
				superDeleteInquiryItems.call(cloudDesktopSidebarInquiryService, itemOrItems, all);

				if (all) {
					dataService.getSelectedItems().forEach(deselectItem);

				} else if (typeof itemOrItems === 'number') {
					const item = dataService.getSelectedItems().find(e => e.Id = itemOrItems);

					if (item) {
						deselectItem(item);
					}
				}
			};

			function deselectItem(item) {
				item.selected = false;
				dataService.removeSelected(item);
				dataService.gridRefresh();
			}

			$scope.$on('$destroy', function () {
				dataService.reset();
				cloudDesktopSidebarInquiryService.deleteInquiryItems = superDeleteInquiryItems;
			});
		}
	]);
})(angular);
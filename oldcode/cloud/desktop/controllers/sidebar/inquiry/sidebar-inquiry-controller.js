/*
	global CefSharp
 */
(function () {
	'use strict';

	/**
	 *
	 */
	function unregisterInquiryFromSidebar(sidebarService, inquiryService) {

		sidebarService.unRegisterSidebarContainer(sidebarService.getSidebarIds().inquiry, true);
		inquiryService.clearStartupInfo();
	}

	angular.module('cloud.desktop').controller('cloudDesktopInquirySidebarController', CloudDesktopInquirySidebarController);
	CloudDesktopInquirySidebarController.$inject = ['$scope', '$translate', 'platformModalService', '$templateCache', 'cloudDesktopSidebarService', 'cloudDesktopSidebarInquiryService'];

	function CloudDesktopInquirySidebarController($scope, $translate, platformModalService, $templateCache, sidebarService, inquiryService) { // jshint ignore:line

		// define sidebarinquiry
		var ctrl = this;

		// init scope
		ctrl.itemList = [];

		inquiryService.reEnableInquiry();  // rei@12.7.22 initial we clean all item, if there are some

		ctrl.itemTemplate = $templateCache.get('cloud.desktop/inquiryItem.html');
		ctrl.resultInfo = {
			show: function () {
				return inquiryService.isInquiryFinished;
			},
			msg: $translate.instant('cloud.desktop.inquiry.datasendpleasewait')
		};

		/**
		 */
		ctrl.onAddSelected = function onAddSelected() {
			if (inquiryService.onAddSelectedItems(true)) {
				ctrl.refresh(); // force refresh of UI
			}
		};

		/**
		 */
		ctrl.onAddAll = function onAddAll() {
			if (inquiryService.onAddAllItems(true)) {
				ctrl.refresh(); // force refresh of UI
			}
		};

		ctrl.canAddAll = function canAddAll() {
			return inquiryService.canAddAllItems();
		};

		ctrl.canDeleteAll = function canDeleteAll() {
			return inquiryService.canDeleteAll();
		};

		ctrl.canCancelInquiry = function canCancelInquiry() {
			return inquiryService.canCancelInquiry();
		};

		ctrl.canAddSelected = function canAddSelected() {
			return inquiryService.canAddSelectedItems();
		};

		// display overlay when this moethod returns true
		ctrl.showResultMessageAsOverlay = function showResultMessageAsOverlay() {
			return ctrl.resultInfo.show();
		};

		/**
		 */
		ctrl.onDeleteAll = function onDeleteAll() {

			platformModalService.showYesNoDialog('cloud.desktop.inquiry.deleteallquestbody', 'cloud.desktop.inquiry.deleteallquestionheader')
				.then(function (result) {
					if (result.yes) {
						inquiryService.deleteInquiryItems(null, true);
						ctrl.refresh();
					}
				});

		};

		/**
		 */
		ctrl.onCancelInquiry = function onCancelInquiry() {

			inquiryService.cancelInquiry().then(function success(/* response */) {
					/* rei@12.7.2022
						if there is a chromium running we send the resultset via PostMessage to chromium host */
					const cancelInfo = inquiryService.getCancelInfo();
					sendPostMessage(cancelInfo);
					platformModalService.showMsgBox('cloud.desktop.inquiry.closeinquirywindowbody', 'cloud.desktop.inquiry.closeinquirywindowheader', 'ico-info');
					unregisterInquiryFromSidebar(sidebarService, inquiryService);
				}
			);

		};

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

		/**
		 */
		ctrl.onSaveCloseInquiry = function onSaveCloseInquiry() {
			// ctrl.resultInfo.show = true;
			if (!inquiryService.useConfirmDialog()) {
				inquiryService.disableAddInquiryItems();
			}
			inquiryService.saveInquiry().then(function success(/* response */) {
					/* rei@12.7.2022
						if there is a chromium running we send the resultset via PostMessage to chromium host */
					const inquiredItems = inquiryService.getInquiredItems();
					sendPostMessage(inquiredItems);
					if (inquiryService.useConfirmDialog()) {
						platformModalService.showMsgBox('cloud.desktop.inquiry.closeinquirywindowbody', 'cloud.desktop.inquiry.closeinquirywindowheader', 'ico-info');
						unregisterInquiryFromSidebar(sidebarService, inquiryService);
					}
				}
			);
		};

		/**
		 */
		ctrl.canSaveCloseInquiry = function canSaveCloseInquiry() {
			return !!(!inquiryService.isInquiryFinished && (ctrl.itemList && ctrl.itemList.length > 0));
		};

		/**
		 */
		ctrl.onItemDelete = function onItemDelete(id) {
			// platformModalService.showOkDialog('single Item Delete Dialog','lösche ....')
			//	.then(function (result) {
			inquiryService.deleteInquiryItems(id);
			ctrl.refresh();
			// console.log('onItemDelete', id);
			// });
		};

		ctrl.refresh = function () {
			ctrl.itemList = inquiryService.getInquiryItems();
		};

		ctrl.refresh();

		/**
		 *
		 */
		function onInquireListChanged() {
			ctrl.refresh();
		}

		inquiryService.onInquiryListChanged.register(onInquireListChanged);

		$scope.$on('$destroy', onDestroy);

		/**
		 *
		 */
		function onDestroy() {
			inquiryService.onInquiryListChanged.unregister(onInquireListChanged);
		}

	}

})();
/**
 * Created by yew on 02/27/2025.
 */
(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonPreviewTabService', ['basicsCommonDrawingPreviewDataService', '$timeout', 'modelWdeViewerSelectionService', '$injector',
		function (basicsCommonDrawingPreviewDataService, $timeout, modelWdeViewerSelectionService, $injector) {
			const service = {
				tabs: [],
				intervalId: null,
				parentService: null
			};

			service.openTab = function openTab(url, name = '', feature = null) {
				if (name?.length < 1) {
					name = `myWindow${service.tabs.length + 1}`;
				}
				const newWindow = feature ? window.open(url, name, feature) : window.open(url, name);
				$timeout(function () {
					service.addTab(newWindow);
					// close pdfViewer when preview in browser
					if (modelWdeViewerSelectionService.selected) {
						modelWdeViewerSelectionService.clearSelection();
					}
				}, 1500);
				return newWindow;
			};

			service.addTab = function addTab(newTab) {
				if (basicsCommonDrawingPreviewDataService.openPreviewInSameTab && service.tabInUseWindow()?.name === newTab?.name) {
					return;
				}
				if (newTab) {
					const tabInfo = {id: `myWindow${service.tabs.length + 1}`, windowRef: newTab, isOpen: true};
					service.tabs.push({...tabInfo, timestamp: Date.now()});
					if (!service.intervalId) {
						checkTabStatus();
					}
				}
			};

			service.closeTab = function closeTab(tabId) {
				const index = service.tabs.findIndex(t => t.id === tabId);
				if (index > -1) service.tabs.splice(index, 1);
				if (service.tabs.length === 0 && service.intervalId) {
					clearInterval(service.intervalId);
					service.intervalId = null;
					$injector.get('basicsCommonDocumentPreview3DViewerService').previewInViewerAgain(service.parentService);
				}
			};

			service.hasTab = function hasTab() {
				return service.tabs.length > 0;
			};

			service.tabInUse = function tabInUse() {
				return service.hasTab()
					? service.tabs[service.tabs.length - 1]
					: null;
			};

			service.tabInUseWindow = function tabInUseWindow() {
				return service.tabInUse()?.windowRef;
			};

			function checkTabStatus() {
				service.intervalId = setInterval(() => {
					service.tabs.forEach(tab => {
						if (tab.windowRef && tab.windowRef.closed) {
							service.closeTab(tab.id);
						}
					});
				}, 1000);
			}

			return service;
		}]);
})(angular);
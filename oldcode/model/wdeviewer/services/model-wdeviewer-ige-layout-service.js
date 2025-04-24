(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).constant('igeConversionStatus', {
		success: 0,
		notConverted: -1,
		converting: -2,
		inConversionQueue: -3
	});

	angular.module(moduleName).factory('modelWdeViewerIgeLayoutService', ['$q', '$http', 'PlatformMessenger', 'modelWdeViewerIgeService', 'igeConversionStatus',
		function ($q, $http, PlatformMessenger, modelWdeViewerIgeService, igeConversionStatus) {
			var serverBaseUrl = globals.webApiBaseUrl + 'model/igeviewer';
			var service = {
				modelId: null,
				drawingId: null,
				views: {},
				layouts: [],
				currentLayout: null,
				currentIndex: -1,
				currentPageId: null,
				currentLayoutChanged: new PlatformMessenger(),
				currentLayoutConversionChanged: new PlatformMessenger()
			};

			service.lowerFirstChar = function (data) {
				if (_.isArray(data)) {
					return data.map(function (item) {
						return service.lowerFirstChar(item);
					});
				}

				if (_.isObject(data)) {
					var obj = {};

					_.forEach(data, function (value, key) {
						var key2 = _.lowerFirst(key);
						obj[key2] = service.lowerFirstChar(value);
					});

					return obj;
				}

				return data;
			};

			service.isLayoutConverted = function (layoutId) {
				const layout = _.find(service.layouts, {id: layoutId});
				return layout.convertResultCode >= igeConversionStatus.success;
			};

			service.convertLayout = function (layoutId) {
				const url = serverBaseUrl + '/drawing/' + service.drawingId + '/layout/' + layoutId;

				return $http.get(url).then(function (res) {
					const layout = _.find(service.layouts, {id: layoutId});

					if(layout.convertResultCode === igeConversionStatus.notConverted) {
						layout.convertResultCode = igeConversionStatus.inConversionQueue;
						layout.convertResultMessage = 'In Conversion Queue';
					}

					return res;
				});
			};

			service.retrieveViews = function (modelId, drawingId) {
				var layoutUrl = serverBaseUrl + '/drawing/' + drawingId;

				service.modelId = modelId;
				service.drawingId = drawingId;
				service.layouts = [];
				service.currentLayout = null;
				service.currentIndex = -1;

				service.clearLayoutConversionStateTimeout();

				return $http.get(layoutUrl).then(function (response) {
					let result = service.lowerFirstChar(response.data);

					service.views = result;

					if (result && result.layouts && result.layouts.length) {
						service.layouts = result.layouts;
					}

					if (service.isConverting()) {
						service.enableRefreshLayoutConversionState = true;
						service.refreshLayoutConversionState();
					}

					return service.layouts;
				});
			};

			service.isConverting = function () {
				return service.layouts.some(function (layout) {
					return layout.convertResultCode < igeConversionStatus.success; // -1 - not converted, -2 - converting
				});
			};

			service.enableRefreshLayoutConversionState = false;
			service.layoutConversionStateTimeout = null;

			service.clearLayoutConversionStateTimeout = function (){
				service.enableRefreshLayoutConversionState = false;

				if(service.layoutConversionStateTimeout) {
					clearTimeout(service.layoutConversionStateTimeout);
					service.layoutConversionStateTimeout = null;
				}
			};

			service.refreshLayoutConversionState = function () {
				service.refreshLayoutConversionStateTimeout = setTimeout(function () {
					service.layoutConversionStateTimeout = null;

					const layoutUrl = serverBaseUrl + '/drawing/' + service.drawingId;

					$http.get(layoutUrl).then(function (response) {
						let result = service.lowerFirstChar(response.data);

						service.views = result;

						if (result && result.layouts && result.layouts.length) {
							result.layouts.forEach(function (layout) {
								const layoutItem = _.find(service.layouts, {id: layout.id});
								let isCurrentLayoutConversionChanged = false;

								if (service.currentLayout) {
									isCurrentLayoutConversionChanged = service.currentLayout.id === layout.id && service.currentLayout.convertResultCode !== layout.convertResultCode;
								}

								if (layoutItem && layoutItem.convertResultCode === igeConversionStatus.inConversionQueue && layout.convertResultCode === igeConversionStatus.notConverted) {
									layout.convertResultCode = layoutItem.convertResultCode;
									layout.convertResultMessage = layoutItem.convertResultMessage;
								}

								_.extend(layoutItem, layout);

								if (isCurrentLayoutConversionChanged) {
									service.currentLayoutConversionChanged.fire();
								}
							});

							if (service.isConverting() && service.enableRefreshLayoutConversionState) {
								service.refreshLayoutConversionState();
							}
						}
					});
				}, 6000);
			};

			service.getCurrentLayout = function () {
				return service.currentLayout;
			};

			service.getCurrentLayoutId = function () {
				if(service.currentLayout) {
					return service.currentLayout.id;
				}
				return null;
			};

			service.selectLayoutById = function (layoutId) {
				if (service.currentLayout && service.currentLayout.id === layoutId) {
					return;
				}

				let layout = _.find(service.layouts, {id: layoutId});
				service.selectLayout(layout);
			};

			service.selectLayout = function (layout) {
				service.currentLayout = layout;
				service.currentIndex = service.layouts.indexOf(layout);

				if (layout) {
					modelWdeViewerIgeService.saveCurrentLayout(service.modelId, layout.id);
				}

				service.currentLayoutChanged.fire();
			};

			service.resetLayout = function () {
				service.layouts = [];
				service.currentPageId = null;
				service.currentLayout = null;
				service.currentLayoutChanged.fire();
			};

			service.first = function () {
				if (service.layouts.length) {
					return service.layouts[0];
				}
			};

			service.last = function () {
				if (service.layouts.length) {
					return service.layouts[service.layouts.length - 1];
				}
			};

			service.prev = function () {
				let index = service.currentIndex - 1;

				if (index > -1 && service.layouts.length) {
					return service.layouts[index];
				}
			};

			service.next = function () {
				let index = service.currentIndex + 1;

				if (index < service.layouts.length) {
					return service.layouts[index];
				}
			};

			service.toPage = function (pageNumber) {
				let index = pageNumber - 1;

				if (index > -1 && index < service.layouts.length) {
					return service.layouts[index];
				}

				return null;
			};

			service.goToFirst = function () {
				if (service.layouts.length) {
					service.selectLayout(service.layouts[0]);
				}
			};

			service.goToLast = function () {
				if (service.layouts.length) {
					service.selectLayout(service.layouts[service.layouts.length - 1]);
				}
			};

			service.goToPrevious = function () {
				let index = service.currentIndex - 1;

				if (index > -1 && service.layouts.length) {
					service.selectLayout(service.layouts[index]);
				}
			};

			service.goToNext = function () {
				let index = service.currentIndex + 1;

				if (index < service.layouts.length) {
					service.selectLayout(service.layouts[index]);
				}
			};

			service.goToPage = function (pageNumber) {
				var layout = service.toPage(pageNumber);

				if (layout) {
					service.selectLayout(layout);
				}
			};

			service.canFirst = function () {
				return service.layouts.length > 0 && service.currentIndex > 0;
			};

			service.canLast = function () {
				return service.layouts.length > 0 && service.currentIndex < (service.layouts.length - 1);
			};

			service.canPrevious = function () {
				return service.layouts.length > 0 && service.currentIndex > 0;
			};

			service.canNext = function () {
				return service.layouts.length > 0 && service.currentIndex < (service.layouts.length - 1);
			};

			service.getLayoutInfo = function () {
				return service.currentIndex + 1 + ' / ' + service.layouts.length;
			};

			service.getTotalInfo = function () {
				return '/ ' + service.layouts.length;
			};

			service.getCurrentPageNumber = function () {
				return service.currentIndex + 1;
			};

			service.getCurrentLayoutInfo = function () {
				return {
					drawingId: service.drawingId,
					layoutId: service.getCurrentLayoutId()
				};
			};

			service.setCurrentPageId = function (pageId) {
				service.currentPageId = pageId;
			};

			service.getCurrentPageId = function () {
				return service.currentPageId;
			};

			service.clearCurrentPageId = function () {
				service.currentPageId = null;
			};

			return service;
		}
	]);
})(angular);
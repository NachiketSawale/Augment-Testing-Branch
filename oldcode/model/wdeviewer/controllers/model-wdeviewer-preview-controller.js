/**
 * Created by wui on 7/7/2019.
 */

(function (angular) {
	/* global globals,jQuery,$,_ */
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeViewerPreviewController', [
		'$scope',
		'$timeout',
		'$stateParams', '$injector', '$http',
		'modelWdeViewerDataMode', 'modelWdeViewerMarkupService', 'modelWdeViewerMarkerService', 'basicsCommonDrawingUtilitiesService',
		'modelWdeViewerPreviewDataService', 'modelWdeViewerStatusBarService', '$translate', 'modelWdeViewerWdeService',
		function ($scope,
			$timeout,
			$stateParams, $injector, $http,
			modelWdeViewerDataMode, modelWdeViewerMarkupService, modelWdeViewerMarkerService, basicsCommonDrawingUtilitiesService,
			modelWdeViewerPreviewDataService, modelWdeViewerStatusBarService, $translate, modelWdeViewerWdeService) {
			var _wdeCtrl, _WdeConstans, docId = $stateParams.docid;

			$scope.viewerOptions = {
				// viewerId: '41bb6e657fda70ce4fc913da78e28131',
				dataMode: modelWdeViewerDataMode.doc,
				fileDocId: $stateParams.docid,
				drawMarkupTitle: $translate.instant('model.wdeviewer.marker.drawMarkup'),
				settingTitle: $translate.instant('model.wdeviewer.marker.setting'),
				docRevisionId: null,
				documentData: null,
				viewLayouts: [],
				currentViewLayout: {},
				lastViewLayout: {},
				showMarker: false,
				hidePosition: true,
				hideSidebar: true,
				showCommentSidebar: false,
				showCommentView: false,
				showMarkups: false,
				showLayers: false,
				onOffCommentView: function () {
					$scope.viewerOptions.showCommentView = !$scope.viewerOptions.showCommentView;
				},
				onWdeCreated: function (wdeInstance, wdeCtrl, WDE_CONSTANTS) {
					_wdeCtrl = wdeCtrl;
					_WdeConstans = WDE_CONSTANTS;
				}
			};
			$scope.fileInfo = {
				name: null
			};

			$scope.configDialog = function configDialog() {
				modelWdeViewerWdeService.isPreviewDocument = false;
				applyToWde(function func(wdeCtrl) {
					wdeCtrl.showViewConfigDialog();
				});
			};

			$scope.printView = function printView() {
				var wdeInstance = _wdeCtrl.getWDEInstance();
				if (wdeInstance) {
					$http.get(globals.webApiBaseUrl + 'documentsproject/revision/printbydoc?docId=' + docId).then(function callback(res) {
						res.data.pageInfo = ($scope.viewerOptions.viewLayouts.indexOf($scope.viewerOptions.currentViewLayout) + 1) + '/' + $scope.viewerOptions.viewLayouts.length;
						var printService = $injector.get('modelWdeViewerPrintingService');
						printService.isShowLegend = false;
						printService.publish(wdeInstance, res.data);
					});
				}
			};

			$scope.rotateLeft = function rotateLeft() {
				var wdeInstance = _wdeCtrl.getWDEInstance();

				if (wdeInstance) {
					wdeInstance.rotateView(Math.PI / 2);
				}
			};

			$scope.rotateRight = function rotateRight() {
				var wdeInstance = _wdeCtrl.getWDEInstance();

				if (wdeInstance) {
					wdeInstance.rotateView(-Math.PI / 2);
				}
			};

			$scope.resetView = function resetView() {
				var wdeInstance = _wdeCtrl.getWDEInstance();

				if (wdeInstance) {
					wdeInstance.resetView();

					_.forEach(modelWdeViewerMarkupService.commentMarkups, function mapMarkups(item) {
						item.isSelect = false;
						item.IsShow = false;
						modelWdeViewerMarkupService.deleteMarkupOnView(modelWdeViewerMarkupService.wdeCtrl.getWDEInstance(), item);
					});
					$scope.isAllSelect = false;
				}
			};

			$scope.zoomIn = function zoomIn() {
				var wdeInstance = _wdeCtrl.getWDEInstance();

				if (wdeInstance) {
					wdeInstance.zoomIn();
				}
			};

			$scope.zoomOut = function zoomOut() {
				var wdeInstance = _wdeCtrl.getWDEInstance();

				if (wdeInstance) {
					wdeInstance.zoomOut();
				}
			};

			$scope.toggleSidebar = function toggleSidebar(index, istoggle) {
				_wdeCtrl.toggleSidebar(index, istoggle);
			};

			$scope.markerDropdown = {
				cssClass: 'tlb-icons ico-marker-icon',
				showSVGTag: false,
				list: {
					cssClass: 'dropdown-menu dropdown-menu-right',
					items: $injector.get('modelWdeMarkerItems').Items($scope)
				}
			};
			jQuery(window).on('resize', resizeCommentView);

			function resizeCommentView() {
				var winHeight = $(window).height() - 100;
				$('#markupCommentList').css('height', winHeight);
			}

			function defaultSetting() {
				var WDESingleInstance = _wdeCtrl.getWDEInstance();
				WDESingleInstance.setMarkupLineWidth(1);
			}

			$scope.changeViewLayout = function changeViewLayout(value) {
				_wdeCtrl.setCurrentLayoutId(value.id);
				$scope.viewerOptions.lastViewLayout = $scope.viewerOptions.currentViewLayout;
			};

			var actionItemsLink = null;
			var isLoaded = false;
			var statusBarList = {
				cssClass: 'row-2-groups',
				items: [
					{align: 'left', id: 'status', toolTip: '', type: 'text', visible: true, value: 'loading'},
					{align: 'left', id: 'markups', toolTip: '', type: 'text', visible: true},
					{align: 'right', id: 'markup', toolTip: '', type: 'button', value: 'Markup', cssClass: 'control-icons ico-up', func: $scope.viewerOptions.onOffCommentView},
					{align: 'right', id: 'layout', toolTip: '', type: 'dropdown-btn', value: 'Page', iconClass: 'control-icons ico-up'},
					{align: 'right', id: 'layer', toolTip: '', type: 'button', value: 'Layer Filter', cssClass: 'control-icons ico-filter-off'}
				]
			};

			$scope.previewStatusBarLink = function previewStatusBarLink(link) {
				actionItemsLink = link;
				link.setFields(statusBarList);
			};

			function applyToWde(func) {
				$scope.$broadcast('wde.apply', func);
			}

			function showLayoutStatus() {
				applyToWde(function func(wdeCtrl) {
					var layouts = wdeCtrl.getLayouts();
					if (layouts.length < 2) {
						var layoutBar = _.find(statusBarList.items, {id: 'layout'});
						if (layoutBar) {
							layoutBar.visible = false;
						}
					}
					actionItemsLink.updateFields(statusBarList.items);
					modelWdeViewerStatusBarService.updateLayout(actionItemsLink, wdeCtrl);
				});
			}

			function showLayerStatus() {
				applyToWde(function func(wdeCtrl) {
					var layers = wdeCtrl.getLayers();
					if (layers.length < 2) {
						var layoutBar = _.find(statusBarList.items, {id: 'layer'});
						if (layoutBar) {
							layoutBar.visible = false;
						}
					}
					actionItemsLink.updateFields(statusBarList.items);
					modelWdeViewerStatusBarService.updateLayer(actionItemsLink, wdeCtrl);
				});
			}

			$scope.$on('model.wdeviewer.status', function func(e, msg) {
				actionItemsLink.updateFields([{
					id: 'status',
					value: msg
				}]);
			});
			$scope.$on('model.wdeviewer.loading', function func() {
				isLoaded = false;
				modelWdeViewerMarkupService.getDocumentPreviewData().then(function (res) {
					if (res) {
						$scope.fileInfo.name = res.config.title;
					}
				});
			});
			$scope.$on('model.wdeviewer.loaded', function func() {
				isLoaded = true;
				showLayoutStatus();
				showLayerStatus();
				defaultSetting();
				resizeCommentView();
				applyToWde(function func(ctrl) {
					modelWdeViewerMarkupService.wdeCtrl = ctrl;
				});
				$scope.isAllSelect = false;
			});

			if ($scope.docId === null || $scope.docId === '' || angular.isUndefined($scope.docId)) {
				modelWdeViewerPreviewDataService.previewById(docId).then(function callback(res) {
					$scope.docId = res.data;
				});
			}

			if ($scope.fileInfo.name === null) {
				modelWdeViewerPreviewDataService.getFileName(docId).then(function callback(res) {
					$scope.fileInfo.name = res;
				});
			}

			if ($scope.viewerOptions.docRevisionId === null) {
				modelWdeViewerPreviewDataService.getDocumentRevisionId(docId).then(function callback(res) {
					$scope.viewerOptions.docRevisionId = res.data;
					modelWdeViewerMarkupService.docId = res.data;
				});
			}

			modelWdeViewerPreviewDataService.getPreviewDocument(docId).then(function callback(res) {
				$scope.viewerOptions.documentData = res.data;
			});
		}
	]);

	angular.module(moduleName).controller('modelWdePreviewGotoController', [
		'$scope', '$stateParams', '$state', 'cloudDesktopSidebarService',
		function modelWdePreviewGotoController($scope, $stateParams, $state, cloudDesktopSidebarService) {
			var goViewUrl = globals.defaultState + '.' + $stateParams.modulename;
			$state.go(goViewUrl).then(function callback() {
				if ($stateParams.key !== null) {
					cloudDesktopSidebarService.filterSearchFromPKeys([$stateParams.key]);
				}
			});
		}]);

})(angular);
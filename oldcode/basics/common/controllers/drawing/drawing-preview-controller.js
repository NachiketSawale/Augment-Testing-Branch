/**
 * Created by wui on 12/20/2018.
 */
(function (angular) {
	'use strict';
	/* global _,jQuery,$,Module */

	angular.module('basics.common').controller('basicsCommonDrawingPreviewController', ['$scope', '$rootScope', '$timeout', 'previewArgs', '$translate',
		'modelWdeViewerDataMode', 'basicsCommonDrawingPreviewDataService', 'modelWdeViewerPreviewDataService','modelWdeViewerMarkupService','modelWdeViewerStatusBarService',
		function ($scope, $rootScope, $timeout, previewArgs, $translate,
			modelWdeViewerDataMode, basicsCommonDrawingPreviewDataService, modelWdeViewerPreviewDataService, modelWdeViewerMarkupService, modelWdeViewerStatusBarService) {
			var _igeCtrl, lineItem, measurementItems = [];

			$scope.viewerOptions = {
				dataMode: modelWdeViewerDataMode.doc,
				fileDocId: previewArgs.fileArchiveDocFk,
				drawMarkupTitle: $translate.instant('model.wdeviewer.marker.drawMarkup'),
				settingTitle: $translate.instant('model.wdeviewer.marker.setting'),
				readonly: false,
				dimensionService: null,
				getEmptyModelInfo: null,
				docRevisionId: null,
				viewLayouts: [],
				currentViewLayout: {},
				lastViewLayout: {},
				documentData: null,
				hidePosition: true,
				hideSidebar: true,
				showCommentSidebar: false,
				showCommentView: false,
				showMarkups: false,
				showLayers: false,
				moduleName: previewArgs.moduleName,
				showMarker: false,
				onOffCommentView: function () {
					$scope.isAllSelect = modelWdeViewerMarkupService.isAllSelect;
					$scope.viewerOptions.showCommentView = !$scope.viewerOptions.showCommentView;
				},
				onIgeCreated: function (igeInstance, igeCtrl) {
					_igeCtrl = igeCtrl;
				}
			};

			$scope.fileInfo = {
				name: null
			};

			$scope.onMouseEnter = function (e) {
				e.currentTarget.focus({preventScroll: true});
			};

			$scope.onMouseLeave = function (e) {
				e.currentTarget.blur();
			};

			$scope.$on('wde.apply', function (event, apply) {
				apply($scope.ctrl);
			});

			$scope.onClose = function(){
				_igeCtrl.destroy();
				$scope.$close(false);
			};
			$scope.onOk = function () {
				_igeCtrl.destroy();
				$scope.$close(true);
			};

			var actionItemsLink = null;
			var isLoaded = false;
			var statusBarList = {
				cssClass: 'row-2-groups',
				items: [
					{align: 'left', id: 'status', toolTip: '', type: 'text', visible: true, value: 'loading'},
					{align: 'left', id: 'markups', toolTip: '', type: 'text', visible: true},
					//{align: 'right', id: 'markup', toolTip: '', type: 'button', value: 'Markup', cssClass: 'control-icons ico-up', func: $scope.viewerOptions.onOffCommentView},
					{align: 'right', id: 'markup', toolTip: '', type: 'button', value: 'Markup', cssClass: 'control-icons ico-up'},
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

			function showMarkupStatus() {
				applyToWde(function func(wdeCtrl) {
					modelWdeViewerStatusBarService.updateMarkupComment(actionItemsLink, wdeCtrl);
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
				modelWdeViewerMarkupService.getDocumentPreviewData().then(function (res){
					if (res) {
						$scope.fileInfo.name = res.config.title;
					}
				});
			});
			$scope.$on('model.wdeviewer.loaded', function func() {
				isLoaded = true;
				showLayoutStatus();
				showLayerStatus();
				showMarkupStatus();
				applyToWde(function func(ctrl) {
					modelWdeViewerMarkupService.wdeCtrl = ctrl;
				});
				$scope.isAllSelect = false;
			});

			basicsCommonDrawingPreviewDataService.previewById(previewArgs.fileArchiveDocFk).then(function (res) {
				$scope.docId = res.data;
			});

			modelWdeViewerPreviewDataService.getDocumentRevisionId(previewArgs.fileArchiveDocFk).then(function (res) {
				$scope.viewerOptions.docRevisionId = res.data;
				modelWdeViewerMarkupService.docId = res.data;
			});

			modelWdeViewerPreviewDataService.getPreviewDocument(previewArgs.fileArchiveDocFk).then(function (res) {
				$scope.viewerOptions.documentData = res.data;
			});
		}
	]);

})(angular);
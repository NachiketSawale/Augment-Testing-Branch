(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).controller('modelWdeViewLayoutController', ['$scope', 'wdeCtrl', 'statusBarLink', 'layoutModelId', '$injector', 'modelWdeViewerWdeService', 'modelWdeViewerIgeService', '$http', 'modelWdeViewerSelectionService', 'modelWdeViewerIgeLayoutService',
		function modelWdeViewLayoutController($scope, wdeCtrl, statusBarLink, layoutModelId, $injector, wdeService, igeService, $http, modelWdeViewerSelectionService, modelWdeViewerIgeLayoutService) {
			$scope.layouts = wdeCtrl.getLayouts();
			var modelService = wdeService;
			if (wdeCtrl.ige) {
				modelService = igeService;
			}
			var isPdf = false;
			if (wdeCtrl && wdeCtrl.views && wdeCtrl.views.layoutDetails) {
				if (wdeCtrl.views.layoutDetails.filename && wdeCtrl.views.layoutDetails.filename.toLocaleLowerCase().endsWith('pdf')) {
					isPdf = true;
				} else if (!wdeCtrl.views.layoutDetails.filename) {
					isPdf = true;
				}
				reOrder();
			} else if (wdeCtrl && wdeCtrl.views && wdeCtrl.views.drawingDetails) {
				if (wdeCtrl.views.drawingDetails.filename && wdeCtrl.views.drawingDetails.filename.toLocaleLowerCase().endsWith('pdf')) {
					isPdf = true;
				} else if (!wdeCtrl.views.drawingDetails.filename) {
					isPdf = true;
				}
				reOrder();
			}

			function reOrder() {
				if (isPdf) {
					var orderNum = 1;
					_.forEach($scope.layouts, function (layout) {
						layout.orderNum = orderNum;
						orderNum++;
					});
				}
			}

			var modelPart = modelService.getModelPart(layoutModelId);
			if (modelPart && modelPart.settings && $scope.layouts.length > 0) {
				_.forEach($scope.layouts, function (layout) {
					layout.isEdit = false;
					var settingLayoutName = _.find(modelPart.settings.layoutNames, {id: layout.id});
					if (settingLayoutName) {
						layout.editName = settingLayoutName.editName;
					} else {
						layout.editName = wdeService.removeStartWithPage(layout.name);
					}
				});
			}
			if (modelPart && modelPart.settings && $scope.layouts.length > 0 && modelPart.settings.layoutSort && modelPart.settings.layoutSort.length > 0) {
				var newLayouts = [];
				_.forEach(modelPart.settings.layoutSort, function (id) {
					var newLayout = _.find($scope.layouts, {id: id});
					newLayouts.push(newLayout);
				});
				if (newLayouts.length === $scope.layouts.length) {
					$scope.layouts = newLayouts;
				}
				reOrder();
			}
			$scope.currentLayout = wdeCtrl.getCurrentLayout();

			$scope.changeLayoutName = function changeLayoutName(layout) {
				if (!modelPart) {
					return;
				}
				if (modelPart.settings && layout.editName !== null && !_.isUndefined(layout.editName)) {
					if (modelPart.settings.layoutNames) {
						var layoutName = _.find(modelPart.settings.layoutNames, {id: layout.id});
						if (layoutName) {
							if (layoutName.editName === layout.editName) {
								return;
							}
							layoutName.editName = layout.editName;
						} else {
							modelPart.settings.layoutNames.push({id: layout.id, editName: layout.editName});
						}
					} else {
						modelPart.settings.layoutNames = [];
						modelPart.settings.layoutNames.push({id: layout.id, editName: layout.editName});
					}
				}
				if (modelPart.config && layout.editName !== null && !_.isUndefined(layout.editName)) {
					modelPart.config.Config = JSON.stringify(modelPart.settings);
					modelService.models[layoutModelId] = modelPart;
					modelService.isLayoutNameChange = true;
				}
				if (wdeCtrl.getCurrentLayout().id === layout.id) {
					updateBarLayoutName(layout);
				}
			};
			$scope.saveLayoutName = function saveLayoutName(id, value) {
				if (!modelPart) {
					return;
				}
				if (modelPart.settings && value) {
					if (modelPart.settings.layoutNames) {
						var layoutName = _.find(modelPart.settings.layoutNames, {id: id});
						if (layoutName) {
							if (layoutName.editName === value) {
								return;
							}
							layoutName.editName = value;
						} else {
							modelPart.settings.layoutNames.push({id: id, editName: value});
						}
					} else {
						modelPart.settings.layoutNames = [];
						modelPart.settings.layoutNames.push({id: id, editName: value});
					}
				}
				if (modelPart.config && value) {
					modelPart.config.Config = JSON.stringify(modelPart.settings);
					modelService.models[layoutModelId] = modelPart;
					var object2DWebApiBaseUrl = globals.webApiBaseUrl + 'model/main/object2d/';
					$http.post(object2DWebApiBaseUrl + 'savemodelconfig', modelPart.config).then(function (res) {
						modelPart.config = res.data;
					});
				}
			};

			$scope.convert = function (layout) {
				modelWdeViewerIgeLayoutService.convertLayout(layout.id);
			};

			$scope.setEdit = function setEdit(layout) {
				layout.isEdit = !layout.isEdit;
			};

			$scope.sortHandleLayout = {
				orderChanged: function () {
					if (!modelPart) {
						return;
					}
					reOrder();
					if (modelPart.settings) {
						var igeLayoutService = $injector.get('modelWdeViewerIgeLayoutService');
						if (igeLayoutService && igeLayoutService.layouts && igeLayoutService.layouts.length > 0) {
							igeLayoutService.layouts = $scope.layouts;
							igeLayoutService.selectLayout($scope.currentLayout);
						}
						modelPart.settings.layoutSort = _.map($scope.layouts, function (item) {
							return item.id;
						});
					}
					if (modelPart.config) {
						modelPart.config.Config = JSON.stringify(modelPart.settings);
						modelService.models[layoutModelId] = modelPart;
					}
				},
				dragStart: function () {
					_.forEach($scope.layouts, function (item) {
						item.isEdit = false;
						item.isChange = true;
					});
				},
				dragEnd: function () {
					_.forEach($scope.layouts, function (item) {
						item.isChange = false;
					});
					updateBarLayoutName(wdeCtrl.getCurrentLayout());
				}
			};

			$scope.onClickLayout = function onClickLayout(layout) {
				updateBarLayoutName(layout);
				if (modelWdeViewerSelectionService.isDocumentModeEnabled()) {
					var engine = wdeCtrl.getIGEInstance();

					if (engine) {
						modelWdeViewerIgeLayoutService.setCurrentPageId(layout.id);
						wdeCtrl.setCurrentLayout(layout.id);
						engine.toPage(layout.id, '');
					}
				}
				else {
					wdeCtrl.setCurrentLayout(layout.id);
				}
				this.$close();
			};

			function updateBarLayoutName(layout) {
				var name = layout.editName;
				if (modelPart && modelPart.settings && modelPart.settings.layoutSort && modelPart.settings.layoutSort.length > 0) {
					var num = modelPart.settings.layoutSort.indexOf(layout.id) + 1;
					name = num + ': ' + layout.editName;
				}
				statusBarLink.updateFields([{
					id: 'layout',
					value: name
				}]);
			}

			$scope.close = function (success) {
				// $scope.$parent.$close(success || false);
				window.console.log(success);
				window.console.log('close');
			};
			$scope.$on('$close', function () {
				window.console.log('close2');
			});
		}
	]);

})(angular);
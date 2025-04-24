/**
 * Created by wui on 10/12/2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'model.wdeviewer';

	angular.module(moduleName).factory('modelWdeViewerSubModelFilterMenuService', ['_',
		'modelViewerModelSelectionService',
		function (_, modelViewerModelSelectionService) {
			var service = {};
			var lastSubModelId;
			var menuId = 'subModelMenu';

			service.getSubModelId = function () {
				var modelId = null;
				var selModel = modelViewerModelSelectionService.getSelectedModel();

				if (selModel) {
					if (selModel.info.isComposite && selModel.subModels && selModel.subModels.length) {
						if (selModel.subModels.some(function (sm) {
							return sm.info.modelId === lastSubModelId;
						})) {
							modelId = lastSubModelId;
						} else {
							modelId = selModel.subModels[0].info.modelId;
						}
					} else {
						modelId = selModel.info.modelId;
					}
				}

				return modelId;
			};

			service.createMenu = function (scope) {
				var selModel = modelViewerModelSelectionService.getSelectedModel();
				if (selModel) {
					if (selModel.info.isComposite) {
						var result = {
							id: menuId,
							caption: 'model.viewer.filterSubModels',
							type: 'dropdown-btn',
							iconClass: 'ico-composite-model',
							list: {
								showImages: false,
								cssClass: 'dropdown-menu-right',
								items: [
									{
										id: 'filterGroup',
										type: 'sublist',
										list: {
											cssClass: 'radio-group',
											showTitles: true,
											activeValue: scope.modelId.toString(),
											items: []
										}
									}
								]
							}
						};

						selModel.subModels.forEach(function (sm) {
							result.list.items[0].list.items.push({
								id: 'toggleSubModel' + sm.subModelId,
								sort: sm.subModelId,
								caption: sm.getNiceName(),
								type: 'radio',
								value: sm.info.modelId.toString(),
								fn: function () {
									lastSubModelId = sm.info.modelId;
									scope.modelId = sm.info.modelId;
								}
							});
						});

						return result;
					}
				}

				return null;
			};

			function retrieveRefreshItemIndex(toolItems) {
				return _.findIndex(toolItems, function (item) {
					return item.id === 'view-refresh';
				});
			}

			service.insertMenu = function (scope, toolItems) {
				var menu = service.createMenu(scope);
				if (menu) {
					var index = retrieveRefreshItemIndex(toolItems);
					toolItems.splice(index + 1, 0, menu);
				}
			};

			service.removeMenu = function (toolItems) {
				var idx = _.findIndex(toolItems, function (item) {
					return item.id === menuId;
				});
				if (idx >= 0) {
					toolItems.splice(idx, 1);
				}
			};

			return service;
		}]);

})(angular);

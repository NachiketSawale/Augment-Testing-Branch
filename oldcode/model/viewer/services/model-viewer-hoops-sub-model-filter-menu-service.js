/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.viewer.modelViewerHoopsSubModelFilterMenuService
	 * @function
	 *
	 * @description Creates a menu for individually showing or hiding sub-models in a composite model in a given HOOPS
	 *              viewer.
	 */
	angular.module('model.viewer').factory('modelViewerHoopsSubModelFilterMenuService', ['_',
		'modelViewerModelSelectionService', 'modelViewerHoopsLinkService', 'modelViewerSelectabilityService',
		function (_, modelViewerModelSelectionService, modelViewerHoopsLinkService, modelViewerSelectabilityService) {
			var service = {};

			var menuId = 'subModelMenu';

			service.createMenu = function (viewer) {
				var selModel = modelViewerModelSelectionService.getSelectedModel();
				if (selModel) {
					if (selModel.info.isComposite) {
						var mapping = viewer[modelViewerHoopsLinkService.getSubModelsMapProperty()];
						if (mapping) {
							mapping = mapping.subModelToRootNode;
							if (mapping) {
								var result = {
									id: menuId,
									caption: 'model.viewer.filterSubModels',
									type: 'dropdown-btn',
									iconClass: 'ico-composite-model',
									list: {
										showImages: false,
										cssClass: 'dropdown-menu-right',
										items: []
									}
								};

								selModel.subModels.forEach(function (sm) {
									var subModelRootNodeId = mapping[sm.subModelId];
									if (angular.isNumber(subModelRootNodeId)) {
										result.list.items.push({
											id: 'toggleSubModel' + sm.subModelId,
											sort: sm.subModelId,
											caption: sm.getNiceName(),
											type: 'check',
											value: true,
											fn: function (itemId, item) {
												viewer.model.setNodesVisibility([subModelRootNodeId], item.value);
												var selectabilityInfo = modelViewerSelectabilityService.getSelectabilityInfo(viewer);
												if (selectabilityInfo) {
													selectabilityInfo.setSubModelSuppressed(sm.subModelId, !item.value);
												}
											}
										});
									}
								});

								return result;
							}
						}
					}
				}

				return null;
			};

			function retrieveCfgItems(toolItems) {
				var cfgGroupItem = _.find(toolItems, function (item) {
					return item.id === 'cfgGroup';
				});
				if (cfgGroupItem) {
					return cfgGroupItem.list.items;
				} else {
					throw new Error('Configuration toolbar group not found.');
				}
			}

			service.insertMenu = function (viewer, toolItems) {
				var menu = service.createMenu(viewer);
				if (menu) {
					var cfgItems = retrieveCfgItems(toolItems);
					cfgItems.splice(0, 0, menu);
				}
			};

			service.removeMenu = function (toolItems) {
				var cfgItems = retrieveCfgItems(toolItems);
				var idx = _.findIndex(cfgItems, function (item) {
					return item.id === menuId;
				});
				if (idx >= 0) {
					cfgItems.splice(idx, 1);
				}
			};

			return service;
		}]);
})(angular);

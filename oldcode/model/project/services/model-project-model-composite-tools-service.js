/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name model.project.modelProjectModelCompositeToolsService
	 * @function
	 * @requires _, projectMainService, platformGridAPI, modelProjectModelDataService
	 *
	 * @description Provides the common toolbar items used by model list and detail containers related to composite
	 *              models.
	 */
	angular.module('model.project').factory('modelProjectModelCompositeToolsService', ['_', 'projectMainService',
		'platformGridAPI', 'modelProjectModelDataService',
		function (_, projectMainService, platformGridAPI, modelProjectModelDataService) {
			var service = {};

			service.patchTools = function (scope) {
				var addCompositeModelItem = (function (toolItems) {
					var addIdx = _.findIndex(toolItems, function (item) {
						return item.id === 'create';
					});

					if (addIdx < 0) {
						throw new Error('Failed to find toolbar button for creating new models.');
					}

					var addModelItem = toolItems[addIdx];
					addModelItem.caption = 'model.project.addModel';
					/*
					ALM#115119 | Models list still has a "New Record" button
					Overwriting new-record icon-class means that the item 'new record' is visible twice in the toolbar.
					Therefore the icon class is overwritten in css.
					addModelItem.iconClass = 'tlb-icons ico-add-single-model';
					 */

					var addCompositeModelItem = {
						type: 'item',
						id: 'createComposite',
						sort: 2,
						caption: 'model.project.addCompositeModel',
						fn: function () {
							platformGridAPI.grids.commitAllEdits();
							modelProjectModelDataService.createItem({
								asCompositeModel: true
							});
						},
						permission: addModelItem.permission,
						iconClass: 'tlb-icons ico-add-composite-model'
					};

					toolItems.splice(addIdx + 1, 0, addCompositeModelItem);
					return addCompositeModelItem;
				})(scope.tools.items);

				function updateActivationState() {
					addCompositeModelItem.disabled = projectMainService.getSelectedEntities().length <= 0;
					scope.tools.cssClass = 'tools model-tools';
					scope.tools.update();
				}
				updateActivationState();

				projectMainService.registerSelectionChanged(updateActivationState);

				scope.$on('$destroy', function () {
					projectMainService.unregisterSelectionChanged(updateActivationState);
				});
			};

			return service;
		}]);
})();

/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {

	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc controller
	 * @name modelProjectModelPartListController
	 * @function
	 *
	 * @description
	 * Controller for the list view of the model parts (sub-models in composite models) list
	 **/
	angular.module(moduleName).controller('modelProjectModelPartListController', ModelProjectModelPartListController);

	ModelProjectModelPartListController.$inject = ['$scope', '_', 'platformContainerControllerService', '$translate',
		'modelProjectModelPartDataService', 'modelProjectModelDataService', 'modelProjectModelSelectionDialogService',
		'platformGridAPI', 'platformModalService', 'modelViewerSubModelAlignmentService'];
	function ModelProjectModelPartListController($scope, _, platformContainerControllerService, $translate,
	                                             modelProjectModelPartDataService, modelProjectModelDataService,
	                                             modelProjectModelSelectionDialogService, platformGridAPI,
	                                             platformModalService, modelViewerSubModelAlignmentService) {

		platformContainerControllerService.initController($scope, moduleName, 'eee4bf0089af41d2ae0f4a68027b58b3');

		var addModelPartItem = _.find($scope.tools.items, function (item) {
			return item.id === 'create';
		});
		addModelPartItem.fn = function () {
			modelProjectModelSelectionDialogService.showDialog({
				dialogTitle: $translate.instant('model.project.addSubModel'),
				modelFilter: function (modelEntity) {
					if (!modelEntity.IsComposite) {
						var items = modelProjectModelPartDataService.getList();
						return !_.find(items, function (item) {
							return item.ModelPartFk === modelEntity.Id;
						});
					} else {
						return false;
					}},
				showModelVersions:true
			}).then(function (modelId) {
				if (modelId) {
					platformGridAPI.grids.commitAllEdits();
					modelProjectModelPartDataService.createSubModel({
						modelId: modelId
					}).then(function () {
						platformModalService.showMsgBox('model.project.subModelChangeInfo', 'model.project.subModelAdded', 'ico-info');
					});
				}
			});
		};

		var delModelPartItem = _.find($scope.tools.items, function (item) {
			return item.id === 'delete';
		});
		delModelPartItem.fn = function () {
			platformGridAPI.grids.commitAllEdits();
			modelProjectModelPartDataService.deleteSubModel(platformGridAPI.rows.selection({
				gridId: $scope.gridId,
				wantsArray: true
			})).then(function () {
				platformModalService.showMsgBox('model.project.subModelChangeInfo', 'model.project.subModelDeleted', 'ico-info');
			});
		};

		function updateModelSelection() {
			if (modelProjectModelPartDataService.canShowContent()) {
				$scope.showInfoOverlay = false;

				addModelPartItem.disabled = false;
				updateModelPartSelection();
			} else {
				$scope.overlayInfo = $translate.instant('model.project.noCompositeModel');
				$scope.showInfoOverlay = true;

				addModelPartItem.disabled = true;
				delModelPartItem.disabled = true;
			}
		}

		function updateModelPartSelection() {
			delModelPartItem.disabled = modelProjectModelPartDataService.getSelectedEntities().length <= 0;
		}

		updateModelSelection();

		modelProjectModelDataService.registerSelectionChanged(updateModelSelection);
		modelProjectModelPartDataService.registerSelectionChanged(updateModelPartSelection);

		modelViewerSubModelAlignmentService.integrate($scope);

		$scope.$on('$destroy', function () {
			modelProjectModelDataService.unregisterSelectionChanged(updateModelSelection);
			modelProjectModelPartDataService.unregisterSelectionChanged(updateModelPartSelection);
		});
	}
})();

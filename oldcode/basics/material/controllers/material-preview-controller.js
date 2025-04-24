(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialPreviewController
	 * @require $scope
	 * @description controller for basic material catalog
	 */
	angular.module('basics.material').controller('basicsMaterialPreviewController',
		['$scope', 'basicsMaterialPreviewService', 'basicsMaterialRecordService', 'platformFileUtilControllerFactory', '_',
			'basicsLookupdataLookupDescriptorService',
			function ($scope, previewService, basicsMaterialRecordService, platformFileUtilControllerFactory, _,
				basicsLookupdataLookupDescriptorService) {
				platformFileUtilControllerFactory.initFileController($scope, basicsMaterialRecordService, previewService);

				var addButton = _.find($scope.tools.items, {id: 't1'});
				var deleteButton = _.find($scope.tools.items, {id: 't2'});
				if (addButton) {
					addButton.disabled = function () {
						return !canEdit();
					};
				}
				if (deleteButton) {
					deleteButton.disabled = function () {
						return !canEdit();
					};
				}

				basicsMaterialRecordService.materialTempChanged.register(onMaterialTempChanged);

				$scope.$on('$destroy', function () {
					basicsMaterialRecordService.materialTempChanged.unregister(onMaterialTempChanged);
				});

				// ////////////////////////////

				function onMaterialTempChanged() {
					if (addButton) {
						addButton.disabled();
					}
					if (deleteButton) {
						deleteButton.disabled();
					}
					$scope.tools.update();
				}

				function canEdit() {
					var isEditable = true;
					var entity = basicsMaterialRecordService.getSelected();
					if (basicsMaterialRecordService.isReadonlyMaterial(entity)) {
						return false;
					}
					if (entity && entity.MaterialTempFk) {
						var tempUpdateStatuses = basicsLookupdataLookupDescriptorService.getData('materialTempUpdateStatus');
						var tempUpdateStatus = null;
						if (tempUpdateStatuses) {
							tempUpdateStatus = tempUpdateStatuses[entity.MaterialTempFk];
						}
						isEditable = !(tempUpdateStatus && tempUpdateStatus.BasBlobsFk);
					}

					return isEditable && entity;
				}
			}
		]);
})(angular);
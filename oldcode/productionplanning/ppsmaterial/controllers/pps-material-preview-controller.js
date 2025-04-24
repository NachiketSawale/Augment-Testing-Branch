(function (angular) {
	'use strict';

	/**
	 * @ngdoc controller
	 * @name productionplanning.ppsmaterial.productionplanningPpsmaterialPreviewController
	 * @require $scope
	 * @description controller for productionplanning ppsmaterial catalog
	 */
	angular.module('productionplanning.ppsmaterial').controller('productionplanningPpsmaterialPreviewController',
		['$scope', 'productionplanningPpsmaterialPreviewService', 'productionplanningPpsMaterialRecordMainService', 'platformFileUtilControllerFactory', '_',
			'basicsLookupdataLookupDescriptorService',
			function ($scope, previewService, productionplanningPpsMaterialRecordMainService, platformFileUtilControllerFactory, _, basicsLookupdataLookupDescriptorService) {
				platformFileUtilControllerFactory.initFileController($scope, productionplanningPpsMaterialRecordMainService, previewService);

				let addButton = _.find($scope.tools.items, {id: 't1'});
				let deleteButton = _.find($scope.tools.items, {id: 't2'});
				if (addButton) {
					addButton.disabled = function () {
						return !canEdit();
					};
				}
				if (deleteButton) {
					deleteButton.disabled = function () {
						return !canDelete();
					};
				}

				function canDelete(){
					let isDelete = false;
					let entity = productionplanningPpsMaterialRecordMainService.getSelected();
					if(entity && entity.BasBlobsFk !== null){
						isDelete = true;
					}
					return isDelete;
				}

				function canEdit() {
					let isEditable = true;
					let entity = productionplanningPpsMaterialRecordMainService.getSelected();
					if (entity && entity.MaterialTempFk) {
						var tempUpdateStatuses = basicsLookupdataLookupDescriptorService.getData('materialTempUpdateStatus');
						let tempUpdateStatus = null;
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
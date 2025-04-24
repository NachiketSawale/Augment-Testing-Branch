/**
 * Created by tah on 7/24/2017.
 */
(function (angular) {
	'use strict';


	/**
     * @ngdoc controller
     * @name basics.Material.basicsMaterialSpecificationPlainTextController
     * @require $scope
     * @description controller for basics material catalog
     */
	angular.module('basics.material').controller('basicsMaterialSpecificationPlainTextController',
		['$scope', '$modal',  'basicsMaterialRecordService','platformModalService','$translate', 'basicsLookupdataLookupDescriptorService',
			function ($scope, $modal, parentService,platformModalService,$translate, basicsLookupdataLookupDescriptorService) {
				$scope.getCurrentMaterial = function () {
					return parentService.getSelected().SpecificationInfo.Translated;
				};
				//

				$scope.currentItem = parentService.getSelected();
				// $scope.commitEdit = function () {
				//     if(isItemSelected()){
				//         parentService.setSpecificationAsModified($scope.currentItem);
				//     }
				// };
				$scope.dirty = function () {
					if ($scope.currentItem.length > 2000) {
						platformModalService.showDialog({
							headerTextKey: $translate.instant('SpecificationPlainTextError'),
							bodyTextKey: $translate.instant('basics.material.error.materialSpecificationPlainTextError'),
							iconClass: 'ico-info'
						});
						$scope.currentItem = parentService.getSelected().SpecificationInfo.Translated;
						return;
					}

					var descriptionInfo = parentService.getSelected().SpecificationInfo;
					descriptionInfo.Description = $scope.currentItem;
					descriptionInfo.Translated = $scope.currentItem;
					descriptionInfo.Modified = true;
					parentService.markCurrentItemAsModified();
				};
				var isItemSelected = function() {
					if(!parentService.getSelected()) {return null;}
					return parentService.getSelected().SpecificationInfo.Translated;
				};
				// $scope.rt$readonly = !parentService.getSelected() || parentService.isReadOnly;
				$scope.currentItem = isItemSelected();

				parentService.registerSelectionChanged(onSelectionChange);

				function onSelectionChange(){
					$scope.currentItem = isItemSelected();
				}

				parentService.registerListLoaded(registerSelectionClear);
				function registerSelectionClear()
				{
					$scope.currentItem = isItemSelected();
				}

				$scope.rt$readonly = readonly;

				// //////////////

				function readonly() {
					var isEditable = true;
					var entity = parentService.getSelected();
					if (parentService.isReadonlyMaterial(entity)) {
						return true;
					}
					if (entity && entity.MaterialTempFk) {
						var tempUpdateStatuses = basicsLookupdataLookupDescriptorService.getData('materialTempUpdateStatus');
						var tempUpdateStatus = null;
						if (tempUpdateStatuses) {
							tempUpdateStatus = tempUpdateStatuses[entity.MaterialTempFk];
						}
						isEditable = !(tempUpdateStatus && tempUpdateStatus.SpecificationInfo);
					}

					isEditable = isEditable && entity;

					return !isEditable;
				}
			}]);
})(angular);
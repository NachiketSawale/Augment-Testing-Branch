(function (angular) {
	'use strict';
	/* global _ */
	angular.module('basics.material').value('richTextControlBarDefinition', [
		['imageFile', 'fontName', 'fontSize', 'quote', 'bold', 'italics', 'underline',
			'redo', 'undo', 'clear', 'justifyLeft',
			'justifyCenter', 'justifyRight',
			'insertImage', 'insertLink']
	]
	);

	/**
	 * @ngdoc controller
	 * @name basics.Material.basicsMaterialPreviewController
	 * @require $scope
	 * @description controller for basics material catalog
	 */
	angular.module('basics.material').controller('basicsMaterialSpecificationController',
		['$scope', '$modal', 'richTextControlBarDefinition', 'basicsMaterialRecordService',
			'basicsLookupdataLookupDescriptorService',
			function ($scope, $modal, richTextControlBarDefinition, parentService,
				basicsLookupdataLookupDescriptorService) {
				$scope.richTextControlBar = richTextControlBarDefinition;

				$scope.getCurrentMaterial = function () {
					return parentService.getSelected();
				};

				$scope.onPropertyChanged = function () {
					parentService.markCurrentItemAsModified();
				};

				var isItemSelected = function() {
					if(!parentService.getSelected())
					{
						$scope.specification.Content=null;
						return null;
					}
					var entity = parentService.getSelected();

					return !_.isEmpty(entity);
				};

				// React on changes of the specification
				$scope.onTextChanged = function () {
					if(isItemSelected()){
						parentService.setSpecificationAsModified($scope.specification);
					}
				};

				$scope.specification = parentService.getCurrentSpecification(); // Returns a reference and not a value so it's always up-to-date !!

				$scope.editable = canEdit();

				parentService.registerListLoaded(registerSelectionClear);
				function registerSelectionClear()
				{
					$scope.editable = canEdit();
				}

				parentService.registerSelectionChanged(onSelectionChange);
				parentService.materialTempChanged.register(onMaterialTempChanged);

				function onSelectionChange(){
					$scope.editable = canEdit();
				}

				$scope.editorOptions = {};

				$scope.$on('$destroy', function () {
					parentService.materialTempChanged.unregister(onMaterialTempChanged);
				});

				// //////////////

				function canEdit() {
					var isEditable = true;
					var entity = parentService.getSelected();
					if (parentService.isReadonlyMaterial(entity)) {
						return false;
					}
					if (entity && entity.MaterialTempFk) {
						var tempUpdateStatuses = basicsLookupdataLookupDescriptorService.getData('materialTempUpdateStatus');
						var tempUpdateStatus = null;
						if (tempUpdateStatuses) {
							tempUpdateStatus = tempUpdateStatuses[entity.MaterialTempFk];
						}
						isEditable = !(tempUpdateStatus && tempUpdateStatus.BasBlobsSpecificationFk);
					}

					return isEditable && isItemSelected();
				}

				function onMaterialTempChanged() {
					$scope.editable = canEdit();
				}
			}]);
})(angular);
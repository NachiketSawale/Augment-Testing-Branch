/**
 * Created by zov on 28/04/2019.
 */
(function () {
	/*global angular, _*/
	'use strict';

	var moduleName = 'productionplanning.drawing';
	angular.module(moduleName).factory('ppsDrawingPartListInitControllerService', [
		'platformPermissionService',
		function (platformPermissionService) {
			var service = {};
			service.initController = function ($scope, mainService) {

				var isMainItemSelected = function() {
					var entity = mainService.getSelected();
					return !_.isNil(entity);
				};

				var isEditable = function() {
					var permissionUuid = $scope.getContentValue('permission');
					return !platformPermissionService.hasWrite(permissionUuid) ? false : isMainItemSelected();
				};

				var onMainItemChanged = function () {
					$scope.readonly = true || !isEditable();
				};
				mainService.registerSelectionChanged(onMainItemChanged);

				// region directive parameter
				$scope.specificationPlain = mainService.getCurrentPartList();
				$scope.addTextComplement = null;
				$scope.selectTextComplement = null;
				$scope.readonly = true || !isEditable();
				$scope.editorOptions = {
					cursorPos: {
						get: null,
						set: null      // not yet supported!
					}
				};

				$scope.onTextChanged = function () {
					if(mainService.hasSelection()){
						mainService.setPartListAsModified($scope.specificationPlain);
					}
				};

				function updatePartList(currentPartList) {
					if (currentPartList) {
						$scope.specificationPlain = currentPartList; // Set new partList object to scope
					}
				}

				mainService.currentPartListChanged.register(updatePartList);

				$scope.$on('$destroy', function () {
					mainService.currentPartListChanged.unregister(updatePartList);
					mainService.unregisterSelectionChanged(onMainItemChanged);
				});
			};

			return service;
		}
	]);
})();
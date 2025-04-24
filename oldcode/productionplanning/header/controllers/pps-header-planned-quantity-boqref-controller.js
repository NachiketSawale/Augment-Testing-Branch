/**
 * Created by zwz on 25/03/2025.
 */
(function () {
	/*global angular*/
	'use strict';

	const moduleName = 'productionplanning.header';
	angular.module(moduleName).controller('ppsHeaderPlannedQuantityBoqReferenceController', [
		'$scope',
		'platformPermissionService',
		'ppsPlannedQuantityDataServiceFactory',
		function ($scope,
			platformPermissionService,
			pqDataServiceFactory,
		) {
			const pqDataService = pqDataServiceFactory.getService({
				parentService: 'productionplanningHeaderDataService',
				parentFilter: 'PpsHeaderFk',
				serviceName: 'productionplanning.header.plannedQuantity',
				isParentPlannedQty: 'false'
			});

			// init controller
			function setScopeSpecificationPlain(pqEntity) {
				$scope.specificationPlain = {
					Content: pqEntity?.Reference ?? null,
					Id: 0,
					Version: 0
				}; // set new specificationPlain object to scope
			}

			function isEditable() {
				if (!pqDataService.hasSelection()) {
					return false;
				}
				const permissionUuid = $scope.getContentValue('permission');
				return platformPermissionService.hasWrite(permissionUuid);
			}

			function onSelectionChanged(e, entity) {
				$scope.readonly = !isEditable();
				setScopeSpecificationPlain(entity);
			}

			function onFieldReferenceChanged(entity) {
				setScopeSpecificationPlain(entity);
			}

			setScopeSpecificationPlain(pqDataService.getSelected());
			$scope.addTextComplement = null;
			$scope.selectTextComplement = null;
			$scope.editorOptions = {
				cursorPos: {
					get: null,
					set: null
				}
			};
			$scope.onTextChanged = function () {
				const selectedItem = pqDataService.getSelected();
				if (selectedItem && $scope.specificationPlain.Content !== selectedItem.Reference) {
					selectedItem.Reference = $scope.specificationPlain.Content;
					pqDataService.markItemAsModified(selectedItem);
				}
			}

			pqDataService.registerSelectionChanged(onSelectionChanged);
			pqDataService.registerFieldReferenceChanged(onFieldReferenceChanged);
			$scope.$on('$destroy', function () {
				pqDataService.unregisterSelectionChanged(onSelectionChanged);
				pqDataService.unregisterFieldReferenceChanged(onSelectionChanged);
			});
		}
	]);
})();
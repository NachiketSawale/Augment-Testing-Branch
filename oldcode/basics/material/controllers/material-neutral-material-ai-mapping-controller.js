/**
 * Created by gvj on 08.10.2018.
 */

(function (angular) {

	'use strict';

	var moduleName = 'basics.material';

	/**
	 * @ngdoc controller
	 * @name basicsMaterialNeutralMaterialAiMappingController
	 * @function
	 *
	 * @description
	 * controller for Neutral AI mapping result grid
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('basicsMaterialNeutralMaterialAiMappingController', [
		'$scope',
		'$translate',
		'platformGridAPI',
		'materialNeutralMaterialAiMappingService',
		'basicsMaterialNeutralAiDataService',
		'basicsLookupdataLookupDescriptorService',
		'basicsCharacteristicTypeHelperService',
		'basicsMaterialNeutralMaterialAiMappingStandardConfiguration',
		'basicsCommonHeaderColumnCheckboxControllerService',
		'platformSidebarWizardCommonTasksService',
		'platformModalService',
		function ($scope,
				  $translate,
				  platformGridAPI,
				  materialNeutralMaterialAiMappingService,
				  basicsMaterialNeutralAiDataService,
				  basicsLookupdataLookupDescriptorService,
				  basicsCharacteristicTypeHelperService,
				  gridColumns,
				  basicsCommonHeaderColumnCheckboxControllerService,
				  platformSidebarWizardCommonTasksService,
				  platformModalService)
		{

			$scope.isBusy = false;
			$scope.busyInfo = '';

			function busyStatusChanged(newStatus) {
				$scope.isBusy = newStatus;
			}
			materialNeutralMaterialAiMappingService.busyStatusChanged.register(busyStatusChanged);

			var _params = $scope.$parent.modalOptions.params;

			$scope.selectedItem = null;  			// selected characteristic data item (needed for watching!)

			$scope.gridId = _params.gridId;
			basicsMaterialNeutralAiDataService.attachData(_params.materialData);

			var backendOutput= {};
			backendOutput.data = materialNeutralMaterialAiMappingService.updateReadOnly(_params.materialData.Main);

			basicsLookupdataLookupDescriptorService.attachData({MaterialCatalog: _params.materialData.MaterialCatalog});
			basicsLookupdataLookupDescriptorService.attachData({MaterialGroup: _params.materialData.MaterialGroup});
			basicsLookupdataLookupDescriptorService.attachData({MaterialRecord: _params.materialData.MaterialRecord});
			
			$scope.gridData = {
				state: $scope.gridId
			};

			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					data: backendOutput.data,
					columns: angular.copy(gridColumns.getStandardConfigForListView().columns),
					id: $scope.gridId,
					lazyInit: true,
					options: {
						// the annotation below suggests the way of showing the result in a draggable structure way.
						skipPermissionCheck: true,
						// idProperty: 'Id',
						collapsed: false,
						indicator: true,
						enableDraggableGroupBy: false
					},
					enableConfigSave: false
				};
				platformGridAPI.grids.config(grid);
			}

			platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);


			var headerCheckBoxFields = ['Selected'];
			// check all the rows if click the check box button on the header.
			var headerCheckBoxEvents = [
				{
					source: 'grid',
					name: 'onHeaderCheckboxChanged',
					fn: checkAll
				}
			];
			basicsCommonHeaderColumnCheckboxControllerService.setGridId($scope.gridId);
			basicsCommonHeaderColumnCheckboxControllerService.init($scope, null, headerCheckBoxFields, headerCheckBoxEvents);

			function checkAll(e) {
				var isSelected = (e.target.checked);
				var gridData = backendOutput.data;
				if (gridData && gridData.length > 0){
					_.forEach(gridData,function (item) {
						if (item.MdcMaterialFk === item.OrigMdcMaterialFk) {
							item.IsCheckAi = false;
						} else {
							item.IsCheckAi = isSelected;
						}
					});
				}
			}

			function onSelectedRowsChanged() {
				var selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
				if (selectedItems && selectedItems.length > 0) {
					$scope.selectedItem = selectedItems[0];
					materialNeutralMaterialAiMappingService.setSelectedId($scope.selectedItem.Id);
				}
			}

			angular.extend($scope.modalOptions,{
				NeutralMaterialMapping: $translate.instant('basics.material.AI.NeutralMaterialMapping'),
				Update: $translate.instant('basics.material.AI.Update'),
				Cancel: $translate.instant('basics.material.AI.Cancel')
			});

			$scope.validateMdcMaterialFk = function (entity, value) {
				materialNeutralMaterialAiMappingService.validateMdcMaterialFk(entity, value);
				basicsCommonHeaderColumnCheckboxControllerService.checkHeaderCheckBox($scope.gridId, ['IsCheckAi']);
			};

			$scope.canUpdate = function() {
				var gridData = platformGridAPI.items.data($scope.gridId);
				return (_.findIndex(gridData, {IsCheckAi: true}) !== -1);
			};

			$scope.okClicked = function () {
				platformGridAPI.grids.commitAllEdits();
				_params.values = backendOutput.data;
				materialNeutralMaterialAiMappingService.set(_params);
				//TODO: backend might raise error when saving data into database.
				$scope.close(true);
				showAiSuccessfullyDoneMessage( 'basics.material.AI.NeutralMaterialMapping', 'basics.material.AI.MappingSuccessful');
			};

			function showAiSuccessfullyDoneMessage(title, message) {
				var modalOptions = {
					headerText: $translate.instant(title),
					bodyText: $translate.instant(message),
					iconClass: 'ico-info'
				};
				return platformModalService.showDialog(modalOptions);
			}

			$scope.close = function(success) {
				$scope.$parent.$close(success || false);
			};
			$scope.options.height = 0;

		}
	]);
})(angular);
/**
 * Created by yew on 3/11/2020.
 */

(function (angular) {
	'use strict';
	var moduleName = 'documents.project';

	angular.module(moduleName).controller('documentsProjectFileDefaultPreviewProgramController', [
		'_', '$scope', 'platformGridAPI', 'platformTranslateService', 'documentsProjectFileDefaultPreviewProgramService','$injector',
		function (_, $scope, platformGridAPI, platformTranslateService, documentsProjectFileDefaultPreviewProgramService, $injector) {
			var uuid = documentsProjectFileDefaultPreviewProgramService.gridId;
			$scope.isThisTab = documentsProjectFileDefaultPreviewProgramService.isThisTab;
			_.extend($scope, {
				gridId: uuid,
				gridData: {
					state: uuid
				},
				onOK: function () {
					$scope.$close(false);
				}
			});

			var viewerDisplayName = $injector.get('modelWdeViewerMarkupService').getViewerDisplayName();

			var columns = [
				{
					id: 'fileType',
					field: 'fileType',
					name: 'fileType',
					width: 100,
					readonly: true,
					name$tr$: 'basics.common.previewProgram.column.fileType'
				},
				{
					id: 'twoDViewer',
					field: 'twoDViewer',
					name: 'twoDViewer',
					width: 120,
					editor: 'boolean',
					formatter: 'boolean',
					validator: function (entity, value) {
						entity.systemDefault = value === false;
					},
					cssClass: 'cell-center',
					name$tr$: viewerDisplayName
				},
				{
					id: 'systemDefault',
					field: 'systemDefault',
					name: 'systemDefault',
					width: 120,
					editor: 'boolean',
					formatter: 'boolean',
					validator: function (entity, value) {
						entity.twoDViewer = value === false;
					},
					cssClass: 'cell-center',
					name$tr$: 'basics.common.previewProgram.column.systemDefault'
				},
				{
					id: 'typeList',
					field: 'typeList',
					name: 'Type List',
					width: 200,
					readonly: true,
					name$tr$: 'basics.common.previewProgram.column.typeList'
				},
			];

			platformTranslateService.translateGridConfig(columns);
			if (!platformGridAPI.grids.exist($scope.gridId)) {
				var grid = {
					columns: angular.copy(columns),
					data: [],
					id: uuid,
					lazyInit: true,
					options: {
						tree: false,
						indicator: true,
						idProperty: 'Id',
					}
				};
				platformGridAPI.grids.config(grid);
			}

			platformGridAPI.items.data($scope.gridId, $scope.modalOptions.itemList);

			$scope.previewTab = function(){
				documentsProjectFileDefaultPreviewProgramService.setPreviewTab($scope.modalOptions.itemList, $scope.isThisTab);
				platformGridAPI.items.data($scope.gridId, $scope.modalOptions.itemList);
			};
			$scope.onOK = function(){
				documentsProjectFileDefaultPreviewProgramService.setData($scope.modalOptions.itemList, $scope.isThisTab);
				updateFormTools();
				$scope.$close(false);
			};
			function updateFormTools() {
				let containerScope = $scope.$parent;
				while (containerScope && !Object.prototype.hasOwnProperty.call(containerScope, 'setTools') && !containerScope.tools) {
					containerScope = containerScope.$parent;
				}
				if (containerScope && containerScope.tools) {
					containerScope.tools.update();
				}
				$injector.get('basicsCommonDocumentPreview3DViewerService').changePreviewCaption($scope);
			}
			$scope.$on('$destroy', function () {
				platformGridAPI.grids.unregister($scope.gridId);
			});
		}
	]);

})(angular);
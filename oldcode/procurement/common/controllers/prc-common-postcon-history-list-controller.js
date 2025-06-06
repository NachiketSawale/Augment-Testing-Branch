/**
 * Created by lvy on 8/2/2019.
 */
(function (angular) {
	'use strict';

	var moduleName = 'procurement.common';
	angular.module(moduleName).controller('procurementCommonPostconHistoryController',
		['$scope', 'procurementContextService', 'platformGridControllerService', 'procurementCommonPostconHistoryDataService', 'procurementCommonPostconHistoryUIStandardService', 'basicsCommonServiceUploadExtension',
			function ($scope, moduleContext, gridControllerService, dataServiceFactory,
				gridColumns, basicsCommonServiceUploadExtension) {

				var dataService = dataServiceFactory.getService(moduleContext.getLeadingService());

				var gridConfig = {
					initCalled: true,
					columns: []
				};

				gridControllerService.initListController($scope, gridColumns, dataService, null, gridConfig);

				var tools =  [];
				tools.push({
					id: 'download',
					caption: 'basics.common.upload.button.downloadCaption',
					type: 'item',
					iconClass: 'tlb-icons ico-download',
					fn: function download() {
						dataService.downloadFiles();
					},
					disabled: function canDownload() {
						return (!dataService.canDownloadFiles)||(!dataService.canDownloadFiles());
					}
				},{
					id: 'preview',
					caption: 'basics.common.preview.button.previewCaption',
					type: 'item',
					iconClass: 'tlb-icons ico-preview-form',
					fn: function () {
						previewDocument($scope, dataService, true);
					},
					disabled: function () {
						return (!dataService.canPreview)||(!dataService.canPreview());
					}
				}
				);

				function previewDocument($scope, dataService, flg, defaultEntity) {
					if(!dataService.previewDocument){
						basicsCommonServiceUploadExtension.extendWidthPreview(dataService,{});
					}
					dataService.previewDocument($scope, flg, defaultEntity);
				}

				gridControllerService.addTools(tools);
				// for hidden bulk editor button
				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);
				// hidden delete button
				index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 'delete') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);

				function updateToolBarAndPreview(){
					previewDocument($scope, dataService, false);
					$scope.tools.update();
				}
				dataService.registerSelectionChanged(updateToolBarAndPreview);
				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(updateToolBarAndPreview);
				});

			}
		]);
})(angular);
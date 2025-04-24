/**
 * Created by lvy on 4/2/2019.
 */
(function (angular) {
	'use strict';
	var moduleName = 'procurement.rfq';

	angular.module(moduleName).controller('procurementRfqSendHistoryListController',
		['$scope', 'platformGridControllerService', 'procurementRfqSendHistoryService',
			'procurementRfqSendHistoryUIStandardService','platformContextMenuTypes','$window',
			function ($scope, gridControllerService, dataService, uiService,platformContextMenuTypes,$window) {
				var gridConfig = {initCalled: false, columns: []};
				gridControllerService.initListController($scope, uiService, dataService, null, gridConfig);

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
				}, {
					id: 'JumpLink',
					caption: 'procurement.rfq.JumpLink',
					type: 'item',
					iconClass: 'tlb-icons ico-goto',
					fn: function openInOutlook() {
						let item=dataService.getSelected();
						if (item&&item.EmailLink) {
							openEmailLink(item);
						}
					},
					disabled: function canDownload() {
						let item=dataService.getSelected();
						if (item&&item.EmailLink){
							return false;
						}
						return true;
					},
					isOnlyContext: true,
					contextAreas:[platformContextMenuTypes.gridRow.type]
				});

				gridControllerService.addTools(tools);
				// for hidden bulk editor button
				var index = 0;
				for (; index < $scope.tools.items.length; index++) {
					if ($scope.tools.items[index].id === 't14') {
						break;
					}
				}
				$scope.tools.items.splice(index, 1);

				function toolsUpdate() {
					$scope.tools.update();
				}
				function openEmailLink  (item) {
					$window.open(item['EmailLink'], '_blank');
				}
				dataService.registerSelectionChanged(toolsUpdate);
				$scope.$on('$destroy', function () {
					dataService.unregisterSelectionChanged(toolsUpdate);
				});

			}]);

})(angular);
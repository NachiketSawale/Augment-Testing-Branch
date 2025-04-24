/**
 * Created by chk on 2/22/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'documents.import';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('documentsImportJobListController', [
		'_','$scope', 'platformGridAPI',
		'platformGridControllerService',
		'documentsImportJobUiService',
		'documentImportJobDataService',
		function (_,$scope, platformGridAPI,
			platformGridControllerService,
			uiConfigService,
			dataService) {

			platformGridControllerService.initListController($scope, uiConfigService, dataService, {}, {});

			_.remove($scope.tools.items, function (item) {
				return item.id === 'create';
			});

			$scope.tools.items.splice(1, 0,
				{
					id: 't-import-task',
					sort: 10,
					caption: 'documents.import.documentImport',
					type: 'item',
					iconClass: 'tlb-icons ico-active-directory-import',
					fn: dataService.documentImport
				},
				{
					id: 't-delete-all',
					sort: 11,
					caption: 'documents.import.deleteAllReImportTask',
					type: 'item',
					iconClass: 'tlb-icons ico-delete-all',
					fn: deleteUselessTask
				},
				{
					id: 't-delete-one',
					sort: 12,
					caption: 'documents.import.deleteOne',
					type: 'item',
					iconClass: 'tlb-icons ico-delete',
					fn: deleteOneTask
				});

			var refresher = refreshProgress();

			function deleteUselessTask() {
				var ids = _.map(platformGridAPI.rows.getRows($scope.gridId), 'Id');
				platformGridAPI.items.data($scope.gridId, []);
				dataService.deleteOutUselessTask(ids);
			}

			function deleteOneTask() {
				var ids = _.map([dataService.getSelected()], 'Id');
				platformGridAPI.rows.delete($scope);
				var rows = platformGridAPI.rows.getRows($scope.gridId);
				dataService.setSelected(rows[0], rows);
				dataService.deleteOutUselessTask(ids);
			}

			function refreshProgress() {
				var refresh = function () {
					dataService.refreshProgress().then(refresh);
				};

				refresh();

				return {
					destroy: function () {
						refresh = angular.noop;
					}
				};
			}

			function refreshJobListData(dataList, needLazyLoad) {

				var rows = platformGridAPI.rows.getRows($scope.gridId);
				if (_.isArray(dataList)) {
					if (needLazyLoad) {
						platformGridAPI.items.data($scope.gridId, dataList);
					} else {
						if (rows.length !== dataList.length || !angular.equals(dataList, rows)) {
							platformGridAPI.items.data($scope.gridId, dataList);
						}
					}
					dataService.Items = dataList;
				} else {
					rows.unshift(dataList);
					platformGridAPI.items.data($scope.gridId, rows);
					dataService.Items = rows;
				}
				var newRows = platformGridAPI.rows.getRows($scope.gridId);
				if (newRows.length) {
					dataService.setSelected(newRows[0], newRows);
					platformGridAPI.rows.selection({
						gridId: $scope.gridId,
						rows: [newRows[0]]
					});
				}
			}

			dataService.refreshData.register(refreshJobListData);

			dataService.initServiceItems();

			$scope.$on('$destroy', function () {
				refresher.destroy();
				dataService.refreshData.unregister(refreshJobListData);
				dataService.clearItems();
			});
		}
	]);
})(angular);
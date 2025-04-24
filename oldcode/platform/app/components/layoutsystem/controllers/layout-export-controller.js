/*
 * $Id$
 * Copyright (c) RIB Software GmbH
 */

(function (angular) {
	'use strict';

	function LayoutExportController($scope, platformTranslateService, platformPermissionService, $translate, mainViewService, permissions, platformModalService, platformGridAPI, platformCustomTranslateService) {
		var gridColumns = [
			{
				id: 'export',
				formatter: 'boolean',
				name: 'Selected',
				name$tr$: 'cloud.desktop.layoutExport.selected',
				field: 'export',
				width: 70,
				editor: 'boolean',
				focusable: true
			},
			{
				id: 'layoutType',
				formatter: 'description',
				name: 'Type',
				name$tr$: 'cloud.desktop.layoutExport.type',
				field: 'type',
				width: 100,
				focusable: true
			},
			{
				id: 'layoutName',
				formatter: 'description',
				name: 'Name',
				name$tr$: 'cloud.desktop.layoutExport.name',
				field: 'description',
				width: 270,
				sortable: true
			}
		];
		$scope.gridId = 'layoutExportGrid';
		$scope.gridData = {
			state: 'layoutExportGrid'
		};

		const tabViews = _.filter(mainViewService.getViewsForTab(), (view) => {
			return view.Description !== null;
		});
		const views = [];

		for (let i = 0; i < tabViews.length; i++) {
			views.push({
				id: tabViews[i].Id,
				description: tabViews[i].Description,
				type: tabViews[i].Issystem ? 'System' : tabViews[i].FrmAccessroleFk ? 'Role' : 'User',
				export: false
			});
		}

		platformTranslateService.translateGridConfig(gridColumns);

		if (!platformGridAPI.grids.exist($scope.gridId)) {
			const grid = {
				data: views,
				columns: angular.copy(gridColumns),
				id: $scope.gridId,
				options: {
					tree: false, indicator: true, allowRowDrag: false, idProperty: 'id'
				},
				lazyInit: true,
				isStaticGrid: true
			};
			platformGridAPI.grids.config(grid);
			platformGridAPI.items.data($scope.gridId, views);

			platformGridAPI.events.register($scope.gridId, 'onInitialized', function () {
				platformGridAPI.columns.setGrouping($scope.gridId, [{
					ascending: true,
					columnId: 'layoutType',
					getter: 'type',
					aggregateCollapsed: true
				}], false, true, 120);
			});

		} else {
			platformGridAPI.columns.configuration($scope.gridId, angular.copy(gridColumns));
		}

		const exportButton = $scope.dialog.getButtonById('export');
		exportButton.disabled =  () => {
			return _.filter(views, {export: true}).length === 0;
		};

		exportButton.fn = function () {
			const items = _.filter(platformGridAPI.items.data($scope.gridId), {export: true});

			if (items.length) {
				var promises = []
				for (let i = 0; i < items.length; i++) {
					let translationKey = platformCustomTranslateService.getTranslationPrefix() + '.views.' + items[i].id + '.Description'
					promises.push(platformCustomTranslateService.getTranslations(translationKey).then(function(trans){
						items[i].translations = trans.data;
					}));
				}
				const allPromise = Promise.all(promises);
				allPromise.then(function(){
					mainViewService.exportviews(items);
				});


				$scope.$close('export');
			}
		};

		$scope.$on('$destroy', function () {
			if (platformGridAPI.grids.exist($scope.gridId)) {
				platformGridAPI.grids.unregister($scope.gridId);
			}
		});
	}

	LayoutExportController.$inject = ['$scope', 'platformTranslateService', 'platformPermissionService', '$translate', 'mainViewService', 'permissions', 'platformModalService', 'platformGridAPI', 'platformCustomTranslateService'];

	angular.module('platform').controller('layoutExportController', LayoutExportController);

})(angular);
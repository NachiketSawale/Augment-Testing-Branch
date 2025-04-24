(function(angular) {
	'use strict';
	/* global globals, angular */
	const moduleName = 'productionplanning.formulaconfiguration';

	angular.module(moduleName).controller('ppsFormulaVersionListController', ListController);

	ListController.$inject = ['$scope', '$injector', 'platformContainerControllerService', 'platformTranslateService',
		'ppsFormulaVersionUIStandardService', 'basicsCommonToolbarExtensionService', '$rootScope', 'platformGridAPI', 'ppsFormulaVersionDataService'];

	function ListController($scope, $injector, platformContainerControllerService, platformTranslateService,
		uiStandardService, basicsCommonToolbarExtensionService, $rootScope, platformGridAPI, ppsFormulaVersionDataService) {

		platformTranslateService.translateGridConfig(uiStandardService.getStandardConfigForListView().columns);
		const containerUUid = $scope.getContentValue('uuid');
		platformContainerControllerService.initController($scope, moduleName, containerUUid);

		basicsCommonToolbarExtensionService.insertBefore($scope, [{
			id: 'changeStatus',
			sort: 1,
			caption: 'productionplanning.formulaconfiguration.version.changeStatus',
			type: 'item',
			iconClass: 'tlb-icons ico-change-status',
			fn: function () {
				// make sure the script is valid before released.
				const script = ppsFormulaVersionDataService.getSelected().ClobToSave.Content;
				const errors = $injector.get('ppsFormulaScriptDataService').validateScript(script, false);
				if (errors.length > 0) {
					return;
				}
				$rootScope.$emit('before-save-entity-data');
				platformGridAPI.grids.commitAllEdits();
				ppsFormulaVersionDataService.parentService().update().then(function () {
					ppsFormulaVersionDataService.changeStatus().then(function (result) {
						let selected = ppsFormulaVersionDataService.getSelected();
						platformGridAPI.items.data($scope.gridId, result.data);
						if (selected) {
							platformGridAPI.rows.selection({
								gridId: $scope.gridId,
								rows: angular.isArray(selected) ? selected : [selected]
							});
						}
					});
					return $rootScope.$emit('after-save-entity-data');
				});
			},
			disabled: function () {
				return !ppsFormulaVersionDataService.getSelected();
			}
		}, {
			id: 'copy',
			sort: 2,
			caption: 'productionplanning.formulaconfiguration.version.copyVersion',
			type: 'item',
			iconClass: 'tlb-icons ico-workflow-copy-version',
			fn: function () {
				const selected = ppsFormulaVersionDataService.getSelected();
				ppsFormulaVersionDataService.copyVersion(selected).then(response => {
					if (response && response.data) {
						var items = ppsFormulaVersionDataService.getList();
						items.push(response.data);
						var versionGridId  = '7d65f3bd54224873bef7ef881eeab365';
						platformGridAPI.rows.add({gridId: versionGridId, item: response.data});
						ppsFormulaVersionDataService.setSelected(response.data);
					}
				});
			},
			disabled: function () {
				return !ppsFormulaVersionDataService.getSelected();
			}
		}]);
	}

})(angular);
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc controller
	 * @name estimateMainColumnConfigDetailTranslationController
	 * @function
	 *
	 * @description
	 * Controller for the grid view of language translations
	 **/
	angular.module(moduleName).controller('estimateMainColumnConfigDetailTranslationController',
		['$scope', '$injector', 'cloudCommonLanguageService', 'platformGridAPI', '$timeout',
			'cloudCommonLanguageService',
			'cloudCommonLanguageGridConfig',
			function ($scope, $injector, theService, platformGridAPI, $timeout,
				cloudCommonLanguageService,
				cloudCommonLanguageGridConfig) {

				let gridId = '5A74FFA51D4E4A46971F72402F20D3EA';

				$scope.getContainerUUID = function () {
					return gridId;
				};


				function getCellEditable() {
					let isEditConfigure = false;
					let isCustomizeModule = false;

					try {
						isEditConfigure = $injector.get('estimateMainEstColumnConfigDataService').detailGridIsEditable();
						isCustomizeModule = $injector.get('estimateMainDialogProcessService').getDialogConfig().editType!=='estimate';
					} catch (e) {
						isEditConfigure = true;
					}
					return (isEditConfigure || isCustomizeModule);
				}

				function getConfigColumns(){
					let columns = angular.copy(cloudCommonLanguageGridConfig);
					let isCellReadOnly = getCellEditable();
					_.each(columns ,function(column){
						column.readonly = !isCellReadOnly;
					});
					return columns;
				}

				function configGrid() {
					let grid = {
						data: cloudCommonLanguageService.getItems(),
						columns: getConfigColumns(),
						id: gridId,
						options: {
							tree: false,
							skipPermissionCheck: true, // skip the permission for now
							indicator: true
						}
					};
					platformGridAPI.grids.config(grid);
				}

				function onCellEditable() {
					return getCellEditable();
				}

				configGrid();

				platformGridAPI.events.register(gridId, 'onBeforeEditCell', onCellEditable);

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister(gridId, 'onBeforeEditCell', onCellEditable);
				});

			}
		]);
})();

(function () {
	'use strict';
	angular.module('platform').service('platformMatrixControllerService', PlatformMatrixControllerService);

	PlatformMatrixControllerService.$inject = ['platformGridControllerService', 'platformGridAPI', 'platformGridDomainService', 'platformModalService', '$rootScope', 'mainViewService', '$translate'];

	function PlatformMatrixControllerService(platformGridControllerService, platformGridAPI, platformGridDomainService, platformModalService, $rootScope, mainViewService, $translate) {
		var self = this;
		self.initMatrixController = function initMatrixController($scope, matrixService, matrixServiceConfig) { // jshint ignore:line

			$scope.loadingText = $translate.instant('platform.generatingMatrix');

			var matrixGridConfig = {
				headerRow: matrixService.gridConfig.getHeaderRow(),
				initCalled: false,
				parentProp: 'parent',
				childProp: 'children',
				columns: [],
				passThrough: {
					rowHeight: matrixService.gridConfig.gridConfig.rowHeight,
					showHeaderRow: true
				}
			};

			self.createRenderMatrixHeaderRow = function createRenderMatrixHeaderRow(matrixServ) {
				return function renderMatrixHeaderRow(args) {
					var headerEntry = matrixServ.gridConfig.getHeaderRowEntry(args.column.field);
					if (headerEntry.hasActions && headerEntry.actionList.length > 0) {
						var rotateCSS = args.column.expanded ? 'rotate-270' : 'rotate-90';
						var entry = platformGridDomainService.getActionButton(headerEntry);
						$(entry).addClass(rotateCSS).appendTo(args.node);
					}
				};
			};

			matrixGridConfig.passThrough.renderHeaderRow = self.createRenderMatrixHeaderRow(matrixService);

			self.updateColumnVisibility = function updateMatrixColumnVisibility() {
				if ($scope.gridId) {
					platformGridAPI.columns.configuration($scope.gridId, matrixService.gridConfig.gridConfig.columns, true);
				}
			};

			self.adjustMatrixConfiguration = function adjustMatrixConfiguration() {
				if ($scope.gridId) {
					if (platformGridAPI.grids.exist($scope.gridId)) {
						matrixGridConfig.headerRow = matrixService.gridConfig.getHeaderRow();
						platformGridAPI.columns.configuration($scope.gridId, matrixService.gridConfig.gridConfig.columns, true);
						platformGridAPI.items.data($scope.gridId, matrixService.data.getTree());
					}
				}
			};

			function onRowCountChanged() {
				if (matrixService.data) {
					_.forEach(matrixService.data.updateDataOnRowCountChanged(), function (mod) {
						platformGridAPI.rows.refreshRow({gridId: $scope.gridId, item: mod});
					});
				}
			}

			function refreshGrid() {
				platformGridAPI.grids.refresh($scope.gridId, true);
				resizeGrid();
			}

			self.resizeGrid = resizeGrid;

			function resizeGrid() {
				platformGridAPI.grids.resize($scope.gridId);
			}

			platformGridControllerService.initListController($scope, matrixService.gridConfig, matrixService.data, matrixService.validation, matrixGridConfig);

			matrixService.registerController(self, matrixService);

			platformGridAPI.events.register($scope.gridId, 'onRowCountChanged', onRowCountChanged);

			function showMatrixConfigDialog() {
				// var content = matrixService.data.getMatrixContent();
				var modalOptions = {
					headerTextKey: 'platform.bulkEditor.matrixSettingsDialogHeader',
					showCancelButton: true,
					showOkButton: true,
					width: '900px',
					windowClass: 'body-flex-column',
					bodyTemplateUrl: globals.appBaseUrl + 'basics.common/templates/basics-common-matrix-profile-settings.html'
				};

				matrixService.dialogConfigService.refresh().then(function load() {
					var data = matrixService.dialogConfigService.getList()[0];
					matrixService.getContentService(matrixServiceConfig).then(function load() {
						matrixService.dialogConfigService.setSelected(data).then(function load() {
							platformModalService.showDialog(modalOptions).then(function (result) {
								if (result.ok) {
									matrixService.dialogConfigService.update().then(function () {
										matrixService.dialogConfigService.deselect().then(function () {
											$rootScope.$emit('configUpdated');
										});
									});
								}
							}, function () {
								matrixService.dialogConfigService.refresh();
							});
						});
					});

				});
			}

			var toolbarItems = [
				{
					id: 't111',
					sort: 111,
					caption: 'basics.common.matrixSettingsDialogHeader',
					iconClass: 'tlb-icons ico-settings',
					type: 'item',
					fn: showMatrixConfigDialog
				}
			];

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: toolbarItems
			});

			function unregister() {
				platformGridAPI.events.unregister($scope.gridId, 'onRowCountChanged', onRowCountChanged);
				platformGridAPI.grids.unregister($scope.gridId);
				matrixService.deregisterController(self, matrixService);
				matrixService.destroyInstance(matrixService);
			}

			self.unregister = unregister;

			$scope.$on('$destroy', unregister);

			matrixService.loadColumns().then(function loadColumns() {
				refreshGrid();
			});
		};
	}
})();

(function () {
	/* global _, globals */
	'use strict';

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 * @description
	 **/
	angular.module('boq.wic').controller('boqWicCrbNpkCopyrightController', ['$scope', 'platformContextService',
		function ($scope, platformContextService) {
			var language = platformContextService.getLanguage();
			$scope.image = 'Cloud.Style/content/images/crb-copyright/CRB_Dialogbox_' + (language === 'fr' ? 'F' : language === 'it' ? 'I' : 'D') + '_NPK.gif';
		}
	]);

	/**
	 * @ngdoc controller
	 * @name
	 * @function
	 * @description
	 **/
	angular.module('boq.wic').controller('boqWicCrbNpkImportController', ['$scope', '$http', '$injector', 'platformGridAPI', 'platformDialogService', '$translate', 'platformTranslateService', 'boqWicCatBoqService',
		function ($scope, $http, $injector, platformGridAPI, platformDialogService, $translate, platformTranslateService, boqWicCatBoqService) {
			var leftGridSelection;
			var rightGridSelections;
			var remainigImports;
			var selectedNpkChapterNumber;
			var selectedNpkVersion;
			var baseRoute = globals.webApiBaseUrl + 'boq/main/crb/';

			// Inits the combo boxes
			$scope.groupOptions =
				{
					items: [{id: 'k', name: $translate.instant('boq.main.npkChapter')}, {id: 'v', name: $translate.instant('boq.main.npkVersion')}],
					valueMember: 'id',
					displayMember: 'name'
				};
			$scope.selectedGroup = 'k';

			// Inits the grids
			var versionColumns = [{id: 'c', field: 'c', name$tr$: 'boq.main.npkVersion', width: 85}, {id: 'd', field: 'd', name$tr$: 'boq.main.npkYear', width: 85}, {id: 'x', field: 'x', name$tr$: 'boq.main.npkStand', width: 85}];
			var chapterColumns = [{id: 'c', field: 'c', name$tr$: 'boq.main.Reference', width: 80}, {id: 'd', field: 'd', name$tr$: 'boq.main.Brief', width: 170}];
			platformTranslateService.translateGridConfig(versionColumns);
			platformTranslateService.translateGridConfig(chapterColumns);
			$scope.leftGridId = '00274750E0AE4B77986BE16011EF6348';
			$scope.leftGridData = {state: $scope.leftGridId};
			platformGridAPI.grids.config({id: $scope.leftGridId, options: {idProperty: 'c', multiSelect: false}});
			platformGridAPI.events.register($scope.leftGridId, 'onInitialized', onLeftGridInitialized);
			function onLeftGridInitialized() {
				updateLeftGrid();
			}
			platformGridAPI.events.register($scope.leftGridId, 'onSelectedRowsChanged', onSelectedRowChanged);
			$scope.rightGridId = 'B88C91D9BF2C4C7985AE60C13773B623';
			$scope.rightGridData = {state: $scope.rightGridId};
			platformGridAPI.grids.config({id: $scope.rightGridId, options: {idProperty: 'c', multiSelect: true}, columns: versionColumns});

			var okButton = $scope.dialog.getButtonById('ok');
			okButton.disabled = function () {
				return platformGridAPI.rows.selection({gridId: $scope.rightGridId, wantsArray: true}).length === 0;
			};
			okButton.fn = function () {
				$scope.$close({ok: true});

				// Starts the import
				leftGridSelection = platformGridAPI.rows.selection({gridId: $scope.leftGridId});
				rightGridSelections = platformGridAPI.rows.selection({gridId: $scope.rightGridId, wantsArray: true});
				remainigImports = rightGridSelections.length;
				_.forEach(rightGridSelections, function (rightGridSelection) {
					if ($scope.selectedGroup === 'k') {
						selectedNpkChapterNumber = leftGridSelection;
						selectedNpkVersion = rightGridSelection;
					} else {
						selectedNpkChapterNumber = rightGridSelection;
						selectedNpkVersion = leftGridSelection;
					}

					$http.post(globals.webApiBaseUrl + 'boq/wic/boq/importcrbnpk', {
						WicGroupId: $scope.dialog.modalOptions.selectedWicGroupId,
						NpkChapterNumber: selectedNpkChapterNumber.c,
						NpkVersion: selectedNpkVersion.c
					})
						.then(function (response) {
							boqWicCatBoqService.addWicCatBoq(response.data);

							if (--remainigImports === 0) {
								platformDialogService.showDialog({
									headerTextKey: 'boq.main.npkImport',
									iconClass: 'ico-info',
									bodyText: $translate.instant('boq.main.importSucceeded'),
									showOkButton: true
								});
							}
						});
				});
			};

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.leftGridId, 'onSelectedRowsChanged', onSelectedRowChanged);
				platformGridAPI.grids.unregister($scope.leftGridId);
				platformGridAPI.grids.unregister($scope.rightGridId);

				$injector.get('boqMainCrbLicenseService').logoutLicenseService();
			});

			function updateLeftGrid() {
				var service = baseRoute;
				var leftGridColumns;

				if ($scope.selectedGroup === 'k') {
					leftGridColumns = chapterColumns;
					service += 'npkchapters';
				} else {
					leftGridColumns = versionColumns;
					service += 'npkversionyears';
				}

				platformGridAPI.columns.configuration($scope.leftGridId, leftGridColumns);

				$http.get(service).then(function (response) {
					platformGridAPI.items.data($scope.leftGridId, response.data);
					platformGridAPI.grids.resize($scope.leftGridId);
					platformGridAPI.grids.resize($scope.rightGridId);
				});
			}

			$scope.onSelectedOptionChanged = function () {
				updateLeftGrid();

				platformGridAPI.columns.configuration($scope.rightGridId, $scope.selectedGroup === 'k' ? versionColumns : chapterColumns); // reconfigures the right grid
			};

			function onSelectedRowChanged() {
				var service = baseRoute;
				var selectedRow = platformGridAPI.rows.selection({gridId: $scope.leftGridId});

				if (selectedRow === undefined) {
					platformGridAPI.items.data($scope.rightGridId, []);
				} else {
					service += ($scope.selectedGroup === 'k' ? 'npkversions?chapter=' : 'npkchaptersforyear?year=') + selectedRow.c;
					$http.get(service).then(function (response) {
						platformGridAPI.items.data($scope.rightGridId, response.data);
					});
				}
				platformGridAPI.grids.resize($scope.rightGridId);
			}
		}
	]);
})();

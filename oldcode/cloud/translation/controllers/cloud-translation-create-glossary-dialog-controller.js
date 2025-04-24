/**
 * Created by aljami on 24.08.2020.
 */
(function (angular) {

	'use strict';
	const moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name cloudTranslationImportPreviewDialogController
	 * @function
	 *
	 * @description
	 * Controller for the language selection dialog before import
	 **/
	angular.module(moduleName).controller('cloudTranslationCreateGlossaryDialogController', cloudTranslationCreateGlossaryDialogController);

	cloudTranslationCreateGlossaryDialogController.$inject = ['$scope', '$timeout', '$translate', '_', 'platformGridAPI', 'cloudTranslationWizardService', 'platformTranslateService', 'cloudTranslationImportExportService', 'cloudDesktopInfoService', 'cloudTranslationResourceDataService', 'cloudTranslationGlossaryService'];

	function cloudTranslationCreateGlossaryDialogController($scope, $timeout, $translate, _, platformGridAPI, cloudTranslationWizardService, platformTranslateService, cloudTranslationImportExportService, cloudDesktopInfoService, resourceDataService, glossaryService) {


		/*
		* converts response from server into a grid usable format
		* */
		function convertToGridData(dataArray) {
			const gridData = _.map(dataArray, function (el) {
				const temp = {};
				temp.Id = el.Id;
				temp.ResourceTerm = el.ResourceTerm;
				temp.ResourceKey = el.ResourceKey;
				temp.Remark = el.Remark;
				return temp;
			});

			return gridData;
		}

		/*
		* gets the grid columns for glossary grid
		* */
		function getGridColumns() {
			const columnWidth = 150;
			const gridColumns = [];
			gridColumns.push({
				Id: 'Id',
				sortable: false,
				name: 'Id',
				name$tr$: 'cloud.translation.previewdlg.id',
				field: 'Id',
				width: 60
			});
			gridColumns.push({
				Id: 'ResourceTerm',
				sortable: false,
				name$tr$: 'cloud.translation.resourceterm',
				field: 'ResourceTerm',
				width: columnWidth
			});
			gridColumns.push({
				Id: 'ResourceKey',
				sortable: false,
				name$tr$: 'cloud.translation.resourcekey',
				field: 'ResourceKey',
				width: columnWidth
			});
			gridColumns.push({
				Id: 'Remark',
				sortable: false,
				name$tr$: 'cloud.common.entityRemark',
				field: 'Remark',
				width: columnWidth
			});
			return gridColumns;
		}

		//---------------------------------------------
		// ------------button defs----------------------
		//---------------------------------------------

		const hasNoExistingGlossarySelected = function () {
			const options = {
				gridId: $scope.gridId,
				wantsArray: true
			};
			const selected = platformGridAPI.rows.selection(options);
			if (!selected) {
				return true;
			}
			return selected.length === 0;
		};

		const isButtonDisabled = function (/* info */) {
			return $scope.loading;
		};

		const onCancelClicked = function (event, info) {
			info.$close({cancel: true});
		};

		const cancelBtn = {
			id: 'cancel',
			caption: $translate.instant('cloud.translation.previewdlg.buttons.cancel'),
			fn: onCancelClicked
		};

		const createNewBtn = {
			id: 'create_new',
			caption: $translate.instant('cloud.translation.glossarydlg.makeGlossaryHeader'),
			fn: function ($event, info) {
				info.$close({create: true});
			},
			disabled: isButtonDisabled
		};

		const yesBtn = {
			id: 'yes',
			caption: $translate.instant('cloud.translation.glossarydlg.yes'),
			fn: function ($event, info) {
				info.$close({create: true});
			},
			disabled: isButtonDisabled
		};

		function assignResourceToSelectedGlossary() {
			const options = {
				gridId: $scope.gridId,
				wantsArray: true
			};
			const selectedGlossaries = platformGridAPI.rows.selection(options);
			if (selectedGlossaries.length > 0) {
				const selectedResource = resourceDataService.getSelected();
				selectedResource.ResourceFk = selectedGlossaries[0].Id;
				resourceDataService.markItemAsModified(selectedResource);
			}
		}

		const assignBtn = {
			id: 'assign',
			caption: $translate.instant('cloud.translation.glossarydlg.assignToGlossary'),
			cssClass: 'highlight',
			fn: function ($event, info) {
				assignResourceToSelectedGlossary();
				info.$close({assign: true});
			},
			disabled: hasNoExistingGlossarySelected
		};

		// ---------------end button defs--------------------


		function initializeScopeVariables() {
			$scope.dialog.buttons = [];
			$scope.dialog.customButtons = [];
			$scope.loading = true;
			$scope.gridColums = [];
			$scope.data = [];
			$scope.gridId = 'glossary-dialog';
			$scope.gridData = {
				state: $scope.gridId
			};
			$scope.infoText = '';
			$scope.loadingMessage = '';
			$scope.showGrid = false;
			$scope.loadingMessage = $translate.instant('cloud.translation.glossarydlg.loadingMsg');
		}

		function initializeGrid() {
			const grid = {
				data: $scope.data,
				columns: $scope.gridColums,
				id: $scope.gridId,
				options: {
					tree: false,
					indicator: true,
					enableDraggableGroupBy: false,
					enableConfigSave: false,
					enableColumnReorder: false,
					idProperty: 'Id'
				}

			};
			platformGridAPI.grids.config(grid);
		}

		function selectFirstGlossary() {
			const options = {
				item: [0],
				gridId: $scope.gridId,
				forceEdit: false
			};
			platformGridAPI.cells.selection(options);
		}

		function refreshGrid() {
			$timeout(function () {
				platformTranslateService.translateGridConfig($scope.gridColums);
				platformGridAPI.columns.configuration($scope.gridId, $scope.gridColums);
				platformGridAPI.items.data($scope.gridId, $scope.data);
				$timeout(function () {
					selectFirstGlossary();
					platformGridAPI.grids.invalidate($scope.gridId);
				});
			},200);
		}

		function prepareDialogForGlossaryCreate() {
			$scope.showGrid = false; // removes the glossary list grid
			$scope.infoText = $translate.instant('cloud.translation.glossarydlg.confirmationText.create'); // info text about glossary create
			$scope.dialog.buttons = [yesBtn, cancelBtn]; // show only yes and cancel button
			$scope.dialog.customButtons = []; // no custom button
		}

		function prepareDialogForGlossaryAssignment(glossaryList) {
			$scope.showGrid = true; // show the glossary list grid
			$scope.infoText = $translate.instant('cloud.translation.glossarydlg.errorText.existingGlossaryFound'); // info about existing glossary
			$scope.gridColums = getGridColumns(); // glossary grid column definitions
			$scope.data = convertToGridData(glossaryList); // glossary data, grid usable format

			// if not initialized, initialize grid again
			const gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
			if (!gridInstance) {
				initializeGrid();
			}

			refreshGrid(); // refresh the grid
			$scope.dialog.buttons = [assignBtn, cancelBtn]; // assign and cancel button at the right side
			$scope.dialog.customButtons = [createNewBtn]; // create new button at the left side
		}

		initializeScopeVariables();

		// initialize grid if not yet initialized
		const gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
		if (!gridInstance) {
			initializeGrid();
		}

		const selectedResource = resourceDataService.getSelected(); // selected item in resource container
		if (selectedResource) {
			glossaryService.findExistingGlossary(selectedResource.Id).then(function (glossaryList) {
				$scope.loading = false;
				if (glossaryList.length === 0) { // no glossary found with same term as the selected resource
					prepareDialogForGlossaryCreate();
				} else { // at least one glossary found with the same term
					prepareDialogForGlossaryAssignment(glossaryList);
				}
			});
		}

	}
})(angular);

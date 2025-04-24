(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'cloud.common';

	// grid columns definition here
	angular.module(moduleName).value('cloudCommonLanguageGridConfig', [
		{
			id: 'langname',
			field: 'displayColumn',
			name$tr$: 'cloud.common.languageColHeader_Language',
			width: 100,
			toolTip$tr$: 'cloud.common.languageColHeader_LanguageTT'
		}
		// { id: 'langtype', field: 'languageType', name: '', name$tr$: 'cloud.common.languageColHeader_Type', cssClass: 'cell-center', width: 50, toolTip: '' }
	]);

	/**
	 * @jsdoc controller
	 * @name cloudCommonLanguageGridController
	 * @function
	 *
	 * @description
	 * Controller for the grid view of language translations
	 **/
	angular.module(moduleName).controller('cloudCommonLanguageGridController',
		['_', '$scope', '$translate', '$timeout', 'cloudCommonLanguageService', 'cloudCommonLanguageGridConfig', 'platformTranslateService',
			'platformGridAPI', 'cloudCommonTranslationIssueService', '$q',
			function (_, $scope, $translate, $timeout, theService, theGridColumnOptions, platformTranslateService, platformGridAPI, translationIssueService, $q) { // jshint ignore:line

				$scope.gridId = $scope.getContainerUUID();
				$scope.gridData = {
					state: $scope.gridId
				};
				$scope.data = theService.getItems();

				$scope.gridColums = angular.copy(theGridColumnOptions); // copy origin column def for resetting ...

				// Object for displaying Header Information
				$scope.containerHeaderInfo = {
					title: ''
				};
				$scope.containerHeaderInfo = {
					subTitlePrefix: '',
					subTitle: '',
					loading: true
				};

				// scope variables/ functions
				$scope.path = globals.appBaseUrl;

				// translation function, properties place here
				$scope.translate = {}; // holds all required translations

				// register cloud.common module for usage in translations
				platformTranslateService.registerModule(moduleName);

				let tableDataService = null;
				let isInCustomizingModule = false;
				let tableData = null;
				$scope.issueBtnDisabled = true;
				$scope.hasIssues = false;

				// init grid if not already done....
				const gridInstance = platformGridAPI.grids.element('id', $scope.gridId);
				if (!gridInstance) {
					const grid = {
						data: $scope.data,
						columns: $scope.gridColums,
						id: $scope.gridId,
						options: {tree: false, indicator: true}
					};
					platformGridAPI.grids.config(grid);
				}

				// loads or updates translated strings
				const loadTranslations = function () {
					platformTranslateService.translateObject($scope.gridColums, ['name', 'toolTip']);
					$scope.translate = platformTranslateService.instant({'cloud.common': 'languageColHeader_ContainerTitle'});
				};

				platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', onSelectedRowsChanged);
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellChange);

				function onSelectedRowsChanged(e, arg) {
					theService.setCurrentItem(arg.grid.getDataItem(arg.rows[0]));
				}

				function onCellChange(e, arg) {
					// with $Scope you can find further info
					// var propertyName = $scope.gridCtrl.getColumns()[arg.cell].field;
					const propertyName = platformGridAPI.columns.configuration($scope.gridId).visible[arg.cell].field;
					theService.setItemModified(propertyName, arg.item);
				}

				/**
				 *
				function updateSelection() { // jshint ignore:line
					if (platformGridAPI.rows.selection({gridId: $scope.gridId}) !== theService.getCurrentItem()) {
						platformGridAPI.grids.commitEdit($scope.gridId);
						platformGridAPI.rows.selection({
							gridId: $scope.gridId,
							rows: [theService.getCurrentItem()]
						});
					}
				}
				 */

				/**
				 * @jsdoc function
				 * @name configurationChanged
				 * @function
				 * @methodOf cloud.common
				 * @description
				 * @scope  {$scope} the scope, normally here null
				 * @params {object} holding all message parameters from the LanguageItemChanged event
				 *           { containerInfoText : currentItemOptions.containerInfoText,
				 *             columnHeaderNames: currentItemOptions.columnHeaderNames
				 *           }
				 */
				function configurationChanged(params) {
					isInCustomizingModule = !!params.containerService;
					tableData = params.containerData;
					$scope.gridColums = angular.copy(theGridColumnOptions);
					platformTranslateService.translateObject($scope.gridColums, ['name', 'toolTip']);

					const selectedField = $scope.selectedField;
					let idx = 0;
					params.columnHeaderNames.forEach(function (headerTitle) {
						// Add column in grid if selectField is not specified (Means this is generic translation container, so all columns should be added
						// Otherwise If selectedField is available (It means grid for translation popup and add it to columns list) only add selected column in grid
						if (!_.isString(selectedField) || !_.isArray(params.columnFields) || params.columnFields[idx] === selectedField) {
							const col = {
								id: 'col' + idx,
								field: 'LangCol' + idx + '.description',
								name: headerTitle,
								formatter: 'description',
								editor:'description',
								maxLength: (params.maxLengthInfo || [])[idx]
							};
							$scope.gridColums.push(col);
						}
						idx++;
					});

					$scope.containerHeaderInfo.subTitlePrefix = $translate.instant('cloud.common.languageSubTitlePrefix');
					$scope.containerHeaderInfo.subTitle = params.containerInfoText;
					$scope.containerHeaderInfo.loading = false;

					platformGridAPI.columns.configuration($scope.gridId, $scope.gridColums, true);
				}

				/* @method prepareForSave
				 this event is saves the unsaved editor data into the bound grid cell
				 */
				function prepareForSave() {
					platformGridAPI.items.data($scope.gridId, []);
					setIssueBtnEnabled(false);
				}

				theService.onLanguageItemChanged.register(configurationChanged);
				platformTranslateService.translationChanged.register(loadTranslations); // register translation changed event
				theService.onPrepareForSave.register(prepareForSave);

				// workaround to get translation container run with new grid api.
				// works only in read only.
				theService.itemsChanged.register(updateGridData);

				function updateGridData() {
					$scope.data = theService.getItems();
					platformGridAPI.items.data($scope.gridId, $scope.data);
					// Logic to set focus on first element of grid if this is translation popup
					if (_.isString($scope.selectedField) && platformGridAPI.grids.exist($scope.gridId)) {
						platformGridAPI.cells.selection({
							'gridId': $scope.gridId,
							'rows': [0],
							'forceEdit': true
						});
					}
					getTranslationIssues().then(result => {
						setIssueBtnEnabled(true);
					});
				}

				function setIssueBtnEnabled(enabled) {
					const issueBtn = $scope.tools.items.find(item => item.id === 't1');
					if(issueBtn) {
						issueBtn.iconClass = $scope.hasIssues ? 'tlb-icons ico-warning' : 'tlb-icons ico-info';
					}
					$scope.issueBtnDisabled = !enabled;
					$scope.tools.update();
				}

				function cleanupDuplicateIssueBtn() {
					while($scope.tools.items.filter(i => i.id === 't1').length > 1) {
						const index = $scope.tools.items.indexOf($scope.tools.items.find(i => i.id === 't1'));
						$scope.tools.items.splice(index, 1);
					}
				}

				function getTranslationIssues() {
					let selectedDataItem = tableData.selectedItem;
					let requests = [];
					for(let prop in selectedDataItem) {
						if(selectedDataItem[prop] && selectedDataItem[prop].hasOwnProperty('DescriptionTr')) {
							if(selectedDataItem[prop]['DescriptionTr']) {
								requests.push(translationIssueService.getIssues(selectedDataItem[prop]['Description'], prop, selectedDataItem[prop]['DescriptionTr']));
							}

						}
					}

					return $q.all(requests).then(results => {
						let issueList = getFlatIssueList(results);
						translationIssueService.setCurrentIssues(issueList);
						$scope.hasIssues = issueList.length > 0;
					});

				}

				function getFlatIssueList(result) {
					let flatList = [];
					result.forEach(issues => {
						issues.forEach(issue => {
							flatList.push(issue);
						});
					});

					return flatList;
				}


				theService.refreshGrid.register(refreshGrid);
				/**
				 * this method just force refresh of grid.
				 */
				function refreshGrid() {
					platformGridAPI.grids.refresh($scope.gridId);
					updateGridData();
				}

				function onIssueBtnClick() {
					translationIssueService.openIssueDialog(isInCustomizingModule, tableData).then(result => {
					});
				}

				if (_.isFunction($scope.onContentResized)) {
					$scope.onContentResized(function () {
						platformGridAPI.grids.resize($scope.gridId);
					});
				}

				$scope.$on('$destroy', function () {
					theService.onLanguageItemChanged.unregister(configurationChanged);
					theService.itemsChanged.unregister(updateGridData);
					platformTranslateService.translationChanged.unregister(loadTranslations);
					theService.onPrepareForSave.unregister(prepareForSave);
					theService.refreshGrid.unregister(refreshGrid);
					theService.isContainerConnected = false; // detach container from service
				});

				loadTranslations();
				theService.isContainerConnected = true; // attach container from service
				$scope.getUiAddOns().enableToolbar();
				let tools = {
					showImages: false,
					showTitles: true,
					cssClass: 'tools',
					items: [
						{
							id: 't1',
							caption: $translate.instant('cloud.common.translationIssueDialog.dialogTitle'),
							iconClass: 'tlb-icons ico-warning',
							type: 'item',
							fn: onIssueBtnClick,
							disabled: function () {
								return $scope.issueBtnDisabled;
							}
						}
					]
				};

				$scope.setTools(tools);
				cleanupDuplicateIssueBtn();
				$timeout(()=>setIssueBtnEnabled(false));


				// in case of there are already an item saved in the language service, we use these setting
				// by triggering myself via the publishColumnsChanged service. via timeout to break synchronous processing
				if (theService.getViewIdentifier()) {
					$timeout(function () {
						theService.publishColumnsChanged();
						theService.loadTranslationsToAllDescriptors();
					}, 0);
				} else {
					theService.setViewIdentifier(undefined);
					theService.reload();
				}
			}
		]);
})(angular);

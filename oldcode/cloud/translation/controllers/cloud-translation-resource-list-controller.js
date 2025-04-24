/**
 * Created by baf on 30.05.2016.
 */
(function () {

	'use strict';
	const moduleName = 'cloud.translation';

	/**
	 * @ngdoc controller
	 * @name projectCostGroup1ReadonlyListController
	 * @function
	 *
	 * @description
	 * Controller for the  list view of resource entities
	 **/
	angular.module(moduleName).controller('cloudTranslationResourceListController', CloudTranslationResourceListController);

	CloudTranslationResourceListController.$inject = ['$scope', '$rootScope', '_', '$translate', 'cloudTranslationResourceDataService', 'platformRuntimeDataService', 'platformContainerControllerService', 'platformGridControllerService', 'cloudTranslationGlossaryService', 'platformGridAPI', 'platformDialogService', 'platformPermissionService', 'permissions', 'cloudDesktopSidebarService', 'globals'];

	function CloudTranslationResourceListController($scope, $rootScope, _, $translate, cloudTranslationResourceDataService, platformRuntimeDataService, platformContainerControllerService, platformGridControllerService, cloudTranslationGlossaryService, platformGridAPI, platformDialogService, platformPermissionService, permissions, cloudDesktopSidebarService, globals) {

		function loadTranslation() {
			$scope.dialogTexts = {
				dialogTitle: $translate.instant('cloud.translation.glossarydlg.makeGlossaryHeader'),
				loadingMsg: $translate.instant('cloud.translation.glossarydlg.loadingMsg'),
				createValidInfo: $translate.instant('cloud.translation.glossarydlg.confirmationText.create'),
				multipleGlossaryInfo: $translate.instant('cloud.translation.glossarydlg.errorText.existingGlossaryFound'),
				btnAssign: $translate.instant('cloud.translation.glossarydlg.assignToGlossary'),
				btnCreateNew: $translate.instant('cloud.translation.glossarydlg.makeGlossaryHeader'),
				btnYes: $translate.instant('cloud.translation.glossarydlg.yes')
			};
		}

		function isDisabledCreateGlossary(resource) {
			return resource === null || resource.IsGlossary;
		}

		function isDisabledRemoveGlossary(resource) {
			return resource === null || !resource.IsGlossary;
		}

		function isReferencingOtherGlossary(resource) {
			return !resource.IsGlossary && resource.ResourceFk !== null;
		}

		function makeReadOnly(item) {
			const fields = [{field: 'IsGlossary', readonly: true}];
			platformRuntimeDataService.readonly(item, fields);
		}

		function showDialogToDisplayGlossaryWithSelf(selectedItem) {
			platformDialogService.showYesNoDialog('cloud.translation.glossarydlg.errorText.referenceErrorMake', 'cloud.translation.glossarydlg.makeGlossaryHeader', 'no').then(function (result) {
				if (result.yes) {
					const resourceIds = [selectedItem.ResourceFk, selectedItem.Id];
					cloudDesktopSidebarService.filterSearchFromPKeys(resourceIds);
				}
			});
		}

		function showDialogToDisplayRefereeWithSelf(selectedItem, resourceIds) {
			platformDialogService.showYesNoDialog('cloud.translation.glossarydlg.errorText.referenceErrorRemove', 'cloud.translation.glossarydlg.removeGlossaryHeader', 'no').then(function (result) {
				if (result.yes) {
					resourceIds.push(selectedItem.Id);
					cloudDesktopSidebarService.filterSearchFromPKeys(resourceIds);
				}
			});
		}

		function showGlossaryCreateConfirmationDialog() {

			const glossaryDialogConfig = {
				headerText$tr$: 'cloud.translation.glossarydlg.makeGlossaryHeader',
				bodyTemplateUrl: globals.appBaseUrl + 'cloud.translation/templates/cloud-translation-create-glossary-dialog.html',
				showCancelButton: false,
				showNoButton: false,
				showOkButtom: false,
				resizeable: true,
				width: '700px',
				minWidth: '700px',
				value: {
					loading: true,
					dialogTexts: $scope.dialogTexts
				},
				buttons: []
			};

			return platformDialogService.showDialog(glossaryDialogConfig).then(function (response) {
				return response;
			}, function createGlossaryClosed() {
				return {cancel: true};
			});
		}

		function showGlossaryRemoveConfirmationDialog() {
			return platformDialogService.showYesNoDialog('cloud.translation.glossarydlg.confirmationText.remove', 'cloud.translation.glossarydlg.removeGlossaryHeader', 'info');
		}

		function showGlossaryCreateSuccessDialog() {
			platformDialogService.showMsgBox('cloud.translation.glossarydlg.successText.create', 'cloud.translation.glossarydlg.makeGlossaryHeader', 'info');
		}

		function showGlossaryRemoveSuccessDialog() {
			platformDialogService.showMsgBox('cloud.translation.glossarydlg.successText.remove', 'cloud.translation.glossarydlg.removeGlossaryHeader', 'info');
		}

		function createGlossary(selectedItem) {
			showGlossaryCreateConfirmationDialog().then(function (result) {
				if (result.create) {
					cloudTranslationGlossaryService.convertAsGlossary(selectedItem).then(function (response) {
						if (response.data) {
							const glossaryItem = response.data.glossary;
							const newItem = response.data.newItem;
							makeReadOnly(glossaryItem);
							makeReadOnly(newItem);
							const dataset = cloudTranslationResourceDataService.getList();
							const index = _.findIndex(dataset, {Id: glossaryItem.Id});
							dataset.splice(index, 1, glossaryItem);
							dataset.splice(index + 1, 0, newItem);
							cloudTranslationResourceDataService.gridRefresh();
							platformGridAPI.items.sort($scope.gridId, 'ResourceTerm', 'sort-asc');
							platformGridAPI.rows.scrollIntoViewByItem($scope.gridId, glossaryItem);
							updateTools();
							showGlossaryCreateSuccessDialog();
						}
					});
				}
			});
		}

		function deleteGlossary(selectedItem) {
			showGlossaryRemoveConfirmationDialog().then(function (result) {
				if (result.yes) {
					cloudTranslationGlossaryService.removeGlossary(selectedItem.Id).then(function () {
						const dataset = cloudTranslationResourceDataService.getList();
						const index = _.findIndex(dataset, {Id: selectedItem.Id});
						if (index !== -1) {
							dataset.splice(index, 1);
							cloudTranslationResourceDataService.gridRefresh();
							platformGridAPI.items.sort($scope.gridId, 'ResourceTerm', 'sort-asc');
						}
						platformGridAPI.rows.scroll($scope.gridId, 'top', 0);
						showGlossaryRemoveSuccessDialog();
					});
				}
			});
		}

		function onClickCreateGlossary() {
			const selectedItem = $scope.getSelectedItem();
			if (isReferencingOtherGlossary(selectedItem)) {
				showDialogToDisplayGlossaryWithSelf(selectedItem);
			} else {
				createGlossary(selectedItem);
			}
		}

		function onClickRemoveGlossary() {
			const selectedItem = $scope.getSelectedItem();
			cloudTranslationGlossaryService.getReferencingResources(selectedItem).then(function (resourceIds) {
				if (resourceIds.length === 0) {
					deleteGlossary(selectedItem);
				} else {
					showDialogToDisplayRefereeWithSelf(selectedItem, resourceIds);
				}
			});
		}

		function onDismissNormalizeDialog() {
			$scope.loadingInBackground = false;
			updateTools();
		}

		function onClickNormalizeResource() {
			$scope.loadingInBackground = true;
			// cloudTranslationGlossaryService.showNormalizationDialog().then(function () {
			// 	onDismissNormalizeDialog();
			// }, function () {
			// 	onDismissNormalizeDialog();
			// });

			cloudTranslationGlossaryService.showNormalizationStepsDialog().then(function () {
				onDismissNormalizeDialog();
			}, function () {
				onDismissNormalizeDialog();
			});
		}

		function hasMultipleItemSelected() {
			const selectedItems = platformGridAPI.rows.selection({gridId: $scope.gridId, wantsArray: true});
			return selectedItems.length > 1;
		}

		const createGlossaryButton = {
			id: 'createGlossary',
			type: 'item',
			caption: 'cloud.translation.createGlossary',
			iconClass: 'tlb-icons ico-glossary-res',
			sort: -6,
			fn: onClickCreateGlossary,
			disabled: function () {
				if (hasMultipleItemSelected()) {
					return true;
				}
				const selectedItem = $scope.getSelectedItem();
				return isDisabledCreateGlossary(selectedItem);
			}
		};
		const removeGlossaryButton = {
			id: 'removeGlossary',
			type: 'item',
			caption: 'cloud.translation.removeGlossary',
			iconClass: 'tlb-icons ico-glossary-del',
			fn: onClickRemoveGlossary,
			sort: -5,
			disabled: function () {
				if (hasMultipleItemSelected()) {
					return true;
				}
				const selectedItem = $scope.getSelectedItem();
				return isDisabledRemoveGlossary(selectedItem);
			}
		};

		const normalizeResourceButton = {
			id: 'normalizeResources',
			type: 'item',
			caption: 'cloud.translation.normalizeResource',
			iconClass: 'tlb-icons ico-normalize',
			sort: -3,
			fn: onClickNormalizeResource,
			disabled: function () {
				return $scope.loadingInBackground;
			}
		};

		const divider0 = {
			id: 'rsDv0',
			type: 'divider',
			sort: -2
		};

		const divider1 = {
			id: 'rsDv1',
			type: 'divider',
			sort: -4
		};

		const divider2 = {
			id: 'rsDv2',
			type: 'divider',
			sort: -7
		};

		function isResourceTermColumn(columnIndex) {
			const columnConfig = platformGridAPI.columns.configuration($scope.gridId);
			return columnConfig.current[columnIndex].id === 'resourceterm';
		}

		function isIsChangedColumn(columnIndex) {
			const columnConfig = platformGridAPI.columns.configuration($scope.gridId);
			return columnConfig.current[columnIndex].id === 'ischanged';
		}

		function isValidResourceForFlaggedAsChanged(item) {
			return item.Version > 0;
		}

		const onValueChanged = function (e, args) {
			if (isResourceTermColumn(args.cell) && isValidResourceForFlaggedAsChanged(args.item)) {
				const dataset = cloudTranslationResourceDataService.getList();
				const item = _.find(dataset, {Id: args.item.Id});
				if (item) {
					item.Ischanged = true;
					platformRuntimeDataService.readonly(item, [{field: 'Ischanged', readonly: false}]);
					refreshRow(item);
				}
			} else if (isIsChangedColumn(args.cell) && isValidResourceForFlaggedAsChanged(args.item)) {
				_.noop(); // avoid empty block error from eslint
			}
		};

		function refreshRow(itemInDataset) {
			platformGridAPI.rows.refresh({gridId: $scope.gridId, item: itemInDataset});
		}

		function updateTools() {
			$scope.tools.update();
		}

		$scope.gridId = '4d35ae8687dd4ed6aa5ce4b47befad0b';
		platformContainerControllerService.initController($scope, moduleName, '4d35ae8687dd4ed6aa5ce4b47befad0b');
		loadTranslation();
		platformPermissionService.loadPermissions(['90105e745ddf4afc866001aed14e581f']).then(function () {
			if (platformPermissionService.has('90105e745ddf4afc866001aed14e581f', permissions.execute)) {
				$scope.addTools([divider2, createGlossaryButton, removeGlossaryButton, divider1, normalizeResourceButton, divider0]);
				updateTools();
			}
		});

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', updateTools);
		platformGridAPI.events.register($scope.gridId, 'onCellChange', onValueChanged);

		$scope.$on('$destroy', function () {
			platformGridAPI.events.unregister($scope.gridId, 'onSelectedRowsChanged', updateTools);
			platformGridAPI.events.unregister($scope.gridId, 'onCellChange', onValueChanged);
		});

		$rootScope.$on('translation.entityChangedFromDetails', function (evt, entity) {
			refreshRow(entity);
		});

		$rootScope.$on('translation.entityChangedFromGrid', function (evt, entity) {
			refreshRow(entity);
		});

	}
})();
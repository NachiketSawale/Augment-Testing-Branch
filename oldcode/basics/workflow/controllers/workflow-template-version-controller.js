/* global angular */
(function () {
	'use strict';

	function basicsWorkflowTemplateVersionController($scope, platformModuleStateService, basicsWorkflowBaseGridController,
	                                                 platformGridAPI, basicsWorkflowTemplateService, platformModalService,
	                                                 basicsWorkflowMasterDataService, globals, _, cloudDesktopModalBackgroundService, basicsWorkflowValidationService, basicsWorkflowUIService, platformVanillaDataProtectorService) {

		var state = platformModuleStateService.state('basics.workflow');
		state.isSaveHookCalled = false;

		function getItemsWatch() {
			return state.selectedMainEntity;
		}

		function itemsListener(newVal, oldVal) {
			if (newVal) {
				$scope.setItems(filteredItems(newVal.TemplateVersions), oldVal ? oldVal.TemplateVersions : null);
			} else if (!newVal && oldVal) {
				$scope.setItems([], null);
			}
		}

		function filteredItems(items) {
			return _.filter(items, function (item) {
				return item.Status !== 4;
			});
		}

		function getCurrentItemWatch() {
			return state.selectedTemplateVersion;
		}

		function currentItemListener(newVal, oldVal) {
			if (newVal && (newVal !== oldVal)) {
				$scope.changeToolbar(null, true);
				if (state.selectedMainEntity) {
					let newVersion = _.find(filteredItems(state.selectedMainEntity.TemplateVersions), {Id: newVal.Id});
					if (newVersion ? newVersion.Version === 0 : false) {
						$scope.setItems(filteredItems(state.selectedMainEntity.TemplateVersions), null);
					}
				} else {
					$scope.setItems(filteredItems([newVal], null));
				}

				if (newVal.TemplateVersion !== 0) {
					platformGridAPI.rows.selection({
						gridId: $scope.gridId,
						rows: [newVal],
						nextEnter: $scope.newItemIsAdded
					});
				}

				$scope.newItemIsAdded = false;

				if (!state.isSaveHookCalled) {
					// when different version is selected context should be cleared and selected action should be cleared
					if (angular.isDefined(state.clearContext)) {
						state.clearContext();
					}
					state.currentWorkflowAction = null;
				} else {
					// When data is saved, context should not be cleared and designer action should not be cleared
					state.isSaveHookCalled = false;
				}
			}
		}

		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow',
			{expression: getCurrentItemWatch, listener: currentItemListener, name: 'selectedTemplateVersion'}, {
				expression: getItemsWatch,
				listener: itemsListener,
				name: 'selectedMainEntity.TemplateVersions'
			});

		var gridConfig = {
			data: [],
			columns: [
				{
					id: 'image',
					field: 'Image',
					formatter: function (row, cell, value) {
						return '<img src="' + value + '" alt="">';
					},
					width: 30,
					keyboard: {
						enter: false
					}
				},
				{
					id: 'id',
					formatter: 'integer',
					field: 'Id',
					sortable: true,
					width: 30,
					name: 'ID',
					grouping: {
						title: 'Id',
						getter: 'Id',
						aggregators: [],
						aggregateCollapsed: false
					}
				},
				{
					id: 'templateVersion',
					formatter: 'integer',
					field: 'TemplateVersion',
					name: 'Version',
					name$tr$: 'basics.workflow.template.templateVersion',
					toolTip: 'Version',
					editor: 'integer',
					sortable: true,
					width: 50,
					keyboard: {
						enter: false
					}
				},
				{
					id: 'comment',
					formatter: 'remark',
					field: 'Comment',
					name: 'Comment',
					name$tr$: 'basics.workflow.template.comment',
					toolTip: 'Comment',
					width: 150,
					sortable: true,
					editor: 'remark',
					keyboard: {
						enter: true
					}
				},
				{
					id: 'helpText',
					formatter: 'remark',
					field: 'Helptext',
					name: 'Help Text',
					name$tr$: 'basics.workflow.template.helpText',
					width: 150,
					toolTip: 'Help Text',
					sortable: true,
					editor: 'remark',
					keyboard: {
						enter: true
					}
				},
				{
					id: 'lifeTime',
					field: 'Lifetime',
					name: 'lifetime',
					name$tr$: 'basics.workflow.template.lifeTime',
					domain: 'integer',
					editor: 'integer',
					sortable: true,
					width: 50,
					formatter: 'integer',
					keyboard: {
						enter: true
					}
				}

			],
			id: $scope.gridId,
			options: {
				tree: false,
				indicator: true,
				showFooter: false,
				idProperty: 'Id',
				iconClass: '',
				enableDraggableGroupBy: null
			}
		};

		basicsWorkflowUIService.addHistoryFields(gridConfig.columns);

		$scope.configGrid(gridConfig);

		$scope.$watch(function () {
			return state.selectedTemplateVersion;
		}, function (version) {
			if (version && version.WorkflowAction) {
				basicsWorkflowTemplateService.updateCurrentMaxItemId();
			}
			$scope.tools.refresh();
		});

		var disabledFn = function () {
			var disabled = false;
			if (!state.selectedMainEntity || _.isEmpty(state.selectedMainEntity) || !state.selectedTemplateVersion) {
				disabled = true;
			}

			return disabled;
		};

		$scope.uploadJSONFile = function (file) {
			if (file) {
				let reader = new FileReader();
				reader.readAsText(file);
				reader.onload = function () {
					basicsWorkflowTemplateService.importVersion(reader.result);
				};
			}
		};

		let setClick = function () {
			$scope.addClick();
		};

		var disabledMultipleFnSelected = function () {
			var disabled = false;
			if (!state.selectedMainEntity || _.isEmpty(state.selectedMainEntity) || !state.selectedTemplateVersion || angular.isArray(state.selectedTemplateVersion)) {
				disabled = true;
			}

			return disabled;
		};

		var deleteButton = {
			id: 't8',
			caption: 'cloud.common.toolbarDelete',
			type: 'item',
			iconClass: 'tlb-icons ico-rec-delete',
			get disabled() {
				var version = state.selectedTemplateVersion;
				if (_.isArray(version)) {
					return _.some(version, function (vers) {
						return vers.Status === 2 || platformVanillaDataProtectorService.isVanillaData(vers);
					});
				} else {
					return version ? version.Status === 2 || platformVanillaDataProtectorService.isVanillaData(version) : true;
				}
			},
			fn: function () {
				platformModalService.showYesNoDialog('basics.workflow.version.deleteTemplateVersion.deleteConfirmation', 'basics.workflow.version.deleteTemplateVersion.header', 'no')
					.then(function (result) {
						if (result.yes) {
							state.mainItemIsDirty = true;
							var version = state.selectedTemplateVersion;
							if (_.isArray(version)) {
								version.forEach(version => version.Status = 4);
							} else {
								version.Status = 4;
							}
							$scope.setItems(filteredItems(state.selectedMainEntity.TemplateVersions));
						}
					});
			}
		};

		$scope.setTools(
			{
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: [
					{
						id: 't4',
						caption: 'cloud.common.toolbarSearch',
						type: 'check',
						value: _.isObject(platformGridAPI.filters.showSearch($scope.gridId)) ? true : platformGridAPI.filters.showSearch($scope.gridId),
						iconClass: 'tlb-icons ico-search',
						disabled: disabledFn,
						fn: function () {
							platformGridAPI.filters.showSearch($scope.gridId, this.value);
						}
					},
					{
						id: 't5',
						caption: 'basics.workflow.version.download',
						type: 'item',
						iconClass: 'tlb-icons ico-download',
						disabled: disabledMultipleFnSelected,
						fn: function () {
							basicsWorkflowTemplateService.downloadVersion(state.selectedTemplateVersion.Id);
						}
					},
					{
						id: 't6',
						caption: 'basics.workflow.version.upload',
						type: 'item',
						iconClass: 'tlb-icons ico-upload',
						fn: setClick
					},
					{
						id: 't7',
						caption: 'basics.workflow.template.version.toolbar.copyVersion',
						type: 'item',
						iconClass: 'tlb-icons ico-workflow-copy-version',
						disabled: function () {
							return !state.selectedTemplateVersion || state.selectedTemplateVersion.Version === 0 || angular.isArray(state.selectedTemplateVersion);
						},
						fn: function () {
							basicsWorkflowTemplateService.copyVersion(state.selectedTemplateVersion.Id).then(function () {
								state.mainItemIsDirty = true;
							});
						}
					},
					{
						id: 't12',
						caption: 'basics.workflow.template.version.toolbar.validate',
						type: 'item',
						iconClass: 'tlb-icons ico-validate-workflow',
						disabled: disabledFn,
						fn: function () {

							basicsWorkflowMasterDataService.getActions().then(
								function (responseArray) {
									basicsWorkflowValidationService.validateVersion(state.selectedTemplateVersion, responseArray.data).then(function (helper) {
										var modalOptions = {
											templateUrl: globals.appBaseUrl + 'basics.workflow/templates/version-validation-dialog.html',
											invalidItems: helper.invalidItems,
											backdrop: false,
											headerTextKey: 'Editor',
											bodyTextKey: 'test',
											showOkButton: true,
											showCancelButton: true,
											controller: ['$scope', '$modalInstance', function basicsWorkflowVersionValidationController($scope, $modalInstance) {

												$scope.invalidItems = helper.invalidItems;
												$scope.onOk = function onOk() {
													_.each(helper.invalidItems, function (item) {
														delete item.rt$data;
													});

													$modalInstance.close(true);
												};
											}]
										};
										platformModalService.showDialog(modalOptions);
									});
								});
						}
					},
					deleteButton,
					{
						id: 't9',
						caption: 'basics.workflow.template.version.toolbar.changeStatus',
						type: 'item',
						iconClass: 'tlb-icons ico-change-status',
						disabled: disabledMultipleFnSelected,
						fn: function () {
							cloudDesktopModalBackgroundService.setModalBackground(true);
							if (state.mainItemIsDirty) {
								basicsWorkflowTemplateService.saveItem(state.selectedMainEntity).then(function () {
									basicsWorkflowTemplateService.changeVersionStatus(state.selectedTemplateVersion)
										.then(function () {
											$scope.setItems(state.selectedMainEntity.TemplateVersions);
											cloudDesktopModalBackgroundService.setModalBackground(false);
										});
								}, function () {
									cloudDesktopModalBackgroundService.setModalBackground(false);
								});
							} else {
								basicsWorkflowTemplateService.changeVersionStatus(state.selectedTemplateVersion)
									.then(function () {
										$scope.setItems(state.selectedMainEntity.TemplateVersions);
										cloudDesktopModalBackgroundService.setModalBackground(false);
									});
							}
						}
					},
					{
						id: 't15',
						caption: 'cloud.common.documentProperties',
						type: 'item',
						iconClass: 'tlb-icons ico-settings',
						fn: function () {
							$scope.showGridLayoutConfigDialog();
						}
					}
				]
			});

	}

	basicsWorkflowTemplateVersionController.$inject = ['$scope', 'platformModuleStateService',
		'basicsWorkflowBaseGridController', 'platformGridAPI', 'basicsWorkflowTemplateService', 'platformModalService',
		'basicsWorkflowMasterDataService', 'globals', '_', 'cloudDesktopModalBackgroundService', 'basicsWorkflowValidationService', 'basicsWorkflowUIService', 'platformVanillaDataProtectorService'];
	angular.module('basics.workflow').controller('basicsWorkflowTemplateVersionController',
		basicsWorkflowTemplateVersionController);

})();

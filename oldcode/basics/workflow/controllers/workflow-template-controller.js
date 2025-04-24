/* global globals */
(function (angular) {
	'use strict';

	/* jshint -W072 */
	function basicsWorkflowTemplateController($scope, platformModalService, platformDialogService, _, basicsWorkflowBaseGridController,
		basicsWorkflowTemplateService, platformGridAPI, basicsWorkflowUIService, platformModuleStateService,
		basicsWorkflowInstanceService, cloudDesktopModalBackgroundService, $http, basicsWorkflowClipboardService, $q, basicsWorkflowDragDropService,
		cloudDesktopSidebarService) {

		cloudDesktopSidebarService.checkStartupFilter();
		var state = platformModuleStateService.state('basics.workflow');
		basicsWorkflowBaseGridController.extend($scope, 'basics.workflow',
			{expression: selectedExpression, listener: selectedListender, name: 'selectedMainEntity'}, 'mainEntities');

		function selectedExpression() {
			return state.selectedMainEntity;
		}

		function selectedListender(newVal, oldVal) {
			if (newVal) {
				if (newVal && oldVal && newVal.Id !== oldVal.Id) {
					basicsWorkflowTemplateService.changeSelectedMainEntity(newVal, oldVal);
					$scope.setCurrentItem(newVal, oldVal);
					state.currentWorkflowAction = null;
				} else {
					$scope.setCurrentItem(newVal, oldVal);
				}

				if (state.templateCreated) {
					state.mainItemIsDirty = true;
					state.templateCreated = false;
					state.creatingNewTemplate = false;
				}
			}
		}

		var columns = basicsWorkflowUIService.getStandardConfigForListView()?.columns;
		var gridConfig = {
			data: [],
			columns: columns,
			id: $scope.gridId,
			options: {
				tree: false,
				indicator: true,
				showFooter: false,
				idProperty: 'Id',
				iconClass: '',
				enableDraggableGroupBy: true,
				grouping: true,
				dragDropAllowed: true
			},
			type: 'basics.workflow',
			dragDropService: basicsWorkflowClipboardService
		};
		$scope.configGrid(gridConfig);
		basicsWorkflowDragDropService.initDragDropForTemplateContainer($scope, basicsWorkflowUIService, basicsWorkflowTemplateService, gridConfig);
		$scope.$on('jsonImported:createItemByImport', function (event, data) {
			if (data) {
				platformGridAPI.rows.add({
					gridId: $scope.gridId,
					item: data
				});
			}
		});

		$scope.$watch(function () {
			return state.selectedMainEntity;
		}, function () {
			basicsWorkflowTemplateService.updateCurrentMaxItemId();
			if (!state.selectedMainEntity) {
				$scope.tools.refresh();
			}
		});

		platformGridAPI.filters.showSearch($scope.gridId, false);

		var disabledFn = function () {// --Defect #111558 - New - Delete functionality in workflow template container throws an error
			var disabled = false;
			if (_.isEmpty(state.selectedMainEntity) || _.isArray(state.selectedMainEntity)) {
				disabled = true;
			}
			return disabled;
		};

		let setClick = function () {
			$scope.addClick();
		};

		$scope.uploadJSONFile = function (file) {
			if (file) {
				let reader = new FileReader();
				reader.readAsText(file);
				reader.onload = function () {
					basicsWorkflowTemplateService.createItemByImport(reader.result);
				};
			}
		};

		platformGridAPI.events.register($scope.gridId, 'onSelectedRowsChanged', function () {

		});

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
						fn: function () {
							platformGridAPI.filters.showSearch($scope.gridId, this.value);
						}
					},
					{
						id: 't7',
						caption: 'cloud.common.toolbarInsert',
						type: 'item',
						iconClass: 'tlb-icons ico-rec-new',
						fn: function () {
							basicsWorkflowTemplateService.createItem().then(function (response) {
								state.creatingNewTemplate = true;
								state.newestCreatedTemplateId = response.Id;
								if (!response.__rt$data) {
									response.__rt$data = {
										readonly: false
									};
								} else {
									response.__rt$data.readonly = false;
								}

								platformGridAPI.rows.add({
									gridId: $scope.gridId,
									item: response
								});
								platformGridAPI.rows.selection({
									gridId: $scope.gridId,
									rows: [response],
									nextEnter: true
								});

								state.templateCreated = true;
							});
						}
					},
					{
						id: 't6',
						caption: 'basics.workflow.version.createByVersion',
						type: 'item',
						iconClass: 'tlb-icons ico-upload',
						fn: setClick
					},

					{
						id: 't8',
						caption: 'cloud.common.toolbarDelete',
						type: 'item',
						disabled: disabledFn,// --Defect #111558 - New - Delete functionality in workflow template container throws an error
						iconClass: 'tlb-icons ico-rec-delete',
						fn: function () {
							var modalOptions = {
								headerText$tr$: 'basics.workflow.template.confirmDelete.title',
								bodyText$tr$: 'basics.workflow.template.confirmDelete.templateHeader',
								showYesButton: true,
								showNoButton: true,
								iconClass: 'ico-question'
							};
							platformDialogService.showDialog(modalOptions).then(function (result) {
								if (result.yes) {
									basicsWorkflowTemplateService.deleteSelectedItem().then(function (response) {
										platformGridAPI.items.data($scope.gridId, state.mainEntities);
										// item was deleted, selected the next entity[index] in list.
										$scope.setCurrentItem(response, null);// Defect #111761 - Workflow Module Grid Entity selection UI issue
										$scope.tools.refresh();
									});
								}
							});
						}
					},
					{
						id: 't9',
						caption: 'basics.workflow.template.startWorkflow',
						type: 'item',
						iconClass: 'tlb-icons ico-workflow-run',
						fn: function () {

							function responseFn(response) {
								if (response.Status === 5) {
									var context = angular.fromJson(response.Context);
									platformModalService.showErrorBox(context.Exception.Message);
								}
							}

							var templateEntity = state.selectedMainEntity;

							function makeVersionReadOnly() {
								var activeVersion = _.find(state.selectedMainEntity.TemplateVersions,
									{Status: 2});
								if (activeVersion) {
									activeVersion.IsReadOnly = true;
								}
								state.selectedTemplateVersion = activeVersion;
								state.currentWorkflowAction = null;
							}

							if (templateEntity) {
								var templateId = templateEntity.Id;
								if (angular.isDefined(templateId) && templateId !== null) {
									if (templateEntity.EntityId !== '0') {
										state.startWorkflowInfo = {};
										platformDialogService.showDialog({
											bodyTemplateUrl: globals.appBaseUrl + 'basics.workflow/templates/dialogs/workflow-start-dialog.html',
											headerTextKey: 'basics.workflow.start.idDialog.header',
											backdrop: false,
											width: '100px',
											//height: '150px',
											buttons: [{
												id: 'cancel'
											}, {
												id: 'ok'
											}]
										}).then(function (result) {
											if (result.ok) {
												basicsWorkflowInstanceService.startWorkflow(templateId, state.startWorkflowInfo.identification[0]).then(responseFn);
												makeVersionReadOnly();
											}
										}, function () {
											state.debugCanceled = true;
											return $q.reject();
										});
									} else {
										basicsWorkflowInstanceService.startWorkflow(templateId).then(responseFn);
										makeVersionReadOnly();
									}
								}
							}
						},
						disabled: function () {
							return state.selectedMainEntity === null || state.selectedMainEntity === undefined;
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
					},
					{
						id: 't16',
						sort: 10,
						caption: 'cloud.common.taskBarGrouping',
						type: 'check',
						iconClass: 'tlb-icons ico-group-columns',
						fn: function () {
							platformGridAPI.grouping.toggleGroupPanel($scope.gridId, this.value);
						},
						value: platformGridAPI.grouping.toggleGroupPanel($scope.gridId),
						disabled: false
					},
					{
						id: 't17',
						sort: 11,
						caption: 'basics.workflow.template.addAccessRightDescriptor',
						type: 'item',
						iconClass: 'tlb-icons ico-right-add',
						fn: function () {
							if (!_.isEmpty(state.selectedMainEntity) && !state.selectedMainEntity.AccessRightDescriptorFk) {
								addAccessRightDescription();
							}
						},
						disabled: function () {
							return _.isEmpty(state.selectedMainEntity) || state.selectedMainEntity.AccessRightDescriptorFk;
						}
					},
					{
						id: 't18',
						caption: 'basics.workflow.template.deleteAccessRightDescriptor',
						sort: 12,
						type: 'item',
						cssClass: 'tlb-icons ico-right-delete',
						fn: function () {
							if (!_.isEmpty(state.selectedMainEntity) && state.selectedMainEntity.AccessRightDescriptorFk) {
								deleteAccessRightDescriptor(state.selectedMainEntity.AccessRightDescriptorFk);
							}
						},
						disabled: function () {
							return _.isEmpty(state.selectedMainEntity) || !state.selectedMainEntity.AccessRightDescriptorFk;
						}
					}
				]
			});

		function addAccessRightDescription() {
			var modalOptions = {
				headerText$tr$: 'basics.workflow.template.enterAccessRightDescriptorName',
				bodyText$tr$: 'basics.workflow.template.plsEnterName',
				maxLength: 64
			};

			return platformModalService.showInputDialog(modalOptions).then(function (result) {
				if (result.ok) {
					var accessName = result.value ? result.value.text : '';
					return createAccessRightDescriptor(accessName).then(function () {
						return $scope.saveHook(state.selectedMainEntity);
					});
				}
			});
		}

		function createAccessRightDescriptor(accessName) {
			var dto = {
				DescriptorDesc: state.selectedMainEntity.Description.substring(0, 254),
				Name: (accessName ? accessName : state.selectedMainEntity.Description).substring(0, 63),
				SortOrderPath: '/Workflow Templates',
				AccessMask: 4112,
				ModuleName: 'basics.workflow'
			};

			return $http({
				method: 'POST',
				url: globals.webApiBaseUrl + 'basics/customize/special/createaccessrightwithmask',
				data: dto
			}).then(function (result) {
				var descriptor = result.data;
				state.selectedMainEntity.AccessRightDescriptorFk = descriptor.Id;
				state.mainItemIsDirty = true;
				return result.data;
			});
		}

		function deleteAccessRightDescriptor(accessId) {
			state.selectedMainEntity.AccessRightDescriptorFk = null;
			state.mainItemIsDirty = true;
			return $scope.saveHook(state.selectedMainEntity).then(function () {
				return $http({
					method: 'GET',
					url: globals.webApiBaseUrl + 'basics/customize/special/deleteaccessrightbyid',
					params: {id: accessId}
				});
			}).then(function () {
				state.mainItemIsDirty = false;
			});
		}

		$scope.saveHook = function (item) {
			basicsWorkflowUIService.prepareSave();
			if (state.mainItemIsDirty) {
				cloudDesktopModalBackgroundService.setModalBackground(true);
				return basicsWorkflowTemplateService.saveItem(item).then(function () {
					cloudDesktopModalBackgroundService.setModalBackground(false);
					//state.mainItemIsDirty = false;
				}, function () {
					cloudDesktopModalBackgroundService.setModalBackground(false);
					//state.mainItemIsDirty = false;
				});
			}
		};

	}

	angular.module('basics.workflow').controller('basicsWorkflowTemplateController',
		['$scope', 'platformModalService', 'platformDialogService', '_', 'basicsWorkflowBaseGridController', 'basicsWorkflowTemplateService',
			'platformGridAPI', 'basicsWorkflowUIService', 'platformModuleStateService', 'basicsWorkflowInstanceService',
			'cloudDesktopModalBackgroundService', '$http', 'basicsWorkflowClipboardService', '$q', 'basicsWorkflowDragDropService',
			'cloudDesktopSidebarService',
			basicsWorkflowTemplateController]);

})(angular);

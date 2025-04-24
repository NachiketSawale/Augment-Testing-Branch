(function (angular) {

	'use strict';
	var moduleName = 'basics.userform';

	angular.module(moduleName).service('basicsUserFormFormDataCommonColumns', function () {

		var service = {};

		service.getStandardConfigForListView = function () {
			return {
				addValidationAutomatically: true,
				columns: [
					{
						id: 'FormFk',
						field: 'FormFk',
						name$tr$: 'cloud.common.entityUserForm',
						name: 'User Form',
						editor: 'lookup',
						editorOptions: {
							lookupDirective: 'basics-lookup-data-by-custom-data-service-grid-less',
							lookupOptions: {
								dataServiceName: 'basicsUserFormLookupService',
								lookupModuleQualifier: 'basicsUserFormLookupService',
								lookupType: 'basicsUserFormLookupService',
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Translated',
								showClearButton: true,
								filterKey: 'user-form-rubric-filter'   // remove outdated forms
							}
						},
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'basicsUserFormLookupService',
							dataServiceName: 'basicsUserFormLookupService',
							displayMember: 'DescriptionInfo.Translated',
							filter: function (item) {
								return item.RubricFk;
							},
							isClientSearch: false
						},
						width: 150
					},
					{
						id: 'Description',
						field: 'FormDataIntersection.DescriptionInfo',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 180,
						formatter: 'translation',
						editor: 'translation'
					},
					{
						field: '__rt$data.history.insertedAt',
						formatter: 'history',
						title: 'Inserted At',
						id: 'insertedat',
						name: 'Inserted At',
						name$tr$: 'cloud.common.entityInsertedAt',
						toolTip: 'Inserted At',
						toolTip$tr$: 'cloud.common.entityInsertedAt'
					},
					{
						field: '__rt$data.history.insertedBy',
						formatter: 'history',
						title: 'Inserted By',
						id: 'insertedby',
						name: 'Inserted By',
						name$tr$: 'cloud.common.entityInsertedBy',
						toolTip: 'Inserted By',
						toolTip$tr$: 'cloud.common.entityInsertedBy'
					},
					{
						field: '__rt$data.history.updatedAt',
						formatter: 'history',
						title: 'Updated At',
						id: 'updatedat',
						name: 'Updated At',
						name$tr$: 'cloud.common.entityUpdatedAt',
						toolTip: 'Updated At',
						toolTip$tr$: 'cloud.common.entityUpdatedAt'
					},
					{
						field: '__rt$data.history.updatedBy',
						formatter: 'history',
						title: 'Updated By',
						id: 'updatedby',
						name: 'Updated By',
						name$tr$: 'cloud.common.entityUpdatedBy',
						toolTip: 'Updated By',
						toolTip$tr$: 'cloud.common.entityUpdatedBy'
					},
					{
						id: 'FormDataStatusFk',
						field: 'FormDataStatusFk',
						name: 'Status',
						name$tr$: 'cloud.common.entityStatus',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'UserFormDataStatus',
							displayMember: 'DescriptionInfo.Translated',
							imageSelector: 'platformStatusIconService'
						},
						readonly: true
					}
				]
			};
		};
		return service;
	});

	angular.module(moduleName).controller('basicsUserFormFormDataController', [
		'_',
		'$scope',
		'$translate',
		'$injector',
		'platformGridControllerService',
		'basicsUserFormFormDataDataService',
		'basicsUserFormFormDataCommonColumns',
		'basicsUserformFormDataValidationService',
		'platformGridAPI',
		'basicsConfigWizardSidebarService',
		'platformPermissionService',
		'userFormOpenMethod',
		function (
			_,
			$scope,
			$translate,
			$injector,
			gridControllerService,
			dataServiceFactory,
			gridColumns,
			validationService,
			platformGridAPI,
			wizardSidebarService,
			platformPermissionService,
			userFormOpenMethod
		) {

			var serviceName = $scope.getContentValue('mainService'),
				rubricId = Number($scope.getContentValue('rubricId')),
				uuid = $scope.getContentValue('uuid'),
				title = $scope.getContentValue('title'),
				parentService = $injector.get(serviceName),
				gridConfig = {initCalled: false, columns: []},
				permissionGUID = $scope.getContentValue('permission'),
				isReadonlyContainer = $scope.getContentValue('isReadonly');

			parentService.uuid = uuid;
			var dataService = dataServiceFactory.getService(parentService, {
				uuid: uuid,
				rubricId: rubricId,
				title: title
			});

			var statusWizardGuid = $scope.getContentValue('statusWizardGuid');
			if (statusWizardGuid) {
				var wizard = wizardSidebarService.getWizardSetupDataMap().get(statusWizardGuid);
				if (wizard) {
					if (_.isEmpty(wizard.userParam)) {
						wizard.userParam = {};
					}
					wizard.userParam.mainService = parentService;
					wizard.userParam.dataService = dataService;
				}
			}

			gridControllerService.initListController($scope, gridColumns, dataService, validationService, gridConfig);

			var previewForm = function () {
				dataService.showFormData(false);
			};

			var editForm = function () {
				dataService.showFormData(true, userFormOpenMethod.NewWindow);
			};

			var editPopForm = function () {
				dataService.showFormData(true, userFormOpenMethod.PopupWindow);
			};

			var toolbarItems = [
				{
					id: 't100',
					caption: 'basics.common.preview.button.previewCaption',
					type: 'item',
					cssClass: 'tlb-icons ico-preview-form',
					fn: previewForm,
					disabled: function () {
						return dataService.isEntitySelected() === false;
					}
				},
				{
					id: 't101',
					caption: 'basics.userform.editBy',
					type: 'dropdown-btn',
					iconClass: 'tlb-icons ico-preview-data',
					list: {
						showImages: true,
						cssClass: 'dropdown-menu-right',
						items: [{
							id: 't-navigation-new-window',
							type: 'item',
							caption: 'basics.userform.newWindow',
							iconClass: 'tlb-icons ico-preview-data',
							fn: editForm
						}, {
							id: 't-navigation-pop-window',
							type: 'item',
							caption: 'basics.userform.popWindow',
							iconClass: 'tlb-icons ico-preview-data',
							fn: editPopForm
						}]
					},
					disabled: function () {
						var hasPermission = platformPermissionService.hasWrite(permissionGUID);
						var selectedEntity = dataService.getSelected();
						var isReadonly = dataService.IsReadOnlyByParentAndSelfStatus();
						return !hasPermission || _.isEmpty(selectedEntity) || isReadonly || isReadonlyContainer;
					}
				}
			];
			$injector.get('platformTranslateService').registerModule(['basics.userform'], true);
			gridControllerService.addTools(toolbarItems);

			var setCellEditable = function (e, args) {
				if (isReadonlyContainer) {
					return false;
				}
				var model = args.column.field, item = args.item, editable = true;
				var formDataReadOnly = dataService.IsReadOnlyByParentAndSelfStatus(item);
				if (formDataReadOnly) {
					return false;
				}
				if ((model === 'FormFk') && item.Version !== 0) {
					editable = false;
				}
				return editable;
			};

			platformGridAPI.events.register($scope.gridId, 'onBeforeEditCell', setCellEditable);
			platformGridAPI.events.register($scope.gridId, 'onDblClick', previewForm);

			// subscriber of data item selection changed event
			function selectedItemChanged() {
				$scope.tools.update();  // force to call disabled fn of toolbar buttons
			}

			dataService.registerSelectionChanged(selectedItemChanged);

			function init() {
				platformPermissionService.loadPermissions([permissionGUID]).then(function () {
					angular.noop();
				});
			}

			init();

			$scope.$on('$destroy', function () {
				platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
				platformGridAPI.events.unregister($scope.gridId, 'onDblClick', previewForm);
				// platformModuleDataExtensionService.unregisterUpdateDataExtensionEvent(onUpdateRequested);
				// dataService.unregisterFormDataSaved(refreshData);
				dataService.unregisterSelectionChanged(selectedItemChanged);
			});
		}
	]);
})(angular);
(function (angular) {
	/*global angular, _*/
	'use strict';
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).controller('ppsItemCommonFormDataController',
		['$scope', '$translate', '$injector',
			'platformGridControllerService',
			'ppsItemCommonFormDataDataService',
			'basicsCommonMandatoryProcessor',
			'ppsItemCommonFormDataUIService',
			'basicsUserformFormDataValidationService',
			'platformGridAPI',
			'basicsConfigWizardSidebarService',
			'platformPermissionService',
			'userFormOpenMethod',
			function ($scope, $translate, $injector,
				gridControllerService,
				dataServiceFactory,
				basicsCommonMandatoryProcessor,
				formDataUIService,
				validationService,
				platformGridAPI,
				wizardSidebarService,
				platformPermissionService,
				userFormOpenMethod) {

				var serviceName = $scope.getContentValue('mainService'),
					rubricId = Number($scope.getContentValue('rubricId')),
					uuid = $scope.getContentValue('uuid'),
					title = $scope.getContentValue('title'),
					gridConfig = {initCalled: false, columns: []},
					permissionGUID = $scope.getContentValue('permission'),
					contextFk = $scope.getContentValue('contextFk'),
					isReadonlyContainer = $scope.getContentValue('isReadonly');

				var parentService = {};
				if(serviceName === 'ppsUpstreamItemDataService'){
					var serviceKey = $scope.getContentValue('serviceKey'),
						parentService0 = $scope.getContentValue('parentService'),
						moduleName = $scope.getContentValue('moduleName'),
						ppsItemColumn = $scope.getContentValue('ppsItemColumn'),
						ppsHeaderColumn = $scope.getContentValue('ppsHeaderColumn'),
						mainItemColumn = $scope.getContentValue('mainItemColumn'),
						upstreamEndRead = $scope.getContentValue('upstreamEndRead');
					parentService = $injector.get(serviceName).getService({serviceKey:serviceKey, parentService:parentService0,module: moduleName, ppsItemColumn:ppsItemColumn, ppsHeaderColumn:ppsHeaderColumn,mainItemColumn:mainItemColumn,endRead:upstreamEndRead});
				}
				else{
					parentService = $injector.get(serviceName);
				}

				parentService.uuid = uuid;
				var dataService = dataServiceFactory.getService(parentService, {
					uuid: uuid,
					rubricId: rubricId,
					title: title,
					contextFk : contextFk,
					route: $scope.getContentValue('route'),
					endRead: $scope.getContentValue('endRead'),
					noCreate: $scope.getContentValue('noCreate'),
					noDelete: $scope.getContentValue('noDelete')
				});

				var statusWizardGuid = $scope.getContentValue('statusWizardGuid');
				if (statusWizardGuid)
				{
					var wizard = wizardSidebarService.getWizardSetupDataMap().get(statusWizardGuid);
					if (wizard) {
						if (_.isEmpty(wizard.userParam)) {
							wizard.userParam = {};
						}
						var mainEntitySerName = $scope.getContentValue('mainEntityService');
						var mainEntitySer = null;
						if(!_.isNil(mainEntitySerName)){
							mainEntitySer = $injector.get(mainEntitySerName);
						}
						wizard.userParam.mainService = mainEntitySer? mainEntitySer : parentService;
						wizard.userParam.dataService = dataService;
					}
				}

				var validSrv = $injector.get('ppsItemCommonFormdataValidationServiceFactory').getService(dataService);
				dataService.setNewEntityValidator(basicsCommonMandatoryProcessor.create({
					typeName: 'FormDataDto',
					moduleSubModule: 'Basics.UserForm',
					validationService: validSrv,
					mustValidateFields: ['FormFk']
				}));



				gridControllerService.initListController($scope, formDataUIService, dataService, validSrv, gridConfig);

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
							},{
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
							//if parent satus is readonly, then the form data should not be editable
							var parentService =	dataService.parentService();
							var isReadonly=dataService.IsReadOnlyByParentAndSelfStatus();
							if(parentService){
								var parentSelectItem = parentService.getSelected();
								if(!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus){
									return true;
								}
							}
							return !hasPermission || _.isEmpty(selectedEntity) || selectedEntity.IsReadonly || isReadonly;
						}
					}
				];

				gridControllerService.addTools(toolbarItems);

				var setCellEditable = function (e, args) {
					// var parentService =	dataService.parentService();
					// if(parentService){
					// 	var parentSelectItem = parentService.getSelected();
					// 	if(!!parentSelectItem && parentSelectItem.IsReadonlyStatus !== undefined && parentSelectItem.IsReadonlyStatus){
					// 		return false;
					// 	}
					// 	else if(parentService.getItemStatus !== undefined) {
					// 		var status = parentService.getItemStatus();
					// 		if(status.IsReadonly){
					// 			return false;
					// 		}
					// 	}
					// }
					// var model = args.column.field, item = args.item, editable = true;
					// if (model === 'FormFk' && item.Version !== 0) {
					// 	editable = false;
					// }
					// return editable;
					if (isReadonlyContainer) {
						return false;
					}
					var model = args.column.field, item = args.item, editable = true;
					var formDataReadOnly=dataService.IsReadOnlyByParentAndSelfStatus(item);
					if(formDataReadOnly){
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
					platformPermissionService.loadPermissions([permissionGUID]).then(function() {
						angular.noop();
					});
				}
				init();

				$scope.$on('$destroy', function () {
					platformGridAPI.events.unregister($scope.gridId, 'onBeforeEditCell', setCellEditable);
					platformGridAPI.events.unregister($scope.gridId, 'onDblClick', previewForm);
					dataService.unregisterSelectionChanged(selectedItemChanged);
				});
			}
		]);
})(angular);
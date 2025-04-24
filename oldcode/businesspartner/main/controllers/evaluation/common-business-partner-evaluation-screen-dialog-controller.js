(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,_  */

	let moduleName = 'businesspartner.main';

	angular.module(moduleName).value('commonBusinessPartnerEvaluationScreenDialogController',
		function ($scope,
			$translate,
			$modalInstance,
			platformDetailControllerService,
			evaluationDetailService,
			evaluationValidationService,
			evaluationDetailUIStandardService,
			platformTranslateService,
			platformGridAPI,
			evaluationGroupService,
			evaluationGroupValidationService,
			evaluationItemService,
			evaluationItemValidationService,
			evaluationDocumentService,
			evaluationDocumentValidationService,
			evaluationClerkService,
			evaluationClerkValidationService,
			evaluationClerkUIStandardService,
			evaluationGroupClerkService,
			evaluationGroupClerkValidationService,
			evaluationGroupClerkUIStandardService,
			dialogTitleTranslation,
			businessPartnerRecalculateService,
			basicsPermissionServiceFactory,
			businessPartnerMainEvaluationPermissionDescriptor,
			busiessPartnerMainEvaluationDynamicGridOption) {

			$scope.getContainerUUID = function () {
				return '1f35308c44f449d0a36de8eb551f7158';
			};

			let myGridConfig = {
				getTranslate: function () {
					return platformTranslateService.instant;
				}
			};
			let businessPartnerMainEvaluationPermissionService = basicsPermissionServiceFactory.getService('businessPartnerMainEvaluationPermissionDescriptor');
			let permission = businessPartnerMainEvaluationPermissionDescriptor.getPermission('EVAL');
			evaluationDetailService.hasWrite = businessPartnerMainEvaluationPermissionService.hasWrite(permission);
			busiessPartnerMainEvaluationDynamicGridOption.reset();
			platformDetailControllerService.initDetailController($scope, evaluationDetailService, evaluationValidationService, evaluationDetailUIStandardService, myGridConfig);
			// Define standard toolbar Icons and their function on the scope
			let toolbarItems = [
				{
					id: 'setting',
					caption$tr$: 'platform.formContainer.settings',
					type: 'item',
					iconClass: 'tlb-icons ico-settings',
					fn: function () {
						$scope.formContainerOptions.formOptions.showConfigDialog();
					}
				}
				/* {
				 id: 't111',
				 sort: 111,
				 caption: 'cloud.common.gridlayout',
				 iconClass: 'tlb-icons ico-settings',
				 type: 'item',
				 fn: function () {
				 platformGridAPI.configuration.openConfigDialog($scope.getContainerUUID());
				 }
				 } */
			];

			$scope.setTools = function (tools) {

				_.remove(tools.items, function (item) {
					return _.some(toolbarItems, function (custom) {
						return (custom !== item && custom.id === item.id) || item.id === 'print' || item.id === 'settingsDropdown';
					});
				});

				_.each(toolbarItems, function (item) {
					if (!_.find(tools.items, {id: item.id})) {
						tools.items.push(item);
					}
				});

				$scope.tools = tools;

				if (!angular.isFunction(tools.update)) {
					$scope.tools.update = function () {/* return; */
					};
				}
			};

			$scope.setTools({
				showImages: true,
				showTitles: true,
				cssClass: 'tools',
				items: toolbarItems,
				update: function () {/* return; */
				}
			});

			$scope.error = {
				show: false,
				messageCol: 1,
				message: '',
				iconCol: 1,
				type: 3
			};

			if (evaluationDetailService.create) {
				if (angular.isFunction(evaluationGroupService.clearRecalcuteError)) {
					evaluationGroupService.clearRecalcuteError();
				}
				evaluationDetailService.createItem();

			} else if (evaluationDetailService.view) {
				if (angular.isFunction(evaluationGroupService.clearRecalcuteError)) {
					evaluationGroupService.clearRecalcuteError();
				}
				evaluationDetailService.load();
			}
			evaluationDetailService.evaluationValidationMessenger.register(updateErrorMessage);

			function updateErrorMessage() {
				$scope.error = {
					show: false,
					messageCol: 1,
					message: '',
					iconCol: 1,
					type: 3
				};
			}

			$scope.modalOptions = {
				closeButtonText: $translate.instant('cloud.common.cancel'),
				actionButtonText: $translate.instant('cloud.common.ok'),
				headerText: $translate.instant(dialogTitleTranslation),
				value: {
					containerUUID: $scope.getContainerUUID()
				}
			};

			$scope.modalOptions.ok = function (result) {
				if ((evaluationDetailService.create?.canSave) ||
					(evaluationDetailService.view?.canSave)) {
					if (evaluationDetailService.isValidatedForUpdateData()) {
						evaluationDetailService.update();
						$modalInstance.close(result);
					} else {
						$scope.error = {
							show: true,
							messageCol: 1,
							message: evaluationDetailService.getValidationError(),
							iconCol: 1,
							type: 3
						};
					}
				} else {
					$modalInstance.close(result);
				}
			};

			$scope.modalOptions.close = function () {
				$scope.$close();
				// $modalInstance.dismiss('cancel');
			};
			// fixed the close button can not close
			$scope.modalOptions.cancel = $scope.modalOptions.close;
			$scope.formContainerOptions.formOptions.configure.skipPermissionCheck = true; // ignore permission check in dialog.

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions
			};
			$scope.groupDataService = evaluationGroupService;
			$scope.groupValidationService = evaluationGroupValidationService;
			$scope.itemDataService = evaluationItemService;
			$scope.itemValidationService = evaluationItemValidationService;
			$scope.documentDataService = evaluationDocumentService;
			$scope.documentValidationService = evaluationDocumentValidationService;
			$scope.evaluationClerkService = evaluationClerkService;
			$scope.evaluationClerkValidationService = evaluationClerkValidationService;
			$scope.evaluationClerkUIStandardService = evaluationClerkUIStandardService;
			$scope.evaluationGroupClerkService = evaluationGroupClerkService;
			$scope.evaluationGroupClerkValidationService = evaluationGroupClerkValidationService;
			$scope.evaluationGroupClerkUIStandardService = evaluationGroupClerkUIStandardService;

			$scope.openUserForm = function (){
				evaluationGroupService.openUserForm(evaluationItemService);
			}

			let detailView = evaluationDetailUIStandardService.getStandardConfigForDetailView();
			let dirty = detailView.dirty;
			detailView.dirty = function (entity, model, options) {
				dirty(entity, model, options);
				$scope.groupDataService.recalculateAll(model);
			};
			// to make sure the grid config in the dialog can be saved by default.
			if (angular.isUndefined(myGridConfig.enableConfigSave) || myGridConfig.enableConfigSave === true) {
				let grid = platformGridAPI.grids.element('id', $scope.getContainerUUID());
				if (grid) {
					grid.enableConfigSave = true;
				}
			}

			$scope.$on('$destroy', function () {
				evaluationDetailService.clearAllData();
				evaluationDetailService.evaluationValidationMessenger.unregister(updateErrorMessage);
				platformGridAPI.grids.unregister($scope.getContainerUUID());
				busiessPartnerMainEvaluationDynamicGridOption.reset();
				evaluationDetailService.clearEntityErrors.fire();
			});
		});
})(angular);
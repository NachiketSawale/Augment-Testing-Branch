(function (angular) {
	'use strict';
	var moduleName = 'constructionsystem.master';
	/* global globals */
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionSystemMasterTestInputController',
		['$scope',
			'platformDetailControllerService',
			'constructionSystemMasterTestDataService',
			'constructionSystemMasterTestInputUIStandardService',
			'constructionSystemMasterTestInputValidationService',
			'constructionSystemMasterTestInputUIStandardHelperService',
			'constructionSystemMasterParameterDataService',
			'constructionSystemMasterParameterGroupDataService',
			'constructionSystemMasterHeaderService',
			'platformModuleStateService',
			'$timeout',
			'$http',
			'basicsUserformCommonService',
			'constructionsystemMasterScriptDataService',

			function ($scope,
				platformDetailControllerService,
				constructionSystemMasterTestDataService,
				constructionSystemMasterTestInputUIStandardService,
				constructionSystemMasterTestInputValidationService,
				constructionSystemMasterTestInputUIStandardHelperService,
				constructionSystemMasterParameterDataService,
				constructionSystemMasterParameterGroupDataService,
				constructionSystemMasterHeaderService,
				platformModuleStateService,
				$timeout,
				$http,
				basicsUserformCommonService,
				constructionsystemMasterScriptDataService) {

				constructionSystemMasterTestDataService.registerSelectionChanged = constructionSystemMasterTestDataService.registerSelectionChanged2('detail');

				platformDetailControllerService.initDetailController(
					$scope,
					constructionSystemMasterTestDataService,
					constructionSystemMasterTestInputValidationService,
					constructionSystemMasterTestInputUIStandardService,
					null);

				initContainer();

				function initContainer() {
				// add toolbars
					$scope.formContainerOptions.customButtons = [
						{
							id: 'execute',
							sort: 0,
							caption: 'constructionsystem.master.taskBarExecute',
							type: 'item',
							iconClass: 'tlb-icons ico-instance-calculate',
							disabled: function () {
								var hasSelection = constructionSystemMasterHeaderService.hasSelection();
								var canExecute = constructionSystemMasterTestDataService.canExecute;
								return !hasSelection || !canExecute;
							},
							fn: constructionSystemMasterTestDataService.execute
						},
						// {
						// 	id: 'execute2',
						// 	sort: 0,
						// 	caption: 'Execute With ClearScript',
						// 	type: 'item',
						// 	iconClass: 'tlb-icons ico-calculate-measurement',
						// 	disabled: function () {
						// 		var hasSelection = constructionSystemMasterHeaderService.hasSelection();
						// 		var canExecute = constructionSystemMasterTestDataService.canExecute;
						// 		return !hasSelection || !canExecute;
						// 	},
						// 	fn: constructionSystemMasterTestDataService.execute2
						// },
						{
							id: 'updateParameter',
							sort: 1,
							caption: 'constructionsystem.master.taskBarUpdate',
							type: 'item',
							iconClass: 'tlb-icons ico-refresh',
							disabled: false,
							fn: function () {
								refreshUI();
							}
						},
						{
							id: 'edit',
							sort: 2,
							caption: 'constructionsystem.master.taskBarEdit',
							type: 'item',
							iconClass: 'tlb-icons ico-preview-data',
							fn: onEditForm,
							disabled: function () {
							// Disable when no cosHeader selected while initializing
								if (!constructionSystemMasterHeaderService.hasSelection()) {
									return true;
								}
								// Disable when BasFormFk is null
								var instanceEntity = constructionSystemMasterHeaderService.getSelected();
								return !angular.isNumber(instanceEntity.BasFormFk);
							}
						}
					];
					$scope.formContainerOptions.onFirstItem = null;
					$scope.formContainerOptions.onPrevItem = null;
					$scope.formContainerOptions.onNextItem = null;
					$scope.formContainerOptions.onLastItem = null;

					constructionSystemMasterTestDataService.registerListLoaded(refreshUI);
					basicsUserformCommonService.formDataSaved.register(onFormSaved);
					constructionSystemMasterTestDataService.scriptValidator.register(constructionSystemMasterTestInputValidationService.validateValue);
					constructionSystemMasterHeaderService.registerSelectionChanged(updateToolBar);
					constructionSystemMasterHeaderService.registerListLoaded(updateToolBar);

					constructionSystemMasterTestDataService.scriptValidator.fire();
					refreshUI();
				}

				function onEditForm() {
					if (constructionSystemMasterHeaderService.hasSelection()) {
						var cosHeaderEntity = constructionSystemMasterHeaderService.getSelected();
						/** @namespace cosHeaderEntity.BasFormDataFk */
						var options = {
							formId: cosHeaderEntity.BasFormFk,
							formDataId: cosHeaderEntity.BasFormDataFk,
							editable: true,
							setReadonly: false,
							modal: true
						};
						basicsUserformCommonService.editData(options);
					}
				}

				function onFormSaved(basFormDataId) {
					if (constructionSystemMasterHeaderService.hasSelection()) {
						var cosHeaderEntity = constructionSystemMasterHeaderService.getSelected();
						if (!cosHeaderEntity) {
							return;
						}

						// todo: remove the server side validation for parameters input by user form temporarily, defect 75218
						if (!cosHeaderEntity.BasFormDataFk) {
							cosHeaderEntity.BasFormDataFk = basFormDataId;
						}

						var request = {
							CosHeaderId: cosHeaderEntity.Id,
							FormDataId: basFormDataId
						};
						/*
					var validateUrl = globals.webApiBaseUrl + 'constructionsystem/master/parameter/validateformdatadetail';
					$http.post(validateUrl, request).then(function (response) {
						var errorList = response.data;
						if(errorList.length > 0) {
							var cosParameters = constructionSystemMasterParameterDataService.getList();
							var formInfo = {
								FormId: cosHeaderEntity.BasFormFk,
								FormDataId: cosHeaderEntity.BasFormDataFk
							};
							errorFormInputDialogService.showDialog(cosHeaderEntity, errorList, cosParameters, formInfo);
						} else { */
						var updateUrl = globals.webApiBaseUrl + 'constructionsystem/master/testinput/updatebyformdata';
						$http.post(updateUrl, request).then(function () {
							// reload data from server
							constructionsystemMasterScriptDataService.doHttpListOrCreate(cosHeaderEntity.Id).then(function (response) {
								if(response.data.length > 0) {
									constructionsystemMasterScriptDataService.currentItem = response.data[0];
								}
								constructionSystemMasterTestDataService.load().then(function () {
									constructionSystemMasterTestDataService.execute();
								});
							});
						});
						// }
					// });
					}
				}

				function refreshUI() {
					$timeout(function () {
						$scope.currentItem = constructionSystemMasterTestDataService.getCurrentEntity();
						constructionSystemMasterTestInputUIStandardHelperService.GenerateNewUIStandard(constructionSystemMasterTestDataService.getParameterGroups() || [],
							constructionSystemMasterTestDataService.getParameterList() || []);
						$scope.$broadcast('form-config-updated');
					}, 0);
				}

				function updateToolBar() {
				// var isNeedUpdate = false;
				// var executeBtn = _.find($scope.formContainerOptions.customButtons, {id: 'execute'});
				// if ((constructionSystemMasterHeaderService.getList().length === 0 || !constructionSystemMasterHeaderService.getSelected()) &&
					// eslint-disable-next-line no-tabs
				// 	!executeBtn.disabled) {
				//    executeBtn.disabled = true;
				//    isNeedUpdate = true;
				// } else if ((constructionSystemMasterHeaderService.getList().length > 0 && constructionSystemMasterHeaderService.getSelected()) &&
				//   executeBtn.disabled) {
				//   executeBtn.disabled = false;
				//   isNeedUpdate = true;
				// }
				//
				// if (isNeedUpdate) {
				//    $scope.tools.update();
				// }
				//
				// // if the formFk is null, disable the edit button
				// var editBtn = _.find($scope.formContainerOptions.customButtons, {id: 'edit'});
				// if(constructionSystemMasterHeaderService.hasSelection()) {
				//    var cosHeaderEntity = constructionSystemMasterHeaderService.getSelected();
				//    if(angular.isNumber(cosHeaderEntity.BasFormFk) && editBtn.disabled) {
				//      editBtn.disabled = false;
				//    } else if(!angular.isNumber(cosHeaderEntity.BasFormFk) && !editBtn.disabled) {
				//      editBtn.disabled = true;
				//    }
				//    $scope.tools.update();
				// } else {
				//    // if edit button is not disable after refresh, disable it
				//    if(!editBtn.disabled) {
				//       editBtn.disabled = true;
				//       $scope.tools.update();
				//   }
				// }

					$scope.tools && $scope.tools.update();
				}

				var unWatchCanExecute = $scope.$watch(function () {
					return constructionSystemMasterTestDataService.canExecute;
				},function () {
					updateToolBar();
				});

				$scope.$on('$destroy', function () {
					constructionSystemMasterTestDataService.unregisterListLoaded(refreshUI);
					constructionSystemMasterTestDataService.scriptValidator.unregister(constructionSystemMasterTestInputValidationService.validateValue);
					basicsUserformCommonService.formDataSaved.unregister(onFormSaved);
					constructionSystemMasterHeaderService.unregisterSelectionChanged(updateToolBar);
					constructionSystemMasterHeaderService.unregisterListLoaded(updateToolBar);


					unWatchCanExecute();
				});

			}]);
})(angular);
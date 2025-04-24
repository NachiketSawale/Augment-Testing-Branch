/**
 * Created by wui on 2/21/2017.
 */
/* glabal _ */

(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'constructionsystem.project';

	angular.module(moduleName).controller('constructionSystemProjectCopyInstanceHeaderController', [
		'$scope',
		'$filter',
		'modelKind',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'constructionSystemProjectCopyInstanceHeaderUIConfigService',
		'constructionSystemProjectInstanceHeaderService',
		'constructionSystemProjectInstanceHeaderValidationService',
		'constructionSystemProjectCosInstanceGridConfigService',
		'platformGridAPI',
		'constructionSystemProjectCompareCosService', '$http', '$translate',
		'constructionSystemProjectCosInstanceFlagImageService',
		'constructionSystemMainInstanceService',
		'platformModuleNavigationService',
		'constructionSystemProjectEstimateMode',
		function (
			$scope,
			$filter,
			modelKind,
			platformRuntimeDataService,
			platformDataValidationService,
			constructionSystemProjectCopyInstanceHeaderUIConfigService,
			constructionSystemProjectInstanceHeaderService,
			constructionSystemProjectInstanceHeaderValidationService,
			constructionSystemProjectCosInstanceGridConfigService,
			platformGridAPI,
			constructionSystemProjectCompareCosService, $http, $translate,
			constructionSystemProjectCosInstanceFlagImageService,
			constructionSystemMainInstanceService,
			naviService,
			constructionSystemProjectEstimateMode) {
			var formConfig = constructionSystemProjectCopyInstanceHeaderUIConfigService.create(modelKind).getStandardConfigForDetailView();
			var dataItem = constructionSystemProjectInstanceHeaderService.getSelected();

			_.forEach(formConfig.rows, function (row) {
				if(row.model === 'CosToEstModeFk'){
					row.validator = function (entity, value) {
						$scope.currentItem.IsIncremental = (value === constructionSystemProjectEstimateMode.incremental);

						if($scope.currentItem.IsIncremental) {
							$scope.currentItem.EstimateHeaderFk = dataItem.EstimateHeaderFk;
							$scope.currentItem.PsdScheduleFk = dataItem.PsdScheduleFk;
							$scope.currentItem.BoqHeaderFk = dataItem.BoqHeaderFk;
						}

						readonly($scope.currentItem.IsIncremental);
					};
				}
				else{
					row.validator = constructionSystemProjectInstanceHeaderValidationService['validate' + row.model];
					row.asyncValidator = constructionSystemProjectInstanceHeaderValidationService['asyncValidate' + row.model];
				}
			});

			$scope.errors = [];
			$scope.infos = [];
			$scope.currentItem = angular.copy(dataItem);
			$scope.currentItem.Id = -1; // unique validation.
			$scope.currentItem.ModelFk = null;
			// $scope.currentItem.EstimateHeaderFk = -1;
			// $scope.currentItem.PsdScheduleFk = null;
			$scope.currentItem.Code = '';
			$scope.currentItem.Description = '';
			$scope.currentItem.ModelOldFk = dataItem.ModelFk;
			$scope.currentItem.CosToEstModeFk = constructionSystemProjectEstimateMode.original;
			$scope.currentItem.IsIncremental = false;

			// delete entity view state.
			delete $scope.currentItem.__rt$data;

			$scope.formContainerOptions = {
				formOptions: {
					configure: formConfig
				}
			};

			$scope.canNext = function () {
				return !$scope.errors.length && (($scope.currentItem.CosToEstModeFk === constructionSystemProjectEstimateMode.original) || ($scope.currentItem.ModelFk >= 0)) &&
					$scope.currentItem.EstimateHeaderFk >= 0 && $scope.currentItem.Code;
			};

			$scope.$on('$destroy', function () {
				// remove validation error from module state.
				platformDataValidationService.removeDeletedEntityFromErrorList($scope.currentItem, constructionSystemProjectInstanceHeaderService);
			});


			var gridId = 'AF2CE9065A57457AB4905F671B65E70C';
			var gridConfig = constructionSystemProjectCosInstanceGridConfigService.provideGridConfig(gridId);
			$scope.gridData = {
				state: gridId,
				config: gridConfig,
				moduleState: {}
			};
			$scope.stepStack = [];
			$scope.currentStep = null;
			$scope.modalOptions = [];

			if (!platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.grids.config(gridConfig);
			}

			var cosInstanceHeaderId = null;
			var cosInstances = [];

			// $scope.automatically = false;
			$scope.applySelectionStatement = true;
			$scope.applyCalculation = false;
			$scope.applyEstimate = false;
			$scope.updateOnApply = false;
			$scope.overrideOnApply = false;
			$scope.keepCosInstance = false;

			$scope.onOptionChange = function (option, value) {
				$scope[option] = value;

				if (option === 'applyCalculation' && !value) {
					$scope.applyEstimate = false;
				}

				if (option === 'applyEstimate' && value) {
					$scope.applyCalculation = true;
				}
			};

			var step1 = {
				number: 0,
				title$tr$: 'cloud.common.deepCopy',
				buttons: [
					{
						label: 'constructionsystem.project.labelNext',
						disable: function () {
							return !$scope.canNext();
						},
						action: goToNext
					},
					{
						label: 'cloud.common.cancel',
						action: close
					}
				],
				messages: []
			};
			var step2 = {
				number: 1,
				buttons: [
					{
						label: 'cloud.common.ok',
						action: update
					},
					{
						label: 'cloud.common.cancel',
						action: deleteCreatedInstanceHeader
					}
				],
				messages: []
			};
			var step3 = {
				number: 2,
				title: 'Estimate result apply options',
				buttons: [
					// {
					// label: $translate.instant('platform.wizard.back'),
					// action: function (){
					// goTo(step2);
					// }
					// },
					{
						label: $translate.instant('platform.wizard.finish'),
						action: finish
					},
					{
						label: $translate.instant('platform.cancelBtn'),
						action: deleteCreatedInstanceHeader
					}
				],
				messages: []
			};
			var createItem = [];

			function goTo(step) {
				if ($scope.currentStep) {
					$scope.stepStack.push($scope.currentStep);
				}
				$scope.currentStep = step;
			}

			function goToNext() {
				$scope.currentItem.Id = dataItem.Id;
				var data = $scope.currentItem;
				var result = constructionSystemProjectInstanceHeaderValidationService.validateEstimateHeaderFk(data, data.EstimateHeaderFk);

				if((_.isBoolean(result) && !result) || (_.isObject(result) && !result.valid)) {
					return;
				}

				$scope.isLoading = true;
				$scope.infos = [];
				$http.post(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/deepcopy', data).then(function (response) {
					createItem = response.data;
					cosInstanceHeaderId = createItem.Id;
					$scope.isLoading = false;

					if(createItem.IsAborted) {
						$scope.infos = [createItem.Message];
					}
					else if(createItem.ModelFk === null || createItem.ModelFk === undefined || _.isNil(createItem.MdlChangeSetFk)){
						close();
					}
					else{
						goTo(step2);

						constructionSystemProjectCompareCosService.compare({
							TargetId: createItem.Id,
							SourceId: dataItem.Id,
							ObjectFilterDef: null
						}).then(function (res) {
							var flags = res.data.CosFlags;
							cosInstances = res.data.CosInstances || [];
							if (angular.isArray(flags)) {
								step2.messages = flags.map(makeFlagCountMessage);
							}
							if (angular.isArray(cosInstances)) {
								platformGridAPI.items.data(gridId, cosInstances);
							}
						});
					}
				});
			}

			function makeFlagCountMessage(dataItem) {
				var text = '';

				switch (dataItem.Flag) {
					case 1:
						text = $translate.instant('constructionsystem.project.labelInstanceUpdated');
						break;
					case 2:
						text = $translate.instant('constructionsystem.project.labelInstanceDeleted');
						break;
					case 3:
						text = $translate.instant('constructionsystem.project.labelInstanceKept');
						break;
					case 4:
						text = $translate.instant('constructionsystem.project.labelInstanceNew');
						break;
					case 5:
						text = $translate.instant('constructionsystem.project.labelObjectWithoutCos');
						break;
					case 6:
						text = $translate.instant('constructionsystem.project.labelObjectIgnored');
						break;
					case 7:
						text = $translate.instant('constructionsystem.project.labelInstanceChanged');
						break;
					case 8:
						text = $translate.instant('constructionsystem.project.labelInstanceNoChanged');
						break;
				}

				return '<img src="$$src$$"/><span>$$text$$</span>'
					.replace(/\$\$src\$\$/gm, constructionSystemProjectCosInstanceFlagImageService.getImage(dataItem.Flag))
					.replace(/\$\$text\$\$/gm, dataItem.Count + ' ' + text);
			}

			$scope.deepcopyclose = function deepcopyclose() {
				if (createItem.Id) {
					$scope.$close({ok: true, data: createItem});
				}
				else {
					$scope.$close({ok: false});
				}
			};

			function close() {
				$scope.deepcopyclose();
			}

			function finish() {
				close();
				autoUpdateFromDeepCopy(cosInstances);
			}

			function deleteCreatedInstanceHeader() {
				$scope.isLoading = true;

				$http.get(globals.webApiBaseUrl + 'constructionsystem/project/instanceheader/deleteinstanceheader?InstanceHeaderId=' + createItem.Id).then(function () {
					$scope.isLoading = false;
					$scope.$close({ok: false});
				});
			}

			function update() {
				if ($scope.applyEstimate) {
					goTo(step3);
				}
				else {
					close();
					autoUpdateFromDeepCopy(cosInstances);
				}
			}

			function autoUpdateFromDeepCopy(cosInstances) {
				constructionSystemProjectCompareCosService.autoUpdate({
					cosInsHeaderId: cosInstanceHeaderId,
					cosInstances: cosInstances,
					isAutoSelectionStatement: $scope.applySelectionStatement,
					isAutoCalculate: $scope.applyCalculation,
					isAutoApply: $scope.applyEstimate,
					updateOnApply: $scope.updateOnApply,
					overrideOnApply: $scope.overrideOnApply,
					keepCosInstance: $scope.keepCosInstance
				}).then(function () {
					constructionSystemProjectInstanceHeaderService.callRefresh();
					var navigator = {moduleName: 'constructionsystem.main'};
					if (constructionSystemMainInstanceService.isSelection(createItem)) {
						naviService.navigate(navigator, createItem, 'Code');
					}
				});
			}

			function readonly(value) {
				platformRuntimeDataService.readonly($scope.currentItem, [
					{
						field: 'EstimateHeaderFk',
						readonly: value
					},
					{
						field: 'PsdScheduleFk',
						readonly: value
					},
					{
						field: 'BoqHeaderFk',
						readonly: value
					}
				]);
			}

			goTo(step1);
			readonly($scope.currentItem.IsIncremental);
		}

	]);

})(angular);
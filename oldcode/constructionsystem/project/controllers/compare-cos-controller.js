/**
 * Created by wui on 2/27/2017.
 */
/* global _ */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	/* jshint -W072 */ // This function has too many parameters
	angular.module(moduleName).controller('constructionSystemProjectCompareCosController', [
		'$scope',
		'$translate',
		'params',
		'platformGridAPI',
		'constructionSystemProjectCompareCosService',
		'constructionSystemProjectCosInstanceGridConfigService',
		'constructionSystemProjectCosInstanceFlagImageService',
		'constructionSystemProjectInstanceHeaderService',
		'constructionSystemMainInstanceService',
		'platformModuleNavigationService',
		function (
			$scope,
			$translate,
			params,
			platformGridAPI,
			constructionSystemProjectCompareCosService,
			constructionSystemProjectCosInstanceGridConfigService,
			constructionSystemProjectCosInstanceFlagImageService,
			constructionSystemProjectInstanceHeaderService,
			constructionSystemMainInstanceService,
			naviService) {

			var selectedCosItem = constructionSystemProjectInstanceHeaderService.getSelected();
			var step1 = {
				number: 0,
				title: 'constructionsystem.project.titleCompare',
				buttons: [
					{
						label: 'constructionsystem.project.labelNext',
						disable: function () {
							return !canToNext();
						},
						action: goToStep2
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
				title: 'constructionsystem.project.titleCompareOverview',
				buttons: [
					{
						label: 'constructionsystem.project.labelUpdateOnly',
						action: updateOnly
					},
					{
						label: 'constructionsystem.project.labelupdateCaculateCOS',
						action: updateCaculateCOS
					},
					{
						label: 'constructionsystem.project.labelUpdateManual',
						action: close
					}
				],
				messages: []
			};

			var step3 = {
				number: 2,
				title: 'Estimate result apply options',
				buttons: [
					{
						label: $translate.instant('platform.wizard.finish'),
						action: finish
					},
					{
						label: $translate.instant('platform.cancelBtn'),
						action: close
					}
				],
				messages: []
			};

			var gridId = 'D0D513961C9F4E42B149B30D5849F300';

			var gridConfig = constructionSystemProjectCosInstanceGridConfigService.provideGridConfig(gridId);

			var cosInstances = [];

			params.project = params.project || {};
			params.insHeader = params.insHeader || {};

			$scope.stepStack = [];
			$scope.currentStep = null;

			$scope.config = {
				project: {
					lookupDirective: 'basics-lookup-data-project-project-dialog',
					descriptionMember: 'ProjectName',
					lookupOptions: {
						readOnly: true
					}
				},
				cosInsHeader1: {
					lookupDirective: 'construction-system-project-instance-header-lookup',
					descriptionMember: 'Description',
					lookupOptions: {
						filterOptions: getCosInsHeader1Filter()
					}
				},
				cosInsHeader2: {
					lookupDirective: 'construction-system-project-instance-header-lookup',
					descriptionMember: 'Description',
					lookupOptions: {
						filterOptions: getCosInsHeader2Filter()
					}
				},
				filterDef: {
					events: [
						{
							name: 'onEditValueChanged',
							handler: function (e, args) {
								$scope.context.filterDef = args.selectedItem ? args.selectedItem.filterDef : null;
							}
						}
					]
				}
			};

			$scope.context = {
				projectId: params.project.Id,
				cosInsHeader1Id: params.insHeader.Id,
				cosInsHeader2Id: null,
				filterDefId: null, // model object filter definition
				filterDef: null,
				isEnterprise: false
			};

			$scope.gridData = {
				state: gridId,
				config: gridConfig,
				moduleState: {}
			};

			$scope.modalOptions = [];

			if (!platformGridAPI.grids.exist(gridId)) {
				// ToDo: Old version - 2BRemoved when init via scope works
				platformGridAPI.grids.config(gridConfig);
			}

			$scope.applyEstimate = false;
			$scope.onAutoClick = function onAutoClick() {
				$scope.applyEstimate = !$scope.applyEstimate;
			};

			var updateRequest = {
				cosInsHeaderId: $scope.context.cosInsHeader1Id,
				isAutoCalculate: true,
				isAutoApply: false
			};

			goTo(step1);

			function close() {
				$scope.$close(false);
			}

			function goTo(step) {
				if ($scope.currentStep) {
					$scope.stepStack.push($scope.currentStep);
				}
				$scope.currentStep = step;
			}

			function getCosInsHeader1Filter() {
				return {
					fn: function (dataItem) {
						return dataItem.ProjectFk === $scope.context.projectId &&
							dataItem.Id !== $scope.context.cosInsHeader2Id;
					}
				};
			}

			function getCosInsHeader2Filter() {
				return {
					fn: function (dataItem) {
						return ($scope.context.isEnterprise || dataItem.ProjectFk === $scope.context.projectId) &&
							dataItem.Id !== $scope.context.cosInsHeader1Id;
					}
				};
			}

			function goToStep2() {
				$scope.isLoading = true;
				goTo(step2);
				constructionSystemProjectCompareCosService.compare({
					TargetId: $scope.context.cosInsHeader1Id,
					SourceId: $scope.context.cosInsHeader2Id,
					ObjectFilterDef: $scope.context.filterDef
				}).then(function (res) {
					var flags = res.data.CosFlags;

					cosInstances = res.data.CosInstances;

					if (angular.isArray(flags)) {
						step2.messages = flags.map(makeFlagCountMessage);
					}

					if (angular.isArray(cosInstances)) {
						platformGridAPI.items.data(gridId, cosInstances);
					}
					$scope.isLoading = false;
				});
			}

			function canToNext() {
				return $scope.context.projectId !== null && $scope.context.projectId !== undefined && $scope.context.cosInsHeader1Id !== null && $scope.context.cosInsHeader1Id !== undefined && $scope.context.cosInsHeader2Id !== null && $scope.context.cosInsHeader2Id !== undefined;
			}

			function updateOnly() {
				updateRequest.isAutoCalculate = false;
				autoUpdate();
			}

			function updateCaculateCOS() {
				if ($scope.applyEstimate) {
					goTo(step3);
				}
				else {
					updateRequest.isAutoCalculate = true;
					autoUpdate();
				}
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
				}

				return '<img src="$$src$$"/><span>$$text$$</span>'
					.replace(/\$\$src\$\$/gm, constructionSystemProjectCosInstanceFlagImageService.getImage(dataItem.Flag))
					.replace(/\$\$text\$\$/gm, dataItem.Count + ' ' + text);
			}

			function finish() {
				updateRequest.IsAutoApply = true;
				autoUpdate();
			}

			function autoUpdate() {
				close();
				updateRequest.cosInstances = cosInstances;
				constructionSystemProjectCompareCosService.autoUpdate(updateRequest).then(function () {
					constructionSystemProjectInstanceHeaderService.callRefresh();
					var navigator = {moduleName: 'constructionsystem.main'};
					if (constructionSystemMainInstanceService.isSelection(selectedCosItem)) {
						naviService.navigate(navigator, selectedCosItem, 'Code');
					}
					else {
						var entities = constructionSystemProjectInstanceHeaderService.getList();
						_.forEach(entities, function (item) {
							if (item.Id === $scope.context.cosInsHeader1Id) {
								naviService.navigate(navigator, item, 'Code');
							}
						});
					}
				});
			}
		}
	]);

})(angular);
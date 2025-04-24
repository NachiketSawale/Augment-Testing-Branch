(function (angular) {
	'use strict';
	angular.module('basics.material').controller('forecastWizardController', [
		'$scope',
		'WizardHandler',
		'$log',
		'platformGridAPI',
		'platformTranslateService',
		'$http',
		'documentsProjectDocumentModuleContext',
		function (
			$scope,
			WizardHandler,
			$log,
			platformGridAPI,
			platformTranslateService,
			$http,
			documentsProjectDocumentModuleContext) {

			$scope.steps = [
				{number: 0, identifier: 'basic', name: 'basic'},
				{number: 1, identifier: 'structure', name: 'structire'}
			];

			$scope.wizardName = $scope.modalOptions.value.wizardName;
			$scope.wizard = $scope.modalOptions.value.wizard;
			$scope.entity = $scope.modalOptions.value.entity;
			$scope.isStep1 = true;
			$scope.isReset = false;
			$scope.currentStep = angular.copy($scope.steps[0]);
			$scope.levelData = {level: 4}; // defined level data

			var criteriaGridId = '52C6AB73B7BD4F8F9B560308AC3C750E';

			$scope.wizardCommands = {
				finish: function () {
					var grid = platformGridAPI.grids.element('id', criteriaGridId);
					var gridDatas = grid.dataView.getRows();

					$http.post(globals.webApiBaseUrl + 'basics/material/Forecast', gridDatas)
						.then(function () {
						});

					$scope.$close();

				}
			};

			$scope.getEnabledSteps = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.getEnabledSteps();
				} else {
					return [];
				}
			};

			$scope.getCurrentStepNumber = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.currentStepNumber();
				} else {
					return '';
				}
			};

			$scope.getTotalStepCount = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				if (wz) {
					return wz.totalStepCount();
				} else {
					return '';
				}
			};
			// todo  defined  footer bar name
			$scope.wzStrings = {
				stepFinish: 'stepFinish',
				back: 'Back',
				next: 'Next',
				cancel: 'Cancel',
				finish: 'Finish',
				nextStep: 'NEXT STEP',
				reset: 'Finish'
			};

			// defined Column Name
			var criteriaGridColumns = [{
				id: 'Code',
				field: 'Code',
				name: 'Material Group',
				width: 90,
				readonly: 'true',
				formatter: 'description'
			}, {
				id: 'DescriptionInfo',
				field: 'DescriptionInfo',
				name: 'Material Group Description',
				readonly: 'true',
				width: 150
			}, {
				id: 'MaterialCode',
				field: 'MaterialCode',
				name: 'Material Code',
				readonly: 'true',
				width: 100
			}, {
				id: 'Description',
				field: 'Description',
				name: 'Material Description',
				readonly: 'true',
				width: 200
			}, {
				id: 'MaterialUom',
				field: 'Uom',
				name: 'UoM',
				readonly: 'true',
				width: 100,
				formatter: 'lookup',
				formatterOptions: {
					displayMember: 'Unit',
					lookupType: 'uom'
				},
				editor: 'lookup',
				editorOptions: {
					lookupDirective: 'basics-lookupdata-uom-lookup'
				}

			}];

			(function () {
				for (var i = 1; i <= 12; i++) {
					var date = new Date();
					date.setMonth(date.getMonth() + i);
					var month = date.toDateString().split(' ')[1];
					var forecast = {
						id: month,
						field: month,
						name: month,
						width: 90,
						readonly: 'false',
						formatter: 'quantity',
						editor: 'quantity'
					};
					criteriaGridColumns.push(forecast);
				}
			})();

			$scope.selectItemForPackage = {
				state: criteriaGridId
			};

			function setupCriteriaGrid() {
				if (!platformGridAPI.grids.exist(criteriaGridId)) {
					var criteriaGridConfig = {
						columns: angular.copy(criteriaGridColumns),
						data: [],
						id: criteriaGridId,
						lazyInit: true,
						options: {
							tree: true,
							parentProp: 'MdcMaterialGroupFk', //todo need change
							childProp: 'ChildItems',
							hierarchyEnabled: true,
							indicator: true,
							idProperty: 'Id',
							iconClass: ''
						}
					};
					platformGridAPI.grids.config(criteriaGridConfig);
					platformTranslateService.translateGridConfig(criteriaGridConfig.columns);
				}
			}

			function updateCriteriaGrid(selectedData) {
				platformGridAPI.grids.invalidate(criteriaGridId);
				platformGridAPI.items.data(criteriaGridId, selectedData);
			}

			$scope.nextStep = function () {
				var wz = WizardHandler.wizard($scope.wizardName);
				//var data = $scope.levelData;
				if ($scope.getCurrentStepNumber() === 1) {
					setupCriteriaGrid(); // defined Grid Column
					var projectMainService = documentsProjectDocumentModuleContext.getConfig().parentService;
					var selectedProject = projectMainService.getSelected();
					$http.post(globals.webApiBaseUrl + 'basics/material/ForecastInfo', {catalogId: selectedProject.Id, level: $scope.levelData.level})
						.then(function (response) {
							updateCriteriaGrid(response.data);
							$scope.isReset = true;
							$scope.canFinish = true;
						});
				}
				wz.next();
			};

		}
	]);
})(angular);

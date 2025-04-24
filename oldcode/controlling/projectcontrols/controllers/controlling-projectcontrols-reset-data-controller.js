
(function(angular) {
	/* _ */
	'use strict';

	let moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).controller('controllingProjectControlsResetDataController', ['$scope','$translate', '$injector', 'platformTranslateService', 'platformSidebarWizardConfigService',
		function ($scope, $translate, $injector, platformTranslateService, platformSidebarWizardConfigService) {

			$scope.modalOptions.headerText = $translate.instant('controlling.projectcontrols.resetdata');

			$scope.dataItem = {
				formulas: []
			};

			function getFormulaProps(){
				let formulaProps = [];

				let configService =  $injector.get('controllingProjectControlsConfigService');
				let config = configService.getConfig();
				let editableFormula = [];
				if(config && _.isArray(config.MdcContrFormulaPropDefs)){
					editableFormula = _.filter(config.MdcContrFormulaPropDefs, function (formula) {
						return formula.IsEditable;
					});
				}

				if(editableFormula.length > 0){
					_.forEach(editableFormula, function(formula){
						if(!formula){
							return;
						}

						formulaProps.push({
							rid: formula.Id, //'updateSAC',
							gid: 'baseGroup',
							label: formula.DescriptionInfo ? formula.DescriptionInfo.Description : formula.Code,//'Update Staging Actuals',
							label$tr$: formula.DescriptionInfo ? formula.DescriptionInfo.Translated : formula.Code,//'controlling.projectcontrols.sac',
							type: 'boolean',
							model: formula.Code,
							sortOrder: 1,
							change: function (dataItem,modelName,c) {
								c.isSelected = dataItem[modelName];
							}
						});
					});
				}
				$scope.dataItem.formulas = formulaProps;
				return formulaProps;
			}



			function getFormConfiguration(){
				let config = {
					fid: 'controlling.projectcontrols.resetdata',
					version: '0.1.1',
					showGrouping: false,
					groups: [
						{
							gid: 'baseGroup',
							attributes: ['selecteditem']
						}
					],
					'overloads': {},
					rows: getFormulaProps()
				};

				platformTranslateService.translateFormConfig(config);
				config.scope = platformSidebarWizardConfigService.getCurrentScope();
				return config;
			}


			$scope.formOptions = {
				configure: getFormConfiguration()
			};

			$scope.formContainerOptions = {
				formOptions: $scope.formOptions,
				setTools: function () {
				}
			};

			$scope.onOK = function () {
				$scope.$close({ok: true, data: $scope.dataItem.formulas});
			};

			$scope.onCancel = function () {
				$scope.$close({});
			};

			$scope.isDisable = function () {
				if($scope.dataItem.formulas.length > 0){
					return !_.find($scope.dataItem.formulas, function (formula) {
						return formula.isSelected;
					});
				}
				return true;
			};

			$scope.modalOptions.cancel = function () {
				$scope.$close(false);
			};

			$scope.$on('$destroy', function () {

			});

		}]);
})(angular);

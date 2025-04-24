/**
 * Created by anl on 5/9/2019.
 */
/*jshint -W061*/

(function (angular) {
	'use strict';

	var moduleName = 'productionplanning.accounting';

	angular.module(moduleName).service('productionPlanningAccountingResultCheckService', ResultCheckService);

	ResultCheckService.$inject = ['platformTranslateService',
		'productionplanningAccountingResultDataService',
		'platformRuntimeDataService'];

	function ResultCheckService(platformTranslateService,
								resultDataService,
								platformRuntimeDataService) {
		var service = {};
		var result;

		function initResult() {
			result = resultDataService.getSelected();
		}

		function wrap(code) {
			return '(function(){\n' + code + '\n})()';
		}

		function generateScript(formula, value) {
			var script = '';
			script += 'var value = ' + value + ';\n';
			script += formula;
			return wrap(script);
		}


		function initForm($scope) {

			var formConfig = {
				fid: 'productionplanning.accounting.result.checkForm',
				showGrouping: false,
				addValidationAutomatically: false,
				skipPermissionCheck: true,
				groups: [
					{
						gid: 'baseGroup',
						header: 'productionplanning.accounting.entityResult',
						isOpen: true,
						attributes: ['Formula', 'Value', 'Output']
					}
				],
				rows: [
					{
						gid: 'baseGroup',
						rid: 'formula',
						label: '*Formula',
						label$tr$: 'productionplanning.accounting.result.quantityFormula',
						model: 'Formula',
						sortOrder: 1,
						type: 'text',
						validator: function (entity, value) {
							var script = generateScript(value, 1);
							try {
								eval(script);
								platformRuntimeDataService.applyValidationResult(true, entity, 'Output');
							}
							catch (e) {
								var res = {};
								res.valid = false;
								res.apply = true;
								res.error = e.message;
								platformRuntimeDataService.applyValidationResult(res, entity, 'Output');
							}
						}
					},
					{
						gid: 'baseGroup',
						rid: 'value',
						label: '*Value',
						label$tr$: 'productionplanning.accounting.result.inputValue',
						model: 'Value',
						sortOrder: 2,
						type: 'description'
					},
					{
						gid: 'baseGroup',
						rid: 'output',
						label: '*Output',
						label$tr$: 'productionplanning.accounting.result.output',
						model: 'Output',
						sortOrder: 3,
						type: 'description',
						readonly: true
					}
				]
			};
			$scope.formOptions = {
				entity: {
					Id: result.Id,
					Formula: result.QuantityFormula,
					Value: '',
					Output: ''
				},
				configure: platformTranslateService.translateFormConfig(formConfig)
			};
		}

		service.initDialog = function ($scope) {
			initResult();
			initForm($scope);
		};

		service.changedFormula = function ($scope) {
			return result.QuantityFormula !== $scope.formOptions.entity.QuantityFormula;
		};

		service.executeFormula = function (formula, value) {
			var script = generateScript(formula, value);
			try {
				return eval(script);
			}
			catch (e) {
				// eslint-disable-next-line no-console
				console.error(e.message);
				return 'Error';
			}
		};

		return service;
	}

})(angular);

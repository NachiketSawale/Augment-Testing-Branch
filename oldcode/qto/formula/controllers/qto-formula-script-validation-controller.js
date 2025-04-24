/**
 * Created by LQ on 19/13/2018.
 */

(function (angular) {
	'use strict';

	let moduleName = 'qto.formula';

	angular.module(moduleName).controller('qtoFormulaScriptValidationController', [
		'$scope',
		'$timeout',
		'qtoFormulaScriptDataService',
		'basicsCommonScriptControllerService',
		'qtoFormulaValidationScriptTranslationDataService',
		function ($scope,
			$timeout,
			qtoFormulaScriptDataService,
			basicsCommonScriptControllerService,
			qtoFormulaValidationScriptTranslationDataService) {

			let options = {
				scriptId: 'qto.formula.script.validation',
				apiId: 'QTO.Formula',
				apiDef: {
					'data': {
						'Validator': {
							'!type': 'fn()',
							'prototype': {
								'check': {
									'!type': 'fn(parameter: string, condition: ?, error: string) -> +Validator',
									'!doc': 'fn(parameter: string, condition: ?, error: string) -> +Validator'
								},
								'hide': {
									'!type': 'fn(parameter: string, condition: ?) -> +Validator',
									'!doc': 'fn(parameter: string, condition: ?) -> +Validator'
								},
								'show': {
									'!type': 'fn(parameter: string, condition: ?) -> +Validator',
									'!doc': 'fn(parameter: string, condition: ?) -> +Validator'
								},
								'enable': {
									'!type': 'fn(parameter: string, condition: ?) -> +Validator',
									'!doc': 'fn(parameter: string, condition: ?) -> +Validator'
								},
								'disable': {
									'!type': 'fn(parameter: string, condition: ?) -> +Validator',
									'!doc': 'fn(parameter: string, condition: ?) -> +Validator'
								}
							}
						},
						'validator': '+Validator'
					}
				},
				appendDef: function (defs) {
					var paramDef = angular.copy(defs[2]);
					delete paramDef['!name'];
					defs.push({
						'!name': 'peDef',
						'pe': paramDef
					});
					defs.push({
						'!name': 'translatorDef',
						'translator': paramDef
					});
				}
			};

			$scope.readonly=true;
			$scope.service = qtoFormulaScriptDataService;
			qtoFormulaValidationScriptTranslationDataService.load();
			basicsCommonScriptControllerService.initController($scope, options);
		}
	]);

})(angular);
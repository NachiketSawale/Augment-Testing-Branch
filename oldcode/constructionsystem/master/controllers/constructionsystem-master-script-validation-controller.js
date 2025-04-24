/**
 * Created by wui on 2/3/2016.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.master';

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(moduleName).controller('constructionsystemMasterScriptValidationController', [
		'$scope',
		'constructionsystemMasterScriptDataService',
		'basicsCommonScriptControllerService',
		function (
			$scope,
			constructionsystemMasterScriptDataService,
			basicsCommonScriptControllerService) {

			var options = {
				scriptId: 'construction.system.master.script.validation',
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
				}
			};

			$scope.service = constructionsystemMasterScriptDataService;

			basicsCommonScriptControllerService.initController($scope, options);

			var uuid = $scope.getContentValue('uuid');

			constructionsystemMasterScriptDataService.addUsingContainer(uuid);

			$scope.$on('$destroy', function () {
				constructionsystemMasterScriptDataService.removeUsingContainer(uuid);
			});
		}
	]);

})(angular);
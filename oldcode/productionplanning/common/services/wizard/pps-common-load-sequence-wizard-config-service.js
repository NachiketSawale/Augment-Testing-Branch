/**
 * Created by mik on 04/10/2021.
 */

(function (angular) {
	'use strict';

	let moduleName = 'productionplanning.common';

	angular.module(moduleName).service('productionPlanningCommonLoadSequenceWizardConfigService', ConfigService);

	ConfigService.$inject = ['_', '$translate', 'productionplanningCommonLoadSequenceDataService'];

	function ConfigService(_, $translate, productionplanningCommonLoadSequenceDataService) {
		let service = this;

		service.wzConfig = {
			title: $translate.instant('productionplanning.common.wizard.loadSequence.createFieldSequence'),
			width: '90%',
			height: '90%',
			resizeable: false,
			steps: [{
				id: 'editLoadSequence',
				title: $translate.instant('productionplanning.common.wizard.loadSequence.editLoads') + ' - JOB A0815',
				canFinish: true,
				form: {
					fid: 'editLoadSequence',
					version: '1.0.0',
					showGrouping: false,
					skipPermissionsCheck: true,
					groups: [{
						gid: 'default'
					}],
					rows: [{
						gid: 'default',
						model: 'loadSequence',
						directive: 'productionplanning-common-load-sequence-directive',
						type: 'directive',
						visible: true,
						options: {},
						sortOrder: 1
					}]
				},
				disallowNext: true,
				watches: [/*{
					expression: 'shiftDays',
					fn: function (info) {
						_.find(info.wizard.steps, {id: 'shiftDistance'}).disallowNext = checkDisallowNext('shiftDays', info.newValue);//info.newValue <= 0;
					}
				}*/]
			}],
			/*onStepChanging: function (info) {
				if(info.stepIndex === 0) {
				}
			},
			onChangeStep: function (info) {
			}*/ //
		};

		let disallowNext = false;

		function checkDisallowNext(type, value) {
			return !(!disallowNextShiftDays);
		}


		return service;
	}
})(angular);

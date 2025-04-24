/**
 * Created by anl on 21/2/2023.
 */

((angular) => {
	'use strict';
	/* global angular, globals, _ */

	const serviceName = 'ppsAssignContractToDispatchHeaderAction';
	const moduleName = 'productionplanning.product';
	const ActionId = '00004528ab444b2985f76e1739cd6770';

	function AssignContractToDispatchNoteAction(platformDialogService) {
		let self = this;
		self.Id = ActionId;
		self.Input = ['DispatchRecords', 'IsPopUp'];
		self.Output = ['DispatchingRecordData'];
		self.Description = 'Assign Contract To Dispatch Header';
		self.ActionType = 6;
		self.execute = function (task) {
			let context = task.Context || {};
			let dispatchRecords = getValue(task.input, 'DispatchRecords');
			let result = 'DispatchingRecordData';

			let dialogConfig = {
				height: '900px',
				width: '1800px',
				resizeable: true,
				showOkButton: true,
				showCancelButton: true,
				headerText: 'Assign Contract To Dispatch Header',
				headerText$tr$: 'productionplanning.product.workflow.assignContractAction',
				bodyTemplateUrl: globals.appBaseUrl + 'productionplanning.product/partials/pps-assign-contract-to-dispatch-header.html',
				dataItem: {
					DispatchRecordData: dispatchRecords
				},
				value: {},
				buttons: [{
					id: 'ok',
					disabled: (scope) => {
						return validResult(scope.modalOptions.value);
					}
				}]
			};

			return platformDialogService.showDialog(dialogConfig).then((response) => {
				if (response.ok) {
					context[result] = response.value;
				}
				return {data: {task: task, context: context, result: true}};
			});
		};
	}

	const validResult = (result) => {
		let valid = true;
		_.forEach(result, (v, k) => {
			valid = valid && v.length > 0;
		});
		return _.isEmpty(result) || !valid;
	};

	const getValue = (obj, key) => {
		let ret = obj.find(function (i) {
			return i.key === key;
		});
		return ret ? ret.value : null;
	};

	angular.module(moduleName).service(serviceName, ['platformDialogService', AssignContractToDispatchNoteAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}])
		.run(['basicsWorkflowActionValidationUtilService', function (actionValidationUtilService){
			function IsPopUpParameterValidator(action) {
				if (action.actionId === ActionId) {
					let popUp = _.find(action.input, {key: 'IsPopUp'});
					if (!popUp) {
						action.input.push({
							id: Math.floor(Math.random() * 90000) + 10000,
							key: 'IsPopUp',
							value: 'true'
						});
					} else {
						if (popUp.value !== 'true' && popUp.value !== 'false') {
							popUp.value = 'true';
						}
					}
				}
			}
			actionValidationUtilService.actionValidationHelper.registerActionValidation(IsPopUpParameterValidator);
		}]);

})(angular);
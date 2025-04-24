((angular) => {
	'use strict';
	/* global globals */

	const serviceName = 'ppsSelectProjectLocationAction';

	function SelectProjectLocationAction(platformDialogService) {
		let self = this;
		self.Id = '00000b2f8df04099be731c8f54950507';
		self.Input = ['Project', 'ProjectLocation', 'IsPopUp'];
		self.Output = ['SelectedProjectLocation'];
		self.Description = 'Select Project Location';
		self.ActionType = 6;
		self.execute = function (task) {
			let context = task.Context || {};
			let projectId = getValue(task.input, 'Project');
			let projectLocationId = getValue(task.input, 'ProjectLocation');
			let result = 'SelectedProjectLocation';
			// let resultValue = getValue(task.output, 'SelectedProjectLocation') || result;

			let dialogConfig = {
				width: '740px',
				resizeable: true,
				showOkButton: true,
				showCancelButton: true,
				headerText: 'Select Project Location',
				headerText$tr$: 'productionplanning.item.selectProjectLocation.dialogTitle',
				bodyTemplateUrl: globals.appBaseUrl + 'productionplanning.item/partials/pps-item-select-project-location.html',
				dataItem: {
					ProjectId: projectId,
					ProjectLocationId: projectLocationId
				},
				value: {},
				buttons: [{
					id: 'ok',
					disabled: function disabled(info) {
						return (!info.modalOptions.value.projectId || info.modalOptions.value.getSelectedLocationId() === null);
					}
				}]
			};

			return platformDialogService.showDialog(dialogConfig).then(function (response) {
				if (response.ok) {
					projectLocationId = response.value.getSelectedLocationId();
					context[result] = projectLocationId;
				}
				return {data: {task: task, context: context, result: projectLocationId}};
			});
		};
	}

	function getValue(obj, key) {
		let ret = obj.find(function(i) {
			return i.key === key;
		});
		return ret ? ret.value : null;
	}

	angular.module('productionplanning.item').service(serviceName, ['platformDialogService', SelectProjectLocationAction])
		.config(['basicsWorkflowModuleOptions', function (basicsWorkflowModuleOptions) {
			basicsWorkflowModuleOptions.clientActions.push(serviceName);
		}]);

})(angular);
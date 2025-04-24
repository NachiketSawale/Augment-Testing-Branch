((angular) => {
	'use strict';
	/* global angular, globals, _*/

	const serviceName = 'ppsHeaderCreatePreliminaryItemAction';
	const moduleName = 'productionplanning.header';
	const ActionId = '1fc771fe3e34413cb564ef0c5377db34';

	function CreatePreliminaryItemAction(platformDialogService, $translate, platformGridAPI, $http,
										 platformModalService, moment, $q) {
		let self = this;

		self.Id = ActionId;
		self.Input = ['PpsHeader', 'StartDate', 'EndDate', 'Duration', 'Threshold', 'Probability', 'IsPopUp'];
		self.Output = ['Result'];
		self.Description = 'Create Preliminary Items Action';
		self.ActionType = 6;

		self.execute = (task) => {
			let context = task.Context || {};
			let ppsHeader = JSON.parse(getValue(task.input, 'PpsHeader'));
			let StartDate = getValue(task.input, 'StartDate');
			let EndDate = getValue(task.input, 'EndDate');
			let Duration = getValue(task.input, 'Duration');
			let Threshold = getValue(task.input, 'Threshold');
			let Probability = getValue(task.input, 'Probability');
			let IsPopup = getValue(task.input, 'IsPopUp');
			let result = 'PreliminaryItems';
			let preliminaryItems = [];
			let request = {
				HeaderId: ppsHeader.Id,
				Threshold: Threshold,
				Probability: Probability,
				EarliestStart: StartDate !== null ? moment.utc(StartDate) : StartDate,
				LatestEnd: EndDate !== null ? moment.utc(EndDate) : EndDate,
				Duration: Duration
			};


			if (angular.isDefined(ppsHeader) && ppsHeader.HeaderType !== null && (ppsHeader.HeaderType.IsForPreliminary || ppsHeader.HeaderType.Isforpreliminary)) {
				if (IsPopup) {
					let modalCreateConfig = {
						width: '900px',
						resizeable: true,
						templateUrl: globals.appBaseUrl + 'productionplanning.header/templates/pps-header-create-preliminary-item-dialog.html',
						controller: 'productionplanningHeaderCreatePreliminaryItemWizardController',
						resolve: {
							'$options': function () {
								return {
									selectedHeader: ppsHeader,
									workflowAction: true,
									workflowSet: request
								};
							}
						}
					};

					return platformDialogService.showDialog(modalCreateConfig).then(function (response) {
						if (response && response.Succeeded) {
							preliminaryItems = response.Items;
							context[result] = preliminaryItems;
						} else {
							context['ErrorMsg'] = response.ErrorMessage;
						}
						return {data: {task: task, context: context, result: preliminaryItems}};
					});
				} else {
					return $http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/createPreliminaryitems', request).then(function (response) {
						const data = response.data;
						if (data && data.Succeeded) {
							preliminaryItems = data.Items;
							context[result] = preliminaryItems;
						} else {
							context['ErrorMsg'] = data.ErrorMessage;
						}
						return {data: {task: task, context: context, result: preliminaryItems}};
					});
				}
			} else {
				context['ErrorMsg'] = $translate.instant('productionplanning.header.wizard.createPreliminaryItem.noQualified');
				return $q.resolve({data: {task: task, context: context, result: []}});
			}
		};

		const getValue = (obj, key) => {
			let ret = obj.find(function (i) {
				return i.key === key;
			});
			return ret ? ret.value : null;
		};
	}

	angular.module(moduleName).service(serviceName, ['platformDialogService', '$translate', 'platformGridAPI', '$http',
		'platformModalService', 'moment', '$q',
		CreatePreliminaryItemAction])
	  .config(['basicsWorkflowModuleOptions', (basicsWorkflowModuleOptions) => {
		  basicsWorkflowModuleOptions.clientActions.push(serviceName);
	  }]);

})(angular);
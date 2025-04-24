
(function () {
	'use strict';
	let moduleName = 'controlling.structure';

	angular.module(moduleName).factory('controllingStructureCurrentSchedulerJobUiService', [
		'basicsLookupdataConfigGenerator', 'platformTranslateService','$translate',
		function (basicsLookupdataConfigGenerator, platformTranslateService,$translate) {

			let service = {};
			let controllerStructureSchedulerUIJobStateValues = [
				{Id: 0, description:  $translate.instant('controlling.structure.stateValues.waiting'), iconClass: 'status-icons ico-status42'},
				{Id: 1, description:  $translate.instant('controlling.structure.stateValues.starting'), iconClass: 'status-icons ico-status21'},
				{Id: 2, description:  $translate.instant('controlling.structure.stateValues.running'), iconClass: 'status-icons ico-status11'},
				{Id: 3, description:  $translate.instant('controlling.structure.stateValues.stopped'), iconClass: 'status-icons ico-status197'},
				{Id: 4, description:  $translate.instant('controlling.structure.stateValues.finished'), iconClass: 'status-icons ico-status02'},
				{Id: 5, description:  $translate.instant('controlling.structure.stateValues.repetitive'), iconClass: 'status-icons ico-status41'},
				{Id: 6, description:  $translate.instant('controlling.structure.stateValues.stopping'), iconClass: 'status-icons ico-status198'},
				{Id: 7, description:  $translate.instant('controlling.structure.stateValues.historized'), iconClass: 'status-icons ico-status49'},
				{Id: 8, description:  $translate.instant('controlling.structure.stateValues.aborted'), iconClass: 'status-icons ico-status01'}
			];

			let controllingStructurerepeatUnitValues =[
				{Id: 0, description: $translate.instant('controlling.structure.repeatUnit.none')},
				{Id: 1, description: $translate.instant('controlling.structure.repeatUnit.everyMinute')},
				{Id: 2, description: $translate.instant('controlling.structure.repeatUnit.hourly')},
				{Id: 3, description: $translate.instant('controlling.structure.repeatUnit.daily')},
				{Id: 4, description: $translate.instant('controlling.structure.repeatUnit.weekly')},
				{Id: 5, description: $translate.instant('controlling.structure.repeatUnit.monthly')}
			];

			const jobStateOptions = {
				displayMember: 'description',
				valueMember: 'Id',
				items: controllerStructureSchedulerUIJobStateValues
			};

			const repeatUnitOptions = {
				displayMember: 'description',
				valueMember: 'Id',
				items: controllingStructurerepeatUnitValues
			};

			service.getGridColumns = function() {
				let columns = [
					{
						id: 'name',
						field: 'Name',
						editor: 'description',
						name$tr$: 'controlling.structure.job.name',
					},
					{
						id: 'description',
						field: 'Description',
						editor: 'description',
						formatter: 'description',
						name$tr$: 'controlling.structure.job.description',
					},
					{
						id: 'jobstate',
						field: 'jobstate',
						formatter: function (row, cell, value, columnDef, dataContext) {
							let displayValue = 'undefined';
							let iconClass = '';
							const item = controllerStructureSchedulerUIJobStateValues[dataContext.JobState];
							if(item){
								displayValue = item.description;
								iconClass = item.iconClass;
							}

							return '<i class="block-image ' + iconClass + '"></i><span class="pane-r" title="'+displayValue+': '+value+'">' + displayValue + '</span>';
						},
						name$tr$: 'controlling.structure.job.jobstate',
						editorOptions: {jobStateOptions},
					},
					{
						id: 'repeatunit',
						field: 'RepeatUnit',
						name$tr$: 'controlling.structure.job.repeatunit',
						editor: 'select',
						formatter: 'select',
						editorOptions: repeatUnitOptions,
					},
					{
						id: 'starttime',
						field: 'StartTime',
						editor: 'datetime',
						formatter: 'datetime',
						name$tr$: 'controlling.structure.job.starttime',
					},
					{
						id: 'executionstarttime',
						field: 'ExecutionStartTime',
						formatter: 'datetime',
						name$tr$: 'controlling.structure.job.executionstarttime',
					},
					{
						id: 'executionendtime',
						field: 'ExecutionEndTime',
						formatter: 'datetime',
						name$tr$: 'controlling.structure.job.executionendtime',
					},
					{
						id: 'executionmachine',
						field: 'ExecutionMachine',
						formatter: 'text',
						name$tr$: 'controlling.structure.job.executionmachine',
					},
				];

				platformTranslateService.translateGridConfig(columns);

				return columns;
			};

			service.getStandardConfigForListView = function () {
				return {
					addValidationAutomatically: true,
					columns: service.getGridColumns()
				};
			};

			return service;
		}]);
})();

/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'services.schedulerui';

	/**
	 * @ngdoc service
	 * @name servicesScheduleruiUIConfigurationService
	 * @function
	 * @requires
	 *
	 * @description
	 * The UI configuration service for the module.
	 */

	const jobStateOptions = {
		displayMember: 'description',
		valueMember: 'Id',
		items: 'servicesSchedulerUIJobStateValues'
	};

	const frequencyOptions = {
		displayMember: 'description',
		valueMember: 'Id',
		items: 'servicesSchedulerUIFrequencyValues'
	};

	const priorityOptions = {
		displayMember: 'description',
		valueMember: 'Id',
		items: 'servicesSchedulerUIPriorityValues'
	};

	const logLvLOptions = {
		displayMember: 'description',
		valueMember: 'Id',
		items: 'servicesSchedulerUILogLevelValues'
	};

	angular.module(moduleName).factory('servicesScheduleruiUIConfigurationService', ['$injector', 'basicsLookupdataConfigGenerator', '$translate',
		function ($injector, basicsLookupdataConfigGenerator, $translate) {
			const service = {};

			const stateItems = {
				0: {Description: $translate.instant('services.schedulerui.stateValues.waiting'), IconClass: 'status-icons ico-status42'},
				1: {Description: $translate.instant('services.schedulerui.stateValues.starting'), IconClass: 'status-icons ico-status21'},
				2: {Description: $translate.instant('services.schedulerui.stateValues.running'), IconClass: 'status-icons ico-status11'},
				3: {Description: $translate.instant('services.schedulerui.stateValues.stopped'), IconClass: 'status-icons ico-status197'},
				4: {Description: $translate.instant('services.schedulerui.stateValues.finished'), IconClass: 'status-icons ico-status02'},
				5: {Description: $translate.instant('services.schedulerui.stateValues.repetitive'), IconClass: 'status-icons ico-status41'},
				6: {Description: $translate.instant('services.schedulerui.stateValues.stopping'), IconClass: 'status-icons ico-status198'},
				7: {Description: $translate.instant('services.schedulerui.stateValues.historized'), IconClass: 'status-icons ico-status49'},
				8: {Description: $translate.instant('services.schedulerui.stateValues.aborted'), IconClass: 'status-icons ico-status01'}
			};

			const taskTypeLookup = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'servicesSchedulerUITaskTypeLookupService',
				filterKey: 'services-schedulerui-taskTypeFilterByUIDelete'
			});

			function validateParameterValue(entity, value){
				return !(entity.Required === true && !_.get(value, 'length', 0));
			}

			const parameterGridConfig = {
				columns: [
					{
						id: 'name',
						field: 'Name',
						name: $translate.instant('services.schedulerui.parameterList.name'),
						formatter: 'description',
						width: 120
					},
					{
						id: 'value',
						field: 'Value',
						name: $translate.instant('services.schedulerui.parameterList.value'),
						formatter: 'dynamic',
						//editor: 'dynamic',
						validator: validateParameterValue,
						domain: function (item, column, editor) {
							column.editorOptions = column.formatterOptions = null;

							// let editorOptions = undefined;
							// if (this.editor) {
							// 	editorOptions = this.editor;
							// }
							if (item.ReadOnly) {
								delete this.editor;
							}
							// if (!item.ReadOnly && editorOptions) {
							// 	this.editor = editorOptions;
							// }

							if (String(item.Value) === 'False' || String(item.Value) === 'false') {
								item.Value = false;
							}
							if (String(item.Value) === 'True' || String(item.Value) === 'true') {
								item.Value = true;
							}
							if (item.Type === 'Boolean') {
								return 'boolean';
							}
							if (item.Type === 'DateTime') {
								return 'datetime';
							}
							if (item.Password === 'True' || String(item.Password) === 'true') {
								return 'password';
							}
							if (item.Name === 'TaskType') {

								if (editor) {
									column.editorOptions = taskTypeLookup.grid.editorOptions;
								} else {
									column.formatterOptions = taskTypeLookup.grid.formatterOptions;
								}

								return 'lookup';
							} else {
								return 'comment';
							}
						},
						width: 200
					},
					{
						id: 'type',
						field: 'Type',
						name: $translate.instant('services.schedulerui.parameterList.type'),
						formatter: 'description',
						width: 60
					},
					{
						id: 'required',
						field: 'Required',
						name: $translate.instant('services.schedulerui.parameterList.required'),
						formatter: 'boolean',
						width: 60
					},
					{
						id: 'description',
						field: 'Description',
						name: $translate.instant('services.schedulerui.parameterList.description'),
						formatter: 'description',
						width: 300
					}
				],
				data: [],
				id: '68d4b4898f47498488adb531f715c48e',
				lazyInit: true,
				options: {
					tree: false,
					indicator: false,
					idProperty: 'Id',
					autoHeight: false
				}
			};

			service.getJobEntityLayout = function () {
				return {
					fid: 'services.schedulerui.mainEntityNameForm',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['name', 'description', 'log', 'jobstate', 'starttime', 'executionstarttime', 'executionendtime','parameter', 'priority', 'tasktype', 'repeatunit', 'repeatcount','logginglevel', 'runinusercontext', 'keepduration', 'keepcount', 'executionmachine', 'machinename']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						name:{
							grid:{
								readonly: true,
								formatter: function (row, cell, value, columnDef, dataContext) {
									// dataContext.icon='';
									// var imageSelector = $injector.get('servicesSchedulerUIJobTypeIconService');
									var imageUrl = '';
									if(dataContext.HasChildren && dataContext.IsRepetitive){
										imageUrl = 'control-icons ico-job-repetitive';
									}else if(dataContext.HasChildren && !dataContext.IsRepetitive){
										imageUrl = 'control-icons ico-job-ordinary';
									}
									return '<i class="block-image ' + imageUrl + '"></i><span class="pane-r">' + value + '</span>';
								}
							}
						},
						jobstate: {
							grid: {
								editorOptions: jobStateOptions,
								readonly: true,
								formatter: function (row, cell, value, columnDef, dataContext) {
									let displayValue = 'undefined';
									let iconClass = '';
									const item = stateItems[dataContext.JobState];
									if(item){
										displayValue = item.Description;
										iconClass = item.IconClass;
									}

									return '<i class="block-image ' + iconClass + '"></i><span class="pane-r" title="'+displayValue+': '+value+'">' + displayValue + '</span>';
								}
							},
							detail: {options: jobStateOptions,readonly: true}
						},
						repeatunit: {
							grid: {
								editorOptions: frequencyOptions
							},
							detail: {options: frequencyOptions}
						},
						priority: {
							grid: {
								editorOptions: priorityOptions
							},
							detail: {options: priorityOptions}
						},
						logginglevel:{
							grid: {
								editorOptions: logLvLOptions
							},
							detail: {options: logLvLOptions}
						},
						executionstarttime: {readonly: true},
						executionendtime: {readonly: true},
						tasktype: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'servicesSchedulerUITaskTypeLookupService',
							filterKey: 'services-schedulerui-taskTypeFilterByUICreate'
						}),
						parameter:{
							grid:{
								exclude: true
							},
							detail:{
								type: 'directive',
								directive: 'services-schedulerui-job-parameter'
							}
						},
						executionmachine:{
							readonly: true
						}
					}
				};
			};

			service.getChildJobEntityLayout = function(){
				return {
					fid: 'services.schedulerui.childJobForm',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['name', 'description','log', 'jobstate', 'starttime', 'executionstarttime', 'executionendtime', 'parameter', 'logginglevel', 'tasktype', 'runinusercontext', 'executionmachine', 'machinename']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						jobstate: {
							grid: {
								editorOptions: jobStateOptions,
								readonly: true,
								formatter: function (row, cell, value, columnDef, dataContext) {
									let displayValue = 'undefined';
									let iconClass = '';
									const item = stateItems[dataContext.JobState];
									if(item){
										displayValue = item.Description;
										iconClass = item.IconClass;
									}

									return '<i class="block-image ' + iconClass + '"></i><span class="pane-r" title="'+displayValue+': '+value+'">' + displayValue + '</span>';
								}
							},
							detail: {options: jobStateOptions,readonly: true}
						},

						parameter:{
							grid:{
								exclude: true
							},
							detail:{
								type: 'directive',
								directive: 'platform-grid-form-control',
								options: {
									gridConfig: parameterGridConfig,
									height: '200px'
								}
							}
						},
						logginglevel:{
							grid: {
								editorOptions: logLvLOptions
							},
							detail: {options: logLvLOptions}
						},
						executionstarttime: {readonly: true},
						executionendtime: {readonly: true},
						tasktype: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'servicesSchedulerUITaskTypeLookupService',
							filterKey: 'services-schedulerui-taskTypeFilterByUICreate'
						}),
						executionmachine:{
							readonly: true
						},
						machinename:{
							readonly: true
						}
					}
				};
			};

			return service;
		}
	]);
})(angular);

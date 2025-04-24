/**
 * Created by aljami on 25.05.2022.
 */
(function () {
	'use strict';
	/**
	 * @ngdoc directive
	 * @name servicesSchedulerUIJobParameter
	 * @requires
	 * @description
	 */
	var moduleName = 'services.schedulerui';
	var gridId = 'ec4d55d3ebd94dcf941e536de78aff3c';
	angular.module(moduleName).directive('servicesScheduleruiJobParameter', ['platformGridAPI', 'platformComponentUtilService', function (platformGridAPI, platformComponentUtilService) {
		jobParameterController.$inject=['servicesSchedulerUIJobDataService', '$scope', 'platformCreateUuid', '$translate', 'platformGridAPI', 'basicsLookupdataConfigGenerator', 'servicesSchedulerUITaskTypeLookupService','platformRuntimeDataService', '_'];

		function jobParameterController(servicesSchedulerUIJobDataService, $scope, platformCreateUuid, $translate, platformGridAPI, basicsLookupdataConfigGenerator, servicesSchedulerUITaskTypeLookupService, platformRuntimeDataService, _) {

			$scope.gridId = gridId;

			var editorOptions;
			var taskTypeLookup = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
				dataServiceName: 'servicesSchedulerUITaskTypeLookupService',
				filterKey: 'services-schedulerui-taskTypeFilterByUIDelete'
			});
			var taskTypeLookupData = [];
			var settings = {
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
						editor: 'dynamic',
						validator: validateParameterValue,
						domain: function (item, column, editor) {
							column.editorOptions = column.formatterOptions = null;

							if (this.editor) {
								editorOptions = this.editor;
							}
							if (item.ReadOnly) {
								delete this.editor;
							}
							if (!item.ReadOnly && editorOptions) {
								this.editor = editorOptions;
							}

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
				]
			};

			servicesSchedulerUITaskTypeLookupService.getLookupData(taskTypeLookup.grid.editorOptions.lookupOptions)
				.then(function (data) {
 					taskTypeLookupData = data;
				});

			var gridInstance = platformGridAPI.grids.element('id', $scope.gridId);

			if (!gridInstance) {
				var grid = {
					columns: angular.copy(settings.columns),
					data: [],
					id: $scope.gridId,
					lazyInit: true,
					options: {
						tree: false,
						indicator: false,
						idProperty: 'Id',
						autoHeight: false
					}
				};
				platformGridAPI.grids.config(grid);
				platformGridAPI.events.register($scope.gridId, 'onCellChange', onCellModified);
				platformGridAPI.events.register($scope.gridId, 'onRowsChanged', onRowsChanged );
			}

			function onCellModified() {
				var selected = servicesSchedulerUIJobDataService.getSelected();
				servicesSchedulerUIJobDataService.markItemAsModified(selected);
			}

			function onRowsChanged(){
				if(grid.columns.current){
					var rows = platformGridAPI.rows.getRows($scope.gridId);
					_.each(rows, function(row){
						validateParameterValues(row, row.Value);
					});
					platformGridAPI.grids.refresh($scope.gridId);
				}
			}

			function validateParameterValues(entity, value){
				if ((value === undefined || value === null) && entity.Required === true){
					var result = {
						valid:false,
						error: ''
					};
					platformRuntimeDataService.applyValidationResult(result,entity,'Value');
				}
			}

			function validateParameterValue(entity, value){
				if(entity.Required === true && !_.get(value,'length', 0)){
					return false;
				}else{
					return true;
				}
			}
		}


		return {
			restrict: 'A',
			scope: {
				entity: '=',
				gridData: '=ngModel'
			},
			templateUrl: window.location.pathname + '/services.schedulerui/templates/services-schedulerui-job-parameter.html',
			link: function (scope, elem) {
				platformComponentUtilService.setSplitterResizeWatcher(elem, () => { platformGridAPI.grids.resize(gridId);}, {scope: scope });
			},
			controller:  jobParameterController

		};
	}]);
})();
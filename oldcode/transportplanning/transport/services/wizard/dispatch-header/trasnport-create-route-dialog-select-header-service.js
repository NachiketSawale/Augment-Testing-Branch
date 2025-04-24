/**
 * Created by anl on 8/12/2021.
 */

(function (angular) {
	'use strict';
	/*globals angular, moment, _, Slick*/
	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportCreateRouteSelectHeaderService', SelectHeaderService);

	SelectHeaderService.$inject = [
		'$http', '$q',
		'platformTranslateService',
		'platformGridAPI',
		'logisticDispatchingHeaderUIConfigurationService',
		'basicsCommonToolbarExtensionService'];

	function SelectHeaderService(
		$http, $q,
		platformTranslateService,
		platformGridAPI,
		headerUIStandardService,
		basicsCommonToolbarExtensionService) {

		var service = {};
		var scope = {};
		var request = {
			plannedDelivery: {},
			selectedHeaders: []
		};

		service.init = function ($scope) {
			scope = $scope;
			initGrid();
			initForm();
		};

		function initGrid() {
			var gridLayout = headerUIStandardService.getStandardConfigForListView();
			var headerColumns = [{
				editor: 'boolean',
				field: 'Checked',
				formatter: 'boolean',
				id: 'checked',
				width: 80,
				pinned: true,
				headerChkbox: false,
				name$tr$: 'cloud.common.entitySelected'
			}];
			headerColumns = headerColumns.concat(gridLayout.columns);

			request.selectedHeaders = scope.context.DispatchHeaders;
			_.forEach(request.selectedHeaders, function (header) {
				header.Checked = true;
			});

			scope.gridOptions = {
				headerGrid:{
					state: '9e028ff932a14ea5b587b84b8c2927c4',
					columns: headerColumns,
					tools: {
						showImages: false,
						showTitles: true,
						cssClass: 'tools',
						items: []
					},
					gridId: '9e028ff932a14ea5b587b84b8c2927c4',
				}
			};
			basicsCommonToolbarExtensionService.addBtn(scope.gridOptions.headerGrid, null, null, 'G');

			var gridConfig = {
				id: scope.gridOptions.headerGrid.state,
				columns: headerColumns,
				data: request.selectedHeaders,
				lazyInit: true,
				options: {
					indicator: true,
					editable: false,
					idProperty: 'Id',
					skipPermissionCheck: true,
					enableConfigSave: true,
					enableModuleConfig: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				state: scope.gridOptions.headerGrid.state
			};
			gridConfig.columns.current = headerColumns;
			platformGridAPI.grids.config(gridConfig);
		}

		function initForm() {
			var formConfig = {
				fid: 'transportplanning.transport.createRouteModal',
				showGrouping: false,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'paramGroup'
					}
				],
				rows: [
					{
						gid: 'paramGroup',
						rid: 'planneddelivery',
						label$tr$: 'transportplanning.transport.plannedDelivery',
						label: '*Planned Delivery Time',
						model: 'PlannedDelivery',
						type: 'datetimeutc',
						required: true,
						sortOrder: 1,
						change: function (entity, field) {
							request.plannedDelivery = entity[field];
						}
					}]
			};

			scope.formOptions = {
				configure: platformTranslateService.translateFormConfig(formConfig)
			};
			scope.formOptions.entity = {
				Id: 1
			};
		}

		service.getModule = function () {//for validation
			return 'transportplanningTransportCreateRouteSelectHeaderService';
		};

		service.isValid = function () {
			//Selected Headers && PlannedDelivery
			return request.selectedHeaders.length >= 1 && moment.isMoment(request.plannedDelivery);
		};

		service.unActive = function () {
			scope.context.DispatchHeaders = _.clone(request.selectedHeaders);
			scope.context.PlannedDelivery = _.clone(request.plannedDelivery);
		};

		service.active = function () {
			request.plannedDelivery = scope.context.PlannedDelivery !== null ? scope.context.PlannedDelivery : {};
			request.selectedHeaders = scope.context.DispatchHeaders !== null ? scope.context.DispatchHeaders : [];
		};

		service.getResult = function () {
			scope.context.DispatchHeaders = _.filter(request.selectedHeaders, function (header) {
				return header.Checked;
			});
			scope.context.PlannedDelivery = request.plannedDelivery;
			return {
				DispatchHeaders: scope.context.DispatchHeaders,
				PlannedDelivery: scope.context.PlannedDelivery
			};
		};

		service.updateSelectedHeaders = function (items) {
			request.selectedHeaders = items;
		};

		service.clear = function clear(){
			request = {
				plannedDelivery: {},
				selectedHeaders: []
			};
		};

		return service;
	}
})(angular);
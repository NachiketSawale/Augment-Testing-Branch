/**
 * Created by zov on 20/11/2018.
 */
(function () {
	'use strict';
	/*global globals, angular, _*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).factory('trsTransportCreateDisp4CraneDialogService', createDisp4CraneDialogService);
	createDisp4CraneDialogService.$inject = [
		'basicsLookupdataLookupFilterService',
		'basicsLookupdataConfigGenerator',
		'platformTranslateService',
		'$http',
		'productionplanningCommonResourceReservationUIStandardService',
		'productionplanningActivityResReservationValidationService',
		'productionplanningCommonResReservationDataServiceFactory',
		'platformRuntimeDataService',
		'$q',
		'platformModuleStateService',
		'ppsCopyStandardUIService',
		'platformGridAPI',
		'basicsCharacteristicCharacteristicUIStandardService',
		'platformDataValidationService',
		'basicsCharacteristicDataUIServiceFactory',
		'basicsCharacteristicTypeHelperService',
		'moment'];
	function createDisp4CraneDialogService(lookupFilterSrv,
										   basicsLookupdataConfigGenerator,
										   platformTranslateService,
										   $http,
										   ppsResourceReservationUIService,
										   validationServiceBase,
										   resRsvDataServiceFactory,
										   platformRuntimeDataService,
										   $q,
										   platformModuleStateService,
										   ppsCopyStandardUIService,
										   platformGridAPI,
										   chartUIService,
										   platformDataValidationService,
										   basicsCharacteristicDataUIServiceFactory,
										   basicsCharacteristicTypeHelperService,
										   moment) {
		var service = {
			init: init,
			getDispCfgFormOptions: getDispCfgFormOptions,
			getCraneRsvFormOptions: getCraneRsvFormOptions,
			isExecutable: isExecutable,
			execute: execute,
			endEdit: endEdit,
			destroy: destroy
		};

		var selectedCharacteristic = null;
		var sectionIdLogisticDispatching = 41;
		var chartDataLookupFilterKey = 'trsTransportChartDataLookupFilter' + sectionIdLogisticDispatching;
		var chartDataLayoutSrvId = 'DD099638CFDC444B8FCB71046A85CABB';
		var chartDataLookupFilters = [
			{
				key: chartDataLookupFilterKey,
				serverSide: false,
				fn: function (item) {
					return selectedCharacteristic && selectedCharacteristic.Id === item.CharacteristicFk;
				}
			}
		];
		var gridEvents = [];
		var chartFields = [
			{field: 'Code', readonly: true},
			{field: 'DescriptionInfo', readonly: true},
			{field: 'CharacteristicTypeFk', readonly: true},
			//{field: 'DefaultValue', readonly: true},
			{field: 'ValueText', readonly: false}
		];
		var chartCache = {};
		var resRsvDSOption = {
			entityNameTranslationID: 'transportplanning.transport.resReservationListTitle',
			serviceName: 'transportplanningTransportResReservationDataService',
			parentServiceName: 'transportplanningTransportMainService',
			dataProcessorName: 'transportplanningTransportResReservationReadOnlyProcessor'
		};
		var resRsvDataService = resRsvDataServiceFactory.getOrCreateService(resRsvDSOption);
		var resRsvValidServ = validationServiceBase.getReservationValidationService(resRsvDataService);
		var hasInitValidations = false;

		function init($scope, dispParam, selectedResReq, wizParam, selectedRoute) {
			chartCache = {};
			gridEvents = [];
			selectedCharacteristic = null;
			hasInitValidations = false;
			$scope.isWizardExecuting = false;
			$scope.config = {
				routeParams: dispParam,
				wizParams: wizParam,
				selectedResReq: selectedResReq,
				dispConfig: {},
				newCraneRsv: null,
				chartGrid: {
					state: '57E0E5111D5247CE908B8B51C53DEC5F',
					columns: (function () {
						var columns = _.cloneDeep(chartUIService.getStandardConfigForListView().columns);
						var visibleCols = [];
						columns.forEach(function (column) {
							if (_.find(chartFields, {field: column.field})) {
								column.navigator = null;
								visibleCols.push(column);
							}
						});
						var valueTextCol = getValueTextColumnFromChartDataUISrv();
						if(valueTextCol){
							visibleCols.push(valueTextCol);
						}
						return visibleCols;
					})(),
					tools: {
						showImages: false,
						showTitles: true,
						cssClass: 'tools',
						items: [
							{
								id: 't3',
								caption: 'cloud.common.gridlayout',
								iconClass: 'tlb-icons ico-settings',
								type: 'item',
								fn: function () {
									platformGridAPI.configuration.openConfigDialog($scope.config.chartGrid.state);
								}
							}]
					}
				}
			};
			initializeGrid($scope.config.chartGrid);

			$scope.need2CreateCraneRsv = dispParam.length === 1 && dispParam[0].need2CreateCraneRsv === true;
			if($scope.need2CreateCraneRsv){
				$scope.isCreatingCraneRsv = true;
				var promises = [];
				promises.push($http.post(globals.webApiBaseUrl + 'resource/reservation/create', {}));
				$q.all(promises).then(function (responses) {
					var resRsv = responses[0].data;
					resRsv.RequisitionFk = -1;
					resRsv.UomFk = null;
					if (selectedResReq) {
						resRsv.RequisitionFk = selectedResReq.Id;
						resRsv.Description = selectedResReq.Description;
						resRsv.ResourceFk = selectedResReq.ResourceFk;
						resRsv.UomFk = selectedResReq.UomFk;
						resRsv.Quantity = selectedResReq.Quantity;
						resRsv.ReservedFrom = moment(selectedResReq.RequestedFrom);
						resRsv.ReservedTo = moment(selectedResReq.RequestedTo);
					}
					$scope.config.newCraneRsv = resRsv;
					$scope.isCreatingCraneRsv = false;

					if (selectedRoute) {
						resRsv.ProjectFk = selectedRoute.ProjectDefFk;
						resRsv.JobFk = selectedRoute.JobDefFk;
					}
				});
			}

			lookupFilterSrv.registerFilter(chartDataLookupFilters);
		}

		function getValueTextColumnFromChartDataUISrv() {
			var uiService = basicsCharacteristicDataUIServiceFactory.createNewComplete(
				sectionIdLogisticDispatching,
				{
					serviceId: chartDataLayoutSrvId,
					discreteValueLookupFilter: chartDataLookupFilterKey
				});
			return _.find(uiService.getStandardConfigForListView().columns, {field: 'ValueText'});
		}

		function initializeGrid(grid) {
			var gridConfig = {
				id: grid.state,
				columns: grid.columns,
				options: {
					indicator: true,
					selectionModel: new Slick.RowSelectionModel()
				},
				enableConfigSave: !!grid.tools
			};
			gridConfig.columns.current = gridConfig.columns;
			platformGridAPI.grids.config(gridConfig);
			registerGridEvents(grid.state, 'onSelectedRowsChanged', onSelectedChartChanged);
		}

		function onSelectedChartChanged(e, args) {
			selectedCharacteristic = getSelectedItem(args.grid.options.id);
		}

		function getSelectedItem(gridId) {
			var selected = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: true
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			return selected;
		}

		function registerGridEvents(gridId, eventName, eventFn) {
			if(!_.find(gridEvents, {
					gridId: gridId,
					eventName: eventName,
					eventFn: eventFn
				})){
				gridEvents.push({
					gridId: gridId,
					eventName: eventName,
					eventFn: eventFn
				});
				platformGridAPI.events.register(gridId, eventName, eventFn);
			}
		}

		function unregisterGridEvents() {
			gridEvents.forEach(function (item) {
				platformGridAPI.events.unregister(item.gridId, item.eventName, item.eventFn);
			});
			gridEvents.length = 0;
		}

		function getDispCfgFormOptions($scope) {
			var formConfig = {
				fid: 'transportplanning.transport.craneOrderCfgForm',
				showGrouping: false,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: [
					basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'trsTransportCharacteristicGrpLookupDataService',
						cacheEnable: true,
						showClearButton: true,
						events: [{
							name: 'onSelectedItemChanged',
							handler: function (e, args) {
								onSelectChartGrpChanged(args.selectedItem, $scope);
							}
						}]
					}, {
						gid: 'baseGroup',
						rid: 'characteristicgrpfk',
						model: 'CharacteristicGrpFk',
						sortOrder: 1,
						label$tr$: 'transportplanning.transport.wizard.dispHeaderCharaGroup'
					})
				]
			};
			return {
				configure: platformTranslateService.translateFormConfig(formConfig)
			};
		}

		function getCraneRsvFormOptions() {

			function getBaseRows(uiService) {
				var rows = uiService.getStandardConfigForDetailView().rows.filter(function (row) {
					return row.gid === 'baseGroup' && row.rid.toLowerCase() !== 'requisitionfk';
				});
				var resourceRow;
				rows.forEach(function (row) {
					// add validator
					var rowModel = row.model.replace(/\./g, '$');
					var syncName = 'validate' + rowModel;
					var asyncName = 'asyncValidate' + rowModel;
					if (!row.validator){
						if(rowModel === 'UomFk'){
							row.validator = function validateUomFk(entity, value, model) {
								return platformDataValidationService.validateMandatory(entity, value, model, resRsvValidServ, resRsvDataService);
							};
						}else{
							row.validator = resRsvValidServ[syncName] || resRsvValidServ[asyncName];
						}
					}

					// add resource filter
					if(rowModel === 'ResourceFk'){
						resourceRow = row;
					}
				});

				// replace lookup for ResourceFk
				if(resourceRow){
					var replaceRow = {
						gid: 'baseGroup',
						rid: 'ResourceFk',
						model: 'ResourceFk',
						required: true,
						sortOrder: resourceRow.sortOrder,
						label$tr$: 'resource.master.entityResource',
						type: 'directive',
						directive: 'basics-lookupdata-lookup-composite',
						options: {
							lookupDirective: 'transport-resource-lookup-dialog',
							descriptionMember: 'DescriptionInfo.Translated',
							displayMember: 'Code',
							showClearButton: false,
							lookupOptions: {
								resourceType: 'Crane',
							}
						},
						validator: resourceRow.validator
					};
					rows.splice(rows.indexOf(resourceRow), 1, replaceRow); //replace resourceRow
				}

				return rows;
			}

			var formConfig = {
				fid: 'transportplanning.transport.craneOrderRsvForm',
				showGrouping: false,
				addValidationAutomatically: true,
				groups: [
					{
						gid: 'baseGroup'
					}
				],
				rows: getBaseRows(ppsCopyStandardUIService.copyUISrv(ppsResourceReservationUIService))
			};

			return {
				configure: platformTranslateService.translateFormConfig(formConfig)
			};
		}

		function onSelectChartGrpChanged(chartGrp, $scope) {
			$scope.isLoadingCharacteristics = true;
			loadCharacteristics(chartGrp.Id).then(function (chartLst) {
				// get default value
				var promises = [];
				chartLst.forEach(function (characteristic) {
					promises.push(basicsCharacteristicTypeHelperService.getDefaultValueAsync(characteristic));
				});
				$q.all(promises).then(function (values) {
					values.forEach(function (value, index) {
						chartLst[index].ValueText = value;
					});

					// show in grid
					setChartColumnReadonly(chartLst); // set readonly
					platformGridAPI.items.data($scope.config.chartGrid.state, chartLst);
					$scope.isLoadingCharacteristics = false;
				}, function (reason) {
					// eslint-disable-next-line no-console
					console.log(reason);
				});
			}, function (reason) {
				// eslint-disable-next-line no-console
				console.log(reason);
			});
		}

		function setChartColumnReadonly(chartLst){
			if(chartLst && Array.isArray(chartLst) && chartLst.length > 0){
				var chart = chartLst[0];
				if(!chart.__rt$data || !chart.__rt$data.readonly){
					chartLst.forEach(function (item) {
						_.find(chartFields, {field: 'ValueText'}).readonly = item.IsReadonly;
						platformRuntimeDataService.readonly(item, chartFields);
					});
				}
			}
		}

		function loadCharacteristics(chartGrpId) {
			if (chartCache[chartGrpId]) {
				return $q.when(chartCache[chartGrpId]);
			} else {
				return $http.get(globals.webApiBaseUrl + 'transportplanning/transport/route/getCharacteristicsByGrp?chartGrpId=' + chartGrpId).then(function (response) {
					chartCache[chartGrpId] = response.data;
					return chartCache[chartGrpId];
				});
			}
		}

		function isExecutable($scope) {
			return !$scope.isWizardExecuting && !hasValidationError($scope) &&
				(!$scope.need2CreateCraneRsv || $scope.need2CreateCraneRsv !== null);
		}

		function formatChart2TextValue(chart) {
			var textValue = '';
			if(chart.CharacteristicTypeFk === 7 || chart.CharacteristicTypeFk === 8){ // Date/DateTime
				textValue = chart.ValueText.format();
			} else if (!chart.ValueText) {
				textValue = null;
			} else {
				textValue = chart.ValueText.toString();
			}
			return textValue;
		}

		function execute(config, $scope) {
			$scope.isWizardExecuting = true;
			var options = {
				characteristicGrpFk: config.dispConfig.CharacteristicGrpFk,
				characteristicValues: (function () {
					var chartValueDic = [];
					if (config.dispConfig.CharacteristicGrpFk) {
						chartValueDic = chartCache[config.dispConfig.CharacteristicGrpFk].map(function (item) {
							return {characteristicId: item.Id, characteristicValue: formatChart2TextValue(item)};
						});
					}
					return chartValueDic;
				})(),
				routeParams: config.routeParams,
				wizParams: config.wizParams,
				newCraneRsv: config.newCraneRsv,
				resRequisitionId: config.newCraneRsv || !config.selectedResReq ? null : config.selectedResReq.Id
			};
			if(options.newCraneRsv.RequisitionFk === -1){
				options.newCraneRsv.RequisitionFk = 0; // for auto-generate resource-requisition by resource-reservation. RequisitionFk with 0 value is an identification for this requirement in server side(see in ProductionPlanningCommonEventLogic.cs)
			}
			return $http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createDispNote4CraneReservation', options).then(function (response) {
				return response.data;
			}).finally(function () {
				$scope.isWizardExecuting = false;
			});
		}

		function endEdit($scope) {
			platformGridAPI.grids.commitEdit($scope.config.chartGrid.state);
			return triggerAllValidations($scope);
		}

		function triggerAllValidations($scope) {
			if(!hasInitValidations) {
				hasInitValidations = true;
				if ($scope.need2CreateCraneRsv) {
					// check validation error of new res-reservation
					var craneRsv = $scope.config.newCraneRsv;
					$scope.craneRsvFormContainerOptions.formOptions.configure.rows.forEach(function (row) {
						if (row.validator) {
							var validateResult = row.validator(craneRsv, craneRsv[row.model], row.model);
							var rowModel = row.model.replace(/\./g, '$');
							var syncName = 'validate' + rowModel;
							if(resRsvValidServ[syncName]){
								platformRuntimeDataService.applyValidationResult(validateResult, craneRsv, row.model);
							}else{
								validateResult.then(function (result) {
									platformRuntimeDataService.applyValidationResult(result, craneRsv, row.model);
								});
							}
						}
					});
				}
			}

			var modState = platformModuleStateService.state(resRsvDataService.getModule());
			return $q.all(_.map(modState.validation.asyncCalls, function (call) {
				return call.myPromise;
			})).then(function () {
				return hasResRsvValidationError();
			});
		}

		function hasResRsvValidationError() {
			var modState = platformModuleStateService.state(resRsvDataService.getModule());
			return modState.validation.issues && modState.validation.issues.length > 0;
		}

		function hasValidationError($scope){
			if($scope.need2CreateCraneRsv){
				return hasResRsvValidationError();
			}

			return false;
		}

		function destroy() {
			unregisterGridEvents();
			lookupFilterSrv.unregisterFilter(chartDataLookupFilters);
			var modState = platformModuleStateService.state(resRsvDataService.getModule());
			modState.validation.issues.length = 0; // delete validation errors
		}

		return service;
	}
})(angular);

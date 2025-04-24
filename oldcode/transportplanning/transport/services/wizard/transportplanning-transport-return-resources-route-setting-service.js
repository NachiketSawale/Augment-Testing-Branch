/**
 * Created by lav on 12/3/2018.
 */
/* global angular, globals, _, Slick */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).factory('transportplanningTransportReturnResourcesRouteSettingService', Service);

	Service.$inject = ['$injector',
		'$http',
		'platformGridAPI',
		'transportplanningTransportReturnResourcesUIService',
		'platformRuntimeDataService',
		'transportplanningTransportMainService',
		'platformModuleStateService',
		'transportplanningTransportUIStandardService',
		'keyCodes',
		'moment',
		'platformDataValidationService',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonToolbarExtensionService',
		'transportplanningTransportRouteStatusLookupService',
		'basicsLookupdataLookupDescriptorService',
		'ppsCommonCodGeneratorConstantValue',
		'basicsCompanyNumberGenerationInfoService'];

	function Service(
		$injector,
		$http,
		platformGridAPI,
		UIService,
		platformRuntimeDataService,
		transportMainService,
		platformModuleStateService,
		transportUIStandardService,
		keyCodes,
		moment,
		platformDataValidationService,
		lookupService,
		basicsCommonToolbarExtensionService,
		routeStatusLookupService,
		basicsLookupdataLookupDescriptorService,
		ppsCommonCodGeneratorConstantValue,
		basicsCompanyNumberGenerationInfoService) {

		var service = {};
		var scope = {};
		var newEntity;
		var firstTime;

		function addToolItems(context) {
			context.gridId = context.state;
			context.tools = {
				showImages: false,
				showTitles: true,
				cssClass: 'tools',
				items: []
			};
			basicsCommonToolbarExtensionService.addBtn(context, null, null, 'G');
		}

		service.initialize = function ($scope) {
			firstTime = true;
			newEntity = null;
			scope = $scope;
			scope.model = '2';
			var columns = _.cloneDeep(transportUIStandardService.getStandardConfigForListView().columns);
			_.forEach(columns, function (column) {
				column.editor = null;
				column.navigator = null;
			});
			scope.gridOptions = {
				routeGrid: {
					state: 'E8DCE7C0271D49A5AD2188A82FAC628D',
					columns: columns,
					tools: {
						showImages: false,
						showTitles: true,
						cssClass: 'tools',
						items: []
					}
				}
			};
			scope.gridOptions.routeGrid.gridId = scope.gridOptions.routeGrid.state;
			addToolItems(scope.gridOptions.routeGrid);
			initializeGrid();
			scope.filterEntity = {
				SiteFk: validateSite(scope.context.preSelectSiteFk) ? scope.context.preSelectSiteFk: null,
				TrsRteStatusFks: scope.context.statusIds
			};
			scope.filterFormOptions = UIService.getFilterFormOptions1($scope.forUnplanned);
			scope.routeFormOptions = UIService.getRouteFormOptions();
			scope.formOptions = UIService.getRouteFormOptions1(scope.forUnplanned);
			if (scope.forUnplanned) {
				scope.dateFilters = [
					{
						value: 'yesterday',
						text: 'transportplanning.transport.wizard.sinceYesterday',
						subtractDays: 1
					},
					{
						value: 'past3Days',
						text: 'transportplanning.transport.wizard.past3Days',
						subtractDays: 2
					},
					{
						value: 'pastOneWeek',
						text: 'transportplanning.transport.wizard.pastOneWeek',
						subtractDays: 6
					}
				];
				scope.dateFilter = scope.dateFilters[0].value;
				scope.onDateFilterChecked = function () {
					scope.filterEntity.StartDate = moment.utc(moment().subtract(_.find(scope.dateFilters, {'value': scope.dateFilter}).subtractDays, 'days').format('YYYY-MM-DD 00:00'));
					scope.filterEntity.EndDate = moment.utc(moment().format('YYYY-MM-DD 23:59'));
					$injector.get('$timeout')(function () {
						scope.search();
					}, 100);
				};
				scope.onDateFilterChecked();
			}
			scope.onCreateNew = function () {
				if (!newEntity) {
					newEntity = {DstJobFk: null, PlannedPickUp: null};
					$scope.isLoading = true;
					$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/createroute', {'projectId': null}).then(function (result) {
						if (result) {
							if (result.data) {
								Object.keys(result.data).forEach(function (prop) {
									if (prop.endsWith('Fk')) {
										if (result.data[prop] === 0) {
											result.data[prop] = null;
										}
									}
								});
								var categoryId = ppsCommonCodGeneratorConstantValue.getCategoryFkviaEventType(result.data.EventTypeFk, ppsCommonCodGeneratorConstantValue.PpsEntityConstant.TransportRoute);
								if( categoryId !== null &&  basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').hasToGenerateForRubricCategory(categoryId) )
								{
									result.data.Code = basicsCompanyNumberGenerationInfoService.getNumberGenerationInfoService('trsRouteNumberInfoService').provideNumberDefaultText(categoryId);
									platformRuntimeDataService.readonly(result.data, [{field: 'Code', readonly: true}]);
								}
							}
							_.extend(newEntity, result.data);
							newEntity.HasDefaultDstWaypoint = true;
							newEntity.DstJobFk = newEntity.LgmJobFk;//get from trs-prj-config
							newEntity.JobDefFk = newEntity.LgmJobFk;
							newEntity.ProjectDefFk = newEntity.ProjectFk;
							if (moment.utc(newEntity.PlannedStart).year() >= 1753) {
								newEntity.PlannedPickUp = moment.utc(newEntity.PlannedStart);
							}
						}
						updateNewEntity();
						scope.routeEntity = newEntity;
						scope.isLoading = false;
					});
				} else {
					updateNewEntity();
					scope.routeEntity = newEntity;
				}
			};
			scope.onUpdateExist = function () {
				scope.routeEntity = service.getSelectedItem(scope.gridOptions.routeGrid.state);
			};
			scope.search = function (searchValue, flag, additionFunc) {
				var request = {
					'PinningContext': [],
					'FurtherFilters': [],
					'Pattern': scope.searchValue,
					'ExecutionHints': true,
					'IncludeNonActiveItems': false,
					'UseCurrentClient': true,
					PageNumber: scope.dataView.dataPage.number,
					PageSize: scope.dataView.dataPage.size
				};
				if (additionFunc) {
					additionFunc(request);
				}
				if (scope.filterEntity.ZipCode) {
					request.FurtherFilters.push({
						'Token': 'ZipCode',
						'Value': scope.filterEntity.ZipCode
					});
				}
				if (scope.filterEntity.StartDate) {
					request.FurtherFilters.push({
						'Token': 'StartDate',
						'Value': scope.filterEntity.StartDate
					});
				}
				if (scope.filterEntity.EndDate) {
					request.FurtherFilters.push({
						'Token': 'EndDate',
						'Value': scope.filterEntity.EndDate
					});
				}
				if (scope.filterEntity.SiteFk) {
					request.FurtherFilters.push({
						'Token': 'Site',
						'Value': scope.filterEntity.SiteFk
					});
				}
				request.FurtherFilters.push({
					'Token': 'TrsRteStatusFks',
					'Value': !_.isEmpty(scope.filterEntity.TrsRteStatusFks) ?
						scope.filterEntity.TrsRteStatusFks.join(',') :
						_.map(routeStatusLookupService.getList(), 'Id').join(',')
				});
				request.FurtherFilters.push({
					'Token': 'ForUnplanned',
					'Value': scope.forUnplanned
				});
				scope.isLoading = true;
				$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/searchForReturnResources', request).then(function (response) {
					if (response && response.data) {
						$injector.get('basicsLookupdataLookupDataService').unregisterDataProvider('logisticjobEx');//fixed the crash issue when refresh
						platformDataValidationService.removeDeletedEntitiesFromErrorList(platformGridAPI.rows.getRows(scope.gridOptions.routeGrid.state), transportMainService);
						service.setList(scope.gridOptions.routeGrid.state, response.data.dtos);
						var result = response.data.FilterResult;
						scope.dataView.dataPage.totalLength = result.RecordsFound;
						scope.dataView.dataPage.currentLength = result.RecordsRetrieved;
						scope.dataView.dataPage.count = Math.ceil(scope.dataView.dataPage.totalLength / scope.dataView.dataPage.size);
					}
					scope.isLoading = false;
				}, function () {
					scope.isLoading = false;
				});
			};
			scope.onSearchInputKeydown = function () {
				if (event.keyCode === keyCodes.ENTER) {
					scope.search();
				}
			};

			service.active();//trigger active at the first time
		};

		service.isValid = function () {
			return scope.routeEntity && !hasErrors();
		};

		service.unActive = function () {
			raiseValidation();
		};

		service.active = function () {
			if (firstTime && scope.context.preSelectedRoute) {
				firstTime = false;
				scope.search(null, null, function (request) {
					request.PinningContext.push({
						'Token': 'transportplanning.transport',
						'Id': {
							'Id': scope.context.preSelectedRoute.Id
						}
					});
				});
			}

			//update JobFk and ProjectFk for new created route
			if (newEntity && scope.model === '1') {
				updateNewEntity();
				scope.routeEntity = newEntity;
			}
		};

		service.getResult = function () {
			if (scope.model === '1') {
				updateByPlannedPickUp(scope.routeEntity);
			}
			return {
				'routeEntity': scope.routeEntity,
				'model': scope.model
			};
		};

		service.setList = function (gridId, items) {
			if (platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.items.data(gridId, items);
			}
		};

		service.getSelectedItem = function (gridId) {
			var selected = platformGridAPI.rows.selection({
				gridId: gridId,
				wantsArray: true
			});
			selected = _.isArray(selected) ? selected[0] : selected;
			return selected;
		};

		function updateByPlannedPickUp(entity) {
			//#101863
			entity.PlannedStart = entity.PlannedPickUp;
			entity.PlannedFinish = entity.PlannedPickUp;
			entity.EarliestStart = entity.PlannedStart;
			entity.EarliestFinish = entity.PlannedFinish;
			entity.LatestStart = entity.PlannedStart;
			entity.LatestFinish = entity.PlannedFinish;
			entity.PlannedDelivery = entity.PlannedFinish;//use to set the dst waypoint
		}

		function raiseValidation() {
			var validationRows = scope.model === '1' ? scope.routeFormOptions.configure.rows : scope.formOptions.configure.rows;
			var entity = scope.model === '1' ? newEntity : scope.routeEntity;
			if (entity) {
				_.forEach(validationRows, function (row) {
					if (row.validator) {
						var result = row.validator(entity, entity[row.model], row.model);
						platformRuntimeDataService.applyValidationResult(result, entity, row.model);
					}
				});
			}
		}

		function initializeGrid() {
			_.forEach(scope.gridOptions, function (grid) {
				var gridConfig = {
					id: grid.state,
					columns: grid.columns,
					options: {
						indicator: true,
						selectionModel: new Slick.RowSelectionModel(),
						enableConfigSave: true,
						enableModuleConfig: true,
						saveSearch: false
					}
				};
				gridConfig.columns.current = gridConfig.columns;
				platformGridAPI.grids.config(gridConfig);
			});
		}

		function hasErrors() {
			var modState = platformModuleStateService.state(transportMainService.getModule());
			if (modState.validation && modState.validation.issues) {
				var relatedIssues = _.filter(modState.validation.issues, function (err) {
					return err.entity.Id === scope.routeEntity.Id;
				});
				return !_.isEmpty(relatedIssues);
			}
		}

		function updateNewEntity() {
			//get the first selected job from select resources page
			var serviceA = $injector.get(scope.steps[0].service);
			var result = serviceA.getResult();
			if(_.isFunction(serviceA.getDeadline) && newEntity.PlannedPickUp < serviceA.getDeadline()) {
				newEntity.PlannedPickUp = serviceA.getDeadline();
			}
			if (result.selectedSrcJobs.length > 0) {
				var jobSelected = result.selectedSrcJobs[0];
				lookupService.loadItemByKey('logisticJobEx', jobSelected.Id).then(function (data) {
					if (data) {
						newEntity.LgmJobFk = data.Id;
						newEntity.ProjectFk = data.ProjectFk;
					}
				});
			}
		}

		function validateSite(siteId){
			var site = basicsLookupdataLookupDescriptorService.getLookupItem('basics.site', siteId);
			return site.Isdisp;
		}

		return service;
	}
})(angular);

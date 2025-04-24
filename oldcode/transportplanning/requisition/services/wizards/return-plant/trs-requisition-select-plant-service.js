/**
 * Created by anl on 12/29/2020.
 */
(function (angular) {
	'use strict';
	/*global angular, globals, _*/
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('transportplanningRequisitionSelectPlantService', SelectPlantService);

	SelectPlantService.$inject = [
		'$injector',
		'$http',
		'keyCodes',
		'platformGridAPI',
		'transportplanningRequisitionReturnRequisitionUIService',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'$q',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonToolbarExtensionService'];

	function SelectPlantService(
		$injector,
		$http,
		keyCodes,
		platformGridAPI,
		UIService,
		platformRuntimeDataService,
		platformDataValidationService,
		$q,
		basicsLookupdataLookupDescriptorService,
		basicsCommonToolbarExtensionService) {

		var selectedSrcJobs = [];
		var selectedPlants = [];
		var service = {};
		var scope = {};

		service.initialize = function ($scope) {
			selectedSrcJobs = selectedPlants = [];
			scope = $scope;
			scope.filterEntity = {HasRemainingQuantity: true};
			scope.filterFormOptions = UIService.getTrsRequisitionPlantFilterForm();
			scope.gridOptions = UIService.getSelectPlantOptions(service);
			scope.search = function () {
				var requset = {
					'PinningContext': [],
					'FurtherFilters': [],
					'Pattern': scope.searchValue,
					'ExecutionHints': true
				};
				if (scope.filterEntity.ProjectFk) {
					requset.PinningContext.push({
						'Token': 'filter.project',
						'Id': {
							'Id': scope.filterEntity.ProjectFk
						}
					});
				}
				if (scope.filterEntity.PlantTypeFk) {
					requset.PinningContext.push({
						'Token': 'filter.plantType',
						'Id': {
							'Id': scope.filterEntity.PlantTypeFk
						}
					});
				}
				if (scope.filterEntity.BusinessPartnerFk || scope.filterEntity.BusinessPartnerFk === 0) {
					requset.PinningContext.push({
						'Token': 'filter.businessPartnerFk',
						'Id': {
							'Id': scope.filterEntity.BusinessPartnerFk
						}
					});
				}
				if (scope.filterEntity.PlantGroupFk) {
					requset.PinningContext.push({
						'Token': 'filter.plantGroupFk',
						'Id': {
							'Id': scope.filterEntity.PlantGroupFk
						}
					});
				}
				if (scope.filterEntity.SiteFk) {
					requset.PinningContext.push({
						'Token': 'filter.siteFk',
						'Id': {
							'Id': scope.filterEntity.SiteFk
						}
					});
				}
				if (scope.filterEntity.HasRemainingQuantity) {
					requset.FurtherFilters.push({
						'Token': 'hasRemainingQuantity',
						'Value': scope.filterEntity.HasRemainingQuantity
					});
				}
				//scope.isLoading = true;
				$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/trsrequisition/searchjobplants', requset).then(function (response) {
					if (response) {
						selectedSrcJobs = selectedPlants = [];
						service.clearValidationIssues(platformGridAPI.rows.getRows(scope.gridOptions.plantGrid.state));//clear the issues firstly
						service.setList(scope.gridOptions.plantGrid.state, []);
						service.setList(scope.gridOptions.jobGrid.state, response.data);
						//$injector.get('transportplanningTransportReturnResourcesResourceConfigureService').clear();
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
			addToolItems(scope.gridOptions.jobGrid);
			addToolItems(scope.gridOptions.plantGrid);
			addToolItems(scope.gridOptions.planGrid);
			scope.isLoading = true;
			$http.get(globals.webApiBaseUrl + 'basics/company/trsconfig/getCurrentClientStockSite').then(function (siteRespond) {
				scope.isLoading = false;
				scope.filterEntity.SiteFk = siteRespond.data;
				validatePreSelection(scope.filterEntity);
			});
		};

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

		service.getModule = function () {//for validation
			return 'transportplanningRequisitionSelectPlantService';
		};

		service.isValid = function () {
			return selectedSrcJobs.length > 0 && selectedPlants.length > 0 && !platformDataValidationService.hasErrors(service);
		};

		service.unActive = function () {
			platformGridAPI.grids.commitEdit(scope.gridOptions.plantGrid.state);
			service.raiseValidation();
		};

		service.active = function () {

		};

		service.getResult = function () {
			selectedPlants = [];
			selectedSrcJobs = _.filter(platformGridAPI.rows.getRows(scope.gridOptions.jobGrid.state), {'Checked': true});
			_.forEach(selectedSrcJobs, function (job) {
				var plants = _.cloneDeep(_.filter(job.Plants, {'Checked': true}));
				_.forEach(plants, function (plant) {
					plant.Job = job;
				});
				selectedPlants = _.concat(selectedPlants, plants);
			});
			return {
				'selectedSrcJobs': selectedSrcJobs,
				'selectedPlants': selectedPlants
			};
		};

		service.setList = function (gridId, items) {
			if (platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.items.data(gridId, items);
			}
		};

		service.raiseValidation = function () {
			if (scope.forUnplanned) {
				var grid = scope.gridOptions.plantGrid;
				_.forEach(grid.columns, function (column) {
					if (column.validator) {
						_.forEach(platformGridAPI.rows.getRows(grid.state), function (row) {
							if (row.Checked) {
								var result = column.validator(row, row[column.field], column.field);
								platformRuntimeDataService.applyValidationResult(result, row, column.field);
								platformGridAPI.rows.refreshRow({'gridId': grid.state, 'item': row});
							}
						});
					}
				});
				return !platformDataValidationService.hasErrors(service);
			}
		};


		service.clearValidationIssues = function (rows) {
			_.forEach(rows, function (row) {
				platformDataValidationService.ensureNoRelatedError(row, null, ['TransportQuantity'], service, service);
			});
		};

		function validatePreSelection(entity) {
			var defer = $q.defer();
			if (entity.SiteFk) {//validate the site, should be the same filter with lookup
				$http.get(globals.webApiBaseUrl + 'basics/site/getbyid?id=' + entity.SiteFk)
					.then(function (respon) {
						if (!(respon && respon.data && respon.data.IsLive)) {
							var site = respon.data;
							var siteType = basicsLookupdataLookupDescriptorService.getLookupItem('SiteType', site.SiteTypeFk);
							if (siteType.IsStockyard) {
								entity.SiteFk = null;
							}
						}
						defer.resolve();
					});
			} else {
				defer.resolve();
			}
			return defer.promise;
		}

		return service;
	}

})(angular);
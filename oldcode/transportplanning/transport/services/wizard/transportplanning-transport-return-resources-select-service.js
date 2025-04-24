/**
 * Created by lav on 12/3/2018.
 */
/* global angular, globals, _ */
(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.transport';

	angular.module(moduleName).service('transportplanningTransportReturnResourcesCommonSelectService', SelectService);

	SelectService.$inject = ['$injector',
		'$http',
		'keyCodes',
		'platformGridAPI',
		'transportplanningTransportReturnResourcesUIService',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'$q',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonToolbarExtensionService'];

	function SelectService($injector,
							  $http,
							  keyCodes,
							  platformGridAPI,
							  UIService,
							  platformRuntimeDataService,
							  platformDataValidationService,
							  $q,
							  basicsLookupdataLookupDescriptorService,
							  basicsCommonToolbarExtensionService) {
		function ObjSelectServiceT() {
			var self = this;
			self.selectedSrcJobs = [];
			self.selectedResources = [];
			//put the paras here to inject outside
			self.customerOptions = {
				forPlants: false,
				grid2Title: 'transportplanning.transport.wizard.resources',
				grid3Title: 'transportplanning.transport.wizard.resourcePlan'
			};

			self.raiseValidation = function () {
				if (self.scope.forUnplanned) {
					var grid = self.scope.gridOptions.resourceGrid;
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
					return !platformDataValidationService.hasErrors(self);
				}
			};

			self.clearValidationIssues = function (rows) {
				_.forEach(rows, function (row) {
					platformDataValidationService.ensureNoRelatedError(row, null, ['TransportQuantity'], self, self);
				});
			};

			self.initialize = function ($scope) {
				self.selectedSrcJobs = self.selectedResources = [];
				self.scope = $scope;
				self.scope.filterEntity = {HasRemainingQuantity: true};
				self.scope.filterFormOptions = UIService.getFilterFormOptions();
				self.scope.gridOptions = UIService.getSelectOptions(self.scope.forUnplanned ? self : null, self.customerOptions.forPlants);
				self.scope.search = function () {
					var requset = {
						'PinningContext': [],
						'FurtherFilters': [],
						'Pattern': self.scope.searchValue,
						'ExecutionHints': true
					};
					if (self.scope.filterEntity.ProjectFk) {
						requset.PinningContext.push({
							'Token': 'job.project',
							'Id': {
								'Id': self.scope.filterEntity.ProjectFk
							}
						});
					}
					if(self.scope.forPlants){
						if (self.scope.filterEntity.PlantTypeFk) {
							requset.PinningContext.push({
								'Token': 'plant.plantTypeFk',
								'Id': {
									'Id': self.scope.filterEntity.PlantTypeFk
								}
							});
						}
					}
					else if (self.scope.filterEntity.ResourceTypeFk) {
						requset.PinningContext.push({
							'Token': 'resource.resourceType',
							'Id': {
								'Id': self.scope.filterEntity.ResourceTypeFk
							}
						});
					}
					if (self.scope.filterEntity.BusinessPartnerFk || self.scope.filterEntity.BusinessPartnerFk === 0) {
						requset.PinningContext.push({
							'Token': 'resource.businessPartnerFk',
							'Id': {
								'Id': self.scope.filterEntity.BusinessPartnerFk
							}
						});
					}
					if(self.scope.forPlants){
						if (self.scope.filterEntity.PlantGroupFk) {
							requset.PinningContext.push({
								'Token': 'plant.plantGroupFk',
								'Id': {
									'Id': self.scope.filterEntity.PlantGroupFk
								}
							});
						}
					}
					else if (self.scope.filterEntity.ResourceGroupFk) {
						requset.PinningContext.push({
							'Token': 'resource.resourceGroupFk',
							'Id': {
								'Id': self.scope.filterEntity.ResourceGroupFk
							}
						});
					}
					if (self.scope.filterEntity.SiteFk) {
						requset.PinningContext.push({
							'Token': 'resource.siteFk',
							'Id': {
								'Id': self.scope.filterEntity.SiteFk
							}
						});
					}
					if (self.scope.filterEntity.HasRemainingQuantity) {
						requset.FurtherFilters.push({
							'Token': 'hasRemainingQuantity',
							'Value': self.scope.filterEntity.HasRemainingQuantity
						});
					}
					if (self.scope.filterEntity.Deadline) {
						requset.FurtherFilters.push({
							'Token': 'deadline',
							'Value': self.scope.filterEntity.Deadline
						});
					}

					requset.FurtherFilters.push({
						'Token': 'forPlants',
						'Value': self.scope.forPlants
					});
					self.scope.isLoading = true;
					$http.post(globals.webApiBaseUrl + 'transportplanning/transport/route/searchJobsWithResource', requset).then(function (response) {
						if (response) {
							self.selectedSrcJobs = self.selectedResources = [];
							self.clearValidationIssues(platformGridAPI.rows.getRows(self.scope.gridOptions.resourceGrid.state));//clear the issues firstly
							self.setList(self.scope.gridOptions.resourceGrid.state, []);
							self.setList(self.scope.gridOptions.jobGrid.state, response.data);
							if(self.scope.steps[2]) {
								var configureService = $injector.get(self.scope.steps[2].service);
								if (_.isFunction(configureService.clear)) {
									configureService.clear();
								}
							}
						}
						self.scope.isLoading = false;
					}, function () {
						self.scope.isLoading = false;
					});
				};
				self.scope.onSearchInputKeydown = function () {
					if (event.keyCode === keyCodes.ENTER) {
						self.scope.search();
					}
				};
				self.addToolItems(self.scope.gridOptions.jobGrid);
				self.addToolItems(self.scope.gridOptions.resourceGrid);
				self.addToolItems(self.scope.gridOptions.resourcePlanGrid);
				self.scope.isLoading = true;
				$http.get(globals.webApiBaseUrl + 'basics/company/trsconfig/getCurrentClientSite').then(function (siteRespond) {
					self.scope.isLoading = false;
					self.scope.filterEntity.SiteFk = siteRespond.data;
					self.scope.context.preSelectSiteFk = siteRespond.data;
					self.validatePreSelection(self.scope.filterEntity);
				});
				_.extend(self.scope, self.customerOptions);
			};

			self.getModule = function () {//for validation
				return 'transportplanningTransportReturnResourcesSelectService';
			};

			self.isValid = function () {
				return self.selectedSrcJobs.length > 0 && self.selectedResources.length > 0 && !platformDataValidationService.hasErrors(self);
			};

			self.unActive = function () {
				platformGridAPI.grids.commitEdit(self.scope.gridOptions.resourceGrid.state);
				self.raiseValidation();
			};

			self.active = function () {

			};

			self.getResult = function () {
				self.selectedResources = [];
				self.selectedSrcJobs = _.filter(platformGridAPI.rows.getRows(self.scope.gridOptions.jobGrid.state), {'Checked': true});
				_.forEach(self.selectedSrcJobs, function (job) {
					var resources = _.cloneDeep(_.filter(job.Resources, {'Checked': true}));
					_.forEach(resources, function (resource) {
						resource.Job = job;
					});
					self.selectedResources = _.concat(self.selectedResources, resources);
				});
				return {
					'selectedSrcJobs': self.selectedSrcJobs,
					'selectedResources': self.selectedResources
				};
			};
		}

		ObjSelectServiceT.prototype.addToolItems = function (context) {
			context.gridId = context.state;
			context.tools = {
				showImages: false,
				showTitles: true,
				cssClass: 'tools',
				items: []
			};
			basicsCommonToolbarExtensionService.addBtn(context, null, null, 'G');
		};

		ObjSelectServiceT.prototype.setList = function (gridId, items) {
			if (platformGridAPI.grids.exist(gridId)) {
				platformGridAPI.items.data(gridId, items);
			}
		};

		ObjSelectServiceT.prototype.validatePreSelection = function (entity) {
			var defer = $q.defer();
			if (entity.SiteFk) {//validate the site, should be the same filter with lookup
				$http.get(globals.webApiBaseUrl + 'basics/site/getbyid?id=' + entity.SiteFk)
					.then(function (respon) {
						if(respon && respon.data) {
							basicsLookupdataLookupDescriptorService.updateData('basics.site', [respon.data]);
						}
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
		};

		return ObjSelectServiceT;
	}

	angular.module(moduleName).factory('transportplanningTransportReturnResourcesSelectService', Service);

	Service.$inject = ['transportplanningTransportReturnResourcesCommonSelectService'];

	function Service(transportplanningTransportReturnResourcesCommonSelectService) {

		var BaseService = transportplanningTransportReturnResourcesCommonSelectService;
		return new BaseService();
	}
})(angular);

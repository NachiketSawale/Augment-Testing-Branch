/**
 * Created by anl on 12/29/2020.
 */
(function (angular) {
	'use strict';
	/*global angular, globals, _*/
	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('transportplanningRequisitionCreatePlantRequisitionService', CreatePlantRequisitionService);

	CreatePlantRequisitionService.$inject = [
		'$injector',
		'$http',
		'moment',
		'platformGridAPI',
		'transportplanningRequisitionReturnRequisitionUIService',
		'platformRuntimeDataService',
		'transportplanningRequisitionMainService',
		'platformModuleStateService',
		'transportplanningRequisitionSelectPlantService',
		'basicsLookupdataLookupDescriptorService',
		'basicsLookupdataLookupFilterService'
	];

	function CreatePlantRequisitionService(
		$injector,
		$http,
		moment,
		platformGridAPI,
		UIService,
		platformRuntimeDataService,
		requisitionMainService,
		platformModuleStateService,
		selectPlantService,
		basicsLookupdataLookupDescriptorService,
		basicsLookupdataLookupFilterService
	) {
		var service = {};
		var scope = {};
		var newEntity;

		var filters = [{
			key: 'plant-resource-type-filter',
			fn: function (item) {
				return item && item.IsPlant;
			}
		}];

		service.initialize = function ($scope) {
			newEntity = null;
			scope = $scope;

			//scope.filterFormOptions = UIService.getTrsRequisitionFilterForm();
			scope.requisitionCreateForm = UIService.getRequisitionCreateForm(false);

			service.active(scope);//trigger active at the first time
		};

		service.isValid = function () {
			return scope.returnRequisition && !hasErrors();
		};

		service.unActive = function () {
			raiseValidation();
			// unregister filters
			filters.forEach(function(f){ 
				if(basicsLookupdataLookupFilterService.hasFilter(f.key)){ 
					basicsLookupdataLookupFilterService.unregisterFilter(f);  
				} 
			});
		};

		service.active = function (scope) {
			basicsLookupdataLookupFilterService.registerFilter(filters);
			onCreateNew(scope);
		};

		service.getResult = function () {
			return scope.returnRequisition;
		};

		function onCreateNew(scope) {
			if (!newEntity) {
				scope.isLoading = true;
				$http.post(globals.webApiBaseUrl + 'transportplanning/requisition/create').then(function (result) {
					newEntity = result.data;
					newEntity.IsPickup = true;
					updateNewEntity();
					scope.returnRequisition = newEntity;
					scope.isLoading = false;
				});
			} else {
				updateNewEntity();
				scope.returnRequisition = newEntity;
			}
		}

		function raiseValidation() {
			var validationRows = scope.requisitionCreateForm.configure.rows;
			if (scope.returnRequisition) {
				_.forEach(validationRows, function (row) {
					if (row.validator) {
						var result = row.validator(scope.returnRequisition, scope.returnRequisition[row.model], row.model);
						platformRuntimeDataService.applyValidationResult(result, scope.returnRequisition, row.model);
					}
				});
			}
		}

		function hasErrors() {
			var modState = platformModuleStateService.state(requisitionMainService.getModule());
			if (modState.validation && modState.validation.issues) {
				var relatedIssues = _.filter(modState.validation.issues, function (err) {
					return err.entity.Id === scope.returnRequisition.Id;
				});
				return !_.isEmpty(relatedIssues);
			}
		}

		function updateNewEntity() {
			var result = selectPlantService.getResult();
			//newEntity.ResTypeFk = result.selectedPlants[0].ResourceType;
			var maxDate = getLatestDate(result.selectedPlants);
			if (result.selectedSrcJobs.length > 0) {
				newEntity.PlannedStart = moment.utc(maxDate);
				var jobSelected = result.selectedSrcJobs[0];
				basicsLookupdataLookupDescriptorService.loadItemByKey('logisticJobEx', jobSelected.Id).then(function (data) {
					if (data) {
						newEntity.LgmJobFk = data.Id;
						newEntity.ProjectFk = data.ProjectFk;
						newEntity.BusinessPartnerFk = data.BusinessPartnerFk;
						newEntity.ContactFk = data.DeliveryAddressContactFk;
					}
				});
			}
		}

		function getLatestDate(selectedPlants) {
			var plans= [];
			_.forEach(selectedPlants, function(plant){
				plans = plans.concat(plant.Plans);
			});
			//TransportDate
			var dateCollection1 = _.filter(_.map(plans, function (plan) {
				if (plan.TransportDate) {
					return moment(plan.TransportDate);
				}
			}), _.isObject);
			var maxDate = moment.max(dateCollection1);
			return maxDate;
		}

		return service;
	}

})(angular);
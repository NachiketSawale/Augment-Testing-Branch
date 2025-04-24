(function (angular) {
	'use strict';

	var moduleName = 'transportplanning.requisition';

	angular.module(moduleName).service('transportplanningRequisitionCreateRequisitionService', CreateReturnRequisitionService);

	CreateReturnRequisitionService.$inject = [
		'$injector',
		'$http',
		'moment',
		'platformGridAPI',
		'transportplanningRequisitionReturnRequisitionUIService',
		'platformRuntimeDataService',
		'transportplanningRequisitionMainService',
		'platformModuleStateService',
		'transportplanningRequisitionSelectResourceService',
		'basicsLookupdataLookupDescriptorService'
	];

	function CreateReturnRequisitionService(
		$injector,
		$http,
		moment,
		platformGridAPI,
		UIService,
		platformRuntimeDataService,
		requisitionMainService,
		platformModuleStateService,
		selectResourceService,
		basicsLookupdataLookupDescriptorService
	) {
		var service = {};
		var scope = {};
		var newEntity;

		service.initialize = function ($scope) {
			newEntity = null;
			scope = $scope;

			scope.requisitionCreateForm = UIService.getRequisitionCreateForm(true);

			service.active(scope);//trigger active at the first time
		};

		service.isValid = function () {
			return scope.returnRequisition && !hasErrors();
		};

		service.unActive = function () {
			raiseValidation();
		};

		service.active = function (scope) {
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
			var result = selectResourceService.getResult();
			newEntity.ResTypeFk = result.selectedResources[0].ResourceType;
			var maxDate = getLatestDate(result.selectedResources);
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

		function getLatestDate(selectedResources) {
			var plans= [];
			_.forEach(selectedResources, function(resource){
				plans = plans.concat(resource.Plans);
			});
			//TransportDate
			var dateCollection1 = _.filter(_.map(plans, function (resourcePlan) {
				if (resourcePlan.TransportDate) {
					return moment(resourcePlan.TransportDate);
				}
			}), _.isObject);
			var maxDate = moment.max(dateCollection1);
			return maxDate;
		}

		return service;
	}

})(angular);
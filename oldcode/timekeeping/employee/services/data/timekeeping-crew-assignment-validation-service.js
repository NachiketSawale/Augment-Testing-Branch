/**
 * Created by leo on 07.05.2018.
 */
(function (angular) {
	/* global moment globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingCrewAssignmentValidationService
	 * @description provides validation methods for crew ssignments
	 */
	var moduleName = 'timekeeping.employee';
	angular.module(moduleName).service('timekeepingCrewAssignmentValidationService', TimekeepingCrewAssignmentValidationService);

	TimekeepingCrewAssignmentValidationService.$inject = ['_', '$http', '$q', 'platformDataValidationService', 'timekeepingCrewAssignmentDataService',
		'platformDataServiceModificationTrackingExtension','timekeepingEmployeeDataService'];

	function TimekeepingCrewAssignmentValidationService(_, $http, $q, platformDataValidationService, timekeepingCrewAssignmentDataService,
		platformDataServiceModificationTrackingExtension, timekeepingEmployeeDataService) {
		var self = this;

		self.validateFromDateTime = function (entity, value, model) {
			var res = platformDataValidationService.validateMandatory(entity, value, model, self, timekeepingCrewAssignmentDataService);
			if (!res.valid) {
				return res;
			}
			if(!entity.ToDateTime)
			{
				return true;
			}

			return platformDataValidationService.validatePeriod(value, entity.ToDateTime, entity, model, self, timekeepingCrewAssignmentDataService, 'ToDateTime');
		};

		self.asyncValidateFromDateTime = function (entity, value, model) {
			return self.validatePeriod(entity, value, model).then(function (data) {
				return {valid: data.valid, error: data.error, error$tr$: data.error};
			});
		};

		self.validateToDateTime = function (entity, value, model) {
			return platformDataValidationService.validatePeriod(entity.FromDateTime, value, entity, model, self, timekeepingCrewAssignmentDataService, 'FromDateTime');
		};

		self.asyncValidateToDateTime = function (entity, value, model) {
			if(entity.ToDateTime !== null || value !== null) {
				return self.validatePeriod(entity, value, model).then(function (data) {
					return {valid: data.valid, error: data.error, error$tr$: data.error};
				});
			} else {
				return $q.when({valid: true, error: '', error$tr$: ''});
			}
		};

		self.validateEmployeeCrewFk = function (entity, value) {
			if(entity.Version === 0 && value === 0){
				value = null;
			}
			let result =  platformDataValidationService.validateMandatory(entity, value, 'EmployeeCrewFk', self, timekeepingCrewAssignmentDataService);
			if (result && result.valid) {
				let last = _.last(_.orderBy(timekeepingCrewAssignmentDataService.getList(), ['FromTime']));
				if (last.Id === entity.Id) {
					last.EmployeeCrewFk = value;
				}
				timekeepingEmployeeDataService.setCrewLeader(last);
			}
			return result;
		};

		this.validatePeriod = function validatePeriod(entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, timekeepingCrewAssignmentDataService);

			var params = {};
			var to;
			var from;
			params.CrewAssignmentToValidate = _.cloneDeep(entity);
			if (model === 'FromDateTime') {
				from = moment.isMoment(value) ? value : moment.utc(value);
				from = from.format();
				params.CrewAssignmentToValidate.FromDateTime = from;
				if (entity.ToDateTime) {
					to = moment.isMoment(entity.ToDateTime) ? entity.ToDateTime : moment.utc(entity.ToDateTime);
					to = to.format();
					params.CrewAssignmentToValidate.ToDateTime = to;
				}
			}
			if (model === 'ToDateTime') {
				from = moment.isMoment(entity.FromDateTime) ? entity.FromDateTime : moment.utc(entity.FromDateTime);
				from = from.format();
				params.CrewAssignmentToValidate.FromDateTime = from;
				if(value){
					to = moment.isMoment(value) ? value : moment.utc(value);
					to = to.format();
					params.CrewAssignmentToValidate.ToDateTime = to;
				}
			}

			var updateData = platformDataServiceModificationTrackingExtension.getModifications(timekeepingCrewAssignmentDataService);
			if (updateData && updateData.CrewAssignmentsToSave) {
				params.CrewAssignmentsToSave = updateData.CrewAssignmentsToSave;
			}
			if (updateData && updateData.CrewAssignmentsToDelete) {
				params.CrewAssignmentsToDelete = updateData.CrewAssignmentsToDelete;
			}

			asyncMarker.myPromise = $http.post(
				globals.webApiBaseUrl + 'timekeeping/employee/crewassignment/validateperiod', params)
				.then(function (response) {
					platformDataValidationService.finishAsyncValidation({
						valid: response.data.Valid,
						error: response.data.ValidError
					}, entity, value, model, asyncMarker, self, timekeepingCrewAssignmentDataService);
					if (response && response.data && response.data.Valid) {
						platformDataValidationService.ensureNoRelatedError(entity, model, [model], self, timekeepingCrewAssignmentDataService);
						if (response.data.ChangedCrewAssignment) {
							timekeepingCrewAssignmentDataService.takeOverItem(response.data.ChangedCrewAssignment);
						}
						return {
							valid: response.data.Valid,
							apply: true,
							invalidFields: [model]
						};
					}
					else {
						return {
							valid: response.data.Valid,
							error: response.data.ValidError,
							apply: true,
							invalidFields: [model]
						};
					}
				}, function () {
					platformDataValidationService.finishAsyncValidation({
						valid: false,
						error: 'Unknown issue'
					}, entity, value, model, asyncMarker, self, timekeepingCrewAssignmentDataService);
					return {valid: false, error: 'Unknown issue', error$tr$: 'Unknown issue'};
				});

			return asyncMarker.myPromise;
		};
	}

})(angular);

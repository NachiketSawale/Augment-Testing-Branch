/**
 * Created by leo on 26.04.2018.
 */
(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name timekeepingEmployeeValidationService
	 * @description provides validation methods for employee
	 */
	var moduleName = 'timekeeping.employee';
	angular.module(moduleName).service('timekeepingEmployeeValidationService', TimekeepingEmployeeValidationService);

	TimekeepingEmployeeValidationService.$inject = ['$http', '$q','$translate', '_', 'platformDataValidationService', 'timekeepingEmployeeDataService', 'platformValidationServiceFactory', 'timekeepingEmployeeConstantValues',
		'timekeepingCrewAssignmentDataService', 'moment', 'platformDataServiceModificationTrackingExtension', 'platformRuntimeDataService','platformModalService'];

	function TimekeepingEmployeeValidationService($http,$q,$translate, _, platformDataValidationService, timekeepingEmployeeDataService, platformValidationServiceFactory, timekeepingEmployeeConstantValues,
		timekeepingCrewAssignmentDataService, moment, platformDataServiceModificationTrackingExtension, platformRuntimeDataService,platformModalService) {
		var self = this;

		platformValidationServiceFactory.addValidationServiceInterface(timekeepingEmployeeConstantValues.schemes.employee, {
			mandatory: platformValidationServiceFactory.determineMandatoryProperties(timekeepingEmployeeConstantValues.schemes.employee),
			periods: [{
				from: 'StartDate',
				to: 'TerminalDate'
			}]
		}, self, timekeepingEmployeeDataService);


		self.asyncValidateIsCrewLeader = function asyncValidateIsCrewLeader(entity, value, model) {
			if (value !== true) {
				return $q.when(true);
			}

			let postData = { PKey1: entity.Id, filter: '' };

			return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/crewmember/listByParent', postData)
				.then(function (response) {
					for (const item of response.data) {
						const databaseDatetime = moment(item.ToDateTime);
						const currentDatetime = moment();

						if (!databaseDatetime.isValid() || databaseDatetime.isAfter(currentDatetime)) {
							let modalOptionsFailed = {
								headerTextKey: 'timekeeping.employee.warning',
								bodyTextKey: 'timekeeping.employee.crewassignmsg',
								showOkButton: true,
								showCancelButton: false,
								resizeable: true,
								height: '500px',
								iconClass: 'info'
							};
							platformModalService.showDialog(modalOptionsFailed);

							const result = platformDataValidationService.createErrorObject(
								$translate.instant('timekeeping.employee.crewassignmsg'),
								{ object: model.toLowerCase() }
							);
							return platformDataValidationService.finishValidation(
								result, entity, value, model, self, timekeepingEmployeeDataService
							);
						}
					}

					return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/crewassignment/listByParent', postData)
						.then(function (crewAssignmentResponse) {
							let activeAssignments = [];
							let futureAssignments = [];
							const currentDatetime = moment();

							for (const item of crewAssignmentResponse.data) {
								const toDate = item.ToDateTime ? moment(item.ToDateTime) : null;
								const fromDate = item.FromDateTime ? moment(item.FromDateTime) : null;

								// (FromDateTime >= current date)
								if (fromDate && fromDate.isSameOrAfter(currentDatetime, 'day')) {
									futureAssignments.push(item);
								}

								// (ToDateTime > current date OR null)
								if (!toDate || toDate.isAfter(currentDatetime)) {
									activeAssignments.push(item);
								}
							}

							// If future assignments exist, show a warning and uncheck IsCrewLeader
							if (futureAssignments.length > 0) {
								return platformModalService.showDialog({
									headerTextKey: 'timekeeping.employee.headerTextForFutureCrewAssignment',
									bodyText: $translate.instant('timekeeping.employee.MsgForFutureCrewAssignment'),
									showOkButton: true,
									showCancelButton: false,
									resizeable: true,
									height: '300px',
									iconClass: 'warning'
								}).then(function () {
									value = false;
									return platformDataValidationService.finishAsyncValidation(
										{ apply: false, valid: true, error: '' }, entity, value, model, null, self, timekeepingEmployeeDataService
									);
								}).catch(function () {
									// Handle clicks Close (X) button
									value = false;
									return platformDataValidationService.finishAsyncValidation(
										{ apply: false, valid: true, error: '' }, entity, value, model, null, self, timekeepingEmployeeDataService
									);
								});
							}

							// If active assignments exist, show confirmation message
							if (activeAssignments.length > 0) {
								return platformModalService.showYesNoDialog(
									'timekeeping.employee.MsgForActiveCrewAssignment',
									'timekeeping.employee.headerTextForActiveCrewAssignment'
								).then(function (dialogResult) {
									if (dialogResult.yes) {
										// Update ToDateTime for all active assignments
										for (const assignment of activeAssignments) {
											assignment.ToDateTime = moment().subtract(1, 'days').set({ hour: 23, minute: 59, second: 0 }).format('YYYY-MM-DDTHH:mm:ss[Z]');
											timekeepingCrewAssignmentDataService.markItemAsModified(assignment);
										}
										return platformDataValidationService.finishValidation(
											true, entity, value, model, self, timekeepingEmployeeDataService
										);
									}
									if (dialogResult.no) {
										value = false;
										return platformDataValidationService.finishAsyncValidation(
											{ apply: false, valid: true, error: '' }, entity, value, model, null, self, timekeepingEmployeeDataService
										);
									}
								});
							}

							return platformDataValidationService.finishValidation(
								true, entity, value, model, self, timekeepingEmployeeDataService
							);
						});
				});
		};

		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			if(entity.TimekeepingGroupFk>0 && value !==null){
				return self.overlapsGroupCode(entity,value,entity.TimekeepingGroupFk,model,value).then(function (data) {
					if(data.data===false){
						const result = platformDataValidationService.createErrorObject('timekeeping.employee.overlaps', {object: model.toLowerCase()});
						return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingEmployeeDataService);
					}
					platformDataValidationService.ensureNoRelatedError(entity, model,['TimekeepingGroupFk'], self, timekeepingEmployeeDataService);
					return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingEmployeeDataService);
				});
			}
			return $q.when(true);
		};

		self.asyncValidateTimekeepingGroupFk = function asyncValidateTimekeepingGroupFk(entity, value, model) {
			if(entity.Code!==null && value>0) {
				return self.overlapsGroupCode(entity, entity.Code, value, model, value).then(function (data) {
					if (data.data === false) {
						const result = platformDataValidationService.createErrorObject('timekeeping.employee.overlaps', {object: model.toLowerCase()});
						return platformDataValidationService.finishValidation(result, entity, value, model, self, timekeepingEmployeeDataService);
					}
					platformDataValidationService.ensureNoRelatedError(entity, model,['Code'], self, timekeepingEmployeeDataService);
					return platformDataValidationService.finishValidation(true, entity, value, model, self, timekeepingEmployeeDataService);
				});
			}
			return $q.when(true);
		};

		self.asyncValidateVacationBalance = function asyncValidateVacationBalance(entity, value, model) {
			let difference =  value - entity.VacationBalance;
			if (difference !== null && difference !== 0) {
				return $http.get(globals.webApiBaseUrl + 'timekeeping/employee/adjustvacationbalance?newbalance='+difference+'&employeeid='+entity.Id)
					.then(function (response) {
						// return $q.resolve(response.data);
						response.apply = true;
						response.valid = true;
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, timekeepingEmployeeDataService);
					});
			} else {
				return $q.resolve(true);
			}
		};

		self.asyncValidateYearlyVacation = function asyncValidateYearlyVacation(entity, value, model){
			let difference =  value - entity.VacationBalance;
			if (difference !== null && difference !== 0) {
				return $http.get(globals.webApiBaseUrl + 'timekeeping/employee/adjustyearlyvacation?employeeid='+entity.Id +'&yearlyvacation='+value)
					.then(function (response) {
						// return $q.resolve(response.data);
						response.apply = true;
						response.valid = true;
						entity.VacationBalance = value;
						return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, timekeepingEmployeeDataService);
					});
			} else {
				return $q.resolve(true);
			}
		};
		self.asyncValidateCrewLeaderFk = function asyncValidateCrewLeaderFk(entity, value){
			if (value > 0) {
				let recentAssignment = _.findLast(timekeepingCrewAssignmentDataService.getList(), function(item) {
					return item.ToDateTime === null;
				});

				if (recentAssignment) {
					recentAssignment.EmployeeCrewFk = value;
					recentAssignment.FromDateTime = moment(recentAssignment.ToDateTime).add(1, 'minutes').format('YYYY-MM-DDTHH:mm:ss');
					timekeepingCrewAssignmentDataService.markItemAsModified(recentAssignment);
					return $q.resolve(true);
				} else {
					let params = {};
					params.Employee = _.cloneDeep(entity);
					params.Employee.CrewLeaderFk = value;
					let updateData = platformDataServiceModificationTrackingExtension.getModifications(timekeepingCrewAssignmentDataService);
					if (updateData && updateData.CrewAssignmentsToSave) {
						params.CrewAssignmentsToSave = updateData.CrewAssignmentsToSave;
					}
					if (updateData && updateData.CrewAssignmentsToDelete) {
						params.CrewAssignmentsToDelete = updateData.CrewAssignmentsToDelete;
					}

					return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/crewassignment/createviaemployee', params)
						.then(function (response) {
							if (response && response.data && response.data.Valid) {
								if (response.data.ChangedCrewAssignment) {
									timekeepingCrewAssignmentDataService.takeOverItem(response.data.ChangedCrewAssignment);
								}
								if (response.data.CrewAssignmentToValidate) {
									timekeepingCrewAssignmentDataService.takeOverWholeItem(response.data.CrewAssignmentToValidate);
								}
							}
						});
				}
			} else {
				let listAssignments = timekeepingCrewAssignmentDataService.getList();
				_.forEach(listAssignments, function (item) {
					if(item.ToDateTime===null){
						item.ToDateTime = moment.utc();
						timekeepingCrewAssignmentDataService.markItemAsModified(item);
						return $q.resolve(true);
					}
				});
				return $q.resolve({apply: false, valid: true, error: ''});
			}
		};

		self.overlapsGroupCode = function overlapsGroupCode(entity,code,tksGroup,model,field)
		{
			let asyncMarker = platformDataValidationService.registerAsyncCall(entity, field, model, timekeepingEmployeeDataService);
			asyncMarker.myPromise = $http.get(globals.webApiBaseUrl + 'timekeeping/employee/isunique?id='+entity.Id+'&&code='+code+'&&timekeepingGroupFk='+tksGroup).then(function (response) {
				return response;
			});
			return asyncMarker.myPromise;
		};
	}

})(angular);
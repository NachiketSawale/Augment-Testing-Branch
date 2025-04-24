/**
 * Created by baf on 26.09.2014.
 */
/* global moment globals */

(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainRelationshipValidationService
	 * @description provides validation methods for relationship instances
	 */
	angular.module('scheduling.main').service('schedulingMainProgressReportValidationService', SchedulingMainProgressReportValidationService);

	SchedulingMainProgressReportValidationService.$inject = ['_', '$http', '$timeout', 'platformDataValidationService',
		'schedulingMainProgressReportService', 'schedulingMainService', 'schedulingMainLineItemProgressService', 'schedulingProgressReportLineItemLookupService'];

	function SchedulingMainProgressReportValidationService(_, $http, $timeout, platformDataValidationService,
		schedulingMainProgressReportService, schedulingMainService, schedulingMainLineItemProgressService, schedulingProgressReportLineItemLookupService) {
		var self = this;

		this.validatePerformanceDate = function validatePerformanceDate(entity, value, model) {
			var isUnique = platformDataValidationService.validateMandatoryUniqEntity(entity, value, model, schedulingMainProgressReportService.getList(), this, schedulingMainService);
			var date = moment.isMoment(value) ? value : moment.utc(value);
			if (!date.isValid()) {
				// return moment.parsingFlags;
				return false;
			}
			if (entity.EstLineItemFk === null || isUnique) {
				return isUnique;
			} else {
				angular.forEach(schedulingMainProgressReportService.getList(), function (item) {
					if (item.EstLineItemFk === entity.EstLineItemFk && date.isSame(item.PerformanceDate)) {
						return false;
					}
				});
				return true;
			}
		};

		this.asyncValidatePerformanceDate = function asyncValidatePerformanceDate(entity, value, model) {
			return self.doValidateProgressReportDateAsynchronously(entity, value, model, {Date: value});
		};

		this.validateEstLineItemFk = function validateEstLineItemFk(entity, value, model) {
			var valueDate = entity.PerformanceDate;
			var isUnique = platformDataValidationService.validateMandatoryUniqEntity(entity, valueDate, model, schedulingMainProgressReportService.getList(), this, schedulingMainService);
			var date = moment.isMoment(valueDate) ? valueDate : moment.utc(valueDate);
			if (value === null || isUnique) {
				return isUnique;
			} else {
				angular.forEach(schedulingMainProgressReportService.getList(), function (item) {
					if (item.EstLineItemFk === value && date.isSame(item.PerformanceDate)) {
						return false;
					}
				});
				var item = schedulingProgressReportLineItemLookupService.getItemById(value, {lookupType: 'schedulingProgressReportLineItemLookupService'});
				if (item && item.QuantityTotal) {
					entity.PlannedQuantity = item.QuantityTotal;
				}
				let lineItem = _.find(schedulingMainLineItemProgressService.getList(),{'LineItemFk': value});
				if ( lineItem && lineItem.PCo){
					entity.PCo = lineItem.PCo;
					entity.RemainingPCo = 100 - lineItem.PCo;
				}
				return true;
			}
		};

		this.asyncValidateEstLineItemFk = function asyncValidateEstLineItemFk(entity, value, model) {
			return self.doValidateProgressReportDateAsynchronously(entity, value, model, {LineItemFk: value});
		};

		this.doValidateProgressReportDateAsynchronously = function doValidateProgressReportDateAsynchronously(entity, value, model, purpose) {

			var isunique = {
				Id: entity.Id,
				ActivityId: entity.ActivityFk,
				Date: entity.PerformanceDate,
				LineItemFk: entity.EstLineItemFk
			};
			angular.extend(isunique, purpose);

			return $http.post(globals.webApiBaseUrl + 'scheduling/main/progressreport/isunique', isunique).then(function (result) {
				if (!result.data) {
					return {
						valid: false,
						apply: true,
						error: '...',
						error$tr$: 'scheduling.main.errors.dueDateMustBeUnique',
						error$tr$param: {}
					};
				} else {
					if(purpose && purpose.LineItemFk) {
						var item = schedulingProgressReportLineItemLookupService.getItemById(purpose.LineItemFk, {lookupType: 'schedulingProgressReportLineItemLookupService'});
						if (item && item.QuantityTotal) {
							entity.PlannedQuantity = item.QuantityTotal;
						}
						let lineItem = _.find(schedulingMainLineItemProgressService.getList(),{'LineItemFk': value});
						if ( lineItem && lineItem.PCo){
							entity.PCo = lineItem.PCo;
							entity.RemainingPCo = 100 - lineItem.PCo;
						}
					}
					return true;
				}
			});
		};

		this.asyncValidateQuantity = function asyncValidateQuantity(entity, value, model) {
			return self.doValidateProgressReportChangeAsynchronously(entity, value, model, {
				ProgressReportQuantity: value,
				RemainingActivityQuantity: entity.RemainingQuantity
			});
		};

		this.asyncValidateRemainingQuantity = function asyncValidateRemainingQuantity(entity, value, model) {
			return self.doValidateProgressReportChangeAsynchronously(entity, value, model, {RemainingActivityQuantity: value});
		};

		this.asyncValidatePCo = function asyncValidatePCo(entity, value, model) {
			return self.doValidateProgressReportChangeAsynchronously(entity, value, model, {PercentageCompletion: value});
		};

		this.asyncValidateRemainingPCo = function asyncValidateRemainingPCo(entity, value, model) {
			return self.doValidateProgressReportChangeAsynchronously(entity, value, model, {PercentageRemaining: value});
		};

		this.asyncValidateWork = function asyncValidateWork(entity, value, model) {
			return self.doValidateProgressReportChangeAsynchronously(entity, value, model, {DueDateWorkPerformance: value});
		};

		this.asyncValidateRemainingWork = function asyncValidateRemainingWork(entity, value, model) {
			return self.doValidateProgressReportChangeAsynchronously(entity, value, model, {RemainingActivityWork: value});
		};

		this.doValidateProgressReportChangeAsynchronously = function doValidateProgressReportChangeAsynchronously(report, value, model, purpose) {
			var entity = schedulingMainService.getSelected();
			var parameter = self.provideAsyncProgressCallParameterObject(entity, report);
			angular.extend(parameter, purpose);

			var completeActivity = {
				MainItemId: entity.Id,
				Activities: [entity],
				ActivityPlanningChange: parameter,
				ProgressReportsToSave: _.filter(schedulingMainProgressReportService.getList(), function (cand) {
					return cand.EstLineItemFk === report.EstLineItemFk && cand.PerformanceDate.diff(report.PerformanceDate, 'seconds') >= 0;
				})
			};

			if (report.EstLineItemFk) {
				completeActivity.lineItemProgress = {
					LineItemFk: report.EstLineItemFk,
					EstimationHeaderFk: report.EstHeaderFk,
					Quantity: report.PlannedQuantity,
					Work: report.PlannedWork,
					UoMFk: report.BasUomFk
				};
			}

			var asyncMarker = platformDataValidationService.registerAsyncCall(report, value, model, schedulingMainProgressReportService);
			return $http.post(globals.webApiBaseUrl + 'scheduling/main/progressreport/validate', completeActivity
			).then(function (response) {
				schedulingMainService.calculateActivities(null, response.data);
				if (response.data.LineItemProgress) {
					schedulingMainLineItemProgressService.takeOverNewValues(response.data.LineItemProgress);
				}
				$timeout(function assignNewValuesToProgressReports() {
					schedulingMainProgressReportService.takeOverNewReports(response.data.ProgressReportsToSave);
				});

				let activities = [];
				if (_.isArray(response.data.Activities)) {
					activities = response.data.Activities;
				} else if (!!response.data.Activities && response.data) {
					activities = [response.data];
				}
				_.forEach(activities,
					function (act) {
						schedulingMainService.markItemAsModified(act);
					});

				return platformDataValidationService.finishAsyncValidation({apply: true, valid: true, error: ''}, report,
					value, model, asyncMarker, this, schedulingMainProgressReportService);
			}, function () {
				return platformDataValidationService.finishAsyncValidation({apply: false, valid: true, error: ''}, report,
					value, model, asyncMarker, this, schedulingMainProgressReportService);
			}
			);
		};

		this.provideAsyncProgressCallParameterObject = function provideAsyncProgressCallParameterObject(entity, report) {
			return {
				Id: entity.Id,
				DueDate: report.PerformanceDate,
				ProgressDescription: report.Description
			};
		};
	}

})(angular);

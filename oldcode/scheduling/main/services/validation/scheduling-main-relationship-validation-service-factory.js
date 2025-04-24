/**
 * Created by baf on 26.09.2014.
 */

(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name schedulingMainRelationshipValidationService
	 * @description provides validation methods for relationship instances
	 */
	angular.module('scheduling.main').service('schedulingMainRelationshipValidationServiceFactory', SchedulingMainRelationshipValidationServiceFactory);

	SchedulingMainRelationshipValidationServiceFactory.$inject = ['_', '$http', '$q', '$injector', 'platformDataValidationService', 'schedulingMainService'];

	function SchedulingMainRelationshipValidationServiceFactory(_, $http, $q, $injector, platformDataValidationService, schedulingMainService) {
		var self = this;

		this.initializeRelationshipValidation = function (validationService, checkPredecessor, checkSuccessor, dataService) {
			if (checkPredecessor) {

				validationService.validatePredecessorActivityFk = function validatePredecessorActivityFk(entity, value, model) {
					return self.validatePredecessor(entity, value, model, validationService, dataService);
				};

				validationService.asyncValidatePredecessorActivityFk= function asyncValidatePredecessorActivityFk(entity, value, model) {
					return self.asyncValidatePredecessor(entity, value, model, validationService, dataService);
				};

			/*	validationService.validateParentActivityFk = function validateParentActivityFk(entity, value, model) {
					return self.validatePredecessor(entity, value, model, validationService, dataService);
				};

				validationService.asyncValidateParentActivityFk = function asyncValidateParentActivityFk(entity, value, model) {
					return self.asyncValidatePredecessor(entity, value, model, validationService, dataService);
				};*/
			}

			if (checkSuccessor) {
				validationService.validateChildActivityFk = function validateChildActivityFk(entity, value, model) {
					return self.validateSuccessor(entity, value, model, validationService, dataService);
				};

				validationService.asyncValidateChildActivityFk = function asyncValidateChildActivityFk(entity, value, model) {
					return self.asyncValidateSuccessor(entity, value, model, validationService, dataService);
				};
			}

			validationService.asyncValidateRelationKindFk = function asyncValidateRelationKindFk(entity, value, model) {
				return self.asyncValidateRelationKind(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateFixLagTime = function asyncValidateFixLagTime(entity, value, model) {
				return self.asyncValidateFixLagTime(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateFixLagPercent = function asyncValidateFixLagPercent(entity, value, model) {
				return self.asyncValidateFixLagPercent(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateVarLagTime = function asyncValidateVarLagTime(entity, value, model) {
				return self.asyncValidateVarLagTime(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateVarLagPercent = function asyncValidateVarLagPercent(entity, value, model) {
				return self.asyncValidateVarLagPercent(entity, value, model, validationService, dataService);
			};

			validationService.asyncValidateUseCalendar = function asyncValidateUseCalendar(entity, value, model) {
				return self.asyncValidateUseCalendar(entity, value, model, validationService, dataService);
			};

			validationService.doAsyncValidation = function doAsyncValidation(entity, value, model) {
				return self.doAsyncValidation(entity, value, model, validationService, dataService);
			};
		};

		this.validatePredecessor = function validatePredecessor(entity, value, model, validationService, dataService) {
			if (entity.ChildActivityFk === value) {
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '...',
					error$tr$: 'scheduling.main.errors.parentChildAreTheSame'
				},
				entity, value, model, validationService, dataService);
			}
			if (value === 0 && entity.Version === 0) {
				value = null;
				var predValidService = $injector.get('schedulingMainPredecessorValidationService');
				var predDataService = $injector.get('schedulingMainPredecessorRelationshipDataService');

				return platformDataValidationService.validateMandatory(entity, value, model, predValidService, predDataService);
			}
			return true;
		};

		this.asyncValidatePredecessor = function asyncValidatePredecessor(entity, value, model, validationService, dataService) {
			if (value === 0 || entity.ChildActivityFk === 0) {
				return $q.when(true);
			}

			return self.doAsyncValidation(entity, value, model, validationService, dataService);
		};

		this.validateSuccessor = function validateSuccessor(entity, value, model, validationService, dataService) {
			if (entity.ParentActivityFk === value) {
				return platformDataValidationService.finishValidation({
					valid: false,
					apply: true,
					error: '...',
					error$tr$: 'scheduling.main.errors.parentChildAreTheSame'
				},
				entity, value, model, validationService, dataService);
			}
			if (value === 0 && entity.Version === 0) {
				value = null;
				var predValidService = $injector.get('schedulingMainSuccessorValidationService');
				var predDataService = $injector.get('schedulingMainSuccessorRelationshipDataService');

				return platformDataValidationService.validateMandatory(entity, value, model, predValidService, predDataService);
			}

			return true;
		};

		this.asyncValidateSuccessor = function asyncValidateSuccessor(entity, value, model, validationService, dataService) {
			if (value === 0 || entity.ParentActivityFk === 0) {
				return $q.when(true);
			}

			return self.doAsyncValidation(entity, value, model, validationService, dataService);
		};

		this.asyncValidateRelationKind = function asyncValidateRelationKind(entity, value, model, validationService, dataService) {
			if (entity.ChildActivityFk && entity.ParentActivityFk) {
				return self.doAsyncValidation(entity, value, model, validationService, dataService);
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidateFixLagTime = function asyncValidateFixLagTimeImpl(entity, value, model, validationService, dataService) {
			if (entity.ChildActivityFk && entity.ParentActivityFk) {
				return self.doAsyncValidation(entity, value, model, validationService, dataService);
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidateFixLagPercent = function asyncValidateFixLagPercentImpl(entity, value, model, validationService, dataService) {
			if (entity.ChildActivityFk && entity.ParentActivityFk) {
				return self.doAsyncValidation(entity, value, model, validationService, dataService);
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidateVarLagTime = function asyncValidateVarLagTimeImpl(entity, value, model, validationService, dataService) {
			if (entity.ChildActivityFk && entity.ParentActivityFk) {
				return self.doAsyncValidation(entity, value, model, validationService, dataService);
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidateVarLagPercent = function asyncValidateVarLagPercentImpl(entity, value, model, validationService, dataService) {
			if (entity.ChildActivityFk && entity.ParentActivityFk) {
				return self.doAsyncValidation(entity, value, model, validationService, dataService);
			} else {
				return $q.when(true);
			}
		};

		this.asyncValidateUseCalendar = function asyncValidateUseCalendarImpl(entity, value, model, validationService, dataService) {
			if (entity.ChildActivityFk && entity.ParentActivityFk) {
				return self.doAsyncValidation(entity, value, model, validationService, dataService);
			} else {
				return $q.when(true);
			}
		};

		this.doAsyncValidation = function doAsyncValidation(entity, value, model, validationService, dataService) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			var act = null;
			var valData = {
				MainItemId: entity.ParentActivityFk,
				Activities: [],
				RelationshipsToSave: []
			};
			var copy = {};
			_.merge(copy, entity);
			copy[model] = value;
			valData.RelationshipsToSave.push(copy);
			if (copy.ParentActivityFk) {
				act = schedulingMainService.getItemById(copy.ParentActivityFk);
				if (act) {
					valData.Activities.push(act);
				}
			}
			if (copy.ChildActivityFk) {
				act = schedulingMainService.getItemById(copy.ChildActivityFk);
				if (act) {
					valData.Activities.push(act);
				}
			}

			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'scheduling/main/relationship/validate', valData
			).then(function (response) {
				if (!response.data.Valid) {
					var res = {
						apply: true,
						valid: false,
						error: response.data.ValidationError
					};
					platformDataValidationService.finishAsyncValidation(res, entity, value, model, asyncMarker, validationService, dataService);

					return res;
				}
				if(model === 'PredecessorActivityFk'){
					entity.ParentActivityFk = value;
				}
				if (response.data.RelationshipsToSave) {
					dataService.takeOverRelations(response.data.RelationshipsToSave);
					_.each(response.data.RelationshipsToSave, function (rs) {
						dataService.markItemAsModified(rs);
					});
				}
				platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, dataService);
				if (response.data.Activities) {
					schedulingMainService.takeOverActivities(response.data.Activities, true);
				}
				return true;
			}, function () {
				// handle error here
				platformDataValidationService.finishAsyncValidation(false, entity, value, model, asyncMarker, self, dataService);
				return false;
			});

			return asyncMarker.myPromise;
		};
	}
})(angular);

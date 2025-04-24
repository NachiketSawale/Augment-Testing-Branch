(function (angular) {
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceReservationValidationService
	 * @description provides validation methods for reservation
	 */
	var moduleName = 'resource.reservation';
	angular.module(moduleName).service('resourceReservationValidationServiceFactory', ResourceReservationValidationServiceFactory);

	ResourceReservationValidationServiceFactory.$inject = ['_', 'platformRuntimeDataService', 'platformDataValidationService',
		'$injector', '$http', 'moment', 'basicsLookupdataLookupDescriptorService', 'resourceResourceLookupDataService', 'resourceTypeLookupDataService'];

	function ResourceReservationValidationServiceFactory(_, platformRuntimeDataService, platformDataValidationService,
		$injector, $http, moment, basicsLookupdataLookupDescriptorService, resourceResourceLookupDataService, resourceTypeLookupDataService) {
		var self = this;

		self.createReservationValidationService = function createReservationValidationService(validationService, dataService) {
			validationService.validateRequisitionFk = function validateRequisitionFk(entity, value, model) {
				return self.validateRequisitionFk(entity, value, model, validationService, dataService);
			};
			validationService.validateReservedFrom = function validateReservedFrom(entity, value, model) {
				return self.validateReservedFrom(entity, value, model, validationService, dataService);
			};
			validationService.validateReservedTo = function validateReservedTo(entity, value, model) {
				return self.validateReservedTo(entity, value, model, validationService, dataService);
			};
			validationService.validateUomFk = function validateUomFk(entity, value, model) {
				return self.validateUomFk(entity, value, model, validationService, dataService);
			};
			validationService.validateResourceFk = function validateResourceFk(entity, value, model) {
				return self.validateResourceFk(entity, value, model, validationService, dataService);
			};
			// validateAdditional functions are not working on this service?!
		};

		self.isErrorAlreadyFound = function (validationResult, found){
			found = validationResult.valid === false && !found;
			return found;
		};

		self.validateRequisitionFk = function validateRequisitionFk(entity, value, model, validationService, dataService) {
			if (!entity.Description && entity.Version === 0) {
				if (value === 0) {
					value = null;
				}
			}
			let validationResult = platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
			if(validationResult.valid) {
				validationResult = self.validateAdditionalRequisitionFk(entity, value);
				self.validateUomFk(entity, entity.UomFk, 'UomFk', validationService, dataService);
			}
			platformRuntimeDataService.applyValidationResult(validationResult, entity, model, validationService, dataService);
			platformDataValidationService.finishValidation(validationResult, entity, value, model, validationService, dataService);
			return validationResult;
		};

		self.validateAdditionalRequisitionFk = function validateAdditionalRequisitionFk(entity, value) {
			let reqisition = basicsLookupdataLookupDescriptorService.getItemByIdSync(value, { lookupType: 'resourceRequisition'});
			let validationResult = {
				apply: true,
				valid: true,
				error: ''
			};

			if (reqisition) {
				entity.Requisition = reqisition;
				entity.Description = reqisition.Description;
				entity.JobFk = reqisition.JobFk;
				entity.JobGroupFk = reqisition.JobGroupFk;
				entity.UomFk = reqisition.UomFk;
				if(_.isString(reqisition.RequestedFrom)) {
					entity.RequestedFrom = moment.utc(reqisition.RequestedFrom);
					entity.ReservedFrom = moment.utc(reqisition.RequestedFrom);
				} else {
					entity.RequestedFrom = reqisition.RequestedFrom;
					entity.ReservedFrom = reqisition.RequestedFrom;
				}
				if(_.isString(reqisition.RequestedTo)) {
					entity.RequestedTo = moment.utc(reqisition.RequestedTo);
					entity.ReservedTo = moment.utc(reqisition.RequestedTo);
				} else {
					entity.RequestedTo = reqisition.RequestedTo;
					entity.ReservedTo = reqisition.RequestedTo;
				}
			}

			if (!_.isNil(entity.ResourceFk) && entity.ResourceFk !== 0) {
				// requisition must fit in the timespan of resource
				if ((!_.isNil(entity.ResourceValidFrom) && entity.RequestedFrom.isBefore(moment(entity.ResourceValidFrom))) ||
					(!_.isNil(entity.ResourceValidTo) && entity.RequestedTo.isAfter(moment(entity.ResourceValidTo)))) {
					validationResult.valid = false;
					validationResult.error = $injector.get('$translate').instant('resource.reservation.validateResourceTimespan');
				}
			}

			return validationResult;
		};

		self.validateReservedFrom = function validateReservedFrom(entity, value, model, validationService, dataService) {
			let validationResult = platformDataValidationService.validatePeriod(value, entity.ReservedTo, entity, model, validationService, dataService, 'ReservedTo');

			if(entity.ResourceFk && entity.ResourceFk !== 0){
				if ((moment.utc(entity.ResourceValidFrom)) && moment(value).isAfter(moment.utc(entity.ResourceValidFrom))) {
					validationResult.valid = false;
					validationResult.error = $injector.get('$translate').instant('resource.reservation.validateResourceValidFrom');
				}
			}

			platformRuntimeDataService.applyValidationResult(validationResult, entity, model, validationService, dataService);
			platformDataValidationService.finishValidation(validationResult, entity, value, model, validationService, dataService);
			return validationResult;
		};

		self.validateReservedTo = function validateReservedToImpl(entity, value, model, validationService, dataService) {
			let validationResult = platformDataValidationService.validatePeriod(moment.utc(entity.ReservedFrom), value, entity, model, validationService, dataService, 'ReservedFrom');

			if ((moment.utc(entity.ResourceValidTo)) && moment(value).isAfter(moment.utc(entity.ResourceValidTo))) {
				validationResult.valid = false;
				validationResult.error = $injector.get('$translate').instant('resource.reservation.validateResourceValidTo');
			}

			platformRuntimeDataService.applyValidationResult(validationResult, entity, model, validationService, dataService);
			platformDataValidationService.finishValidation(validationResult, entity, value, model, validationService, dataService);
			return validationResult;
		};

		self.validateUomFk = function validateUomFk(entity, value, model, validationService, dataService) {

			let validationResult = platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
			platformRuntimeDataService.applyValidationResult(validationResult, entity, model, validationService, dataService);
			platformDataValidationService.finishValidation(validationResult, entity, value, model, validationService, dataService);
			return validationResult;
		};

		self.validateResourceFk = function validateResourceFk(entity, value, model, validationService, dataService) {
			let foundError = false;
			if (entity.Version === 0 && value === 0) {
				value = null;
			}

			let validationResult = platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
			var item = basicsLookupdataLookupDescriptorService.getItemByIdSync(value, { lookupType: 'ResourceMasterResource'});

			var itemResourceType;
			if (!_.isNil(item)) {
				itemResourceType = resourceTypeLookupDataService.getItemByKey(item.TypeFk);
				entity.ResourceTypeFk = item.TypeFk;
				entity.ResourceCode = item.Code;
				entity.ResourceDescription = item.DescriptionInfo.Translated;
				entity.ResourceValidFrom = item.Validfrom;
				entity.ResourceValidTo = item.Validto;
			}
			if (!_.isNil(itemResourceType)) {
				entity.DispatcherGroupFk = itemResourceType.DispatcherGroupFk;
				entity.TypeFk = itemResourceType.Id;
			}
			if (validationResult && !self.isErrorAlreadyFound(validationResult,foundError)) {
				if (!!item && item.UomBasisFk !== 0) {
					var res = self.validateUomFk(entity, item.UomBasisFk, 'UomFk', validationService, dataService);
					if (res === true || res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'UomFk');
						entity.UomFk = item.UomBasisFk;
					}
				}
			}
			if (validationResult && !self.isErrorAlreadyFound(validationResult,foundError)) {
				if (!_.isNil(entity.RequisitionFk) && entity.RequisitionFk !== 0) {
					// requisition must fit in the timespan of resource
					if (moment.utc(entity.RequestedFrom).isBefore(moment.utc(entity.ResourceValidFrom)) || moment.utc(entity.RequestedTo).isAfter(moment.utc(entity.ResourceValidTo))) {
						validationResult.valid = false;
						validationResult.error = $injector.get('$translate').instant('resource.reservation.validateResourceTimespan');
					}
					platformRuntimeDataService.applyValidationResult(validationResult, entity, 'RequisitionFk', validationService, dataService);
					platformDataValidationService.finishValidation(validationResult, entity, value, 'RequisitionFk', validationService, dataService);
				}
			}
			// validate resource from and to block => reservation must fit in the timespan of resource
			if (validationResult && !self.isErrorAlreadyFound(validationResult,foundError)) {
				if ((item) && moment.utc(entity.ReservedFrom).isBefore(moment.utc(item.Validfrom))) {
					validationResult.valid = false;
					validationResult.error = $injector.get('$translate').instant('resource.reservation.validateResourceIsAfterReservationFrom');
				}
			}
			if (validationResult && !self.isErrorAlreadyFound(validationResult,foundError)) {
				if ((item) && moment.utc(entity.ReservedTo).isAfter(moment.utc(item.Validto))) {
					validationResult.valid = false;
					validationResult.error = $injector.get('$translate').instant('resource.reservation.validateResourceIsBeforeReservationTo');
				}
			}

			platformRuntimeDataService.applyValidationResult(validationResult, entity, model, validationService, dataService);
			platformDataValidationService.finishValidation(validationResult, entity, value, model, validationService, dataService);

			return validationResult;
		};
	}
})(angular);

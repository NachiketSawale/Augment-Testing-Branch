(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourceRequisitionValidationService
	 * @description provides validation methods for requisition
	 */
	var moduleName='resource.requisition';
	angular.module(moduleName).service('resourceRequisitionValidationServiceFactory', ResourceRequisitionValidationServiceFactory);

	ResourceRequisitionValidationServiceFactory.$inject = ['_', '$http', '$q', 'moment','$injector', 'platformRuntimeDataService', 'platformDataValidationService',
		'platformColorService', 'basicsLookupdataLookupDataService', 'resourceTypeLookupDataService', 'resourceResourceLookupDataService', 'resourceRequisitionDataService',
		'platformContextService','resourceMasterMainService'
	];

	function ResourceRequisitionValidationServiceFactory(_, $http, $q, moment, $injector, platformRuntimeDataService, platformDataValidationService,
		platformColorService, basicsLookupdataLookupDataService, resourceTypeLookupDataService, resourceResourceLookupDataService, resourceRequisitionDataService,
		platformContextService,resourceMasterMainService
	) {
		var self = this;
		let allResTypes = [];

		self.createRequisitionValidationService = function createRequisitionValidationService(validationService, dataService) {
			validationService.validateRequestedFrom = function asyncValidateRequestedFrom(entity, value, model) {
				return self.validateRequestedFrom(entity, value, model, validationService, dataService);
			};
			validationService.asyncValidateRequestedFrom = function asyncValidateRequestedFrom(entity, value, model) {
				return self.asyncValidateRequestedFrom(entity, value, model, validationService, dataService);
			};
			validationService.validateRequestedTo = function asyncValidateRequestedTo(entity, value, model) {
				return self.validateRequestedTo(entity, value, model, validationService, dataService);
			};
			validationService.asyncValidateRequestedTo = function asyncValidateRequestedTo(entity, value, model) {
				return self.asyncValidateRequestedTo(entity, value, model, validationService, dataService);
			};
			validationService.asyncValidateActivityFk = function asyncValidateActivityFk(entity, value, model) {
				return self.asyncValidateActivityFk(entity, value, model, validationService, dataService);
			};
			validationService.validateTypeFk = function validateTypeFk(entity, value, model) {
				return self.validateTypeFk(entity, value, model, validationService, dataService);
			};
			validationService.asyncValidateJobFk = function asyncValidateJobFk(entity, value, model) {
				return self.asyncValidateJobFk(entity, value, model, validationService, dataService);
			};
			validationService.validateRequisitionStatusFk = function validateRequisitionStatusFk(entity, value, model) {
				return self.validateRequisitionStatusFk(entity, value, model, validationService, dataService);
			};
			validationService.validateUomFk = function validateUomFk(entity, value, model) {
				return self.validateUomFk(entity, value, model, validationService, dataService);
			};
			validationService.validateResourceFk = function validateResourceFk(entity, value, model) {
				return self.validateResourceFk(entity, value, model, validationService, dataService);
			};
			validationService.asyncValidateResourceFk = function asyncValidateResourceFk(entity, value, model) {
				return self.asyncValidateResourceFk(entity, value, model, validationService, dataService);
			};
			validationService.validateMaterialFk = function validateMaterialFk(entity, value, model) {
				return self.validateMaterialFk(entity, value, model, validationService, dataService);
			};
			validationService.asyncValidateMaterialFk = function asyncValidateMaterialFk(entity, value, model) {
				return self.asyncValidateMaterialFk(entity, value, model, validationService, dataService);
			};
		};

		self.validateRequestedFrom = function validateRequestedFromImpl(entity, value, model, validationService, dataService) {
			var res = platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
			if (!res.valid) {
				return res;
			} else if(value && value > entity.RequestedTo){
				entity.RequestedTo = value;
				return platformDataValidationService.validatePeriod(value, entity.RequestedTo, entity, model, validationService, dataService, 'RequestedTo');
			}
		};

		function setColorToRequisitionProperty(requisition, newValue, property, types) {
			var asRequired = types[0];
			var smallDelay = types[1];
			var delayOverThreshold = types[2];
			var noReservationDone = types[3];
			var color = null;

			if(!_.isNil(requisition[property])) {
				var duration = moment.duration(newValue.diff(requisition[property]));
				var days = duration.asDays();

				if (days > delayOverThreshold.Delaylessthan && noReservationDone.Isreserved === false) {
					color = delayOverThreshold.Backgroundcolor.toString(16);
					platformRuntimeDataService.colorInfo(requisition, property, 'bg-'+ platformColorService.nearestColor('#'+ color).css); // 'bg-red-4'
				}
				else if (days > smallDelay.Delaylessthan && days <= delayOverThreshold.Delaylessthan && delayOverThreshold.Isreserved === true) {
					color = delayOverThreshold.Backgroundcolor.toString(16);
					platformRuntimeDataService.colorInfo(requisition, property, 'bg-'+ platformColorService.nearestColor('#'+ color).css); // 'bg-orange-4'
				}
				else if (days > asRequired.Delaylessthan && days <= smallDelay.Delaylessthan && smallDelay.Isreserved === true) {
					color = smallDelay.Backgroundcolor.toString(16);
					platformRuntimeDataService.colorInfo(requisition, property, 'bg-'+ platformColorService.nearestColor('#'+ color).css); // 'bg-yellow-4'
				}
				if (days >= 0 && days <= asRequired.Delaylessthan && asRequired.Isreserved === true) {
					platformRuntimeDataService.colorInfo(requisition, property, null);
				}
			} else {
				// 'Color must be got via Isreserved'
				color = delayOverThreshold.Backgroundcolor.toString(16);
				platformRuntimeDataService.colorInfo(requisition, property, 'bg-'+ platformColorService.nearestColor('#'+ color).css); // 'bg-red-4'
			}
			resourceRequisitionDataService.fireItemModified(requisition);
		}

		self.asyncValidateRequestedFrom = function asyncValidateRequestedFromImpl(entity, value) {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/resrequisitionresdate/list').then(function (result) {
				if (result.data !== undefined) {
					setColorToRequisitionProperty(entity, value, 'ReservedFrom', result.data);
				}
				return {apply: true, valid: true};
			},
			function ( /* 'error' */ ) {
				return {apply: true, valid: true};
			});
		};

		self.validateRequestedTo = function validateRequestedToImpl(entity, value, model, validationService, dataService) {
			var res = platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
			if (!res.valid) {
				return res;
			} else {
				return platformDataValidationService.validatePeriod(entity.RequestedFrom, value, entity, model, validationService, dataService, 'RequestedFrom');
			}
		};

		self.asyncValidateRequestedTo = function asyncValidateRequestedToImpl(entity, value) {
			return $http.post(globals.webApiBaseUrl + 'basics/customize/resrequisitionresdate/list').then(function (result) {
				if (result.data !== undefined) {
					setColorToRequisitionProperty(entity, value, 'ReservedTo', result.data);
				}
				return {apply: true, valid: true};
			},
			function ( /* 'error' */ ) {
				return {apply: true, valid: true};
			});
		};

		self.asyncValidateActivityFk = function validateActivityFkImpl(entity, value, model, validationService, dataService){
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			var lookupService = basicsLookupdataLookupDataService.registerDataProviderByType('SchedulingActivityNew');
			var options = {lookupType: 'SchedulingActivityNew', version: 3};

			asyncMarker.myPromise = lookupService.getItemByKey(value, options).then(function(item) {
				if (item) {
					entity.ProjectFk = item.ProjectFk;
					entity.ScheduleFk = item.ScheduleFk;
				}
				return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, validationService, dataService);
			});

			return asyncMarker.myPromise;
		};

		self.validateTypeFk = function validateTypeFkImpl(entity, value, model, validationService, dataService) {

			if (entity.TypeFk === null && value !== null){
				const newRequisitionTypeFk = 1;
				platformDataValidationService.finishValidation(true, entity, newRequisitionTypeFk, 'RequisitionTypeFk', validationService, dataService);
				platformRuntimeDataService.applyValidationResult(true, entity, 'RequisitionTypeFk');
				entity.RequisitionTypeFk = newRequisitionTypeFk;
				entity.MaterialFk = null;
				platformRuntimeDataService.readonly([{ field: 'MaterialFk', readonly: true}]);
			}
			if(value){
				let item = resourceTypeLookupDataService.getItemByKey(value);
				// backup if the searched item isen't yet loaded to the cache of resourceTypeLookupDataService .
				if (_.isNil(item) || _.isUndefined(item)){
					item = _.find(allResTypes, resType => resType.Id === value);
				}
				if(item.IsSmallTools){
					entity.Quantity = 1;
					platformDataValidationService.validateMandatory(entity,entity.ResourceFk,'ResourceFk',validationService,dataService);
				}
				if(item.IsBulk){
					entity.Quantity = 1;
					platformRuntimeDataService.applyValidationResult(true, entity, 'ResourceFk');
				}
				if(!item.IsBulk && !item.IsSmallTools){
					entity.Quantity = 1;
					platformRuntimeDataService.applyValidationResult(true, entity, 'ResourceFk');
				}
				if (!_.isNil(item)) {
					entity.DispatcherGroupFk = item.DispatcherGroupFk;
				}
				if (!entity.UomFk) {
					if (item && item.UoMFk) {
						var res = self.validateUomFk(entity, item.UoMFk, 'UomFk', validationService, dataService);
						platformRuntimeDataService.applyValidationResult(res, entity, 'UomFk');
						entity.UomFk = item.UoMFk;
					}
				}
				platformRuntimeDataService.readonly(entity, [{field: 'MaterialFk', readonly: value !== null || entity.ResourceFk !== null}]);

				if( item && item.IsSmallTools) {
					let res2 = platformDataValidationService.validateMandatory(entity, entity.ResourceFk, 'ResourceFk', validationService, dataService);
					platformRuntimeDataService.applyValidationResult(res2, entity, 'ResourceFk');
				}
				else {
					platformDataValidationService.finishValidation(true, entity, value, model, validationService, dataService);
					platformRuntimeDataService.applyValidationResult(true, entity, 'ResourceFk');
				}
				return true;
			}
		};
		// this is a shit solution: The Lookup's dataservice isen't working correct data aren't cashed after the first access on the lookup
		// also asynchrous cross field validations are also not updating the foreing fields. So remaining solution is this shit.
		let asyncGetResourceType = function asyncGetResourceType() {
			let companyId = platformContextService.getContext().clientId;
			return $http.get(globals.webApiBaseUrl + 'resource/type/flatbycompany?companyId='+ companyId).then(function (response) {
				allResTypes = response.data;
			});
		};
		asyncGetResourceType();

		self.validateMaterialFk = function validateMaterialFk (entity, value, model, validationService, dataService) {
			if (entity.MaterialFk === null && value !== null){
				const newRequisitionTypeFk = 2;
				platformDataValidationService.finishValidation(true, entity, newRequisitionTypeFk, 'RequisitionTypeFk', validationService, dataService);
				platformRuntimeDataService.applyValidationResult(true, entity, 'RequisitionTypeFk');
				entity.RequisitionTypeFk = newRequisitionTypeFk;
				entity.TypeFk = null;
				entity.ResourceFk = null;
			}
		};

		self.asyncValidateMaterialFk = function asyncValidateMaterialFk(entity, value, model, validationService, dataService) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			if(value !== null){
				platformRuntimeDataService.readonly(entity, [{field: 'StockFk', readonly: false}]);
				var matService = $injector.get('basicsMaterialLookupService');
				asyncMarker.myPromise = matService.getItemByKey(value, {lookupType: 'basicsMaterialLookupService'}).then(function (result) {
					if (result) {
						entity.UomFk = result.BasUomFk;
						dataService.markItemAsModified(entity);
						return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, validationService, dataService);
					}
				});
			}
			platformRuntimeDataService.readonly(entity, [{field: 'TypeFk', readonly: value !== null}, {field: 'ResourceFk', readonly: value !== null},{field: 'UomFk', readonly: value !== null},]);

			return $q.when();
		};

		self.asyncValidateJobFk = function asyncValidateJobFk(entity, value, model, validationService, dataService) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
			var jobId = {Id: value};
			asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'logistic/job/list', jobId).then(function (result) {
				if (entity.Version === 0 && value === 0) {
					value = null;
				}
				if (result.data !== undefined && result.data.length !== 0) {
					entity.ProjectFk = result.data[0].ProjectFk;
					entity.JobGroupFk = result.data[0].JobGroupFk;
					return platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, validationService, dataService);
				} else {
					var res = platformDataValidationService.isMandatory(value, 'Job');
					return platformDataValidationService.finishValidation(res, entity, value, model, validationService, dataService);
				}
			});
			return asyncMarker.myPromise;
		};

		self.validateRequisitionStatusFk = function validateRequisitionStatusFkImpl(entity, value, model, validationService, dataService) {
			return platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
		};

		self.validateUomFk = function validateUomFkImpl(entity, value, model, validationService, dataService) {
			return platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService);
		};

		self.validateResourceFk = function validateResourceFkImpl(entity, value, model, validationService, dataService) {
			var resType = null;
			if(!entity.UomFk && value) {
				var item = resourceResourceLookupDataService.getItemById(value, {lookupType: 'Id'});
				if(item && item.UomBasisFk) {
					var res = self.validateUomFk(entity, item.UomBasisFk, 'UomFk', validationService, dataService);
					if(res === true || res.valid) {
						platformRuntimeDataService.applyValidationResult(res, entity, 'UomFk');
						entity.UomFk = item.UomBasisFk;
					}
				}
			}
			platformRuntimeDataService.readonly(entity, [{field: 'MaterialFk', readonly: value !== null || entity.TypeFk !== null}]);
			if(entity.TypeFk){
				resType = resourceTypeLookupDataService.getItemByKey(entity.TypeFk);
			}
			return resType !== null && resType.IsSmallTools ? platformDataValidationService.validateMandatory(entity, value, model, validationService, dataService): true;
		};

		self.asyncValidateResourceFk = function asyncValidateResourceFk(entity, value, model, validationService, dataService) {
			const result = {
				valid: true,
				apply: true,
				error: ''
			};

			if(value) {

				let asyncMarker =  platformDataValidationService.registerAsyncCall(entity, value, model, dataService);
				asyncMarker.myPromise = $http.post(globals.webApiBaseUrl + 'resource/master/resource/instance', {Id: value }).then(function (response) {
					let resourceItem = response.data;
					entity.TypeFk = resourceItem.TypeFk;
					self.validateTypeFk(entity, entity.TypeFk, 'TypeFk', validationService, dataService);

					return platformDataValidationService.finishAsyncValidation(result, entity, value, model, asyncMarker, validationService, dataService);
				});

				return asyncMarker.myPromise;
			}
			else {// Nothing async done, but we have to return a promise for the platform is expecting it.
				platformDataValidationService.finishValidation(result, entity, value, model, validationService, dataService);
				return $q.when(result);
			}
		};
	}
})(angular);

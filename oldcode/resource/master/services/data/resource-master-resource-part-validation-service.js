/**
 * Created by baf on 03.12.2018
 */

(function (angular) {
	'use strict';
	var moduleName = 'resource.master';

	/**
	 * @ngdoc service
	 * @name resourceMasterResourcePartValidationService
	 * @description provides validation methods for resource master resourcePart entities
	 */
	angular.module(moduleName).service('resourceMasterResourcePartValidationService', ResourceMasterResourcePartValidationService);

	ResourceMasterResourcePartValidationService.$inject = ['$http', 'resourceMasterMainService', 'platformValidationServiceFactory',
		'platformValidationRevalidationEntitiesFactory', 'platformRuntimeDataService', 'platformDataValidationService',
		'resourceMasterConstantValues', 'resourceMasterResourcePartDataService'];

	function ResourceMasterResourcePartValidationService($http, resourceMasterMainService, platformValidationServiceFactory,
	  platformValidationRevalidationEntitiesFactory, platformRuntimeDataService, platformDataValidationService,
	  resourceMasterConstantValues, resourceMasterResourcePartDataService) {

		var self = this;
		platformValidationServiceFactory.addValidationServiceInterface(resourceMasterConstantValues.schemes.resourcePart, {
				mandatory: platformValidationServiceFactory.determineMandatoryProperties(resourceMasterConstantValues.schemes.resourcePart)
			},


			self,
			resourceMasterResourcePartDataService);

		platformValidationRevalidationEntitiesFactory.addValidationServiceInterface(resourceMasterConstantValues.schemes.resourcePart,  {
			customValidations: [{
				model: 'Price',
				validation: function (entity, value,model,entities) {
					var rootIdModel = 'ResourceFk';
					var destinationModel = 'Rate';
					//var settingDestinationModelToReadOnly = {field: destinationModel,readonly: true};
					var destinationDataService = resourceMasterMainService;
					var sumUp = function(total,item) {return total + item[model];};
					var sum = _.reduce(entities,sumUp,0);
					var destinationEntity = _.filter(destinationDataService.getList(),function (item) {
						return entity[rootIdModel] === item.Id;
					})[0];
					destinationEntity[destinationModel] = sum;
					destinationDataService.markItemAsModified(destinationEntity);
					return true;
				},
				revalidateGrid: []
			},
			{
				model: 'IsMainPart',
				validation: validateIsMainPart,
				revalidateGrid: [{ model: 'IsMainPart' }],
			}],
			globals: {
				revalidateCellIOnlyIfHasError: false,
				revalidateOnlySameEntity: false
			}
		},
			self,
			resourceMasterResourcePartDataService);

		self.asyncValidatePartFk = function asyncValidatePartFk(entity, value) {
			var plant = 1;
			var employee = 2;
			var containerSpec = {Id: value};

			if(entity.ResourcePartTypeFk === plant){
				return $http.post(globals.webApiBaseUrl + 'resource/equipment/plant/list', containerSpec).then(function (result) {
					if (result.data.length > 0) {
						entity.DescriptionInfo = result.data[0].DescriptionInfo;
					}
				});
			}

			if(entity.ResourcePartTypeFk === employee){
				return $http.post(globals.webApiBaseUrl + 'timekeeping/employee/list', containerSpec).then(function (result) {
					if (result.data.length > 0) {
						entity.DescriptionInfo = result.data[0].DescriptionInfo;
					}
				});
			}
		};



		var selectedItem = null;
		var changedIsMainPartValue = false;
		function validateIsMainPart(entity, value, model) {
			var itemList = resourceMasterResourcePartDataService.getList();
			var res = {
				apply: true,
				valid: false,
				error: '...',
				error$tr$: ''
			};

			if (entity.IsMainPart !== value) {
				changedIsMainPartValue = value;
				selectedItem = entity;

				// TODO
				// For some reason the grid is updated with the old data if gridRefresh is called in the same thread...
				setTimeout(function () {
					resourceMasterResourcePartDataService.gridRefresh();
				}, 1);
			}

			var selectedMainParts = _.filter(itemList, function (item) {
				return item.Id === selectedItem.Id ? changedIsMainPartValue : item.IsMainPart;
			});

			if (selectedMainParts.length > 1 && (entity.Id === selectedItem.Id ? changedIsMainPartValue : entity.IsMainPart)) {
				res.error$tr$ = 'resource.master.errorOnlyOneMainPart';
			}
			else if (selectedMainParts.length < 1 && (entity.Id === selectedItem.Id ? !changedIsMainPartValue : !entity.IsMainPart)) {
				res.error$tr$ = 'resource.master.errorNeedsOneMainPart';
			}
			else {
				res.valid = true;
			}

			return platformDataValidationService.finishValidation(res, entity, value, model, self, resourceMasterResourcePartDataService);
		}

	}
})(angular);

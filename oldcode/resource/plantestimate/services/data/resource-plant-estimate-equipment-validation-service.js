(function (angular) {
	/* global globals */
	'use strict';

	/**
	 * @ngdoc service
	 * @name resourcePlantEstimateEquipmentValidationService
	 * @description provides validation methods for requisition
	 */
	var moduleName = 'resource.plantestimate';
	angular.module(moduleName).service('resourcePlantEstimateEquipmentValidationService', ResourcePlantEstimateEquipmentValidationService);

	ResourcePlantEstimateEquipmentValidationService.$inject = ['_', '$http', '$injector', 'platformValidationServiceFactory', 'platformDataValidationService',
		'basicsCharacteristicDataServiceFactory', 'resourcePlantEstimateConstantValues', 'resourcePlantEstimateEquipmentDataService', 'basicsCompanyNumberGenerationInfoService', 'platformRuntimeDataService','$q'];

	function ResourcePlantEstimateEquipmentValidationService(_, $http, $injector, platformValidationServiceFactory, platformDataValidationService,
		basicsCharacteristicDataServiceFactory, resourcePlantEstimateConstantValues, resourcePlantEstimateEquipmentDataService, basicsCompanyNumberGenerationInfoService, platformRuntimeDataService,$q) {

		var self = this;
		var service = {};

		platformValidationServiceFactory.addValidationServiceInterface({
			typeName: 'EquipmentPlantDto',
			moduleSubModule: 'Resource.Equipment'
		}, {
			mandatory: ['PlantGroupFk', 'ProcurementStructureFk'],
			periods: [{from: 'ValidFrom', to: 'ValidTo'}],
			uniques: ['Code']
		},
		self, resourcePlantEstimateEquipmentDataService);

		self.asyncValidateCode = function asyncValidateCode(entity, value, model) {
			if(entity.Version === 0 || entity.Code !== value) {
				return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'resource/equipment/plant/isunique', entity, value, model).then(function (response) {
					return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, resourcePlantEstimateEquipmentDataService);
				});
			}
			return $q.when(true);
		};

		self.validateNfcId = function asyncValidateNfcId(entity, value, model) {
			if (!value) {
				return platformDataValidationService.finishValidation(true, entity, value, model, self, resourcePlantEstimateEquipmentDataService);
			}

			let plants = resourcePlantEstimateEquipmentDataService.getList();
			return platformDataValidationService.validateIsUnique(entity, value, model, plants, self, resourcePlantEstimateEquipmentDataService);
		};

		self.asyncValidateNfcId = function asyncValidateNfcId(entity, value, model) {
			if (!value) {
				platformDataValidationService.finishValidation(true, entity, value, model, self, resourcePlantEstimateEquipmentDataService);
				return $q.when(true);
			}

			return platformDataValidationService.isAsyncUnique(globals.webApiBaseUrl + 'resource/equipment/plant/isunique', entity, value, model).then(function (response) {
				return platformDataValidationService.finishAsyncValidation(response, entity, value, model, null, self, resourcePlantEstimateEquipmentDataService);
			});
		};

		self.validateHasPoolJob = function validateHasPoolJob (entity, value, model){
			entity.HasPoolJobChanged = false;
			if (entity.HasPoolJob !== value) {
				entity.HasPoolJobChanged = true;
			}
			return true;
		};

		self.asyncCopyCharacteristicsOnChangedPlantGroupFk = function asyncCopyCharacteristicsOnChangedPlantGroupFk(entity, value, model) {
			var copyData = {
				sourceMainItemId: value,
				sourceSectionId: 34,
				destMainItemId: entity.Id,
				destSectionId: 35
			};

			return $http.post(globals.webApiBaseUrl + 'basics/characteristic/data/copy', copyData).then(function (response) {
				if (response && response.data.length > 0) {
					var dataSrv = basicsCharacteristicDataServiceFactory.getService(resourcePlantEstimateEquipmentDataService, 35);
					var newItems = response.data;
					var characters = [];
					var characterData = [];
					var oldItems = dataSrv.getList();
					if (oldItems && oldItems.length > 0) {
						characters = _.filter(newItems, function (character) {
							var item = _.find(oldItems, { CharacteristicFk: character.CharacteristicFk });
							return !item;
						});
						characterData = oldItems.concat(characters);
					} else {
						characterData = newItems;
					}
					dataSrv.setList(characterData);
				}
				return true;
			});
		};

		self.asyncCheckCodeHasToBeGeneratedOnChangedPlantGroupFk = function asyncCheckCodeHasToBeGeneratedOnChangedPlantGroupFk(entity, value) {
			var ident = {
				Id: value
			};
			return $http.post(globals.webApiBaseUrl + 'resource/equipmentgroup/instance', ident).then(function (result)	{
				let selectedPlantGroup = result.data;
				if (selectedPlantGroup && selectedPlantGroup.Id === value) {
					if (entity.RubricCategoryFk !== selectedPlantGroup.RubricCategoryFk && entity.Version === 0) {
						entity.RubricCategoryFk = selectedPlantGroup.RubricCategoryFk;

						var infoService = $injector.get('basicsCompanyNumberGenerationInfoService').getNumberGenerationInfoService('resourceEquipmentNumberInfoService', 30);
						if (infoService.hasToGenerateForRubricCategory(selectedPlantGroup.RubricCategoryFk)) {
							entity.Code = infoService.provideNumberDefaultText(selectedPlantGroup.RubricCategoryFk, entity.Code);
							entity.HasToGenerateCode = true;
							platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: true}]);
						} else {
							entity.Code = '';
							entity.HasToGenerateCode = false;
							platformRuntimeDataService.readonly(entity, [{field: 'Code', readonly: false}]);
						}
						platformDataValidationService.validateMandatory(entity, entity.Code, 'Code', service, resourcePlantEstimateEquipmentDataService);
						platformDataValidationService.validateMandatory(entity, entity.RubricCategoryFk, 'RubricCategoryFk', service, resourcePlantEstimateEquipmentDataService);
					}
				}

				return true;
			});
		};

		self.asyncValidatePlantGroupFk  = function (entity, value, model) {
			var asyncMarker = platformDataValidationService.registerAsyncCall(entity, value, model, resourcePlantEstimateEquipmentDataService);
			var defer = $q.defer();

			if(entity.Version === 0 ) {
				asyncMarker.myInternalPromise = $q.all([
					self.asyncCopyCharacteristicsOnChangedPlantGroupFk(entity, value, model),
					self.asyncCheckCodeHasToBeGeneratedOnChangedPlantGroupFk(entity, value, model)
				]);
			}
			else {
				asyncMarker.myInternalPromise = self.asyncCopyCharacteristicsOnChangedPlantGroupFk(entity, value, model);
			}

			asyncMarker.myInternalPromise.then(function() {
				var result = platformDataValidationService.finishAsyncValidation(true, entity, value, model, asyncMarker, self, resourcePlantEstimateEquipmentDataService);

				defer.resolve(result);

				return true;
			});
			asyncMarker.myPromise = defer.promise;

			return asyncMarker.myPromise;
		};

		function doValidatePackageType(entity, value, model)
		{
			var lookupService = $injector.get('basPackagingTypeLookupDataService');
			var packagingTypeLookups = lookupService.getListSync(model);

			var packagingType = _.find(packagingTypeLookups, {'Id': value});
			if (packagingType) {
				entity.DangerCapacity = packagingType.DefaultCapacity;
				entity.UomDcFk = packagingType.UomFk;
			}
		}

		self.validateDangerClassFk = function (entity, value) {
			var service = $injector.get('basicsLookupdataSimpleLookupService');
			var dangerClassLookups = service.getData({
				lookupModuleQualifier: 'basics.customize.dangerclass',
				displayMember: 'Description',
				valueMember: 'Id'
			});

			var dangerClass = _.find(dangerClassLookups, {'Id': value});
			if (dangerClass && dangerClass.PackageTypeFk && dangerClass.PackageTypeFk !== entity.PackageTypeFk) {
				entity.PackageTypeFk = dangerClass.PackageTypeFk;
				doValidatePackageType(entity, entity.PackageTypeFk, 'PackageTypeFk');
			}

			return true;
		};

		self.validatePackageTypeFk = function (entity, value, model) {
			doValidatePackageType(entity, value, model);

			return true;
		};
	}
})(angular);

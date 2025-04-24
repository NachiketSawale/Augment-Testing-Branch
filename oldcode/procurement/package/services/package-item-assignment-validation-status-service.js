(function(angular){
	'use strict';

	var moduleName = 'procurement.package';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */

	angular.module(moduleName).factory('procurementPackageItemAssignmentValidationStatusService', procurementPackageItemAssignmentValidationStatusService);

	procurementPackageItemAssignmentValidationStatusService.$inject = ['basicsLookupdataLookupDescriptorService',
		'procurementPackageBoqLookupService',
		'platformRuntimeDataService',
		'platformDataValidationService',
		'cloudCommonGridService'];

	function procurementPackageItemAssignmentValidationStatusService(basicsLookupdataLookupDescriptorService,
		procurementPackageBoqLookupService,
		platformRuntimeDataService,
		platformDataValidationService,
		cloudCommonGridService) {
		var service = {};

		service.setDataService = setDataService;
		service.setValidationService = setValidationService;
		service.validateAsChangeEntity = validateAsChangeEntity;
		service.validateAsDeleteEntities = validateAfterDeleteEntities;

		service.onEstHeaderFkChanged = function(/* entity, value, model */) {};
		service.onEstLineItemFkChanged = function(/* entity, value, model */) {};
		service.onBoqItemFkChanged = function(entity, value) {
			if (value) {
				var boqItem = procurementPackageBoqLookupService.getItemById(value);
				var rootItem = getBoqRootItem(boqItem);
				if (rootItem && angular.isDefined(rootItem.Id)) {
					entity.BoqHeaderFk = boqItem.BoqHeaderFk;
					entity.BoqHeaderReference = rootItem.Reference;
				}
			}
			else {
				entity.BoqHeaderFk = null;
				entity.BoqHeaderReference = null;
			}

			// ////////////////////

			function getBoqRootItem(item) {
				var rootItem = null;
				if (item && angular.isDefined(item.Id)) {
					var list = procurementPackageBoqLookupService.getList();
					if (list && list.length > 0) {
						var output = [];
						cloudCommonGridService.flatten(list, output, 'BoqItems');
						rootItem = cloudCommonGridService.getRootParentItem(item, output, 'BoqItemFk');
					}
				}
				return rootItem && angular.isDefined(rootItem.Id) ? rootItem : null;
			}
		};
		service.onEstResourceFkChanged = function(/* entity, value, model */) {};
		service.onPrcItemFkChanged = function(/* entity, value, model */) {};

		// ///////////////////////////////
		var dataService = null;
		var validationService = null;
		var duplicateEntityIdContainer = [];

		var status = {
			valid: 'valid',
			errorEmptyOrNull: 'errorEmptyOrNull',
			errorEstResourceWithBoQ: 'errorEstResourceWithBoQ',
			errorBoqNotPosition: 'errorBoqNotPosition',
			errorDifferentMaterialFk: 'errorDifferentMaterialFk',
			errorDifferentMaterialDescription: 'errorDifferentMaterialDescription',
			errorIsNotUnique: 'errorIsNotUnique'
		};

		var fieldStatusCache = {};

		// ///////////////////////////////
		function getfieldStatuses(id){
			if(!fieldStatusCache[id]){
				fieldStatusCache[id] = {
					EstHeaderFk: status.valid,
					EstLineItemFk: status.valid,
					BoqItemFk: status.valid,
					EstResourceFk: status.valid,
					PrcItemFk: status.valid
				};
			}

			return fieldStatusCache[id];
		}

		function setDataService(ds){
			dataService = ds;
		}

		function setValidationService(vs){
			validationService = vs;
		}

		function validateAsChangeEntity(entity, value, model){
			outPutValidationStatus(entity, value, model);
			var result = applyValidationStatuses(entity, value, model);
			dataService.gridRefresh();
			return result;
		}

		function validateAfterDeleteEntities(entities){
			_.forEach(entities, function(entity){
				var uniqueValidator = getUniqueValidator();
				uniqueValidator.validate(entity);
			});

			dataService.gridRefresh();
		}

		function outPutValidationStatus(entity, value, model){
			var tempEntity = angular.copy(entity);
			tempEntity[model] = value;

			if(isNewCreated(entity, tempEntity)){
				var fieldStatuses = getfieldStatuses(entity.Id);
				fieldStatuses.EstHeaderFk = status.errorEmptyOrNull;
				fieldStatuses.EstLineItemFk = status.errorEmptyOrNull;
				fieldStatuses.BoqItemFk = status.errorEmptyOrNull;
				fieldStatuses.EstResourceFk = status.errorEmptyOrNull;
				fieldStatuses.PrcItemFk = status.errorEmptyOrNull;
				return fieldStatuses;
			}
			else{
				switch (model) {
					case 'EstHeaderFk':
						validateEstHeaderFk(entity, tempEntity);
						break;
					case 'EstLineItemFk':
						validateEstLineItemFk(entity, tempEntity);
						break;
					case 'BoqItemFk':
						validateBoqItemFk(entity, tempEntity);
						break;
					case 'EstResourceFk':
						validateEstResourceFk(entity, tempEntity);
						break;
					case 'PrcItemFk':
						validatePrcItemFk(entity, tempEntity);
						break;
					default:
						break;
				}
			}


		}

		function applyValidationStatuses(entity, value, model){
			var result = {
				apply: true,
				valid: true
			};

			var tempEntity = angular.copy(entity);
			tempEntity[model] = value;

			switch (model) {
				case 'EstHeaderFk':
					result = applyValidationStatus(entity, tempEntity.EstHeaderFk, 'EstHeaderFk');
					applyValidationStatus(entity, tempEntity.EstLineItemFk, 'EstLineItemFk');
					applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
					break;
				case 'EstLineItemFk':
					result = applyValidationStatus(entity, tempEntity.EstLineItemFk, 'EstLineItemFk');
					applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
					break;
				case 'BoqItemFk':
					result = applyValidationStatus(entity, tempEntity.BoqItemFk, 'BoqItemFk');
					applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
					applyValidationStatus(entity, tempEntity.PrcItemFk, 'PrcItemFk');
					break;
				case 'EstResourceFk':
					applyValidationStatus(entity, tempEntity.BoqItemFk, 'BoqItemFk');
					result = applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
					applyValidationStatus(entity, tempEntity.PrcItemFk, 'PrcItemFk');
					break;
				case 'PrcItemFk':
					applyValidationStatus(entity, tempEntity.BoqItemFk, 'BoqItemFk');
					applyValidationStatus(entity, tempEntity.EstResourceFk, 'EstResourceFk');
					result = applyValidationStatus(entity, tempEntity.PrcItemFk, 'PrcItemFk');
					break;
				default:
					break;
			}

			return result;
		}

		function applyValidationStatus(entity, value, model){
			var result = {
				apply: true
			};

			var fieldStatuses = getfieldStatuses(entity.Id);
			var filedStatus = fieldStatuses[model];
			if(filedStatus === status.valid){
				result.valid = true;
			}
			else{
				result.valid = false;
				result.error = '...';
				result.error$tr$param$ = {fieldName: model.toLowerCase()};

				switch (filedStatus) {
					case status.errorEmptyOrNull:
						result.error$tr$ = 'cloud.common.emptyOrNullValueErrorMessage';
						break;
					case status.errorEstResourceWithBoQ:
						result.error$tr$ = 'procurement.package.itemAssignment.error.estResourceWithBoQ';
						break;
					case status.errorBoqNotPosition:
						result.error$tr$ = 'procurement.package.itemAssignment.error.BoQNotPosition';
						break;
					case status.errorDifferentMaterialFk:
						result.error$tr$ = 'procurement.package.itemAssignment.error.differentMaterialFk';
						break;
					case status.errorDifferentMaterialDescription:
						result.error$tr$ = 'procurement.package.itemAssignment.error.differentMaterialDescription';
						break;
					case status.errorIsNotUnique:
						result.error$tr$ = 'procurement.package.itemAssignment.error.notUnique';
						break;
					default:
						break;
				}
			}

			platformRuntimeDataService.applyValidationResult(result, entity, model);
			return platformDataValidationService.finishValidation(result, entity, value, model, validationService, dataService);
		}

		function isNewCreated(entity, tempEntity){
			return isAllNull(entity) &&  isAllNull(tempEntity);
		}

		function validateEstHeaderFk(entity, tempEntity) {
			if(entity.EstHeaderFk === tempEntity.EstHeaderFk) {
				return;
			}

			service.onEstHeaderFkChanged(entity, tempEntity.EstHeaderFk, 'EstHeaderFk');

			var fieldStatuses = getfieldStatuses(entity.Id);
			fieldStatuses.EstHeaderFk = status.valid;
			if(!mandatoryCheck(tempEntity.EstHeaderFk)){
				fieldStatuses.EstHeaderFk = status.errorEmptyOrNull;
			}

			resetEstLineItemFk(tempEntity);
			if(entity.EstLineItemFk !== tempEntity.EstLineItemFk) {
				validateEstLineItemFk(entity, tempEntity);
				entity.EstLineItemFk = tempEntity.EstLineItemFk;
			}

			isUnique(entity, tempEntity.EstHeaderFk, 'EstHeaderFk');
		}

		function validateEstLineItemFk(entity, tempEntity){
			if(entity.EstLineItemFk === tempEntity.EstLineItemFk) {
				return;
			}

			service.onEstLineItemFkChanged(entity, tempEntity.EstLineItemFk, 'EstLineItemFk');

			var fieldStatuses = getfieldStatuses(entity.Id);
			fieldStatuses.EstLineItemFk = status.valid;
			if(!mandatoryCheck(tempEntity.EstLineItemFk)){
				fieldStatuses.EstLineItemFk = status.errorEmptyOrNull;
			}

			resetEstResourceFk(tempEntity);
			if(entity.EstResourceFk !== tempEntity.EstResourceFk) {
				validateEstResourceFk(entity, tempEntity);
				entity.EstResourceFk = tempEntity.EstResourceFk;
			}

			isUnique(entity, tempEntity.EstLineItemFk, 'EstLineItemFk');
		}

		function validateEstResourceFk(entity, tempEntity){
			if(entity.EstResourceFk === tempEntity.EstResourceFk) {
				return;
			}

			service.onEstResourceFkChanged(entity, tempEntity.EstResourceFk, 'EstResourceFk');

			var fieldStatuses = getfieldStatuses(entity.Id);
			fieldStatuses.EstResourceFk = status.valid;
			if(!mandatoryCheck(tempEntity.EstResourceFk)){
				fieldStatuses.EstResourceFk = status.errorEmptyOrNull;

				if(fieldStatuses.BoqItemFk === status.errorEstResourceWithBoQ){
					fieldStatuses.BoqItemFk = status.valid;
				}
			}

			isEstResourceWithBoQ(tempEntity);
			isMaterialDifferent(tempEntity);
			isUnique(entity, tempEntity.EstResourceFk, 'EstResourceFk');
		}

		function validatePrcItemFk(entity, tempEntity) {
			if(entity.PrcItemFk === tempEntity.PrcItemFk) {
				return;
			}

			service.onPrcItemFkChanged(entity, tempEntity.PrcItemFk, 'PrcItemFk');

			var fieldStatuses = getfieldStatuses(entity.Id);
			fieldStatuses.PrcItemFk = status.valid;
			if(!mandatoryCheck(tempEntity.PrcItemFk)){
				fieldStatuses.PrcItemFk = status.errorEmptyOrNull;

				if(!mandatoryCheck(tempEntity.BoqItemFk)){
					fieldStatuses.BoqItemFk = status.errorEmptyOrNull;
				}
			}
			else{
				fieldStatuses.BoqItemFk = status.valid;
			}

			isMaterialDifferent(tempEntity);
			isUnique(entity, tempEntity.PrcItemFk, 'PrcItemFk');
		}

		function validateBoqItemFk(entity, tempEntity) {
			if(entity.BoqItemFk === tempEntity.BoqItemFk) {
				return;
			}

			service.onBoqItemFkChanged(entity, tempEntity.BoqItemFk, 'BoqItemFk');

			var fieldStatuses = getfieldStatuses(entity.Id);
			fieldStatuses.BoqItemFk = status.valid;
			if(!mandatoryCheck(tempEntity.BoqItemFk)){
				fieldStatuses.BoqItemFk = status.errorEmptyOrNull;

				if(!mandatoryCheck(tempEntity.PrcItemFk)){
					fieldStatuses.PrcItemFk = status.errorEmptyOrNull;
				}
				if(fieldStatuses.EstResourceFk === status.errorEstResourceWithBoQ){
					fieldStatuses.EstResourceFk = status.valid;
				}
			}
			else{
				fieldStatuses.PrcItemFk = status.valid;
			}

			isEstResourceWithBoQ(tempEntity);

			if(fieldStatuses.BoqItemFk === status.valid){
				isBoQNotPosition(tempEntity);
			}

			isUnique(entity, tempEntity.BoqItemFk, 'BoqItemFk');
		}

		function isEstResourceWithBoQ(tempEntity){
			var list = dataService.getList();
			var found = _.find(list, function(item){
				return item.Id !== tempEntity.Id && item.EstResourceFk === tempEntity.EstResourceFk && item.BoqItemFk && tempEntity.BoqItemFk;
			});

			if (found) {
				var fieldStatuses = getfieldStatuses(tempEntity.Id);
				fieldStatuses.BoqItemFk = status.errorEstResourceWithBoQ;
				fieldStatuses.EstResourceFk = status.errorEstResourceWithBoQ;
			}
		}

		function isBoQNotPosition(tempEntity){
			var boqItem = procurementPackageBoqLookupService.getItemById(tempEntity.BoqItemFk);
			if (boqItem && angular.isDefined(boqItem.Id) && boqItem.BoqLineTypeFk !== 0) {
				var fieldStatuses = getfieldStatuses(tempEntity.Id);
				fieldStatuses.BoqItemFk = status.errorBoqNotPosition;
			}
		}

		function isMaterialDifferent(tempEntity){
			var prcItems = basicsLookupdataLookupDescriptorService.getData('prcitem');
			var prcItemId = tempEntity.PrcItemFk;
			var prcItem = prcItemId !== null && prcItemId !== -1 ? prcItems[prcItemId] : null;

			var resources = basicsLookupdataLookupDescriptorService.getData('estresource4itemassignment');
			var resourceId = tempEntity.EstResourceFk;
			var resource = resourceId !== null && resourceId !== -1 ? resources[resourceId] : null;

			var fieldStatuses = getfieldStatuses(tempEntity.Id);
			if(prcItem && resource){
				if(resource.EstResourceTypeFk === 2) {
					if (prcItem.MdcMaterialFk !== resource.MdcMaterialFk&&prcItem.BasUomFk!==resource.BasUomFk) {
						fieldStatuses.EstResourceFk = status.errorDifferentMaterialFk;
						fieldStatuses.PrcItemFk = status.errorDifferentMaterialFk;
					}
					else{
						if(isMaterialDifferentStatus(fieldStatuses)){
							fieldStatuses.EstResourceFk = status.valid;
							fieldStatuses.PrcItemFk = status.valid;
						}
					}
				}
				else {
					if(prcItem.MaterialDescription !== resource.DescriptionInfo.Translated&&prcItem.BasUomFk!==resource.BasUomFk){
						fieldStatuses.EstResourceFk = status.errorDifferentMaterialDescription;
						fieldStatuses.PrcItemFk = status.errorDifferentMaterialDescription;
					}
					else{
						if(isMaterialDifferentStatus(fieldStatuses)){
							fieldStatuses.EstResourceFk = status.valid;
							fieldStatuses.PrcItemFk = status.valid;
						}
					}
				}
			}
			else{
				if(isMaterialDifferentStatus(fieldStatuses)){
					if(resource){
						fieldStatuses.EstResourceFk = status.valid;
					}

					if(prcItem){
						fieldStatuses.PrcItemFk = status.valid;
					}
				}
			}
		}

		function isMaterialDifferentStatus(fieldStatuses){
			return fieldStatuses.EstResourceFk === status.errorDifferentMaterialFk || fieldStatuses.EstResourceFk === status.errorDifferentMaterialDescription || fieldStatuses.PrcItemFk === status.errorDifferentMaterialFk || fieldStatuses.PrcItemFk === status.errorDifferentMaterialDescription;
		}

		function mandatoryCheck(value) {
			var valid = true;
			if (value === -1 || value === 0 || value === null || angular.isUndefined(value)) {
				valid = false;
			}
			return valid;
		}

		function resetEstLineItemFk(tempEntity){
			var lineItems = basicsLookupdataLookupDescriptorService.getData('estlineitemlookup');
			if (lineItems && lineItems[tempEntity.EstLineItemFk]) {
				var lineItem = lineItems[tempEntity.EstLineItemFk];

				if (lineItem.EstHeaderFk !== tempEntity.EstHeaderFk) {
					tempEntity.EstLineItemFk = -1;
				}
			}
			else {
				tempEntity.EstLineItemFk = -1;
			}
		}

		function resetEstResourceFk(tempEntity){
			tempEntity.EstResourceFk = -1;
		}

		function isAllNull(entity){
			return !(mandatoryCheck(entity.EstHeaderFk) || mandatoryCheck(entity.EstLineItemFk) ||
				mandatoryCheck(entity.BoqItemFk) || mandatoryCheck(entity.EstResourceFk) ||
				mandatoryCheck(entity.PrcItemFk));
		}

		function isUnique(entity, value, model){
			var fieldStatuses = getfieldStatuses(entity.Id);
			if(fieldStatuses.EstHeaderFk !== status.valid || fieldStatuses.EstLineItemFk !== status.valid || fieldStatuses.BoqItemFk !== status.valid || fieldStatuses.EstResourceFk !== status.valid || fieldStatuses.PrcItemFk !== status.valid){
				restoreFromIsNotUniqueStatus(entity, value, model);
				return;
			}

			var uniqueValidator = getUniqueValidator();
			uniqueValidator.validate(entity, value, model);
		}

		function restoreFromIsNotUniqueStatus(entity, value, model){
			var fieldStatuses = getfieldStatuses(entity.Id);
			if (fieldStatuses.EstHeaderFk === status.errorIsNotUnique || fieldStatuses.EstLineItemFk === status.errorIsNotUnique || fieldStatuses.BoqItemFk === status.errorIsNotUnique || fieldStatuses.EstResourceFk === status.errorIsNotUnique || fieldStatuses.PrcItemFk === status.errorIsNotUnique) {
				var uniqueValidator = getUniqueValidator();
				uniqueValidator.validate(entity, value, model);
			}
		}

		function getUniqueValidator(){
			var validator = {};
			var containerDatas = getContainerDatas();

			validator.validate = validate;

			// /////////////////////////////////////
			function validate(entity, value, model){
				if(model === undefined){
					validateInDuplicateEntities(entity);
				}
				else{
					var isDuplicate = validateInDuplicateEntities(entity, value, model);
					if(!isDuplicate){
						validateInAllEntities(entity, value, model);
					}
				}
			}

			function validateInDuplicateEntities(entity, value, model){
				var isDuplicate = false;
				var duplicateEntities = [];

				for(var i = 0; i < duplicateEntityIdContainer.length; ++i){
					var duplicateEntityIds = duplicateEntityIdContainer[i];

					var index = duplicateEntityIds.indexOf(entity.Id);
					if(index !== -1){
						if(duplicateEntityIds.length > 2){
							duplicateEntityIds.splice(index, 1);
						}
						else{
							duplicateEntityIds.splice(index, 1);
							for(var j = 0; j < duplicateEntityIds.length; ++j){
								var duplicateEntityId = duplicateEntityIds[j];
								duplicateEntities.push(getContainerData(duplicateEntityId));
							}
							duplicateEntityIdContainer.splice(i, 1);
						}

						var previousStatuses = getPreviousStatus(entity.Id);
						applyValidationStatuses(duplicateEntities, false, entity, previousStatuses);
					}
					else{
						var _duplicateEntityId = duplicateEntityIds[0];
						var duplicateEntity = getContainerData(_duplicateEntityId);
						entity[model] = value;

						if(isEntitiesDuplicate(duplicateEntity, entity)) {
							duplicateEntityIds.push(entity.Id);
							duplicateEntities.push(entity);
							applyValidationStatuses(duplicateEntities, true);
							isDuplicate = true;
							break;
						}
					}
				}

				return isDuplicate;
			}

			function validateInAllEntities(entity, value, model){
				var duplicateIds = [];
				var duplicateEntities = [];

				_.forEach(containerDatas, function (item) {
					if(item.Id !== entity.Id){
						entity[model] = value;
						if(isEntitiesDuplicate(item, entity)) {
							duplicateIds.push(item.Id);
							duplicateEntities.push(item);

							if(duplicateIds.indexOf(entity.Id) === -1){
								duplicateIds.push(entity.Id);
								duplicateEntities.push(entity);
							}
						}
					}
				});

				if(duplicateIds.length > 0){
					duplicateEntityIdContainer.push(duplicateIds);
					applyValidationStatuses(duplicateEntities, true);
				}
			}

			function applyValidationStatuses(entities, isDuplicate, entity, previousStatuses) {
				for(var i = 0; i < entities.length; ++i){
					var fieldStatuses = getfieldStatuses(entities[i].Id);
					if (isDuplicate) {
						copyStatues({}, fieldStatuses, status.errorIsNotUnique);
					} else {
						copyStatues({}, fieldStatuses, status.valid);
					}
				}

				_.forEach(entities, function (item) {
					applyValidationStatus(item, item.EstHeaderFk, 'EstHeaderFk');
					applyValidationStatus(item, item.EstLineItemFk, 'EstLineItemFk');
					applyValidationStatus(item, item.EstResourceFk, 'EstResourceFk');
					applyValidationStatus(item, item.BoqItemFk, 'BoqItemFk');
					applyValidationStatus(item, item.PrcItemFk, 'PrcItemFk');
				});

				if(!isDuplicate){
					var _fieldStatuses = getfieldStatuses(entity.Id);
					copyStatues(previousStatuses, _fieldStatuses, status.valid);

					applyValidationStatus(entity, entity.EstHeaderFk, 'EstHeaderFk');
					applyValidationStatus(entity, entity.EstLineItemFk, 'EstLineItemFk');
					applyValidationStatus(entity, entity.EstResourceFk, 'EstResourceFk');
					applyValidationStatus(entity, entity.BoqItemFk, 'BoqItemFk');
					applyValidationStatus(entity, entity.PrcItemFk, 'PrcItemFk');
				}
			}

			function getContainerDatas(){
				return dataService.getList();
			}

			function getContainerData(Id){
				for(var i = 0; i < containerDatas.length; ++i){
					if(containerDatas[i].Id === Id){
						return containerDatas[i];
					}
				}

				return null;
			}

			function isEntitiesDuplicate(entity1, entity2){
				if (!entity1 || !entity2) {
					return false;
				}

				// var fieldStatuses = getfieldStatuses(entity1.Id);
				return !(!isPossibleToDuplicate(entity1, entity2, 'EstHeaderFk') || !isPossibleToDuplicate(entity1, entity2, 'EstLineItemFk') || !isPossibleToDuplicate(entity1, entity2, 'BoqItemFk') || !isPossibleToDuplicate(entity1, entity2, 'EstResourceFk') || !isPossibleToDuplicate(entity1, entity2, 'PrcItemFk'));
			}

			function isPossibleToDuplicate(entity1, entity2, model){
				var isPossible = true;
				var fieldStatuses = getfieldStatuses(entity1.Id);
				if(entity1[model] !== entity2[model] || (fieldStatuses[model] !== status.valid && fieldStatuses[model] !== status.errorIsNotUnique)){
					isPossible = false;
				}
				return isPossible;
			}

			function copyStatues(src, dst, defaultStatus){
				dst.EstHeaderFk = src.EstHeaderFk ? src.EstHeaderFk : defaultStatus;
				dst.EstLineItemFk = src.EstLineItemFk ? src.EstLineItemFk : defaultStatus;
				dst.BoqItemFk = src.BoqItemFk ? src.BoqItemFk : defaultStatus;
				dst.EstResourceFk = src.EstResourceFk ? src.EstResourceFk : defaultStatus;
				dst.PrcItemFk = src.PrcItemFk ? src.PrcItemFk : defaultStatus;
			}

			function getPreviousStatus(id){
				var previousStatuses = {};
				var fieldStatuses = getfieldStatuses(id);
				copyStatues(fieldStatuses, previousStatuses, status.valid);

				if(previousStatuses.EstHeaderFk === status.errorIsNotUnique){
					previousStatuses.EstHeaderFk = status.valid;
				}
				if(previousStatuses.EstLineItemFk === status.errorIsNotUnique){
					previousStatuses.EstLineItemFk = status.valid;
				}
				if(previousStatuses.EstResourceFk === status.errorIsNotUnique){
					previousStatuses.EstResourceFk = status.valid;
				}
				if(previousStatuses.BoqItemFk === status.errorIsNotUnique){
					previousStatuses.BoqItemFk = status.valid;
				}
				if(previousStatuses.PrcItemFk === status.errorIsNotUnique){
					previousStatuses.PrcItemFk = status.valid;
				}

				return previousStatuses;
			}

			return validator;
		}

		return service;
	}
})(angular);
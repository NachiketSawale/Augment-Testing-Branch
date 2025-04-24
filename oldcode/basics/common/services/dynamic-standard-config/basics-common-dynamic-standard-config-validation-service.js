/**
 * Created by mov on 02.28.2022.
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonDynamicStandardConfigurationServiceExtension
	 * @function
	 *
	 * @description: Create Grid And Detail configuration dynamically, this extension should be added to the StandardConfigurationService to be able to handle the GRID or Detail configuration on the fly.
	 *
	 */
	angular.module(moduleName).service('basicsCommonDynamicStandardConfigValidationService', [
		'$q', '$injector', '_',
		function ($q, $injector, _) {

			let service = {};

			angular.extend(service, {
				addValidationConfiguration: addValidationConfiguration
			});

			return service;


			function addValidationConfiguration(dynamicGroupSettings, dynamicUIStandardConfigService, validationService){
				let groupName = dynamicGroupSettings.gid;

				// Dynamic Data Main Service
				let mainService = dynamicGroupSettings.options.mainService ? $injector.get(dynamicGroupSettings.options.mainService): null;
				let valueMemberField = dynamicGroupSettings.options.valueMember;

				// List
				_.forEach(dynamicUIStandardConfigService.getStandardConfigForListView().columns, function (col) {
					applyValidationExtension(groupName, col, col.field, validationService, mainService, valueMemberField);
				});

				// Detail
				_.forEach(dynamicUIStandardConfigService.getStandardConfigForDetailView().rows, function (row) {
					applyValidationExtension(groupName, row, row.model, validationService, mainService, valueMemberField);
				});
			}

			function applyValidationExtension(groupName, property, fieldName, validationService, mainService, valueMember){
				let syncGroupName = 'validate' + groupName;
				let asyncGroupName = 'asyncValidate' + groupName;

				let propertyName = fieldName.replace(/\./g, '$');

				let syncName = 'validate' + propertyName;
				let asyncName = 'asyncValidate' + propertyName;

				// var syncBulkName = 'validate' + propertyName + 'ForBulkConfig';
				// var asyncBulkName = 'asyncValidate' + propertyName + 'ForBulkConfig';

				if (validationService[syncGroupName]){
					validationService[syncName] = validationService[syncGroupName];
				}

				if (validationService[asyncGroupName]){
					validationService[asyncName] = validationService[asyncGroupName];
				}

				if (validationService[syncName]) {
					property.validator = validationService[syncName];
				}

				// Test validate and update
				if (validationService[asyncName]) {
					//  property.asyncValidator = function(){
					property.asyncValidator = function(){
						let defer = $q.defer();

						let entity = arguments[0];
						let value = arguments[1];
						let model = arguments[2];
						let vResult = validationService[asyncName].call(this, entity, value, model);

						let entityModified = {EntityId: entity.Id, Value: value, ColumnId: property.id.replace(groupName.toLowerCase(),'')};

						if (!mainService){
							defer.resolve(vResult);
						}

						let item = mainService.getItemById(entityModified.ColumnId);

						if (item){
							item[valueMember] = entityModified.Value;
							mainService.markItemAsModified(item);
							defer.resolve(vResult);
						}else{
							return mainService.createItem({}).then(function(newItem){
								newItem[valueMember] = entityModified.Value;
								mainService.markItemAsModified(newItem);
								defer.resolve(vResult);
							});
						}

						return defer.promise;
					};
				}
			}

		}
	]);
})(angular);

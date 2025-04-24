/**
 * Created by benny on 26.01.2017.
 */
/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name estimateAssembliesWicItemProcessor
	 * @function
	 *
	 * @description
	 * The estimateAssembliesWicItemProcessor is the service set assembly wic item readonly or editable.
	 */
	let moduleName = 'estimate.assemblies';

	angular.module(moduleName).factory('estimateAssembliesWicItemProcessor', ['$injector', 'platformRuntimeDataService',
		function ($injector, platformRuntimeDataService) {

			let service = {};

			service.processItem = function processItem(entity) {
				service.setColumnReadOnly(entity, 'BoqWicCatBoqFk', !(entity && !!entity.BoqWicCatFk));
				service.setColumnReadOnly(entity, 'BoqItemFk', !(entity && !!entity.BoqWicCatBoqFk));
				// validate after data loaded
				let validationService = $injector.get('estimateAssembliesWicItemValidationService');
				let boqMainService = $injector.get('estimateAssembliesWicItemService');

				if(validationService && boqMainService){
					let boqWicCatFk = entity.BoqWicCatFk;
					if(!boqWicCatFk){
						validationService.validateBoqWicCatFk(entity,boqWicCatFk,'BoqWicCatFk');
					}else{
						let boqWicCatBoqFk = entity.BoqWicCatBoqFk;
						if(!boqWicCatBoqFk){
							validationService.validateBoqWicCatBoqFk(entity,boqWicCatBoqFk,'BoqWicCatBoqFk');
						}else{
							let boqItemFk = entity.EstAssemblyWicItem.BoqItemFk;
							validationService.validateBoqItemFk(entity, boqItemFk, 'BoqItemFk',true);
						}
					}
				}
			};

			service.setColumnReadOnly = function setColumnReadOnly(item, column, flag) {
				let fields = [
					{field: column, readonly: flag}
				];
				platformRuntimeDataService.readonly(item, fields);
			};

			return service;
		}]);
})(angular);

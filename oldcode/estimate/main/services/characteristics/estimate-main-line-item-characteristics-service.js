/**
 * Created by lnt on 3/12/2019.
 */

(function () {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLineItemCharacteristicsService
	 * @function
	 *
	 * @description
	 * estimateMainLineItemCharacteristicsService is the data service for all estimate related functionality.
	 */
	angular.module(moduleName).factory('estimateMainLineItemCharacteristicsService',
		['$q', '$http', '$injector', 'platformGridAPI', 'basicsCharacteristicDataServiceFactory', 'basicsCharacteristicTypeHelperService', 'estimateMainService', 'estimateMainDynamicColumnService',
			function ($q, $http, $injector, platformGridAPI, basicsCharacteristicDataServiceFactory, CharacteristicTypeService, estimateMainService, estimateMainDynamicColumnService) {

				let data = {
					sectionId: 28
				};

				let service = basicsCharacteristicDataServiceFactory.getService(estimateMainService, data.sectionId, null, 'EstHeaderFk');

				angular.extend(service, {
					registerEvents: registerEvents,
					createDefaultCharacteristics: createDefaultCharacteristics
				});

				let baseOnCreateItem = service.createItem;
				service.createItem = function createItem() {
					const estimateMainService = $injector.get('estimateMainService');
					const lineItem = estimateMainService.getSelected();
					if (lineItem && !estimateMainService.isLineItemStatusReadonly(lineItem.Id, lineItem.EstHeaderFk)) {
						baseOnCreateItem(null,null);
					}
				};
				return service;

				// Register events will be triggered only one time with the initialized flag, otherwise it will be registered several times caused by the permission issue.
				function registerEvents() {
					// Workaround, because of permission issue, this is handled like that.
					unregisterEventsClean();

					service.registerItemValueUpdate(onItemUpdate);
					service.registerItemDelete(onItemDelete);
				}

				function unregisterEventsClean() { // This cleans previous registered events
					service.unregisterItemDelete(onItemDelete);
					service.unregisterItemValueUpdate(onItemUpdate);
				}

				function onItemUpdate(e, item) {
					service.getItemByCharacteristicFk(item.CharacteristicFk).then(function (data) {
						item.CharacteristicEntity = data;
						updateLineitemChars(item).then(function(){
							estimateMainDynamicColumnService.resizeLineItemGrid();
						});
					});
				}

				// update the line item characteristic column
				function updateLineitemChars(item, newItem){
					let defer = $q.defer();
					let lineItem = newItem ? newItem : estimateMainService.getSelected();
					if(!lineItem){
						return defer.resolve(null);
					}
					let lineItemList = estimateMainService.getList();
					lineItem = lineItem.Id === item.ObjectFk ? lineItem : _.find(lineItemList, {'Id': item.ObjectFk});
					let characteristicCode = _.findLast(item.CharacteristicEntity.Code) === '.' ? _.trimEnd(item.CharacteristicEntity.Code, '.') : item.CharacteristicEntity.Code;
					let columnIdorField = _.replace(characteristicCode, ' ', '');
					let columnName = characteristicCode;
					let characteristicCol = $injector.get('estimateMainCommonService').appendCharacCol(columnIdorField, item);
					let isExist = estimateMainDynamicColumnService.isExistColumn(characteristicCol);
					if (!item.isValueChange && item.OldCharacteristicEntity) {
						let oldCharacteristicCode = _.findLast(item.OldCharacteristicEntity.Code) === '.' ? _.trimEnd(item.OldCharacteristicEntity.Code, '.') : item.OldCharacteristicEntity.Code;
						// let oldColumnIdorField = _.replace(oldCharacteristicCode, ' ', '');
						let oldCharacteristicCol = $injector.get('estimateMainCommonService').appendCharacCol(oldCharacteristicCode, item);
						lineItem[oldCharacteristicCol] = null;
						if ($injector.get('estimateMainCommonService').isRemoveColunm(lineItem, oldCharacteristicCol, estimateMainService)) {
							estimateMainDynamicColumnService.removeColumn(oldCharacteristicCol);
						}
					}
					let type = CharacteristicTypeService.characteristicType2Domain(item.CharacteristicTypeFk);
					let value = CharacteristicTypeService.convertValue(item.ValueText, item.CharacteristicTypeFk);
					if (CharacteristicTypeService.isLookupType(item.CharacteristicTypeFk)) {
						estimateMainService.setCharacteristicColumn(characteristicCol);
						let characteristicListService = $injector.get('basicsCharacteristicCharacteristicValueDataService');
						characteristicListService.getList().then(function () {
							lineItem[characteristicCol] = value;
							if (!item.isValueChange && !isExist) {
								estimateMainDynamicColumnService.addColumn(item, columnIdorField, columnName);
								$injector.get('estimateMainCommonService').syncCharacteristicCol(lineItem, characteristicCol, type, estimateMainService);
							}
							defer.resolve(lineItem);
						});
					}
					else {
						lineItem[characteristicCol] = value;
						if (!item.isValueChange && !isExist) {
							estimateMainDynamicColumnService.addColumn(item, columnIdorField, columnName);
							$injector.get('estimateMainCommonService').syncCharacteristicCol(lineItem, characteristicCol, type, estimateMainService);
							defer.resolve(lineItem);
						}
					}
					estimateMainService.markItemAsModified(lineItem);

					return defer.promise;
				}

				function onItemDelete(e, items) {
					let lineItem = estimateMainService.getSelected();
					angular.forEach(items, function (item) {
						if (item.CharacteristicEntity !== null) {
							let characteristicCode = _.findLast(item.CharacteristicEntity.Code) === '.' ? _.trimEnd(item.CharacteristicEntity.Code, '.') : item.CharacteristicEntity.Code;
							let columnIdorField = _.replace(characteristicCode, ' ', '');
							let characteristicCol = $injector.get('estimateMainCommonService').appendCharacCol(columnIdorField, item);
							lineItem[characteristicCol] = null;
							if ($injector.get('estimateMainCommonService').isRemoveColunm(lineItem, characteristicCol, estimateMainService)) {
								estimateMainDynamicColumnService.removeColumn(characteristicCol);
							}
						}
					});
					estimateMainDynamicColumnService.resizeLineItemGrid();
				}

				// when create line item done, create the default characteristic
				function  createDefaultCharacteristics(item){
					let defaultChars = estimateMainDynamicColumnService.getDefaultCharacteristics();

					let allPromises = [];
					_.forEach(defaultChars, function(defaultChar){
						defaultChar.ObjectFk = item.Id;
						let promise = updateLineitemChars(defaultChar, item);
						allPromises.push(promise);
					});

					$q.all(allPromises).then(function(){
						// TODO: Do not refresh grid layout
						// estimateMainDynamicColumnService.resizeLineItemGrid();
					});
				}


			}]);
})();

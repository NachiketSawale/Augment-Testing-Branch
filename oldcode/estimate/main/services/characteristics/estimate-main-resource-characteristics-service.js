/**
 * Created by mov on 12/13/2018.
 */

(function () {
	/* globals globals , _ */
	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainResourceCharacteristicsService
	 * @function
	 *
	 * @description
	 * estimateMainResourceCharacteristicsService is the data service for all estimate related functionality.
	 */
	angular.module(moduleName).factory('estimateMainResourceCharacteristicsService',
		['$q', '$http',  '$injector', 'platformGridAPI', 'basicsCharacteristicDataServiceFactory', 'basicsCharacteristicTypeHelperService', 'estimateMainResourceService',
			function ($q, $http, $injector, platformGridAPI, basicsCharacteristicDataServiceFactory, basicsCharacteristicTypeHelperService, estimateMainResourceService) {

				let data = {
					sectionId: 33, // Resource characteristic section Id
					isInitialized: false,
					colPrefix: 'charactercolumn_',
					resGridId: 'bedd392f0e2a44c8a294df34b1f9ce44', // Estimate resource grid Id to add columns manually
					isLoaded: false,

					chars: [], // Resource characteristics from all resources
					charsDefaultDictionary: {}, // Default characteristics per estimate module, when estimate is refreshed, defaults characteristics will got the latest changes
					charsDictionary: {} // Characteristics to control dynamic columns in estimate resource container
				};

				let service = basicsCharacteristicDataServiceFactory.getService(estimateMainResourceService, data.sectionId, null, 'EstHeaderFk', 'EstLineItemFk');

				// Handle on created event in parent service (estimate main resource service)
				service.registerParentsEntityCreated();

				let serviceContainerData = service.getData();

				// We handle manually the display of resource characteristics
				serviceContainerData.doNotLoadOnSelectionChange = true;

				angular.extend(service, {
					init: init,

					registerEvents: registerEvents,
					unregisterEvents: unregisterEvents,

					deleteDynColumns: deleteDynColumns,
					setDynamicColumnsLayoutToGrid: setDynamicColumnsLayoutToGrid,

					setDynamicColumnsLayout: setDynamicColumnsLayout,
					setDefaultColsToGrid: setDefaultColsToGrid,

					getDefaultCharacteristics: getDefaultCharacteristics,

					clearDefaultCharacteristics: clearDefaultCharacteristics,

					syncUpdateCharacteristic: syncUpdateCharacteristic,
					assignCharsToEntity: assignCharsToEntity,

					addCharToEntityAndGridUI: addCharToEntityAndGridUI,
					getResourceCharacteristicsByLineItem: getResourceCharacteristicsByLineItem
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

				function init(){

					// Defaults are cleared every time we enter to estimate module
					data.charsDefaultDictionary = {};
					data.isLoaded = false;
				}

				// Register events will be triggered only one time with the initialized flag, otherwise it will be registered several times caused by the permission issue.
				function registerEvents(){
				// Workaround, because of permission issue, this is handled like that.
					unregisterEventsClean();

					estimateMainResourceService.registerEntityCreated(registerEntityCreated);
					estimateMainResourceService.registerSelectionChanged(registerSelectionChanged);
					estimateMainResourceService.registerListLoaded(onResourceListLoaded);

					service.registerItemValueUpdate(onItemUpdate);
					service.registerItemDelete(onItemDelete);

					service.updateDone.register(onUpdateDone);

					let estimateMainService = $injector.get('estimateMainService');
					if (!_.isEmpty(estimateMainService.getSelected())){
					// When changing containers //Change to another container, then change it back to the resource container
						setDynamicColumnsLayout({ dynamicColumns: { Characteristics: data.chars }});
					}
				}

				function unregisterEvents(){
				}

				function unregisterEventsClean(){ // This cleans previous registered events
					estimateMainResourceService.unregisterEntityCreated(registerEntityCreated);
					estimateMainResourceService.unregisterSelectionChanged(registerSelectionChanged);
					service.unregisterItemDelete(onItemDelete);
					service.unregisterItemValueUpdate(onItemUpdate);
					service.updateDone.unregister(onUpdateDone);

					estimateMainResourceService.unregisterListLoaded(onResourceListLoaded);
				}

				function onResourceListLoaded(){
				// This is fired once and it is set to cache
					service.setDefaultColsToGrid();
				}

				function deleteDynColumns(entities){
					_.forEach(entities, function(entity){

						// Get chars from entity
						let chars = [];

						for(let col in entity){
							if (col.indexOf(data.colPrefix) > - 1){
								let charId = col.split('_')[1];
								chars.push(parseInt(charId));
							}
						}

						// Remove resource item first then update estimate resource grid columns
						setTimeout(function(){
						// Re-configure grid after the resource item has been deleted
							removeCharsFromDictionary(chars, entity.Id);
						}, 0);
					});
				}

				function assignCharToDictionary(charId, entityId, result){
					result = result || {};

					// eslint-disable-next-line no-prototype-builtins
					if (data.charsDictionary.hasOwnProperty(charId)){
						let charDicResIds = data.charsDictionary[charId];
						charDicResIds.push(entityId);
					}else{
						result.isNew = true;
						data.charsDictionary[charId] = [entityId];
					}
				}

				function assignCharsToDictionary(chars, entityId){
					_.forEach(chars, function(char){
						assignCharToDictionary(char.CharacteristicEntity.Id, entityId);
					});
				}

				function assignCharsToEntity(chars, entity){
					if (entity){
						appendToChars(chars);
						assignCharsToDictionary(chars, entity.Id);
						appendCharacteristicColumnData(chars, entity, true);
					}
				}

				// Append to Resource characteristics
				function appendToChars(chars){
					let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');

					_.forEach(chars, function(charItem){
						platformDataServiceDataProcessorExtension.doProcessItem(charItem, serviceContainerData);

						if(!_.some(serviceContainerData.itemList, function(item){ return item.ObjectFk === charItem.ObjectFk && item.CharacteristicFk === charItem.CharacteristicFk;})){
							data.chars.push(charItem);
							serviceContainerData.itemList.push(charItem);
							serviceContainerData.markItemAsModified(charItem, serviceContainerData);
						}
					});
				}

				function removeCharsFromDictionary(chars, entityId){
					let charsDynColumnsToDelete = [];

					_.forEach(chars, function(charField){
						// eslint-disable-next-line no-prototype-builtins
						if (data.charsDictionary.hasOwnProperty(charField)){
							let charDicResIds = data.charsDictionary[charField];

							let idx = charDicResIds.indexOf(entityId);
							if (idx > -1){
								charDicResIds.splice(idx, 1);
							}

							if (_.isEmpty(charDicResIds)){
								charsDynColumnsToDelete.push(charField);
								delete data.charsDictionary[charField];
							}
						}
					});

					// we remove resources characteristics columns here
					if (!_.isEmpty(charsDynColumnsToDelete)){
						deleteDynamicColumnsLayoutToGrid(charsDynColumnsToDelete);
					}
				}

				function registerEntityCreated(e, newEntity){
					createItemAndAssignDynamicCols(newEntity, _.map(data.charsDefaultDictionary , 'CharacteristicEntity.Id'), function(resChars){
					// Set default values to created resources characteristics
						setDefaultValues(resChars);
					});
				}

				function createItemAndAssignDynamicCols(newEntity, charFks, callBackFn){
					let postCreateData = {
						sectionId: data.sectionId,
						mainItemId: newEntity.Id,
						pKey1: newEntity.EstHeaderFk,
						pKey2: newEntity.EstLineItemFk,
						characFks: charFks
					};
					// Create characteristics based on auto-assignment chars set on characteristic module
					$http.post(globals.webApiBaseUrl + 'basics/characteristic/data/createMany', postCreateData).then(function(response){
						let resChars = response.data || [];

						if (_.isEmpty(estimateMainResourceService.getSelected())){
							return;
						}

						if (_.isEmpty(resChars)){
							return;
						}

						if (angular.isFunction(callBackFn)){
							callBackFn(resChars);
						}

						let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');

						_.forEach(resChars, function(charCreated){
							platformDataServiceDataProcessorExtension.doProcessItem(charCreated, serviceContainerData);

							data.chars.push(charCreated);
							serviceContainerData.itemList.push(charCreated);
							serviceContainerData.markItemAsModified(charCreated, serviceContainerData);
						});

						let entity = estimateMainResourceService.getItemById(_.first(resChars).ObjectFk);

						// Update resource characteristic fields to latest default values
						assignCharsToDictionary(resChars, entity.Id);
						appendCharacteristicColumnData(resChars, entity, true);


						// Refresh characteristic grid
						serviceContainerData.listLoaded.fire();
					// Refresh main entity grid
					// estimateMainResourceService.gridRefresh();
					});
				}

				function addCharToEntityAndGridUI(resCharsToProcess){
				// Validate chars
					var resChars = [];
					angular.forEach(resCharsToProcess, function(resChar){
						if (data.chars.indexOf(resChar.CharacteristicFk)===-1){
							resChar.IsReadonly = resChar.CharacteristicEntity.IsReadonly;
							resChar.CharacteristicGroupFk = resChar.CharacteristicEntity.CharacteristicGroupFk;
							resChar.CharacteristicTypeFk = resChar.CharacteristicEntity.CharacteristicTypeFk;

							resChars.push(resChar);
						}
					});
					if (resChars.length === 0){
						return;
					}

					var platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');

					_.forEach(resChars, function(charCreated){
						platformDataServiceDataProcessorExtension.doProcessItem(charCreated, serviceContainerData);

						data.chars.push(charCreated);
						serviceContainerData.itemList.push(charCreated);
						serviceContainerData.markItemAsModified(charCreated, serviceContainerData);
					});

					var entity = estimateMainResourceService.getItemById(_.first(resChars).ObjectFk);

					// Update resource characteristic fields to latest default values
					assignCharsToDictionary(resChars, entity.Id);
					appendCharacteristicColumnData(resChars, entity, false);


					// Refresh characteristic grid
					serviceContainerData.listLoaded.fire();
					// Refresh main entity grid
					// estimateMainResourceService.gridRefresh();

					// Refresh UI gridlayout
					var estCharacteristicsColumns = getCharColumns(resChars);
					// var onlyAddColumns = true; //Do not reset configuration columns, only add the new column
					// setDynamicColumnsLayoutToGrid(estCharacteristicsColumns, onlyAddColumns);
					var estimateMainResourceDynamicConfigurationService = $injector.get('estimateMainResourceDynamicConfigurationService');
					estimateMainResourceDynamicConfigurationService.appendData({ 'estResChars': estCharacteristicsColumns});
					estimateMainResourceDynamicConfigurationService.fireRefreshConfigLayout();
				}

				function registerSelectionChanged(e, selectedItem){
					// eslint-disable-next-line no-prototype-builtins
					if (selectedItem && selectedItem.hasOwnProperty('Id')){
						serviceContainerData.itemList = _.filter(data.chars, { ObjectFk: selectedItem.Id });
					}else{
					// No Resources is selected so we clear the resource characteristic grid items
						serviceContainerData.itemList = [];
					}
				}

				function setDefaultValues(resChars){
					_.forEach(resChars, function(resChar){
						let defaultChar = data.charsDefaultDictionary[resChar.CharacteristicEntity.Id];
						resChar.ValueText = defaultChar.ValueText;
						resChar.ValueBool = defaultChar.ValueBool;
						resChar.ValueDate = defaultChar.ValueDate;
						resChar.ValueNumber = defaultChar.ValueNumber;
						resChar.CharacteristicValueFk = defaultChar.CharacteristicValueFk;
					});
				}

				function appendCharacteristicColumnData(charItems, item, isCreateAssignDefault) {
					let list = item ? [item] : [];
					let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					let fields = [];
					angular.forEach(list, function (lineItem) {
						angular.forEach(charItems, function (item) {
							if(item.CharacteristicEntity.CharacteristicTypeFk === 10){
								item.ValueText = null;
								if(item.CharacteristicValueFk !== null) {
									item.ValueText = item.CharacteristicValueFk;
								} else {
									item.ValueText = null;
								}
							}

							let characteristicCol = data.colPrefix + item.CharacteristicEntity.Id;
							let type = basicsCharacteristicTypeHelperService.characteristicType2Domain(item.CharacteristicEntity.CharacteristicTypeFk);
							let value = basicsCharacteristicTypeHelperService.convertValue(item.ValueText ,item.CharacteristicEntity.CharacteristicTypeFk);
							if (item.ObjectFk === lineItem.Id) {
								lineItem[characteristicCol] = value;
							}
							else if(lineItem[characteristicCol] === undefined){
								lineItem[characteristicCol] = type === 'boolean' ? false : null;
							}
							if (isCreateAssignDefault){
								lineItem[characteristicCol] = value;
							}
						});

						if (lineItem.EstRuleSourceFk) {
							if (fields.length === 0) {
								for (let item in lineItem) {
									// eslint-disable-next-line no-prototype-builtins
									if (lineItem.hasOwnProperty(item)){
										fields.push({field: item, readonly: true});
									}
								}
							}

							platformRuntimeDataService.readonly(lineItem, fields);
						}
					});
				}

				function parseConfiguration(propertyConfig) {
					propertyConfig = angular.isString(propertyConfig) ? JSON.parse(propertyConfig) : angular.isArray(propertyConfig) ? propertyConfig : [];

					_.each(propertyConfig, function (config) {
						if (_.has(config, 'name')) {
							_.unset(config, 'name');
							_.unset(config, 'name$tr$');
							_.unset(config, 'name$tr$param$');
						}
					});

					return propertyConfig;
				}

				function setDynamicColumnsLayoutToGrid(charColumns, isOnlyAddColumns){

					let mainViewService = $injector.get('mainViewService');

					let grid = platformGridAPI.grids.element('id', data.resGridId);
					if (grid && grid.instance){
						let cols = grid.columns.current;

						let charsColumnsToAdd = [];
						let charsColumnsToDelete = [];

						let existCharItems = _.filter(cols, function(colChars){
							return colChars.id.indexOf(data.colPrefix) > -1;
						});

						if (existCharItems.length === 0) {
							charsColumnsToAdd = charColumns;
						}
						else{
							_.forEach(charColumns, function(char){
							// Only add new characteristic columns
								if (_.findIndex(existCharItems, { id: char.id }) === -1 ){
									charsColumnsToAdd.push(char);
								}
							});
						}

						if (charsColumnsToAdd.length === 0){
							let allColumns = cols; // getDynamicColumns()
							if (!isOnlyAddColumns){
							// Columns to delete
								charsColumnsToDelete = _.filter(existCharItems, function(item){
									return _.map(charColumns, 'id').indexOf(item.id) === -1;
								});

								if (charsColumnsToDelete.length > 0){
									let charsColumnsToDeleteIds = _.map(charsColumnsToDelete, 'id');
									allColumns = _.filter(allColumns, function(item){
										return charsColumnsToDeleteIds.indexOf(item.id) === -1;
									});

									platformGridAPI.columns.configuration(data.resGridId, allColumns);
									platformGridAPI.grids.resize(data.resGridId);
								}
							}

						}else if (charsColumnsToAdd.length > 0){
							let allColumns = cols.concat(charsColumnsToAdd); // getDynamicColumns()

							let config = mainViewService.getViewConfig(data.resGridId);

							if (config) {
								let propertyConfig = config.Propertyconfig || [];
								propertyConfig = parseConfiguration(propertyConfig);

								let mappedConfigIds = {};

								propertyConfig.forEach(function (el, i) {
									mappedConfigIds[el.id] = {
										'idx': i,
										'prop': el
									};
								});

								allColumns.forEach(function(col){
									// eslint-disable-next-line no-prototype-builtins
									if(mappedConfigIds.hasOwnProperty((col.id))){
										col.hidden = !mappedConfigIds[col.id].prop.hidden;
									}
								});
							}

							if (!isOnlyAddColumns){
							// Columns to delete
								charsColumnsToDelete = _.filter(existCharItems, function(item){
									return _.map(charsColumnsToAdd, 'id').indexOf(item.id) === -1;
								});

								if (charsColumnsToDelete.length > 0){
									let charsColumnsToDeleteIds = _.map(charsColumnsToDelete, 'id');
									allColumns = _.filter(allColumns, function(item){
										return charsColumnsToDeleteIds.indexOf(item.id) === -1;
									});
								}
							}

							platformGridAPI.columns.configuration(data.resGridId, allColumns);
							platformGridAPI.grids.resize(data.resGridId);

						}else if (charColumns.length === 0){
							let initialColumns = _.filter(cols, function(col){
								return col.id.indexOf(data.colPrefix) === -1;
							});
							platformGridAPI.columns.configuration(data.resGridId, initialColumns);
							platformGridAPI.grids.resize(data.resGridId);
						}
					}
				}

				function deleteDynamicColumnsLayoutToGrid(charColumns){

					let estimateMainResourceDynamicConfigurationService = $injector.get('estimateMainResourceDynamicConfigurationService');

					let grid = platformGridAPI.grids.element('id', data.resGridId);
					if (grid && grid.instance) {
						_.forEach(charColumns, function (charColumnKey){
						// Detach from both dynamic columns
							let charColId = data.colPrefix + charColumnKey;
							estimateMainResourceDynamicConfigurationService.detachDataItemByKey('estResChars', charColId);
						});

						estimateMainResourceDynamicConfigurationService.fireRefreshConfigLayout();
					}
				}

				function clearDefaultCharacteristics(){
					data.charsDefaultDictionary = {};
				}

				function setDynamicColumnsLayout(readData){
					data.charsDictionary = {}; // Re-init
					data.chars = [];

					// eslint-disable-next-line no-prototype-builtins
					if (readData.hasOwnProperty('dynamicColumns')){
						let resItemList = readData.dtos || [];

						// Set resources characteristics to cache
						data.chars = readData.dynamicColumns.Characteristics || [];

						// Extend CharacteristicGroupFk
						_.forEach(data.chars, function(char){
							char.CharacteristicGroupFk = char.CharacteristicEntity.CharacteristicGroupFk;
						});

						// Flatten
						let cloudCommonGridService = $injector.get('cloudCommonGridService');
						let flatResList = [];
						cloudCommonGridService.flatten(resItemList, flatResList, 'EstResources');

						// Group chars by resources
						let resObjectGroups = _.groupBy(readData.dynamicColumns.Characteristics, 'ObjectFk');

						_.forEach(resObjectGroups, function(chars, entityId){
							let entity = _.find(flatResList, { Id: parseInt(entityId) });
							assignCharsToDictionary(chars, parseInt(entityId));
							appendCharacteristicColumnData(chars, entity, true);
						});

						let uniqueCharacteristics = _.uniqBy(readData.dynamicColumns.Characteristics, 'Characteristic.Id');

						let estCharacteristicsColumns = getCharColumns(uniqueCharacteristics || []);
						let estimateMainResourceDynamicConfigurationService = $injector.get('estimateMainResourceDynamicConfigurationService');

						let grid = platformGridAPI.grids.element('id', data.resGridId);
						if (grid && grid.instance){
							estimateMainResourceDynamicConfigurationService.attachData({ 'estResChars': estCharacteristicsColumns});
							estimateMainResourceDynamicConfigurationService.fireRefreshConfigLayout();
						}else{
						// Grid is not visible yet, so we use timeout
							setTimeout(function(){
								estimateMainResourceDynamicConfigurationService.attachData({ 'estResChars': estCharacteristicsColumns});
								estimateMainResourceDynamicConfigurationService.fireRefreshConfigLayout();
							}, 0);
						}

					}
				}

				function setDefaultColsToGrid(){
					let defer = $q.defer();

					if (data.isLoaded){
						defer.resolve(true);
						return defer.promise;
					}

					data.isLoaded = true;
					getDefaultChars().then(function(){
						let estCharacteristicsColumns = getCharColumns(data.charsDefaultDictionary);
						let estimateMainResourceDynamicConfigurationService = $injector.get('estimateMainResourceDynamicConfigurationService');
						estimateMainResourceDynamicConfigurationService.appendData({ 'estResChars': estCharacteristicsColumns});
						estimateMainResourceDynamicConfigurationService.fireRefreshConfigLayout();

						// Set readonly according to validation(line item reference, generated by rule and composite assembly)
						setEstResourcesReadonly(_.map(estCharacteristicsColumns, 'id'));

						defer.resolve(true);
					});

					return defer.promise;
				}

				function getDefaultCharacteristics(){
					return data.charsDefaultDictionary;
				}

				function getCharColumns(list) {
					let charColumns = [];

					_.forEach(list, function (item) {
						let charColumn = createCharColumn(item, data.colPrefix + item.CharacteristicEntity.Id, item.CharacteristicEntity.Code);
						charColumns.push(charColumn);
					});

					return charColumns;
				}

				function getDefaultChars(){

					if (!_.isEmpty(data.charsDefaultDictionary)){
						return $q.when(data.charsDefaultDictionary);
					}

					let defer = $q.defer();

					// Get automatic assignment list and set to Cache
					$http.get(globals.webApiBaseUrl + 'basics/characteristic/data/defaultlistbysection?sectionId=' + data.sectionId).then(function(response) {
						_.forEach(response.data, function(defaultChar){
							defaultChar.CharacteristicSectionFk = data.sectionId;
							data.charsDefaultDictionary[defaultChar.CharacteristicEntity.Id] = defaultChar;
						});

						defer.resolve(data.charsDefaultDictionary);
					});

					return defer.promise;
				}

				function createCharColumn(item, columnIdorField, columnName) {
					let formatterData = getFormatter(item);
					let characteristicColumn = columnIdorField;

					// Characteristic column name
					let characteristicColumnName = columnName;
					if (item.CharacteristicSectionFk === data.sectionId){
						characteristicColumnName = _.isEmpty(item.CharacteristicEntity.DescriptionInfo.Description) ? characteristicColumnName: item.CharacteristicEntity.DescriptionInfo.Description;
					}

					return $injector.get('platformTranslateService').translateGridConfig({
						domain: formatterData.formatter,
						id: characteristicColumn,
						editor: formatterData.formatter,
						field: characteristicColumn,
						name: characteristicColumnName,
						name$tr$: undefined,
						formatter: formatterData.formatter,
						editorOptions: formatterData.editorOptions,
						formatterOptions: formatterData.formatterOptions,
						hidden: false,
						required: false,
						grouping:{
							title: characteristicColumnName,
							getter: characteristicColumn,
							aggregators: [],
							aggregateCollapsed: true
						},
						isCharacteristic: true,
						isCharacteristicExpired: item.IsReadonly,
						validator: function validator(entity, value, model){
							if (item.IsReadonly){
								entity[model + '__revert'] = entity[model];
							}
							return true;
						}
					});
				}

				function getFormatter(item) {
					let domain = {
						formatter: null,
						editorOptions: null,
						formatterOptions: null
					};
					switch (item.CharacteristicEntity.CharacteristicTypeFk) {
						case 10:
							domain.formatter = 'lookup';
							domain.editorOptions = {
								directive: 'basics-characteristic-value-combobox'
							};
							domain.formatterOptions = {
								lookupType: 'CharacteristicValue',
								displayMember: 'DescriptionInfo.Translated'
							};
							break;
						default:
							domain.formatter = basicsCharacteristicTypeHelperService.characteristicType2Domain(item.CharacteristicEntity.CharacteristicTypeFk);
							domain.editorOptions = null;
							domain.formatterOptions = null;
							break;
					}
					return domain;
				}

				// On update characteristic container
				function onItemUpdate(e, item) {
					let lookupItem = 'basicsCharacteristicCodeLookup';
					let basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');

					if (_.isEmpty(item.CharacteristicEntity) && basicsLookupdataLookupDescriptorService.hasLookupItem(lookupItem, item.CharacteristicFk)){
						item.CharacteristicEntity = basicsLookupdataLookupDescriptorService.getLookupItem(lookupItem, item.CharacteristicFk);
					}

					let entityItem = estimateMainResourceService.getSelected();
					let columnId = data.colPrefix + item.CharacteristicEntity.Id;

					// Create Field with value and Add item to dictionary
					// eslint-disable-next-line no-prototype-builtins
					if (!entityItem.hasOwnProperty(columnId)){
						let result = { isNew : false };
						assignCharToDictionary(item.CharacteristicEntity.Id, item.ObjectFk, result);
						if (result.isNew){
							let estCharacteristicsColumns = getCharColumns([item]);
							// let onlyAddColumns = true; //Do not reset configuration columns, only add the new column
							// setDynamicColumnsLayoutToGrid(estCharacteristicsColumns, onlyAddColumns);
							let estimateMainResourceDynamicConfigurationService = $injector.get('estimateMainResourceDynamicConfigurationService');
							estimateMainResourceDynamicConfigurationService.appendData({ 'estResChars': estCharacteristicsColumns});
							estimateMainResourceDynamicConfigurationService.fireRefreshConfigLayout();
						}
					}
					// Update Field
					if (basicsCharacteristicTypeHelperService.isLookupType(item.CharacteristicTypeFk)){
						item.ValueText = item.ValueText  || item.CharacteristicEntity.DefaultValue;
					}

					entityItem[columnId] = basicsCharacteristicTypeHelperService.convertValue(item.ValueText, item.CharacteristicTypeFk);

					// Process dynamic columns and set composite assemblies sub-resources to readonly
					setEstResourcesReadonly([columnId]);

					// Refresh Resources container to get auto assignment values
					estimateMainResourceService.gridRefresh();
				}

				function onItemDelete(e, items) {
					let objectFk = items[0].ObjectFk;
					let entityItem = estimateMainResourceService.getItemById(objectFk);

					_.forEach(items, function(item){
						if (item.CharacteristicEntity){
							let columnId = data.colPrefix + item.CharacteristicEntity.Id;
							// Remove dynamic column
							// eslint-disable-next-line no-prototype-builtins
							if (entityItem.hasOwnProperty(columnId)){
								delete entityItem[columnId];
							}
							// Remove from cache
							_.remove(data.chars,{ Id: item.Id });
						}
					});

					removeCharsFromDictionary(_.map(items,'CharacteristicEntity.Id'), objectFk);
					estimateMainResourceService.gridRefresh();
				}

				function syncUpdateCharacteristic(updateColumn, item){
					let charId = updateColumn.split('_')[1];

					let itemToUpdate = _.find(service.getUnfilteredList(), function(charItem){
						return charItem.CharacteristicEntity.Id === parseInt(charId);
					});
					// Create new item in resource characteristics
					if (_.isEmpty(itemToUpdate)){
						createItemAndAssignDynamicCols(item, [parseInt(charId)], function(chars){
							let charCreated = _.first(chars);
							charCreated.ValueText = item[updateColumn];
							basicsCharacteristicTypeHelperService.dispatchValue(charCreated, charCreated.CharacteristicEntity.CharacteristicTypeFk);
						});
					}else{
					// Update item in resource characteristic
						itemToUpdate.ValueText = item[updateColumn];
						basicsCharacteristicTypeHelperService.dispatchValue(itemToUpdate, itemToUpdate.CharacteristicEntity.CharacteristicTypeFk);

						service.markItemAsModified(itemToUpdate);
					}
				}

				function onUpdateDone(response){
					response = response || {};

					let updatedItems = response.CharacteristicDataToSave;
					// Only handle items to Update
					if (_.isEmpty(updatedItems)){
						return;
					}

					let oldItems = data.chars; // Update all characteristics //User updates one resource, then changes the current selection. (this will cause to not be able to update the current resource characteristics version)
					angular.forEach(oldItems, function (item) {
						let updatedItem = _.find(updatedItems, {Id: item.Id});
						if (updatedItem) {
							let oldItem = _.find(oldItems, {Id: item.Id});
							serviceContainerData.mergeItemAfterSuccessfullUpdate(oldItem, updatedItem, true, serviceContainerData);
						}
					});
				}

				function setEstResourcesReadonly(columnIds){
					let resTree = estimateMainResourceService.getTree();
					if (_.isEmpty(resTree)){
						return;
					}

					let platformRuntimeDataService = $injector.get('platformRuntimeDataService');
					let lineItem = $injector.get('estimateMainService').getSelected();

					let traverseReadOnly = function traverseReadOnly(items, isHandleChildren){
						_.forEach(items, function(item){
							let fields = [];
							_.forEach(columnIds, function(columnId){
								fields.push({field: columnId, readonly: true});
							});

							platformRuntimeDataService.readonly(item, fields);

							if (isHandleChildren && item.HasChildren){
								traverseReadOnly(item.EstResources, true);
							}
						});
					};

					let traverseSubResources = function traverseSubResources(resTree){
						let estimateMainResourceType = $injector.get('estimateMainResourceType');
						for (let i = 0; i< resTree.length; i++){
							let item = resTree[i];

							if (lineItem && lineItem.EstLineItemFk){
								traverseReadOnly([item], true); // Set all resources characteristics fields to readonly
								continue;
							}

							// Composite assembly
							if (item && item.EstResourceTypeFk === estimateMainResourceType.Assembly && item.EstAssemblyTypeFk){
								traverseReadOnly(item.EstResources);
							}

							if (item.HasChildren){
								traverseSubResources(item.EstResources);
							}
						}
					};

					traverseSubResources(resTree);

					// grid refresh UI to show readonly changes
					estimateMainResourceService.gridRefresh();
				}

				function getResourceCharacteristicsByLineItem(estHeaderFk, lineItemId){
					let estimateMainService = $injector.get('estimateMainService');

					let requestData = {};
					requestData.estHeaderFk = estHeaderFk;
					requestData.estLineItemFk = lineItemId;
					requestData.projectId = estimateMainService.getSelectedProjectId();

					return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getresourcecharacteristics', requestData);
				}
			}]);
})();

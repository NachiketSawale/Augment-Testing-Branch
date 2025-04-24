/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global _, globals */
	'use strict';
	let moduleName = 'estimate.common';

	/**
	 * @ngdoc service
	 * @name estimateCommonResourceCharacteristicsService
	 * @function
	 *
	 * @description
	 * estimateCommonResourceCharacteristicsService is the dynamic service for estimate resources and assembly resources with dynamic characteristics.
	 */
	angular.module(moduleName).factory('estimateCommonResourceCharacteristicsService',
		['$q', '$timeout', '$http',  '$injector', 'platformGridAPI', 'basicsCharacteristicDataServiceFactory', 'basicsCharacteristicTypeHelperService', 'platformRuntimeDataService', 'platformDataServiceDataProcessorExtension', 'platformModalService',
			function ($q, $timeout, $http, $injector, platformGridAPI, basicsCharacteristicDataServiceFactory, basicsCharacteristicTypeHelperService, platformRuntimeDataService, platformDataServiceDataProcessorExtension, platformModalService) {

				return {
					getDynamicCharService: getDynamicCharService
				};

				function getDynamicCharService(basicData){
					let data = {
						sectionId: basicData.sectionId, // Resource characteristic section Id
						colPrefix: 'charactercolumn_',
						resGridId: basicData.resGridId, // Resource grid Id to add columns dynamically
						isLoaded: false,

						mainService: $injector.get(basicData.mainService),
						dynamicConfigurationService: $injector.get(basicData.dynamicConfigurationService),

						chars: [], // Resource characteristics from all resources
						charsDefaultDictionary: {}, // Default characteristics per estimate module, when estimate is refreshed, defaults characteristics will got the latest changes
						charsDictionary: {} // Characteristics to control dynamic columns in estimate resource container
					};
					data.parentMainService = data.mainService.parentService();

					let service = basicsCharacteristicDataServiceFactory.getService(data.mainService, data.sectionId, null, 'EstHeaderFk', 'EstLineItemFk');

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

						setDynamicColumnsLayout: setDynamicColumnsLayout,
						setDefaultColsToGrid: setDefaultColsToGrid,

						getDefaultCharacteristics: getDefaultCharacteristics,

						syncUpdateCharacteristic: syncUpdateCharacteristic,
						assignCharsToEntity: assignCharsToEntity,

						onCreatedItemsAndAssignData: onCreatedItemsAndAssignData,

						addCharToEntityAndGridUI: addCharToEntityAndGridUI,
						getResourceCharacteristicsByLineItem: getResourceCharacteristicsByLineItem
					});

					return service;

					function init(){
					// Defaults are cleared every time we enter to estimate module
						data.charsDefaultDictionary = {};
						data.isLoaded = false;
					}

					function appendDataAndRefreshConfigLayout(estCharacteristicColumns){
						let objData = {};
						objData[data.resGridId] = estCharacteristicColumns;
						data.dynamicConfigurationService.appendData(objData);
						data.dynamicConfigurationService.fireRefreshConfigLayout();
					}

					function appendData(estCharacteristicColumns){
						let objData = {};
						objData[data.resGridId] = estCharacteristicColumns;
						data.dynamicConfigurationService.appendData(objData);
					}

					// Register events will be triggered only one time with the initialized flag, otherwise it will be registered several times caused by the permission issue.
					function registerEvents(){
					// Workaround, because of permission issue, this is handled like that.
					// unregisterEventsClean();

						data.mainService.registerEntityCreated(registerEntityCreated);
						data.mainService.registerSelectionChanged(registerSelectionChanged);
						data.mainService.registerListLoaded(onResourceListLoaded);

						service.registerItemValueUpdate(onItemUpdate);
						service.registerItemDelete(onItemDelete);

						service.updateDone.register(onUpdateDone);

						platformGridAPI.events.register(data.resGridId, 'onCellChange', onDynamicColumnGridCellChange);
						platformGridAPI.events.register(data.resGridId, 'onBeforeEditCell', onDynamicColumnGridBeforeEditCell);

						if (!_.isEmpty(data.parentMainService.getSelected())){
						// When changing containers //Change to another container, then change it back to the resource container
							setDynamicColumnsLayout({ dynamicColumns: { Characteristics: data.chars }});
						}
					}

					function unregisterEvents(){
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
						_.forEach(chars, function(charItem){
							platformDataServiceDataProcessorExtension.doProcessItem(charItem, serviceContainerData);

							if(!_.some(serviceContainerData.itemList, function(item){ return item.ObjectFk === charItem.ObjectFk && item.CharacteristicFk === charItem.CharacteristicFk;})) {
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
						service.createItemsAndAssignData(newEntity.Id, _.map(data.charsDefaultDictionary , 'CharacteristicEntity.Id'), function(resChars){
						// Set default values to created resources characteristics
							setDefaultValues(resChars);

							_.forEach(resChars, function(charCreated){
								data.chars.push(charCreated);
							});
						});
					}

					function addCharToEntityAndGridUI(resCharsToProcess){
					// Validate chars
						let resChars = [];
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

						let platformDataServiceDataProcessorExtension = $injector.get('platformDataServiceDataProcessorExtension');

						_.forEach(resChars, function(charCreated){
							platformDataServiceDataProcessorExtension.doProcessItem(charCreated, serviceContainerData);

							data.chars.push(charCreated);
							serviceContainerData.itemList.push(charCreated);
							serviceContainerData.markItemAsModified(charCreated, serviceContainerData);
						});

						let entity = data.mainService.getItemById(_.first(resChars).ObjectFk);
						let estCharacteristicsColumns =[];
						if (entity !== undefined){
							// Update resource characteristic fields to latest default values
							assignCharsToDictionary(resChars, entity.Id);
							appendCharacteristicColumnData(resChars, entity, false);


							// Refresh characteristic grid
							serviceContainerData.listLoaded.fire();
							// Refresh main entity grid
							// estimateMainResourceService.gridRefresh();

							// Refresh UI gridlayout
							estCharacteristicsColumns = getCharColumns(resChars);
						}
						else{
							return estCharacteristicsColumns;
						}


						/*

					var estCharacteristicsColumns = getCharColumns(resChars);
					//var onlyAddColumns = true; //Do not reset configuration columns, only add the new column
					//setDynamicColumnsLayoutToGrid(estCharacteristicsColumns, onlyAddColumns);
					var estimateMainResourceDynamicConfigurationService = $injector.get('estimateMainResourceDynamicConfigurationService');
					estimateMainResourceDynamicConfigurationService.appendData({ 'estResChars': estCharacteristicsColumns});
					estimateMainResourceDynamicConfigurationService.fireRefreshConfigLayout();
					 */

						appendDataAndRefreshConfigLayout(estCharacteristicsColumns);
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

					function deleteDynamicColumnsLayoutToGrid(charColumns){

						_.forEach(charColumns, function (charColumnKey){
							let charColId = data.colPrefix + charColumnKey;
							data.dynamicConfigurationService.detachDataItemByKey(data.resGridId, charColId);
						});
						data.dynamicConfigurationService.fireRefreshConfigLayout();
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

							appendDataAndRefreshConfigLayout(estCharacteristicsColumns);
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
							appendDataAndRefreshConfigLayout(estCharacteristicsColumns);

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
						onItemUpdateFunction(item);

						// Refresh Resources container to get auto assignment values
						data.mainService.gridRefresh();
						// Refresh dynamic column grid layout
						data.dynamicConfigurationService.fireRefreshConfigLayout();
					}

					// On update characteristic container
					function onCreatedItemsAndAssignData(items) {
						_.forEach(items, function(item){
							item.isValueChange = item.isCharCreatedOnUpdate === true;
							onItemUpdateFunction(item);
						});

						// Refresh Resources container to get auto assignment values
						data.mainService.gridRefresh();
						// Refresh dynamic column grid layout
						data.dynamicConfigurationService.fireRefreshConfigLayout();
					}

					function onItemUpdateFunction(item){
						let lookupItem = 'basicsCharacteristicCodeLookup';
						let basicsLookupdataLookupDescriptorService = $injector.get('basicsLookupdataLookupDescriptorService');

						if (_.isEmpty(item.CharacteristicEntity) && basicsLookupdataLookupDescriptorService.hasLookupItem(lookupItem, item.CharacteristicFk)){
							item.CharacteristicEntity = basicsLookupdataLookupDescriptorService.getLookupItem(lookupItem, item.CharacteristicFk);
						}

						let entityItem = data.mainService.getSelected();
						let columnId = data.colPrefix + item.CharacteristicEntity.Id;

						// Create Field with value and Add item to dictionary
						// eslint-disable-next-line no-prototype-builtins
						if (!entityItem.hasOwnProperty(columnId)){
							let result = { isNew : false };
							assignCharToDictionary(item.CharacteristicEntity.Id, item.ObjectFk, result);
							if (result.isNew){
							// Validate char whether characteristic is already added
								if (_.findIndex(data.chars, {'Id': item.Id})===-1){
									data.chars.push(item);
								}
								let estCharacteristicsColumns = getCharColumns([item]);
								appendData(estCharacteristicsColumns);
							}
						}

						// This means Char-Item is created, so we get the default value
						if (item.isValueChange === false){
							item.ValueText = basicsCharacteristicTypeHelperService.getDefaultValue(item.CharacteristicEntity);
						}

						entityItem[columnId] = basicsCharacteristicTypeHelperService.convertValue(item.ValueText, item.CharacteristicTypeFk);

						// Process dynamic columns and set composite assemblies sub-resources to readonly
						setEstResourcesReadonly([columnId]);
					}

					function onItemDelete(e, items) {
						let objectFk = items[0].ObjectFk;
						let entityItem = data.mainService.getItemById(objectFk);

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
						data.mainService.gridRefresh();
					}

					function syncUpdateCharacteristic(updateColumn, item){
						let charId = updateColumn.split('_')[1];

						let itemToUpdate = _.find(service.getUnfilteredList(), function(charItem){
							return charItem.CharacteristicEntity.Id === parseInt(charId);
						});
						// Create new item in resource characteristics
						if (_.isEmpty(itemToUpdate)){
							service.createItemsAndAssignData(item.Id, [parseInt(charId)], function(chars){
								let charCreated = _.first(chars);
								charCreated.ValueText = item[updateColumn];
								charCreated.isCharCreatedOnUpdate = true;
								basicsCharacteristicTypeHelperService.dispatchValue(charCreated, charCreated.CharacteristicEntity.CharacteristicTypeFk);

								data.chars.push(charCreated);
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

					function onDynamicColumnGridCellChange(e, args){
						let columns = args.grid.getColumns(), column = columns[args.cell], columnName = column ? column.field : '', item = args.item;
						if (isCharacteristicColumn(column)){
							if (isCharacteristicColumnExpired(column)) {
								platformModalService.showErrorBox('cloud.common.currentCharacteristicIsExpired', 'cloud.common.errorMessage').then(function () {
									// eslint-disable-next-line no-prototype-builtins
									if (item.hasOwnProperty(columnName)) {
										item[columnName] = item[columnName + '__revert'];
										delete item[columnName + '__revert'];
										data.mainService.gridRefresh();
									}
								});
							} else {
								syncUpdateCharacteristic(columnName, item);
							}
						}
					}

					function onDynamicColumnGridBeforeEditCell(e, args){
						// For Resource Characteristics lookup type
						if (args.column.id.indexOf(data.colPrefix) > -1){
							if (!data.mainService.hasSelection()){ // workaround to select detect selection on estimate resource
								return $timeout(function(){ onDynamicColumnGridBeforeEditCell(e, args);});
							}
							// var estimateMainResourceCharacteristicsService = $injector.get('estimateMainResourceCharacteristicsService');
							let charColumnId = parseInt(_.last(args.column.id.split('_')));
							let resCharEntity = _.find(service.getUnfilteredList(), {CharacteristicFk: charColumnId});

							if (!_.isEmpty(resCharEntity) && resCharEntity.CharacteristicEntity &&  basicsCharacteristicTypeHelperService.isLookupType(resCharEntity.CharacteristicEntity.CharacteristicTypeFk)){
								$injector.get('basicsCharacteristicCharacteristicService').setSelected(resCharEntity.CharacteristicEntity);
							}
						}
					}

					function isCharacteristicColumn(column){
						return column && column.isCharacteristic;
					}

					function isCharacteristicColumnExpired(col) {
						return (col && col.isCharacteristicExpired);
					}

					function setEstResourcesReadonly(columnIds){
						let resTree = data.mainService.getTree();
						if (_.isEmpty(resTree)){
							return;
						}

						let lineItem = data.parentMainService.getSelected();

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
						data.mainService.gridRefresh();
					}

					function getResourceCharacteristicsByLineItem(estHeaderFk, lineItemId){
						let requestData = {};
						requestData.estHeaderFk = estHeaderFk;
						requestData.estLineItemFk = lineItemId;

						let moduleName = $injector.get('mainViewService ').getCurrentModuleName();
						switch (moduleName) {
							case 'estimate.main':
								requestData.projectId = data.parentMainService.getSelectedProjectId();
								return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getresourcecharacteristics', requestData);
							case 'estimate.assemblies':
								requestData.projectId = null;
								return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/getassemblyresourcecharacteristics', requestData);
							default:
								// eslint-disable-next-line no-console
								return console.error('NotImplemented');
						}
					}
				}

			}]);
})();

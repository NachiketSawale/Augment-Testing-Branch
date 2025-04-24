/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* globals globals , _ */
	'use strict';

	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainReplaceResourceCommonService
	 * @function
	 * @requires $q
	 * @description
	 */
	angular.module(moduleName).factory('estimateMainReplaceResourceCommonService', ['$q', 'PlatformMessenger', '$http', '$injector',
		'basicsCommonRuleEditorService', 'platformBulkEditorConfigurationService', 'estimateMainResourceConfigurationService', 'basicsCharacteristicTypeHelperService',
		'estimateMainService', 'estimateMainCommonService', 'basicsCommonOperatorFunctionsService', '$translate', 'platformRuntimeDataService',
		'basicsCommonChangeColumnConfigService', 'estimateMainReplaceFunctionType', 'estimateMainResourceType',
		function ($q, PlatformMessenger, $http, $injector, ruleEditorService, configurationService, estimateMainResourceConfigurationService, basicsCharacteristicTypeHelperService,
							estimateMainService, estimateMainCommonService, basicsCommonOperatorFunctionsService, $translate, platformRuntimeDataService, basicsCommonChangeColumnConfigService,
							estimateMainReplaceFunctionType, estimateMainResourceType) {
			let service = {}, dynamicOffset = 100, selectedFunction = null, resourceFields = [], currentResourceField = {},
				summaryInfo = {}, dynamicColumns = [], udpDynamicColumns = [], specifyResource = null, specifyType = null, listToSave = {}, currentElement = null, currentElementJob = null, replaceElement = null,
				beReplaceType = null, specifyLookupElement = null, selectedToBeReplaceFk = null;

			let dialogContext = 'Replace'; // Replace / Modify resource

			service.onFormConfigUpdated = new PlatformMessenger();
			service.onCurrentItemChange = new PlatformMessenger();
			service.onCostCodeTargetChanged = new PlatformMessenger();
			service.onSpecifyResourceChanged = new PlatformMessenger();
			service.onBroadcastConfigUpdated = new PlatformMessenger();

			/**
			 * @ngdoc function
			 * @name getDynamicOffset
			 * @function
			 * @methodOf estimateMainReplaceResourceCommonService
			 * @description to make sure the dynamic columns id have no conflict with existed resource fields(costtype and resource flag etc.)
			 * @returns number
			 */
			service.getDynamicOffset = function getDynamicOffset() {
				return dynamicOffset;
			};

			service.setSelectedFunction = function (selectedFn) {
				selectedFunction = selectedFn;
			};

			service.getSelectedFunction = function () {
				if(selectedFunction === null)
				{
					selectedFunction = {Id: 111};// default is replace by costcode
				}
				return selectedFunction;
			};

			service.executeReplace = function executeReplace(filterData) {
				return service.postReplace(filterData).then(function (response) {
					service.setSummaryInfo(response.data);
					let estimateMainReplaceResourceService = $injector.get('estimateMainReplaceResourceService');
					if(estimateMainReplaceResourceService)
					{
						estimateMainReplaceResourceService.showInfoDialog();
					}
				});
			};

			service.postReplace = function postReplace(filterData) {
				if(filterData.FunctionType === estimateMainReplaceFunctionType.ReplaceAssembly
					|| filterData.FunctionType === estimateMainReplaceFunctionType.ReplaceAssemblyByCostCode
					|| filterData.FunctionType === estimateMainReplaceFunctionType.ReplaceAssemblyByMaterial
					|| (filterData.FunctionType === estimateMainReplaceFunctionType.RemoveResource && filterData.ResourceTypeId === estimateMainReplaceFunctionType.Assembly)){
					// getAssemblyFk By resourceFk
					let item = _.find($injector.get('estimateMainResourceAssemblyLookupService').getList(), {Id: filterData.CurrentElementFk});
					if(item){
						filterData.CurrentElementFk = item.AssemblyFk;
					}
				}
				return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/resourcereplacement', filterData);
			};

			service.executeModify = function executeModify(filterData) {
				return $http.post(globals.webApiBaseUrl + 'estimate/main/resource/resourcemodify', filterData).then(function (response) {
					service.setSummaryInfo(response.data);
					service.setDialogContext('Modify');
					let estimateMainReplaceResourceService = $injector.get('estimateMainReplaceResourceService');
					if(estimateMainReplaceResourceService)
					{
						estimateMainReplaceResourceService.showInfoDialog();
					}
				});
			};

			service.getSummaryInfo = function getSummaryInfo() {
				return summaryInfo;
			};

			service.setSummaryInfo = function setSummaryInfo(_summaryInfo) {
				summaryInfo = _summaryInfo;
			};

			function processColumns(cols) {
				return _.each(cols, function eachColumn(col) {
					col.bulkSupport = col.readonly !== true && col.bulkSupport !== false && ruleEditorService.checkColumn(col);
				});
			}

			// set up bulk editor for
			service.setUpBulkEditor = function setUpBulkEditor() {
				let uiStandardService = estimateMainResourceConfigurationService;
				let specifyOperator =
				{
					// Plus / Minus Int for Decimal(#84681 only for modify resource wizard case in estimate module, not in database)
					id: 1000,
					parameters: ['PropertyIdentifier', 'CompareValue1'],
					inputDomain: 'factor',
					placeholder: {
						CompareValue1: $translate.instant('platform.bulkEditor.value')
					}
				};

				basicsCommonOperatorFunctionsService.extendOperators(specifyOperator);

				if (uiStandardService && _.isFunction(uiStandardService.getDtoScheme)) {
					let name = 'estimate.main.modify.resources';
					let dtoSchemes = uiStandardService.getDtoScheme();
					// join characteristic scheme
					_.map(dynamicColumns, function (item) {
						let formatterOpt = {};
						let domain =service.getCharacteristicDomain(angular.copy(item), formatterOpt);
						dtoSchemes[service.getColumnName(item)]= { domain : domain };
						return {
							domain: domain
						};
					});

					// ruleEditorService.setSchema(angular.copy(dtoSchemes));

					let resourceContainerGridId = 'bedd392f0e2a44c8a294df34b1f9ce44';
					let props = processColumns(basicsCommonChangeColumnConfigService.mergeWithViewConfig(resourceContainerGridId, _.cloneDeep(uiStandardService.getStandardConfigForListView().columns)));
					// for modify resource dialog specify case, need to filter out properties

					let includeIds = ['estcosttypefk', 'estresourceflagfk', 'quantitydetail', 'quantity', 'quantityfactordetail1', 'quantityfactordetail2', 'quantityfactor3', 'quantityfactor4', 'productivityfactordetail', 'efficiencyfactordetail1',
						'efficiencyfactordetail2', 'costfactordetail1', 'costfactordetail2', 'isdisabled', 'costunit', 'dayworkrateunit'];

					let filterProps = angular.copy(props);

					_.each(filterProps, function (item) {
						item.bulkSupport = !!_.includes(includeIds, item.id);
					});
					// join with the characteristic dynamic columns(from dynamicColumns)
					let characteristicProps = _.map(dynamicColumns, function (item) {
						let columnOpt = {};
						let domain = service.getCharacteristicDomain(angular.copy(item), columnOpt);
						return {
							id: service.getColumnName(item),
							formatter: domain,
							field: service.getColumnName(item),
							name: item.DescriptionInfo && item.DescriptionInfo.Translated?item.DescriptionInfo.Translated : item.Code,
							name$tr$: null,
							sortable: true,
							grouping: null,
							editor: domain,
							editorOptions: columnOpt.editorOptions,
							formatterOptions: columnOpt.formatterOptions,
							toolTip:'',
							toolTip$tr$:'',
							validator: '',
							bulkSupport: true,
							width: ''
						};
					});

					filterProps = _.concat(filterProps,characteristicProps);

					// join with the udp dynamic columns from udpDynamicColumns)
					let udpProps = _.map(udpDynamicColumns, function (item) {
						return {
							id: 'estresourceudp_' + item.field,
							formatter: item.domain,
							field: item.field,
							name: item.name,
							name$tr$: null,
							sortable: true,
							grouping: null,
							editor: 'money',
							editorOptions: item.editorOptions,
							formatterOptions: item.formatterOptions,
							toolTip:'',
							toolTip$tr$:'',
							validator: '',
							bulkSupport: true,
							width: ''
						};
					});

					filterProps = _.concat(filterProps,udpProps);

					return ruleEditorService.getOperatorByType(4).then(function (operators) {

						// for modify resource wizard we neeed to add more operator for 'description' domain type
						let newOpFor = _.find(operators, {Id : 37});
						let newCopyOp = angular.copy(newOpFor);
						if(newOpFor){
							// newCopyOp.Id = 45;
							newCopyOp.DisplaydomainFk = 1;// for description domain type
							newCopyOp.Sorting = 45;
							operators.push(newCopyOp);
						}

						newOpFor = _.find(operators, {Id : 38});
						if(newOpFor){
							newCopyOp = angular.copy(newOpFor);
							newCopyOp.Id = 1000;
							newCopyOp.DisplaydomainFk = 1;// for description domain type
							newCopyOp.Sorting = 1000;
							operators.push(newCopyOp);
						}

						// set the operators because they are needed to process the incomming rules
						ruleEditorService.setConfig({
							AvailableProperties: filterProps,
							AvailableOperators: operators,
							RuleOperatorType: 4 // changeRules
						});
						// this line will trigger the loading and processing of the incomming rules
						return configurationService.getBulkConfiguraion(name).then(function (configs) {
							return configurationService.createBulkConfig(name).then(function () {
								let innerConfig = {
									AvailableProperties: filterProps,
									AvailableOperators: operators,
									RuleOperatorType: 4, // changeRules
									AffectedEntities: null,
									RuleDefinitions: configs
								};
								ruleEditorService.setConfig(innerConfig);
								return innerConfig;
							});
						});
					});
				}
				return $q.when({});
			};

			service.setDynamicColumns = function setDynamicColumns(columns) {
				dynamicColumns = columns;
			};

			service.getDynamicColumns  = function getDynamicColumns () {
				return dynamicColumns;
			};

			service.getCharacteristicList = function getCharacteristicList(mainItemId) {
				let url = globals.webApiBaseUrl + 'basics/characteristic/discretevalue/list?mainItemId=' + mainItemId;
				return $http.get(url).then(function (response) {
					return response.data;
				});
			};

			/**
			 * @ngdoc function
			 * @name getAllCharacteristic
			 * @function
			 * @methodOf estimateMainReplaceResourceCommonService
			 * @description
			 * @returns {array} dynamic columns
			 */
			service.getAllCharacteristic = function getAllCharacteristic() {
				let listObject = $injector.get('estimateMainResourceCharacteristicsService').getDefaultCharacteristics();
				let list = _.map(listObject);

				// Set to cache
				service.setDynamicColumns(list);

				return $q.when(list);
			};

			/**
			 * @ngdoc function
			 * @name getAllUDPColumns
			 * @function
			 * @methodOf estimateMainReplaceResourceCommonService
			 * @description
			 * @returns {array} udp(udc) dynamic columns
			 */
			service.loadUDPColumns = function loadUDPColumns() {
				udpDynamicColumns = [];
				let estimateMainResourceDynamicUserDefinedColumnService = $injector.get('estimateMainResourceDynamicUserDefinedColumnService');
				udpDynamicColumns = _.filter(estimateMainResourceDynamicUserDefinedColumnService.getDynamicColumns(), function (item) {
					return !item.isTotal;
				});

				return $q.when();
			};

			service.setSpecifyResource = function setSpecifyResource(resource, willFire) {
				if(willFire) {
					service.onSpecifyResourceChanged.fire(resource);
				}
				specifyResource = resource;
			};

			service.getSpecifyResource = function getSpecifyResource() {
				return specifyResource;
			};

			service.setSpecifyType = function setSpecifyType(_specifyType) {
				specifyType = _specifyType;
			};

			service.getSpecifyType = function getSpecifyType() {
				return specifyType;
			};

			service.addResourceFields = function addResourceFields(resourceField) {
				currentResourceField = resourceField;
				let isExist = _.find(resourceFields, {Id: resourceField.Id});
				if(resourceFields && !isExist)
				{
					resourceFields.push(resourceField);
				}
			};

			service.getResourceFields = function getResourceFields(forUpdate) {
				let newResourceFields = angular.copy(resourceFields);
				if(forUpdate) {
					// make the dynamic resources fields Id in a correct format
					_.each(newResourceFields, function (resourceField) {
						if (resourceField && resourceField.IsDynamic) {
							resourceField.Id -= dynamicOffset;
						}
					});
				}
				return newResourceFields;
			};

			service.deleteResourceFileds = function deleteResourceFileds(fieldId) {
				let tobeUpdatedResourceFields = _.find(resourceFields, {Id: fieldId});
				if(!tobeUpdatedResourceFields){
					tobeUpdatedResourceFields.FieldsValue = [];
				}
			};

			service.updateResourceFieldValues = function updateResourceFieldValues(fieldsValue, removed) {
				let tobeUpdatedResourceFields = _.find(resourceFields, {Id: currentResourceField.Id});

				let fieldsGridDataService = $injector.get('estimateMainModifyResourceFieldsGridDataService');

				if(tobeUpdatedResourceFields) {
					if (fieldsGridDataService) {
						fieldsGridDataService.updateValue(tobeUpdatedResourceFields.Id,removed);
					}

					let fieldValues = tobeUpdatedResourceFields.FieldsValue;
					let fieldValueExist = _.includes(fieldValues, fieldsValue);
					if (!fieldValueExist && removed) {
						fieldValues.push(fieldsValue);
					}
					else  {
						_.remove(fieldValues, function (item) {
							return item === fieldsValue;
						});
					}
				}
			};

			service.setBulkEditorConfig = function setBulkEditorConfig(config) {
				listToSave = config;
			};

			service.getBulkEditorConfig = function getBulkEditorConfig() {
				return {
					BulkListToSave: [listToSave]
				};
			};

			/**
			 * @ngdoc function
			 * @name getCharacteristicDomain
			 * @function
			 * @methodOf estimateMainReplaceResourceCommonService
			 * @description get domain via characteristic type
			 * @param {object} item
			 * @param {object} column
			 * @returns {domain} string
			 */
			service.getCharacteristicDomain = function getCharacteristicDomain(item, column) {
				let domain;
				switch (item.CharacteristicTypeFk) {
					case 10:
						domain = 'lookup';
						column.editorOptions = {
							directive: 'basics-characteristic-value-combobox'
						};
						column.formatterOptions = {
							lookupType: 'CharacteristicValue',
							displayMember: 'DescriptionInfo.Translated'
						};
						break;
					case 7:
						domain = 'dateutc';
						column.editorOptions = null;
						column.formatterOptions = null;
						break;
					case 8:
						domain = 'datetime';
						column.editorOptions = null;
						column.formatterOptions = null;
						break;
					default:
						domain = basicsCharacteristicTypeHelperService.characteristicType2Domain(item.CharacteristicTypeFk);
						column.editorOptions = null;
						column.formatterOptions = null;
						break;
				}
				return domain;
			};

			service.setCharacteristicColumn = function setCharacteristicColumn(bulkGroup) {
				// set current characteristic column
				if(bulkGroup && _.isArray(bulkGroup) && bulkGroup.length > 0 && bulkGroup[0].Children){
					let lastChild = _.last(bulkGroup[0].Children);
					if(lastChild && lastChild.Operands && lastChild.Operands.length > 0){
						let updateColumn = lastChild.Operands[0].NamedProperty.FieldName;
						let columnInMainService = estimateMainService.getCharacteristicColumn();
						estimateMainService.setCharacteristicColumn(updateColumn);

						if(updateColumn && updateColumn !== columnInMainService) {
							let typeFk = updateColumn.split('_');
							if (_.isArray(typeFk) && typeFk[3] === '10') {
								let basicsCharacteristicDiscreteValueService = $injector.get('basicsCharacteristicDiscreteValueService');
								// characteristicListService.getList();
								basicsCharacteristicDiscreteValueService.load();
							}
						}
					}
				}
			};

			service.getColumnName = function getColumnName(item){
				let colPrefix = 'charactercolumn_';

				let description = '';
				if (item.CharacteristicEntity.DescriptionInfo){
					description = item.CharacteristicEntity.DescriptionInfo.Translated || item.CharacteristicEntity.Code;
				}
				item.Code = description;

				item.CharacteristicFk = item.CharacteristicEntity.Id;// use Id as the Fk
				return colPrefix + item.CharacteristicEntity.Id;
			};

			service.setDefaultCurrentElement = function setDefaultCurrentElement(_currentElement, _specifyLookupElement) {
				currentElement = _currentElement;
				specifyLookupElement = _specifyLookupElement;
			};

			service.getDefaultCurrentElement = function getDefaultCurrentElement() {
				return currentElement || selectedToBeReplaceFk;
			};

			service.getToReplaceOrDefaultCurrentElement = function getDefaultCurrentElement() {
				return selectedToBeReplaceFk || currentElement;
			};

			service.setSelectedToBeReplaceFk = function (toBeReplaceFk){
				selectedToBeReplaceFk = toBeReplaceFk;
			};

			service.getSpecifyLookupElement = function getSpecifyLookupElement() {
				return specifyLookupElement;
			};

			service.setDefaultType = function setDefaultType(replaceType) {
				beReplaceType = replaceType;
			};

			service.getDefaultType = function getDefaultType() {
				return beReplaceType;
			};

			service.getReplaceToType = function getDefaultType() {
				let selectedFunction = service.getSelectedFunction();

				switch (selectedFunction.Id) {
					case estimateMainReplaceFunctionType.ReplaceMaterialByCostCode:
					case estimateMainReplaceFunctionType.ReplaceCostCode:
					case estimateMainReplaceFunctionType.ReplaceAssemblyByCostCode:
						return estimateMainResourceType.CostCode;
					case estimateMainReplaceFunctionType.ReplaceMaterial:
					case estimateMainReplaceFunctionType.ReplaceCostCodeByMaterial:
					case estimateMainReplaceFunctionType.ReplaceAssemblyByMaterial:
						return estimateMainResourceType.Material;
					case estimateMainReplaceFunctionType.ReplaceCostCodeByAssembly:
					case estimateMainReplaceFunctionType.ReplaceMaterialByAssembly:
					case estimateMainReplaceFunctionType.ReplaceAssembly:
						return estimateMainResourceType.Assembly;
					case estimateMainReplaceFunctionType.ReplacePlantByPlant:
						return estimateMainResourceType.Plant;
					case estimateMainReplaceFunctionType.RemoveResource: // remove resource
						return 0;
				}
			};

			service.setDefaulteCurrentElementJob = function setDefaulteCurrentElementJob(_currentElementJob) {
				currentElementJob = _currentElementJob;
			};

			service.getDefaultCurrentElementJob = function getDefaultCurrentElementJob() {
				return currentElementJob;
			};

			service.setReplacedGridReadOnly = function (items) {
				let fields = [];
				angular.forEach(items, function (item) {
					if (item.__rt$data){
						item.__rt$data.readonly = [];
					}
					let thisReadOnly = !item.IsChange;
					fields = [{field: 'ChangeFieldValue', readonly: thisReadOnly}];
					platformRuntimeDataService.readonly(item, fields);
				});
			};

			service.setReplaceElement = function (_element) {
				replaceElement = _element;
			};

			service.getReplaceElement = function () {
				return replaceElement;
			};

			service.getReplaceElementId = function () {
				if(replaceElement !== null){
					return replaceElement.MdcMaterialFk || replaceElement.Id;
				}
				return 0;
			};

			// region dialog context
			service.setDialogContext = function setDialogContext(_context) {
				dialogContext = _context;
			};

			service.getDialogContext = function getDialogContext() {
				return dialogContext;
			};
			// endregion

			service.clear = function clear() {
				selectedFunction = null;
				resourceFields = [];
				currentResourceField = {};
				summaryInfo = {};
				dynamicColumns = [];
				udpDynamicColumns = [];
				specifyResource = null;
				specifyType = null;
				listToSave = {};
				dialogContext = 'Replace';
			};

			return service;
		}]);
})();

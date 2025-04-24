/**
 * Created by baf on 29.12.2016.
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'scheduling.main';

	/**
	 * @ngdoc service
	 * @name schedulingMainActivityBelongsToDataServiceFactory
	 * @description creates data services used in different belongs to container
	 */
	angular.module(moduleName).service('schedulingMainActivityBelongsToDataServiceFactory', SchedulingMainActivityBelongsToDataServiceFactory);

	SchedulingMainActivityBelongsToDataServiceFactory.$inject = ['_', '$http', '$injector', '$q', 'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension', 'schedulingMainService',
		'modelViewerModelSelectionService', 'modelViewerViewerRegistryService', 'platformModalService', '$translate',
		'platformTranslateService', 'platformModalGridConfigService', 'platformDataServiceSelectionExtension',
		'schedulingMainLookupLineItemsDialogService', 'modelViewerObjectTreeService', 'modelViewerModelIdSetService',
		'basicsLookupDataRichLineItemProcessor', 'platformDataValidationService', 'platformDataServiceDataProcessorExtension', 'platformModuleInitialConfigurationService', '$rootScope'];

	function SchedulingMainActivityBelongsToDataServiceFactory(_, $http, $injector, $q, platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension, schedulingMainService, modelViewerModelSelectionService, modelViewerViewerRegistryService,
		platformModalService, $translate, platformTranslateService, platformModalGridConfigService, platformDataServiceSelectionExtension,
		schedulingMainLookupLineItemsDialogService, modelViewerObjectTreeService, modelViewerModelIdSetService, basicsLookupDataRichLineItemProcessor,
		platformDataValidationService, platformDataServiceDataProcessorExtension, platformModuleInitialConfigurationService, $rootScope) {
		let instances = {};
		let actTypeIdActivity = 1;
		let actTypeIdMilestone = 3;

		let self = this;

		let noRelation = true;
		let allNeccessaryDataServicesCreated = false;
		let mappingTable = [];
		this.setMappingTable = function (){
			let defer = $q.defer();
			$http.post(globals.webApiBaseUrl + 'basics/customize/EstimationType/list', {}).then(function (result) {
				if (result.data) {
					_.each(result.data, function (item) {
						mappingTable.push(item);
					});
				}
				defer.resolve(mappingTable);
			});
			return defer.promise;
		};

		this.createAllServices = function(){
			if (!allNeccessaryDataServicesCreated) {
				allNeccessaryDataServicesCreated = true;
				let modConf = platformModuleInitialConfigurationService.get('Scheduling.Main');
				_.each(mappingTable, function (item) {
					let estType = item.Id;
					let gridType = 'flat';
					let readOnly = false;
					let templInfo = _.find(modConf.container, function (c) {
						return c.layoutNew === item.GuidGrid;
					});

					let cisName = _.camelCase(templInfo.moduleName) + 'ContainerInformationService';
					let modCIS = $injector.get(cisName);
					let orgConf = modCIS.getContainerInfoByGuid(templInfo.layout);
					let confServ = _.isObject(orgConf.standardConfigurationService) ? orgConf.standardConfigurationService : $injector.get(orgConf.standardConfigurationService);

					let dtaSrv = self.createDataService(templInfo, estType, gridType, orgConf.dataServiceName, null, readOnly,  confServ);
				});
			}
		};

		this.createDataService = function createDataService(templInfo, estType, gridType, orgDataServiceName, listConfig, readOnly, standardConfigurationService) {
			this.createAllServices();
			let dsName = self.getDataServiceName(templInfo, estType);

			let srv = instances[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo, estType, gridType, orgDataServiceName, listConfig, readOnly, standardConfigurationService);
				instances[dsName] = srv;
			}

			return srv;
		};

		this.getNameInfix = function getNameInfix(templInfo) {
			return templInfo.dto;
		};

		this.getDataServiceName = function getDataServiceName(templInfo, estType) {
			return 'schedulingMain' + self.getNameInfix(templInfo) + estType + 'BelongsToActivityDataService';
		};

		this.getDataService = function getDataService(dto, estType){
			let dsName = 'schedulingMain' + dto + estType + 'BelongsToActivityDataService';
			return instances[dsName];
		};

		this.doCreateDataService = function doCreateDataService(dsName, templInfo, estType, gridType, orgDataServiceName, listConfig, readOnly, standardConfigurationService) {
			let readType = estType;
			let isFilterActive = true;
			let configService = standardConfigurationService;
			let tree = gridType === 'tree';
			let processors = [];
			let actions = {delete: false, create: false};
			if (!readOnly) {
				actions.delete = true;
				actions.create = tree ? 'hierarchical' : 'flat';
			}
			if (orgDataServiceName) {
				let sourceDsv = $injector.get(orgDataServiceName);
				processors = sourceDsv.getDataProcessor();
				processors.push(basicsLookupDataRichLineItemProcessor);
			}
			let schedulinMainBelongsToDataServiceOption = {};
			if (tree) {
				let parentService = self.getDataService('EstLineItemDto', estType);
				schedulinMainBelongsToDataServiceOption = {
					hierarchicalLeafItem: {
						module: angular.module('scheduling.main'),
						serviceName: dsName,
						entityNameTranslationID: 'scheduling.main.belongsTo',
						httpRead: {
							route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'toActivity',
							initReadData: function (readData) {
								let selected = parentService.getSelected();
								readData.filter = '?lineItemId=' + selected.Id + '&estHeaderId=' + selected.EstHeaderFk;
							}
						},
						dataProcessor: processors,
						presenter: {
							tree: {
								parentProp: listConfig.parentProp,
								childProp: listConfig.childProp,
								childSort: listConfig.childSort
							}
						},
						actions: actions,
						entityRole: {
							leaf: {
								itemName: 'BelongsToActivity' + self.getNameInfix(templInfo),
								parentService: parentService
							}
						}
					}
				};
			} else {
				schedulinMainBelongsToDataServiceOption = {
					flatNodeItem: {
						module: angular.module('scheduling.main'),
						serviceName: dsName,
						entityNameTranslationID: 'scheduling.main.belongsTo',
						httpRead: {
							route: globals.webApiBaseUrl + templInfo.http + '/', endRead: 'toActivity',
							initReadData: function (readData) {
								readData.filter = '?activityId=' + schedulingMainService.getSelected().Id + '&estType=' + readType + '&isFilterActive=' + isFilterActive;
							}
						},
						dataProcessor: processors,
						presenter: {list: {
							incorporateDataRead: function (readData, data) {
								if(Object.hasOwnProperty.call(readData, 'EstRoundingConfigDetails')){
									let estRoundingConfigDetails = _.get(readData, 'EstRoundingConfigDetails');
									$injector.get('estimateMainRoundingDataService').setEstRoundingConfigData(estRoundingConfigDetails);
								}
								data.handleReadSucceeded(readData.dtos, data);
							}}},
						actions: actions,
						entityRole: {
							node: {
								itemName: 'BelongsToActivity' + self.getNameInfix(templInfo) + 'Cpl',
								parentService: schedulingMainService
							}
						}
					}
				};
			}

			let serviceContainer = platformDataServiceFactory.createNewComplete(schedulinMainBelongsToDataServiceOption);
			serviceContainer.service.onToggleCreateButton = new Platform.Messenger ();
			serviceContainer.service.onSelectProjectToolbarStatus = new Platform.Messenger ();
			serviceContainer.service.updateToolItems = new Platform.Messenger ();

			serviceContainer.service.getFilterStatus = function getFilterStatus() {
				return isFilterActive;
			};

			serviceContainer.service.setFilterStatus = function setFilterStatus(value) {
				isFilterActive = value;
			};
			// TODO: integrate into schedulingMainModelFilterService, if required
			/*
			function selectionChanged() {
				var selectedLineItem = serviceContainer.service.getSelected();
				var selectedModel = modelViewerModelSelectionService.getSelectedModel();
				if (selectedModel && selectedLineItem && modelViewerViewerRegistryService.isViewerActive()) {
					var data = {
						EstHeaderFk: selectedLineItem.EstHeaderFk,
						EstLineItemFk: selectedLineItem.Id,
						MdlModelFk: selectedModel.info.modelId
					};

					if (!data.viewerPromise) {
						data.viewerPromise = $http.post(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/allobjectids', [data]);
						data.viewerPromise.then(function (response) {
							var treeInfo = modelViewerObjectTreeService.getTree();
							if (treeInfo) {
								data.viewerPromise = null;
								var objectIds = modelViewerModelIdSetService.createFromCompressedStringWithArrays(response.data).useSubModelIds();
								var meshIds = treeInfo.objectToMeshIds(objectIds);
								modelViewerObjectFilterService.filterById.moduleContext.includeObjects(meshIds);
							}
						});
					}
				}
			}

			serviceContainer.service.registerSelectionChanged(selectionChanged);
			*/

			function reloadResourcePart() {
				let dataService = self.getDataService('EstResourceDto', estType);
				if (_.isNull(dataService) || _.isUndefined(dataService)) {
					return;
				}
				dataService.load();
			}

			function updatePlannedDuration (activity){
				let sum = _.sumBy(serviceContainer.data.itemList, function(item){
					if (item.EstQtyRelActFk === 2 || item.EstQtyRelActFk === 4){
						return item.HoursTotal;
					}
					return 0;
				});
				if (sum !== activity.EstimateHoursTotal){
					if (activity.IsDurationEstimationDriven) {
						schedulingMainService.updateFromEstimate(activity, sum);
					} else {
						if (sum <= 0){
							activity.EstimateHoursTotal = null;
						} else {
							activity.EstimateHoursTotal = sum;
						}
						schedulingMainService.fireItemModified(activity);
					}
				}
			}

			if(!readOnly)
			{

				serviceContainer.service.deleteItem = function (entity) {
					serviceContainer.service.deleteEntities([entity]);
				};

				serviceContainer.service.deleteEntities = function (entities) {
					let entity = null;
					if (entities && entities.length > 0) {
						entity = entities[0];
					}
					let index = entity ? serviceContainer.data.itemList.indexOf(entity) : -1;
					angular.forEach(entities, function (entity) {
						entity.PsdActivityFk = null;
					});
					serviceContainer.service.markEntitiesAsModified(entities);
					serviceContainer.data.itemList = _.filter(serviceContainer.data.itemList, function (item) {
						return !_.find(entities, function (delEntity) {
							return item.Id === delEntity.Id;
						});

					});
					updatePlannedDuration(schedulingMainService.getSelected());
					serviceContainer.data.listLoaded.fire();
					if(serviceContainer.data.itemList.length === 0)
					{
						let sel =  schedulingMainService.getSelected();
						sel.IsAssignedToEstimate = false;
					}
					platformDataServiceSelectionExtension.doSelectCloseTo(index, serviceContainer.data);
				};

				serviceContainer.service.canCreate = function canCreate() {
					let sel =  schedulingMainService.getSelected();

					return (sel && (sel.ActivityTypeFk === actTypeIdActivity || sel.ActivityTypeFk === actTypeIdMilestone));
				};

				serviceContainer.service.createItem = function insertItem() {

					let isValid = true;
					function validateQuantityPercent (entity, value, model){
						let result = platformDataValidationService.isAmong(entity, value, model, 0, 100);
						isValid = angular.isObject(result) ? result.valid : result;
						if (isValid) {
							entity.SplitQuantityTotal = entity.QuantityTotal * value / 100;
							entity.RemainingQuantityTotal = entity.QuantityTotal - entity.SplitQuantityTotal;
							let applySplitResultTo = schedulingMainLookupLineItemsDialogService.getApplySplitResultTo();
							if (applySplitResultTo ==='Quantity'){
								let entityQuantityPercent = (entity.SplitQuantityTotal / entity.QuantityTotal).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
								entity.SplitDifference = (( entityQuantityPercent * entity.QuantityTotal)- entity.SplitQuantityTotal).toFixed(3) - 0;
							}else{
								entity.SplitDifference = 0;
							}

						}
						return result;
					}

					function validateQuantity (entity, value, model){
						let result = platformDataValidationService.isAmong(entity, value, model, 0, entity.QuantityTotal);
						isValid = angular.isObject(result) ? result.valid : result;
						if (isValid) {
							entity.QuantityPercent = (value / entity.QuantityTotal * 100).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
							entity.RemainingQuantityTotal = entity.QuantityTotal - value;
							let applySplitResultTo = schedulingMainLookupLineItemsDialogService.getApplySplitResultTo();
							if (applySplitResultTo ==='Quantity'){
								let entityQuantityPercent = (value / entity.QuantityTotal).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
								entity.SplitDifference = (( entityQuantityPercent * entity.QuantityTotal) - value).toFixed(3) - 0;
							}else{
								entity.SplitDifference = 0;
							}
						}
						return result;
					}
					function getValueByCulture(value) {
						let result = value;
						let culture = $injector.get('platformContextService').culture();
						let cultureInfo = $injector.get('platformLanguageService').getLanguageInfo(culture);
						if(cultureInfo && cultureInfo.numeric) {
							let numberDecimal = cultureInfo.numeric.decimal;
							let inverseNumberDecimal = numberDecimal === ',' ? '.' : ',';
							if (typeof value === 'string' && value.indexOf(numberDecimal) === -1 && value.indexOf(inverseNumberDecimal) !== -1)
							{
								result = value.replace('.',',');
							}
						}
						return result;
					}
					function calculateSplitQuantity (qtyField, splitItems, isCalcTotalWithWq){
						if(!splitItems){
							return;
						}
						let map2Detail = {
							Quantity: 'QuantityDetail',
							QuantityTarget: 'QuantityTargetDetail',
							WqQuantityTarget: 'WqQuantityTargetDetail'
						};

						if(qtyField === 'QuantityTarget'){
							qtyField = isCalcTotalWithWq ? 'WqQuantityTarget' : 'QuantityTarget';
						}

						if(map2Detail[qtyField]){
							angular.forEach(splitItems, function (item){
								if(item){
									if(qtyField === 'QuantityTarget' || qtyField === 'WqQuantityTarget'){
										item.QuantityPercent = (item.SplitQuantityTotal / item.QuantityTotal * 100);
										item.QuantityTotal = (item[qtyField] * item.QuantityPercent / 100).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
									}else{
										item.QuantityTotal = (item[qtyField] * item.QuantityPercent / 100).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;
									}
									item[qtyField] = item.QuantityTotal;
									item[map2Detail[qtyField]] = item.QuantityTotal.toString();
									item.WqQuantityTarget = qtyField === 'QuantityTarget' ? item.WqQuantityTarget * item.QuantityPercent / 100 : item.WqQuantityTarget;
									item.WqQuantityTarget = item.WqQuantityTarget.toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('WqQuantityTarget')) - 0;
									item.WqQuantityTargetDetail = qtyField === 'QuantityTarget' ? item.WqQuantityTarget.toString() : item.WqQuantityTargetDetail;
									item.QuantityTarget = qtyField === 'WqQuantityTarget' ? item.QuantityTarget * item.QuantityPercent / 100 : item.QuantityTarget;
									item.QuantityTarget = item.QuantityTarget.toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('WqQuantityTarget')) - 0;
									item.QuantityTargetDetail = qtyField === 'WqQuantityTarget' ? item.QuantityTarget.toString() : item.QuantityTargetDetail;

								}
							});
						}
					}

					if (schedulingMainService.hasSelection()) {
						let selectedActivity = schedulingMainService.getSelected();
						let modalCreateLineItemConfig = {
							title: $translate.instant('scheduling.main.insertLineItems'),
							dataItems: [],
							gridConfiguration: {},
							dialogOptions:{}
						};
						$http.get(globals.webApiBaseUrl + 'estimate/main/lineitem/getitemsbyprojectandesttype_new?projectFk=' + selectedActivity.ProjectFk + '&estTypeFk=' + readType)
							.then(function (response) {
								if (!response.data.dtos || response.data && response.data.dtos && response.data.dtos.length === 0) {
									let modalOptions = {
										headerText: $translate.instant('scheduling.main.insertLineItems'),
										bodyText: '',
										iconClass: 'ico-info'
									};
									modalOptions.bodyText = $translate.instant('scheduling.main.errorNoLineItems');
									platformModalService.showDialog(modalOptions);
								} else {
									_.each(response.data.dtos, basicsLookupDataRichLineItemProcessor.processItem);
									response.data.dtos = _.filter(response.data.dtos, {'IsTemp': false});
									let headers = [];
									_.each(response.data.dtos, function(item){
										let header = _.find(headers, {'Id': item.EstHeaderFk});
										if(_.isNil(header)) {
											headers.push({'Id': item.EstHeaderFk, 'Code': item.EstimationCode, 'DescriptionInfo': item.EstimationDescription});
										}
									});
									let gridConf = _.cloneDeep(configService.getStandardConfigForListView());
									angular.forEach(response.data.dtos, function (item) {
										item.Select = false;
										item.QuantityPercent = 100.00;
										item.SplitQuantityTotal = item.QuantityTotal;
										item.RemainingQuantityTotal = 0.000;
										item.NoRelation = true;
									});
									let locColumn = _.find(gridConf.columns,{'id': 'prjlocationfk'});
									if(locColumn) {
										locColumn.formatterOptions = {
											dataServiceName: 'projectLocationLookupDataService',
											displayMember: 'Code',
											filter: function (item) {
												if (item && item.ProjectFk) {
													return item.ProjectFk;
												}
												return null;
											}
										};
									}
									angular.forEach(gridConf.columns, function(col){
										col.editor = null;
										col.editorOptions = null;
									});
									let locColumnAdd = _.find(gridConf.columns,{'id': 'prjlocationfkdescription'});
									if(locColumnAdd) {
										locColumnAdd.formatterOptions = {
											dataServiceName: 'projectLocationLookupDataService',
											filter: function (item) {
												if (item && item.ProjectFk) {
													return item.ProjectFk;
												}
												return null;
											}
										};
									}

									modalCreateLineItemConfig.gridConfiguration.columns = _.union([{
										field: 'Select',
										editor: 'boolean',
										formatter: 'boolean',
										id: 'select',
										name: 'Select',
										name$tr$: 'scheduling.main.entitySelect',
										toolTip: 'Select',
										toolTip$tr$: 'scheduling.main.entitySelect',
										pinned: true
									}, {
										field: 'QuantityPercent',
										editor: 'percent',
										formatter: 'percent',
										id: 'QuantityPercent',
										name: 'Quantity in percent',
										name$tr$: 'scheduling.main.entityPercentQuantity',
										toolTip: 'Quantity in percent',
										toolTip$tr$: 'scheduling.main.entityPercentQuantity',
										validator: validateQuantityPercent,
										pinned: true
									}, {
										field: 'SplitQuantityTotal',
										editor: 'quantity',
										formatter: 'quantity',
										id: 'splitQuantityTotal',
										name: 'Quantity Total Split',
										name$tr$: 'scheduling.main.entityQuantityTotalSplit',
										toolTip: 'Quantity Total Split',
										toolTip$tr$: 'scheduling.main.entityQuantityTotalSplitTip',
										validator: validateQuantity,
										pinned: true
									}, {
										field: 'RemainingQuantityTotal',
										formatter: 'quantity',
										id: 'remainingQuantityTotal',
										name: 'Quantity Total Remaining Split',
										name$tr$: 'scheduling.main.entityQuantityRemainingTotalSplit',
										toolTip: 'Quantity Total Remaining Split',
										toolTip$tr$: 'scheduling.main.entityQuantityRemainingTotalSplitTip',
										pinned: true
									}, {
										field: 'SplitDifference',
										formatter: 'quantity',
										id: 'splitDifference',
										name: 'Split Difference',
										name$tr$: 'scheduling.main.entitySplitDifference',
										toolTip: 'Quantity Split Difference',
										toolTip$tr$: 'scheduling.main.entitySplitDifferenceTip',
										pinned: true
									}], gridConf.columns);

									modalCreateLineItemConfig.headers = headers;
									modalCreateLineItemConfig.applySplitResultTo = 'QuantityTarget';
									modalCreateLineItemConfig.noRelation = noRelation;
									modalCreateLineItemConfig.gridConfiguration.uuid = 'f455b2b78f094d2a9be03beb70116d0f';
									modalCreateLineItemConfig.gridConfiguration.version = '1.0.0';
									modalCreateLineItemConfig.dataItems = response.data.dtos;
									modalCreateLineItemConfig.roundingConfigs = response.data.EstRoundingConfigDetails;
									modalCreateLineItemConfig.calcTotalWithWqs = response.data.CalcTotalWithWqs;
									modalCreateLineItemConfig.recalculate = function(){
										let data = _.filter (modalCreateLineItemConfig.dataItems, function(item){
											return item.Select;
										});
										angular.forEach(data, function(item){
											validateQuantity(item, item.SplitQuantityTotal, 'SplitQuantityTotal');
										});
									};
									modalCreateLineItemConfig.dialogOptions.disableOkButton = function() {
										return !isValid || !_.some(modalCreateLineItemConfig.dataItems, function(item){
											return item.Select;
										});
									};
									modalCreateLineItemConfig.handleOK = function handleCreateLineItem(result) {
										let creationData = {
											ResultSet: 2,
											SplitMethod: 4,
											PrjProjectFk: selectedActivity.ProjectFk,
											LineItems: [],
											SplitLineItems: []
										};
										noRelation = result.noRelation;
										angular.forEach(result.data, function (item) {
											if (item.Select) {
												item.PsdActivityFk = selectedActivity.Id;
												selectedActivity.IsAssignedToEstimate = true;
												if(selectedActivity.ControllingUnitFk) {
													item.MdcControllingUnitFk = selectedActivity.ControllingUnitFk;
												}
												if (result.noRelation && result.applySplitResultTo === 'QuantityTarget') {
													// set relation to no relation
													item.EstQtyRelBoqFk = 3;
													item.EstQtyRelActFk = 3;
													item.EstQtyRelGtuFk = 3;
													item.EstQtyTelAotFk = 3;
												}
												if (item.QuantityPercent !== 100.00){
													let oldItem = _.cloneDeep(item);
													let splitItem = _.cloneDeep(oldItem);
													if (result.applySplitResultTo ==='Quantity'){
														let entityQuantityPercent = (item.SplitQuantityTotal / item.QuantityTotal).toFixed($injector.get('estimateMainRoundingService').getRoundingDigits('Quantity')) - 0;

														let quantityPercent = 1 - entityQuantityPercent;
														splitItem.QuantityPercent = quantityPercent * 100;
														splitItem.SplitQuantityTotal = item.RemainingQuantityTotal;
														splitItem.SplitDifference = ((quantityPercent * item.QuantityTotal) - splitItem.QuantityTotal).toFixed(3) - 0;
													} else{
														splitItem.SplitDifference = 0;
														splitItem.QuantityPercent = item.RemainingQuantityTotal / item.QuantityTotal * 100;
														splitItem.SplitQuantityTotal = item.RemainingQuantityTotal;
													}
													splitItem.RemainingQuantityTotal = 0;
													splitItem.EstLineItemFk = item.Id;
													if(splitItem.QuantityDetail && splitItem.QuantityDetail.length > 0) {
														splitItem.QuantityDetail = getValueByCulture(splitItem.Quantity.toString());
													}
													splitItem.PsdActivityFk = null;
													creationData.LineItems.push(oldItem);
													creationData.SplitLineItems.push(splitItem);
												} else {
													serviceContainer.data.handleOnCreateSucceeded(item, serviceContainer.data).then(function(){
														updatePlannedDuration(selectedActivity);
														schedulingMainService.update();
													});
												}
											}
										});
										if(creationData.LineItems.length > 0){
											creationData.EstHeaderFk = creationData.LineItems[0].EstHeaderFk;
											let isCalcTotalWithWq = response.data.CalcTotalWithWqs[creationData.EstHeaderFk];

											calculateSplitQuantity(result.applySplitResultTo, creationData.LineItems, isCalcTotalWithWq);
											calculateSplitQuantity(result.applySplitResultTo, creationData.SplitLineItems, isCalcTotalWithWq);
											$http.post(globals.webApiBaseUrl + 'estimate/main/lineitem/splititemforactivity',creationData).then(function(result){
												angular.forEach(result.data, function(item){
													platformDataServiceDataProcessorExtension.doProcessItem(item, serviceContainer.data);
													serviceContainer.data.itemList.push(item);
												});
												serviceContainer.data.listLoaded.fire(result);
												updatePlannedDuration(selectedActivity);
												platformDataServiceSelectionExtension.doSelect(result.data[result.data.length-1], serviceContainer.data);
												$rootScope.$emit('belongsToChanged');
											});
										}
									};

									platformTranslateService.translateGridConfig(modalCreateLineItemConfig.gridConfiguration.columns);

									// platformModalGridConfigService.showDialog(modalCreateLineItemConfig);
									schedulingMainLookupLineItemsDialogService.showLookup(modalCreateLineItemConfig);
								}
							});
					}
				};
			}else {
				schedulingMainService.registerUpdateResource(reloadResourcePart);
			}

			return serviceContainer.service;
		};

	}
})(angular);

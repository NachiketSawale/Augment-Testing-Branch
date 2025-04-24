/**
 * Created by anl on 5/24/2017.
 */


(function (angular) {
	'use strict';
	/* global angular, globals */
	var moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('productionplanningItemWizardService', PPSItemWizardService);

	PPSItemWizardService.$inject = [
		'platformSidebarWizardConfigService',
		'platformWizardDialogService',
		'productionplanningItemDataService',
		'productionplanningItemSubItemDataService',
		'ppsCommonDtoRecognizerService',
		'platformSidebarWizardCommonTasksService',
		'basicsCommonChangeStatusService',
		'productionplanningCommonProductItemDataService',
		'platformModuleStateService',
		'platformModalService',
		'productionplanningItemUpstreamPackagesCreationWizardHandler',
		'productionplanningProductReuseFromStockWizardHandler',
		'productionplanningActualTimeRecordingWizardHandler',
		'ppsBillingDataOfProductAndMaterialSelectionWizardHandler',
		'productionplanningItemMultishiftWizardConfigService',
		'productionplanningItemEventService',
		'productionplanningItemMultishiftDataService',
		'platformDataServiceProcessDatesBySchemeExtension',
		'platformDateshiftCalendarService',
		'ppsVirtualDataServiceFactory',
		'platformDateshiftHelperService',
		'ppsUpstreamItemDataService',
		'platformModuleNavigationService',
		'$http',
		'$injector',
		'$q',
		'_',
		'$translate',
		'basicsLookupdataSimpleLookupService',
		'platformGridAPI',
		'documentProjectDocumentsStatusChangeService',
		'ppsItemMultishiftWizardImageProcessor',
		'projectLocationMainImageProcessor',
		'productionplanningDrawingComponentDataService',
		'moment',
		'ppsEntityConstant'
	];

	function PPSItemWizardService(platformSidebarWizardConfigService,
		platformWizardDialogService,
		itemDataService,
		subItemDataService,
		ppsCommonDtoRecognizerService,
		platformSidebarWizardCommonTasksService,
		basicsCommonChangeStatusService,
		commonProductService,
		platformModuleStateService,
		platformModalService,
		productionplanningItemUpstreamPackagesCreationWizardHandler,
		productionplanningProductReuseFromStockWizardHandler,
		productionplanningActualTimeRecordingWizardHandler,
		ppsBillingDataOfProductAndMaterialSelectionWizardHandler,
		productionplanningItemMultishiftWizardConfigService,
		productionplanningItemEventService,
		productionplanningItemMultishiftDataService,
		platformDataServiceProcessDatesBySchemeExtension,
		platformDateshiftCalendarService,
		ppsVirtualDataServiceFactory,
		platformDateshiftHelperService,
		ppsUpstreamItemDataServiceFactory,
		navigationService,
		$http,
		$injector,
		$q,
		_,
		$translate,
		basicsLookupdataSimpleLookupService,
		platformGridAPI,
		documentProjectDocumentsStatusChangeService,
		imageProcessor,
		projectLocationMainImageProcessor,
		drawingComponentDataService,
		moment,
		ppsEntityConstant) {

		var service = {};
		var wizardID = 'productionplanningItemSidebarWizards';

		var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
			typeName: 'EventDto',
			moduleSubModule: 'ProductionPlanning.Common'
		});

		function checkIfPUsArePreliminaryPU(dataService = itemDataService) {
			let isPassed = true;
			const selectedEntities = dataService.getSelectedEntities();
			if (selectedEntities.length > 0) {
				const preliminaryPUs = selectedEntities.filter(e => e.IsForPreliminary === true);
				if (preliminaryPUs.length > 0) {
					const preliminaryPUCodesStr = preliminaryPUs.map(e => e.Code).join(',');
					let msgText = $translate.instant('productionplanning.item.wizard.cannotExecuteWizardForPreliminaryPU', { item: preliminaryPUCodesStr });
					platformModalService.showMsgBox(msgText, 'productionplanning.item.wizard.preliminaryPUCheck', 'warning');
					isPassed = false;
				}
			}
			return isPassed;
		}

		function SetDerivedEventsUnlive(bLive) {
			var grid = platformGridAPI.grids.element('id', '5d32c2debd3646ab8ef0457135d35624');
			if (grid && grid.dataView) {
				var dataServiceFactory = $injector.get('productionplanningCommonEventMainServiceFactory');
				var dataService = dataServiceFactory.getService('ItemFk', 'productionplanning.common.item.event', itemDataService);
				if (dataService) {
					var ppsItem = itemDataService.getSelected();
					var eventList = dataService.getList();
					_.forEach(eventList, function (evt) {
						if (ppsItem.Id === evt.ItemFk) {
							evt.IsLive = bLive;
						}
					});
					dataService.gridRefresh();
				}
			}
		}

		function disableItem() {
			return platformSidebarWizardCommonTasksService.provideDisableInstance(itemDataService, 'Disable Item',
				'productionplanning.item.wizard.disableItemTitle', 'Code',
				'productionplanning.item.wizard.enableDisableItemDone', 'productionplanning.item.wizard.itemAlreadyDisabled',
				'item', 11);
		}

		service.disableItem = function () {
			var modStorage = platformModuleStateService.state(itemDataService.getModule()).modifications;
			var mainItemId = modStorage.MainItemId;
			disableItem().fn().then(function () {
				modStorage.MainItemId = mainItemId;// revert the MainItemId
				// set derived events IsLive=false
				SetDerivedEventsUnlive(false);
				logForIsLive();
			});
		};

		function enableItem() {
			return platformSidebarWizardCommonTasksService.provideEnableInstance(itemDataService, 'Enable Item',
				'productionplanning.item.wizard.enableItemTitle', 'Code',
				'productionplanning.item.wizard.enableDisableItemDone', 'productionplanning.item.wizard.itemAlreadyEnabled',
				'item', 12);
		}

		service.enableItem = function () {
			var modStorage = platformModuleStateService.state(itemDataService.getModule()).modifications;
			var mainItemId = modStorage.MainItemId;
			enableItem().fn().then(function () {
				modStorage.MainItemId = mainItemId;// revert the MainItemId
				// set derived events IsLive=true
				SetDerivedEventsUnlive(true);
				logForIsLive();
			});
		};

		function logForIsLive() {
			const modState = platformModuleStateService.state(itemDataService.getModule());
			_.forEach(modState.modifications.PPSItem, function (item) {
				$injector.get('productionplanningItemValidationService').validateIsLive(item, true, 'IsLive');
			});

			const isNeedToLog = entity => {
				return _.has(entity, 'ModificationInfo') && !!entity.ModificationInfo.ModifiedProperties
					&& entity.ModificationInfo.ModifiedProperties.length > 0
					&& _.some(entity.ModificationInfo.ModifiedProperties, (e) => e.LogConfigType  < 2);
			};
			const issuesNeedToLog = modState.modifications.PPSItem.filter(isNeedToLog);

			if (issuesNeedToLog.length > 0) {
				const validationService = $injector.get('productionplanningItemValidationService');

				if (validationService['validateModificationInfo']) {
					const validateSrv = validationService['validateModificationInfo'];
					const loggingValidationExtension = $injector.get('ppsCommonLoggingValidationExtension');

					var schemaOption = {
						typeName: 'PPSItemDto',
						moduleSubModule: 'ProductionPlanning.Item'
					};
					var translationSrv = $injector.get('productionplanningItemTranslationService');
					const entity = issuesNeedToLog[0];
					loggingValidationExtension.showLoggingDialog(entity, schemaOption, translationSrv, issuesNeedToLog.length > 1, issuesNeedToLog.length === 1)
						.then(res => {
							if (res.ok || res.applyAll) {
								loggingValidationExtension.setUpdateReasonsAndValidateEntities(issuesNeedToLog, entity, res.value, validateSrv);
							}
						});
				}
			}
		}

		function providePUStatusChangeInstance(options) {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					refreshMainService: false,
					mainService: itemDataService,
					dataService: options.dataService,
					statusField: 'PPSItemStatusFk',
					title: options.title,
					statusName: 'ppsitem',
					// projectField: 'ProjectFk',
					updateUrl: 'productionplanning/item/wizard/changeitemstatus',
					id: options.id,
					supportMultiChange: true,
					statusDisplayField: 'Description',
					statusProvider: function (entity) {
						return basicsLookupdataSimpleLookupService.getList({
							valueMember: 'Id',
							displayMember: 'Description',
							lookupModuleQualifier: 'basics.customize.ppsitemstatus',
							filter: {
								customIntegerProperty: 'BAS_RUBRIC_CATEGORY_FK',
								customIntegerProperty1: 'BACKGROUNDCOLOR',
								field: 'RubricCategoryFk'
							}
						}).then(function (respond) {
							var currentItemStatus = _.find(respond, function (itemStatus) {
								return itemStatus.Id === entity.PPSItemStatusFk;
							});
							_.forEach(respond, function (respond) {
								respond.BackGroundColor = respond.Backgroundcolor;
							});
							return _.filter(respond, function (item) {
								return item.RubricCategoryFk === currentItemStatus.RubricCategoryFk && item.isLive === true;
							});
						});
					},
					HookExtensionOperation: function (options, dataItems) {
						var schemaOption = {
							typeName: 'PPSItemDto',
							moduleSubModule: 'ProductionPlanning.Item'
						};
						var translationSrv = $injector.get('productionplanningItemTranslationService');
						return $injector.get('ppsCommonLoggingStatusChangeReasonsDialogService').showDialog(options, dataItems, schemaOption, translationSrv);
						// return $q.when(true);
					}
				}
			);
		}
		let mainPUStatusChangeInstance = providePUStatusChangeInstance({
			dataService: itemDataService,
			title: 'productionplanning.item.wizard.changeItemStatus',
			id: 13
		});
		service.changeItemStatus = mainPUStatusChangeInstance.fn;

		let handleStatusChangedDone = (returnValues) => {
			if (returnValues.length <= 0) {
				return;
			}
			if (ppsCommonDtoRecognizerService.isPPSItemDto(returnValues[0].entity)) {
				itemDataService.reloadSelectedItem(returnValues);
			} else if (ppsCommonDtoRecognizerService.isProductDto(returnValues[0].entity)) {
				commonProductService.reloadSelectedItems(returnValues);
			}
		};

		var changeProductStatus = function changeProductStatus() {
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					statusName: 'ppsproduct',
					mainService: itemDataService,
					dataService: commonProductService,
					refreshMainService: true,
					statusField: 'ProductStatusFk',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'Change Product Status',// 'productionplanning.item.wizard.changeItemStatus',
					updateUrl: 'productionplanning/common/wizard/changeproductstatus',
					supportMultiChange: true
				}
			);
		};
		service.changeProductStatus = changeProductStatus().fn;

		service.enableProduct = platformSidebarWizardCommonTasksService.provideEnableInstance(
			commonProductService,
			'enableProduct',
			'productionplanning.common.product.wizard.enableProduct',
			'Code',
			'productionplanning.common.product.wizard.enableProductDone',
			'productionplanning.common.product.wizard.productAlreadyEnabled',
			'product',
			20).fn;

		service.disableProduct = platformSidebarWizardCommonTasksService.provideDisableInstance(
			commonProductService,
			'disableProduct',
			'productionplanning.common.product.wizard.disableProduct',
			'Code',
			'productionplanning.common.product.wizard.disableProductDone',
			'productionplanning.common.product.wizard.productAlreadyDisabled',
			'product',
			21).fn;

		service.reuseProductFromStock = function (wizParam) {
			itemDataService.update().then(() => {
				productionplanningProductReuseFromStockWizardHandler.reuseProductFromStock(commonProductService, wizParam);
			});
		};

		service.deleteCompleteItem = function deleteCompleteItem() {
			if (platformSidebarWizardCommonTasksService.assertSelection(itemDataService.getSelected(), 'productionplanning.item.entityItem')) {
				itemDataService.deleteCompleteItem(itemDataService.getSelected());
			}
		};

		service.enableComponent = platformSidebarWizardCommonTasksService.provideEnableInstance(
			drawingComponentDataService.getService({ serviceKey: 'productionplanning.item.component', parentService: 'productionplanningItemDataService', endRead: 'getbyproductdesc' }),
			'enableComponent',
			'productionplanning.item.wizard.drawingComponent.enableComponent',
			'Description',
			'productionplanning.item.wizard.drawingComponent.enableComponentDone',
			'productionplanning.item.wizard.drawingComponent.componentAlreadyEnabled',
			'component',
			22).fn;

		service.disableComponent = platformSidebarWizardCommonTasksService.provideDisableInstance(
			drawingComponentDataService.getService({ serviceKey: 'productionplanning.item.component', parentService: 'productionplanningItemDataService', endRead: 'getbyproductdesc' }),
			'disableComponent',
			'productionplanning.item.wizard.drawingComponent.disableComponent',
			'Description',
			'productionplanning.item.wizard.drawingComponent.disableComponentDone',
			'productionplanning.item.wizard.drawingComponent.componentAlreadyDisabled',
			'component',
			23).fn;

		service.splitItem = function splitItem() {
			itemHandler(true);
		};

		service.copyItem = function copyItem() {
			itemHandler(false);
		};

		function itemHandler(splitMode, selected) {
			if (!selected) {
				selected = _.clone(itemDataService.getSelected());
			}
			if (selected) {
				return $http.get(globals.webApiBaseUrl + 'productionplanning/item/hasChildren?ItemId=' + selected.Id).then(function (response) {
					if (!response.data) {
						return itemDialog(splitMode, selected);
					} else {
						platformModalService.showMsgBox('productionplanning.item.wizard.haveChildWarn',
							'productionplanning.item.wizard.itemSplit.splitDialogTitle', 'warning');
					}
				});
			} else {
				platformModalService.showErrorBox('productionplanning.item.wizard.noSelectedWarn',
					'productionplanning.item.wizard.itemSplit.splitDialogTitle');
			}

			return $q.when(false);

			function itemDialog(splitMode, parentItem) {
				return $http.get(globals.webApiBaseUrl + 'productionplanning/item/geteventtypes?ItemId=' + selected.Id + '&Default=0').then(function (response) {
					var parentsented = !!_.find(itemDataService.getList(), { Id: parentItem.Id });
					var updateCallback = function () {
						var parentPU = splitMode === false ? itemDataService.getItemById(selected.PPSItemFk) : selected;
						var modalCreateConfig = {
							width: '940px',
							resizeable: true,
							templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-split-wizard-dialog.html',
							controller: 'productionplanningItemSplitWizardDialogController',
							resolve: {
								'$options': function () {
									return {
										entity: selected,
										eventTypes: response.data.SelectedItemEventTypes,
										fromTo: response.data.DefaultEventTypes,
										splitMode: splitMode,
										parentItem: parentPU
									};
								}
							}
						};
						platformModalService.showDialog(modalCreateConfig);
					};
					if (parentsented) {
						itemDataService.updateAndExecute(updateCallback);
					}
					else {
						updateCallback();
					}
				});
			}
		}

		service.mergeItem = function mergeItem() {
			var dialogService = $injector.get('productionplanningItemMergeWizardService');
			var selectedItems = _.clone(itemDataService.getSelectedEntities());
			var parentItems = _.uniq(_.map(selectedItems, 'PPSItemFk'));
			if (selectedItems.length > 1) {
				if ((parentItems.length === 1 && parentItems[0] !== null) ||
					parentItems.length > 1) {
					// haveParentWarn
					dialogService.showWarningInfo(6);
					return;
				}
				dialogService.checkSelectedItems(selectedItems).then(function (response) {
					if (response.data === 0) {
						itemDataService.updateAndExecute(function () {
							var modalCreateConfig = {
								width: '940px',
								resizeable: true,
								templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-merge-wizard-dialog.html',
								controller: 'productionplanningItemMergeWizardController',
								resolve: {
									'$options': function () {
										return {
											ppsItems: selectedItems
										};
									}
								}
							};
							platformModalService.showDialog(modalCreateConfig);
						});
					} else {
						dialogService.showWarningInfo(response.data);
					}
				});
			} else {
				// moreItemsWarn
				dialogService.showWarningInfo(7);
			}
		};

		service.groupItem = function groupItem() {
			var groupService = $injector.get('productionplanningItemGroupSelectionService');
			var selectedItems = _.clone(itemDataService.getSelectedEntities());
			var parentItems = _.uniq(_.map(selectedItems, 'PPSItemFk'));
			if (selectedItems.length > 1) {
				// not same PPSHeaderFk warning
				var firstPPSHeaderFk = selectedItems[0].PPSHeaderFk;
				var samePPSHeader = true;
				_.forEach(selectedItems, function (item) {
					if (item.PPSHeaderFk !== firstPPSHeaderFk) {
						groupService.showWarningInfo(9);
						samePPSHeader = false;
					}
				});
				if (!samePPSHeader) {
					return;
				}

				if (parentItems.length > 1 || parentItems[0] !== null) {
					// haveParentWarn
					groupService.showWarningInfo(6);
					return;
				}

				var ids = _.map(selectedItems, 'Id');
				var statusIds = _.map(selectedItems, 'PPSItemStatusFk');
				var postData = { itemIds: ids, statusIds: statusIds };
				$http.post(globals.webApiBaseUrl + 'productionplanning/item/wizard/checkGroupItems', postData).then(
					function (response) {
						if (response.data) {
							if (response.data.resultCode === 0) {
								itemDataService.updateAndExecute(function () {
									var modalCreateConfig = {
										width: '900px',
										resizeable: true,
										templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-group-wizard-dialog.html',
										controller: 'productionplanningItemGroupWizardDialogController',
										resolve: {
											'$options': function () {
												return {
													selectedItems: selectedItems,
													ppsEventInfo: response.data.eventInfo,
													ppsEventTypes: response.data.eventTypes
												};
											}
										}
									};
									platformModalService.showDialog(modalCreateConfig);
								});
							} else {
								groupService.showWarningInfo(response.data.resultCode);
							}
						}
					});
			} else {
				// moreItemsWarn
				groupService.showWarningInfo(7);
			}
		};

		service.reproduction = function reproduction() {
			var selected = _.clone(itemDataService.getSelected());
			if (selected) {
				var promise = [];
				promise.push($http.get(globals.webApiBaseUrl + 'productionplanning/common/product/listnotscrapproductbyitem?itemId=' + selected.Id + '&siteFk=' + selected.SiteFk));
				promise.push($http.get(globals.webApiBaseUrl + 'productionplanning/item/getEvent?type=6&itemId=' + selected.Id));
				$q.all(promise).then(function (response) {
					var modalCreateConfig = {
						width: '800px',
						height: '2000px',
						resizeable: true,
						templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-reproduction-wizard-dialog.html',
						controller: 'productionplanningItemReproductionWizardController',
						resolve: {
							'$options': function () {
								return {
									products: response[0].data.Entities,
									deliveryDate: _.get(response[1].data, 'PlannedStart'),
									isReusable: response[0].data.IsReuseable
								};
							}
						}
					};
					platformModalService.showDialog(modalCreateConfig);
				});
			} else {
				platformModalService.showErrorBox('productionplanning.item.wizard.noSelectedWarn',
					'productionplanning.item.wizard.reproductionDlgTitle');
			}
		};

		service.multiShift = function multiShift() {
			var selected = _.clone(itemDataService.getSelected());
			if (selected) {
				var promises = [];
				promises.push($http.get(globals.webApiBaseUrl + 'project/location/tree?projectId=' + selected.ProjectFk));
				promises.push($http.get(globals.webApiBaseUrl + 'productionplanning/item/getMultishift?projectFk=' + selected.ProjectFk + '&headerFk=' + selected.PPSHeaderFk));
				$q.all(promises).then(function (responses) {
					if (responses[1].data) {
						itemDataService.updateAndExecute(() => {

							let processorsForChild = (items) => {
								_.forEach(items, function (item) {
									_.forEach(item.ChildItems, function (child) {
										child.parentId = item.Id;
									});
									dateProcessor.processItem(item);
									imageProcessor.processItem(item);
									item.Selected = false;
									if ((item.Id.indexOf('E') > -1 && item.Id.indexOf('R') < 0) || (item.Id.indexOf('P') > -1 && item.Id.indexOf('PJ') < 0)) {
										$injector.get('productionplanningItemProcessor').setColumnReadOnly(item, 'Selected', true);
										item.Selected = 'false';
									}

									if (item.ChildItems && item.ChildItems.length > 0) {
										processorsForChild(item.ChildItems);
									}
								});
							};
							var processorsForLocations = (locations) => {
								_.forEach(locations, function (location) {
									projectLocationMainImageProcessor.processItem(location);
									if (location.HasChildren) {
										processorsForLocations(location.Locations);
									}
								});
							};
							var wzData = {};
							wzData.selectedItem = selected;
							wzData.itemList = responses[1].data;
							wzData.locations = responses[0].data;
							wzData.itemListModified = [];
							wzData.selectedType = 'Pull';
							processorsForChild(wzData.itemList);
							processorsForLocations(wzData.locations);

							var wzConfig = _.cloneDeep(productionplanningItemMultishiftWizardConfigService.wzConfig);

							let vdsService = ppsVirtualDataServiceFactory.getVirtualDataService('productionplanning.common');

							platformWizardDialogService.translateWizardConfig(wzConfig);
							const dlgConfig = _.assign({
								width: '60%',
								height: '800px',
								minWidth: '1000px',
								minHeight: '800px',
								bodyMarginLarge: true,
								resizeable: true
							}, wzConfig, {
								templateUrl: globals.appBaseUrl + 'productionplanning.item/templates/pps-item-multishift-wizard-dialog.html',
								value: {
									wizard: wzConfig,
									entity: wzData,
									wizardName: 'wzdlg'
								}
							});

							$injector.get('platformDialogService').showDialog(dlgConfig).then(function (result) {
								if (!result) {
									let lastSelectType = $injector.get('productionplanningItemMultishiftDataService').lastSelectType;
									var triggerEvents = _.cloneDeep(productionplanningItemMultishiftDataService.getTriggerEventsByMultishiftType(lastSelectType));
									_.forEach(triggerEvents, (triggerEvent) => {
										vdsService.shiftVirtualEntity(triggerEvent, 'Event');
									});
									// discard ALL changes!
									itemDataService.clearModifications();
								}

								vdsService.removeVirtualEntities(productionplanningItemMultishiftDataService.additionalEvents);
								vdsService.removeRelations(productionplanningItemMultishiftDataService.additionalRelations);

								if (result) {
									const modState = platformModuleStateService.state(itemDataService.getModule());
									const isNeedToLog = entity => {
										return entity.model === 'ModificationInfo' && entity.value !== null
											&& entity.value.ModifiedProperties.length > 0 &&
											entity.value.ModifiedProperties.some(prop => prop.LogRequired === true);
									};
									const issuesNeedToLog = modState.validation.issues.filter(isNeedToLog);

									if (issuesNeedToLog.length > 0) {
										const validationService = issuesNeedToLog[0].valideSrv;

										if (validationService['validateModificationInfo']) {
											const validateSrv = validationService['validateModificationInfo'];
											const loggingValidationExtension = $injector.get('ppsCommonLoggingValidationExtension');

											const schemaOption = { typeName: 'EventDto', moduleSubModule: 'ProductionPlanning.Common' };
											const translationSrv = $injector.get('productionplanningCommonTranslationService');
											const entity = issuesNeedToLog[0].entity;
											const model = issuesNeedToLog[0].model;

											loggingValidationExtension.showLoggingDialog(entity, schemaOption, translationSrv, true)
												.then(res => {
													if (res.ok) {
														loggingValidationExtension.setUpdateReasons(entity, res.value);
														validateSrv(entity, res.value, model);
													} else if (res.applyAll) {
														const entities = issuesNeedToLog.map(i => i.entity);
														loggingValidationExtension.setUpdateReasonsAndValidateEntities(entities, entity, res.value, validateSrv);
													}
													// simply update root service
													itemDataService.update();
												});
										}
									} else {
										// simply update root service
										itemDataService.update();
									}
								}
							});
						});
					} else {
						platformModalService.showMsgBox('productionplanning.item.noPpsHeaderWarn',
							'productionplanning.item.wizard.multishift.dialogTitle', 'warning');
					}
				});
			} else {
				platformModalService.showErrorBox('productionplanning.item.wizard.noSelectedWarn',
					'productionplanning.item.wizard.multishift.dialogTitle');
			}
		};

		service.createUpstreamPackages = function createUpstreamPackages() {
			var upstreamItemDataService = ppsUpstreamItemDataServiceFactory.getService();
			let getPackageRequestFn = (selectedItem, selectedUpstreamItems) => new Promise((resolve) => {
				_.forEach(selectedUpstreamItems, (selectedUpstreamItem) => {
					if(selectedUpstreamItem.PpsEventReqforFk){
						let dateSource = _.find(selectedItem.EventEntities, {Id: selectedUpstreamItem.PpsEventReqforFk});
						if(dateSource){
							selectedUpstreamItem.DateDelivery = moment(dateSource.PlannedStart).add(-1, 'day');
						}
					}
					else {
						let productionEventType = _.find(selectedItem.EventTypeEntities, {PpsEntityFk: ppsEntityConstant.PPSProductionSet});
						if(productionEventType){
							let dateSource = _.find(selectedItem.EventEntities, {EventTypeFk: productionEventType.Id});
							if(dateSource){
								selectedUpstreamItem.DateDelivery = moment(dateSource.PlannedStart).add(-1, 'day');
							}
						}
					}
				});

				var packageRequest = {
					UpstreamItems: selectedUpstreamItems,
					ProjectId: selectedItem.ProjectFk,
					PpsItemCode: selectedItem.Code,
				};
				resolve(packageRequest);
			});
			productionplanningItemUpstreamPackagesCreationWizardHandler.doCreateUpstreamPackages(upstreamItemDataService, itemDataService, getPackageRequestFn);
		};

		service.changeUpStreamFormDataStatus = function (param, userParam) {

			if (!userParam) {
				showInfo('Please first select a data entity!');
				return;
			}

			// var parentService = ppsUpstreamItemDataServiceFactory.getService({serviceKey:'productionplanning.item.upstreamitem'});
			// var selfService = ppsItemCommonFormDataDataService.getService(null,{uuid: 'a7cecf4268094d6c9d5a27cdc7bd9dbf'})

			var inst = basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					// projectField: 'ProjectFk',
					refreshMainService: false,
					statusName: 'formdata',
					mainService: userParam.mainService,
					dataService: userParam.dataService,
					statusField: 'FormDataStatusFk',
					codeField: 'Description',
					descField: 'Description',
					title: 'Change Form Data Status',
					updateUrl: 'basics/userform/data/changestatus',
					getDataService: function () {
						return {
							getSelected: function () {
								return userParam.dataService.getSelected();
							},
							getSelectedEntities: function () {
								return userParam.dataService.getSelectedEntities();
							},
							gridRefresh: function () {
								userParam.dataService.gridRefresh();
								var itemid = userParam.dataService.getSelected().Id;
								userParam.dataService.clearCache();
								userParam.dataService.load().then(function () {
									var item = userParam.dataService.getItemById(itemid);
									userParam.dataService.setSelected(item);
								});
							},
							getDataProcessor: function () {

							}
						};
					},
					id: 123
				}
			);
			inst.fn();

		};

		var changeUpstreamStatus = function changeUpstreamStatus() {
			var upstreamItemDataService = ppsUpstreamItemDataServiceFactory.getService();
			return basicsCommonChangeStatusService.provideStatusChangeInstance(
				{
					statusName: 'upstream',
					mainService: itemDataService,
					dataService: upstreamItemDataService,
					refreshMainService: false,
					statusField: 'PpsUpstreamStatusFk',
					statusDisplayField: 'DescriptionInfo.Translated',
					title: 'Change Upstream Requirement Status',
					supportMultiChange: true
				}
			);
		};
		service.changeUpstreamStatus = changeUpstreamStatus().fn;

		function showInfo(message) {
			var modalOptions = {
				headerTextKey: 'Info',
				bodyTextKey: message,
				showOkButton: true,
				iconClass: 'ico-warning'
			};
			platformModalService.showDialog(modalOptions);
		}


		var wizardConfig = {
			showImages: true,
			showTitles: true,
			showSelected: true,
			cssClass: 'sidebarWizard',
			items: [{
				id: 1,
				text: 'Groupname',
				text$tr$: 'productionplanning.item.wizard.wizardGroupname1',
				groupIconClass: 'sidebar-icons ico-wiz-change-status',
				visible: true,
				subitems: [
					disableItem(),
					enableItem(),
					mainPUStatusChangeInstance
				]
			}]
		};

		service.activate = function activate() {
			platformSidebarWizardConfigService.activateConfig(wizardID, wizardConfig);
			basicsCommonChangeStatusService.onStatusChangedDone.register(handleStatusChangedDone);
		};

		service.deactivate = function deactivate() {
			platformSidebarWizardConfigService.deactivateConfig(wizardID);
			basicsCommonChangeStatusService.onStatusChangedDone.unregister(handleStatusChangedDone);
		};

		service.doSplitItem = itemHandler; // extend to call after create new pps item

		service.changeStatusForProjectDocument = documentProjectDocumentsStatusChangeService.provideStatusChangeInstance(itemDataService, 'productionplanning.item').fn;


		service.doActualTimeRecording = function (wizParam) {
			productionplanningActualTimeRecordingWizardHandler.doActualTimeRecording(itemDataService, wizParam);
		};

		service.doBillingDataProductAndMaterialSelection = function () {
			ppsBillingDataOfProductAndMaterialSelectionWizardHandler.showDialogForPpsItem(itemDataService);
		};

		const methodNamesOfWizardsForPU = ['disableItem',
			'enableItem',
			'changeItemStatus',
			'changeSubItemStatus',
			'multiShift',
			'splitItem',
			'copyItem',
			'mergeItem',
			'groupItem',
			'reproduction',
			'createUpstreamPackages',
			'doActualTimeRecording',
		];
		methodNamesOfWizardsForPU.forEach(methodName => {
			let originalFn = service[methodName];
			if (originalFn) {
				service[methodName] = (...param) => {
					const dataServ = methodName === 'changeSubItemStatus' ? subItemDataService : itemDataService;
					if (!checkIfPUsArePreliminaryPU(dataServ)) {
						return;
					}
					originalFn(...param);
				};
			}
		});

		return service;
	}

})(angular);


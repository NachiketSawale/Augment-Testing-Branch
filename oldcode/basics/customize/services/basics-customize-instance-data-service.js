/**
 * Created by Frank Baedeker on 27.04.2015.
 */
(function () {
	/* global globals */
	'use strict';
	var moduleName = 'basics.customize';
	var basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeInstanceDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeInstanceDataService is the data service for all entity type descriptions
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsCustomizeModule.factory('basicsCustomizeInstanceDataService', ['_', 'platformDataServiceFactory', 'basicsCustomizeTypeDataService',
		'platformDataServiceDataProcessorExtension', 'basicsCustomizeInstanceTranslateService', 'platformDataServiceEntityRoleExtension',
		'platformDataServiceProcessDatesBySchemeExtension', 'platformModuleStateService', 'platformDataServiceModificationTrackingExtension',
		'basicsCustomizeStringColumnConfigurationProcessor', 'basicsCustomizeInstanceProcessorFactory', 'basicsCustomizeGeneralTypeProcessor',
		'basicsCustomizeActionInstanceProcessor', 'basicsCommonMandatoryProcessor',

		function (_, platformDataServiceFactory, basicsCustomizeTypeDataService,
			platformDataServiceDataProcessorExtension, basicsCustomizeInstanceTranslateService, platformDataServiceEntityRoleExtension,
			platformDataServiceProcessDatesBySchemeExtension, platformModuleStateService, platformDataServiceModificationTrackingExtension,
			basicsCustomizeStringColumnConfigurationProcessor, basicsCustomizeInstanceProcessorFactory, basicsCustomizeGeneralTypeProcessor,
			basicsCustomizeActionInstanceProcessor, basicsCommonMandatoryProcessor) {

			function canCreateInstanceOfType()
			{
				var res = false;
				var sel = basicsCustomizeTypeDataService.getSelected();

				if(sel && sel.Id && sel.Create) {
					res = true;
				}

				return res;
			}

			function canDeleteInstanceOfType()
			{
				var res = false;
				var sel = basicsCustomizeTypeDataService.getSelected();
				if(sel && sel.Id && sel.Delete) {
					res = true;
				}

				return res;
			}

			var curDateProcessor = null;
			var curReadOnlyProcessor = null;
			function ensureCurrentProcessor () {
				basicsCustomizeInstanceProcessorFactory.initializeCurrentProcessor();
				curDateProcessor = basicsCustomizeInstanceProcessorFactory.getCurrentDateProcessor();
				curReadOnlyProcessor = basicsCustomizeInstanceProcessorFactory.getCurrentReadOnlyProcessor();
			}

			var instanceDateProcessor = {
				processItem: function processItem(item) {
					ensureCurrentProcessor();
					curDateProcessor.processItem(item);
					if(!_.isNil(curReadOnlyProcessor)) {
						curReadOnlyProcessor.processItem(item);
					}
				},

				revertProcessItem: function revertProcessItem(item) {
					ensureCurrentProcessor();
					platformDataServiceProcessDatesBySchemeExtension.processItem(item, curDateProcessor.fields);
				}
			};

			function filterItem(result, data) {
				if (basicsCustomizeTypeDataService.getSelected().DBTableName === 'BAS_ITEM_TYPE') {
					let filtList = _.without(result, _.find(result, _.find(result, {Id: 0})));
					return filtList;
				} else {
					return result;
				}
			}

			// The instance of the main service - to be filled with functionality below
			var basicsCustomizeInstanceDataServiceOption = {
				module: basicsCustomizeModule,
				serviceName: 'basicsCustomizeInstanceDataService',
				httpRead: { route: globals.webApiBaseUrl + 'basics/customize/', endRead: 'list', usePostForRead: true },
				httpCreate: { route: globals.webApiBaseUrl + 'basics/customize/', endCreate: 'create' },
				modification: { multi: {} },
				dataProcessor: [instanceDateProcessor, basicsCustomizeStringColumnConfigurationProcessor, basicsCustomizeGeneralTypeProcessor, basicsCustomizeActionInstanceProcessor],
				actions: { create: 'flat', canCreateCallBackFunc: canCreateInstanceOfType, delete: {}, canDeleteCallBackFunc: canDeleteInstanceOfType},
				entitySelection: { supportsMultiSelection: true },
				presenter: {
					list: {
						incorporateDataRead: function (result, data) {
							let res = serviceContainer.data.handleReadSucceeded(filterItem(result, data), data);
							return res;
						}
					}
				}
			};

			var serviceContainer = platformDataServiceFactory.createNewComplete(basicsCustomizeInstanceDataServiceOption);
			var servData = serviceContainer.data;
			/* jshint -W003 */
			var instService = serviceContainer.service;

			servData.doesRequireLoadAlways = true;

			servData.httpRoutePrefix = servData.httpReadRoute;
			servData.itemName = '';
			basicsCustomizeTypeDataService.registerChildService(instService);

			servData.deleteItem = function deleteCustomizeInstance(entity, data)
			{
				platformDataServiceEntityRoleExtension.deleteSubEntity(entity, instService, data);
			};

			servData.deleteEntities = function deleteCustomizeInstance(entity, data)
			{
				platformDataServiceEntityRoleExtension.deleteSubEntities(entity, instService, data);
			};

			servData.checkTranslationForChanges = function checkTranslationForChanges(data) {
				var selInst = data.selectedItem;
				if(selInst && selInst.Id && basicsCustomizeInstanceTranslateService.checkTranslationForChanges(selInst) ){
					data.markItemAsModified(selInst, data);
				}
			};

			servData.onTypeSelectionChanged = function onTypeSelectionChanged()
			{
				instService.deselect();
				basicsCustomizeInstanceTranslateService.initService(instService);
				var sel = basicsCustomizeTypeDataService.getSelected();
				if(sel && sel.Id && sel.ClassName.length > 0) {
					servData.httpReadRoute = servData.httpRoutePrefix + sel.ClassName + '/';
					servData.httpCreateRoute = servData.httpReadRoute;

					instService.load();
				}
				else {
					instService.setList([]);
				}

				basicsCustomizeInstanceTranslateService.onTypeSelectionChanged(sel);
			};

			basicsCustomizeTypeDataService.registerSelectionChanged(servData.onTypeSelectionChanged);

			instService.getTranslatedEntityName = function getInstServiceTranslatedEntityName() {
				return basicsCustomizeTypeDataService.getSelected().Name;
			};

			instService.assertTypeEntries = function doAssertCustomizeTypeEntries(modStorage) {
				var sel = basicsCustomizeTypeDataService.getSelected();
				if(!modStorage.EntityData || !modStorage.EntityData.Id || (sel && modStorage.EntityData.Id !== sel.Id)) {
					modStorage.EntityData = { Id: sel.Id, ToSave: [] };
					modStorage.EntitiesCount = 0;
				}

				return modStorage.EntityData;
			};

			instService.addEntityToModified = function doAddEntityToModified(elemState, entity, modState) {
				var add = false;
				if(!modState.EntityData.ToSave) {
					modState.EntityData.ToSave = [];
					add = true;
				}
				else {
					if(!_.find(modState.EntityData.ToSave, { Id: entity.Id })) {
						add = true;
					}
				}

				if(add) {
					if(!modState.EntityData.EntitiesCount) {
						modState.EntityData.EntitiesCount = 0;
					}
					modState.EntityData.ToSave.push(entity);
					modState.EntityData.EntitiesCount += 1;
					modState.EntitiesCount += 1;
				}
			};

			servData.doClearModifications = function doClearModificationsOfInstance(entities) {
				if(entities && entities.length > 0) {
					var modState = platformModuleStateService.state(instService.getModule());
					var parentState = platformDataServiceModificationTrackingExtension.tryGetPath(modState.modifications, instService.parentService());

					if(parentState && parentState.EntityData && parentState.EntityData.ToSave) {
						_.forEach(entities, function (entity) {
							if(_.find(parentState.EntityData.ToSave, function( cand ) { return cand.Id === entity.Id; })) {
								parentState.EntityData.ToSave = _.filter(parentState.EntityData.ToSave, function (item) {
									return item.Id !== entity.Id;
								});
								parentState.EntityData.EntitiesCount -= 1;
								parentState.EntitiesCount -= 1;
							}
						});
					}
				}
			};

			instService.addEntityToDeleted = function doAddNodeEntityToDeleted(elemState, entity, data, modState) {
				instService.addEntitiesToDeleted(elemState, [entity], data, modState);
			};

			instService.addEntitiesToDeleted = function addEntitiesToDeleted(elemState, entities, data, modState) {
				if(!modState.EntityData.ToDelete) {
					modState.EntityData.ToDelete = [];
				}
				if(!modState.EntityData.EntitiesCount) {
					modState.EntityData.EntitiesCount = 0;
				}

				_.forEach(entities, function(entity) {
					modState.EntityData.ToDelete.push(entity);
				});
				modState.EntityData.EntitiesCount += entities.length;
				modState.EntitiesCount += entities.length;
			};

			instService.tryGetTypeEntries = function doTryGetCustomizeTypeEntries(modStorage) {
				return (!!modStorage.EntityData && !!modStorage.EntityData.ToSave) ? modStorage.EntityData.ToSave : null;
			};

			instService.revertProcessItems = function doRevertCustomizeTypeItems(modState) {
				var items = instService.tryGetTypeEntries(modState);
				if(items && items.length > 0) {
					platformDataServiceDataProcessorExtension.revertProcessItems(items, servData);
				}
			};

			servData.mergeItemAfterSuccessfullUpdate = function mergeItemAfterSuccessfullUpdate(oldItem, updateItem, data) {
				if (oldItem && oldItem.Id) {
					angular.extend(oldItem, updateItem);//Merge

					basicsCustomizeInstanceTranslateService.updateTranslationAfterUpdate(oldItem, data);//Update (merge) translation
					platformDataServiceDataProcessorExtension.doProcessItem(oldItem, data);//Adjust field changes / extensions on client

					data.selectedItem = oldItem;
					data.itemModified.fire(null, oldItem);
				}
			};

			instService.mergeInUpdateData = function doMergeInCustomizeTypeUpdateData(updateData) {
				var items = instService.tryGetTypeEntries(updateData);
				if(items && items.length > 0) {
					var data = servData;
					_.forEach(items, function (updateItem) {
						var oldItem = _.find(data.itemList, {Id: updateItem.Id});
						if (oldItem) {
							data.mergeItemAfterSuccessfullUpdate(oldItem, updateItem, data);
						}
					});
				}
			};

			instService.parentService = function getInstanceParentService() {
				return basicsCustomizeTypeDataService;
			};

			instService.getData = function getData() {
				return servData;
			};

			instService.provideUpdateData = function provideCustomizeInstanceUpdateData() {};

			servData.killRunningLoad = function killRunningLoadInInstanceData() {
				platformDataServiceEntityRoleExtension.killRunningLoadInLeaf(servData);
			};

			instService.killRunningLoad = function killRunningLoadInInstanceService() {
				platformDataServiceEntityRoleExtension.killRunningLoadInLeaf(servData);
			};

			instService.loadSubItemList = function loadSubItemListInInstanceService() {
			};

			instService.doNotifyModified = function doNotifyModified(entity) {
				servData.itemModified.fire(null, entity);
			};

			instService.prepareNewEntityValidator = function prepareNewEntityValidator(valServ) {
				if(valServ && valServ.mandatoryProperties && valServ.mustValidateFields) {
					servData.newEntityValidator = basicsCommonMandatoryProcessor.create({
						typeName: 'DDD',
						moduleSubModule: 'Basics.Customize',
						mustValidateFields: valServ.mustValidateFields,
						validationService: valServ
					});
				} else {
					servData.newEntityValidator = null;
				}
			};

			return instService;
		}]);
})();

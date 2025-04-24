/**
 * Created by Frank Baedeker on 27.04.2015.
 */
(function (angular) {
	/* global globals */
	'use strict';
	const moduleName = 'basics.customize';
	let basicsCustomizeModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name basicsCustomizeTypeDataService
	 * @function
	 *
	 * @description
	 * basicsCustomizeTypeDataService is the data service for all entity type descriptions
	 */
	/* jshint -W072 */ // many parameters because of dependency injection
	basicsCustomizeModule.factory('basicsCustomizeTypeDataService', ['_', '$injector',
		'platformDataServiceFactory', 'platformDataServiceModificationTrackingExtension', 'platformModuleStateService',
		'basicsCustomizeFieldTranslateProcessor', 'basicsCustomizeActionProcessor', 'basicsCustomizeTypeProcessor',
		'basicsCustomizePropertyFilterProcessor', 'basicsCustomizeTypeDocumentationProcessor', 'basicsLookupdataLookupFilterService',
		'basicsCustomizeTranslationProcessor', 'basicsLookupdataSimpleLookupService', 'basicsCustomizeInstanceTranslateService',

		function (_, $injector,
			platformDataServiceFactory, platformDataServiceModificationTrackingExtension, platformModuleStateService,
			basicsCustomizeFieldTranslateProcessor, basicsCustomizeActionProcessor, basicsCustomizeTypeProcessor,
			basicsCustomizePropertyFilterProcessor, basicsCustomizeTypeDocumentationProcessor, basicsLookupdataLookupFilterService,
			basicsCustomizeTranslationProcessor, basicsLookupdataSimpleLookupService, basicsCustomizeInstanceTranslateService) {

			// The instance of the main service - to be filled with functionality below
			const basicsCustomizeTypeDataServiceOption = {
				flatRootItem: {
					module: basicsCustomizeModule,
					serviceName: 'basicsCustomizeTypeDataService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/customize/entitytype/',
						endRead: 'list'
					},
					actions: {},
					dataProcessor: [basicsCustomizeFieldTranslateProcessor, basicsCustomizeActionProcessor, basicsCustomizeTypeProcessor, basicsCustomizePropertyFilterProcessor, basicsCustomizeTypeDocumentationProcessor, basicsCustomizeTranslationProcessor],
					entityRole: {
						root: {
							codeField: 'ClassName',
							descField: 'ModuleName',
							itemName: 'Entity',
							moduleName: 'cloud.desktop.moduleDisplayNameCustomize',
							handleUpdateDone: function (updateData, response, data) {
								if (response.EntityData && response.EntityData.ToSave) {
									_.forEach(response.EntityData.ToSave, function (item) {
										if (item.Id === 801) {
											let eruleComplexLookupCommonService = $injector.get('estimateRuleComplexLookupCommonService');
											if (eruleComplexLookupCommonService) {
												eruleComplexLookupCommonService.setSystemOptionEditEvaSeqVaule(item.ParameterValue);
											}
										}
									});
								}
								data.handleOnUpdateSucceeded(updateData, response, data, true);
								onHandleUpdateDone(updateData, response, data);
							}
						}
					},
					longText: {
						relatedContainerTitle: '',
						relatedGridId: 'F5E884C670DF4F938E51787E7CC40BF7',
						longTextProperties: [
							{
								displayProperty: 'Documentation',
								propertyTitle: 'basics.customize.entityDocumentation',
								readonly: true
							},
							{
								displayProperty: 'Remark',
								propertyTitle: 'cloud.common.entityRemark'
							}
						]
					}
				}
			};

			function onHandleUpdateDone(updateData, response, data) {
				let selectedMainItem = data.getItemById(updateData.MainItemId, data);
				if (selectedMainItem.DBTableName === 'PRJ_CAT_CONFIGTYPE') {
					basicsLookupdataSimpleLookupService.refreshCachedData({
						valueMember: 'Id',
						displayMember: 'Description',
						lookupModuleQualifier: 'basics.customize.projectcatalogconfiguration'
					});
				}
			}

			let serviceContainer = platformDataServiceFactory.createNewComplete(basicsCustomizeTypeDataServiceOption);
			let service = serviceContainer.service;
			serviceContainer.data.doProvideChangedEntitiesAsUpdateData = true;

			serviceContainer.data.onReadSucceeded = function inReadResourcesSucceeded(result, data) {
				result = _.filter(result, function(res) {
					return !res.Hidden;
				});

				data.handleReadSucceeded(result, data);
			};

			service.getDocumentationItem = function getDocumentationItem(item) {
				return (item) ? item.Documentation : null;
			};

			service.getTypeByDBTableName = function getTypeByDBTableName(table) {
				return _.find(serviceContainer.data.itemList, {DBTableName: table});
			};

			service.addEntityToModified = function addEntityTypeToModified(modStorage, entity) {
				if (!modStorage.Documentation) {
					modStorage.Id = entity.Id;
					modStorage.Documentation = entity;
					modStorage.EntitiesCount += 1;
				}
			};

			serviceContainer.data.doClearModifications = function doClearModificationsInRoot(entity, data) {
				var modState = platformModuleStateService.state(service.getModule());
				if(modState && modState.modifications) {
					basicsCustomizeInstanceTranslateService.clearTranslationChanges(modState.modifications.EntityData);
				}

				platformDataServiceModificationTrackingExtension.clearModificationsInRoot(serviceContainer.service, data, entity);
			};

			serviceContainer.data.clearTranslationChanges = function clearTranslationChanges(instance) {
				basicsCustomizeInstanceTranslateService.clearTranslationChanges(instance);
			};

			serviceContainer.data.getChangedRootEntitiesAsArray = function getChangedRootEntitiesAsArray(updateData/*, data, service, isBeforeUpdate*/) {
				if (updateData && updateData.EntityData) {
					return [updateData.EntityData];
				}

				return [];
			};

			service.getDtoSchemes = function getDtoSchemes() {
				if(_.isNil(serviceContainer.data.dtoSchemes)) {
					let schemes = [];

					_.forEach(serviceContainer.data.itemList, function (item) {
						item.DtoClassName = 'BasicsCustomize' + item.ClassName + 'DTO';
						schemes.push({
							typeName: item.DtoClassName,
							moduleSubModule: 'Basics.Customize'
						});
					});

					serviceContainer.data.dtoSchemes = schemes;
				}

				return serviceContainer.data.dtoSchemes;
			};

			var basicsCustomizeLookupFilter = [
				{
					key: 'basics-customize-rubric-category-by-rubric-filter',
					fn: function (rc /** ,project */) {
						var serv = $injector.get('basicsCustomizeStatusTransitionService');
						var rubricId = serv.getCurrentRubricCategory();
						return !!rubricId && rc.RubricFk === rubricId;
					}
				}
			];
			basicsLookupdataLookupFilterService.registerFilter(basicsCustomizeLookupFilter);

			return service;
		}]);
})(angular);

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

/* global globals, Platform */

(function () {
	'use strict';
	let moduleName = 'basics.textmodules';
	let basicsTextModulesModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name basicsTextModulesMainService
	 * @function
	 * @description
	 * basicsTextModulesMainService is the data service for all text modules related functionality.
	 */
	basicsTextModulesModule.factory('basicsTextModulesMainService', ['_', 'platformDataServiceFactory', 'basicsTextModulesPlainTextService', 'basicsTextModulesSpecificationService',
		'basicsTextModulesReadonlyProcessor',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'PlatformMessenger',
		'basicsLookupdataLookupFilterService',
		function (_, platformDataServiceFactory, basicsTextModulesPlainTextService, basicsTextModulesSpecificationService,
			basicsTextModulesReadonlyProcessor,
			basicsLookupdataLookupDescriptorService,
			basicsCommonMandatoryProcessor,
			PlatformMessenger,
			basicsLookupdataLookupFilterService) {

			let currentTextModuleContextId = null;

			// The instance of the main service - to be filled with functionality below
			let basicsTextModulesMainServiceOptions = {
				flatRootItem: {
					module: basicsTextModulesModule,
					serviceName: 'basicsTextModulesMainService',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'basics/textmodules/',
						endRead: 'filtered',
						usePostForRead: true
					},
					entityRole: {
						root: {
							codeField: 'Code',
							descField: 'Description',
							itemName: 'TextModule',
							moduleName: 'cloud.desktop.moduleDisplayNameTextModules',
							handleUpdateDone: function (updateData, response, data) {
								if(!response.TextModule && response.RefTextModule && response.RefTextModule.Id){
									response.TextModule = response.RefTextModule;
								}
								basicsTextModulesSpecificationService.resetModifiedSpecification();
								basicsTextModulesPlainTextService.resetModifiedPlainText();
								if(response.TextBlobToSave && response.TextBlobToSave.Id){
									basicsTextModulesSpecificationService.setCurrentSpecification(response.TextBlobToSave);
								}
								if(response.TextClobToSave && response.TextClobToSave.Id){
									basicsTextModulesPlainTextService.setCurrentPlainText(response.TextClobToSave);
								}

								data.handleOnUpdateSucceeded(updateData, response, data, true);
							}
						}
					},
					sidebarSearch: {
						options: {
							moduleName: moduleName,
							enhancedSearchEnabled: false,
							pattern: '',
							pageSize: 100,
							useCurrentClient: false,
							includeNonActiveItems: false,
							showOptions: true,
							showProjectContext: false,
							withExecutionHints: true
						}
					},

					entitySelection: {},
					presenter: {
						list: {
							incorporateDataRead: incorporateDataRead
						}
					},
					translation:{
						uid: 'basicsTextModulesMainService',
						title: 'basics.textmodules.textAssemblyGridTitle',
						columns: [{ header: 'cloud.common.descriptionInfo', field: 'DescriptionInfo' }]
					},
					dataProcessor: [basicsTextModulesReadonlyProcessor]
				}
			};

			let serviceContainer = platformDataServiceFactory.createNewComplete(basicsTextModulesMainServiceOptions);
			let service = serviceContainer.service;
			let data = serviceContainer.data;

			service.provideSpecUpdate = new Platform.Messenger();
			service.textFormatChanged = new PlatformMessenger();
			service.isLanguageDependentChanged = new PlatformMessenger();

			serviceContainer.data.provideUpdateData = function (updateData){
				service.provideSpecUpdate.fire();
				updateData.RefTextModule = service.getSelected();
				updateData.TextClobToSave = basicsTextModulesPlainTextService.getModifiedPlainText();
				updateData.TextBlobToSave = basicsTextModulesSpecificationService.getModifiedSpecification();
				if (updateData.TextClobToSave && _.size(updateData.TextClobToSave)) {
					updateData.EntitiesCount += 1;
				}
				if (updateData.TextBlobToSave && _.size(updateData.TextBlobToSave)) {
					updateData.EntitiesCount += 1;
				}
				return updateData;
			};

			// Load the specification and plain text for the new selected textModules
			service.onSelectedTextModuleChange = function onSelectedTextModuleChange(item){
				if (item) {
					basicsTextModulesSpecificationService.loadSpecificationById(item.BlobsFk);
					basicsTextModulesPlainTextService.loadPlainTextById(item.ClobsFk);
				}
			};

			service.updateItemReadonly = updateItemReadonly;

			data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'TextModuleDto',
				moduleSubModule: 'Basics.TextModules',
				validationService: 'basicsTextModulesValidationService',
				mustValidateFields: ['Code', 'DescriptionInfo']
			});

			let filters = [
				{
					key: 'basics-textmodule-company-filter',
					fn: function (item, context) {
						if (context) {
							return item.TextModuleContextFk === context.TextModuleContextFk;
						}
						return item.TextModuleContextFk === -1;
					}
				}, {
					key: 'basics-textmodule-textmodulecontext-filter',
					fn: function (item) {
						return item.Id === 0 || item.Id === currentTextModuleContextId;
					}
				}
			];

			basicsLookupdataLookupFilterService.registerFilter(filters);

			service.load();

			return  service;

			// /////////////////////////////////
			function incorporateDataRead(readData, data) {
				currentTextModuleContextId = readData.textModuleContextId;
				basicsLookupdataLookupDescriptorService.attachData(readData || {});
				return data.handleReadSucceeded(readData, data);
			}

			function updateItemReadonly(item, args) {
				let textModuleTypeId = args && args.textModuleTypeId;
				let textModuleType = null;
				if (textModuleTypeId) {
					textModuleType = basicsTextModulesReadonlyProcessor.getTextModuleType({TextModuleTypeFk: textModuleTypeId});
				}

				basicsTextModulesReadonlyProcessor.setFieldsReadOnly(item, {
					textModuleType: textModuleType
				});
			}
		}]);
})();

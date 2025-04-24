/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';

	let moduleName = 'basics.textmodules';

	angular.module(moduleName).factory('basicsTextModulesHyperlinkDataService', basicsTextModulesHyperlinkDataService);

	basicsTextModulesHyperlinkDataService.$inject = [
		'_',
		'$http',
		'$timeout',
		'platformDataServiceFactory',
		'globals',
		'basicsLookupdataLookupDescriptorService',
		'basicsTextModulesMainService',
		'basicsCommonMandatoryProcessor',
		'basicsCommonTextFormatConstant',
		'platformContextService',
		'platformRuntimeDataService',
		'basicsLookupdataLookupFilterService',
		'PlatformMessenger'
	];

	function basicsTextModulesHyperlinkDataService(
		_,
		$http,
		$timeout,
		platformDataServiceFactory,
		globals,
		basicsLookupdataLookupDescriptorService,
		basicsTextModulesMainService,
		basicsCommonMandatoryProcessor,
		basicsCommonTextFormatConstant,
		platformContextService,
		platformRuntimeDataService,
		basicsLookupdataLookupFilterService,
		PlatformMessenger
	) {

		let options = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'basicsTextModulesHyperlinkDataService',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'basics/textmodules/hyperlink/',
					endRead: 'getbyparentid'
				},
				presenter: {
					list: {
						initCreationData: function (creationData) {
							let textModule = basicsTextModulesMainService.getSelected();
							if (textModule) {
								creationData.PKey1 = textModule.Id;
							}
						}
					}
				},
				entityRole: {
					leaf: {
						itemName: 'TextModuleHyperlink',
						parentService: basicsTextModulesMainService
					}
				},
				dataProcessor: [itemReadonlyProcessor()],
				translation: {
					uid: 'basicsTextModulesHyperlinkDataService',
					title: 'basics.textmodules.hyperlinkGridTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: { typeName: 'TextModuleHyperlinkDto', moduleSubModule: 'Basics.TextModules' }
				},
				actions: {
					create: 'flat',
					delete: true,
					canCreateCallBackFunc: canCreateOrDeleteCallBackFunc
				}
			}
		};

		let gridReadonly = true;
		let loginDataLanguageId = platformContextService.getDataLanguageId();
		let readonlyFields = ['LanguageFk', 'DescriptionInfo', 'Url'];

		let serviceContainer = platformDataServiceFactory.createNewComplete(options);
		let service = serviceContainer.service;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'TextModuleHyperlinkDto',
			moduleSubModule: 'Basics.TextModules',
			validationService: 'basicsTextModulesHyperlinkValidationService',
			mustValidateFields: ['LanguageFk']
		});

		basicsTextModulesMainService.registerSelectionChanged(onParentSelectionChanged);
		basicsTextModulesMainService.textFormatChanged.register(onParentFieldtextFormatChanged);

		service.gridReadonlyChanged = new PlatformMessenger();

		let filters = [
			{
				key: 'basics-textmodules-hyperlink-language-filter',
				fn: function (item) {
					let parentItem = basicsTextModulesMainService.getSelected();
					if (parentItem) {
						if (!parentItem.IsLanguageDependent) {
							return item.Id === loginDataLanguageId;
						}
						else {
							return true;
						}
					}
					return false;
				}
			}
		];

		basicsLookupdataLookupFilterService.registerFilter(filters);

		return service;

		function onParentSelectionChanged(e, entity) {
			gridReadonly = !entity || entity.TextFormatFk !== basicsCommonTextFormatConstant.hyperlink;
		}

		function itemReadonlyProcessor() {
			return {
				processItem: function(item) {
					updateItemReadonly(item);
				}
			};
		}

		function updateItemReadonly(item) {
			let fields = [];
			_.forEach(readonlyFields, function (field) {
				fields.push({
					field: field,
					readonly: gridReadonly
				});
			});
			platformRuntimeDataService.readonly(item, fields);
		}

		function onParentFieldtextFormatChanged(value) {
			gridReadonly = value !==  basicsCommonTextFormatConstant.hyperlink;
			let list = service.getList();
			_.forEach(list, function (item){
				updateItemReadonly(item);
			});
			service.gridRefresh();
			service.gridReadonlyChanged.fire(gridReadonly);
		}

		function canCreateOrDeleteCallBackFunc() {
			return !gridReadonly;
		}
	}

})(angular);
(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name productionplanningCommonProductDataServiceFactory
	 * @function
	 *
	 * @description
	 * productionplanningCommonProductDataServiceFactory is the data service for all entities related functionality.
	 */
	var moduleName = 'productionplanning.common';
	var masterModule = angular.module(moduleName);
	masterModule.factory('productionplanningCommonProductDataServiceFactory', ProductionplanningCommonProductDataServiceFactory);
	ProductionplanningCommonProductDataServiceFactory.$inject = ['$injector', 'platformDataServiceFactory',
		'basicsLookupdataLookupDescriptorService', 'basicsLookupdataLookupFilterService',
		'platformDataServiceProcessDatesBySchemeExtension', 'productionplanningCommonProductProcessor',
		'ppsCommonTransportInfoHelperService', 'productionplanningCommonProductValidationFactory',
		'ServiceDataProcessDatesExtension', 'productionplanningProductDocumentDataProviderFactory'];

	function ProductionplanningCommonProductDataServiceFactory($injector, platformDataServiceFactory,
		basicsLookupdataLookupDescriptorService, basicsLookupdataLookupFilterService,
		platformDataServiceProcessDatesBySchemeExtension, productionplanningCommonProductProcessor,
		ppsCommonTransportInfoHelperService, ppsCommonProductValidationFactory,
		DatesProcessor, productDocumentDataProviderFactory) {

		var serviceFactroy = {};
		serviceFactroy.createService = function (serviceOption) {
			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: 'ProductDto',
				moduleSubModule: 'ProductionPlanning.Common'
			});
			var serviceBaseOption = {
				module: masterModule,
				entityNameTranslationID: 'productionplanning.common.product.productTitle',
				dataProcessor: [productionplanningCommonProductProcessor, dateProcessor, new DatesProcessor(['RoutesInfo.PlannedDelivery'])],
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							var result = readData.Main ? assembleHttpResult(readData) : readData;
							return serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				},
				actions: {
					delete: {},
					canDeleteCallBackFunc: (product) => {
						if(!_.isNil(product.PpsItemStockFk) && product.PpsItemStockFk !== product.ItemFk){
							return false;
						}
						// other condition...

						return true;
					},
					create: {}
				},
				modification: true,
				entitySelection: {supportsMultiSelection: false},
				translation: {
					uid: 'productionplanningCommonProductDataService',
					title: 'productionplanning.common.product.productTitle',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'ProductDto',
						moduleSubModule: 'ProductionPlanning.Common'
					},
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
				}
			};

			if (serviceOption && serviceOption.flatNodeItem) {
				if (!serviceOption.flatNodeItem.module) {
					serviceOption.flatNodeItem.module = serviceBaseOption.module;
				}
				if (!serviceOption.flatNodeItem.dataProcessor) {
					serviceOption.flatNodeItem.dataProcessor = serviceBaseOption.dataProcessor;
				}
				if (!serviceOption.flatNodeItem.presenter) {
					serviceOption.flatNodeItem.presenter = serviceBaseOption.presenter;
				}
				if (!serviceOption.flatNodeItem.entitySelection) {
					serviceOption.flatNodeItem.entitySelection = serviceBaseOption.entitySelection;
				}
				if (!serviceOption.flatNodeItem.modification) {
					serviceOption.flatNodeItem.modification = serviceBaseOption.modification;
				}
				if (!serviceOption.flatNodeItem.translation) {
					serviceOption.flatNodeItem.translation = serviceBaseOption.translation;
				}
				if (!serviceOption.flatNodeItem.sidebarSearch && !serviceOption.isNotRoot) {
					serviceOption.flatNodeItem.sidebarSearch = serviceBaseOption.sidebarSearch;
				}
				if (!serviceOption.flatNodeItem.entityNameTranslationID) {
					serviceOption.flatNodeItem.entityNameTranslationID = serviceBaseOption.entityNameTranslationID;
				}
			}

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);


			//serviceContainer.data.newEntityValidator = newEntityValidator();

			function assembleHttpResult(readData) {
				var result = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || []
				};
				basicsLookupdataLookupDescriptorService.attachData(readData);
				serviceContainer.service.processTransportInfo(result.dtos);
				return result;
			}

			ppsCommonTransportInfoHelperService.registerItemModified(serviceContainer, ppsCommonProductValidationFactory.getValidationService(serviceContainer.service, serviceOption.eventModule));

			const filters =[{
				key: 'pps-common-product-sub-product-set-filter',
				serverSide: true,
				fn: function(dataItem) {
					let productionSetFk = dataItem.ProductionSetFk || -1;
					if (productionSetFk === -1) {
						// when do filter in bulk editor dialog, the dateItem is empty object.
						const selected = serviceContainer.service.getSelected();
						productionSetFk = selected && selected.ProductionSetFk || -1;
					}
					return 'ProductionSetParentFk=' + productionSetFk;
				}
			}];

			serviceContainer.service.registerLookupFilter = function() {
				basicsLookupdataLookupFilterService.registerFilter(filters);
			};

			serviceContainer.service.unregisterLookupFilter = function() {
				basicsLookupdataLookupFilterService.unregisterFilter(filters);
			};

			const documentDataProvider = productDocumentDataProviderFactory.create(serviceContainer.service, true);
			_.extend(serviceContainer.service, documentDataProvider);

			return serviceContainer;
		};

		return serviceFactroy;
	}

})(angular);


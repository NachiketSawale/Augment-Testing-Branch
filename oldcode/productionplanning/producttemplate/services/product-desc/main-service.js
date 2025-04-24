/**
 * Created by zwz on 5/6/2019.
 */

(function (angular) {
	'use strict';
	/* global globals _ */
	const moduleName = 'productionplanning.producttemplate';
	const module = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name productionplanningProducttemplateMainService
	 * @description productionplanningProducttemplateMainService is the data service for providing methods to access, create, delete and update product description entities
	 */
	module.factory('productionplanningProducttemplateMainService', MainService);
	MainService.$inject = ['$injector',
		'platformGridAPI',
		'basicsCommonMandatoryProcessor',
		'basicsCommonCharacteristicService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningProducttemplateProductDescriptionProcessor',
		'productionplanningProducttemplateNavigationExtension',
		'productionplanningProducttemplatePinningContextExtension',
		'$http'];

	function MainService($injector,
		platformGridAPI,
		basicsCommonMandatoryProcessor,
		basicsCommonCharacteristicService,
		platformDataServiceFactory,
		platformDataServiceProcessDatesBySchemeExtension,
		productDescProcessor,
		navigationExtension,
		pinningContextExtension,
		$http) {

		const gridContainerGuid = 'ff4c323cfd0e4a5692f923110b8ffb00';
		const characteristic1SectionId = 61;
		const characteristic2SectionId = 62;
		let characteristicColumn = '';

		const dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
			{
				typeName: 'ProductDescriptionDto',
				moduleSubModule: 'ProductionPlanning.ProductTemplate'
			}
		);

		const serviceOption = {
			flatRootItem: {
				module: module,
				serviceName: 'productionplanningProducttemplateMainService',
				entityNameTranslationID: 'productionplanning.producttemplate.entityProductDescription',
				httpCRUD: {
					route: globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/',
					endRead: 'filtered',
					usePostForRead: true,
					endDelete: 'multidelete'// remark: if entitySelection.supportsMultiSelection is true, we use 'multidelete' as endDelete, or we use 'delete' as endDelete
				},
				entitySelection: {supportsMultiSelection: true},
				entityRole: {
					root: {
						itemName: 'ProductDescriptions',// remark: if entitySelection.supportsMultiSelection is true, we use 'ProductDescriptions' as itemName, or we use 'ProductDescription' as itemName
						moduleName: 'cloud.desktop.moduleDisplayNameProductTemplate',
						descField: 'Description',
						addToLastObject: true,
						lastObjectModuleName: moduleName,
						useIdentification: true,
						handleUpdateDone: function (update, response, data) {
							data.handleOnUpdateSucceeded(update, response, data, true);
							var utilSrv = $injector.get('transportplanningTransportUtilService');
							// refresh log-list
							if (utilSrv.hasShowContainerInFront('productionplanning.producttemplate.characteristic')) {
								let char1Service = $injector.get('basicsCharacteristicDataServiceFactory')
									.getService(service, characteristic1SectionId);
								let char1GroupService = $injector.get('basicsCharacteristicDataGroupServiceFactory')
									.getService(characteristic1SectionId, service);
								char1GroupService.loadData(update.MainItemId);
								char1Service.load();
							}
							if (utilSrv.hasShowContainerInFront('productionplanning.producttemplate.characteristic2')) {
								let char2Service = $injector.get('basicsCharacteristicDataServiceFactory')
									.getService(service, characteristic2SectionId);
								let char2GroupService = $injector.get('basicsCharacteristicDataGroupServiceFactory')
									.getService(characteristic2SectionId, service);
								char2GroupService.loadData(update.MainItemId);
								char2Service.load();
							}
						}
					}
				},
				dataProcessor: [dateProcessor,productDescProcessor],
				presenter: {
					list: {
						initCreationData: function (creationData) {
							// set creationData by pinning context
							const pinnedItemFound = pinningContextExtension.getDrawingPinnedItem();
							if (pinnedItemFound) {
								creationData.Pkey1 = pinnedItemFound.id;
							}
						},
						incorporateDataRead: function(readData, data) {
							let dataRead = data.handleReadSucceeded(readData, data);
							// handle charactistic
							let exist = platformGridAPI.grids.exist(gridContainerGuid);
							if (exist) {
								let containerInfoService = $injector.get('productionplanningProductTemplateContainerInformationService');
								let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
									.getService(service, characteristic2SectionId, gridContainerGuid,containerInfoService);
								characterColumnService.appendCharacteristicCols(readData.dtos);
							}

							return dataRead;
						},
						handleCreateSucceeded: function(item) {
							basicsCommonCharacteristicService.onEntityCreated(serviceContainer.service, item, characteristic1SectionId, characteristic2SectionId);
							let exist = platformGridAPI.grids.exist(gridContainerGuid);
							if (exist) {
								let containerInfoService = $injector.get('productionplanningProductTemplateContainerInformationService');
								let characterColumnService = $injector.get('basicsCharacteristicColumnServiceFactory')
									.getService(service, characteristic2SectionId, gridContainerGuid,containerInfoService);
								characterColumnService.appendDefaultCharacteristicCols(item);
							}
						}
					}
				},
				sidebarWatchList: {active: true},// enable watchlist for producttemplate module
				sidebarSearch: {
					options: {
						moduleName: moduleName,
						enhancedSearchEnabled: true,
						enhancedSearchVersion: '2.0',
						pattern: '',
						pageSize: 100,
						includeNonActiveItems: false,
						showOptions: true,
						showProjectContext: false,
						withExecutionHints: true,
						pinningOptions: pinningContextExtension.createPinningOptions()
					}
				},
				translation: {
					uid: 'productionplanningProducttemplateMainService',
					title: 'productionplanning.producttemplate.entityProductDescription',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
					dtoScheme: {
						typeName: 'ProductDescriptionDto',
						moduleSubModule: 'ProductionPlanning.ProductTemplate'
					},
				}
			}
		};

		const serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
		/* jshint -W003 */
		const service = serviceContainer.service;

		serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
			typeName: 'ProductDescriptionDto',
			moduleSubModule: 'ProductionPlanning.ProductTemplate',
			validationService: 'productionplanningProducttemplateProductDescriptionValidationService'
		});

		// navigational function
		navigationExtension.addNavigation(service);

		service.handleFieldChanged = function (entity, field) {
			$injector.get('productionplanningProducttemplateDataServiceEntityPropertychangedExtension').onPropertyChanged(entity, field, service);
		};

		const baseCreateItem = service.createItem;
		service.createItem = function () {
			const pinnedItemFound = pinningContextExtension.getDrawingPinnedItem();
			if (_.isObject(pinnedItemFound) && _.isNumber(pinnedItemFound.id)) {
				baseCreateItem();
			}
			else {
				showErrorNoPinned();
			}
		};

		service.createItemByMaterial = function createItem(creationOptions, customCreationData, onCreateSucceeded) {
			const data = serviceContainer.data;
			const creationData = _.merge(data.doPrepareCreate(data, creationOptions), customCreationData);
			return data.doCallHTTPCreate(creationData, data, onCreateSucceeded);
		};

		service.updateByMaterial = function (updateData) {
			// $http.post(globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/updatebymdcproductdescription', updateData);
			// then(function (response) {
			// serviceContainer.data.doCallHTTPUpdate(updateData, serviceContainer.data);
			// });
			return serviceContainer.data.doCallHTTPUpdate(updateData, serviceContainer.data);
		};

		function showErrorNoPinned() {
			const modalOptions = {
				headerTextKey: 'productionplanning.producttemplate.checkCreationTitle',
				bodyTextKey: 'productionplanning.producttemplate.noDrawingPinned',
				iconClass: 'ico-info'
			};
			$injector.get('platformModalService').showDialog(modalOptions);
		}

		service.setCharacteristicColumn = function setCharacteristicColumn(colName) {
			characteristicColumn = colName;
		};
		service.getCharacteristicColumn = function getCharacteristicColumn() {
			return characteristicColumn;
		};

		return service;

	}
})(angular);

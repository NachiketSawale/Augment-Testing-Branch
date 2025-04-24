(function (angular) {
	'use strict';
	/**
	 * @ngdoc service
	 * @name productionplanningEngineeringProductDescriptionDataService
	 * @function
	 *
	 * @description
	 * productionplanningEngineeringProductDescriptionDataService is the data service for product description entities of engineering task.
	 */
	var moduleName = 'productionplanning.engineering';
	var serviceName = 'productionplanningEngineeringProductDescriptionDataService';
	var angModule = angular.module(moduleName);

	angModule.factory(serviceName, DataService);

	DataService.$inject = ['$injector', '$translate',
		'productionplanningEngineeringMainService',
		'platformDataServiceFactory',
		'platformDataServiceProcessDatesBySchemeExtension',
		'basicsLookupdataLookupDescriptorService',
		'basicsCommonMandatoryProcessor',
		'treeviewListDialogDataService',
		'$http', '$q',
		'basicsCommonBaseDataServiceBasicExtension',
		'basicsCommonBaseDataServiceReferenceActionExtension'];

	function DataService($injector, $translate,
						 parentService,
						 platformDataServiceFactory,
						 platformDataServiceProcessDatesBySchemeExtension,
						 basicsLookupdataLookupDescriptorService,
						 basicsCommonMandatoryProcessor,
						 dialogDataService,
						 $http, $q,
						 basicsCommonBaseDataServiceBasicExtension,
						 referenceActionExtension) {

		var productDescriptionServiceInfo = {
			flatNodeItem: {
				module: angModule,
				serviceName: serviceName,
				entityNameTranslationID: 'productionplanning.item.entityProductDescription',
				dataProcessor: [],
				httpRead: {
					route: globals.webApiBaseUrl + 'productionplanning/producttemplate/productdescription/',
					endRead: 'listbyengtask'
				},
				entityRole: {
					node: {
						itemName: 'ProductDescription',
						parentService: parentService,
						parentFilter: 'engTaskId'
					}
				},
				translation: {
					uid: 'productionplanningEngineeringProductDescriptionDataService',
					title: 'productionplanning.producttemplate.entityProductDescription',
					columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}]
				},

				actions: {
					delete: {},
					create: 'flat'
				}
			}
		};

		/* jshint -W003 */
		var serviceContainer = platformDataServiceFactory.createNewComplete(productDescriptionServiceInfo);

		referenceActionExtension.addReferenceActions(serviceContainer, {
			createReference: true,
			deleteReference: true,
			referenceForeignKeyProperty: 'EngTaskFk',
			canCreateReference: function () {
				var engtask = parentService.getSelected();
				return engtask && engtask.EngDrawingFk !== null;
			}
		});

		//set config of serviceContainer.service
		serviceContainer.service.dialogConfig = {
			needReloadData: true,
			headerText: $translate.instant('productionplanning.producttemplate.productDescriptionListTitle'),
			listGridID: '41fdb4d4daa843cdaa0d1a58dfe62b13',
			listServiceName: 'productionplanningEngineeringProductDescriptionDialogDataService',
			listColumnsServiceName: 'productionplanningEngineeringProductDescriptionDialogListColumns',
			isShowTreeview: false
		};

		serviceContainer.service.ok = function ok(selectedItems) {
			if (!_.isEmpty(selectedItems)) {
				var items = _.sortBy(selectedItems, 'Id');
				//remove repeated item
				_.forEach(serviceContainer.service.getList(), function (item) {
					_.remove(items, {'Id': item.Id});
				});

				var task = serviceContainer.data.parentService.getSelected();
				_.each(items, function (item) {
					if (item.Id !== null && item.Id !== undefined) {
						item.EngTaskFk = task.Id;
						serviceContainer.data.onCreateSucceeded(item, serviceContainer.data);
					}
				});
			}
		};

		serviceContainer.service.showReferencesSelectionDialog = function () {
			dialogDataService.showTreeview(serviceContainer);
		};

		serviceContainer.service.createItemByCode = function (code, uomFK, materialFk) {
			var deffered = $q.defer();
			var selected = parentService.getSelected();
			if (selected) {
				//check whether already exist the code
				var shownItem = _.find(serviceContainer.service.getList(), {Code: code});
				if (!shownItem) {
					var productDescDataService = $injector.get('productionplanningEngineeringProductDescriptionDialogDataService');
					productDescDataService.loadAllItems().then(function (allItems) {
						var existingItem = _.find(allItems, {Code: code});
						if (!existingItem) {
							$http.post(globals.webApiBaseUrl + 'productionplanning/item/description/create', {
								mainItemId: selected.PpsItemFk
							}).then(function (response) {
									var newItem = response.data;
									newItem.Code = code;
									newItem.EngTaskFk = selected.Id;
									newItem.MaterialFk = materialFk;
									newItem.UomFk = uomFK;
									serviceContainer.data.unloadSubEntities(serviceContainer.data);
									serviceContainer.data.selectedItem = newItem;
									serviceContainer.data.onCreateSucceeded(newItem, serviceContainer.data);
									deffered.resolve(newItem);
								}
							);
						}
						else {
							existingItem.MaterialFk = materialFk;
							existingItem.UomFk = uomFK;
							serviceContainer.data.unloadSubEntities(serviceContainer.data);
							serviceContainer.data.selectedItem = existingItem;
							serviceContainer.data.onCreateSucceeded(existingItem, serviceContainer.data);
							deffered.resolve(existingItem);
						}
					});
				}
				else {
					shownItem.MaterialFk = materialFk;
					shownItem.UomFk = uomFK;
					serviceContainer.service.updateLoadedItem(shownItem);
					serviceContainer.data.selectedItem = shownItem;
					serviceContainer.data.selectionChanged.fire(null, shownItem);
					deffered.resolve(shownItem);
				}
			}

			return deffered.promise;
		};

		basicsCommonBaseDataServiceBasicExtension.addBasics(serviceContainer);

		return serviceContainer.service;
	}
})(angular);
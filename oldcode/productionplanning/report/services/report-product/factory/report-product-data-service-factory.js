/**
 * Created by anl on 4/2/2018.
 */

(function (angular) {
	'use strict';

	var module = 'productionplanning.report';

	angular.module(module).service('productionplanningReportProductDataServiceFactory', ReportProductDataService);

	ReportProductDataService.$inject = ['basicsLookupdataLookupDescriptorService', '_',
		'platformDataServiceFactory',
		'platformDataServiceModificationTrackingExtension',
		'platformModalService',
		'productionplanningCommonProductStatusLookupService',
		'PlatformMessenger',
		'platformDataServiceProcessDatesBySchemeExtension',
		'productionplanningProductDocumentDataProviderFactory'];

	function ReportProductDataService(
		basicsLookupdataLookupDescriptorService, _,
		platformDataServiceFactory,
		platformDataServiceModificationTrackingExtension,
		platformModalService,
		productStatusLookupService,
		PlatformMessenger,
		platformDataServiceProcessDatesBySchemeExtension,
		productDocumentDataProviderFactory) {

		var serviceCache = {};
		var self = this;

		//get service or create service by data-service name
		this.getService = function (templInfo, parentService, dialogConfig) {
			var dsName = self.getDataServiceName(templInfo);

			var srv = serviceCache[dsName];
			if (_.isNull(srv) || _.isUndefined(srv)) {
				srv = self.doCreateDataService(dsName, templInfo.moduleName, parentService, dialogConfig);
				serviceCache[dsName] = srv;
			}
			return srv;
		};

		this.getDataServiceName = function (templInfo) {
			return _.camelCase(templInfo.moduleName) + 'ReportProductDataService';
		};

		this.doCreateDataService = function (serviceName, moduleName, parentService) {

			var dateProcessor = platformDataServiceProcessDatesBySchemeExtension.createProcessor(
				{
					typeName: 'ProductDto',
					moduleSubModule: 'ProductionPlanning.Common'
				}
			);

			var serviceOption = {
				flatNodeItem: {
					module: angular.module(moduleName),
					serviceName: serviceName,
					entityNameTranslationID: 'productionplanning.report.entityReport2Product',
					httpCRUD: {
						route: globals.webApiBaseUrl + 'productionplanning/report/report2product/',
						endRead: 'list'
					},
					entityRole: {
						node: {
							itemName: 'Report2Product',
							parentService: parentService,
							parentFilter: 'ReportFk'
						}
					},
					dataProcessor: [dateProcessor],
					presenter: {
						list: {
							incorporateDataRead: function (readData, data) {

								basicsLookupdataLookupDescriptorService.attachData(readData);
								var result = readData.Main ? {
									FilterResult: readData.FilterResult,
									dtos: readData.Main || []
								} : readData;

								return serviceContainer.data.handleReadSucceeded(result, data);
							}
						}
					}
				}
			};

			/* jshint -W003 */
			var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
			var service = serviceContainer.service;

			angular.extend(serviceContainer.data, {
				markItemAsModified: markItemAsModified
			});

			var addedProduct = [];

			function markItemAsModified(entity) {
				addedProduct.push(entity);
				platformDataServiceModificationTrackingExtension.markAsModified(service, entity, serviceContainer.data);
			}

			service.clearAddedProduct = function clearAddedProduct() {
				addedProduct = [];
			};

			service.getAddedProduct = function getAddedProduct() {
				return addedProduct;
			};

			service.canCreateRef = function () {
				var hlp = parentService.getSelected() && !parentService.isSelectedItemApproved();
				return _.isNil(hlp) ? false : hlp;
			};

			service.canDeleteRef = function () {
				var hlp = serviceContainer.service.getSelected() && parentService.getSelected() && !parentService.isSelectedItemApproved();
				return _.isNil(hlp) ? false : hlp;
			};

			parentService.registerListLoaded(function () {
				service.clearAddedProduct();
			});

			service.assignedProduct = function () {
				productStatusLookupService.load().then(function () {
					var selected = parentService.getSelected();
					var act = basicsLookupdataLookupDescriptorService.getLookupItem('MntActivity', selected.ActivityFk);
					var options = {
						beforeInit: function (option) {
							var originalDefaultFilterfn = option.defaultFilter;
							option.defaultFilter = function (request) {
								option.dataService.setSelectedFilter('IgnoredIds', _.map(service.getList(), 'Id'));//set a fixed filter
								originalDefaultFilterfn(request);
								//set some additional default filters
								request.ProjectId = selected.ProjectId === 0 ? null : selected.ProjectId;
								request.JobId = act.LgmJobFk === null ? '' : act.LgmJobFk;
								return request;
							};
							var statusRow = _.find(option.detailConfig.rows, {model: 'Status'});
							if (statusRow && statusRow.dropboxOptions) {
								statusRow.dropboxOptions.items = productStatusLookupService.getIsShippedProductStatus();
							}
						},
						afterInit: function (scope) {//deal with the selected items after close dialog
							scope.onSelectedItemsChanged = new PlatformMessenger();
							scope.onSelectedItemsChanged.register(function (e, args) {
								service.handleAssignedProducts(args.selectedItems);
							});
						}
					};
					var modalCreateConfig = {
						resizeable: true,
						width: '60%',
						templateUrl: globals.appBaseUrl + 'basics.lookupdata/partials/lookup-filter-dialog-form-grid.html',
						controller: 'productionplanningCommonProductLookupNewController',
						resolve: {
							'$options': function () {
								return options;
							}
						}
					};
					platformModalService.showDialog(modalCreateConfig);
				});
			};

			service.handleAssignedProducts = function (selectedProducts) {
				if (!_.isEmpty(selectedProducts)) {
					var items = _.sortBy(selectedProducts, 'Id');
					_.forEach(serviceContainer.service.getList(), function (item) {
						_.remove(items, {'Id': item.Id});
					});
					var mainItemId = serviceContainer.data.parentService.getSelected().Id;
					_.each(items, function (item) {
						var report2product = {
							mainItemId: mainItemId,
							Id: item.Id
						};
						serviceContainer.data.doCallHTTPCreate(report2product, serviceContainer.data, serviceContainer.data.onCreateSucceeded);
					});

				}
			};

			service.appendItems = function (products) {
				if (_.isArray(products)) {
					_.each(products, function (product) {
						if (!_.some(serviceContainer.data.itemList, {Id: product.Id})) {
							serviceContainer.data.itemList.push(product);
						}
					});
				}
			};

			const documentDataProvider = productDocumentDataProviderFactory.create(service, true);
			_.extend(service, documentDataProvider);

			return service;
		};
	}
})(angular);
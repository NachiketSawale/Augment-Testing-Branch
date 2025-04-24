(function () {
	'use strict';

	angular.module('platform').service('platformPlanningBoardServiceFactoryProviderService', PlatformPlanningBoardServiceFactoryProviderService);
	PlatformPlanningBoardServiceFactoryProviderService.$inject = ['_', 'platformDataServiceProcessDatesBySchemeExtension', 'platformDataServiceFactory', 'platformDataServiceDataProcessorExtension'];

	function PlatformPlanningBoardServiceFactoryProviderService(_, platformDataServiceProcessDatesBySchemeExtension, platformDataServiceFactory, platformDataServiceDataProcessorExtension) {
		var self = this;

		this.createFactory = function createFactory(options) {
			return platformDataServiceFactory.createNewComplete(options);
		};

		this.createDateProcessor = function createDateProcessor(dto, mod) {
			return platformDataServiceProcessDatesBySchemeExtension.createProcessor({
				typeName: dto,
				moduleSubModule: mod
			});
		};

		this.createHttpOptions = function createHttpOptions(httpOptions) {
			return {
				route: globals.webApiBaseUrl + httpOptions.routePostFix,
				endRead: httpOptions.endRead,
				usePostForRead: httpOptions.usePostForRead
			};
		};

		this.validateOptions = function validateOptions(options) {
			if (_.isNil(options.http.initReadData)) {
				options.http.initReadData = options.baseSettings.initReadData;
			}
		};

		this.createSupplierCompleteOptions = function createSupplierCompleteOptions(settings) {
			self.validateOptions(settings);

			if (settings.baseSettings.parentService) {
				return self.createSupplierNodeBaseOptions(settings);
			}

			return self.createSupplierRootBaseOptions(settings);
		};

		this.createDemandCompleteOptions = function createDemandCompleteOptions(settings) {
			self.validateOptions(settings);

			var options = self.createBaseOptions(settings, !settings.baseSettings.parentService);

			if (settings.baseSettings.parentService) {
				options.flatNodeItem.entityRole.node.parentService = settings.baseSettings.parentService;
				options.flatNodeItem.entitySelection = {supportsMultiSelection: false};
			} else {
				options.flatRootItem.entitySelection = {supportsMultiSelection: false};
			}

			return options;
		};

		this.createBaseOptions = function createBaseOptions(settings, isRoot) {
			var options = {};

			var innerNode = {
				module: settings.module,
				serviceName: settings.baseSettings.serviceName,
				entityNameTranslationID: settings.translationId,
				httpCRUD: settings.http,
				dataProcessor: settings.processor,
				presenter: {
					list: {
						incorporateDataRead: function (readData, data) {
							data.itemList.length = 0;
							_.forEach(readData, function (entity) {
								data.itemList.push(entity);
							});

							platformDataServiceDataProcessorExtension.doProcessData(data.itemList, data);

							data.listLoaded.fire(readData);
						}
					}
				},
				entityRole: {}
			};

			if (!_.isNil(settings.translation)) {
				innerNode.translation = settings.translation;
			}

			if (isRoot) {
				options.flatRootItem = innerNode;
				options.flatRootItem.entityRole.root = settings.role;
			} else {
				options.flatNodeItem = innerNode;
				options.flatNodeItem.entityRole.node = settings.role;
			}

			return options;
		};

		this.createSupplierRootBaseOptions = function createSupplierRootBaseOptions(settings) {
			var options = self.createBaseOptions(settings, true);
			options.flatRootItem.entitySelection = true;

			return options;
		};

		this.createSupplierNodeBaseOptions = function createSupplierNodeBaseOptions(settings) {
			var nodeOptions = self.createBaseOptions(settings, false);
			nodeOptions.flatNodeItem.entitySelection = {supportsMultiSelection: false};
			nodeOptions.flatNodeItem.entityRole.node.parentService = settings.baseSettings.parentService;

			return nodeOptions;
		};

	}
})(angular);
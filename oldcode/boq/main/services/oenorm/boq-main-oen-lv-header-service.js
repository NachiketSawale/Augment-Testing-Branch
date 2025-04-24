(function () {
	/* global globals, Platform, _ */
	'use strict';
	var moduleName = 'boq.main';
	var boqMainModule = angular.module(moduleName);

	/**
	 * @ngdoc service
	 * @name boqMainOenLvHeaderControllerService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenLvHeaderControllerService', ['platformDetailControllerService', 'boqMainOenService', 'boqMainOenLvHeaderDataService', 'boqMainOenLvHeaderUiService', 'boqMainTranslationService', 'boqMainOenLvHeaderValidationServiceProvider', '$injector',
		function(platformDetailControllerService, boqMainOenService, boqMainOenLvHeaderDataService, boqMainOenLvHeaderUiService, boqMainTranslationService, boqMainOenLvHeaderValidationServiceProvider, $injector) {
			return {
				getInstance: function(scope, boqMainService) {
					var dataService       = boqMainOenLvHeaderDataService.getInstance(boqMainService);
					var validationService = boqMainOenLvHeaderValidationServiceProvider.getInstance(dataService);
					platformDetailControllerService.initDetailController(scope, dataService, validationService, boqMainOenLvHeaderUiService, boqMainTranslationService);

					let unregisterListener = $injector.get('$rootScope').$on('containerFocusChanged', function() {
						if ($injector.get('mainViewService').activeContainer() === scope.getContainerUUID()) {
							dataService.containerFocusChanged.fire(dataService);
						}
					});

					var originDirty = scope.formOptions.configure.dirty;
					scope.formOptions.configure.dirty = function(lvHeader, propertyName, options) {
						dataService.propertyChanged(lvHeader, propertyName);
						originDirty(lvHeader, propertyName, options);
					};

					scope.$on('$destroy', function () {
						unregisterListener();
					});

					boqMainOenService.tryDisableContainer(scope, boqMainService, false, true);
				}
			};
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenLvHeaderDataService
	 * @function
	 * @description
	 */
	boqMainModule.factory('boqMainOenLvHeaderDataService', ['platformDataServiceFactory', 'platformRuntimeDataService', 'platformDataServiceDataProcessorExtension', 'ServiceDataProcessDatesExtension',
		function(platformDataServiceFactory, platformRuntimeDataService, platformDataServiceDataProcessorExtension, ServiceDataProcessDatesExtension) {
			return {
				getInstance: function(boqMainService) {
					var serviceContainer;
					var service;

					service = _.find(boqMainService.getChildServices(), function(childService) { return 'boqMainOenLvHeaderDataService'===childService.getServiceName(); });
					if (service) {
						return service;
					}

					var serviceOption = {
						flatNodeItem: {
							module: boqMainModule,
							serviceName: 'boqMainOenLvHeaderDataService',
							entityRole: {node: {itemName: 'OenLvHeader', parentService: boqMainService}},
							httpRead: {
								route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/', endRead: 'lvheader',
								initReadData: function(readData) {
									// LV header is referenced to the BOQ header which is not contained in the parent UI container. The root BOQ item is used as proxy.
									var currentBoqItem = boqMainService.getSelected();
									readData.filter = '?boqHeaderId=' + (currentBoqItem===boqMainService.getRootBoqItem() ? currentBoqItem.BoqHeaderFk : -1);
								}
							},
							dataProcessor: [
								new ServiceDataProcessDatesExtension(['ProcessingStatusDate','PriceBaseDate','OfferDeadline']),
								{
									processItem: function(lvHeader) {
										const isBoqNotEmpty = 1<boqMainService.getList().length;
										platformRuntimeDataService.readonly(lvHeader, [
											{ field:'IsWithPriceShares',    readonly:isBoqNotEmpty },
											{ field:'NamePriceShare1',      readonly:isBoqNotEmpty || !lvHeader.IsWithPriceShares },
											{ field:'NamePriceShare2',      readonly:isBoqNotEmpty || !lvHeader.IsWithPriceShares },
											{ field:'IsSumDiscount',        readonly:isBoqNotEmpty || !lvHeader.IsWithPriceShares },
											{ field:'IsAllowedBoqDiscount', readonly:isBoqNotEmpty },
											{ field:'IsAllowedHgDiscount',  readonly:isBoqNotEmpty },
											{ field:'IsAllowedOgDiscount',  readonly:isBoqNotEmpty },
											{ field:'IsAllowedLgDiscount',  readonly:isBoqNotEmpty },
											{ field:'IsAllowedUlgDiscount', readonly:isBoqNotEmpty }
										]);

										platformRuntimeDataService.readonly(lvHeader, [{field:'OenLvTypeFk', readonly:true }]); // Readonly because of unclear requirement
									}
								}
							],
							presenter: {
								list: {
									// if this function is triggered after a service call 'responseData' is a single item, after getting the data from cache it is a list
									incorporateDataRead: function (responseData, data) {
										if (!_.isArray(responseData)) {
											responseData = [responseData];
										}
										return data.handleReadSucceeded(responseData, data); // the service of this UI container always expects a list
									}
								}
							},
							actions: { delete:false, create:false }
						}
					};

					serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
					service = serviceContainer.service;

					service.containerFocusChanged = new Platform.Messenger();

					service.registerListLoaded(function() {
						if (_.isArray(service.getList())) {
							service.setSelected(service.getList()[0]);
						}
					});

					service.propertyChanged = function(changedLvHeader, propertyName) {
						if (propertyName==='IsWithPriceShares' && !changedLvHeader.IsWithPriceShares) {
							changedLvHeader.IsSumDiscount   = true;
							changedLvHeader.NamePriceShare1 = '';
							changedLvHeader.NamePriceShare2 = '';
						}
						platformDataServiceDataProcessorExtension.doProcessItem(changedLvHeader, serviceContainer.data);
					};

					return service;
				}};
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenLvHeaderUiService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).factory('boqMainOenLvHeaderUiService', ['$translate', 'platformUIStandardConfigService', 'platformUIStandardExtentService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainOenTranslationService', 'basicsLookupdataConfigGenerator',
		function($translate, platformUIStandardConfigService, platformUIStandardExtentService, platformSchemaService, boqMainTranslationService, boqMainOenTranslationService, basicsLookupdataConfigGenerator) {

			const gidPrefix = 'oen.uicontainer.lvHeader.';
			const gids = [gidPrefix+'groupDiscount'];

			function setMaxLength(length) {
				return {
					'detail': {
						'maxLength': length
					}
				};
			}

			var layout = {
				fid: 'boq.main.oen.LvHeader',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['oenlvtypefk', 'processingstatusdate', 'pricebasedate', 'offerdeadline', 'biddernr', 'alternativoffernr', 'changeoffernr', 'ordercode', 'additionaloffernr', 'contractadjustmentnr', 'iswithpriceshares', 'namepriceshare1', 'namepriceshare2']
					}
				],
				overloads: {
					oenlvtypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('boq.main.oenlvtypefk'),
					ordercode: setMaxLength(60),
					namepriceshare1: setMaxLength(10),
					namepriceshare2: setMaxLength(10)
				},
				addition: {detail: []}
			};

			function addRow(property) {
				var model = property;
				layout.addition.detail.push({
					'gid': gidPrefix + 'groupDiscount',
					'rid': model,
					'model': model,
					'label': $translate.instant('boq.main.oen.dto.OenLvHeaderDto.' + property),
					'type': 'boolean',
					'required': 'true'
				});
			}

			addRow('IsSumDiscount');
			addRow('IsAllowedBoqDiscount');
			addRow('IsAllowedHgDiscount');
			addRow('IsAllowedOgDiscount');
			addRow('IsAllowedLgDiscount');
			addRow('IsAllowedUlgDiscount');

			_.forEach(gids, function(gid) {
				layout.groups.push({'gid':gid});
			});

			var schema = platformSchemaService.getSchemaFromCache({typeName: 'OenLvHeaderDto',moduleSubModule: 'Boq.Main'});
			boqMainOenTranslationService.register(schema, gids);

			var service = new platformUIStandardConfigService(layout, schema.properties, boqMainTranslationService);
			platformUIStandardExtentService.extend(service, layout.addition, schema.properties);

			return service;

		}]);

	/**
	 * @ngdoc service
	 * @name boqMainOenLvHeaderValidationServiceProvider
	 * @description provides validation methods for boq main oen lv header entities
	 */
	angular.module(moduleName).factory('boqMainOenLvHeaderValidationServiceProvider', ['platformValidationServiceFactory',
		function(platformValidationServiceFactory) {

			var ValidationServiceProvider = function (oenLvHeaderService) {
				var self = this;
				var oenExtensionScheme = {typeName: 'OenLvHeaderDto', moduleSubModule: 'Boq.Main'};
				platformValidationServiceFactory.addValidationServiceInterface(oenExtensionScheme, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(oenExtensionScheme), uniques: []
				}, self, oenLvHeaderService);
			};

			var service = {};
			var latestCreatedValidationService = null;

			service.getInstance = function getInstance(oenLvHeaderService) {
				latestCreatedValidationService = new ValidationServiceProvider(oenLvHeaderService);
				return latestCreatedValidationService;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};

			return service;
		}]);
})();


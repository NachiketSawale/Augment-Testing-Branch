(function () {
	/* global globals, Platform, _ */
	'use strict';
	const boqMainModule = angular.module('boq.main');
	const schema = { moduleSubModule:'Boq.Main', typeName:'OenLbMetadataDto' };

	boqMainModule.factory('boqMainOenLbMetadataControllerService', ['boqMainOenLbMetadataDataService', 'boqMainOenLbMetadataUiService', 'boqMainOenLbMetadataValidationService', 'boqMainOenService', 'boqMainTranslationService', 'platformDetailControllerService', '$injector',
		function(lbMetadataDataService, lbMetadataUiService, lbMetadataValidationService, boqMainOenService, boqMainTranslationService, platformDetailControllerService, $injector) {
			return {
				getInstance: function(scope, boqMainService) {
					var dataService       = lbMetadataDataService.getInstance(boqMainService);
					var validationService = lbMetadataValidationService.getInstance(dataService);
					platformDetailControllerService.initDetailController(scope, dataService, validationService, lbMetadataUiService, boqMainTranslationService);

					let unregisterListener = $injector.get('$rootScope').$on('containerFocusChanged', function() {
						if ($injector.get('mainViewService').activeContainer() === scope.getContainerUUID()) {
							dataService.containerFocusChanged.fire(dataService);
						}
					});

					scope.$on('$destroy', function () {
						unregisterListener();
					});

					boqMainOenService.tryDisableContainer(scope, boqMainService, false);
				}
			};
		}
	]);

	boqMainModule.factory('boqMainOenLbMetadataDataService', ['platformDataServiceFactory', 'platformRuntimeDataService', 'ServiceDataProcessDatesExtension', 'basicsCommonMandatoryProcessor', 'boqMainOenLbMetadataValidationService',
		function (platformDataServiceFactory, platformRuntimeDataService, ServiceDataProcessDatesExtension, basicsCommonMandatoryProcessor, validationService) {
			return {
				getInstance: function(boqMainService) {
					var service;
					var serviceContainer;

					service = _.find(boqMainService.getChildServices(), function(childService) { return 'boqMainOenLbMetadataDataService'===childService.getServiceName(); });
					if (service) {
						return service;
					}

					const baseUrl = globals.webApiBaseUrl + 'boq/main/oen/lbmetadata/';

					var serviceOption = {
						flatNodeItem: {
							module: boqMainModule,
							serviceName: 'boqMainOenLbMetadataDataService',
							entityRole: { node: { itemName: 'OenLbMetadata', parentService: boqMainService } },
							httpCreate: {route: baseUrl, endCreate: 'create'},
							httpRead: {
								route: baseUrl, endRead: 'list',
								initReadData: function(readData) {
									var currentBoqItem = boqMainService.getSelected();
									readData.filter = '?boqHeaderId='+currentBoqItem.BoqHeaderFk + '&boqItemId='+currentBoqItem.Id;
								}
							},
							dataProcessor: [new ServiceDataProcessDatesExtension(['VersionDate'])],
							actions: {
								delete: true,
								canDeleteCallBackFunc: function() {
									return boqMainService.isWicBoq();
								},
								create: 'flat',
								canCreateCallBackFunc: function() {
									return boqMainService.isWicBoq() && boqMainService.getSelected()===boqMainService.getRootBoqItem() && _.some(getRemainingTypes());
								}
							},
							presenter: {
								list: {
									initCreationData: function(creationData) {
										creationData.BoqItemId   = boqMainService.getSelected().Id;
										creationData.BoqHeaderId = boqMainService.getSelected().BoqHeaderFk;
										creationData.Type        = Math.min(...getRemainingTypes());
										return creationData;
									}
								}
							},
						}
					};

					serviceContainer = platformDataServiceFactory.createNewComplete(serviceOption);
					service = serviceContainer.service;

					service.containerFocusChanged = new Platform.Messenger();

					serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create(_.assignIn({'mustValidateFields':true, 'validationService':validationService.getInstance(service)}, schema));

					service.registerListLoaded(function () {
						if (_.isArray(service.getList())) {
							service.setSelected(service.getList()[0]);
						}

						// Only in a WIC BOQ the fields are editable
						if (!boqMainService.isWicBoq()) {
							_.forEach(service.getList(), function(lbMetadataItem) {
								platformRuntimeDataService.readonly(lbMetadataItem, true);
							});
						}
					});

					function getRemainingTypes() {
						var types = [1, 2, 3, 4];
						var existingTypes = [];
						_.forEach(service.getList(), function (type) {
							existingTypes.push(type.Type);
						});
						return types.filter(type => !existingTypes.includes(type));
					}

					return service;
				}
			};
		}
	]);

	boqMainModule.factory('boqMainOenLbMetadataUiService', ['platformUIStandardConfigService', 'platformSchemaService', 'boqMainTranslationService', 'boqMainOenTranslationService', 'basicsLookupdataConfigGenerator',
		function (platformUIStandardConfigService, platformSchemaService, boqMainTranslationService, boqMainOenTranslationService, basicsLookupdataConfigGenerator) {

			function setMaxLength(length) {
				return {
					'detail': {
						'maxLength': length
					}
				};
			}

			const layout = {
				fid: 'boq.main.oen.LbMetadata',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						gid: 'basicData',
						attributes: ['type', 'code', 'oenreleasestatusfk', 'description', 'versionnumber', 'versiondate', 'downloadurl', 'descriptionpartialedition']
					}
				],
				overloads: {
					oenreleasestatusfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('boq.main.oenreleasestatusfk'),
					type: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
						{
							dataServiceName: 'boqMainOenLbMetadataTypeLookupDataService',
							valMember: 'Id',
							dispMember: 'Code',
							gridLess: true,
							additionalColumns: false,
							readonly: true
						}),
					code: setMaxLength(10),
					description: setMaxLength(60),
					downloadurl: setMaxLength(1000),
					descriptionpartialedition: setMaxLength(60)
				}
			};

			var schema = platformSchemaService.getSchemaFromCache({typeName: 'OenLbMetadataDto', moduleSubModule: 'Boq.Main'});
			if (schema) {
				boqMainOenTranslationService.register(schema);
				schema = schema.properties;
				schema.AccessRightDescriptorName = {domain: 'description'};
			}

			return new platformUIStandardConfigService(layout, schema, boqMainTranslationService);
		}
	]);

	boqMainModule.factory('boqMainOenLbMetadataValidationService', ['platformValidationServiceFactory',
		function (platformValidationServiceFactory) {

			var ValidationServiceProvider = function(dataService) {
				var self = this;
				platformValidationServiceFactory.addValidationServiceInterface(schema, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(schema), uniques: []
				}, self, dataService);
			};

			var service = {};

			service.getInstance = function getInstance(dataService) {
				return new ValidationServiceProvider(dataService);
			};

			return service;
		}]);

	boqMainModule.factory('boqMainOenLbMetadataTypeLookupDataService', ['$q', '$translate', 'platformLookupDataServiceFactory',
		function ($q, $translate, platformLookupDataServiceFactory) {
			var codes = [$translate.instant('boq.main.oen.lbMetadataType.1'), $translate.instant('boq.main.oen.lbMetadataType.2'), $translate.instant('boq.main.oen.lbMetadataType.3'), $translate.instant('boq.main.oen.lbMetadataType.4')];
			var lookupTypes = [{Id: 1, Code: codes[0]}, {Id: 2, Code: codes[1]}, {Id: 3, Code: codes[2]}, {Id: 4, Code: codes[3]}];
			var service = platformLookupDataServiceFactory.createInstance({}).service;

			service.getLookupData = function () {
				return $q.when(_.filter(lookupTypes, function (type) {
					return type.Id !== type.none;
				}));
			};

			service.getItemById = function (id) {
				return _.find(lookupTypes, ['Id', id]);
			};

			service.getItemByIdAsync = function (id) {
				return $q.when(service.getItemById(id));
			};

			return service;
		}
	]);
})();


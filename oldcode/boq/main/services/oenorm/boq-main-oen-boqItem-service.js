/**
 * Created by bh on 27.04.2022.
 */

(function () {
	/* global globals, _ */
	'use strict';
	var moduleName = 'boq.main';

	/**
	 * @ngdoc service
	 * @name boqMainOenBoqItemFormControllerService
	 * @description
	 * boqMainOenBoqItemFormControllerService is the service to initialize the mentioned controller.
	 */
	angular.module(moduleName).factory('boqMainOenBoqItemFormControllerService', [ 'platformDetailControllerService', 'boqMainOenBoqItemValidationService', 'boqMainOenBoqItemUIService', 'boqMainTranslationService', 'boqMainCommonService', 'boqMainChangeService', 'boqMainOenService',
		function (platformDetailControllerService, boqMainOenBoqItemValidationService, boqMainOenBoqItemUIService, boqMainTranslationService, boqMainCommonService, boqMainChangeService, boqMainOenService) {

			var service = {};

			/**
			 * @ngdoc function
			 * @name createDetailController
			 * @function
			 * @methodOf boqMainOenBoqItemFormControllerService
			 * @description This function handles the creation of the boq oen boq item detail form controller in whose context it is called
			 */
			/* jshint -W072 */ // many parameters because of dependency injection
			service.createDetailController = function initDetailFormController(scope, boqMainService) {
				var boqMainOenExtensionValidationService = boqMainOenBoqItemValidationService.getInstance(boqMainService);
				var boqMainOenBoqItemUIServiceInstance = boqMainOenBoqItemUIService.createUIService({currentBoqMainService: boqMainService});
				boqMainOenBoqItemUIService.isDynamicReadonlyConfig = true;
				platformDetailControllerService.initDetailController(scope, boqMainService, boqMainOenExtensionValidationService, boqMainOenBoqItemUIServiceInstance, boqMainTranslationService);

				// ******************************************************
				// * Currently the container is completely set readonly *
				// ******************************************************
				// var platformPermissionService = $injector.get('platformPermissionService');
				// var permissions = $injector.get('permissions');
				// platformPermissionService.restrict('95dc49fc17594890b33e094fe444c7ae', permissions.read);

				// By giving the dirty funtion a new body we have the chance to react on changes of the properties displayed in the detail form.
				// By calling the oldDirty implementation we ensure that the old behavior of dirty still works.
				var oldDirty = scope.formOptions.configure.dirty;

				scope.formOptions.configure.dirty = function dirty(entity, field, options) {
					boqMainChangeService.reactOnChangeOfBoqItem(entity, field, boqMainService, boqMainCommonService);

					if (oldDirty) {
						oldDirty(entity, field, options);
					}
				};

				boqMainOenService.tryDisableContainer(scope, boqMainService, false);

				// Remove the create/delete buttons in this container
				scope.formContainerOptions.createBtnConfig = null;
				scope.formContainerOptions.createChildBtnConfig = null;
				scope.formContainerOptions.deleteBtnConfig = null;

				// unregister subscription
				scope.$on('$destroy', function () {

				});
			};

			return service;
		}]);

	/**
	 * @ngdoc service
	 * @name boqMainOenBoqItemConfigService
	 * @description
	 */
	angular.module(moduleName).factory('boqMainOenBoqItemConfigService', ['_', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'boqMainOenTranslationService', 'boqMainOenLvHeaderLookupService',
		function (_, platformLayoutHelperService, basicsLookupdataConfigGenerator, platformSchemaService, boqMainOenTranslationService, boqMainOenLvHeaderLookupService) {

			var service = {};
			var _fields = [
				'oenstatusfk',
				'originmark',
				'oenzzfk',
				'oenzzvariantfk',
				'preliminarymark',
				'isessentialposition',
				'guaranteedoffersumgroup',
				'partoffermark',
				'oenservicepartfk',
				'partsummark',
				'isnotoffered',
				'itemtotalurb1',
				'itemtotalurb1oc',
				'itemtotalurb2',
				'itemtotalurb2oc',
				'discountpercentiturb1',
				'discountpercentiturb2',
				'discounturb1',
				'discounturb1oc',
				'discounturb2',
				'discounturb2oc',
				'finalpriceurb1',
				'finalpriceurb1oc',
				'finalpriceurb2',
				'finalpriceurb2oc',
				'oenpricingmethodfk',
				'lbchangeversionnumber',
				'oenlbchangetypefk',
				'lbreferenceprev',
				'lbnotinpartialedition'
			];

			var boqItemSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'OenBoqItemDto',
				moduleSubModule: 'Boq.Main'
			});

			boqMainOenTranslationService.register(boqItemSchema);

			function setMaxLength(length) {
				return {
					'detail': {
						'maxLength': length
					}
				};
			}

			service.getOverload = function getOverload(overload) {
				var ovl = null;

				switch (overload) {
					case 'oenstatusfk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('boq.main.oenstatus', 'Description');
						break;
					case 'originmark':
					case 'preliminarymark':
					case 'guaranteedoffersumgroup':
						ovl = setMaxLength(1);
						break;
					case 'lbreferenceprev':
						ovl = setMaxLength(252);
						break;
					case 'oenzzfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'boqMainOenZzLookupService',
							isComposite: true,
							showClearButton: true,
							filter: function(/* item */) {
								var oenLvHeader = boqMainOenLvHeaderLookupService.getOenLvHeader();
								return _.isObject(oenLvHeader) ? oenLvHeader.Id : -1;
							}
						});
						break;
					case 'oenzzvariantfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'boqMainOenZzVariantLookupService',
							isComposite: true,
							showClearButton: true,
							filter: function(item) {
								return _.isObject(item) ? item.OenZzFk : -1;
							}
						});
						break;
					case 'oenservicepartfk':
						ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'boqMainOenServicePartLookupService',
							isComposite: true,
							showClearButton: true,
							filter: function(/* item */) {
								var oenLvHeader = boqMainOenLvHeaderLookupService.getOenLvHeader();
								return _.isObject(oenLvHeader) ? oenLvHeader.Id : -1;
							}
						});
						break;
					case 'oenpricingmethodfk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('boq.main.oenpricingmethod', 'Description');
						break;
					case 'oenlbchangetypefk':
						ovl = basicsLookupdataConfigGenerator.provideGenericLookupConfig('boq.main.oenchangetype', 'Description');
						break;
					/*
					 case 'customerfk': ovl = getCustomerOverload(); break;

						case 'subsidiaryfk':
							ovl = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'businessPartnerMainSubsidiaryLookupDataService',
							additionalColumns: false,
							enableCache: true,
							filter: function (item) {
								if (item) {
									return item.BusinesspartnerFk != null  ? item.BusinesspartnerFk: 0;
								}

								return 0;
							}});

							break;
					 */
				}

				return ovl;
			};

			var _listOfFields = null;
			service.getListOfFields = function getListOfFields() {
				var fieldList = null;
				if (_listOfFields === null) {   // populate cached list
					_listOfFields = [];

					_.each(Object.getOwnPropertyNames(boqItemSchema.properties), function (prop) { // jshint ignore:line
						var ix = _fields.indexOf(prop.toLowerCase());
						if (ix !== -1) {
							_listOfFields[ix] = prop;
						}
					});
				}

				fieldList = angular.copy(_listOfFields);

				return fieldList;
			};

			service.getOenExtensionConfig = function () { // options holds the current boq main service if needed
				var res = platformLayoutHelperService.getSimpleBaseLayout('1.0.0', 'boq.main.oenExtension', _fields);

				res.overloads = platformLayoutHelperService.getOverloads(
					[
						'oenstatusfk',
						'originmark',
						'preliminarymark',
						'guaranteedoffersumgroup',
						'lbreferenceprev',
						'oenzzfk',
						'oenzzvariantfk',
						'oenservicepartfk',
						'oenpricingmethodfk',
						'oenlbchangetypefk'
					], service);

				return res;
			};

			return service;
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenBoqItemUIService
	 * @description
	 * This service provides standard layouts for different containers of the module
	 */
	angular.module(moduleName).service('boqMainOenBoqItemUIService', [
		'boqMainTranslationService',
		'boqMainOenBoqItemConfigService',
		'platformUIConfigInitService',
		function (translationService,
			layoutService,
			platformUIConfigInitService) {

			var serviceFactory = {};

			serviceFactory.createUIService = function(options) {
				var newCreatedUIService = {};
				platformUIConfigInitService.createUIConfigurationService({
					service: newCreatedUIService,
					layout: layoutService.getOenExtensionConfig(options),
					dtoSchemeId: { typeName: 'OenBoqItemDto', moduleSubModule: 'Boq.Main'},
					translator: translationService
				});

				return newCreatedUIService;
			};

			return serviceFactory;
		}
	]);

	/**
	 * @ngdoc service
	 * @name boqMainOenBoqItemValidationService
	 * @description provides validation methods for boq main oen extension boq item entities
	 */
	angular.module(moduleName).factory('boqMainOenBoqItemValidationService', ['platformValidationServiceFactory',
		function (platformValidationServiceFactory) {

			var ValidationServiceProvider = function (boqMainService) {
				var self = this;
				var oenExtensionScheme = {typeName: 'OenBoqItemDto', moduleSubModule: 'Boq.Main'};
				platformValidationServiceFactory.addValidationServiceInterface(oenExtensionScheme, {
					mandatory: platformValidationServiceFactory.determineMandatoryProperties(oenExtensionScheme), uniques: []
				}, self, boqMainService);
			};

			var service = {};
			var latestCreatedValidationService = null;

			service.getInstance = function getInstance(boqMainService) {
				latestCreatedValidationService = new ValidationServiceProvider(boqMainService);
				return latestCreatedValidationService;
			};

			service.getLatestCreatedValidationService = function getLatestCreatedValidationService() {
				return latestCreatedValidationService;
			};

			return service;
		}]);

	/**
	 * @ngdoc service
	 * @name boqMainOenLvHeaderLookupService
	 * @description Provides a lookup service currently for the sole purpose to have quick access from the loaded boq (or boq header) to the related oen lv header
	 */
	angular.module(moduleName).factory('boqMainOenLvHeaderLookupService', ['platformLookupDataServiceFactory', 'platformDataServiceDataProcessorExtension',
		function (platformLookupDataServiceFactory, platformDataServiceDataProcessorExtension) {

			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/',
					endPointRead: 'lvheader'
				},
				filterParam: 'boqHeaderId'
			};

			var container = platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig);

			container.service.loadLookupData = function loadLookupData(data) {
				return container.service.getList(container.options).then(function() {
					var flatBoqItems = [];
					data.flatten(data.itemTree, flatBoqItems, data.treePresOpt.childProp);
					platformDataServiceDataProcessorExtension.doProcessData(flatBoqItems, data);
				});
			};

			container.service.getOenLvHeader = function getOenLvHeader() {
				let oenLvHeaderList = container.service.getListSync(container.options);
				return _.isArray(oenLvHeaderList) ? oenLvHeaderList[0] : null;
			};

			var originalHandleSuccessfulLoad = container.data.handleSuccessfulLoad;

			container.data.handleSuccessfulLoad = function handleSuccessfulLoad(loaded, data, key) {
				// This is just to make sure the returned entity is wrapped in an array for the base lookup functionality is based on having arrays as result set
				let missingArray = [];
				if(!_.isArray(loaded)) {
					missingArray.push(loaded);
				}

				loaded = _.isArray(loaded) ? loaded : missingArray;

				return originalHandleSuccessfulLoad(loaded, data, key);
			};

			return container.service;
		}]);

	/**
	 * @ngdoc service
	 * @name boqMainOenZzLookupService
	 * @description Provides a lookup service for the ZZ entity
	 */
	angular.module(moduleName).factory('boqMainOenZzLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqMainOenZzLookupService', {
				valMember: 'Id',
				dispMember: 'Nr',
				columns: [
					{
						id: 'Nr',
						field: 'Nr',
						name: 'Nr',
						formatter: 'code',
						name$tr$: 'boq.main.oen.dto.OenZzDto.Nr'
					},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'boq.main.oen.dto.OenZzDto.Description'
					}
				],
				uuid: 'e2fdfc883ff64f63bccf2b0c71505a10',
				width: 500,
				height: 200
			});

			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/',
					endPointRead: 'listzz'
				},
				filterParam: 'lvHeaderId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}]);

	/**
	 * @ngdoc service
	 * @name boqMainOenZzVariantLookupService
	 * @description Provides a lookup service for the ZZ variant entity
	 */
	angular.module(moduleName).factory('boqMainOenZzVariantLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqMainOenZzVariantLookupService', {
				valMember: 'Id',
				dispMember: 'Nr',
				columns: [
					{
						id: 'Nr',
						field: 'Nr',
						name: 'Nr',
						formatter: 'code',
						name$tr$: 'boq.main.oen.dto.OenZzVariantDto.Nr'
					},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'boq.main.oen.dto.OenZzVariantDto.Description'
					}
				],
				uuid: '33ce7743fe7c4005b299d98a08d81820',
				width: 500,
				height: 200
			});

			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/',
					endPointRead: 'listzzvariant'
				},
				filterParam: 'zzId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}]);

	/**
	 * @ngdoc service
	 * @name boqMainOenServicePartLookupService
	 * @description Provides a lookup service for the service part entity
	 */
	angular.module(moduleName).factory('boqMainOenServicePartLookupService', ['platformLookupDataServiceFactory', 'basicsLookupdataConfigGenerator',
		function (platformLookupDataServiceFactory, basicsLookupdataConfigGenerator) {
			basicsLookupdataConfigGenerator.storeDataServiceDefaultSpec('boqMainOenServicePartLookupService', {
				valMember: 'Id',
				dispMember: 'Nr',
				columns: [
					{
						id: 'Nr',
						field: 'Nr',
						name: 'Nr',
						formatter: 'code',
						name$tr$: 'boq.main.oen.dto.OenServicePartDto.Nr'
					},
					{
						id: 'desc',
						field: 'Description',
						name: 'Description',
						formatter: 'description',
						name$tr$: 'boq.main.oen.dto.OenServicePartDto.Description'
					}
				],
				uuid: 'e2fdfc883ff64f63bccf2b0c71505a10',
				width: 500,
				height: 200
			});

			var lookupDataServiceConfig = {
				httpRead: {
					route: globals.webApiBaseUrl + 'boq/main/oen/lvheader/',
					endPointRead: 'listservicepart'
				},
				filterParam: 'lvHeaderId'
			};

			return platformLookupDataServiceFactory.createInstance(lookupDataServiceConfig).service;
		}]);
})();

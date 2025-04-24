/**
 * Created by waz on 1/26/2018.
 */
(function (angular) {
	/* global globals _ */
	'use strict';

	var moduleName = 'transportplanning.bundle';
	var BundleModul = angular.module(moduleName);

	BundleModul.factory('transportplanningBundleDataServiceContainerBuilder', TransportplanningBundleDataServiceContainerBuilder);
	TransportplanningBundleDataServiceContainerBuilder.$inject = [
		'$q',
		'$http',
		'$injector',
		'platformContextService',
		'basicsCommonBaseDataServiceBuilder',
		'basicsLookupdataLookupDescriptorService',
		'ServiceDataProcessDatesExtension',
		'productionplanningCommonDocumentDataServiceFactory',
		'basicsCommonMandatoryProcessor',
		'transportplanningBundleStatusValidationService',
		'transportplanningBundleDataProcessor',
		'transportplanningBundleValidationServiceFactory',
		'transportplanningBundleDocumentDataProviderFactory',
		'moment',
		'platformRuntimeDataService',
		'ppsCommonTransportInfoHelperService'];

	function TransportplanningBundleDataServiceContainerBuilder($q,
																$http,
																$injector,
																platformContextService,
																BaseDataServiceBuilder,
																basicsLookupdataLookupDescriptorService,
																ServiceDataProcessDatesExtension,
																documentDataServiceFactory,
																basicsCommonMandatoryProcessor,
																statusValidationService,
																dataProcessor,
																validationServiceFactory,
																documentDataProviderFactory,
																moment,
																platformRuntimeDataService,
																ppsCommonTransportInfoHelperService) {

		var Builder = function (mainOptionsType) {
			BaseDataServiceBuilder.call(this, mainOptionsType);
			initOptions(this);
		};

		Builder.prototype = Object.create(BaseDataServiceBuilder.prototype);

		Builder.prototype.onBuildStarted = function () {
			setDefaultTranslation(this);
		};

		Builder.prototype.setupServiceContainer = function (serviceContainer) {
			var service = serviceContainer.service;
			var documentDataProvider = documentDataProviderFactory.create(service);

			function updateProductInfo(bundlesProductIds) {
				$http.post(globals.webApiBaseUrl + 'transportplanning/bundle/bundle/calculateProductInfo', {
					BundlesProductIds: bundlesProductIds
				}).then(function (response) {
					var keys = _.map(_.keys(response.data), Number);
					_.forEach(serviceContainer.data.itemList, function (item) {
						if (_.includes(keys, item.Id)) {
							item.ProductCollectionInfo = response.data[item.Id];
						}
					});
					serviceContainer.service.gridRefresh();
				});
			}

			function isLoadingDeviceEmpty(item) {
				return item === null ||
					(!item.Description &&
						item.Quantity === null &&
						item.RequestedFrom === null &&
						item.RequestedTo === null &&
						item.UomFk === null &&
						item.TypeFk === null &&
						item.ResourceFk === null &&
						item.JobFk === null);
			}

			var validationService = this.validationService || validationServiceFactory.getService(service);
			serviceContainer.data.newEntityValidator = basicsCommonMandatoryProcessor.create({
				typeName: 'BundleDto',
				moduleSubModule: 'TransportPlanning.Bundle',
				validationService: validationService
			});

			service.updateProductInfo = updateProductInfo;
			_.extend(serviceContainer.data, statusValidationService);
			_.extend(serviceContainer.service, statusValidationService);
			_.extend(serviceContainer.service, documentDataProvider);

			ppsCommonTransportInfoHelperService.registerItemModified(serviceContainer, validationService);

			service.registerItemModified(function (e, item) {
				dataProcessor.processItem(item, serviceContainer.data);
				dataProcessor.setColumnReadOnly(item, 'TrsRequisitionFk', item.ProjectFk === null);


				// beacuse of framework validation problem,I need this LoadingDevice prop,
				// if you delete this code,when you create a new loading device,you will have some trouble in validation
				// for why I am doing this,you can check file `app/components/inputcontrols/control-validation.js`
				initLoadingDevice(item);

				if (!isLoadingDeviceEmpty(item.LoadingDevice) && !item.LoadingDevice.Id) {
					validationService = _.isObject(validationService) ? validationService : $injector.get(validationService);
					validationService.validateLoadingDevice$Quantity(item, item.LoadingDevice.Quantity, 'LoadingDevice.Quantity');
					validationService.validateLoadingDevice$RequestedFrom(item, item.LoadingDevice.RequestedFrom, 'LoadingDevice.RequestedFrom');
					validationService.validateLoadingDevice$RequestedTo(item, item.LoadingDevice.RequestedTo, 'LoadingDevice.RequestedTo');
					validationService.validateLoadingDevice$UomFk(item, item.LoadingDevice.UomFk, 'LoadingDevice.UomFk');
					validationService.validateLoadingDevice$TypeFk(item, item.LoadingDevice.TypeFk, 'LoadingDevice.TypeFk');
					// if job of LoadingDevice has no value, init it according to the default job from company trsconfig
					if ((item.LoadingDevice.JobFk === null || item.LoadingDevice.JobFk === 0) && item.DefaultJobFk !== null && item.DefaultJobFk !== 0) {
						item.LoadingDevice.JobFk = item.DefaultJobFk;
					}
					item.LoadingDevice.ProjectFk = item.ProjectFk;
					item.LoadingDevice.CompanyFk = platformContextService.getContext().clientId;
					validationService.validateLoadingDevice$JobFk(item, item.LoadingDevice.JobFk, 'LoadingDevice.JobFk');
				}

				// if the loading device is empty, we don't want this loading device save in the service-layer,
				// so we must set the empty loading device as null
				if (isLoadingDeviceEmpty(item.LoadingDevice)) {
					item.LoadingDevice = null;
				}
			});
		};

		function initLoadingDevice(item) {
			if (!item.LoadingDevice) {
				item.LoadingDevice = {};
			}
			item.LoadingDevice.Quantity = !_.isNil(item.LoadingDevice.Quantity) ? item.LoadingDevice.Quantity : null;
			item.LoadingDevice.RequestedFrom = !_.isNil(item.LoadingDevice.RequestedFrom) ? item.LoadingDevice.RequestedFrom : null;
			item.LoadingDevice.RequestedTo = !_.isNil(item.LoadingDevice.RequestedTo) ? item.LoadingDevice.RequestedTo : null;
			item.LoadingDevice.UomFk = !_.isNil(item.LoadingDevice.UomFk) ? item.LoadingDevice.UomFk : null;
			item.LoadingDevice.TypeFk = !_.isNil(item.LoadingDevice.TypeFk) ? item.LoadingDevice.TypeFk : null;
			item.LoadingDevice.ResourceFk = !_.isNil(item.LoadingDevice.ResourceFk) ? item.LoadingDevice.ResourceFk : null;
			item.LoadingDevice.JobFk = !_.isNil(item.LoadingDevice.JobFk) ? item.LoadingDevice.JobFk : null;
		}

		function initOptions(builder) {
			function setDefaultDataProcessor() {
				builder.serviceOptions[builder.mainOptionsType].dataProcessor = [
					dataProcessor,
					new ServiceDataProcessDatesExtension(['LoadingDevice.RequestedFrom', 'LoadingDevice.RequestedTo', 'ProductCollectionInfo.MaxProductionDate',
						'ProductCollectionInfo.MinProductionDate'])];
			}

			function setDefaultPresenter() {
				builder.serviceOptions[builder.mainOptionsType].presenter = {
					list: {
						incorporateDataRead: function incorporateDataRead(readData, data) {
							var result = readData.Main || readData.items ? assembleHttpResult(readData, builder.serviceContainer.service) : readData;
							return builder.serviceContainer.data.handleReadSucceeded(result, data);
						}
					}
				};
			}

			function assembleHttpResult(readData,service) {
				var result = {
					FilterResult: readData.FilterResult,
					dtos: readData.Main || readData.items || []
				};
				basicsLookupdataLookupDescriptorService.attachData(readData);
				_.forEach(result.dtos, function (dto) {
					initLoadingDevice(dto);
				});
				service.processTransportInfo(result.dtos);
				return result;
			}

			function setDefaultActions() {
				builder.serviceOptions[builder.mainOptionsType].actions = {
					create: 'flat',
					delete: {},
					canDeleteCallBackFunc: function (item) {
						if (!builder.serviceContainer.service.getSelected()) {
							return false;
						}

						var parentService = builder.serviceContainer.service.parentService();
						var isModifyable = builder.serviceContainer.service.isBundleModifyable(item);
						return _.isNil(parentService) ? parentService.getSelected() && isModifyable : isModifyable;
					}
				};
			}

			setDefaultDataProcessor();
			setDefaultPresenter();
			setDefaultActions();

			builder.initHttpResource();
		}

		Builder.prototype.initHttpResource = function () {
			this.serviceOptions[this.mainOptionsType].httpCRUD = {
				route: globals.webApiBaseUrl + 'transportplanning/bundle/bundle/'
			};
		};

		function setDefaultTranslation(builder) {
			builder.serviceOptions[builder.mainOptionsType].entityNameTranslationID = 'transportplanning.bundle.entityBundle';
			builder.serviceOptions[builder.mainOptionsType].translation = {
				uid: builder.serviceOptions[builder.mainOptionsType].serviceName,
				title: 'transportplanning.bundle.entityBundle',
				columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo'}],
				dtoScheme: {
					typeName: 'BundleDto',
					moduleSubModule: 'TransportPlanning.Bundle'
				}
			};
		}

		return Builder;
	}
})(angular);
/**
 * Created by chi on 4/20/2016.
 */
(function (angular) {
	'use strict';
	// eslint-disable-next-line no-redeclare
	/* global angular,globals,_ */

	var moduleName = 'businesspartner.main';
	angular.module(moduleName).factory('businesspartnerMainAgreementDataService', businesspartnerMainAgreementDataService);

	businesspartnerMainAgreementDataService.$inject = ['platformDataServiceFactory', 'ServiceDataProcessDatesExtension',
		'businesspartnerMainHeaderDataService', 'basicsLookupdataLookupDescriptorService',
		'basicsCommonServiceUploadExtension', 'businessPartnerHelper', 'platformRuntimeDataService', 'moment', '$http', 'PlatformMessenger',
		'businesspartnerStatusRightService', 'platformRuntimeDataService'];

	/* jshint -W072 */
	function businesspartnerMainAgreementDataService(platformDataServiceFactory, ServiceDataProcessDatesExtension,
		businesspartnerMainHeaderDataService, basicsLookupdataLookupDescriptorService,
		basicsCommonServiceUploadExtension, businessPartnerHelper, platformRuntimeDataService, moment, $http, PlatformMessenger,
		businesspartnerStatusRightService, runtimeDataService) {
		var serviceOptions = {
			flatLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'businesspartnerMainAgreementDataService',
				dataProcessor: [new ServiceDataProcessDatesExtension(['ReferenceDate', 'ValidFrom', 'ValidTo', 'DocumentDate'])],
				entityRole: {leaf: {itemName: 'Agreement', parentService: businesspartnerMainHeaderDataService}},
				httpCreate: {route: globals.webApiBaseUrl + 'businesspartner/main/agreement/', endCreate: 'create'},
				httpRead: {route: globals.webApiBaseUrl + 'businesspartner/main/agreement/', endRead: 'listByParent', usePostForRead: true, initReadData: initReadData},
				presenter: {list: {incorporateDataRead: incorporateDataRead, initCreationData: initCreationData}}
			}
		};

		var serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		initialize();

		serviceContainer.service.updateReadOnly = function updateReadOnly(entity) {
			runtimeDataService.readonly(entity, [{
				field: 'DocumentTypeFk',
				readonly: !!entity.FileArchiveDocFk
			}]);
		};

		var canCreate = serviceContainer.service.canCreate;
		serviceContainer.service.canCreate = function () {
			return canCreate() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
		};

		var canDelete = serviceContainer.service.canDelete;
		serviceContainer.service.canDelete = function () {
			return canDelete() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
		};

		var canUploadFiles = serviceContainer.service.basicCanUploadFiles;
		serviceContainer.service.canUploadFiles = function () {
			return canUploadFiles() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
		};

		var canMultipleUploadFiles = serviceContainer.service.basicCanMultipleUploadFiles;
		serviceContainer.service.canMultipleUploadFiles = function () {
			return canMultipleUploadFiles() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
		};

		var canDownloadFiles = serviceContainer.service.basicCanDownloadFiles;
		serviceContainer.service.canDownloadFiles = function () {
			return canDownloadFiles() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
		};

		var canCancelUploadFiles = serviceContainer.service.basicCanCancelUploadFiles;
		serviceContainer.service.canCancelUploadFiles = function () {
			return canCancelUploadFiles() && !businesspartnerMainHeaderDataService.getItemStatus().IsReadonly;
		};

		return serviceContainer.service;

		// ////////////////////////
		function incorporateDataRead(readData, data) {
			var status = businesspartnerMainHeaderDataService.getItemStatus();
			if (status.IsReadonly === true) {
				businesspartnerStatusRightService.setListDataReadonly(readData.Main, true);
			}

			basicsLookupdataLookupDescriptorService.attachData(readData);
			angular.forEach(readData, function (item) {
				serviceContainer.service.updateReadOnly(item);
			});

			return data.handleReadSucceeded(readData.Main, data);
		}

		function initReadData(readData) {
			let header = businesspartnerMainHeaderDataService.getSelected();
			readData.PKey1 = header ? header.Id : null;
		}

		function initCreationData(creationData) {
			let header = businesspartnerMainHeaderDataService.getSelected();
			creationData.PKey1 = header.Id;
		}

		function initialize() {
			var service = serviceContainer.service;
			var uploadOptions = {
				uploadServiceKey: 'businesspartner-main-agreement',
				uploadConfigs: {
					SectionType: 'BusinessPartnerAgreement',
					createForUploadFileRoute: 'businesspartner/main/agreement/createforuploadfile'
				},
				canPreview: true
			};

			basicsCommonServiceUploadExtension.extendForStandard(serviceContainer, uploadOptions);

			service.fillReadonlyModels = fillReadonlyModels;

			/**
			 * provide lookup data item to lookup formatter after creating new item.
			 */
			service.registerEntityCreated(onEntityCreated);

			function fillReadonlyModels(configuration) {
				var service = serviceContainer.service;
				service.unregisterSelectionChanged(onSetReadonly);
				businessPartnerHelper.fillReadonlyModels(configuration, service);
				service.registerSelectionChanged(onSetReadonly);
			}

			service.setCurrentDocItemFileInfoCustomize = function setCurrentDocItemFileInfoCustomize(currItem, data) {
				let fileName = data.fileName;
				if (angular.isString(fileName) && fileName.length > 42) {
					fileName = fileName.substr(0, 42);
				}
				currItem.DocumentName = fileName;
				currItem.ReferenceDate = moment.utc(Date.now());
			};

			function onSetReadonly() {
				var service = serviceContainer.service;
				var currentItem = service.getSelected();
				if (!currentItem || !currentItem.Id) {
					return;
				}

				var fields = _.map(service.canReadonlyModels, function (model) {
					var editable = true;
					if (model === 'DocumentTypeFk') {
						editable = getCellEditable(currentItem, model);
					}

					return {
						field: model,
						readonly: !editable
					};
				});
				platformRuntimeDataService.readonly(currentItem, fields);
			}

			function getCellEditable(currentItem, field) {
				switch (field) {
					case 'DocumentTypeFk':
						return currentItem.FileArchiveDocFk === null;
					default:
						return true;
				}
			}

			// noinspection JSUnusedLocalSymbols
			function onEntityCreated(e, newEntity) {
				var result = basicsLookupdataLookupDescriptorService.provideLookupData(newEntity, {
					collect: function (prop) {
						var result = true;
						// basicsLookupdataLookupDescriptorService will take string from property name except 'Fk' as lookup type name by default,
						// if it is not the right lookup type name, please use convert to return right name.
						switch (prop) {
							case 'AgreementTypeFk':
							case 'BusinessPartnerFk':
							case 'FileArchiveDocFk':
								result = false;
								break;
							default:
								break;
						}
						return result;
					}
				});
				if (!result.dataReady) {
					result.dataPromise.then(function () {
						serviceContainer.service.gridRefresh();
					});
				}
			}
		}
	}
})(angular);
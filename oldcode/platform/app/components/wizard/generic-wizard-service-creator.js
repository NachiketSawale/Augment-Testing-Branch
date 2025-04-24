(function (angular) {
	'use strict';

	angular.module('platform').service('genericWizardServiceCreator', WizardService);

	WizardService.$inject = ['platformDataServiceFactory', '$http', '$window', '$injector'];

	function WizardService(platformDataServiceFactory, $http, $window, $injector) {
		var self = this;

		self.createWizardService = function createWizardService(dataServiceFactory, useCaseConfig) {

			var serviceName = dataServiceFactory.getServiceName();

			var genWizardInstanceDataServiceOption = {
				flatRootItem: {
					module: dataServiceFactory.getModule,
					serviceName: serviceName,
					dataProcessor: dataServiceFactory.getDataProcessor(),
					actions: {delete: true, create: 'flat'},
					modification: {multi: true},
					entityRole: {
						root: {
							itemName: dataServiceFactory.getItemName()
						}
					},
					presenter: {
						list: {}
					}
				}
			};

			if (useCaseConfig && useCaseConfig.dataProcessor) {
				genWizardInstanceDataServiceOption.flatRootItem.dataProcessor.push(...useCaseConfig.dataProcessor);
			}

			var serviceContainer = platformDataServiceFactory.createNewComplete(genWizardInstanceDataServiceOption);
			serviceContainer.data.doUpdate = null;
			inheritPublicFunctions(dataServiceFactory, serviceContainer.service, useCaseConfig);
			if (useCaseConfig && useCaseConfig.isDocumentContainer) {
				serviceContainer.service.previewFile = function () {
					var file = serviceContainer.service.getSelected();
					if (file) {
						var docId = file.FileArchiveDocFk ? file.FileArchiveDocFk : file.ArchiveElementId;
						if (docId) {
							$http.get(globals.webApiBaseUrl + 'basics/common/document/checkfilesize?docId=' + docId)
								.then(function (result) {
									if (result.data < (20 * 1024 * 1024)) {
										previewDocument(file);
									} else {
										var platformModalService = $injector.get('platformModalService');
										platformModalService.showMsgBox('basics.common.previewSize', 'basics.common.docPreview', 'warning');
									}
								});
						} else {
							previewDocument(file);
						}
					}
				};
			}

			if (dataServiceFactory.wizardFunctions) {
				serviceContainer.service.wizardFunctions = dataServiceFactory.wizardFunctions;
			}

			return serviceContainer.service;
		};

		function inheritPublicFunctions(dataServiceFactory, serviceContainer, useCaseConfig) {
			if (useCaseConfig && _.isArray(useCaseConfig.inheritFunctions)) {
				_.each(useCaseConfig.inheritFunctions, function (functionName) {
					_.set(serviceContainer, functionName, _.get(dataServiceFactory, functionName));
				});
			}
		}

		function previewDocument(file) {
			var docId = file.FileArchiveDocFk ? file.FileArchiveDocFk : file.ArchiveElementId;
			if (docId) {
				$http({
					url: globals.webApiBaseUrl + 'basics/common/document/preview',
					method: 'GET',
					params: {fileArchiveDocId: docId}
				}).then(function (result) {
					$window.open(result.data, '_blank');
				});
			} else if (file.Url) {
				window.open(file.Url, '_blank');
			}
		}
	}
})(angular);

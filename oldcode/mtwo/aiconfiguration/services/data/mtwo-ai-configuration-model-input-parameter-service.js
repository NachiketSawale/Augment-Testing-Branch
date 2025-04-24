/**
 * @author: chd
 * @date: 3/25/2021 10:40 AM
 * @description:
 */
(function (angular) {
	'use strict';

	let moduleName = 'mtwo.aiconfiguration';

	angular.module(moduleName).factory('mtwoAIConfigurationModelInputParameterService', MtwoAIConfigurationModelInputParameterService);

	MtwoAIConfigurationModelInputParameterService.$inject = ['globals', 'platformDataServiceFactory', 'mtwoAIConfigurationModelVersionService',
		'mtwoAIConfigurationConstantValues', 'PlatformMessenger', 'cloudCommonGridService'];

	function MtwoAIConfigurationModelInputParameterService(globals, platformDataServiceFactory, parentService,
		mtwoAIConfigurationConstantValues, PlatformMessenger, cloudCommonGridService) {

		let serviceOptions = {
			hierarchicalLeafItem: {
				module: angular.module(moduleName),
				serviceName: 'mtwoAIConfigurationModelInputParameterService',
				entityRole: {leaf: {itemName: 'ModelParameter', parentService: parentService, doesRequireLoadAlways: true}},
				httpCRUD: {
					route: globals.webApiBaseUrl + 'mtwo/aiconfiguration/modelparameter/',
					endRead: 'tree',
					usePostForRead: true,
					initReadData: function initReadData(readData) {
						let modelVersion = parentService.getSelected();
						readData.MtoModelVersionFk = modelVersion.Id;
						readData.ParameterType = mtwoAIConfigurationConstantValues.parameterType.input;
						return readData;
					}
				},
				actions: {delete: false, create: false},
				presenter: {
					tree: {
						parentProp: 'MtoModelParameterFk', childProp: 'ChildItems',
						incorporateDataRead: function (readData, data) {
							let output=[];
							cloudCommonGridService.flatten(readData, output, 'ChildItems');
							return serviceContainer.data.handleReadSucceeded(readData, data);
						}
					}
				},
			}
		};

		let serviceContainer = platformDataServiceFactory.createNewComplete(serviceOptions);
		let service = serviceContainer.service;
		service.onRowChange = new PlatformMessenger();

		return service;
	}
})(angular);

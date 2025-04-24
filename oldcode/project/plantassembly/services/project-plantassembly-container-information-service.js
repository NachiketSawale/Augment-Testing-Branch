/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let projectPlantassemblyModule = angular.module('project.plantassembly');

	/**
	 * @ngdoc service
	 * @name projectPlantassemblyContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	projectPlantassemblyModule.factory('projectPlantassemblyContainerInformationService', ['$injector',
		function ($injector) {
			let service = {};

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				let layServ = null;
				let options = {};
				let commonService = $injector.get('estimateMainCommonService');
				let resourceService = $injector.get('projectPlantAssemblyResourceService');

				switch (guid) {
					case 'c163031647d6459288c5c43ed46cf6e8': // projectPlantAssemblyListController
						layServ = $injector.get('projectPlantassemblyStandardConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectPlantassemblyStandardConfigurationService';
						config.dataServiceName = 'projectPlantAssemblyMainService';
						config.validationServiceName = 'projectPlantAssemblyValidationService';
						config.listConfig = {
							initCalled: false,
							columns: [],
							cellChangeCallBack: function cellChangeCallBack(arg) {
								$injector.get('projectPlantAssemblyMainService').onCellChange(arg, resourceService, commonService);
							},
							rowChangeCallBack: function rowChangeCallBack() {
								// get and set resource characteristics
								let resCharsDynamicService = $injector.get('projectPlantAssemblyResourceDynamicConfigurationService');
								resCharsDynamicService.detachData('eaa7ef996ed54b3b80f5535354ed1081'); // Plant Master Assembly Resources container GUID
							}
						};
						break;
					case 'f7b4578655914fbc85dc7f65c803cfd8': // projectPlantAssemblyDetailController
						layServ = $injector.get('projectPlantassemblyStandardConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectPlantassemblyStandardConfigurationService';
						config.dataServiceName = 'projectPlantAssemblyMainService';
						config.validationServiceName = 'projectPlantAssemblyValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'bedc9497ca84537ae6c8cabbb0b8faeb': // projectPlantAssemblyResourceController
						options.isPrjPlantAssembly = true;
						options.assemblyResourceDynamicConfigServiceName = 'projectPlantAssemblyResourceDynamicConfigurationService';
						options.assemblyResourceDataServiceName = 'projectPlantAssemblyResourceService';
						options.assemblyResourceValidationServiceName = 'projectPlantAssemblyResourceValidationService';
						config = $injector.get('estimateAssembliesContainerInformationServiceFactory').getContainerInfoByGuid('bedc9497ca84537ae6c8cabbb0b8faeb', false, options);
						break;
				}
				return config;
			};

			return service;
		}
	]);
})(angular);

/**
 * Created by joshi on 25.10.2016.
 */
(function (angular) {

	'use strict';
	var projectStructuresModule = angular.module('project.structures');

	/**
	 * @ngdoc service
	 * @name projectStructuresContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	projectStructuresModule.factory('projectStructuresContainerInformationService', ['$injector',
		function ($injector) {

			var service = {
				getContainerInfoByGuid:getContainerInfoByGuid
			};

			 function getContainerInfoByGuid(guid) {
				var config = {},
					commonUIService = $injector.get('projectStructuresCommonUIService'),
					layServ = {},
					validationService = $injector.get('projectStructuresValidationService');

				switch (guid) {
					//sort code 01
					case '9ae8c2111f354edea6c775fb64469de3': //projecStructuresSortcode01ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode01Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode01Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode01Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'b5b27ff9adae4de09deb1e765b53bff9': //projecStructuresSortcode071DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode01Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode01Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode01Service'));
						break;

					//sort code 02
					case '8a747d2e83ab42ed8c918f9840af2b2e': //projecStructuresSortcode02ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode02Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode02Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode02Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '77058c67284b412e92a65bfab55f8beb': //projecStructuresSortcode02DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode02Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode02Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode02Service'));
						break;

					//sort code 03
					case '8b8070460f8c477382a3f4ca0eccecf0': //projecStructuresSortcode03ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode03Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode03Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode03Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '67f570d0ac7c4ee7b0049f7bd2069eaa': //projecStructuresSortcode03DetailControlle
						layServ = commonUIService.createUiService({typeName: 'SortCode03Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode03Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode03Service'));
						break;

					//sort code 04
					case '4232f7b7aa174dc9b9b1cbfb2d92e61b': //projecStructuresSortcode04ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode04Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode04Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode04Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'b47caaaecb014b9cabbbcc547eeb83f8': //projecStructuresSortcode04DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode04Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode04Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode04Service'));
						break;

					//sort code 05
					case '5d796e309aeb45318236d806a34f0028': //projecStructuresSortcode05ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode05Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode05Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode05Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'e5c93bd4eba44faeb922d79718f9d69e': //projecStructuresSortcode05DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode05Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode05Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode05Service'));
						break;

					//sort code 06
					case 'bd4aebdaf1fe4a779bb2096946a918a5': //projecStructuresSortcode06ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode06Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode06Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode06Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '2ae50bf1b5074521a66f799b5b2db27b': //projecStructuresSortcode06DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode06Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode06Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode06Service'));
						break;

					//sort code 07
					case '76cf8afdfef64049b7820423d83c24c5': //projecStructuresSortcode07ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode07Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode07Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode07Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'b788d63109d040ceb43615efaaf050a7': //projecStructuresSortcode07DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode07Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode07Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode07Service'));
						break;

					//sort code 08
					case '3a86e227a1d245148a04d0da26162ac4': //projecStructuresSortcode08ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode08Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode08Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode08Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'f4055b7677cb48609b5346cf1c52c480': //projecStructuresSortcode08DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode08Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode08Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode08Service'));
						break;

					//sort code 09
					case '7eb96a183423427c8427f809c658359b': //projecStructuresSortcode09ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode09Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode09Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode09Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case 'f38d7efcb775488191ed248bf121f52d': //projecStructuresSortcode09DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode09Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode09Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode09Service'));
						break;

					//sort code 10
					case '138e7d85bbc141a29501b08ec1e3d92e': //projecStructuresSortcode10ListController
						layServ = commonUIService.createUiService({typeName: 'SortCode10Dto'});
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode10Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode10Service'));
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '9e2d856e32cf4e4aa36a79f29b1ce59f': //projecStructuresSortcode10DetailController
						layServ = commonUIService.createUiService({typeName: 'SortCode10Dto'});
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = layServ;
						config.dataServiceName = 'projectStructuresSortcode10Service';
						config.validationServiceName = validationService.initValidation($injector.get('projectStructuresSortcode10Service'));
						break;
				}
				return config;
			}
			return service;
		}
	]);
})(angular);
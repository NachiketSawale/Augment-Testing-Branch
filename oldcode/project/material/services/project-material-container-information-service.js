/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	let projectMaterialModule = angular.module('project.material');

	/**
	 * @ngdoc service
	 * @name projectMaterialContainerInformationService
	 * @function
	 *
	 * @description
	 *
	 */
	projectMaterialModule.factory('projectMaterialContainerInformationService', ['$injector',
		/* jshint -W072 */ // many parameters because of dependency injection
		function ($injector) {

			let service = {};

			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				let layServ = null;
				switch (guid) {
					case '486bac686fa942449b4effcb8b2de308': // projectMaterialListController
						layServ = $injector.get('projectMaterialStandardConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMaterialStandardConfigurationService';
						config.dataServiceName = 'projectMaterialMainService';
						config.validationServiceName = 'projectMaterialValidationService';
						config.listConfig = { initCalled: false, columns: [] };
						break;
					case '9b3839487a6445cdb63d307dbf9de780': // projectMaterialDetailController
						layServ = $injector.get('projectMaterialStandardConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMaterialStandardConfigurationService';
						config.dataServiceName = 'projectMaterialMainService';
						config.validationServiceName = 'projectMaterialValidationService';
						break;
					case 'def9a05422154aeba42939052f280a1a': // projectMaterialPortionListController
						layServ = $injector.get('projectMaterialPortionStandardConfigurationService');
						config.layout = layServ.getStandardConfigForListView();
						config.ContainerType = 'Grid';
						config.standardConfigurationService = 'projectMaterialPortionStandardConfigurationService';
						config.dataServiceName = 'projectMaterialPortionMainService';
						config.validationServiceName =  'projectMaterialPortionValidationService';
						config.listConfig = {
							initCalled: false,
							columns: [],
							cellChangeCallBack: function (args) {
								let currentItem = args.item;
								let col = args.grid.getColumns()[args.cell].field;
								if (col === 'IsEstimatePrice' || col ==='IsDayWorkRate' || col ==='CostPerUnit' || col ==='CostCode' || col ==='Quantity') {
									$injector.get('projectMaterialPortionMainService').fieldChanged(col,currentItem);
								}
							}
						};
						break;
					case '4a1245ec24f94aa9a8005db8618bfe2d': // projectMaterialPortionDetailController
						layServ = $injector.get('projectMaterialPortionStandardConfigurationService');
						config = layServ.getStandardConfigForDetailView();
						config.ContainerType = 'Detail';
						config.standardConfigurationService = 'projectMaterialPortionStandardConfigurationService';
						config.dataServiceName = 'projectMaterialPortionMainService';
						config.validationServiceName = 'projectMaterialPortionValidationService';
						break;
				}

				return config;
			};

			return service;
		}
	]);
})(angular);
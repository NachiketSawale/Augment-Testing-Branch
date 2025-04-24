/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';
	let moduleName = 'estimate.parameter';
	let estimateParameterModule = angular.module(moduleName);
	/**
	 * @ngdoc service
	 * @name estimateParameterPrjParamService
	 * @function
	 * @description
	 * This is the data service for project estimate parameter item related functionality.
	 */
	angular.module(moduleName).factory('estimateParameterPrjParamService',
		['$injector','projectMainService', 'platformDataServiceFactory','estimateMainDeatailsParamListProcessor','estimateParamDataService','basicsLookupdataLookupDescriptorService',
			function ($injector,projectMainService, platformDataServiceFactory,estimateMainDeatailsParamListProcessor,estimateParamDataService,basicsLookupdataLookupDescriptorService) {
				let prjParameterServiceInfo = {
					flatLeafItem: {
						module: estimateParameterModule,
						serviceName: 'estimateParameterPrjParamService',
						entityNameTranslationID: 'estimate.parameter.project.param',
						httpCreate: {route: globals.webApiBaseUrl + 'estimate/parameter/prjparam/', endCreate: 'createnew' },
						httpRead: {route: globals.webApiBaseUrl + 'estimate/parameter/prjparam/'},
						httpUpdate: {route: globals.webApiBaseUrl + 'project/main/', endUpdate: 'update'},
						entityRole: {
							leaf: {
								itemName: 'PrjEstParam',
								parentService: projectMainService,
								parentFilter: 'projectId'
							}
						},
						translation: {
							uid: 'estimateParameterPrjParamService',
							title: 'estimate.parameter.project.param',
							columns: [{header: 'cloud.common.entityDescription', field: 'DescriptionInfo',maxLength : 255}],
							dtoScheme: {
								typeName: 'EstPrjParamDto',
								moduleSubModule: 'Estimate.Parameter'
							}
						},
						entitySelection: {},
						presenter: {
							list: {
								isInitialSorted: true,
								sortOptions: {initialSortColumn: {field: 'Sorting', id: 'sorting'}, isAsc: true},
								incorporateDataRead: function (readData, data) {
									let items = {
										FilterResult: null,
										dtos: readData.Main || []
									};

									_.forEach(items.dtos,function (item) {
										item.isFromProjectParameter = true;
									});

									basicsLookupdataLookupDescriptorService.removeData('RuleParameterValueLookup');
									basicsLookupdataLookupDescriptorService.attachData(readData);

									let projectId = projectMainService.getSelected().Id;
									estimateParamDataService.setProjectIdNModule('Project',projectId);
									estimateParamDataService.setParams(angular.copy(readData.Main));
									estimateParamDataService.setParamsCache(angular.copy(readData.Main));

									$injector.get('estimateMainCommonCalculationService').resetParameterDetailValueByCulture(items.dtos);

									let dataRead = serviceContainer.data.handleReadSucceeded(items, data);

									return dataRead;
								},
								handleCreateSucceeded: function (newData) {
									newData.Action ='toSave';
									$injector.get('estimateMainParameterValueLookupService').clear();
								}
							}
						},
						dataProcessor: [estimateMainDeatailsParamListProcessor]
					}
				};

				let serviceContainer = platformDataServiceFactory.createNewComplete(prjParameterServiceInfo);
				serviceContainer.data.newEntityValidator = {
					validate: function validate(entity) {
						let estimateParameterPrjParamValidationService = $injector.get('estimateParameterPrjParamValidationService');
						estimateParameterPrjParamValidationService.validateCode(entity, entity.Code,'Code');
					}
				};
				return serviceContainer.service;
			}]);
})(angular);

/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var angModule = angular.module('productionplanning.formworktype');

	/**
	 * @ngdoc service
	 * @name productionPlanningFormworkTypeContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	angModule.factory('productionplanningFormworktypeContainerInformationService', ['_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'productionplanningFormworktypeConstantValues',
		function (_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, constantValues) {
			let service = {};

			(function registerFilter() {
				let filters = [
					{
						key: 'productionplanning-formworktype-rubric-category',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return { Rubric: 75 }; //75 maps integer rubric "RubricConstant.ProductionPlanning"
						}
					},
				];
				_.each(filters, function (filter) {
					if (!basicsLookupdataLookupFilterService.hasFilter(filter.key)) {
						basicsLookupdataLookupFilterService.registerFilter(filter);
					}
				});
			})();

			/* jshint -W074 */ // There is no complexity; try harder, J.S.Hint.
			service.getContainerInfoByGuid = function getContainerInfoByGuid(guid) {
				let config = {};
				let guids = constantValues.uuid.container;

				switch (guid) {
					case guids.formworktypeList: // productionplanningFormworktypeListController
						config = platformLayoutHelperService.getStandardGridConfig(service.getFormworktypeServiceInfo(), service.getFormworktypeLayoutInfo);
						break;
					case guids.formworktypeDetails: // productionplanningFormworktypeDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(service.getFormworktypeServiceInfo(), service.getFormworktypeLayoutInfo);
						break;
				}

				return config;
			};


			service.getFormworktypeLayoutInfo = function getFormworktypeLayoutInfo() {
				return {
					fid: 'productionplanning.formworktype',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['descriptioninfo', 'icon', 'rubriccategoryfk','processtemplatefk', 'isdefault', 'islive', 'sorting', 'userflag1', 'userflag2']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						'rubriccategoryfk':{
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									lookupOptions: {
										filterKey: 'productionplanning-formworktype-rubric-category',
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: { 'lookupType': 'RubricCategoryByRubricAndCompany', 'displayMember': 'Description' },
								width: 125
							},
							detail:{
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookupdata-rubric-category-by-rubric-and-company-lookup',
									descriptionMember: 'Description',
									lookupOptions: {
										filterKey: 'productionplanning-formworktype-rubric-category',
										showClearButton: true
									}
								}
							}
						},
						'processtemplatefk': {
							grid: {
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'ProcessTemplate',
									displayMember: 'DescriptionInfo.Translated',
									version: 3
								},
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true
									},
									directive: 'pps-process-configuration-process-template-dialog-lookup'
								},
								width: 100
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupOptions: {showClearButton: true},
									lookupDirective: 'pps-process-configuration-process-template-dialog-lookup',
								}
							}
						},
					}
				};
			};

			service.getFormworktypeServiceInfo = function getFormworktypeServiceInfo() {
				return {
					standardConfigurationService: 'productionplanningFormworktypeUIConfigurationService',
					dataServiceName: 'productionplanningFormworktypeDataService',
					validationServiceName: 'productionplanningFormworktypeValidationService'
				};
			};


			return service;
		}
	]);
})(angular);

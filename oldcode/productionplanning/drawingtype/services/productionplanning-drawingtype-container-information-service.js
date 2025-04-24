/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {

	'use strict';
	var productionPlanningDrawingTypeModule = angular.module('productionplanning.drawingtype');

	/**
	 * @ngdoc service
	 * @name productionplanningDrawingtypeContainerInformationService
	 * @function
	 *
	 * @description
	 * Provides some information on all containers in the module.
	 */
	productionPlanningDrawingTypeModule.factory('productionplanningDrawingtypeContainerInformationService', ['_', '$injector', 'platformLayoutHelperService', 'basicsLookupdataConfigGenerator', 'basicsLookupdataLookupFilterService', 'productionPlanningDrawingTypeConstantValues',
		function (_, $injector, platformLayoutHelperService, basicsLookupdataConfigGenerator, basicsLookupdataLookupFilterService, constantValues) {
			let service = {};

			(function registerFilter(){
				let filters = [
					{
						key: 'productionplanning-drawingtype-rubric-category',
						serverKey: 'rubric-category-by-rubric-company-lookup-filter',
						serverSide: true,
						fn: function () {
							return { Rubric: 77 }; //77 is rubric for Engineering.
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
					case guids.drawingTypeList: // productionPlanningDrawingTypeListController
						config = platformLayoutHelperService.getStandardGridConfig(service.getDrawingTypeServiceInfo(), service.getDrawingTypeLayoutInfo);
						break;
					case guids.drawingTypeDetails: // productionPlanningDrawingTypeDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(service.getDrawingTypeServiceInfo(), service.getDrawingTypeLayoutInfo);
						break;
					case guids.drawingTypeSkillList: // productionPlanningDrawingTypeSkillListController
						config = platformLayoutHelperService.getStandardGridConfig(service.getDrawingTypeSkillServiceInfo(), service.getDrawingTypeSkillLayoutInfo);
						break;
					case guids.drawingTypeSkillDetails: // productionPlanningDrawingTypeSkillDetailController
						config = platformLayoutHelperService.getStandardDetailConfig(service.getDrawingTypeSkillServiceInfo(), service.getDrawingTypeSkillLayoutInfo);
						break;
				}

				return config;
			};

			service.getDrawingTypeLayoutInfo = function getDrawingTypeLayoutInfo () {
				return {
					fid: 'productionplanning.drawingtype',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['descriptioninfo', 'isdefault', 'islive', 'sorting', 'icon', 'rubriccategoryfk', 'materialgroupfk', 'restypedetailerfk']
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
										filterKey: 'productionplanning-drawingtype-rubric-category',
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
										filterKey: 'productionplanning-drawingtype-rubric-category',
										showClearButton: true
									}
								}
							}
						},
						'materialgroupfk': {
							'detail': {
								'type': 'directive',
								'directive': 'basics-lookupdata-lookup-composite',
								'options': {
									lookupDirective: 'basics-material-material-group-lookup',
									descriptionMember: 'DescriptionInfo.Translated'
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-material-material-group-lookup'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'MaterialGroup',
									displayMember: 'Code'
								}
							}
						},
						'restypedetailerfk':  basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceTypeLookupDataService'
						}),
					}
				};
			};

			service.getDrawingTypeServiceInfo = function getDrawingTypeServiceInfo() {
				return {
					standardConfigurationService: 'productionPlanningDrawingTypeUIConfigurationService',
					dataServiceName: 'productionPlanningDrawingTypeDataService',
					validationServiceName: 'productionPlanningDrawingTypeValidationService'
				};
			};

			service.getDrawingTypeSkillLayoutInfo = function getDrawingTypeSkillLayoutInfo () {
				return {
					fid: 'productionplanning.drawingtypeskill',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['resskillfk', 'commenttext']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						'resskillfk' : basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'resourceCommonSkillLookupDataService'
						}),
					}
				};
			};

			service.getDrawingTypeSkillServiceInfo = function getDrawingTypeSkillServiceInfo() {
				return {
					standardConfigurationService: 'productionPlanningDrawingTypeSkillUIConfigurationService',
					dataServiceName: 'productionPlanningDrawingTypeSkillDataService',
					validationServiceName: 'productionPlanningDrawingTypeSkillValidationService'
				};
			};

			return service;
		}
	]);
})(angular);

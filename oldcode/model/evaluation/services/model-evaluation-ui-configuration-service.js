/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var moduleName = 'model.evaluation';

	/**
	 * @ngdoc service
	 * @name modelEvaluationUIConfigurationService
	 * @function
	 * @requires basicsCommonConfigLocationListService, basicsLookupdataConfigGenerator, platformTranslateService
	 *
	 * @description
	 * The UI configuration service for the model.evaluation module.
	 */
	angular.module(moduleName).factory('modelEvaluationUIConfigurationService', [
		'basicsCommonConfigLocationListService', 'basicsLookupdataConfigGenerator', 'platformTranslateService',
		function (basicsCommonConfigLocationListService, basicsLookupdataConfigGenerator, platformTranslateService) {
			var service = {};

			function generateOriginFieldOverload() {
				var selectOptions = {
					items: [{
						id: 'g',
						title$tr$: 'model.evaluation.originGlobal'
					}, {
						id: 'p',
						title$tr$: 'model.evaluation.originProject'
					}, {
						id: 'po',
						title$tr$: 'model.evaluation.originProjectOverride'
					}],
					valueMember: 'id',
					displayMember: 'title'
				};
				platformTranslateService.translateObject(selectOptions.items, 'title');
				return {
					grid: {
						formatter: 'select',
						formatterOptions: selectOptions
					},
					detail: {
						type: 'select',
						options: selectOptions
					},
					readonly: true
				};
			}

			service.getRulesetLayout = function () {
				return {
					fid: 'model.evaluation.rulesetForm',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['descriptioninfo', 'scopelevel', 'highlightingschemefk', 'modelrulesetgroupfk', 'projectfk', 'origin', 'sorting']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						scopelevel: basicsCommonConfigLocationListService.createFieldOverload(),
						highlightingschemefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelAdministrationDynHlSchemeLookupDataService'
						}, {
							required: true
						}),
						modelrulesetgroupfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelEvaluationRulesetGroupLookupDataService'
						}),
						projectfk: {
							grid: {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-lookup-data-project-project-dialog',
									lookupOptions: {
										showClearButton: true
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'project',
									displayMember: 'ProjectNo'
								}
							},
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-lookup-data-project-project-dialog',
									descriptionMember: 'ProjectName',
									lookupOptions: {
										showClearButton: true
									}
								}
							}
						},
						origin: generateOriginFieldOverload()
					}
				};
			};

			service.getRuleset2ModuleLayout = function () {
				return {
					fid: 'model.evaluation.ruleset2ModuleForm',
					version: '1.0.0',
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['modulefk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						modulefk: {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-lookup-composite',
								options: {
									lookupDirective: 'basics-config-module-dialog',
									descriptionMember: 'DescriptionInfo.Translated',
									lookupOptions: {
										showClearButton: false
									}
								}
							},
							grid: {
								editor: 'lookup',
								directive: 'basics-lookupdata-lookup-composite',
								editorOptions: {
									lookupDirective: 'basics-config-module-dialog',
									lookupOptions: {
										showClearButton: false,
										displayMember: 'DescriptionInfo.Translated'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'Module',
									displayMember: 'DescriptionInfo.Translated'
								}
							}
						}
					}
				};
			};

			service.getRuleLayout = function () {
				return {
					fid: 'model.evaluation.ruleForm',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['descriptioninfo', 'sorting', 'modeid', 'hlitemfk', 'isdisabled', 'origin']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						modeid: {
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'modelEvaluationRuleEditorModeIconService'
							},
							readonly: true
						},
						hlitemfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'modelAdministrationDynHlItemByMappingLookupDataService'
						}, {
							isTransient: true
						}),
						origin: generateOriginFieldOverload()
					}
				};
			};

			service.getRulesetGroupLayout = function () {
				return {
					fid: 'model.evaluation.rulesetGroupForm',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': ['descriptioninfo', 'scopelevel']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						scopelevel: basicsCommonConfigLocationListService.createFieldOverload()
					}
				};
			};

			return service;
		}
	]);
})(angular);


/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectModelUIConfig
	 * @function
	 *
	 * @description
	 * modelProjectModelUIConfig is the data service for all ui configurations functions.
	 */
	angular.module(moduleName).factory('modelProjectModelReadonlyUIConfig',
		['platformUIStandardConfigService', 'modelProjectMainTranslationService', 'basicsLookupdataConfigGenerator',
			'platformSchemaService', 'basicsCommonComplexFormatter',

			function (platformUIStandardConfigService, modelProjectMainTranslationService, basicsLookupdataConfigGenerator,
			          platformSchemaService, basicsCommonComplexFormatter) {

				var BaseService = platformUIStandardConfigService;

				function getModelDetailLayout() {
					return {
						fid: 'model.project.modeldetailform',
						version: '1.0.0',
						addValidationAutomatically: true,
						showGrouping: true,
						'groups': [
							{
								'gid': 'baseGroup',
								'attributes': ['statusfk', 'code', 'description', 'projectfk', 'lodfk', 'typefk', 'commenttext', 'schedulefk', 'estimateheaderfk', 'remark', 'islive']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							statusfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomMDLStatusLookupDataService',
								readonly: true
							}),
							lodfk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.lod'),
							typefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.mdltype'),
							projectfk: {
								readonly: true,
								'grid': {
									'field': 'ProjectDto',
									'formatter': basicsCommonComplexFormatter,
									'formatterOptions': {
										displayMember: 'ProjectNo'
									}

								}
							},
							schedulefk: {
								readonly: true,
								'grid': {
									'field': 'ScheduleDto',
									'formatter': basicsCommonComplexFormatter,
									'formatterOptions': {
										displayMember: 'Code'
									}
								}
							},
							estimateheaderfk: {
								readonly: true,
								'grid': {
									'field': 'EstimateHeaderDto',
									'formatter': basicsCommonComplexFormatter,
									'formatterOptions': {
										displayMember: 'Code'
									}
								}
							},
							code: {
								readonly: true,
								navigator: {
									moduleName: 'model.main'
								}
							},
							description: {
								readonly: true
							},
							commenttext: {
								readonly: true
							},
							remark: {
								readonly: true
							},
							islive: {
								readonly: true
							}
						}
					};
				}

				var modelProjectModelDetailLayout = getModelDetailLayout();

				var modelProjectModelAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'ModelDto',
					moduleSubModule: 'Model.Project'
				});
				if (modelProjectModelAttributeDomains) {
					modelProjectModelAttributeDomains = modelProjectModelAttributeDomains.properties;
				}

				function ModelProjectModelUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ModelProjectModelUIStandardService.prototype = Object.create(BaseService.prototype);
				ModelProjectModelUIStandardService.prototype.constructor = ModelProjectModelUIStandardService;

				return new BaseService(modelProjectModelDetailLayout, modelProjectModelAttributeDomains, modelProjectMainTranslationService);
			}
		]);
})(angular);

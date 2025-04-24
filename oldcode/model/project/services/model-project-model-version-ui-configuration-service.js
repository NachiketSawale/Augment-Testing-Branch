/**
 * Created by leo on 19.11.2015.
 */
(function () {
	'use strict';
	var moduleName = 'model.project';

	/**
	 * @ngdoc service
	 * @name modelProjectModelVersionUIConfig
	 * @function
	 *
	 * @description
	 * modelProjectModelVersionUIConfig is the data service for all ui configurations functions.
	 */
	angular.module(moduleName).factory('modelProjectModelVersionUIConfig',
		['platformUIStandardConfigService', 'modelProjectMainTranslationService', 'basicsLookupdataConfigGenerator', 'platformSchemaService', 'basicsCommonComplexFormatter',

			function (platformUIStandardConfigService, modelProjectMainTranslationService, basicsLookupdataConfigGenerator, platformSchemaService, basicsCommonComplexFormatter) {

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
								'attributes': ['statusfk', 'code', 'iscomposite', 'description', 'projectfk', 'lodfk', 'typefk', 'commenttext', 'schedulefk', 'estimateheaderfk', 'remark', 'islive','modelversion','modelrevision', 'documenttypefk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							iscomposite: {
								readonly: true
							},
							islive: {
								readonly: true
							},
							statusfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								dataServiceName: 'basicsCustomMDLStatusLookupDataService',
								readonly: true
							}),
							lodfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.lod'),
							//typefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.mdltype'),
							typefk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookupdata-model-type-combobox'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'MdlType',
										displayMember: 'DescriptionInfo.Translated'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-model-type-combobox'
								}
							},
							projectfk: {
								readonly: true,
								'grid': {
									'field': 'ProjectDto',
									'formatter': basicsCommonComplexFormatter,
									'formatterOptions': {
										displayMember: 'ProjectNo'
									}

								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										'lookupDirective': 'basics-lookup-data-project-project-dialog',
										'descriptionMember': 'ProjectName',
										'lookupOptions': {
											'showClearButton': true,
											'initValueField': 'ProjectNo'
										}
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
								},
								detail: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'schedulingLookupScheduleDataService',
									moduleQualifier: 'schedulingLookupScheduleDataService',
									desMember: 'DescriptionInfo.Translated',
									readonly: true,
									filter: function (item) {
										return item && item.ProjectFk !== null ? item.ProjectFk : -1;
									}
								})
							},
							estimateheaderfk: {
								readonly: true,
								'grid': {
									'field': 'EstimateHeaderDto',
									'formatter': basicsCommonComplexFormatter,
									'formatterOptions': {
										displayMember: 'Code'
									}
								},
								detail: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
									dataServiceName: 'estimateMainHeaderLookupDataService',
									moduleQualifier: 'estimateMainHeaderLookupDataService',
									desMember: 'DescriptionInfo.Translated',
									readonly: true,
									filter: function (item) {
										return item.ProjectFk;
									}
								})
							},
							code: {
								navigator: {
									moduleName: 'model.main'
								}
							},
							documenttypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.documenttype')
						}
					};
				}

				var modelProjectModelDetailLayout = getModelDetailLayout();

				var modelProjectModelAttributeDomains = platformSchemaService.getSchemaFromCache( { typeName: 'ModelDto', moduleSubModule: 'Model.Project'} );
				if(modelProjectModelAttributeDomains) {
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


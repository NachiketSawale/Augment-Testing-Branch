/**
 * Created by wui on 2/21/2017.
 */

(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.project';

	angular.module(moduleName).factory('constructionSystemProjectCopyInstanceHeaderUIConfigService', [
		'$translate',
		'platformUIConfigInitService',
		'constructionSystemProjectTranslateService',
		'basicsLookupdataConfigGenerator',
		'projectMainService',
		'constructionSystemProjectEstimateModeService',
		function (
			$translate,
			platformUIConfigInitService,
			translateService,
			basicsLookupdataConfigGenerator,
			projectMainService,
			constructionSystemProjectEstimateModeService) {

			function geDetailLayout(modelKind) {
				var modelFkConfig = basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
					moduleQualifier: '41B3B1A1743F4FF98891C235E18C189B',
					dataServiceName: 'modelProjectModelTreeLookupDataService',
					enableCache: true,
					desMember: 'Description',
					filter: function () {
						return projectMainService.getIfSelectedIdElse(-1) + '&includeComposite=true';
					}
				});

				modelFkConfig.options.lookupOptions.selectableCallback = function (dataItem) {
					return angular.isNumber(dataItem.Id);
				};

				modelFkConfig.userlabel = $translate.instant('constructionsystem.project.entityModelNewFk');

				return {
					fid: 'constructionsystem.project.instanceheader.copy',
					version: '1.0.0',
					addValidationAutomatically: true,
					showGrouping: false,
					groups: [
						{
							'gid': 'baseGroup',
							'attributes': modelKind === 1 ? ['costoestmodefk', 'modelfk', 'estimateheaderfk', 'psdschedulefk', 'boqheaderfk', 'code', 'description'] : ['costoestmodefk', 'modelfk', 'mdlchangesetfk', 'estimateheaderfk', 'psdschedulefk', 'boqheaderfk', 'code', 'description']
						}
					],
					overloads: {
						costoestmodefk: {
							domain: 'radio',
							options: {
								valueMember: 'Id',
								labelMember: 'Code',
								items: constructionSystemProjectEstimateModeService.getList()
							}
						},
						modelfk: modelFkConfig,
						mdlchangesetfk: {
							detail: {
								type: 'directive',
								directive: 'basics-lookupdata-model-change-set-combobox',
								options: {
									filterOptions: {
										serverSide: true,
										fn: function (entity) {
											return {
												model1Fk: entity.ModelFk === -1 ? null : entity.ModelFk,
												model2Fk: entity.ModelOldFk
											};
										}
									},
									pKeyMaps: [{fkMember: 'ModelCsFk', pkMember: 'ModelFk'}],
									events: [
										{
											name: 'onSelectedItemChanged',
											handler: function (e, args) {
												var selected = args.selectedItem;
												var entity = args.entity;

												if (entity.ModelOldFk === selected.ModelFk) {
													entity.ModelFk = selected.ModelCmpFk;
												} else {
													entity.ModelFk = selected.ModelFk;
												}
											}
										}
									]
								}
							}
						},
						estimateheaderfk: basicsLookupdataConfigGenerator.provideDataServiceCompositeLookupConfigForForm({
							moduleQualifier: '1F3654FA48B748BCB22A3E73E34FEA76',
							dataServiceName: 'estimateMainHeaderLookupDataService',
							enableCache: true,
							desMember: 'DescriptionInfo.Translated',
							filter: function () {
								return projectMainService.getIfSelectedIdElse(-1);
							}
						}, {required: true}),
						psdschedulefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							moduleQualifier: '5061127539C842DD9CC0E36514955BBE',
							dataServiceName: 'schedulingLookupScheduleDataService',
							enableCache: true,
							showClearButton: true,
							filter: function () {
								return projectMainService.getIfSelectedIdElse(-1);
							}
						}),
						boqheaderfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							moduleQualifier: 'A69D65D0F764DF5BF8CF9856D04A9A7',
							dataServiceName: 'boqProjectLookupDataService',
							enableCache: true,
							showClearButton: true,
							filter: function () {
								return projectMainService.getIfSelectedIdElse(-1);
							}
						}),
						code: {
							required: true
						}
					}
				};
			}

			return {
				create: function (modelKind) {
					var service = {};
					platformUIConfigInitService.createUIConfigurationService({
						service: service,
						dtoSchemeId: {typeName: 'InstanceHeaderDto', moduleSubModule: 'ConstructionSystem.Project'},
						layout: geDetailLayout(modelKind),
						translator: translateService
					});
					return service;
				}
			};
		}
	]);
})(angular);
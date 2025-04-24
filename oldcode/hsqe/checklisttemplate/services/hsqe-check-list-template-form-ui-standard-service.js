/*
 * Created by alm on 01.20.2021.
 */

(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklisttemplate';
	var cloudCommonModule = 'cloud.common';
	var userformModule = 'basics.userform';
	angular.module(moduleName).factory('hsqeCheckListTemplate2FormLayout', ['$injector',
		function hsqeCheckListTemplateFormLayout($injector) {
			var checkListRubricFk = $injector.get('hsqeCheckListDataService').checkListRubricFk;
			return {
				fid: 'hsqe.checklisttemplate.hsqechecklisttemplateformdetailform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['code', 'descriptioninfo','basformfk','commenttext','sorting','temporarychecklistid']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule,userformModule],
					'extraWords': {
						'Code': {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						'BasFormFk': {location: moduleName, identifier: 'entityBasForm', initial: 'Form'},
						'CommentText': {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
						'Sorting': {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
						'TemporaryCheckListId': {location: moduleName, identifier: 'entityChecklistId', initial: 'CheckList Id'}
					}
				},
				overloads: {
					'code': {
						'mandatory': true
					},
					'sorting': {
						'mandatory': true
					},
					'basformfk': {
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-lookup-data-by-custom-data-service-grid-less',
								lookupOptions: {
									lookupModuleQualifier: 'basicsUserFormLookupService',
									lookupType: 'basicsUserFormLookupService',
									dataServiceName: 'basicsUserFormLookupService',
									valueMember: 'Id',
									displayMember: 'DescriptionInfo.Description',
									filter: function () {
										return checkListRubricFk;
									},
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'basicsUserFormLookupService',
								dataServiceName: 'basicsUserFormLookupService',
								displayMember: 'DescriptionInfo.Description',
								filter: function () {
									return checkListRubricFk;
								}
							},
							width: 150
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookup-data-by-custom-data-service-grid-less',
							options: {
								lookupModuleQualifier: 'basicsUserFormLookupService',
								lookupType: 'basicsUserFormLookupService',
								dataServiceName: 'basicsUserFormLookupService',
								valueMember: 'Id',
								displayMember: 'DescriptionInfo.Description',
								filter: function () {
									return checkListRubricFk;
								},
								showClearButton: true
							}
						}
					},
					'temporarychecklistid': {
						'isTransient': true,
						'grid': {
							'isTransient': true
						},
						'detail': {
							'isTransient': true
						}
					}
				}
			};
		}
	]);

	angular.module(moduleName).factory('hsqeCheckListTemplate2FormUIStandardService',

		['platformUIStandardConfigService', 'hsqeCheckListTemplateTranslationService', 'platformSchemaService', 'hsqeCheckListTemplate2FormLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, hsqeCheckListTemplate2FormLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'HsqChkListTemplate2FormDto',
					moduleSubModule: 'Hsqe.CheckListTemplate'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(hsqeCheckListTemplate2FormLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, hsqeCheckListTemplate2FormLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);

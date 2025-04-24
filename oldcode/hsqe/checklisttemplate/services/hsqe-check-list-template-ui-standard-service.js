/**
 * Created by alm on 1/20/2021.
 */
(function (angular) {

	'use strict';
	var moduleName = 'hsqe.checklisttemplate';
	var cloudCommonModule = 'cloud.common';
	var scheduleMainModule='scheduling.main';
	angular.module(moduleName).factory('hsqeCheckListTemplateLayout', [
		function hsqeCheckListTemplateLayout() {
			return {
				fid: 'hsqe.checklisttemplate.checklisttemplatedetailform',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				'groups': [
					{
						gid: 'basicData',
						attributes: ['code', 'descriptioninfo','hsqchecklistgroupfk','hsqchecklisttypefk','prcstructurefk','psdactivitytemplatefk','commenttext']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				'translationInfos': {
					'extraModules': [moduleName, cloudCommonModule,scheduleMainModule],
					'extraWords': {
						'Code': {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						'HsqCheckListGroupFk':{location: moduleName, identifier: 'entityCheckListGroup', initial: 'Group'},
						'HsqCheckListTypeFk':{location: moduleName, identifier: 'entityCheckListType', initial: 'Type'},
						'PrcStructureFk':{location: cloudCommonModule, identifier: 'entityPrcStructure', initial: 'Procurement Structure'},
						'PsdActivityTemplateFk':{location: moduleName, identifier: 'entityActivityTemplate', initial: 'Activity Template'},
						'CommentText': {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'}
					}
				},
				overloads: {
					'hsqchecklistgroupfk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'HsqeCheckListGroup',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								lookupDirective: 'hsqe-check-list-group-combobox',
								lookupOptions: {
									displayMember: 'Code'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'HsqCheckListGroupFk',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								lookupDirective: 'hsqe-check-list-group-combobox',
								descriptionMember: 'Description'
							}
						}
					},
					'hsqchecklisttypefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'HsqeCheckListType',
								'displayMember': 'DescriptionInfo.Translated'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'hsqe-check-list-type-combobox',
								'lookupOptions': {
									'lookupType': 'HsqeCheckListType'
								}
							}
						},
						'detail': {
							'type': 'directive',
							'model': 'HsqCheckListTypeFk',
							'directive': 'hsqe-check-list-type-combobox'
						}
					},
					'psdactivitytemplatefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'activitytemplatefk',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'scheduling-activity-template-lookup-dialog'
							}
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'scheduling-activity-template-lookup-dialog',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
								}
							}
						}
					},
					'prcstructurefk': {
						'grid': {
							'formatter': 'lookup',
							'formatterOptions': {
								'lookupType': 'Prcstructure',
								'displayMember': 'Code'
							},
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-procurementstructure-structure-dialog',
								'lookupOptions': {
									'showClearButton': true
								}
							},
							'width': 150
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-procurementstructure-structure-dialog',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'showClearButton': true
								}
							}
						}
					}
				},
				'addition': {
					'grid': [{
						id: 'groupDescription',
						afterId: 'hsqchecklistgroupfk',
						lookupDisplayColumn: true,
						field: 'HsqCheckListGroupFk',
						name$tr$: 'hsqe.checklisttemplate.groupDescription',
						formatter: 'lookup',
						formatterOptions: {
							lookupType: 'HsqeCheckListGroup',
							displayMember: 'DescriptionInfo.Description'
						}
					}]
				}

			};
		}
	]);

	angular.module(moduleName).factory('hsqeCheckListTemplateUIStandardService',

		['platformUIStandardConfigService', 'hsqeCheckListTemplateTranslationService', 'platformSchemaService', 'hsqeCheckListTemplateLayout', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, platformSchemaService, hsqeCheckListTemplateLayout, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'HsqChkListTemplateDto',
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

				var service = new BaseService(hsqeCheckListTemplateLayout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, hsqeCheckListTemplateLayout.addition, domainSchema);

				return service;
			}
		]);
})(angular);

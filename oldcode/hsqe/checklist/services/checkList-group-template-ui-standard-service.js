/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var modName = 'hsqe.checklist';
	var moduleName = 'hsqe.checklisttemplate';
	var cloudCommonModule = 'cloud.common';
	angular.module(modName).factory('hsqeCheckListGroupTemplateLayout', [
		function(){
			return {
				fid: 'hsqe.checklist.groupTemplate',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'basicData',
						'attributes': ['code','descriptioninfo','hsqchecklistgroupfk','hsqchecklisttypefk','prcstructurefk','psdactivitytemplatefk','commenttext']
					}],
				translationInfos: {
					extraModules: [modName, moduleName, cloudCommonModule],
					extraWords: {
						'Code': {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						'HsqCheckListGroupFk':{location: moduleName, identifier: 'entityCheckListGroup', initial: 'Group'},
						'HsqCheckListTypeFk':{location: moduleName, identifier: 'entityCheckListType', initial: 'Type'},
						'PrcStructureFk':{location: cloudCommonModule, identifier: 'entityPrcStructure', initial: 'Procurement Structure'},
						'PsdActivityTemplateFk':{location: moduleName, identifier: 'entityActivityTemplate', initial: 'Activity Template'},
						'CommentText': {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'}
					}
				},
				overloads:{
					code: {
						readonly: true
					},
					descriptioninfo: {
						readonly: true
					},
					'hsqchecklistgroupfk': {
						readonly: true,
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
								descriptionMember: 'Code'
							}
						}
					},
					hsqchecklisttypefk: {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'HsqeCheckListType',
								displayMember: 'DescriptionInfo.Translated'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'hsqe-check-list-type-combobox',
								lookupOptions: {
									lookupType: 'HsqeCheckListType'
								}
							}
						}
					},
					psdactivitytemplatefk: {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								url: {
									getList: 'scheduling/template/activitytemplate/listall',
									getDefault: 'scheduling/template/activitytemplate/listall',
									getItemByKey: 'scheduling/template/activitytemplate/getItemById',
									getSearchList: 'scheduling/template/activitytemplate/listall'
								},
								lookupType: 'activitytemplatefk',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'scheduling-activity-template-lookup-dialog'
							}
						}
					},
					prcstructurefk: {
						readonly: true,
						grid: {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Prcstructure',
								displayMember: 'Code'
							},
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-procurementstructure-structure-dialog',
								lookupOptions: {
									showClearButton: true
								}
							},
							width: 150
						}
					},
					commenttext:{
						readonly: true
					}
				}
			};
		}
	]);
	/**
	 * @ngdoc service
	 * @name hsqeCheckListGroupTemplateUIStandardService
	 * @function
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(modName).factory('hsqeCheckListGroupTemplateUIStandardService', ['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'hsqeCheckListGroupTemplateLayout', 'platformSchemaService', 'platformUIStandardExtentService',
		function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'CheckListGroupTemplateDto',
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

			var service = new BaseService(layout, domainSchema, translationService);

			platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

			return service;
		}
	]);
})(angular);

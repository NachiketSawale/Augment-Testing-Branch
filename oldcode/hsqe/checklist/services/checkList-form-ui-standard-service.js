/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var modName = 'hsqe.checklist';
	angular.module(modName).factory('hsqeCheckListFormLayout', ['$injector',
		function($injector){
			var checkListRubricFk = $injector.get('hsqeCheckListDataService').checkListRubricFk;
			return {
				fid: 'hsqe.checklist.form',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'basicData',
						'attributes': ['code','descriptioninfo','formfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}],
				translationInfos: {
					extraModules: [modName],
					extraWords: {
						'Code':{'location': modName, 'identifier': 'header.Code', 'initial': 'Code'},
						'FormFk':{'location': modName, 'identifier': 'form.userForm', 'initial': 'User Form'}
					}
				},
				overloads:{
					code: {
						mandatory: true
					},
					descriptioninfo: {
						detail: {
							maxLength: 255
						},
						grid: {
							maxLength: 255
						}
					},
					formfk:{
						grid: {
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
							}
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
					}
				}
			};
		}
	]);
	/**
	 * @ngdoc service
	 * @name hsqeCheckListFormUIStandardService
	 * @function
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(modName).factory('hsqeCheckListFormUIStandardService', ['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'hsqeCheckListFormLayout', 'platformSchemaService', 'platformUIStandardExtentService',
		function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'HsqCheckList2FormDto',
				moduleSubModule: 'Hsqe.CheckList'
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

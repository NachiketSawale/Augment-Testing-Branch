/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';
	var modName = 'hsqe.checklist';
	var modelMainModule = 'model.main';
	var modelAnnotationModule = 'model.annotation';
	angular.module(modName).factory('hsqeCheckListModelObjectLayout', ['basicsLookupdataConfigGenerator', '_', '$injector',
		function (basicsLookupdataConfigGenerator, _, $injector) {
			return {
				fid: 'hsqe.checklist.modelObject',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [{
					gid: 'baseGroup',
					attributes: ['linkkind', 'isimportant']
				}, {
					gid: 'linkageGroup',
					attributes: ['modelfk', 'objectfk', 'projectfk', 'objectsetfk']
				}, {
					gid: 'entityHistory',
					isHistory: true
				}],
				translationInfos: {
					extraModules: [modName, modelMainModule, modelAnnotationModule, 'platform'],
					extraWords: {
						baseGroup: {location: 'platform', identifier: 'baseGroup', initial: 'Basic Data'},
						linkageGroup: {location: modelAnnotationModule, identifier: 'linkageGroup', initial: 'Links'},
						LinkKind: {location: modelAnnotationModule, identifier: 'linkKind', initial: 'Type'},
						IsImportant: {location: modelAnnotationModule, identifier: 'important', initial: 'Is Important'},
						ModelFk: {location: modName, identifier: 'modelobject.model', initial: 'Model'},
						ObjectFk: {location: modelAnnotationModule, identifier: 'object', initial: 'Object'},
						ProjectFk: {location: modelAnnotationModule, identifier: 'project', initial: 'Project'},
						ObjectSetFk: {location: modelAnnotationModule, identifier: 'objectSet', initial: 'Selection Set'}
					}
				},
				overloads: {
					linkkind: {
						grid: {
							formatter: 'imageselect',
							formatterOptions: {
								serviceName: 'modelAnnotationObjectLinkTypeIconService',
								acceptFalsyValues: true
							}
						},
						detail: {
							type: 'imageselect',
							options: {
								serviceName: 'modelAnnotationObjectLinkTypeIconService'
							}
						},
						readonly: true
					},
					objectfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'hsqe-checklist-model-object-lookup',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ModelObjectDialog',
								displayMember: 'Description'
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'hsqe-checklist-model-object-lookup',
								descriptionField: 'Description',
								descriptionMember: 'Description',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					},
					projectfk: {
						grid: {
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
						},
						readonly: true
					},
					modelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelProjectVersionedModelLookupDataService',
						enableCache: true,
						readonly: true,
						filter: filterBySelectedAnnotationProject
					}),
					objectsetfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainObjectSetLookupDataService',
						enableCache: true,
						filter: filterBySelectedAnnotationProject,
						additionalColumns: true
					})
				}
			};

			function filterBySelectedAnnotationProject(item) {
				if (_.isInteger(item.ProjectFk)) {
					return item.ProjectFk;
				}
				var checklistDataService = $injector.get('hsqeCheckListDataService');
				const selCheckList = checklistDataService.getSelected();
				return (selCheckList && _.isInteger(selCheckList.ProjectFk)) ? selCheckList.ProjectFk : 0;
			}
		}
	]);
	/**
	 * @ngdoc service
	 * @name hsqeCheckListModelObjectUIStandardService
	 * @function
	 *
	 * @description
	 * The UI configuration service for the module.
	 */
	angular.module(modName).factory('hsqeCheckListModelObjectUIStandardService', ['platformUIStandardConfigService', 'hsqeCheckListTranslationService', 'hsqeCheckListModelObjectLayout', 'platformSchemaService', 'platformUIStandardExtentService',
		function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'ModelAnnotationObjectLinkDto',
				moduleSubModule: 'Model.Annotation'
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

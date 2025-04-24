/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	angular.module('model.annotation').directive('modelAnnotationLookupDialog',
		modelAnnotationLookupDialog);

	modelAnnotationLookupDialog.$inject = ['BasicsLookupdataLookupDirectiveDefinition',
		'basicsLookupdataConfigGenerator', 'modelAnnotationDataService'];

	function modelAnnotationLookupDialog(BasicsLookupdataLookupDirectiveDefinition,
		basicsLookupdataConfigGenerator, modelAnnotationDataService) {

		const defaults = {
			version: 3,
			lookupType: 'ModelAnnotation',
			valueMember: 'Id',
			displayMember: 'DescriptionInfo.Translated',
			columns: [{
				id: 'description',
				field: 'DescriptionInfo.Translated',
				name$tr$: 'cloud.common.entityDescription',
				width: 300
			}, (function generateModelColumn () {
				const lookupCfg = basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForGrid({
					dataServiceName: 'modelProjectModelTreeLookupDataService',
					enableCache: true,
					filter: item => item.ProjectFk,
					additionalColumns: true
				}, {
					id: 'model',
					field: 'ModelFk',
					name$tr$: 'model.main.entityModel',
					width: 200
				});
				delete lookupCfg.editor;
				return lookupCfg;
			})(), {
				id: 'project',
				field: 'ProjectFk',
				name$tr$: 'cloud.common.entityProject',
				width: 200,
				formatter: 'lookup',
				formatterOptions: {
					lookupType: 'project',
					displayMember: 'ProjectNo'
				}
			}, {
				id: 'uuid',
				field: 'Uuid',
				name$tr$: 'model.annotation.uuid',
				width: 400
			}],
			title: {
				name$tr$: 'model.annotation.lookupTitle'
			},
			uuid: 'fce3520fe4414774ac7e39a0a9af7b31',
			pageOptions: {
				enabled: true
			},
			formContainerOptions: {
				title: 'model.annotation.contextGroup',
				entity: function createFilterSettings () {
					const selAnnotation = modelAnnotationDataService.getSelected();
					if (selAnnotation) {
						return {
							ProjectFk: selAnnotation.ProjectFk,
							ModelFk: selAnnotation.ModelFk,
							ConsiderSubModels: true
						};
					} else {
						return {
							ConsiderSubModels: true
						};
					}
				},
				formOptions: {
					configure: {
						showGrouping: false,
						groups: [{
							gid: 'baseGroup',
							isOpen: true
						}],
						rows: [{
							gid: 'baseGroup',
							rid: 'project',
							label$tr$: 'cloud.common.entityProject',
							type: 'directive',
							directive: 'basics-lookupdata-lookup-composite',
							options: {
								lookupDirective: 'basics-lookup-data-project-project-dialog',
								descriptionMember: 'ProjectName',
								lookupOptions: {
									showClearButton: true
								}
							},
							model: 'ProjectFk'
						}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'modelProjectModelTreeLookupDataService',
							filter: function (settings) {
								return {
									projectId: settings.ProjectFk,
									includeComposite: true
								};
							},
							enableCache: true,
							showClearButton: true
						}, {
							gid: 'baseGroup',
							rid: 'model',
							label$tr$: 'model.main.entityModel',
							model: 'ModelFk',
							sortOrder: 1
						}), {
							gid: 'baseGroup',
							rid: 'subModels',
							label$tr$: 'model.annotation.considerSubModels',
							model: 'ConsiderSubModels',
							type: 'boolean',
							sortOrder: 100
						}]
					}
				}
			}
		};

		return new BasicsLookupdataLookupDirectiveDefinition('dialog-edit', defaults);
	}
})(angular);

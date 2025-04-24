/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationUIConfigurationService
	 * @function
	 * @requires basicsCommonConfigLocationListService, basicsLookupdataConfigGenerator
	 *
	 * @description
	 * The UI configuration service for the model.administration module.
	 */
	angular.module(moduleName).factory('modelAdministrationUIConfigurationService',
		modelAdministrationUIConfigurationService);

	modelAdministrationUIConfigurationService.$inject = ['basicsCommonConfigLocationListService',
		'basicsLookupdataConfigGenerator', 'modelAdministrationViewerSettingsUIConfigurationService'];

	function modelAdministrationUIConfigurationService(basicsCommonConfigLocationListService,
		basicsLookupdataConfigGenerator, modelAdministrationViewerSettingsUIConfigurationService) {

		const service = {};

		service.getStaticHighlightingSchemeLayout = function () {
			return {
				fid: 'model.administration.staticHlSchemeForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['descriptioninfo', 'scopelevel', 'backgroundcolor', 'selectioncolor']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					scopelevel: basicsCommonConfigLocationListService.createFieldOverload(),
					backgroundcolor: {
						editor: 'color',
						editorOptions: {
							showClearButton: true
						}
					},
					selectioncolor: {
						editor: 'color',
						editorOptions: {
							showClearButton: true
						}
					}
				}
			};
		};

		service.getDynamicHighlightingSchemeLayout = function () {
			const result = service.getStaticHighlightingSchemeLayout();
			result.fid = 'model.administration.dynHlSchemeForm';
			return result;
		};

		service.getStaticHighlightingItemLayout = function () {
			return {
				fid: 'model.administration.staticHlItemForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['filterstatefk', 'objectvisibilityfk', 'color', 'useobjectcolor', 'opacity', 'selectable']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					filterstatefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.modelfilterstate'),
					objectvisibilityfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.modelobjectvisibility'),
					color: {
						editor: 'color',
						editorOptions: {
							showClearButton: true
						}
					}
				}
			};
		};

		service.getDynamicHighlightingItemLayout = function () {
			return {
				fid: 'model.administration.dynHlItemForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['descriptioninfo', 'objectvisibilityfk', 'color', 'opacity', 'selectable']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					objectvisibilityfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.modelobjectvisibility'),
					color: {
						editor: 'color',
						editorOptions: {
							showClearButton: true
						}
					}
				}
			};
		};

		service.getDataTreeLayout = function () {
			return {
				fid: 'model.administration.dataTreeForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['descriptioninfo', 'rootdescription', 'rootcode', 'unsettext']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				]
			};
		};

		service.getDataTreeLevelLayout = function () {
			return {
				fid: 'model.administration.dataTreeLevelForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['sorting', 'descriptionpattern', 'codepattern', 'propertykeyfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					propertykeyfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'model-main-property-key-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'PropertyKey',
								displayMember: 'PropertyName',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'model-main-property-key-dialog',
							options: {
								descriptionMember: 'PropertyName'
							}
						}
					}
				}
			};
		};

		service.getDataTreeNodeLayout = function () {
			return {
				fid: 'model.administration.dataTreeNodeForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['datatreelevelfk', 'value', 'sorting', 'isunset']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					datatreelevelfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelAdministrationDataTreeLevelLookupDataService',
						enableCache: true,
						filter: function (item) {
							return item.DataTreeFk;
						},
						readonly: true
					}),
					value: {
						readonly: true,
						formatt: 'dynamic',
						domain: function (item) {
							let domain;

							if (item.level && !item.IsUnset) {
								switch (item.level.PropertyKeyEntity.ValueType) {
									case 1:
										domain = 'remark';
										item.Value = item.ValueText;
										break;

									case 2:
										domain = 'decimal';
										item.Value = item.ValueNumber;
										break;

									case 3:
										domain = 'integer';
										item.Value = item.ValueLong;
										break;

									case 4:
										domain = 'boolean';
										item.Value = item.ValueBool;
										break;

									case 5:
										domain = 'dateutc';
										item.Value = item.PropertyValueDate;
										break;

									default:
										item.Value = null;
								}
							}

							return domain || 'description';
						}
					},
					sorting: {
						readonly: true
					},
					isunset: {
						readonly: true
					}
				}
			};
		};

		service.getDataTree2ModelLayout = function () {
			return {
				fid: 'model.administration.dataTree2ModelForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['modelfk', 'assignlocations', 'overwritelocations']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					modelfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'model-project-model-dialog'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Model',
								displayMember: 'Description',
								version: 3
							},
							width: 100
						},
						detail: {
							type: 'directive',
							directive: 'model-project-model-dialog',
							options: {
								descriptionMember: 'Description'
							}
						}
					}
				}
			};
		};

		service.getViewerSettingsContainerLayout = function () {

			return modelAdministrationViewerSettingsUIConfigurationService.getViewerSettingsContainerLayout();

		};

		service.getDataTreeTemplateLayout = function () {
			return {
				fid: 'model.administration.dataTreeTemplateForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['descriptioninfo','remark']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				]
			};
		};
		service.getDataTreeNodeTemplateLayout = function () {
			return {
				fid: 'model.administration.dataFilterTreeTemplate',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['description', 'nodetype', 'settingsjson','action','sorting']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				]
			};
		};

		return service;
	}
})(angular);


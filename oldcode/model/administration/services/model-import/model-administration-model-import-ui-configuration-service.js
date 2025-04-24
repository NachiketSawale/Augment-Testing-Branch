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
	 *
	 * @description
	 * The UI configuration service for the model import part of the model.administration module.
	 */
	angular.module(moduleName).factory('modelAdministrationModelImportUIConfigurationService',
		modelAdministrationModelImportUIConfigurationService);

	modelAdministrationModelImportUIConfigurationService.$inject = ['basicsLookupdataConfigGenerator',
		'modelAdministrationPropertyKeyDataService'];

	function modelAdministrationModelImportUIConfigurationService(basicsLookupdataConfigGenerator,
		modelAdministrationPropertyKeyDataService) {

		const service = {};

		service.getImportProfileContainerLayout = function () {
			return {
				fid: 'model.administration.importprofile',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['scope', 'descriptioninfo', 'remarkinfo']
					},
					{
						'gid': 'importConfigGroup',
						'attributes': ['shortenlongvalues']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					scope: {
						readonly: true
					}
				}
			};
		};

		service.getPropertyKeyRuleContainerLayout = function () {
			return {
				fid: 'model.administration.importpkrule',
				version: '1.0.0',
				showGrouping: true,
				addValidationAutomatically: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['descriptioninfo', 'sorting', 'stopprocessing']
					},
					{
						'gid': 'patternsGroup',
						'attributes': ['patterntypefk', 'namepattern', 'valuetypepattern', 'valuepattern']
					},
					{
						'gid': 'outputGroup',
						'attributes': ['suppress', 'newname', 'newvaluetype', 'propertykeynewfk', 'valuetypenewfk', 'basevaluetypenewfk', 'pktagids', 'newvalue', 'uomfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					patterntypefk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.mdlimportpatterntype', 'Description'),
					propertykeynewfk: {
						grid: {
							editor: 'lookup',
							editorOptions: {
								directive: 'model-main-property-key-dialog',
								lookupOptions: {
									showClearButton: true
								}
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
								descriptionMember: 'PropertyName',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					},
					valuetypenewfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.mdlvaluetype', 'Description'),
					basevaluetypenewfk: basicsLookupdataConfigGenerator.provideGenericLookupConfig('basics.customize.mdlbasevaluetype', 'Description'),
					pktagids: {
						detail: {
							type: 'directive',
							directive: 'model-administration-property-key-tag-selector',
							options: {
								model: 'PkTagIds',
								change: function (item) {
									modelAdministrationPropertyKeyDataService.markItemAsModified(item);
								}
							}
						},
						grid: {
							editor: 'directive',
							editorOptions: {
								model: 'PkTagIds',
								change: function (item) {
									modelAdministrationPropertyKeyDataService.markItemAsModified(item);
								},
								directive: 'model-administration-property-key-tag-selector',
							},
							width: 150,
							formatter: 'lookup',
							formatterOptions: {
								dataServiceName: 'modelAdministrationPropertyKeyTagSetLookupDataService',
								displayMember: 'DisplayName'
							}
						}
					},
					uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						showClearButton: true
					})
				}
			};
		};

		service.getPropertyProcessorContainerLayout = function () {
			return {
				fid: 'model.administration.importpropprocessor',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['propertykeyfk', 'processorkey', 'sorting', 'useinheritance', 'cleanup', 'overwrite']
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
								directive: 'model-main-property-key-dialog',
								lookupOptions: {
									showClearButton: true
								}
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
								descriptionMember: 'PropertyName',
								lookupOptions: {
									showClearButton: true
								}
							}
						}
					},
					processorkey: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelMainPropertyProcessorLookupDataService',
						enableCache: true
					})
				}
			};
		};

		return service;
	}
})(angular);

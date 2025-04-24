/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyUIConfigurationService
	 * @function
	 *
	 * @description
	 * The UI configuration service for property-key-related containers in the model.administration module.
	 */
	angular.module(moduleName).factory('modelAdministrationPropertyKeyUIConfigurationService',
		modelAdministrationPropertyKeyUIConfigurationService);

	modelAdministrationPropertyKeyUIConfigurationService.$inject = ['basicsLookupdataConfigGenerator',
		'modelAdministrationPropertyKeyDataService', 'basicsCustomizeModelValueTypeUtilityService'];

	function modelAdministrationPropertyKeyUIConfigurationService(basicsLookupdataConfigGenerator,
		modelAdministrationPropertyKeyDataService, basicsCustomizeModelValueTypeUtilityService) {

		const service = {};

		service.getPropertyKeyLayout = function () {
			return {
				fid: 'model.administration.propKeyForm',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['propertyname', 'valuetypefk', 'tagids']
					},
					{
						'gid': 'defaultsGroup',
						'attributes': ['usedefaultvalue', 'defaultvalue', 'basuomdefaultfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					propertyname: {
						readonly: true
					},
					valuetypefk: basicsLookupdataConfigGenerator.provideReadOnlyConfig('basics.customize.mdlvaluetype'),
					tagids: {
						detail: {
							type: 'directive',
							directive: 'model-administration-property-key-tag-selector',
							options: {
								model: 'TagIds',
								change: function (item) {
									modelAdministrationPropertyKeyDataService.markItemAsModified(item);
								}
							}
						},
						grid: {
							editor: 'directive',
							editorOptions: {
								model: 'TagIds',
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
					defaultvalue: {
						formatter: 'dynamic',
						editor: 'dynamic',
						domain: function (item) {
							let domain;

							if (item) {
								const vtInfo = basicsCustomizeModelValueTypeUtilityService.getValueTypeInfo(item.ValueType);
								if (vtInfo) {
									domain = vtInfo.domain;
									item.DefaultValue = item['DefaultValue' + vtInfo.typeSuffix];
								} else {
									item.DefaultValue = null;
								}
							}

							return domain || 'description';
						}
					},
					basuomdefaultfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsUnitLookupDataService',
						cacheEnable: true,
						additionalColumns: false
					})
				}
			};
		};

		service.getPropertyKeyTagLayout = function () {
			return {
				fid: 'model.administration.propKeyTagForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['propertykeytagcategoryfk', 'descriptioninfo', 'remarkinfo', 'userpropertykeytag', 'modelimportpropertykeytag', 'publicapipropertykeytag']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				overloads: {
					propertykeytagcategoryfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'modelAdministrationPropertyKeyTagCategoryLookupDataService'
					}, {
						required: true
					})
				}
			};
		};

		service.getPropertyKeyTagCategoryLayout = function () {
			return {
				fid: 'model.administration.propKeyTagCategoryForm',
				version: '1.0.0',
				showGrouping: true,
				groups: [
					{
						'gid': 'baseGroup',
						'attributes': ['descriptioninfo', 'remarkinfo']
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


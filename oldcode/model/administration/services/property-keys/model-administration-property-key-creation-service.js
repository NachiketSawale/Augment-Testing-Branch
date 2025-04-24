/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'model.administration';

	/**
	 * @ngdoc service
	 * @name modelAdministrationPropertyKeyCreationService
	 * @function
	 *
	 * @description
	 * Provides a dialog box and helper routines for creating new property keys.
	 */
	angular.module(moduleName).factory('modelAdministrationPropertyKeyCreationService',
		modelAdministrationPropertyKeyCreationService);

	modelAdministrationPropertyKeyCreationService.$inject = ['_', '$translate', '$q',
		'$http', 'basicsLookupdataConfigGenerator', 'platformTranslateService', 'platformModalFormConfigService',
		'modelAdministrationPropertyKeyTagDataService', 'modelAdministrationPropertyKeyDataService',
		'platformRuntimeDataService', 'basicsCustomizeModelValueTypeUtilityService', 'moment'];

	function modelAdministrationPropertyKeyCreationService(_, $translate, $q,
		$http, basicsLookupdataConfigGenerator, platformTranslateService, platformModalFormConfigService,
		modelAdministrationPropertyKeyTagDataService, modelAdministrationPropertyKeyDataService,
		platformRuntimeDataService, basicsCustomizeModelValueTypeUtilityService, moment) {

		const service = {};

		function setDefaultValueFieldsReadOnly(settings, readOnly) {
			platformRuntimeDataService.readonly(settings, [{
				field: 'DefaultValue',
				readonly: readOnly
			}, {
				field: 'BasUomDefaultFk',
				readonly: readOnly
			}]);
		}

		service.showDialog = function (config) {
			const actualConfig = _.assign({
				selectedTags: []
			}, config);

			const newPropKeySettings = {
				TagIds: actualConfig.selectedTags,
				DefaultValue: null
			};
			platformRuntimeDataService.readonly(newPropKeySettings, [{
				field: 'UseDefaultValue',
				readonly: true
			}]);
			setDefaultValueFieldsReadOnly(newPropKeySettings, true);

			return basicsCustomizeModelValueTypeUtilityService.getBasicValueTypeMapping().then(function (vtMapping) {
				const dlgConfig = {
					title: $translate.instant('model.administration.propertyKeys.newPropKey'),
					dataItem: newPropKeySettings,
					formConfiguration: {
						fid: 'model.administration.propkey.new',
						showGrouping: false,
						groups: [{
							gid: 'default'
						}],
						rows: [{
							gid: 'default',
							rid: 'name',
							label$tr$: 'cloud.common.entityName',
							model: 'PropertyName',
							type: 'description',
							maxLength: 255
						}, basicsLookupdataConfigGenerator.provideGenericLookupConfigForForm('basics.customize.mdlvaluetype', 'Description', {
							gid: 'default',
							rid: 'vt',
							model: 'ValueTypeFk',
							label$tr$: 'model.administration.propertyValueType',
							type: 'lookup',
							change: function (item) {
								if (item) {
									if (_.isInteger(item.ValueTypeFk)) {
										platformRuntimeDataService.readonly(item, [{
											field: 'UseDefaultValue',
											readonly: false
										}]);
									} else {
										item.UseDefaultValue = false;
										platformRuntimeDataService.readonly(item, [{
											field: 'UseDefaultValue',
											readonly: true
										}]);
									}

									const vt = vtMapping.idToValueType[item.ValueTypeFk];
									const vtInfo = basicsCustomizeModelValueTypeUtilityService.getValueTypeInfo(vt);
									if (vtInfo) {
										item.DefaultValue = item['DefaultValue' + vtInfo.typeSuffix];
									} else {
										item.DefaultValue = null;
									}

									if (_.isNil(item.DefaultValue)) {
										switch (vtInfo.domain) {
											case 'string':
												item.DefaultValue  = '';
												break;
											case 'integer':
												item.DefaultValue  = 0;
												break;
											case 'decimal':
												item.DefaultValue  = 0.0;
												break;
											case 'boolean':
												item.DefaultValue  = false;
												break;
											case 'dateutc':
												item.DefaultValue = moment();
												break;
											default:
												break;
										}
									}
								}
							}
						}), {
							gid: 'default',
							rid: 'usedefvals',
							label$tr$: 'model.administration.useDefaultValue',
							type: 'boolean',
							model: 'UseDefaultValue',
							change: function (item) {
								setDefaultValueFieldsReadOnly(item, !item.UseDefaultValue);
							}
						}, {
							gid: 'default',
							rid: 'defvalue',
							label$tr$: 'model.administration.defaultValue',
							type: 'dynamic',
							domain: function (item) {
								let domain;

								if (item) {
									const vt = vtMapping.idToValueType[item.ValueTypeFk];
									const vtInfo = basicsCustomizeModelValueTypeUtilityService.getValueTypeInfo(vt);
									if (vtInfo) {
										domain = vtInfo.domain;
									}
								}

								return domain || 'description';
							},
							model: 'DefaultValue',
							change: function (item) {
								if (item) {
									const vt = vtMapping.idToValueType[item.ValueTypeFk];
									const vtInfo = basicsCustomizeModelValueTypeUtilityService.getValueTypeInfo(vt);
									if (vtInfo) {
										item['DefaultValue' + vtInfo.typeSuffix] = item.DefaultValue;
									}
								}
							}
						}, basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true,
							additionalColumns: false
						}, {
							gid: 'default',
							rid: 'defuom',
							model: 'BasUomDefaultFk',
							label$tr$: 'model.administration.defaultUoM'
						}), {
							gid: 'default',
							rid: 'tags',
							label$tr$: 'model.administration.propertyKeys.tags',
							type: 'directive',
							directive: 'model-administration-property-key-tag-selector',
							options: {
								model: 'TagIds'
							}
						}]
					},
					dialogOptions: {
						disableOkButton: function disableOkButton() {
							return !newPropKeySettings.PropertyName || !_.isInteger(newPropKeySettings.ValueTypeFk);
						}
					}
				};

				platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
				return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
					if (result.ok) {
						platformRuntimeDataService.clear(result.data);
						_.unset(result.data, 'DefaultValue');

						// cloning necessary due to the issue reported in ALM 111168
						return _.cloneDeep(result.data);
					} else {
						return $q.reject('No property key created.');
					}
				});
			});
		};

		service.createPropertyKeyWithDialog = function (config) {
			const actualConfig = _.assign({
				fromAdminModule: false,
				selectedTags: []
			}, config);

			return service.showDialog({
				selectedTags: actualConfig.selectedTags
			}).then(function (result) {
				return $http.post(globals.webApiBaseUrl + 'model/administration/propertykey/createandsave', _.assign({
					FromUserModule: !actualConfig.fromAdminModule
				}, result)).then(function (response) {
					return response.data;
				}, function (reason) {
					return $q.reject(reason);
				});
			}, function (reason) {
				return $q.reject(reason);
			});
		};

		service.patchCreateButton = function (scope) {
			scope.addTools([{
				id: 'create',
				type: 'item',
				iconClass: 'tlb-icons ico-rec-new',
				fn: function () {
					const selTags = modelAdministrationPropertyKeyTagDataService.getSelectedEntities();
					return service.createPropertyKeyWithDialog({
						fromAdminModule: true,
						selectedTags: _.map(selTags, function (tag) {
							return tag.Id;
						})
					}).then(function (item) {
						return modelAdministrationPropertyKeyDataService.showAdditionalPropertyKey(item);
					});
				},
				disabled: function () {
					return false;
				}
			}]);
		};

		return service;
	}
})(angular);

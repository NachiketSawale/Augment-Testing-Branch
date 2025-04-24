/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';
	const moduleName = 'basics.common';

	/**
	 * @ngdoc service
	 * @name basicsCommonFieldParamDialogService
	 * @function
	 *
	 * @description
	 * Provides a dialog box for configuring parameters for parametrizeable fields.
	 */
	angular.module(moduleName).factory('basicsCommonFieldParamDialogService',
		basicsCommonFieldParamDialogService);

	basicsCommonFieldParamDialogService.$inject = ['_', '$translate', '$q',
		'platformTranslateService', 'platformModalFormConfigService', 'platformRuntimeDataService'];

	function basicsCommonFieldParamDialogService(_, $translate, $q,
		platformTranslateService, platformModalFormConfigService, platformRuntimeDataService) {

		const service = {};

		service.showDialog = function (config, fieldInfo) {

			const prmSettings = {
				Operands: _.map(fieldInfo.Parameters, function (prm) {
					return {
						Index: prm.ParameterName
					};
				}),
				pInfo: _.map(fieldInfo.Parameters, function (prm, idx) {
					return {
						DescriptionInfo: {
							Translated: prm.Name
						},
						Index: idx,
						allowEnvironmentExpression: true,
						allowFieldRef: false,
						allowLiteral: true,
						allowDynamicRangeExpression: true,
						editable: true,
						DisplaydomainFk: config.editorManager.getDisplayDomainIdByUiType(prm.UiTypeId)
					};
				})
			};

			const dlgConfig = {
				title: $translate.instant('basics.common.fieldSelector.fieldParamTitle'),
				dataItem: prmSettings,
				formConfiguration: {
					fid: 'basics.common.bulkexpr.fieldprms',
					showGrouping: false,
					groups: [{
						gid: 'default'
					}],
					rows: _.map(fieldInfo.Parameters, function (prm, idx) {
						return {
							gid: 'default',
							rid: 'p_' + idx,
							label: prm.Name,
							model: 'p[' + idx + ']',
							type: 'directive',
							directive: 'basics-common-rule-operand-editor-for-form',
							options: {
								Parameter: {},
								Entity: prmSettings,
								operand: prmSettings.pInfo[idx],
								model: prmSettings.Operands[idx],

								// operand: 'entity.pInfo[' + idx + ']',
								ruleEditorManager: config.editorManager,
								// model: 'p[' + idx + ']',
								entity: 'entity'
							}
						};
					})
				}
			};

			platformTranslateService.translateFormConfig(dlgConfig.formConfiguration);
			return platformModalFormConfigService.showDialog(dlgConfig).then(function (result) {
				if (result.ok) {
					platformRuntimeDataService.clear(result.data);
					// _.unset(result.data, 'DefaultValue');

					return {
						name: result.data.CustomAlias,
						operands: _.map(result.data.Operands, function (op, opIdx) {
							op.Index = fieldInfo.Parameters[opIdx].ParameterName;
							return op;
						})
					};
				} else {
					return $q.reject('Parameter input cancelled.');
				}
			});
		};

		return service;
	}
})(angular);

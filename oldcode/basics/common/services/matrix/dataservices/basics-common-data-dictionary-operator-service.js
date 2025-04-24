/*
 * $Id: basics-common-data-dictionary-operator-service.js 553243 2019-08-02 11:20:47Z saa\hof $
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	/**
	 * @ngdoc service
	 * @name basics.common.basicsCommonDataDictionaryOperatorService
	 * @function
	 * @requires $q, $http, _, $injector
	 *
	 * @description Retrieves and stores operator definitions that are compatible with data dictionary-based
	 *              bulk expressions.
	 */
	angular.module('basics.common').factory('basicsCommonDataDictionaryOperatorService', ['$q', '$http', '_', '$injector', 'globals',
		function ($q, $http, _, $injector, globals) {
			const service = {};

			const state = {
				operators: null
			};

			service.getOperators = function () {
				if (!state.operators) {
					state.operators = $http.get(globals.webApiBaseUrl + 'basics/common/bulkexpr/schema/allOperators').then(function processOperatorData(response) {
						if (_.isEmpty(response.data)) {
							return $q.reject();
						}

						const basicsCommonRuleEditorService = $injector.get('basicsCommonRuleEditorService');

						const ruleEditorOperators = [];

						// ids of operators which need extra operands
						const addOperandsTo = [
							33554444, // between
							100663308 // not between
						];

						response.data.forEach(function (op) {
							let targetTypes;
							if (op.OnlyForNullable || (op.ConditionTypeFk === 1)) {
								targetTypes = [0];
							} else {
								targetTypes = _.uniq(_.map(op.UiTypes, function (uiType) {
									return basicsCommonRuleEditorService.getDisplayDomainIdByUiType(uiType);
								}));
							}

							if(addOperandsTo.includes(op.IntId))
							{
								let variableRangeParam = _.cloneDeep(op.Parameters.at(-1));
								variableRangeParam.paramAdded = true;
								op.Parameters.push(variableRangeParam);
							}

							targetTypes.forEach(function (displayDomainFk) {
								ruleEditorOperators.push({
									Id: op.IntId,
									Symbol: op.Symbol,
									DescriptionInfo: {
										Description: op.StringId,
										Translated: op.DisplayName
									},
									ConditionTypeFk: op.ConditionTypeFk,
									DisplaydomainFk: displayDomainFk,
									Sorting: targetTypes.length + 1,
									OnlyForNullable: !!op.OnlyForNullable,
									Parameters: _.concat({
										DescriptionInfo: {
											Description: 'p0',
											Translated: '' // TODO: insert meaningful text here
										},
										DisplaydomainFk: displayDomainFk,
										allowFieldRef: true,
										allowLiteral: false,
										allowEnvironmentExpression: false,
										allowDynamicRangeExpression: addOperandsTo.includes(op.IntId),
										countOfAddedParams: 0
									}, _.map(op.Parameters || [], function (prm, prmIndex) {
										const prmResult = {
											DescriptionInfo: {
												Description: 'p' + (prmIndex + 1),
												Translated: prm.DisplayText
											},
											allowFieldRef: !prm.IsSet,
											allowEnvironmentExpression: true,
											allowRangeExpression: prm.AllowRange,
											allowDynamicRangeExpression: addOperandsTo.includes(op.IntId) && prmIndex === 0,
											editable: true,
											IsSet: !!prm.IsSet,
											TargetId: _.isNumber(prm.TargetId) ? prm.TargetId : null,
											TargetKind: prm.TargetKind,
											countOfAddedParams: op.Parameters && op.Parameters.length > 0 && addOperandsTo.includes(op.IntId) ? op.Parameters.filter(param => param.paramAdded).length : 0
										};

										if (prm.UiType) {
											prmResult.DisplaydomainFk = basicsCommonRuleEditorService.getDisplayDomainIdByUiType(prm.UiType);
										} else {
											prmResult.DisplaydomainFk = displayDomainFk;
											prmResult.TargetId = _.isNil(op.TargetId) ? null : op.TargetId;
											prmResult.TargetKind = _.isNil(op.TargetId) ? null : op.TargetKind;
										}

										prmResult.allowLiteral = (prm.UiType !== 'reference') && (prm.UiType !== 'relationset');
										// TODO: prm.TargetId & prm.TargetKind

										return prmResult;
									})),
									ignoreClientFunctions: true
								});
							});
						});

						// This line is meant to ensure that exactly what is returned is also stored in state.operators.
						return state.operators = ruleEditorOperators; // jshint ignore:line
					});
				}
				return $q.when(state.operators);
			};

			return service;
		}]);
})();
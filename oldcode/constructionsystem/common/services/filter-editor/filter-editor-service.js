/**
 * Created by wui on 7/26/2016.
 */
/* jshint -W089 */
/* global globals */
(function (angular) {
	'use strict';

	var moduleName = 'constructionsystem.common';

	angular.module(moduleName).factory('constructionSystemCommonFilterEditorService', ['$http', '$q', '$translate',
		'constructionsystemCommonPropertyValueTypeService',
		function ($http, $q, $translate, valueTypeService) {
			var viewModels = {};
			var cmInstances = {};

			var filterUrl = globals.appBaseUrl + 'constructionSystem.common/directives/filter-editor/filterscript.json';
			var getPropertyDefUrl = globals.webApiBaseUrl + 'model/administration/propertykey/listwithvaluetype';
			var getFieldKeyDefUrl = globals.webApiBaseUrl + 'constructionsystem/master/selectionstatement/getfieldkeylist';

			function ScriptViewModel(id) {
				this.id = id;
				this.language = null;
				this.dataLanguageId = null;
				this.isLoad = false;
				this.filterDef = {
					methods: {},
					operators: [],
					keywords: [],
					ov: [],
					propertyTypes: []
				};
				this.propertyDef = [];
				this.msgTemplate = {
					propertyNameUndefined: {
						keyPath: 'constructionsystem.common.msgTemplate.propertyNameUndefined',
						description: 'The {a} property is undefined.'
					},
					propertyNameError: {
						keyPath: 'constructionsystem.common.msgTemplate.propertyNameError',
						description: 'Missing {a} near {b}, eg: [propertyName].'
					},
					variableNameUndefined: {
						keyPath: 'constructionsystem.common.msgTemplate.variableNameUndefined',
						description: 'The {a} variable is undefined.'
					},
					variableNameError: {
						keyPath: 'constructionsystem.common.msgTemplate.variableNameError',
						description: 'Missing {a} near variable {b}, eg: @[variableName].'
					},
					notSupport: {
						keyPath: 'constructionsystem.common.msgTemplate.notSupport',
						description: '{a} is not supported. please use {b}'
					},
					missingError: {
						keyPath: 'constructionsystem.common.msgTemplate.missingError',
						description: 'Missing {a} near {b}'
					},
					value: {
						keyPath: 'constructionsystem.common.msgTemplate.value',
						description: 'value'
					},
					operator: {
						keyPath: 'constructionsystem.common.msgTemplate.operator',
						description: 'operator'
					},
					syntaxError: {
						keyPath: 'constructionsystem.common.msgTemplate.syntaxError',
						description: 'Syntax error near {a}'
					}
				};
			}

			ScriptViewModel.prototype.clear = function () {
				this.propertyDef = [];
			};

			ScriptViewModel.prototype.loadKeyWordsDef = function () {
				var self = this;
				var getFilterDefPromise;
				var getPropertyDefPromise;
				var getFieldKeyDefPromise;

				var deferred = $q.defer();

				if (self.isLoad) {
					deferred.resolve(self.getKeyWordsDefs());
				} else {

					(function translateMessageTemplate() {
						function translate(key) {
							var translateResult = {translated: false, value: ''};
							translateResult.value = $translate.instant(key);
							if (translateResult.value === key) {
								return translateResult;
							} else {
								translateResult.translated = true;
								return translateResult;
							}
						}

						for (var propName in self.msgTemplate) {
							if (Object.prototype.hasOwnProperty.call(self.msgTemplate,propName)) {
								var propValue = self.msgTemplate[propName];
								var translation = translate(propValue.keyPath);
								if (translation.translated === true) {
									propValue.description = translation.value;
								}
							}
						}
					})();


					getFilterDefPromise = $http.get(filterUrl).then(function (response) {
						var def = response.data;
						var methods = {};
						var funcReg = new RegExp(/fn\(([\w\W]*[^)]*)\)(\s*->\s*([\w\W]+))*/);
						for (var m in def) {
							formatMethod(m, def[m]);
						}
						function trim(str) {
							var reg = new RegExp(/\s+/);
							str = str.replace(reg, '');
							return str;
						}

						function formatMethod(m, dm) {
							var method = {name: m, paramCount: 0, params: [], resultType: '', text: m, description: ''};
							if (funcReg.test(dm['!type'])) {
								var match = funcReg.exec(dm['!type']);
								if (match && match[1]) {
									var p = match[1].split(',');
									method.paramCount = p.length;
									for (var n = 0, plen = p.length; n < plen; n++) {
										var pt = p[n].split(':');
										method.params.push({name: trim(pt[0]), type: trim(pt[1])});
									}
								}
								method.resultType = match[3];
								method.description = $translate.instant(dm['!doc'] || '');
								methods[m] = method;
							}
						}

						self.filterDef.methods = methods;
						self.filterDef.keywords = ['and', 'or', 'And', 'Or', 'AND', 'OR'];
						self.filterDef.operators = ['like', 'not like', '=', '<>', '>', '<', '>=', '<='];
						self.filterDef.ov = ['is null', 'is not null', 'exists', 'not exists'];
						self.filterDef.atom = ['true', 'false'];
					});

					getPropertyDefPromise = $http.get(getPropertyDefUrl).then(function (response) {
						var propertyDef = [];
						var tempData = response.data;
						if (tempData) {
							for (var j = 0, l = tempData.length; j < l; j++) {
								var prop = {type: '', name: '', text: '', description: ''};
								var p = tempData[j];
								prop.type = p.ValueType;
								prop.name = p.PropertyName;
								prop.text = '[' + p.PropertyName + ']';
								prop.description = valueTypeService.getValueTypeDescription(prop.type);
								propertyDef.push(prop);
							}
						}
						self.propertyDef = propertyDef;
					});

					getFieldKeyDefPromise = $http.get(getFieldKeyDefUrl).then(function (response) {
						var fieldKeyDef = [];
						var tempData = response.data;
						if (tempData) {
							for (var j = 0, l = tempData.length; j < l; j++) {
								var prop = {type: '', name: '', text: '', description: ''};
								var p = tempData[j];
								prop.type = p.valueType;
								prop.name = p.propertyName;
								prop.text = '[' + p.propertyName + ']';
								prop.description = valueTypeService.getValueTypeDescription(prop.type);
								fieldKeyDef.push(prop);
							}
						}
						self.fieldKeyDef = fieldKeyDef;
					});

					$q.all([getFilterDefPromise, getPropertyDefPromise, getFieldKeyDefPromise]).then(function () {

						// merge object property and field
						self.propertyDef = self.propertyDef.concat(self.fieldKeyDef);

						self.isLoad = true;

						deferred.resolve(self.getKeyWordsDefs());
					});
				}

				return deferred.promise;
			};

			ScriptViewModel.prototype.getKeyWordsDefs = function () {
				return [this.filterDef, this.propertyDef, this.msgTemplate];
			};

			return {
				get: function (scriptId) {
					if (!viewModels[scriptId]) {
						viewModels[scriptId] = new ScriptViewModel(scriptId);
					}
					return viewModels[scriptId];
				},
				registerCm: function (id, cm) {
					if (id) {
						cmInstances[id] = cm;
					}
				},
				unregisterCm: function (id, cm) {
					if (id && cmInstances[id] === cm) {
						cmInstances[id] = null;
					}
				},
				getCm: function (id) {
					return cmInstances[id];
				}
			};
		}
	]);

})(angular);
/**
 * Created by mov on 4/12/2018.
 */

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).factory('estimateMainSelStatementFilterEditorService', ['$http', '$q', '$translate', '$injector',
		'constructionsystemCommonPropertyValueTypeService', 'estimateMainSelStatementFilterEditorTranslateService',
		function ($http, $q, $translate, $injector, valueTypeService, translateMappingService) {
			let viewModels = {};
			let cmInstances = {};

			let filterUrl = globals.appBaseUrl + 'estimate.main/directives/selection-statement/filter-editor/filterscript.json';
			let getPropertyDefUrl = globals.webApiBaseUrl + 'estimate/main/selstatement/getfilterproperties';

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
				let self = this;
				let getFilterDefPromise;
				let getPropertyDefPromise;

				let deferred = $q.defer();

				if (self.isLoad) {
					deferred.resolve(self.getKeyWordsDefs());
				} else {

					(function translateMessageTemplate() {
						for (let propName in self.msgTemplate) {
							// eslint-disable-next-line no-prototype-builtins
							if (self.msgTemplate.hasOwnProperty(propName)) {
								let propValue = self.msgTemplate[propName];
								let translation = translateMappingService.translate(propValue.keyPath);
								if (translation.translated === true) {
									propValue.description = translation.value;
								}
							}
						}
					})();

					getFilterDefPromise = $http.get(filterUrl).then(function (response) {
						let def = response.data;
						let methods = {};
						// eslint-disable-next-line no-useless-escape
						let funcReg = new RegExp(/fn\(([\w\W]*[^\)]*)\)(\s*\-\>\s*([\w\W]+))*/);
						for (let m in def) {
							// eslint-disable-next-line no-prototype-builtins
							if (def.hasOwnProperty(m)){
								formatMethod(m, def[m]);
							}
						}
						function trim(str) {
							let reg = new RegExp(/\s+/);
							str = str.replace(reg, '');
							return str;
						}

						function formatMethod(m, dm) {
							let method = {name: m, paramCount: 0, params: [], resultType: '', text: m, description: ''};
							if (funcReg.test(dm['!type'])) {
								let match = funcReg.exec(dm['!type']);
								if (match && match[1]) {
									let p = match[1].split(',');
									method.paramCount = p.length;
									for (let n = 0, plen = p.length; n < plen; n++) {
										let pt = p[n].split(':');
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
						let propertyDef = [];
						let tempData = response.data;

						if (tempData) {
							// mapping data types from server to client side
							let typeDictionary = {};
							typeDictionary.string = 1;
							typeDictionary.decimal = typeDictionary.integer = typeDictionary.number = 2;
							typeDictionary.boolean = 4;
							typeDictionary.datetime = typeDictionary.date = 5;

							for (let j = 0, l = tempData.length; j < l; j++) {
								let p = tempData[j];
								let prop = {type: '', name: '', text: '', description: '', source: p.KeyPath};

								prop.type = typeDictionary[p.ValueType];

								let translation = translateMappingService.resolveTranslate(p.KeyPath);
								if (translation.translated === true) {
									prop.text = prop.name = '[' + translation.value + ']';
								}else{
									// display the property name
									prop.text = prop.name ='[' + p.KeyPath + ']';
									// eslint-disable-next-line no-console
									console.warn('field ' + p.KeyPath + '  is not translated.');
								}

								prop.description = valueTypeService.getValueTypeDescription(prop.type);
								propertyDef.push(prop);
							}
						}
						self.propertyDef = propertyDef;
					});

					$q.all([getFilterDefPromise, getPropertyDefPromise]).then(function () {
						self.isLoad = true;
						$injector.get('estimateMainLineItemSelStatementListService').refreshToShowTranslations.fire();
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

/**
 * Created by wui on 12/16/2015.
 */

(function (angular) {
	/* global globals */
	'use strict';

	let moduleName = 'estimate.rule';

	angular.module(moduleName).factory('estimateRuleScriptEditorService', ['$http',
		function($http){
			let hintUrl = globals.webApiBaseUrl + 'basics/common/script/hint';
			let viewModels = {};
			let variablesFromParameter = {};
			let cmInstances = {};

			function ScriptViewModel(id) {
				this.id = id;
				this.apiId = [];
				this.global = {
					server: [],
					client: []
				};
				this.typeSystem = {};
				this.hintSystem = {};
			}

			ScriptViewModel.prototype.clear = function(){
				this.apiId = [];
				this.global = {
					server: [],
					client: []
				};
				this.typeSystem = {};
				this.hintSystem = {};
			};

			ScriptViewModel.prototype.loadHintData = function(apiId) {
				let self = this;
				if(self.apiId === apiId){
					return;
				}
				self.clear();
				self.apiId = apiId;
				if(apiId) {
					$http.get(hintUrl + '?apiId=' + apiId).then(function (response) {
						response.data.forEach(function (item) {
							let hintName = item.ClassName;
							let hintData = item.Hint;
							let obj = {};
							let list = [];

							hintData.forEach(function (child) {
								list.push(child);
								obj[child.Name] = child.ReturnType;
							});

							self.typeSystem[hintName] = obj;
							self.hintSystem[hintName] = list;

							if (item.IsGlobal) {
								self.global.server.push({
									name: item.GlobalName,
									type: item.ClassName,
									description: 'global'
								});
							}
						});

						// add parameter list to global variable 'pe'
						self.addGlobalVariable(variablesFromParameter[self.id]);
						variablesFromParameter[self.id] = null;
					});
				}
			};

			ScriptViewModel.prototype.getGlobalScope = function() {
				let scope = {};
				this.global.client.forEach(function (item) {
					scope[item.name] = item.type;
				});
				this.global.server.forEach(function (item) {
					scope[item.name] = item.type;
				});
				return scope;
			};

			ScriptViewModel.prototype.getGlobalType = function(name) {
				let scope = this.getGlobalScope();
				return scope[name];
			};

			ScriptViewModel.prototype.getVariableHints = function () {
				let client = this.global.client.map(function (item) {
					return {
						text: item.name,
						displayText: item.name + ' ' + item.description
					};
				});
				let server = this.global.server.map(function (item) {
					return {
						text: item.name,
						displayText: item.name + ' ' + item.description
					};
				});
				return client.concat(server);
			};

			ScriptViewModel.prototype.getExpType = function(context) {
				let type, item, ts = this.typeSystem;

				while (context.length && angular.isObject(ts)) {
					item = context.shift();
					type = item.id;

					// array type
					if (/\[\]$/.test(type)) {
						if (item.isElement) {
							// get element type
							type = type.substr(0, type.length - 2);
						}
					}

					ts = ts[/\[\]$/.test(type) ? 'ArrayInstance' : type];

					if (angular.isString(ts)) {
						type = ts;

						// array type
						if (/\[\]$/.test(type)) {
							if (item.isElement) {
								// get element type
								type = type.substr(0, type.length - 2);
							}
						}

						ts = this.typeSystem[/\[\]$/.test(type) ? 'ArrayInstance' : type];
					}
				}

				return type;
			};

			ScriptViewModel.prototype.getContextHints = function(context) {
				let hints = [];
				let type = this.getExpType(context);

				if (type) {
					if (/\[\]$/.test(type)) { // array type
						type = 'ArrayInstance';
					}
					if (this.hintSystem[type]) {
						hints = hints.concat(this.hintSystem[type].map(hintObjectFormatter));
					}
				}

				hints = hints.concat(this.hintSystem.ObjectInstance.map(hintObjectFormatter));
				return hints;
			};

			ScriptViewModel.prototype.getPropertyHints = function () {
				let properties = [];
				for (let pn in this.hintSystem) {
					// eslint-disable-next-line no-prototype-builtins
					if (this.hintSystem.hasOwnProperty(pn)) {
						let prop = this.hintSystem[pn];
						properties = properties.concat(prop.filter(isProperty));
					}
				}
				return properties.map(hintObjectFormatter);
			};

			ScriptViewModel.prototype.getMethodHints = function() {
				let methods = [];
				for (let pn in this.hintSystem) {
					// eslint-disable-next-line no-prototype-builtins
					if (this.hintSystem.hasOwnProperty(pn)) {
						let prop = this.hintSystem[pn];
						methods = methods.concat(prop.filter(isMethod));
					}
				}
				return methods.map(hintObjectFormatter);
			};

			ScriptViewModel.prototype.getMemberHints = function(){
				let members = [];
				for (let pn in this.hintSystem) {
					// eslint-disable-next-line no-prototype-builtins
					if (this.hintSystem.hasOwnProperty(pn)) {
						let prop = this.hintSystem[pn];
						members = members.concat(prop);
					}
				}
				return members;
			};

			ScriptViewModel.prototype.addGlobalVariable = function(value) {
				let self = this;
				self.global.client = angular.isArray(value) ? value : [];
				self.typeSystem.ParameterEnumInstance = {};
				self.hintSystem.ParameterEnumInstance = [];
				self.global.client.forEach(function (item) {
					self.typeSystem.ParameterEnumInstance[item.name] = item.type;
					self.hintSystem.ParameterEnumInstance.push({
						Name: item.name,
						Description: item.name,
						ReturnType: item.type,
						IsProperty: true,
						IsMethod: false
					});
				});
			};

			function hintObjectFormatter(item) {
				return {text: item.Name, displayText: item.Description};
			}

			function isProperty(item) {
				return item.IsProperty;
			}

			function isMethod(item) {
				return item.IsMethod;
			}

			return {
				get: function(scriptId) {
					if (!viewModels[scriptId]) {
						viewModels[scriptId] = new ScriptViewModel(scriptId);
					}
					return viewModels[scriptId];
				},
				addGlobalVariable: function (scriptId, value) {
					if (viewModels[scriptId]) {
						viewModels[scriptId].addGlobalVariable(value);
					}
					else {
						variablesFromParameter[scriptId] = value;
					}
				},
				registerCm: function(id, cm) {
					if(id){
						cmInstances[id] = cm;
					}
				},
				unregisterCm: function(id, cm) {
					if (id && cmInstances[id] === cm) {
						cmInstances[id] = null;
					}
				},
				getCm: function(id) {
					return cmInstances[id];
				}
			};
		}
	]);

})(angular);

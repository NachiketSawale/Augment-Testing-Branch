/**
 * Created by wui on 7/26/2016.
 */

(function (angular) {
	'use strict';

	const moduleName = 'basics.common';

	angular.module(moduleName).factory('basicsCommonScriptEditorService', ['$http', '$q', '_', 'platformContextService', '$translate', 'globals',
		function ($http, $q, _, platformContextService, $translate, globals) {
			const viewModels = {};
			const cmInstances = {};
			let ecmaDef = {};
			const globalParameterCache = {};
			const getApiDefUrl = globals.webApiBaseUrl + 'basics/common/script/def';
			const getApiDefUrlV2 = globals.webApiBaseUrl + 'basics/common/script/def2';
			// obsolete logic about COS hint translation, should be deleted later.
			// var getUserDefUrl = globals.webApiBaseUrl + 'basics/common/script/getscriptdefinition';
			const saveUserDefUrl = globals.webApiBaseUrl + 'basics/common/script/savescriptdefinition';
			const getEcmaDefUrl = globals.appBaseUrl + 'basics.common/directives/script/ecmascript.json';
			const getEcmaDefPromise = $http.get(getEcmaDefUrl);

			getEcmaDefPromise.then(function (response) {
				ecmaDef = response.data;
			});

			function ScriptViewModel(id) {
				this.id = id;
				this.apiId = {};
				this.apiDef = {};
				this.paramDef = {};
				this.userDef = {};
				this.userDoc = {};
				this.globalParamDef = {};

				// add global parameter definition
				if (globalParameterCache[id]) {
					this.addGlobalVariable(globalParameterCache[id]);
					globalParameterCache[id] = null;
				}
			}

			ScriptViewModel.prototype.clear = function () {
				this.apiDef = {};
				this.paramDef = {};
				this.globalParamDef = {};
			};

			ScriptViewModel.prototype.loadApiDef = function (option) {
				const self = this;
				let getApiDefPromise;
				const deferred = $q.defer();

				if (self.apiDef['!name']) {
					deferred.resolve(self.getScriptDefs());
				} else {
					if (option.apiDef) {
						getApiDefPromise = $q.when(option.apiDef);
					} else if (option.apiId) {
						getApiDefPromise = $http.get((option.apiVersion === 2 ? getApiDefUrlV2 : getApiDefUrl) + '?apiId=' + option.apiId);
					} else {
						getApiDefPromise = $q.when({});
					}

					$q.all([getEcmaDefPromise, getApiDefPromise]).then(function (defs) {
						self.translate(defs[1].data, option.trSource);
						self.apiId = option.apiId;
						self.apiDef = angular.extend({'!name': 'apidef'}, defs[1].data);
						deferred.resolve(self.getScriptDefs());
					});
				}

				return deferred.promise;
			};

			function mergeDoc(def, doc, translate) {
				const copy = angular.copy(def);
				const language = platformContextService.getLanguage();

				function getDoc(defObj, docObj) {
					let doc = docObj['!doc'];

					if (Object.prototype.hasOwnProperty.call(docObj, '!tr') && angular.isObject(docObj['!tr'])) {
						if (translate) {
							const tr = docObj['!tr'][language];
							if (tr) {
								doc = tr;

							}
						} else {
							defObj['!tr'] = docObj['!tr'];
						}
					}

					if (doc) {
						defObj['!doc'] = doc;
					}
				}

				(function merge(defObj, docObj) {
					if (Object.prototype.hasOwnProperty.call(defObj, '!doc')) {
						getDoc(defObj, docObj);
					}

					_.forEach(defObj, function (item, name) {
						if (angular.isObject(item) && angular.isObject(docObj[name])) {
							merge(item, docObj[name]);
						}
					});
				})(copy, doc);

				return copy;
			}

			ScriptViewModel.prototype.getScriptDefs = function () {
				return [ecmaDef, mergeDoc(this.apiDef, this.userDoc, true), this.paramDef, this.globalParamDef];
			};

			ScriptViewModel.prototype.addVariable = function (items) {
				if (!items || !items.length) {
					return;
				}

				const self = this;

				this.paramDef = {'!name': 'gpscript'};
				items.forEach(function (item) {
					self.paramDef[item.name] = {
						'!type': item.type,
						'!doc': item.description,
						'!url': ''
					};
				});
			};

			ScriptViewModel.prototype.addGlobalVariable = function (items) {
				if (!items || !items.length) {
					return;
				}

				const self = this;

				this.globalParamDef = {'!name': 'gpscript'};
				items.forEach(function (item) {
					self.globalParamDef[item.name] = {
						'!type': item.type,
						'!doc': item.description,
						'!url': ''
					};
				});
			};

			ScriptViewModel.prototype.convertDef2List = function (def) {
				let list = [], globals = [];

				function convertTr(trObj) {
					const list = [];

					if (trObj === null || angular.isArray(trObj)) {
						return list;
					}

					_.forEach(trObj, function (value, name) {
						if (angular.isString(value) && angular.isString(name)) {
							list.push({
								k: name,
								v: value
							});
						}
					});
					return list;
				}

				_.forEach(def, function (item, name) {
					if (name.startsWith('!') || name.startsWith('__')) {
						return;
					}

					const listItem = {
						name: name,
						global: true,
						props: []
					};

					if (Object.prototype.hasOwnProperty.call(item, '!type')) {
						listItem.global = false;
						list.push(listItem);
					} else {
						globals.push(listItem);
					}

					if (Object.prototype.hasOwnProperty.call(item, 'prototype')) {
						const obj = item.prototype;
						_.forEach(obj, function (innerItem, innerName) {
							listItem.props.push({
								name: innerName,
								doc: innerItem['!doc'],
								proto: true,
								__tr: convertTr(innerItem['!tr'])
							});
						});
					}

					_.forEach(item, function (innerItem, innerName) {
						if (innerName.startsWith('!') || innerName === 'prototype' || innerName.startsWith('__')) {
							return;
						}
						listItem.props.push({
							name: innerName,
							doc: innerItem['!doc'],
							__tr: convertTr(innerItem['!tr'])
						});
					});

					listItem.props = [{
						name: '!doc',
						doc: item['!doc'],
						__tr: convertTr(item['!tr'])
					}].concat(_.orderBy(listItem.props, 'name'));
				});

				globals = _.orderBy(globals, 'name');
				list = _.orderBy(list, 'name');

				return globals.concat(list);
			};

			ScriptViewModel.prototype.convertList2Def = function (list) {
				const def = {};

				function convertTr(trList) {
					if (trList === null || !trList.length) {
						return;
					}

					const obj = {};
					_.forEach(trList, function (item) {
						if (item.v && item.k !== 'en') {
							obj[item.k] = item.v;
						}
					});
					return obj;
				}

				_.forEach(list, function (item) {
					const obj = {};

					_.forEach(item.props, function (prop) {
						if (prop.name === '!doc') {
							obj['!doc'] = prop.doc;
							obj['!tr'] = convertTr(prop.__tr);
						} else if (prop.proto) {
							if (obj.prototype === null) {
								obj.prototype = {};
							}
							obj.prototype[prop.name] = {
								'!doc': prop.doc,
								'!tr': convertTr(prop.__tr)
							};
						} else {
							obj[prop.name] = {
								'!doc': prop.doc,
								'!tr': convertTr(prop.__tr)
							};
						}
					});

					def[item.name] = obj;
				});
				return def;
			};

			ScriptViewModel.prototype.getApiList = function () {
				const self = this;
				return self.convertDef2List(mergeDoc(self.apiDef, self.userDoc));
			};

			ScriptViewModel.prototype.applyApiList = function (list) {
				this.userDoc = this.convertList2Def(list);
				if (!this.userDef) {
					this.userDef = {
						filterName: this.apiId,
						accessLevel: 'New'
					};
				}
				this.userDef.filterDef = JSON.stringify(this.userDoc);
				return $http.post(saveUserDefUrl, this.userDef);
			};

			ScriptViewModel.prototype.translate = function (def, prefix) {
				const self = this;

				if (def === null || !prefix) {
					return;
				}

				for (let pn in def) {
					if (Object.prototype.hasOwnProperty.call(def, pn)) {
						if (pn === '!doc') {
							const name = prefix + '.' + '!doc';
							const tr = $translate.instant(name);

							if (tr && tr.length && tr !== name) {
								def[pn] = tr;
							}
						} else {
							const value = def[pn];
							const newPrefix = prefix + '.' + pn;

							if (angular.isObject(value)) {
								self.translate(value, newPrefix);
							}
						}
					}
				}
			};

			ScriptViewModel.prototype.getApiDoc = function (def) {
				const self = this;

				for (const pn in def) {
					if (Object.prototype.hasOwnProperty.call(def, pn)) {
						if (pn === '!doc') {
							continue;
						}

						const value = def[pn];

						if (angular.isObject(value)) {
							self.getApiDoc(value);
						} else {
							delete def[pn];
						}
					}
				}

				return def;
			};

			return {
				get: function (scriptId) {
					if (!viewModels[scriptId]) {
						viewModels[scriptId] = new ScriptViewModel(scriptId);
					}
					return viewModels[scriptId];
				},
				addVariable: function (scriptId, value) {
					if (viewModels[scriptId]) {
						viewModels[scriptId].addVariable(value);
					} else {
						globalParameterCache[scriptId] = value;
					}
				},
				addGlobalVariable: function (scriptId, value) {
					if (viewModels[scriptId]) {
						viewModels[scriptId].addGlobalVariable(value);
					} else {
						globalParameterCache[scriptId] = value;
					}
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
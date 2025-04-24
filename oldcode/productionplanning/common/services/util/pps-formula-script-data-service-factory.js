(function (angular) {
	'use strict';
	/* global globals JSHINT _ */

	const moduleName = 'productionplanning.common';

	/**
	 * @ngdoc service
	 * @name ppsFormulaScriptDataServiceFactory
	 * @function
	 *
	 * @description A factory to create formula script service
	 */
	angular.module(moduleName).factory('ppsFormulaScriptDataServiceFactory', ppsFormulaScriptDataServiceFactory);

	ppsFormulaScriptDataServiceFactory.$inject = ['$q', '$http', '$translate', 'platformDialogService'];

	function ppsFormulaScriptDataServiceFactory($q, $http, $translate, platformDialogService) {
		const serviceCache = new Map();

		/**
		 * @ngdoc function
		 * @name getService
		 * @function getService
		 * @methodOf ppsFormulaScriptDataServiceFactory
		 * @description
		 * @param {service} parentService
		 * @param {string} scriptFkField e.g. BasClobsFk
		 * @param {string} scriptField the field where store script, e.g. ClobToSave.Context
		 * @param {object} otherParas another parameter and its fieldsGetterFn
		 * @param {function} readonlyFn optional custom readonly function
		 * @returns
		 */
		function getService(parentService, scriptFkField, scriptField, otherParas, readonlyFn = null) {
			let service = null;
			if (!parentService || !parentService.getServiceName) {
				return service;
			}

			const key = parentService.getServiceName() + '_FormulaScriptDataService';

			if (serviceCache.has(key)) {
				service = serviceCache.get((key));
			} else {
				service = createNewService(parentService, scriptFkField, scriptField, otherParas, readonlyFn);
				serviceCache.set(key, service);
			}

			return service;
		}

		function createNewService(parentService, scriptFkField, scriptField, otherParas, readonlyFn) {
			const service = {
				setCodeMirrorOptions: setCodeMirrorOptions,
				hasSelectedParentItem: hasSelectedParentItem,
				getSelectedParentItem: getSelectedParentItem,
				getScript: getScript,
				validateScript: validateScript,
			};

			const otherParaKeys = Object.keys(otherParas);

			const Context = {
				ProdDesc: {},
			};

			(function init() {
				Promise.all([
					getProdDescScriptContextParameters(),
					getCharacteristicsBySection(61),
					getCharacteristicsBySection(62)]).then(res => {
					Context.ProdDesc = res[0];
					Context.ProdDesc.Characteristics = res[1];
					Context.ProdDesc.Characteristics2 = res[2];
				});
			})();

			function setCodeMirrorOptions(scope) {
				const deferred = $q.defer();
				const result = {
					lineWrapping: true,
					lineNumbers: true,
					singleLine: false,
					scrollbarStyle: 'native',
					lint: true,
					showHint: true,
					readOnly: isReadonly() ? 'nocursor' : false,
					hintOptions: {
						get globalScope() {
							return { Context: copyObjectWithoutPrototype(Context) };
						}
					}
				};

				if (hasSelectedParentItem() && otherParaKeys && otherParaKeys.length > 0) {
					const promises = [];
					// get parameters of otherParas
					otherParaKeys.forEach(key => {
						promises.push((() => {
							return otherParas[key]($q, $http).then(res => {
								Context[key] = res;
							});
						})());
					});
					$q.all(promises).then(() => {
						scope.codeMirrorOptions = result;
						scope.codeMirrorReady = true;
						deferred.resolve(result);
					});
				} else {
					scope.codeMirrorOptions = result;
					scope.codeMirrorReady = true;
					deferred.resolve(result);
				}

				return deferred.promise;
			}

			function isReadonly() {
				if (_.isFunction(readonlyFn)) {
					return readonlyFn();
				}
				return !hasSelectedParentItem() || getSelectedParentItem()[scriptFkField] === null;
			}

			function hasSelectedParentItem() {
				return getSelectedParentItem() !== null;
			}

			function getSelectedParentItem() {
				const selected = parentService.getSelectedEntities();
				return selected && selected.length > 0 ? selected[0] : null;
			}

			function hasScript() {
				const selected = getSelectedParentItem();
				return _.get(selected, scriptField) || null;
			}

			function getScript() {
				if (hasSelectedParentItem() && hasScript()) {
					const selected = getSelectedParentItem();
					return _.get(selected, scriptField);
				}
				return null;
			}

			function validateScript(script, showinfobox = false) {
				let errors = checkContext(script, Context);

				// validate javascript syntax
				let valid = JSHINT(script, { 'undef': true, 'predef': ['Context'] });
				if (!valid) {
					errors = errors.concat(JSHINT.data().errors);
				}

				if (errors.length > 0) {
					platformDialogService.showErrorDialog(parseError(errors));
				} else if (showinfobox) {
					platformDialogService.showInfoBox('productionplanning.formulaconfiguration.script.validated');
				}

				return errors;
			}

			function getProdDescScriptContextParameters() {
				const deferred = $q.defer();
				$http.get(globals.webApiBaseUrl + 'productionplanning/common/formula/getproddesccontextparameters')
					.then((response) => {
						deferred.resolve(response.data);
					});
				return deferred.promise;
			}

			function getCharacteristicsBySection(section) {
				const deferred = $q.defer();
				$http.get(globals.webApiBaseUrl + 'basics/characteristic/characteristic/getcharacteristicbysectionfk?sectionFk=' + section)
					.then((response) => {
						const result = {};
						for (const data of response.data) {
							result[data.Code] = data.DefaultValue;
						}
						deferred.resolve(result);
					});
				return deferred.promise;
			}

			function checkContext(script, context) {
				let errors = [];
				if (script === null || script.trim() === '') {
					return errors;
				}

				errors = errors.concat(checkProp(script, context, 'Context').concat(
					checkProp(script, context.ProdDesc, 'ProdDesc')).concat(
					checkProp(script, context.ProdDesc.Characteristics, 'Characteristics')).concat(
					checkProp(script, context.ProdDesc.Characteristics2, 'Characteristics2')));

				otherParaKeys.forEach(key => errors = errors.concat(checkProp(script, context[key], key)));

				return errors;
			}

			function checkProp(script, prop, propName) {
				let p1 = new RegExp(propName + '\\s*=', 'mg');
				let p2 = new RegExp(propName + '\\.(\\w+)', 'mg');
				return checkReadonlyError(script, propName, p1).concat(
					checkUndefinedError(prop, script, propName, p2));
			}

			function checkReadonlyError(script, propName, pattern) {
				const error = [];
				script = removeStatementInComment(script);
				const isMatched = pattern.test(script);
				if (isMatched) {
					error.push({
						reason: $translate.instant('productionplanning.formulaconfiguration.script.isreadonly', { propName })
					});
				}
				return error;
			}

			function checkUndefinedError(obj, script, propName, pattern) {
				const errors = [];
				// get props not commented.
				const props = getMatchedProps(pattern, removeStatementInComment(script));
				for (const prop of props) {
					if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
						errors.push({
							reason:  $translate.instant('productionplanning.formulaconfiguration.script.isundefined', { propName, prop })
						});
					}
				}
				return errors;
			}

			function getMatchedProps(pattern, obj) {
				const match = [];
				let p = pattern.exec(obj);
				while (p) {
					match.push(p[1]);
					p = pattern.exec(obj);
				}
				return match;
			}

			function removeStatementInComment(script) {
				return script.replace(/\/\/\s*.*/mg, '') // remove //...
					.replace(/\/\*([^*]|[\r\n]|(\*+([^*/]|[\r\n])))*\*\/+/mg, ''); // remove /*...*/
			}

			function parseError(errors) {
				let output = '';
				for (const err of errors) {
					output += `${err.reason.trim('.')} ${err.line ? `in line: ${err.line}.` : ''}\\n`;
				}
				return output;
			}

			return service;
		}


		function copyObjectWithoutPrototype(objWithPrototype) {
			const obj = Object.assign(Object.create(null), objWithPrototype);

			for (const key of Object.keys(obj)) {
				if (obj[key] !== null && typeof obj[key] === 'object') {
					obj[key] = copyObjectWithoutPrototype(obj[key]);
				}
			}

			return obj;
		}

		return {
			getService: getService
		};
	}
})(angular);
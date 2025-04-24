(function (angular){
	/* global globals, _, katex */

	'use strict';

	let moduleName = 'controlling.configuration';

	angular.module(moduleName).factory('contrConfigFormulaImageService',['$sce','$translate','$http', '$injector', function ($sce, $translate, $http, $injector){

		let service = {};

		let scope = null;

		service.setScope = function (_scope){
			scope = _scope;
		};

		service.changeFormulaContent = function (formula, syncAction){
			if(!scope){
				return;
			}

			if(syncAction) {
				let currentSelected = $injector.get('controllingConfigurationFormulaDefinitionDataService').getSelected();
				if (currentSelected && currentSelected.Id !== formula.Id) {
					// this means selected Formula has been changed, and this function is invoked in sync
					// so, ignore this sync action
					return;
				}
			}

			if(!formula){
				scope.formulaImageSvg = 'no data!';
				scope.trustedHtml = '';
			}else{
				scope.formulaImageSvg = '';
			}

			let formulaStr = formula ? formula.Formula :'';
			let codes = [];
			if(formulaStr){
				let paramRegEx = new RegExp('([a-zA-Z_]+[a-zA-Z0-9_]*)', 'g');
				codes = formulaStr.match(paramRegEx);

				if(formulaStr.indexOf('/')>0){
					formulaStr = service.handleDivisionChar(formulaStr);
				}
			}

			handleCodeNShow(codes, formulaStr);
		};

		function handleCodeNShow(codes, exp){
			if (codes) {
				let replacedCode = [];
				_.forEach(codes, function (code){
					if(code === 'sqrt' || replacedCode.indexOf(code) >= 0){
						return;
					}
					replacedCode.push(code);
					let regex = new RegExp('\\b' + code + '\\b', 'g');
					exp = exp.replace(regex, '\\verb|'+ code +'|');

				});
			}

			let svgStr  = katex.renderToString(exp || '');
			scope.trustedHtml = $sce.trustAsHtml(svgStr.replace('aria-hidden="true"', 'style="display:none"'));
		}

		// convert a/b  to \frac{a}{b}
		service.handleDivisionChar = function (exp) {
			if (exp.indexOf('/') > -1) {
				let tab = [];
				let frac = '___frac___';
				while (exp.indexOf('(') > -1) {
					let old = exp;
					exp = exp.replace(/(\([^()]*\))/g, function(m, t) {
						tab.push(t);
						return (frac + (tab.length - 1));
					});
					if(old === exp){
						break;
					}
				}

				tab.push(exp);
				exp = frac + (tab.length - 1);
				while (exp.indexOf(frac) > -1) {
					let old = exp;
					exp = exp.replace(new RegExp(frac + '(\\d+)', 'g'), function(m, d) {
						return replacePowerWithPowFunction(tab[d]);
					});
					if(old === exp){
						break;
					}
				}
			}
			return exp;
		};

		function replacePowerWithPowFunction(expression) {
			function replaceSinglePower(str) {
				return str.replace(/([a-zA-Z0-9._]+)\s*\/\s*([a-zA-Z0-9._]+)/g, (match, base, exponent) => {
					return `\\frac{${base}}{${exponent}}`;
				});
			}

			let previous;
			do {
				previous = expression;
				expression = replaceSinglePower(expression);
			} while (previous !== expression);

			return expression;
		}

		return service;

	}]);

})(angular);
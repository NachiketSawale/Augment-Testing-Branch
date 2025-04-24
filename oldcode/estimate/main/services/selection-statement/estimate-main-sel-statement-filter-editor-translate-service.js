/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/* global _ */
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).service('estimateMainSelStatementFilterEditorTranslateService', [
		'$http', '$q', '$translate', '$injector',
		function ($http, $q, $translate, $injector) {

			let service = {};

			angular.extend(service, {
				translate: translate,
				resolveTranslate: resolveTranslate,
				getSelStatementTranslated: getSelStatementTranslated,
				getSelStatementToSave: getSelStatementToSave
			});

			// Dictionary properties names translated
			let _editorFields = {};

			return service;

			// /@keyPath is the property name to translate which comes from the Db
			function ensureValidKeyPath(keyPath){
				let keyPathToValidate =angular.copy(keyPath);
				let keyPathValidated = '';

				let estimateMainSelStatementFilterEditorService = $injector.get('estimateMainSelStatementFilterEditorService');
				let editorService = estimateMainSelStatementFilterEditorService.get('estSelStatement');
				if (editorService){
					let properties = angular.copy(editorService.getKeyWordsDefs()[1]);
					let property = _.find(properties, function(prop){
						if (keyPathToValidate.toLowerCase() === prop.source.toLowerCase()){
							return true;
						}
					});
					if (property){
						// Assign correct keyPath to translate
						keyPathValidated = property.source;
					}
				}

				return _.isEmpty(keyPathValidated) ? keyPathToValidate : keyPathValidated;
			}


			function resolveTranslate(keyPath, ensureKeyPath){

				if (ensureKeyPath){
					keyPath = ensureValidKeyPath(keyPath);
				}

				let translationPath = moduleName + '.lineItemSelStatement.scriptFields.' + keyPath;
				let translation = translate(translationPath);
				if (translation.translated === true) {
					_editorFields[translation.value] = keyPath;
				}
				return translation;
			}

			function translate(key) {
				let translateResult = {translated: false, value: ''};
				translateResult.value = $translate.instant(key);
				if (translateResult.value === key) {
					return translateResult;
				} else {
					translateResult.translated = true;
					return translateResult;
				}
			}

			function getPropNameFromTranslation(translated){
				return _editorFields[translated];
			}

			function getSelStatementTranslated(selStatement){
				let selStatementCopy = angular.copy(selStatement);
				let parsedValue = '';
				try{

					parsedValue = JSON.parse(selStatementCopy);
					let matchesToTranslate = parsedValue.match(/\[([^\]]+)]/g);
					if (_.size(matchesToTranslate) > 0){
						_.forEach(matchesToTranslate, function(match){
							let fieldMatch = /\[([^\]]+)]/.exec(match);
							let translation = resolveTranslate(fieldMatch[1], true);
							if (translation.translated === true){
								let translationValue = '[' + translation.value + ']';
								parsedValue = parsedValue.replace(fieldMatch[0], translationValue);
							}
						});
					}

				}catch(e){
					parsedValue =  selStatementCopy;
				}

				return parsedValue;
			}

			function getSelStatementToSave(selStatementTranslated){
				// It is already parsed at rendered event
				let selStatementTranslatedCopy = angular.copy(selStatementTranslated);
				let matchesToTranslate = selStatementTranslatedCopy.match(/\[([^\]]+)]/g);
				if (_.size(matchesToTranslate) > 0) {
					_.forEach(matchesToTranslate, function (match) {
						let fieldMatch = /\[([^\]]+)]/.exec(match);

						// we suppose field is already translated and we get the property name from it.
						let propName = getPropNameFromTranslation(fieldMatch[1]);
						if (!_.isEmpty(propName)){
							let propNameValue = '[' + propName + ']';
							selStatementTranslatedCopy = selStatementTranslatedCopy.replace(fieldMatch[0], propNameValue);
						}
					});
				}

				return JSON.stringify(selStatementTranslatedCopy);

			}
		}
	]);
})(angular);

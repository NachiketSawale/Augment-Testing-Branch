/**
 * Created by wuj on 2/4/2016.
 */
(function (angular) {

	'use strict';
	/**
	 * @ngdoc service
	 * @name basicsCommonMandatoryProcessor
	 * @function
	 *
	 * @description
	 * The basicsCommonMandatoryProcessor handle validate the required property
	 */

	angular.module('basics.common').service('basicsCommonMandatoryProcessor', BasicsCommonMandatoryProcessor);

	BasicsCommonMandatoryProcessor.$inject = ['_', '$injector', 'platformSchemaService', 'platformObjectHelper', 'platformRuntimeDataService'];

	function BasicsCommonMandatoryProcessor(_, $injector, platformSchemaService, objectHelper, platformRuntimeDataService) {
		function getValidationService(options) {
			if (angular.isObject(options.validationService)) {
				return options.validationService;
			}

			return $injector.get(options.validationService);
		}

		function getMustValidateFields(options, validationService) {
			let res = [];
			if (_.isBoolean(options.mustValidateFields) && validationService) {
				for (let prop in validationService) {
					if (Object.prototype.hasOwnProperty.call(validationService, prop) && (prop.startsWith('validate') || prop.startsWith('asyncValidate'))) {
						if (_.isFunction(validationService[prop])) {
							const fields = _.split(prop, 'alidate');
							if (fields.length === 2) {
								res.push(fields[1]);
							}
						}
					}
				}
			} else {
				res = options.mustValidateFields || [];
			}

			return res;
		}

		function isValid(result) {
			return result === true || (!!result && result.valid === true);
		}

		this.create = function createMandatoryProcessor(options) {
			const service = {};
			let mandatoryProperties = [],
				ignoreField = ['InsertedAt', 'InsertedBy', 'Version'],
				mustValidateFields = false,
				validationService;
			const mustValidateTranslationFields = [];

			/* jshint -W074 */
			service.validate = function validate(item) {
				if (!options.typeName || !options.moduleSubModule || !options.validationService) {
					return;
				}
				if (!objectHelper.isSet(item)) {
					return;
				}
				if (!validationService) {
					validationService = getValidationService(options);
					if (validationService && !mustValidateFields) {
						mustValidateFields = getMustValidateFields(options, validationService);
					}
				}
				if (!validationService) {
					return;
				}

				let domains;

				if (validationService && validationService.mandatoryProperties) {
					for (var propName in validationService.mandatoryProperties) {
						if (validationService.mandatoryProperties.hasOwnProperty(propName)) {
							let prop = validationService.mandatoryProperties[propName];
							if (prop.domain === 'translation') {
								mustValidateTranslationFields.push(propName);
							}
							mandatoryProperties.push(propName);
						}
					}
				}
				if (mandatoryProperties.length === 0) {
					domains = platformSchemaService.getSchemaFromCache({
						typeName: options.typeName,
						moduleSubModule: options.moduleSubModule
					}).properties;

					for (let prop in domains) {
						if ((Object.prototype.hasOwnProperty.call(domains, prop) && domains[prop].mandatory && !item[prop] && ignoreField.indexOf(prop) === -1) ||
							mustValidateFields.indexOf(prop) !== -1) {
							mandatoryProperties.push(prop);
							if (domains[prop].domain === 'translation') {
								mustValidateTranslationFields.push(prop);
							}
						}
					}
				}

				angular.forEach(mandatoryProperties, function (prop) {
					const tempProp = prop.replace(/\./g, '$');
					const syncProp = 'validate' + tempProp;
					const asyncProp = 'asyncValidate' + tempProp;
					let res = true;
					let value = null;

					if (validationService[syncProp]) {
						if (mustValidateTranslationFields.indexOf(prop) !== -1) {
							value = item[prop];
							if (value) {
								value = value.Translated;
							}
							const translationProp = prop + '.Translated';
							res = validationService[syncProp].call(this, item, value, translationProp, true);
						} else if (mustValidateFields.indexOf(prop) !== -1) {
							res = validationService[syncProp].call(this, item, item[prop], prop, true);
						} else {
							res = validationService[syncProp].call(this, item, null, prop, true);
						}
						service.showUIErrorHint(res, item, prop);
					}

					if (isValid(res) && validationService[asyncProp]) {
						validationService[asyncProp].call(this, item, item[prop], prop, true).then(function (result) {
							service.showUIErrorHint(result, item, prop);
						});
					}
				});
			};

			service.showUIErrorHint = function showUIErrorHint(result, item, model) {
				if (result === false || (!!result && result.valid === false) ||
					result === true || (!!result && result.valid === true)) {
					platformRuntimeDataService.applyValidationResult(result, item, model);
				}
			};

			return service;
		};
	}
})(angular);
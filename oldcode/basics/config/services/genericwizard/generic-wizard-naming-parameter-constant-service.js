(function () {
	'use strict';
	const moduleName = 'basics.config';

	angular.module(moduleName).constant('genericWizardNamingParameterTypeConstant', {
		mailSubject: {
			id: 1,
			titleTr: 'basics.config.genWizardNamingParameter.namingTypes.mailSubject'
		},
		exportFile: {
			id: 2,
			titleTr: 'basics.config.genWizardNamingParameter.namingTypes.exportFile'
		},
		exportReport: {
			id: 3,
			titleTr: 'basics.config.genWizardNamingParameter.namingTypes.exportReport'
		}
	});

	angular.module(moduleName).constant('genericWizardNamingParameterConstant',
		[
			{
				name: 'projectDescription',
				nameTr: 'basics.config.genWizardNamingParameter.projectDescription',
				id: 1,
				pattern: '{a+}'
			},
			{
				name: 'projectCode',
				nameTr: 'basics.config.genWizardNamingParameter.projectCode',
				id: 2,
				pattern: '{b+}'
			},
			{
				name: 'packageDescription',
				nameTr: 'basics.config.genWizardNamingParameter.packageDescription',
				id: 3,
				pattern: '{c+}'
			},
			{
				name: 'packageCode',
				nameTr: 'basics.config.genWizardNamingParameter.packageCode',
				id: 4,
				pattern: '{d+}'
			},
			{
				name: 'requisitionDescription',
				nameTr: 'basics.config.genWizardNamingParameter.requisitionDescription',
				id: 5,
				pattern: '{e+}'
			},
			{
				name: 'requisitionCode',
				nameTr: 'basics.config.genWizardNamingParameter.requisitionCode',
				id: 6,
				pattern: '{f+}'
			},
			{
				name: 'rfqDescription',
				nameTr: 'basics.config.genWizardNamingParameter.rfqDescription',
				id: 7,
				pattern: '{g+}'
			},
			{
				name: 'rfqCode',
				nameTr: 'basics.config.genWizardNamingParameter.rfqCode',
				id: 8,
				pattern: '{h+}'
			},
			{
				name: 'contractDescription',
				nameTr: 'basics.config.genWizardNamingParameter.contractDescription',
				id: 9,
				pattern: '{i+}'
			},
			{
				name: 'contractCode',
				nameTr: 'basics.config.genWizardNamingParameter.contractCode',
				id: 10,
				pattern: '{j+}'
			},
			{
				name: 'quoteCode',
				nameTr: 'basics.config.genWizardNamingParameter.quoteCode',
				id: 11,
				pattern: '{k+}'
			},
			{
				name: 'quoteExternalCode',
				nameTr: 'basics.config.genWizardNamingParameter.quoteExternalCode',
				id: 12,
				pattern: '{l+}'
			}
		]);

	/**
	 * @ngdoc service
	 * @name genericWizardNamingParameterConstantService
	 * @description service providing parameters for generic wizard naming
	 */
	angular.module('platform').service('genericWizardNamingParameterConstantService', genericWizardNamingParameterConstantService);

	genericWizardNamingParameterConstantService.$inject = ['$translate', '$injector', 'genericWizardNamingParameterConstant', 'genericWizardNamingParameterTypeConstant', 'math'];

	function genericWizardNamingParameterConstantService($translate, $injector, genericWizardNamingParameterConstant, genericWizardNamingParameterTypeConstant, math) {
		let service = {};
		let infoObject = {};

		service.getGenericWizardNamingParameterConstant = function () {
			return genericWizardNamingParameterConstant;
		};

		service.getGenericWizardNamingParameterTypeConstant = function () {
			_.forEach(genericWizardNamingParameterTypeConstant, function (type) {
				type.title = type.title || $translate.instant(type.titleTr);
			});
			return genericWizardNamingParameterTypeConstant;
		};

		service.resolveNamingPattern = function (inputString, idObject/*, useDefault*/) {
			if (!inputString || _.isEmpty(infoObject)) {
				return '';
			}

			let fullFormatted;
			let allowedNamingParameterNames = Object.keys(infoObject.namingParameterInfo);
			let allowedNamingParameters = _.filter(genericWizardNamingParameterConstant, function (param) {
				return allowedNamingParameterNames.includes(param.name);
			});

			_.forEach(allowedNamingParameters, function (param) {
				fullFormatted = fullFormatted || inputString;
				let code;

				if (_.isNil(param)) {
					code = '';
				} else {
					code = infoObject.namingParameterInfo[param.name];
				}

				if (_.isArray(code)) {
					let id = idObject ? idObject[param.name.split(/(?=[A-Z])/)[0] + 'Id'] : null;
					if (id) {
						let foundCode = _.find(code, {key: id});
						code = foundCode ? foundCode.value : '';
					} else {
						code = code[0] ? code[0].value : '';
					}
				}

				if (_.isNil(code)) {
					code = '';
				}

				if (!_.isString(code)) {
					code = code.toString();
				}

				let pattern = new RegExp(param.pattern, 'gi');
				let matches = fullFormatted.match(pattern);

				_.forEach(matches, function (match) {
					let codeSubString = code.substring(0, math.min(code.length, match.length - 2));
					fullFormatted = fullFormatted.replace(new RegExp(param.pattern, 'i'), codeSubString);
				});
			});

			return fullFormatted.slice(0, 252);
		};

		service.getAllowedNamingParameters = function (useCaseUuid) {
			return _.filter(genericWizardNamingParameterConstant, function (param) {
				let allowedNamingParameterNames = Object.keys(service.setInfoObject(useCaseUuid, null, true).namingParameterInfo);
				return allowedNamingParameterNames.includes(param.name);
			});
		};

		service.getAllowedNamingParameterTypes = function (useCaseUuid) {
			let types = service.setInfoObject(useCaseUuid, null, true).allowedNamingParameterTypes;
			_.forEach(types, function (type) {
				type.title = type.title || $translate.instant(type.titleTr);
			});
			return types;
		};

		service.setInfoObject = function (useCaseUuid, data, onlyGetInfo) {
			let info;
			data = data || {};
			let types = genericWizardNamingParameterTypeConstant;

			let requisitions = _.get(data, 'prcInfo.Requisition');
			let packages = _.get(data, 'prcInfo.Package');
			let quotes = _.get(data, 'quotes');
			let requisitionDescriptions = mapAndFilterData(requisitions, 'Description');
			let requisitionCodes = mapAndFilterData(requisitions, 'Code');
			let packageDescriptions = mapAndFilterData(packages, 'Description');
			let packageCodes = mapAndFilterData(packages, 'Code');
			let quoteCodes = mapAndFilterData(quotes, 'Code');
			let quoteExternalCodes = mapAndFilterData(quotes, 'ExternalCode');

			switch (useCaseUuid) {
				// rfq bidder wizard
				case '61ed6ca1069d47a28707d8ce8e868167':
					info = {
						namingParameterInfo: {
							projectDescription: _.get(data, 'project.ProjectName'),
							projectCode: _.get(data, 'project.ProjectNo'),
							packageDescription: packageDescriptions,
							packageCode: packageCodes,
							requisitionDescription: requisitionDescriptions,
							requisitionCode: requisitionCodes,
							rfqDescription: _.get(data, 'prcInfo.Rfq[0].Description'),
							rfqCode: _.get(data, 'prcInfo.Rfq[0].Code')
						}, allowedNamingParameterTypes: [types.mailSubject, types.exportFile, types.exportReport]
					};
					break;
				// contract confirm wizard
				case '5dc8d95272b7445b89004c729c71d7df':
					info = {
						namingParameterInfo: {
							projectDescription: _.get(data, 'project.ProjectName'),
							projectCode: _.get(data, 'project.ProjectNo'),
							packageDescription: _.get(packageDescriptions, '[0].value'),
							packageCode: _.get(packageCodes, '[0].value'),
							contractDescription: _.get(data, 'prcInfo.Contract[0].Description'),
							contractCode: _.get(data, 'prcInfo.Contract[0].Code'),
							quoteCode: quoteCodes,
							quoteExternalCode: quoteExternalCodes
							// quote per business partner how to get?
						}, allowedNamingParameterTypes: [types.mailSubject, types.exportFile, types.exportReport]
					};
					break;
			}

			if (onlyGetInfo) {
				return info;
			} else {
				infoObject = info;
			}
		};

		// not finished (mapAndFilterData)
		/*service.updateInfoObject = function (data, paramsToUpdateList) {
			_.forEach(paramsToUpdateList, function (param) {
				if (!infoObject.hasOwnProperty(param.propNameToSet)) {
					return false;
				}
				infoObject[param.propNameToSet] = _.get(data, param.propNameToGet);
			});
		};*/

		function mapAndFilterData(data, prop) {
			if (!data || !_.isFunction(data.map)) {
				return;
			}
			return _.filter(data.map(d => ({
				key: d.Id, value: d[prop]
			})), function (d) {
				return Boolean(d.value);
			});
		}

		return service;
	}
})();
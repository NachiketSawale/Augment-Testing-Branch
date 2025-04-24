(function (angular) {
	'use strict';

	var moduleName = 'platform';
	/**
	 * @ngdoc service
	 * @name genericWizardReportService.js
	 * @function
	 * @requires platformDataServiceFactory
	 *
	 * @description
	 * #
	 *  to be filled
	 */
	angular.module(moduleName).factory('genericWizardReportService', ['_', '$http', '$log', '$injector', '$translate', 'platformDataServiceFactory', 'platformContextService', 'platformCreateUuid',
		function (_, $http, $log, $injector, $translate, platformDataServiceFactory, platformContextService, platformCreateUuid) {

			return function (serviceModuleName, serviceName, additionalPlaceholderFunction, isCoverLetter = true) {
				var serviceOption = {
					flatRootItem: {
						module: angular.module(serviceModuleName),
						serviceName: serviceName,
						dataProcessor: [{
							processItem: function (report) {
								if (report) {
									report.IsIncluded = false;
									report.TemplateName = report.Name.Description || report.Nameing;

									var language = platformContextService.getLanguage();
									var companyId = platformContextService.signedInClientId;
									var userId = platformContextService.getCurrentUserId();

									// load parameters
									$http({
										method: 'GET',
										url: globals.webApiBaseUrl + 'basics/reporting/sidebar/parameters?id=' + report.Id + '&module=' + serviceModuleName
									}).then(function (response) {
										var parameterList = [];
										var automaticPlaceholder = {
											CompanyID: companyId,
											Link: '""',
											UserID: userId,
											PreviewUICulture: '"' + language + '"',
											UI_Language: '"' + language + '"'
										};

										_.assignIn(automaticPlaceholder, additionalPlaceholderFunction());

										_.forEach(report.ReportParameterEntities, function (param) {
											var paramData = _.find(response.data, function (data) {
												return _.toLower(param.ParameterName) === _.toLower(data.parameterName);
											});
											var parameter = {};

											// set necessary parameter attributes
											parameter.context = paramData.context;
											parameter.DataType = param.DataType || paramData.dataType;
											parameter.Description = param.DescriptionInfo.Description || paramData.name || '';
											parameter.Id = param.Id;
											parameter.IsVisible = param.IsVisible;
											parameter.Name = param.ParameterName || paramData.parameterName;
											parameter.values = paramData.values || [];
											parameter.dataType = parameter.DataType;
											parameter.defaultValue = !_.isNil(parameter.Default) ? parameter.Default : !_.isNil(paramData.defaultValue) ? paramData.defaultValue : null;
											parameter.name = parameter.Description || parameter.Name;
											parameter.sorting = param.Sorting;

											var lowerCaseParamName = _.toLower(parameter.Name);
											var placeholder = automaticPlaceholder[_.find(Object.keys(automaticPlaceholder), key => key.toLowerCase() === _.replace(lowerCaseParamName, 'module_', ''))]
											if (placeholder) {
												parameter.defaultValue = placeholder || parameter.defaultValue;
											}

											if (parameter.DataType === 'System.Int32') {
												parameter.actualDataType = 'int';
												if (_.isString(parameter.defaultValue)) {
													parameter.actualDataType = 'intAsString';
												}
											}

											if (parameter.DataType === 'System.Boolean') {
												parameter.actualDataType = 'bool';
												if (_.isString(parameter.defaultValue)) {
													var defVal = parameter.defaultValue;
													parameter.defaultValue = defVal === 'true' ? true : defVal === 'false' ? false : parseInt(defVal);
													parameter.actualDataType = defVal === 'true' || defVal === 'false' ? 'boolInString' : 'intInStringAsBool';
												}

												if (_.isNumber(parameter.defaultValue)) {
													parameter.defaultValue = !!parameter.defaultValue;
													parameter.actualDataType = 'intAsBool';
												}
											}

											parameterList.push(parameter);
										});

										report.parameters = _.filter(parameterList, {IsVisible: true}).sort((a, b) => a.sorting - b.sorting);
										report.hiddenParameters = _.filter(parameterList, {IsVisible: false}).sort((a, b) => a.sorting - b.sorting);
										delete report.ReportParameterEntities;

									}, function (error) {
										$log.error(error);
									});
								}
							}
						}],
						actions: {delete: true, create: 'flat'},
						modification: {multi: true},
						entityRole: {
							root: {
								itemName: platformCreateUuid
							}
						},
						presenter: {
							list: {}
						}
					}
				};

				var service = platformDataServiceFactory.createNewComplete(serviceOption).service;

				if (isCoverLetter) {
					service.wizardFunctions = {};
					service.wizardFunctions.emailContext = {
						subject: ''
					};

					service.wizardFunctions.setSubject = function setSubject() {
						throw new Error('setSubject() must be implemented by the derived service if it\'s a cover letter service.');
					};
				}

				return service;
			};
		}
	]);
})(angular);

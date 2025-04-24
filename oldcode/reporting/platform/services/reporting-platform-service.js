/*
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	/**
	 * @jsdoc service
	 * @name reporting.platform.reportingPlatformService
	 * @function
	 *
	 * @description
	 * reportingPlatformService is the service for reporting related functionality.
	 */
	angular.module('reporting.platform').factory('reportingPlatformService', reportingPlatformService);

	reportingPlatformService.$inject = ['$http', '$window', '$q', 'globals', '$timeout', 'platformContextService', '_', 'platformCreateUuid'];

	function reportingPlatformService($http, $window, $q, globals, $timeout, platformContextService, _, platformCreateUuid) {
		let service = {};

		/**
		var defaultReportData = {  // jshint ignore:line
			Name: '',               // name
			TemplateName: '',       // template
			Path: ''                // rel. path to template
			interactive: true|false // true if interactive viewer should be used
		};

		var defaultParameter = {   // jshint ignore:line
			Name: '',               // name of parameter
			Description: '',        // description
			ParamValue: '',         // value
			ParamValueType: '',     // .net Type (e.q. System.String)
			IsOptionParam: false,   // option parameter
			IsProgramParam: true    // internal program parameter; provided by application logic
		};


		 * @ngdoc function
		 * @name getParameters
		 * @function
		 * @methodOf reportingPlatformService
		 * @description Retrieves parameters of a given report
		 * @param report {defaultReportData} specifies the report which parameters should be returned
		 * @param parameters {Array of defaultParameter} already initialized (known) parameters, will be merged to parameters read from report
		 * @returns {promise} Array of parameters
		 */
		service.getParameters = function getParameters(report, parameters) {
			var data = {
				ReportData: report, // { Name: name, TemplateName: template, Path: path }
				Parameters: _.map(parameters, function (item) {
					return {Key: item.Name, Value: item};
				})
			};

			return $http.post(globals.webApiBaseUrl + 'reporting/platform/parameters', data)
				.then(function (result) {
					return result.data || null;
				});
		};

		/**
		 * @ngdoc function
		 * @name prepare
		 * @function
		 * @methodOf reportingPlatformService
		 * @description renders a report by using specified template, reporting engine and parameters
		 * @param report {defaultReportData} specifies the report which should be rendered
		 * @param parameters {defaultParameter} parameters needed to render the report
		 * @param exportType {string} optional, at the moment "pdf" is supported only. The report will be exported as pdf to be shown or downloaded
		 * @returns {promise}
		 */
		service.prepare = function prepare(report, parameters, exportType) {
			const data = {
				reportData: report,
				gearData: {
					name: exportType ? exportType : null,
					reportId : report.Id
				},
				parameters: _.map(parameters, function (item) {
					return {Key: item.Name, Value: item};
				})
			};
			const defer = $q.defer();

			data.reportData.limitedWaitingTime = true;

			if(report.interactive) {
				report.uuid = platformCreateUuid();

				$http.post(globals.baseUrl + 'reporting/viewer/prepare?uuid=' + report.uuid, data)
					.then(function (result) {
						const data = result.data;

						if (data) {
							data.GenerationCompleted = true;

						}
						defer.resolve(data);

						return data || null;
					}, function () {
						defer.resolve(null);
					});
			} else {
				$http.post(globals.webApiBaseUrl + 'reporting/platform/prepare', data)
					.then(function (result) {
						let reportId = result.config.data.gearData.reportId;
						const data = result.data;

						function isReportPrepared() {
							const config = {
								params: {
									id: data.Name,
									type: data.FileExtension.toLowerCase(),
									reportId : reportId
								}
							};

							$http.get(globals.webApiBaseUrl + 'reporting/platform/isprepared', config)
								.then(function (result) {
									if (result.data) {
										data.GenerationCompleted = true;
										defer.resolve(data);
									} else if (result.data === null) {
										// no data, error
										defer.resolve(null);
									} else {
										$timeout(isReportPrepared, 9500);
									}
								});
						}

						if (!data || data.GenerationCompleted) {
							defer.resolve(data || null);
						} else {
							$timeout(isReportPrepared, 9500);
						}

						return data || null;
					}, function () {
						defer.resolve(null);
					});
			}

			return defer.promise;
		};

		/**
		 * @ngdoc function
		 * @name show
		 * @function
		 * @methodOf reportingPlatformService
		 * @description Shows an already rendered report by opening a new tab / popup window in browser
		 * @param report {Object} report specific information to identify report on server
		 */
		service.show = function show(report) {
			if (report !== null) {
				let url = null;
				let subPath = null;

				if (report.FileExtension === 'pdf') {
					subPath = 'downloads/reports/' + report.Name + '.' + report.FileExtension;
					url = $window.location.origin + globals.baseUrl + subPath;
				} else {
					url = $window.location.origin + (report.ClientUrl.indexOf('/') === -1 ? globals.reportingBaseUrl : globals.baseUrl) + report.ClientUrl + '/viewer/show/' + (report.uuid ? report.uuid + '/' : '') + platformContextService.getLanguage() +'/' + report.Description + '/' + report.Name;
				}

				report.subPath = subPath;

				const win = $window.open(url);

				if (win) {
					win.focus();
				}
			}

			return report;
		};

		return service;
	}
})(angular);

/*
 * $Id: reporting-sidebar-service.js 629294 2021-03-23 17:37:53Z kh $
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */
	'use strict';

	var moduleName = 'basics.reporting';

	angular.module(moduleName).factory('basicsReportingSidebarService', basicsReportingSidebarService);

	basicsReportingSidebarService.$inject = ['$http', '$q', '$templateCache', '$log', '_', 'cloudDesktopSidebarService', 'platformTranslateService', 'platformModuleStateService', 'platformContextService', 'platformUserInfoService'];

	function basicsReportingSidebarService($http, $q, $templateCache, $log, _, cloudDesktopSidebarService, platformTranslateService, platformModuleStateService, platformContextService, platformUserInfoService) { // jshint ignore:line
		var state = {
			groups: [],
			module: null,
			context: [
				{Id: 0, description$tr$: 'basics.reporting.syscontextNull'},
				{Id: 1, description$tr$: 'basics.reporting.syscontextCompany'},
				{Id: 2, description$tr$: 'basics.reporting.syscontextProfitCenter'},
				{Id: 3, description$tr$: 'basics.reporting.syscontextProjekt'},
				{Id: 4, description$tr$: 'basics.reporting.syscontextMainEntityId'},
				{Id: 5, description$tr$: 'basics.reporting.syscontextMainEntityIdArray'},
				{Id: 6, description$tr$: 'basics.reporting.syscontextUserId'},
				{Id: 7, description$tr$: 'basics.reporting.syscontextUserName'},
				{Id: 8, description$tr$: 'basics.reporting.syscontextUserDescription'},
				{Id: 9, description$tr$: 'basics.reporting.syscontextSelectedMainEntities'},
				{Id: 10, description$tr$: 'basics.reporting.syscontextWatchList'},
				{Id: 11, description$tr$: 'basics.reporting.syscontextDialogSection'}
			]
		};

		return {
			registerModule: registerModule,
			unregisterModule: unregisterModule,
			loadReports: loadReports,
			loadReportParameters: loadReportParameters,
			resolveParameters: resolveParameters,
			data: state
		};


		function loadOptions() {
			return $http({method: 'GET', url: globals.webApiBaseUrl + 'basics/reporting/sidebar/options'})
				.then(function (response) {
					state.options = response.data;

					return response.data;
				});
		}

		function loadReports(module) {
			return $http({method: 'GET', url: globals.webApiBaseUrl + 'basics/reporting/sidebar/load?module=' + module})
				.then(function (response) {
					state.groups = response.data;

					_.each(state.groups, function (group) {
						group.iconClass = function () {
							return group.visible ? 'ico-up' : 'ico-down';
						};
						group.count = group.reports.length;
					});

					return response.data;
				});
		}

		function loadReportParameters(report) {
			return $http({
				method: 'GET',
				url: globals.webApiBaseUrl + 'basics/reporting/sidebar/parameters?id=' + report.id + '&module=' + state.module.name
			})
				.then(function (response) {
					report.parameters = _.filter(response.data, {isVisible: true});
					report.hiddenParameters = _.filter(response.data, {isVisible: false});
					report.dialogSection = _.filter(response.data, {context: 11});
					var map = {};
					var reportInfo = {
						reportName: report.name,
						fileName: report.filename,
						reportId: report.id
					};
					_.forEach(report.dialogSection, function (p) {
						var key = p.name;

						if (key in map) {
							map[key].parameter.push(p);
						} else {
							var value = {
								reportInfo: reportInfo,
								parameter: [p],
								// resolved: false
							};
							map[key] = value;
						}
						p.dialogSection = map[key];
					});

					report.dialogSection = map;

					return report;
				}, function (error) {
					$log.error(error);
				});
		}

		function loadTranslation() {
			return $q(function (resolve) {
				platformTranslateService.registerModule([moduleName, 'cloud.common'], true)
					.then(function () {
						var options = {notFound: false};

						platformTranslateService.translateObject(state.context, ['description'], options);

						resolve(state.context);
					});
			});
		}

		function loadTemplate() {
			if ($templateCache.get('basics.reporting/sidebar-item.html')) {
				return $q.when(0);
			} else {
				return $templateCache.loadTemplateFile('basics.reporting/templates/reporting-sidebar-templates.html');
			}
		}

		function loadUserInfo() {
			platformUserInfoService.getUserInfoPromise(true).then(function (userInfo) {
				state.userInfo = userInfo;

				return userInfo;
			});
		}

		function createErrorInfo(report, parameter, text$tr$) {
			report.errors.push({
				parameter: parameter,
				context: _.find(state.context, 'Id', parameter.context).description,
				text: platformTranslateService.instant(text$tr$, null, true)
			});
		}

		function resolveParameters(report) {
			var moduleState = platformModuleStateService.state(state.module);

			report.errors = [];
			report.hasError = false;

			report.showDetails = report.storeInDocs && report.exportType === 'pdf' ? true : false;

			_.each(report.parameters, function (parameter) { // jshint ignore:line
				switch (parameter.context) {
					case 0:
						report.showDetails = true;
						break;

					case 1:
						parameter.value = platformContextService.signedInClientId;
						break;

					case 2:
						parameter.value = platformContextService.clientId;
						break;

					case 3:
						parameter.value = moduleState.rootService.getSelectedProjectId ? moduleState.rootService.getSelectedProjectId() : 0;

						if (!parameter.value) {
							createErrorInfo(report, parameter, 'basics.reporting.errorNotAvailable');
						}
						break;

					case 4: // Selected main entity
						var selectItem = moduleState.rootService.getSelected();  // rei@28.1: can return null !!
						parameter.value = moduleState.selectedMainEntity.Id || selectItem ? selectItem.Id : undefined;

						if (_.isUndefined(parameter.value)) {
							createErrorInfo(report, parameter, 'basics.reporting.errorItemNotSelected');
						}
						break;

					case 5: // Main entities (as string separated by ,)
						parameter.value = _.map(moduleState.mainEntities, 'Id');

						if (!parameter.value.length) {
							parameter.value = _.map(moduleState.rootService.getList(), 'Id');
						}

						if (!parameter.value.length) {
							createErrorInfo(report, parameter, 'basics.reporting.errorItemNotLoaded');
						} else {
							switch (parameter.dataType) {
								case 'System.String':
									parameter.value = parameter.value.join(',');
									break;

								case 'System.Int32':
									parameter.value = parameter.value[0];
									break;
							}
						}
						break;

					case 6:
						parameter.value = state.userInfo.UserId;
						break;

					case 7:
						parameter.value = state.userInfo.LogonName;
						break;

					case 8:
						parameter.value = state.userInfo.UserName;
						break;

					case 9:
						var selectItem = moduleState.rootService.getSelectedEntities();  // rei@28.1: can return null !!
						parameter.value = selectItem && selectItem.length > 0 ? _.map(selectItem, 'Id') : undefined;

						if (_.isUndefined(parameter.value)) {
							createErrorInfo(report, parameter, 'basics.reporting.errorItemNotSelected');
						} else {
							switch (parameter.dataType) {
								case 'System.String':
									parameter.value = parameter.value.join(',');
									break;

								case 'System.Int32':
									parameter.value = parameter.value[0];
									break;
							}
						}
						break;

					case 10:
						report.showDetails = true;
						break;

					case 11:
						report.showDetails = true;
						break;
				}
			});

			report.hasError = !!report.errors.length;

			return report.showDetails || report.hasError;
		}

		function registerModule(module) {
			state.module = _.isString(module) ? angular.module(module) : module;

			$q.all([loadReports(state.module.name), loadTranslation(), loadTemplate(), loadUserInfo(), loadOptions()])
				.then(function () {
					if (state.groups.length) {
						var sidebar = {
							name: cloudDesktopSidebarService.getSidebarIds().reports,
							type: 'template',
							templateUrl: 'basics.reporting/templates/reporting-sidebar.html'
						};

						cloudDesktopSidebarService.registerSidebarContainer(sidebar, true);
					}
				});

			return true;
		}

		function unregisterModule() {
			cloudDesktopSidebarService.unRegisterSidebarContainer(cloudDesktopSidebarService.getSidebarIds().reports, true);
		}
	}
})();

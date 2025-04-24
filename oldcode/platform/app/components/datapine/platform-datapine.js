// noinspection FunctionTooLongJS
((angular) => {
	'use strict';

	let companyCache = {};

	platformDatapineController.$inject = ['$timeout', '$scope', '$element', '$window', '$rootScope', '_', '$sce', 'platformUserInfoService', 'platformContextService', 'platformPermissionService', 'globals', 'mainViewService', '$injector', '$http', '$q', 'platformModuleStateService'];

	// noinspection OverlyComplexFunctionJS
	function platformDatapineController($timeout, $scope, $element, $window, $rootScope, _, $sce, platformUserInfoService, platformContextService, platformPermissionService, globals, mainViewService, $injector, $http, $q, platformModuleStateService) {
		const ctrl = this; // jshint ignore:line
		let httpRunning = false;

		$scope.$ctrl = ctrl;

		ctrl.uuid = $scope.$parent.getContainerUUID();
		ctrl.container = mainViewService.getContainerByUuid(ctrl.uuid);
		ctrl.dataService = _.get(ctrl.container, 'dashboard.dataService', null);
		ctrl.platform = _.get(ctrl.container, 'dashboard.platform', 'dashboard');
		ctrl.filters = _.get(ctrl.container, 'dashboard.filters', []);
		ctrl.lastFilter = null;
		ctrl.filterSynched = false;
		ctrl.filterQueued = null;
		ctrl.messageFilters = _.get(ctrl.container, 'dashboard.messageFilters', []);
		ctrl.dashboardService = _.get(ctrl.container, 'dashboard.service', null);
		ctrl.dashboard = _.get(ctrl.container, 'dashboard.name', null);
		ctrl.iframe = $element.children()[0];
		ctrl.hasTranslation = _.get(ctrl.container, 'dashboard.hasTranslation', true);
		ctrl.generic = _.get(ctrl.container, 'dashboard.generic', null);
		ctrl.messageCallback = (event) => {
			if(ctrl.iframe.contentWindow === event.source) {
				const msg = JSON.parse(event.data || '');

				switch (_.isString(msg) ? msg : msg.name) {
					case 'completedAppearance':
						console.log('dashboard component received: completedAppearance');

						ctrl.filterSynched = true;
						ctrl.selectionChanged();
						break;

					case 'filtered:data':
						console.log('dashboard component received: filtered-data', msg.data);

						if(msg.data.length) {
							const result = {
								uuid: ctrl.uuid,
								data: _.reduce(msg.data, (result, value) => {
									if (value.values.length === 1) {
										_.set(result, _.get(_.find(ctrl.messageFilters, {filter: value.name}), 'mapTo', value.name), {
											name: value.name,
											value: value.values[0],
											table: value.tableName
										});
									}

									return result;
								}, {})
							};

							// special handling (hack) for values coming out of RIB dashboards
							const descFilter = _.get(result.data, 'id_desc_filter', null);

							if(descFilter) {
								descFilter.value = descFilter.value.split('—');
								descFilter.value.forEach((value, index) => {
									value = value.replaceAll('. ', '.')
										.replaceAll('. ', '.')
										.replaceAll(' |', '|')
										.replaceAll('| ', '|')
										.trimEnd();

									if(value.endsWith('.')) {
										value = value.substring(0, value.length - 1);
									}

									descFilter.value[index] = value;
								});
							}

							if (_.keys(result.data).length) {
								console.log('emitting dashboard filtered-data:', result);
								$rootScope.$emit('dashboard:filtered-data', result);
							}
						}
						break;

					case 'dashboard:filter:synchronize:start':
						console.log('dashboard component received: dashboard:filter:synchronize:start');
						ctrl.filterSynched = false;
						break;

					case 'dashboard:filter:synchronize:end':
						console.log('dashboard component received: dashboard:filter:synchronize:end');
						ctrl.filterSynched = true;
						ctrl.sendFilter();
						break;
				}
			}
		};

		if(!ctrl.filters.length) {
			console.log('dashboard component no filters defined');
		}

		ctrl.sendFilter = (filter) => {
			if(!filter && ctrl.filterSynched && ctrl.filterQueued) {
				if(_.isEqual(ctrl.lastFilter, ctrl.filterQueued)) {
					ctrl.filterQueued = null;
				} else {
					ctrl.lastFilter = ctrl.filterQueued;
					ctrl.filterQueued = null;
					ctrl.filterSynched = false;

					console.log('dashboard component sending filter:', ctrl.lastFilter);
					ctrl.iframe.contentWindow.postMessage(JSON.stringify(ctrl.lastFilter), '*');
				}
			}

			if(filter && !_.isEqual(ctrl.lastFilter, filter)) {
				if(ctrl.filterSynched) {
					ctrl.lastFilter = filter;
					ctrl.filterQueued = null;
					ctrl.filterSynched = false;

					console.log('dashboard component sending filter:', filter);
					ctrl.iframe.contentWindow.postMessage(JSON.stringify(filter), '*');
				} else {
					ctrl.filterQueued = filter;
				}
			}
		};

		$window.addEventListener('message', ctrl.messageCallback);

		if (ctrl.generic) {
			ctrl.module = _.get(ctrl.container, 'module', null);
			ctrl.moduleState = platformModuleStateService.state(ctrl.module);
			ctrl.dataService = ctrl.moduleState.rootService;

			// noinspection OverlyComplexFunctionJS
			ctrl.resolveParameter = (filter) => {
				let value = null;
				let items = null;

				switch (filter.sysContext) {
					case 1:
						return {
							name: filter.filter,
							values: filter.dataType === 'String' ? platformContextService.signedInClientId.toString() : platformContextService.signedInClientId
						};

					case 2:
						return {
							name: filter.filter,
							values: filter.dataType === 'String' ? platformContextService.clientId.toString() : platformContextService.clientId
						};

					case 3:
						value = _.get(ctrl.dataService, 'getSelectedProjectId', () => null)();

						return {
							name: filter.filter,
							values: filter.dataType === 'String' ? value.toString() : value
						};

					case 4: // Selected main entity
						items = ctrl.dataService.getSelectedEntities() || [{}];
						value = _.get(items[items.length - 1], 'Id', _.get(items[items.length - 1], 'id', null));

						return {
							name: filter.filter,
							values: value || (filter.dataType === 'String' ? value.toString() : value)
						};

					case 5: // Main entities as array of ids
						items = _.map(ctrl.dataService.getList(), (item) => _.get(item, 'Id', _.get(item, 'id', null)));
						items = _.compact(items);

						return {
							name: filter.filter,
							values: filter.dataType === 'String' ? _.map(items, (item) => item.toString()) : items
						};

					case 6:
						return {
							name: filter.filter,
							values: filter.dataType === 'String' ? ctrl.userInfo.UserId.toString() : ctrl.userInfo.UserId
						};

					case 7:
						return {
							name: filter.filter,
							values: ctrl.userInfo.LogonName
						};

					case 8:
						return {
							name: filter.filter,
							values: ctrl.userInfo.UserName
						};

					case 9:
						items = ctrl.dataService.getSelectedEntities() || [];
						items = _.map(items, (item) => _.get(item, 'Id', _.get(item, 'id', null))) || [];
						items = _.compact(items);

						return {
							name: filter.filter,
							values: filter.dataType === 'String' ? _.map(items, (item) => item.toString()) : items
						};

					case 0:
					case 10:
					default:
						return {
							name: filter.filter,
							values: null
						};

				}
			};

			ctrl.selectionChanged = () => {
				if(ctrl.filters.length) {
					const filter = {
						name: 'dashboard:filter',
						filters: _.map(ctrl.filters, (filter) => {
							return ctrl.resolveParameter(filter);
						})
					};

					ctrl.sendFilter(filter);
				}
			};

			if(ctrl.dataService.registerSelectedEntitiesChanged) {
				ctrl.dataService.registerSelectedEntitiesChanged(ctrl.selectionChanged);
			} else if(ctrl.dataService.registerSelectionChanged) {
				ctrl.dataService.registerSelectionChanged(ctrl.selectionChanged);
			} else {
				console.log('dashboard component: data-service don\'t support registerSelectionChanged or registerSelectedEntitiesChanged');
			}
		} else {
			// dashboard service is only used in control tower to change dashboard
			ctrl.dashboardSelectionChanged = () => {
				const dashboard = ctrl.dashboardService.getSelected();

				if (dashboard) {
					ctrl.dashboard = dashboard.ExternalName || dashboard.externalName || null;
					ctrl.hasTranslation = dashboard.HasTranslation || dashboard.hasTranslation || false;
				} else {
					ctrl.dashboard = null;
					ctrl.hasTranslation = false;
				}

				updateEndpoint(platformContextService.clientCode);
			};

			if (ctrl.dashboardService) {
				ctrl.dashboardService = $injector.get(ctrl.dashboardService);
				ctrl.dashboardService.registerSelectionChanged(ctrl.dashboardSelectionChanged);

				ctrl.dashboardSelectionChanged();
			}

			ctrl.selectionChanged = () => {
				if(ctrl.dataService) {
					if (httpRunning) {
						return;
					}

					const items = ctrl.dataService.getSelectedEntities() || [];
					const project = items.length ? items[items.length - 1] : null;

					if (project) {
						loadCompanyCode(project)
							.then(() => {
								const filter = {
									name: 'dashboard:filter',
									filters: _.map(ctrl.filters, (filter) => {
										return {
											name: filter.filter,
											values: _.get(project, filter.field)
										};
									})
								};

								ctrl.sendFilter(filter);
							});
					} else {
						const filter = {
							name: 'dashboard:filter',
							filters: _.map(ctrl.filters, (filter) => {
								return {
									name: filter.filter,
									values: null
								};
							})
						};

						ctrl.sendFilter(filter);
					}
				}
			};

			if (ctrl.dataService) {
				ctrl.dataService = $injector.get(ctrl.dataService);
				ctrl.dataService.registerSelectionChanged(ctrl.selectionChanged);
			}
		}

		ctrl.$onDestroy = () => {
			$window.removeEventListener('message', ctrl.messageCallback);

			if (ctrl.dataService) {
				if(ctrl.dataService.unregisterSelectionChanged) {
					ctrl.dataService.unregisterSelectionChanged(ctrl.selectionChanged);
				}
				if(ctrl.dataService.unregisterSelectedEntitiesChanged) {
					ctrl.dataService.unregisterSelectedEntitiesChanged(ctrl.selectionChanged);
				}
			}

			if (ctrl.dashboardService) {
				ctrl.dashboardService.unregisterSelectionChanged(ctrl.dashboardSelectionChanged);
			}

			$http.get(globals.webApiBaseUrl + 'basics/biplusdesigner/token/delete?uuid=' + ctrl.ribid);
		};

		function loadCompanyCode(project) {
			if (!project.CompanyCode) {
				if (httpRunning) {
					return httpRunning;
				}

				const data = _.uniq(_.reduce(ctrl.dataService.getList(), (result, item) => {
					const companyCode = companyCache[item.CompanyFk];

					if (companyCode) {
						item.CompanyCode = companyCode;
					} else {
						result.push(item.CompanyFk);
					}

					return result;
				}, []));

				if (data.length > 0) {
					httpRunning = $http.post(globals.webApiBaseUrl + 'basics/company/codes', data)
						.then((response) => {
							httpRunning = false;

							_.forEach(response.data, (item) => {
								companyCache[item.Id] = item.Code;
							});

							_.forEach(ctrl.dataService.getList(), (item) => {
								if (!item.CompanyCode) {
									item.CompanyCode = companyCache[item.CompanyFk] || null;
								}
							});

							return true;
						}, () => {
							httpRunning = false;

							return false;
						});

					return httpRunning;
				}
			}

			return $q.when(true);
		}

		function updateEndpoint(clientCode) {
			if (ctrl.platform === 'BI' || ctrl.dashboard) {
				const payload = {
					clientCode: clientCode,
					dashboard: ctrl.dashboard,
					platform: ctrl.platform,
					url: globals.dashboard.url,
					language: platformContextService.getLanguage().split('-')[0],
					hasTranslation: ctrl.hasTranslation.toString(),
					messageFilters: _.map(ctrl.messageFilters, (item) => _.get(item, 'filter', item)).join('|')
				};

				$http.post(globals.webApiBaseUrl + 'basics/biplusdesigner/dashboard/check', payload)
					.then((response) => {
						payload.dashboard = ctrl.dashboard = response.data;

						if (!response) {
							ctrl.endpoint = null;
							return;
						}

						$http.post(globals.webApiBaseUrl + 'basics/biplusdesigner/token/create', payload)
							.then((response) => {
								const uri = encodeURI(globals.dashboard.url + '/iframe?ribid=' + response.data + '&platform=' + ctrl.platform + '&ssokey=' + globals.dashboard.ssoCallbackKey + (ctrl.platform === 'BI' ? '' : ('&dashboard=' + ctrl.dashboard)));

								ctrl.ribid = response.data;
								ctrl.endpoint = $sce.trustAsResourceUrl(uri);
							});
					});
			} else {
				ctrl.endpoint = null;
			}
		}

		platformUserInfoService.getUserInfoPromise(true)
			.then((userInfo) => {
				ctrl.userInfo = userInfo;

				if (!platformContextService.clientCode.length) {
					$http.post(globals.webApiBaseUrl + 'basics/company/codes', [platformContextService.clientId])
						.then((response) => {
							updateEndpoint(response.data[0].Code);
						});
				} else {
					updateEndpoint(platformContextService.clientCode);
				}

				return userInfo;
			});
	}

	const componentConfig = {
		template: '<iframe credentialless data-ng-src="{{$ctrl.endpoint}}" class="flex-element flex-box"></iframe>',
		controller: platformDatapineController
	};

	angular.module('platform').component('platformDatapine', componentConfig);
})(angular);

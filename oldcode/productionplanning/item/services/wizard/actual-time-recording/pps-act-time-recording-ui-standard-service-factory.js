(angular => {
	'use strict';

	const moduleName = 'productionplanning.item';
	angular.module(moduleName).factory('ppsActualTimeRecordingUIStandardServiceFactory', UIStandardServiceFactory);

	UIStandardServiceFactory.$inject = ['platformSchemaService',
		'platformUIStandardConfigService',
		'productionplanningItemTranslationService',
		'ppsActTimeRecordingConstantValues'
	];

	function UIStandardServiceFactory(platformSchemaService,
		platformUIStandardConfigService,
		productionplanningItemTranslationService,
		constantValues) {

		const serviceMap = new Map();

		const layoutConfig = {
			[constantValues.employee]: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['tksemployeecode', 'tksemployeedescription', 'duration', 'assignedtime', 'remainingtime']
					},
				],
				overloads: {
					tksemployeecode: {
						readonly: true,
					},
					tksemployeedescription: {
						readonly: true,
					},
					duration: {
						readonly: true,
					},
					assignedtime: {
						readonly: true,
					},
					remainingtime: {
						readonly: true,
					}
				}
			},
			[constantValues.employeeToArea]: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['bassitecode', 'bassitedescription', 'duration']
					},
				],
				overloads: {
					bassitecode: {
						readonly: true,
						sorting: 0,
					},
					bassitedescription: {
						readonly: true,
						sorting: 1,
					},
					duration: {
						readonly: true,
						sorting: 999,
					},
				}
			},
			[constantValues.area]: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['bassitecode', 'bassitedescription', 'duration']
					},
				],
				overloads: {
					bassitecode: {
						readonly: true,
						sorting: 0,
					},
					bassitedescription: {
						readonly: true,
						sorting: 1,
					},
					duration: {
						readonly: true,
						sorting: 999,
					},
				}
			},
			[constantValues.areaToEmployee]: {
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['tksemployeecode', 'tksemployeedescription', 'duration']
					},
				],
				overloads: {
					tksemployeecode: {
						readonly: true,
						sorting: 0,
					},
					tksemployeedescription: {
						readonly: true,
					},
					duration: {
						readonly: true,
						sorting: 999,
					},
				}
			},
			[constantValues.area2]: { // redundant code, to be optimized in the future
				groups: [
					{
						gid: 'baseGroup',
						attributes: ['bassitecode', 'bassitedescription', 'duration']
					},
				],
				overloads: {
					bassitecode: {
						readonly: true,
						sorting: 0,
					},
					bassitedescription: {
						readonly: true,
						sorting: 1,
					},
					duration: {
						readonly: true,
						sorting: 999,
					},
				}
			},
		};

		function getService(serviceName) {
			let service;
			if (serviceMap.has(serviceName)) {
				service = serviceMap.get(serviceName);
			} else {
				service = createService(serviceName);
				serviceMap.set(serviceName, service);
			}
			return service;
		}

		function createService(key) {
			function createMainDetailLayout() {
				const baseOptions = {
					fid: 'pps.actual.time.report.' + key,
					version: '1.0.0',
					addValidationAutomatically: false,
					showGrouping: false,
				};

				return Object.assign(baseOptions, layoutConfig[key]);
			}

			const detailLayout = createMainDetailLayout();
			const BaseService = platformUIStandardConfigService;

			let schema = constantValues.schemes.actualTimeReport;
			let attributeDomains = platformSchemaService.getSchemaFromCache(schema);
			attributeDomains = attributeDomains.properties;

			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			const baseService = new BaseService(detailLayout, attributeDomains, productionplanningItemTranslationService);

			baseService.getCreateMainLayout = function getCreateMainLayout() {
				return createMainDetailLayout();
			};

			return baseService;
		}

		return {
			getService: getService,
		};
	}
})(angular);
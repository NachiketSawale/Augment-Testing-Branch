(function () {
	'use strict';

	var moduleName = 'productionplanning.item';
	angular.module(moduleName).service('ppsItemDetailersFilterService', [
		'basicsLookupdataConfigGenerator',
		'platformTranslateService',
		'PlatformMessenger',
		'mainViewService',
		function (basicsLookupdataConfigGenerator,
				  platformTranslateService,
				  PlatformMessenger,
				  mainViewService) {
			var self = this;
			var instances = {};
			self.entity = {};
			self.onRoleIdChanged = new PlatformMessenger();

			self.applyFilterSetting = function (filter) {
				return mainViewService.customData(self.entity.uuid, 'filterSettings', filter);
			};

			self.createFilterParams = function createFilterParams(filter, uuid) {
				var params = instances[uuid];
				if (_.isNull(params) || _.isUndefined(params)) {
					params = provideFilterParams(filter, uuid);
					instances[uuid] = params;
				}
				//at initialisation: get settings
				self.entity.roleId = self.applyFilterSetting();
				return params;
			};

			function provideFilterParams(filter, uuid) {
				var formConfig = {
					fid: 'productionplanning.item.detailersfilter' + uuid,
					version: '1.0.0',
					showGrouping: false,
					groups: [
						{
							gid: 'selectionfilter',
							isOpen: true,
							visible: true,
							sortOrder: 1
						}
					],
					rows: []
				};

				self.entity.uuid = uuid;
				if (angular.isArray(filter)) {
					for (var i = 0; i < filter.length; i++) {
						handleFilter(formConfig, self.entity, filter[i]);
					}
				} else {
					handleFilter(formConfig, self.entity, filter);
				}
				return {entity: self.entity, config: platformTranslateService.translateFormConfig(formConfig)};
			}

			function handleFilter(formConfig, entity, filter) {
				switch (filter) {
					case 'roleId':
						formConfig.rows.push(provideRoleConfig());
						break;
				}
			}

			function provideRoleConfig() {
				var config = basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'ppsConfigurationClerkRoleSlotLookupDataService',
					cacheEnable: true
				}).detail;
				return _.extend(config,
					{
						gid: 'selectionfilter',
						rid: 'roleId',
						model: 'roleId',
						label: 'Role',
						label$tr$: 'productionplanning.item.role',
						sortOrder: 1,
						required: true,
						change: function (entity) {
							self.onRoleIdChanged.fire(entity);
						}
					});
			}
		}
	]);
})();
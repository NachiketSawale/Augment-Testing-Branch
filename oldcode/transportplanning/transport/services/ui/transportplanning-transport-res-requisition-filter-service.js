/**
 * Created by zov on 30/01/2019.
 */
(function () {
	'use strict';
	/*global globals, angular, _*/

	var moduleName = 'transportplanning.transport';
	angular.module(moduleName).service('transportplanningTransportResRequisitionFilterService',[
		'basicsLookupdataConfigGenerator',
		'platformTranslateService',
		'moment',
		'$http',
		'mainViewService',
		function (basicsLookupdataConfigGenerator,
				  platformTranslateService,
				  moment,
				  $http,
				  mainViewService) {
			var self = this;
			var instances = {};
			self.entity = {};
			self.setDefaultSite = function setDefaultSite(siteId) {
				self.entity.siteFk = siteId;
				// if (!self.entity.requestedDate) {
				// 	self.entity.requestedDate = moment.utc(new Date());
				// }
			};

			self.setRequestedDate = function(newRequestedDate){
				if(_.isNil(newRequestedDate)){
					self.entity.requestedDate =  moment.utc(new Date());
				}
				else{
					self.entity.requestedDate = newRequestedDate;
				}
			};

			self.createFilterParams = function createFilterParams(filter, uuid) {
				var params = instances[uuid];
				if(_.isNull(params) || _.isUndefined(params)) {
					params = provideFilterParams(filter, uuid);
					instances[uuid] = params;
				}

				//at initialisation: get settings
				var settings = layoutSettings();
				if (settings) {
					self.entity.resourceTypeFk = settings;
				}

				return params;
			};

			self.getSetResTypeFilterValue = function (value) {
				var route = globals.webApiBaseUrl + 'transportplanning/transport/route/' +
					(value ? ('setResType4CheckResReq?resTypeFk='+value) : 'getResType4CheckResReq');
				return $http.get(route).then(function (response) {
					if(!value) {
						self.entity.resourceTypeFk = response.data;
					}
				});
			};

			function layoutSettings(filter) {
				return mainViewService.customData(self.entity.uuid, 'filterSettings', filter);
			}
			
			function provideFilterParams(filter, uuid) {
				var formConfig = {
					fid: 'transportplanning.transport.resRequisitionfilter' + uuid,
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
					case 'requestedDate':
						formConfig.rows.push(provideRequestedDateConfig());
						break;
					case'resourceTypeFk':
						formConfig.rows.push(provideResourceTypeConfig());
						break;
					case'siteFk':
						formConfig.rows.push(provideSiteConfig());
						break;
				}
			}

			function provideRequestedDateConfig() {
				return {
					gid: 'selectionfilter',
					rid: 'requesteddate',
					model: 'requestedDate',
					type: 'dateutc',
					label: 'Requested Date',
					label$tr$: 'transportplanning.transport.requestedDate',
					sortOrder: 1,
					required: true
				};
			}

			function provideResourceTypeConfig() {
				return basicsLookupdataConfigGenerator.provideDataServiceLookupConfigForForm({
						dataServiceName: 'resourceTypeLookupDataService',
						cacheEnable: true,
						additionalColumns: false,
						showClearButton: false
					},
					{
						gid: 'selectionfilter',
						rid: 'resourcetype',
						label: 'Type',
						label$tr$: 'resource.master.TypeFk',
						type: 'integer',
						model: 'resourceTypeFk',
						sortOrder: 2,
						required: true,
						change: function (entity) {
							layoutSettings(entity.resourceTypeFk);
							//self.getSetResTypeFilterValue(entity.resourceTypeFk);
						}
					});
			}

			function provideSiteConfig() {
				return {
					gid: 'selectionfilter',
					rid: 'site',
					label: 'Site',
					label$tr$: 'resource.master.SiteFk',
					type: 'directive',
					directive: 'basics-lookupdata-lookup-composite',
					options: {
						lookupOptions: {showClearButton: false},
						lookupDirective: 'basics-site-site-lookup',
						descriptionMember: 'DescriptionInfo.Translated'
					},
					model: 'siteFk',
					sortOrder: 3,
					required: true
				};
			}
		}
	]);
})();
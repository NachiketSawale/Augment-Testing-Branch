/**
 * Created by wed on 09/04/2019.
 */
(function (angular) {

	'use strict';

	var moduleName = 'basics.costgroups';

	angular.module(moduleName).factory('basicsCostGroupFilterUIStandardFactory', [
		'globals',
		'$http',
		'$q',
		'platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'basicsLookupdataConfigGenerator',
		'basicsCostGroupFilterCacheService',
		'basicsCostGroupFilterCacheTypes',
		'basicsCostGroupFilterStructureTranslationFactory',
		function (globals,
		          $http,
		          $q,
		          platformSchemaService,
		          PlatformUIStandardConfigService,
		          platformUIStandardExtentService,
		          basicsLookupdataConfigGenerator,
		          filterCacheService,
		          cacheTypes,
		          translationFactory) {

			function createStructureLayout(dataService) {
				return {
					fid: 'cost.group.strcuture.layout',
					version: '1.0.0',
					showGrouping: true,
					addValidationAutomatically: true,
					groups: [
						{
							'gid': 'basicData',
							'attributes': ['code', 'descriptioninfo', 'quantity', 'uomfk']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					overloads: {
						code: {
							'readonly': true
						},
						quantity: {
							'readonly': true
						},
						descriptioninfo: {
							'readonly': true
						},
						uomfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
							dataServiceName: 'basicsUnitLookupDataService',
							cacheEnable: true,
							readonly: true
						})
					},
					addition: {
						grid: [
							{
								id: 'marker',
								name: 'Filter',
								name$tr$: 'platform.gridMarkerHeader',
								toolTip: 'Filter',
								toolTip$tr$: 'platform.gridMarkerHeader',
								field: 'IsMarked',
								width: 40,
								minWidth: 40,
								resizable: true,
								sortable: false,
								formatter: 'marker',
								pinned: true,
								editor: 'marker',
								editorOptions: {
									service: dataService,
									serviceMethod: 'getList'
								},
								printable: false
							}
						]
					}
				};
			}

			function createService(serviceDescriptor, dataService, createOptions) {
				if (!filterCacheService.hasService(cacheTypes.COSTGROUP_STRUCTURE_UI_STANDARD_SERVICE, serviceDescriptor)) {

					var options = angular.merge({
							extendLayout: function (layout) {
								return layout;
							}
						}, createOptions),
						structureLayout = options.extendLayout(createStructureLayout(dataService)),
						translationService = translationFactory.createService(serviceDescriptor, structureLayout, {translation: structureLayout.translationInfos});

					var domainSchema = {
						Code: {
							mandatory: true,
							domain: 'code',
							maxlen: 16
						},
						DescriptionInfo: {
							domain: 'translation'
						},
						Quantity: {
							domain: 'quantity',
							mandatory: true
						},
						UomFk: {
							mandatory: true,
							domain: 'integer'
						},
						InsertedAt: {
							domain: 'date',
							mandatory: true
						},
						InsertedBy: {
							domain: 'integer',
							mandatory: true
						},
						UpdatedAt: {
							domain: 'date'
						},
						UpdatedBy: {
							domain: 'integer'
						},
						Version: {
							mandatory: true,
							domain: 'integer'
						}
					};

					var service = new PlatformUIStandardConfigService(structureLayout, domainSchema, translationService);

					platformUIStandardExtentService.extend(service, structureLayout.addition, domainSchema);

					filterCacheService.setService(cacheTypes.COSTGROUP_STRUCTURE_UI_STANDARD_SERVICE, serviceDescriptor, service);

				}
				return filterCacheService.getService(cacheTypes.COSTGROUP_STRUCTURE_UI_STANDARD_SERVICE, serviceDescriptor);
			}

			return {
				createService: createService
			};

		}]);

})(angular);
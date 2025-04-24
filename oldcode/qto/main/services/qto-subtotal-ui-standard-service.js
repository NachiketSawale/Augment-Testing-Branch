(function (angular) {
	'use strict';

	let modName = 'qto.main';
	let mod = angular.module(modName);

	mod.service('qtoMainSubTotalLayout', ['qtoMainDetailService', 'qtoMainHeaderDataService',
		function (qtoMainDetailService, qtoMainHeaderDataService) {
			return {
				'fid': 'qto.main.subtotal',
				'version': '1.0.0',
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['boqitemfk', 'basuomfk', 'prjlocationfk', 'subtotal', 'remarktext']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'boqitemfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								readOnly: true,
								lookupDirective: 'basics-lookup-data-by-custom-data-service',
								descriptionMember: 'BriefInfo.Description',
								lookupOptions: {
									'lookupType': 'boqItemLookupDataService',
									'dataServiceName': 'boqItemLookupDataService',
									'valueMember': 'Id',
									'displayMember': 'Reference'
								}
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'boqItemLookupDataService',
								dataServiceName: 'boqItemLookupDataService',
								filter: function () {
									if(qtoMainHeaderDataService.getSelected()){
										return qtoMainHeaderDataService.getSelected().BoqHeaderFk;
									}
								},
								displayMember: 'Reference'
							},
							width: 130
						}
					},
					'basuomfk': {
						'detail': {
							'type': 'directive',
							'model': 'BasUomFk',
							'directive': 'basics-lookupdata-uom-lookup'
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'Uom',
								displayMember: 'Unit'
							},
							width: 100
						}
					},
					'prjlocationfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-lookup-composite',
							'options': {
								'lookupDirective': 'basics-lookup-data-by-custom-data-service',
								'descriptionMember': 'DescriptionInfo.Translated',
								'lookupOptions': {
									'lookupType': 'ProjectLocation',
									'dataServiceName': 'qtoProjectLocationLookupDataService',
									'valueMember': 'Id',
									'displayMember': 'Code',
									'descriptionMember': 'DescriptionInfo.Translated',
									'filter': function () {
										var projectId = qtoMainDetailService.getSelectedProjectId();
										return projectId === null ? -1 : projectId;
									},
									'lookupModuleQualifier': 'qtoProjectLocationLookupDataService',
									'lookupOptions': {
										'lookupType': 'ProjectLocation'
									}
								}
							}
						},
						'grid': {
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'ProjectLocation',
								displayMember: 'Code'
							},
							width: 100
						}
					},
					'subtotal': {
						'mandatory': true
					},
					'remarktext': {
						'mandatory': true,
						width: 150
					}
				},
				'addition': {
					grid: [
						{
							lookupDisplayColumn: true,
							field: 'BoqItemFk',
							displayMember: 'BriefInfo.Description',
							name$tr$: 'qto.main.boqItemBrief',
							width: 150
						},
						{
							lookupDisplayColumn: true,
							field: 'PrjLocationFk',
							displayMember: 'DescriptionInfo.Translated',
							name$tr$: 'qto.main.PrjLocationDesc',
							width: 150
						}
					]
				}
			};
		}]);

	angular.module(modName).factory('qtoMainSubTotalUIStandardService',
		['platformUIStandardConfigService', 'qtoMainTranslationService',
			'qtoMainSubTotalLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoDetailDto',
					moduleSubModule: 'Qto.Main'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;


				var service = new UIStandardService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);
})(angular);




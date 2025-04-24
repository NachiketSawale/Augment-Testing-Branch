(function () {
	/* global Slick */
	'use strict';
	let modName = 'qto.main',
		mod = angular.module(modName);

	mod.factory('qtoMainLocationLayout',
		['qtoMainLocationDataService',function (qtoMainLocationDataService) {
			return {
				'fid': 'qto.main.location',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['code', 'descriptioninfo', 'quantity', 'quantitypercent','sorting','uomfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'code': {
						'detail': {
							'formatter': Slick.Formatters.QtoAttrAssignFilterFormatter,
							'formatterOptions': {
								assign: {
									action: qtoMainLocationDataService.assignLocation
								},
								type:'code'
							},
							width:150
						},
						'grid': {
							formatter: Slick.Formatters.QtoAttrAssignFilterFormatter,
							formatterOptions: {
								assign: {
									action: qtoMainLocationDataService.assignLocation
								},
								type:'code'
							}
						}
					},
					'descriptioninfo': {
						'detail':{
						},
						'grid':{
							'searchable': true
						}
					},
					'quantity': {
						'mandatory': true
					},
					'quantitypercent': {
						'mandatory': true
					},
					'uomfk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-lookupdata-uom-lookup',
							'options': {
								showClearButton: true
							}
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-lookupdata-uom-lookup',
								lookupOptions: {
									showClearButton: true
								}
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'uom',
								displayMember: 'Unit'
							}
						}
					}
				}
			};
		}]);
	mod.factory('qtoMainLocationUIStandardService',
		['platformUIStandardConfigService', 'qtoMainTranslationService',
			'qtoMainLocationLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				let BaseService = platformUIStandardConfigService;

				let domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'LocationDto',
					moduleSubModule: 'Project.Location'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();

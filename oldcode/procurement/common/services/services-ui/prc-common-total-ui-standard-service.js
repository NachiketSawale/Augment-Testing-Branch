(function () {
	'use strict';
	var modName = 'procurement.common';

	angular.module(modName).value('procurementCommonTotalLayout', {
		'fid': 'procurement.common.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['totaltypefk', 'valuenet', 'valuetax', 'gross', 'valuenetoc', 'valuetaxoc', 'grossoc', 'commenttext']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				TotalTypeFk: {location: modName, identifier: 'reqTotalTotalTypeFk', initial: 'reqTotalTotalTypeFk'},
				ValueNet: {location: modName, identifier: 'reqTotalValueNet', initial: 'reqTotalValueNet'},
				ValueTax: {location: modName, identifier: 'reqTotalValueTax', initial: 'reqTotalValueTax'},
				Gross: {location: modName, identifier: 'reqTotalGross', initial: 'reqTotalGross'},
				ValueNetOc: {location: modName, identifier: 'reqTotalValueNetOc', initial: 'reqTotalValueNetOc'},
				ValueTaxOc: {location: modName, identifier: 'reqTotalValueTaxOc', initial: 'reqTotalValueTaxOc'},
				GrossOc: {location: modName, identifier: 'reqTotalGrossOC', initial: 'reqTotalGrossOC'},
				CommentText: {location: modName, identifier: 'reqTotalCommentText', initial: 'reqTotalCommentText'}
			}
		},
		'overloads': {
			'totaltypefk': {
				'detail': {
					'type': 'directive',
					'directive': 'basics-lookupdata-lookup-composite',
					'options': {
						'lookupDirective': 'basics-procurement-configuration-total-type-combobox',
						'descriptionMember': 'DescriptionInfo.Translated',
						'lookupOptions': {
							filterKey: 'procurement-common-total-type-filter'
						}
					}
				},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-procurement-configuration-total-type-combobox',
						lookupOptions: {filterKey: 'procurement-common-total-type-filter'}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PrcTotalType',
						displayMember: 'Code'
					},
					width: 85
				}
			},
			'valuenet': {
				'mandatory': true,
				'width': 120
			},
			'valuetax': {
				'mandatory': true,
				'width': 120
			},
			'gross': {
				'mandatory': true,
				'width': 120
			},
			'valuenetoc': {
				'mandatory': true,
				'width': 120
			},
			'valuetaxoc': {
				'mandatory': true,
				'width': 120
			},
			'grossoc': {
				'mandatory': true,
				'width': 160
			},
			'commenttext': {
				'mandatory': true
			}
		},
		'addition': {
			grid: [
				{
					lookupDisplayColumn: true,
					field: 'TotalTypeFk',
					name$tr$: 'procurement.common.totalTypeDes',
					displayMember: 'DescriptionInfo.Translated',
					width: 125
				}]
		}
	});

	angular.module(modName).factory('procurementCommonTotalUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonTotalLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {
				var BaseService = platformUIStandardConfigService;

				/* var schemaOptions = {};
				switch (moduleContext.getMainService().name) {
					case 'procurement.contract':
						schemaOptions = {
							typeName: 'ConTotalDto',
							moduleSubModule: 'Procurement.Contract'
						};
						break;
					case 'procurement.requisition':
						schemaOptions = {
							typeName: 'ReqTotalDto',
							moduleSubModule: 'Procurement.Requisition'
						};
						break;
					case 'procurement.package':
						schemaOptions = {
							typeName: 'PrcPackageTotalDto',
							moduleSubModule: 'Procurement.Package'
						};
						break;
				} */

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'ConTotalDto',
					moduleSubModule: 'Procurement.Contract'
				});

				if (!domainSchema) {
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'ReqTotalDto',
						moduleSubModule: 'Procurement.Requisition'
					});
				}

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);

				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function () {
					return angular.copy(basicGetStandardConfigForDetailView());
				};
				return service;
			}
		]);
})();

(function () {
	'use strict';
	var prcCommonMOdName = 'procurement.common', contractModName = 'procurement.contract', cloudCommonModule = 'cloud.common';

	angular.module(contractModName).value('procurementChangeOrderItemDeliveryLayout', {
		'fid': 'procurement.common.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'scheduleFormTitle',
				'attributes': ['daterequired', 'newdaterequired', 'runningnumber', 'prcitemstatusfk', 'description', 'quantity']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [prcCommonMOdName],
			'extraWords': {
				scheduleFormTitle: {
					location: prcCommonMOdName,
					identifier: 'deliveryScheduleFormTitle',
					initial: 'deliveryScheduleFormTitle'
				},
				DateRequired: {
					location: cloudCommonModule,
					identifier: 'entityRequiredBy',
					initial: 'entityRequiredBy'
				},
				NewDateRequired: {
					location: cloudCommonModule,
					identifier: 'entityNewDateRequired',
					initial: 'entityNewDateRequired'
				},
				Description: {
					location: cloudCommonModule,
					identifier: 'entityDescription',
					initial: 'entityDescription'
				},
				Quantity: {location: cloudCommonModule, identifier: 'entityQuantity', initial: 'entityQuantity'},
				RunningNumber: {
					location: prcCommonMOdName,
					identifier: 'delivery.runningNumber',
					initial: 'delivery.runningNumber'
				},
				PrcItemstatusFk: {location: cloudCommonModule, identifier: 'entityState', initial: 'entityState'}

			}
		},
		'overloads': {
			'daterequired': {
				'mandatory': true,
				'readonly': true
			},
			'newdaterequired': {
				'formatter': function iconDeliverySchedulesFormatter(row, cell, value, columnDef, dataContext) {
					var error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
					if (value !== null){
						var isInvalid = value._d.toString();
						if (isInvalid === 'Invalid Date') {
							var date = new Date();

							return '<i class="block-image control-icons ico-grid-warning-yellow" title= "Invalid Date"></i><span class="pane-r">' + window.moment(date).utc().format('DD/MM/YYYY') + '</span>';
						}
						if (error) {
							return '<i class="block-image control-icons ico-grid-warning-yellow" title="' + error.error + '"></i><span class="pane-r">' + window.moment(value).utc().format('DD/MM/YYYY') + '</span>';
						}
						else {
							return '<div>' + window.moment(value).utc().format('DD/MM/YYYY') + '</div>';
						}
					}
				},
				'mandatory': true
			},
			'description': {
				'readonly': true,
				'mandatory': true
			},
			'quantity': {
				'readonly': true,
				'mandatory': true
			},
			'runningnumber': {
				'mandatory': true,
				'readonly': true,
			},
			'prcitemstatusfk': {
				'detail': {
					'type': 'directive',
					'model': 'PrcItemstatusFk',
					'directive': 'procurement-common-prc-item-status-combobox',
					'options': {
						readOnly: true
					}
				},
				'grid': {
					editor: null,
					type: '',
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'PrcItemStatus',
						displayMember: 'DescriptionInfo.Translated',
						imageSelector: 'platformStatusIconService'
					},
					width: 100
				}
			}


		}
	});

	angular.module(contractModName).factory('procurementChangeOrderItemDeliveryUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementChangeOrderItemDeliveryLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItemdeliveryDto',
					moduleSubModule: 'Procurement.Common'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function DeliveryUIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				DeliveryUIStandardService.prototype = Object.create(BaseService.prototype);
				DeliveryUIStandardService.prototype.constructor = DeliveryUIStandardService;

				return new BaseService(layout, domainSchema, translationService);
			}
		]);
})();

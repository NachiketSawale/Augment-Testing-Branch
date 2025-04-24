(function () {
	'use strict';
	var modName = 'procurement.common',
		cloudCommonModule = 'cloud.common';
	/* global _ */
	angular.module(modName).factory('procurementCommonItemdeliveryLayout', ['basicsCommonComplexFormatter', 'basicsCommonRoundingService',
		function (complexFormatter, roundingService) {
			let basRoundingDataService = roundingService.getService('basics.material');
			let layout= {
				'fid': 'procurement.common.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'quantityTitle',
						'attributes': ['totalquantity', 'quantityscheduled', 'openquantity']
					},
					{
						'gid': 'scheduleFormTitle',
						'attributes': ['daterequired', 'timerequired', 'description', 'quantity', 'commenttext', 'runningnumber', 'quantityconfirm', 'deliverdateconfirm', 'prcitemstatusfk', 'addressdto']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName],
					'extraWords': {
						scheduleFormTitle: {
							location: modName,
							identifier: 'deliveryScheduleFormTitle',
							initial: 'deliveryScheduleFormTitle'
						},
						quantityTitle: {
							location: modName,
							identifier: 'deliveryScheduleFormQuantityTitle',
							initial: 'deliveryScheduleFormQuantityTitle'
						},
						totalQuantity: {
							location: modName,
							identifier: 'deliveryScheduleTotalQuantity',
							initial: 'deliveryScheduleTotalQuantity'
						},
						quantityScheduled: {
							location: modName,
							identifier: 'deliveryScheduleQuantityScheduled',
							initial: 'deliveryScheduleQuantityScheduled'
						},
						openQuantity: {
							location: modName,
							identifier: 'deliveryScheduleOpenQuantity',
							initial: 'deliveryScheduleOpenQuantity'
						},
						DateRequired: {
							location: cloudCommonModule,
							identifier: 'entityRequiredBy',
							initial: 'entityRequiredBy'
						},
						TimeRequired: {
							location: cloudCommonModule, identifier: 'entityTime', initial: 'entityTime'
						},
						Description: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'entityDescription'
						},
						Quantity: {
							location: cloudCommonModule, identifier: 'entityQuantity', initial: 'entityQuantity'
						},
						CommentText: {
							location: cloudCommonModule, identifier: 'entityComment', initial: 'entityComment'
						},
						RunningNumber: {
							location: modName,
							identifier: 'delivery.runningNumber',
							initial: 'delivery.runningNumber'
						},
						QuantityConfirm: {
							location: modName,
							identifier: 'delivery.quantityConfirm',
							initial: 'delivery.quantityConfirm'
						},
						DeliverdateConfirm: {
							location: modName,
							identifier: 'delivery.deliverdateConfirm',
							initial: 'delivery.deliverdateConfirm'
						},
						PrcItemstatusFk: {
							location: cloudCommonModule, identifier: 'entityState', initial: 'entityState'
						},
						AddressDto: {
							location: modName,
							identifier: 'delivery.addressdto',
							initial: 'delivery.addressdto'
						}
					}
				},
				'overloads': {
					'totalquantity': {
						'detail': {
							'type': 'directive',
							'directive': 'prc-common-quantity-calculate'
						},
						'grid': {
							type: 'quantity',
							readonly: true
						}
					},
					'quantityscheduled': {
						'detail': {
							'type': 'directive',
							'directive': 'prc-common-quantity-calculate'
						},
						'grid': {
							type: 'quantity',
							readonly: true
						}
					},
					'openquantity': {
						'detail': {
							'type': 'directive',
							'directive': 'prc-common-quantity-calculate'
						},
						'grid': {
							type: 'quantity',
							readonly: true
						}
					},
					'daterequired': {
						'formatter': function iconDeliverySchedulesFormatter(row, cell, value, columnDef, dataContext) {
							var error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
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

						},
						'mandatory': true
					},
					'timerequired': {
						'mandatory': true
					},
					'description': {
						'mandatory': true
					},
					'quantity': {
						'mandatory': true
					},
					'commenttext': {
						'mandatory': true
					},
					'runningnumber': {
						'mandatory': true
					},
					'quantityconfirm': {
						'mandatory': true
					},
					'deliverdateconfirm': {
						'formatter': function iconDeliverySchedulesFormatter(row, cell, value, columnDef, dataContext) {
							var error = dataContext.__rt$data.errors && dataContext.__rt$data.errors[columnDef.field];
							if(!_.isNil(value)) {
								var isInvalid = value.toString();
								if (isInvalid === 'Invalid Date') {
									var date = new Date();

									return '<i class="block-image control-icons ico-grid-warning-yellow" title= "Invalid Date"></i><span class="pane-r">' + window.moment(date).utc().format('DD/MM/YYYY') + '</span>';
								}
								if (error) {
									return '<i class="block-image control-icons ico-grid-warning-yellow" title="' + error.error + '"></i><span class="pane-r">' + window.moment(value).utc().format('DD/MM/YYYY') + '</span>';
								} else {
									return '<div>' + window.moment(value).utc().format('DD/MM/YYYY') + '</div>';
								}
							}else{
								return  null;
							}
						},
						'mandatory': true
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
					},
					'addressdto': {
						'grid': {
							id: 'address',
							field: 'AddressDto',
							name: 'Address',
							name$tr$: 'cloud.common.entityAddress',
							sortable: true,
							editor: 'lookup',
							editorOptions: {
								lookupDirective: 'basics-common-address-dialog',
								lookupOptions: {
									titleField: 'cloud.common.entityAddress',
									foreignKey: 'BasAddressFk',
									showClearButton: true
								}
							},
							formatter: complexFormatter,
							formatterOptions: {
								displayMember: 'AddressLine'
							}
						},
						'detail': {
							rid: 'address',
							gid: 'scheduleFormTitle',
							model: 'AddressDto',
							label: 'Address',
							label$tr$: 'cloud.common.entityAddress',
							type: 'directive',
							directive: 'basics-common-address-dialog',
							options: {
								titleField: 'cloud.common.entityAddress',
								foreignKey: 'BasAddressFk',
								showClearButton: true
							}
						}
					}
				}
			};

			basRoundingDataService.uiRoundingConfig(layout);
			return layout;
		}
	]);

	angular.module(modName).factory('procurementCommonItemdeliveryUIStandardService',
		['platformUIStandardConfigService', 'procurementCommonTranslationService',
			'procurementCommonItemdeliveryLayout', 'platformSchemaService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItemdeliveryDto',
					moduleSubModule: 'Procurement.Common'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);
				// override getStandardConfigForDetailView
				var basicGetStandardConfigForDetailView = service.getStandardConfigForDetailView;
				service.getStandardConfigForDetailView = function () {
					return angular.copy(basicGetStandardConfigForDetailView());
				};


				var stdGridConfig = service.getStandardConfigForListView();
				stdGridConfig.columns = stdGridConfig.columns.filter(function (item) {
					return ['openquantity', 'quantityscheduled', 'totalquantity'].indexOf(item.id) === -1;
				});


				return service;
			}
		]);
})();

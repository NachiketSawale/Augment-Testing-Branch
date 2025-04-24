(function () {
	'use strict';
	var modName = 'basics.procurementstructure';
	angular.module(modName)
		.factory('basicsProcurementEventLayout',[
			function () {
				return {
					'fid': 'basics.procurementstructure.event.detail',
					'version': '1.0.0',
					'addValidationAutomatically': true,
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['sorting', 'prceventtypefk', 'startnoofdays', 'startbasis', 'endnoofdays', 'endbasis',
								'prcsystemeventtypestartfk', 'prceventtypestartfk', 'prcsystemeventtypeendfk', 'prceventtypeendfk',
								'addleadtimetostart','addleadtimetoend']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],
					'translationInfos': {
						'extraModules': [],
						'extraWords': {
							Sorting: {
								location: modName,
								identifier: 'eventSorting',
								initial: 'sorting'
							},
							PrcEventTypeFk: {
								location: modName,
								identifier: 'eventType',
								initial: 'eventType'
							},
							StartNoOfDays: {
								location: modName,
								identifier: 'startNoOfDays',
								initial: 'startNoOfDays'
							},
							StartBasis: {
								location: modName,
								identifier: 'startBasis',
								initial: 'startBasis'
							},
							EndNoOfDays: {
								location: modName,
								identifier: 'endNoOfDays',
								initial: 'endNoOfDays'
							},
							EndBasis: {
								location: modName,
								identifier: 'endBasis',
								initial: 'endBasis'
							},
							PrcSystemEventTypeStartFk: {
								location: modName,
								identifier: 'systemEventTypeStart',
								initial: 'systemEventTypeStart'
							},
							PrcEventTypeStartFk: {
								location: modName,
								identifier: 'eventTypeStart',
								initial: 'eventTypeStart'
							},
							PrcSystemEventTypeEndFk: {
								location: modName,
								identifier: 'systemEventTypeEnd',
								initial: 'systemEventTypeEnd'
							},
							PrcEventTypeEndFk: {
								location: modName,
								identifier: 'eventTypeEnd',
								initial: 'eventTypeEnd'
							},
							AddLeadTimeToStart: {
								location: modName,
								identifier: 'addLeadTimeToStart',
								initial: 'Include Lead Time To Start'
							},
							AddLeadTimeToEnd: {
								location: modName,
								identifier: 'addLeadTimeToEnd',
								initial: 'Include Lead Time To End'
							}

						}
					},
					'overloads': {
						'prceventtypefk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-procurement-structure-event-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcEventType',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 100
							},
							'detail': {
								'type': 'directive',
								'directive': 'basics-procurement-structure-event-type-combobox',
								'options': {
									descriptionMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'startnoofdays': {
							'grid': {
								formatter: 'integer',
								editor: 'directive',
								editorOptions: {
									directive: 'event-limit-input',
									validKeys: {
										regular: '^[0-9]{1,4}$'
									},
									isCodeProperty: true
								},
								width: 130
							},
							'detail': {
								'type': 'directive',
								'directive': 'event-limit-input',
								'options': {
									validKeys: {
										regular: '^[0-9]{1,4}$'
									},
									isCodeProperty: true
								}
							}
						},
						'startbasis': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-procurement-Structure-start-basis-lookup',
									lookupOptions: {
										filterKey: 'structure-event-start-basics-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'StartBasis',
									displayMember: 'Description'
								},
								width: 130
							},
							'detail': {
								'type': 'directive',
								directive: 'basics-procurement-Structure-start-basis-lookup',
								'options': {
									descriptionMember: 'Description',
									filterKey: 'structure-event-start-basics-filter'
								}
							}
						},
						'endnoofdays': {
							'grid': {
								editor: 'directive',
								editorOptions: {
									directive: 'event-limit-input',
									validKeys: {
										regular: '^[0-9]{1,4}$'
									},
									isCodeProperty: true
								},
								formatter: 'integer',
								width: 130
							},
							'detail': {
								'type': 'directive',
								'directive': 'event-limit-input',
								'options': {
									validKeys: {
										regular: '^[0-9]{1,4}$'
									},
									isCodeProperty: true
								}
							}
						},
						'endbasis': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'basics-procurement-Structure-end-basis-lookup',
									lookupOptions: {
										filterKey: 'structure-event-end-basics-filter'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'EndBasis',
									displayMember: 'Description'
								},
								width: 100
							},
							'detail': {
								'type': 'directive',
								directive: 'basics-procurement-Structure-end-basis-lookup',
								'options': {
									descriptionMember: 'Description',
									filterKey: 'structure-event-end-basics-filter'
								}
							}
						},
						'prcsystemeventtypestartfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									},
									directive: 'basics-procurement-structure-system-event-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcSystemEventType',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 140
							},
							'detail': {
								type: 'directive',
								directive: 'basics-procurement-structure-system-event-type-combobox',
								'options': {
									showClearButton: true,
									descriptionMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'prceventtypestartfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated',
										filterKey: 'procurement-structure-event-event-type-filter'
									},
									directive: 'basics-procurement-structure-event-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcEventType',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 140
							},
							'detail': {
								type: 'directive',
								directive: 'basics-procurement-structure-event-type-combobox',
								options: {
									showClearButton: true,
									filterKey: 'procurement-structure-event-event-type-filter'
								}
							}
						},
						'prcsystemeventtypeendfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									},
									directive: 'basics-procurement-structure-system-event-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcSystemEventType',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 140
							},
							'detail': {
								type: 'directive',
								directive: 'basics-procurement-structure-system-event-type-combobox',
								'options': {
									showClearButton: true,
									descriptionMember: 'DescriptionInfo.Translated'
								}
							}
						},
						'prceventtypeendfk': {
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated',
										filterKey: 'procurement-structure-event-event-type-filter'
									},
									directive: 'basics-procurement-structure-event-type-combobox'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcEventType',
									displayMember: 'DescriptionInfo.Translated'
								},
								width: 140
							},
							'detail': {
								type: 'directive',
								directive: 'basics-procurement-structure-event-type-combobox',
								options: {
									showClearButton: true,
									filterKey: 'procurement-structure-event-event-type-filter'
								}
							}
						},
						'addleadtimetostart':{
							'detail': {
								'type': 'directive',
								'directive': 'basics-prc-structure-event-option-combo-box',
								'options': {
									'eagerLoad': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-prc-structure-event-option-combo-box'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcEventOption',
									displayMember: 'Description'
								}
							}
						},
						'addleadtimetoend':{
							'detail': {
								'type': 'directive',
								'directive': 'basics-prc-structure-event-option-combo-box',
								'options': {
									'eagerLoad': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									lookupDirective: 'basics-prc-structure-event-option-combo-box'
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'PrcEventOption',
									displayMember: 'Description'
								}
							}
						}
					}
				};
			}])
		.factory('basicsProcurementEventUIStandardService',
			['platformUIStandardConfigService', 'basicsProcurementstructureTranslationService','basicsProcurementEventOptionService',
				'basicsProcurementEventLayout', 'platformSchemaService',

				function (platformUIStandardConfigService, translationService,basicsProcurementEventOptionService, layout, platformSchemaService) {

					var BaseService = platformUIStandardConfigService;

					var domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'PrcStructureEventDto',
						moduleSubModule: 'Basics.ProcurementStructure'
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
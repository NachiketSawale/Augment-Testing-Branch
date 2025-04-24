(function (angular) {

	'use strict';

	var modName = 'basics.characteristic',
		cloudCommonModule = 'cloud.common';

	//Layout specs
	angular.module(modName).value('basicsCharacteristicRemarkLayout', {
		'fid': 'basics.characteristic.detailform',
		'version': '1.0.0',
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['currency']
			}
		],
		'overloads': {
			'description': {
				'detail': {
					'model': 'DescriptionInfo.Translated'
				},
				'grid': {
					'field': 'DescriptionInfo.Translated'
				}
			}
		}
	});

	angular.module(modName).value('basicsCharacteristicSectionDetailLayout', {
		'fid': 'basics.characteristic.section.layout',
		'version': '1.0.0',
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				// 'attributes': ['checked', 'descriptioninfo', 'sectionname']
				'attributes': ['checked', 'descriptioninfo']
			}
		],
		'overloads': {
			'checked': {
				validator: 'validateModel'
			},
			//'sectionname': {
			//	readonly: true
			//},
			'descriptioninfo': {
				readonly: true
			}
		},
		'translationInfo': {
			'extraModules': [modName],
			'extraWords': {
				SectionName: {location: modName, identifier: 'entitySection', initial: 'Section'}
			}
		}

	});

	angular.module(modName).value('basicsCharacteristicAutomaticAssignmentDetailLayout', {
		'fid': 'basics.Characteristic.AutomaticAssignmentform',
		'version': '1.0.0',
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['checked', 'descriptioninfo']
			}
		],
		'overloads': {
			'checked': {
				'formatter': 'boolean',
				'editor': 'boolean'
			},
			'descriptioninfo': {
				readonly: true
			}
		}
	});

	angular.module(modName).value('basicsCharacteristicDiscreteValueLayout', {
		'fid': 'basics.characteristic.discretevaluedetail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['descriptioninfo', 'sorting', 'isdefault']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				Sorting: {location: cloudCommonModule, identifier: 'entitySorting', initial: 'Sorting'},
				IsDefault: {location: cloudCommonModule, identifier: 'entityIsDefault', initial: 'Is Default'}
			}
		},
		'overloads': {}
	});

	angular.module(modName).value('basicsCharacteristicGroupLayout', {
		'fid': 'basics.characteristic.groupdetail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['id', 'descriptioninfo']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [modName],
			'extraWords': {
				//Id: {location: cloudCommonModule, identifier: 'entityId', initial: 'Id'},
				//Description: {location: cloudCommonModule, identifier: 'entityDescription', initial: 'Description'}
			}
		},
		'overloads': {
			'id': {'readonly': true},
			'descriptioninfo': {
				'maxLength': 252
			}
		}
	});

	angular.module(modName).value('basicsCharacteristicChainCharacteristicLayout', {
		'fid': 'basics.Characteristic.ChainCharacteristic',
		'version': '1.0.0',
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['chainedcharacteristicfk']
			}
		],
		'overloads': {
			// 'checked': {
			// 	'formatter': 'boolean',
			// 	'editor': 'boolean'
			// },
			'chainedcharacteristicfk': {

				'detail': {},
				'grid': {
					editor: 'lookup',
					editorOptions: {
						directive: 'basics-characteristic-code-lookup-by-group',
						lookupOptions: {
							showClearButton: false,
							// filterKey: 'basicsCharacteristicCodeLookupFilter' + service.getSectionId(), --> done in service
							//filter: function (item) {   --> does not work?
							//	return service.getSectionId();
							//}
							sectionId: 1 // sectionId ,
							// removeUsed: params.hasOwnProperty('removeUsedCodes') ? params.removeUsedCodes : true,
							// characteristicDataService: params.characteristicDataService
						}
					},
					formatter: 'lookup',
					formatterOptions: {
						lookupType: 'basicsCharacteristicCodeLookup',
						displayMember: 'DescriptionInfo.Description'
					}
				}
			}

		},
		'translationInfo': {
			'extraModules': [modName],
			'extraWords': {
				ChainedCharacteristicFk: {location: modName, identifier: 'entityChainedCharacteristicFk', initial: 'Chained Characteristics'}
			}
		}

	});

	// todo: should ba separate file
	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('basicsCharacteristicCharacteristicLayoutService', ['basicsCharacteristicTypeHelperService','basicsLookupdataConfigGenerator',
		function (basicsCharacteristicTypeHelperService,basicsLookupdataConfigGenerator) {
			var service = {};
			var layout = {
				'fid': 'basics.characteristic.characteristicdetail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['id', 'characteristicgroupfk', 'code', 'descriptioninfo', 'characteristictypefk', 'defaultvalue', 'validfrom', 'validto','indexheaderfk']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'translationInfos': {
					'extraModules': [modName],
					'extraWords': {
						Code: {location: cloudCommonModule, identifier: 'entityCode', initial: 'Code'},
						DescriptionInfo: {
							location: cloudCommonModule,
							identifier: 'entityDescription',
							initial: 'Description'
						},
						CharacteristicTypeFk: {location: modName, identifier: 'entityCharacteristicTypeFk', initial: 'Type'},
						CharacteristicGroupFk: {location: modName, identifier: 'entityGroupFk', initial: 'Group-Id'},
						DefaultValue: {location: modName, identifier: 'entityDefaultValue', initial: 'Default Value'},
						ValidFrom: {location: cloudCommonModule, identifier: 'entityValidFrom', initial: 'Valid From'},
						ValidTo: {location: cloudCommonModule, identifier: 'entityValidTo', initial: 'Valid To'},
						IndexHeaderFk: {location: modName, identifier: 'indexheaderfk', initial: 'IndexHeader'}
					}
				},
				'overloads': {
					'code': {
						'mandatory': true
					},
					'descriptioninfo': {
						'maxLength': 252
					},
					'indexheaderfk':basicsLookupdataConfigGenerator.provideDataServiceLookupConfig(
						{
							dataServiceName:'basicsCharacteristicIndexHeaderLookupDataService',
							enableCache: true
						}),
					'characteristictypefk': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-characteristic-characteristic-type-combobox'
						},
						'grid': {
							editor: 'lookup',
							editorOptions: {
								directive: 'basics-characteristic-characteristic-type-combobox'
							},
							formatter: 'lookup',
							formatterOptions: {
								lookupType: 'CharacteristicType',
								displayMember: 'Description'
							}
						}
					},
					'defaultvalue': {
						'detail': {
							'type': 'directive',
							'directive': 'basics-characteristic-select-control',
							'maxLength': 252
						},
						'grid': {
							maxLength: 252,
							formatter: 'dynamic',
							editor: 'dynamic',
							domain: function (item, column) {
								var domain;
								switch (item.CharacteristicTypeFk) {
									case 10:
										domain = 'lookup';
										column.editorOptions = {
											directive: 'basics-characteristic-value-combobox'
										};
										column.formatterOptions = {
											lookupType: 'CharacteristicValue',
											displayMember: 'DescriptionInfo.Translated'
										};
										break;
									case 7:
									case 8:
										domain = 'lookup';
										column.editorOptions = {
											directive: 'basics-characteristic-date-combobox'
										};
										column.formatterOptions = {
											lookupType: 'CharacteristicDate',
											displayMember: 'Description'
										};
										break;
									default:
										domain = basicsCharacteristicTypeHelperService.characteristicType2Domain(item.CharacteristicTypeFk);
										column.editorOptions = null;
										column.formatterOptions = null;
										break;
								}
								return domain;
							}
						}
					},
					'id': {'readonly': true},
					'characteristicgroupfk': {
						'readonly': true
					}
				}
			};

			service.getLayout = function () {
				return layout;
			};

			return service;
		}]);
})(angular);
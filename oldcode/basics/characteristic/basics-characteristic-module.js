(function (angular) {
	/* global globals */
	'use strict';

	const moduleName = 'basics.characteristic';

	angular.module(moduleName, []);
	globals.modules.push(moduleName);

	angular.module(moduleName)
		.config(['mainViewServiceProvider',
			function (mainViewServiceProvider) {

				const options = {
					'moduleName': moduleName,
					'resolve': {
						'loadDomains': ['platformSchemaService', function (platformSchemaService) {

							platformSchemaService.initialize();
							return platformSchemaService.getSchemas([
								{ typeName: 'CharacteristicDto', moduleSubModule: 'Basics.Characteristic' },
								{ typeName: 'CharacteristicDataDto', moduleSubModule: 'Basics.Characteristic' },
								{ typeName: 'CharacteristicGroupDto', moduleSubModule: 'Basics.Characteristic' },
								{ typeName: 'CharacteristicGroup2SectionDto', moduleSubModule: 'Basics.Characteristic' },
								{ typeName: 'CharacteristicValueDto', moduleSubModule: 'Basics.Characteristic' },
								{ typeName: 'CompanyDto', moduleSubModule: 'Basics.Characteristic' },
								{ typeName: 'CharacteristicSectionDto', moduleSubModule: 'Basics.Characteristic' },
								{ typeName: 'CharacteristicChainDto', moduleSubModule: 'Basics.Characteristic' }
							]);
						}],
						'loadLookup': ['basicsLookupdataLookupDefinitionService', function(basicsLookupdataLookupDefinitionService){
							return basicsLookupdataLookupDefinitionService.load([
								'basicsCharacteristicDateCombobox',
								'basicsCharacteristicValueCombobox',
								'basicsCharacteristicCodeLookup'
							]);
						}]
					},
					'controller': 'basicsCharacteristicController'
				};

				mainViewServiceProvider.registerModule(options);

			}
		]);

})(angular);

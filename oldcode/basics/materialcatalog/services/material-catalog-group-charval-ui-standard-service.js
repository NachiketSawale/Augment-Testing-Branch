( function ()
{
	'use strict';
	var modName = 'basics.materialcatalog';

	angular.module( modName ).value( 'basicsMaterialGroupCharValLayout', {
		'fid': 'basics.materialCatalog.detail',
		'version': '1.0.0',
		'addValidationAutomatically': true,
		'showGrouping': true,
		'groups': [
			{
				'gid': 'basicData',
				'attributes': ['characteristicinfo']
			},
			{
				'gid': 'entityHistory',
				'isHistory': true
			}
		],
		'translationInfos': {
			'extraModules': [],
			'extraWords': {
				CharacteristicInfo: { location: modName, identifier: 'characteristic', initial: 'characteristic' }
			}
		},
		'overloads': {
			'characteristicinfo': {
				'mandatory': true
			}
		}
	} );

	angular.module( modName ).factory( 'basicsMaterialCatalogGroupCharValUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialcatalogTranslationService',
			'basicsMaterialGroupCharValLayout', 'platformSchemaService',

			function ( platformUIStandardConfigService, translationService, layout, platformSchemaService )
			{

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache( {
					typeName: 'MaterialGroupCharvalDto',
					moduleSubModule: 'Basics.MaterialCatalog'
				} );
				if ( domainSchema )
				{
					domainSchema = domainSchema.properties;
				}
				function UIStandardService( layout, scheme, translateService )
				{
					BaseService.call( this, layout, scheme, translateService );
				}

				UIStandardService.prototype = Object.create( BaseService.prototype );
				UIStandardService.prototype.constructor = UIStandardService;

				return new BaseService( layout, domainSchema, translationService );
			}
		] );
} )();

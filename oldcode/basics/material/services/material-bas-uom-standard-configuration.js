/**
 * Created by yew on 9/25/2019.
 */
(function(angular){

	'use strict';

	var moduleName = 'basics.material', cloudCommonModule = 'cloud.common';

	angular.module(moduleName).factory('basicsMaterial2basUomLayout', [ function(){
		return {
			fid : 'basics.material.basuom.detail',
			version: '1.0.0',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [{
				gid: 'basicData',
				attributes: ['basuomfk','quantity', 'commenttext','isdefaultforinternaldelivery']
			},
			{
				gid: 'entityHistory',
				isHistory: true
			}],
			translationInfos:{
				extraModules: [moduleName, cloudCommonModule],
				extraWords: {
					BasUomFk: {location: moduleName, identifier: 'basUom.basUom', initial: 'UoM'},
					Quantity: {location: moduleName, identifier: 'basUom.quantity', initial: 'Quantity'},
					CommentText: {location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment'},
					IsDefaultForInternalDelivery: { location: moduleName, identifier: 'basUom.isdefaultforinternaldelivery', intial:'Default for Internal Delivery'}
				}
			},
			overloads: {
				basuomfk: {
					'grid': {
						'editor': 'lookup',
						'editorOptions': {
							'directive': 'basics-lookupdata-uom-lookup'
						},
						'formatter': 'lookup',
						'formatterOptions': {
							'lookupType': 'Uom',
							'displayMember': 'Unit'
						},
						'width': 100
					},
					'detail': {
						'type': 'directive',
						'directive': 'basics-lookupdata-uom-lookup'
					}
				},
				quantity: {
					formatterOptions: {
						decimalPlaces: 3
					},
					editorOptions:{
						decimalPlaces: 3
					}
				}
			}
		};
	}]);

	angular.module(moduleName).factory('basicsMaterial2basUomUIStandardService', basicsMaterial2basUomUIStandardService);
	basicsMaterial2basUomUIStandardService.$inject = ['platformUIStandardConfigService', 'basicsMaterialTranslationService',
		'basicsMaterial2basUomLayout', 'platformSchemaService'];
	function basicsMaterial2basUomUIStandardService(platformUIStandardConfigService, basicsMaterialTranslationService,
					 basicsMaterial2basUomLayout, platformSchemaService) {

		var BaseService = platformUIStandardConfigService;

		var domainSchema = platformSchemaService.getSchemaFromCache({
			typeName: 'MdcMaterial2basUomDto',
			moduleSubModule: 'Basics.Material'
		});
		if (domainSchema) {
			domainSchema = domainSchema.properties;
		}
		function UIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UIStandardService.prototype = Object.create(BaseService.prototype);
		UIStandardService.prototype.constructor = UIStandardService;

		return new BaseService(basicsMaterial2basUomLayout, domainSchema, basicsMaterialTranslationService);
	}
})(angular);
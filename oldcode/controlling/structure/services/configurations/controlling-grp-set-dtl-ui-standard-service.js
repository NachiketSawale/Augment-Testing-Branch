/**
 * Created by lcn on 5/22/2019.
 */
(function () {
	'use strict';
	var moduleName = 'controlling.structure';


	angular.module(moduleName).factory('controllingStructureGrpSetDTLLayout',['basicsLookupdataConfigGenerator',function (basicsLookupdataConfigGenerator) {
		return {
			fid: 'controlling.structure.grpsetdtl',
			version: '1.0.1',
			addValidationAutomatically: true,
			showGrouping: true,
			groups: [{gid: 'baseGroup',attributes: ['controllinggroupfk','controllinggroupdetailfk']},{
				gid: 'entityHistory',isHistory: true
			}],
			overloads: {
				controllinggroupfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'controllingGroupLookupDataService',enableCache: true
				}),controllinggroupdetailfk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'controllingGroupDetailLookupDataService',filter: function (item) {
						return item && item.ControllinggroupFk ? item.ControllinggroupFk : null;
					},enableCache: true,columns: [{
						id: 'Code',field: 'Code',name: 'Code',formatter: 'code',name$tr$: 'cloud.common.entityCode'
					},{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					},{
						id: 'CommentText',
						field: 'CommentText',
						name: 'Comment',
						formatter: 'description',
						name$tr$: 'cloud.common.entityCommentText'
					}]
				})
			}
		};
	}]);

	angular.module(moduleName).factory('controllingStructureGrpSetDTLUIStandardService',
		['controllingStructureGrpSetDTLLayout','platformUIStandardConfigService', 'platformSchemaService', 'controllingStructureTranslationService',
			function (layout,platformUIStandardConfigService, platformSchemaService, translationService) {

				var BaseService = platformUIStandardConfigService,
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'ControllingGrpSetDTLDto',
						moduleSubModule: 'Controlling.Structure'
					});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}

				function UIStandardService(layout, dtoScheme, translationService) {
					BaseService.call(this, layout, dtoScheme, translationService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new UIStandardService(layout, domainSchema, translationService);
			}]);
})();
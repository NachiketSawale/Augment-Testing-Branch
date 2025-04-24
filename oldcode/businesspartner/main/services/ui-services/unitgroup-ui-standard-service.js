/**
 * Created by lcn on 5/7/2019.
 */
(function () {
	'use strict';
	var modName = 'businesspartner.main';

	angular.module(modName).factory('businessPartnerMainUnitgroupLayout', ['basicsLookupdataConfigGenerator', function (basicsLookupdataConfigGenerator) {
		return {
			'fid': 'businesspartner.main.groupdetailform',
			'version': '1.0.1',
			'addValidationAutomatically': true,
			'showGrouping': true,
			'groups': [{
				'gid': 'basicData', 'attributes': ['controllinggroupfk', 'controllinggrpdetailfk']
			}, {
				'gid': 'entityHistory', 'isHistory': true
			}],
			'translationInfos': {
				'extraModules': [modName],
				'extraWords': {
					ControllinggroupFk:
						{
							location: modName, identifier: 'ControllinggroupFk', initial: 'Controlling Group'
						},
					ControllinggrpdetailFk:
						{
							location: modName, identifier: 'ControllinggrpdetailFk', initial: 'Controlling Group Detail'
						}
				}
			},
			'overloads': {
				'controllinggroupfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'controllingGroupLookupDataService', enableCache: true
				}), 'controllinggrpdetailfk': basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
					dataServiceName: 'controllingGroupDetailLookupDataService', filter: function (item) {
						return item && item.ControllinggroupFk ? item.ControllinggroupFk : null;
					}, enableCache: true, columns: [{
						id: 'Code', field: 'Code', name: 'Code', formatter: 'code', name$tr$: 'cloud.common.entityCode'
					}, {
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}, {
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

	/* jshint -W072 */ // many parameters because of dependency injection
	angular.module(modName).factory('businessPartnerMainUnitgroupUIStandardService', ['platformUIStandardConfigService', 'businesspartnerMainTranslationService', 'businessPartnerMainUnitgroupLayout', 'platformSchemaService', function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
		var BaseService = platformUIStandardConfigService;
		var domains = platformSchemaService.getSchemaFromCache({
			typeName: 'Bp2controllinggroupDto', moduleSubModule: 'BusinessPartner.Main'
		}).properties;

		function UIStandardService(layout, scheme, translateService) {
			BaseService.call(this, layout, scheme, translateService);
		}

		UIStandardService.prototype = Object.create(BaseService.prototype);
		UIStandardService.prototype.constructor = UIStandardService;
		return new BaseService(layout, domains, translationService);

	}]);
})();

/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function (angular) {
	'use strict';

	var salesCommonModule = 'sales.common';
	var basicsCommonModule = 'basics.common';
	var cloudCommonModule = 'cloud.common';
	var boqMainModule = 'boq.main';
	var projectMainModule = 'project.main';
	var businesspartnerMainModule = 'businesspartner.main';

	/* jshint -W106 */ // Variable name is according usage in translation json
	angular.module(salesCommonModule).value('salesCommonGeneralsTranslations', {
		translationInfos: {
			'extraModules': [salesCommonModule, projectMainModule, cloudCommonModule, basicsCommonModule, boqMainModule, businesspartnerMainModule],
			'extraWords': {
				GeneralsTypeFk: {
					location: salesCommonModule,
					identifier: 'generals.entity.generalsTypeFk',
					initial: 'Type'
				},
				ControllingUnitFk: {
					location: salesCommonModule,
					identifier: 'generals.entity.controllingUnitFk',
					initial: 'Controlling Unit'
				},
				TaxCodeFk: {location: salesCommonModule, identifier: 'generals.entity.taxCodeFk', initial: 'Tax Code'},
				ValueType: {
					location: salesCommonModule,
					identifier: 'generals.entity.valueType',
					initial: 'Value Type'
				},
				Value: {location: salesCommonModule, identifier: 'generals.entity.value', initial: 'Value'},
				CommentText: {
					location: salesCommonModule,
					identifier: 'generals.entity.commentText',
					initial: 'Comment'
				}
			}
		}
	});

	/**
	 * @ngdoc service
	 * @name salesBillingTranslationService
	 * @description provides translation for sales billing module
	 */
	angular.module(salesCommonModule).service('salesCommonGeneralsTranslationService', ['platformUIBaseTranslationService', 'salesCommonGeneralsTranslations', 'salesCommonTranslations',
		function (platformUIBaseTranslationService, salesCommonGeneralsTranslations, salesCommonTranslations) {
			var localBuffer = {};

			platformUIBaseTranslationService.call(this, [salesCommonTranslations, salesCommonGeneralsTranslations], localBuffer);
		}

	]);

})(angular);
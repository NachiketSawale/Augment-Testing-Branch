
(function () {
	'use strict';
	let moduleName = 'qto.main';


	angular.module(moduleName).factory('qtoDetailCommentsConfigurationService',
		['platformUIStandardConfigService', 'qtoMainTranslationService', 'platformSchemaService',

			function (PlatformUIStandardConfigService, qtoMainTranslationService, platformSchemaService) {

				function createDocumentDetailLayout(fid, version) {
					return {
						'fid': fid,
						'version': version,
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [{
							'gid': 'basicData',
							'attributes': ['commentdescription', 'basqtocommentstypefk']
						}, {
							'gid': 'entityHistory',
							'isHistory': true
						}],
						'overloads': {
							'commentdescription': {
								grid: {
									maxLength: 252
								}
							},
							basqtocommentstypefk: {
								detail:{
									type: 'directive',
									directive: 'qto-detail-comment-type-selector',
									'options': {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated'
									},
									bulkSupport: false
								},
								grid:{
									editor: 'directive',
									editorOptions: {
										showClearButton: true,
										displayMember: 'DescriptionInfo.Translated',
										directive: 'qto-detail-comment-type-selector'
									},
									formatter: 'lookup',
									formatterOptions: {
										dataServiceName: 'qtoDetailCommentTypeLookupDataService',
										displayMember: 'DescriptionInfo.Translated'
									},
									width: 130,
									bulkSupport: false
								}
							}
						}
					};
				}

				let layout = createDocumentDetailLayout('qto.detai.commentsdetail', '1.0.0');
				let documentAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'QtoDetailCommentsDto',
					moduleSubModule: 'Qto.Main'
				});
				documentAttributeDomains = documentAttributeDomains.properties;

				function UIStandardService(layout, scheme, translateService) {
					PlatformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(PlatformUIStandardConfigService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new PlatformUIStandardConfigService(layout, documentAttributeDomains, qtoMainTranslationService);
			}
		]);
})();

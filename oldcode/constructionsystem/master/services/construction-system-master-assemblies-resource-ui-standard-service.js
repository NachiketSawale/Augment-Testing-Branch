
(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'constructionsystem.master';
	/**
     * @ngdoc service
     * @name constructionSystemMasterAssembliesResourceUIStandardService
     * @function
     *
     * @description
     * This service provides standard layots for different containers of unit entities
     */
	angular.module(moduleName).factory('constructionSystemMasterAssembliesResourceUIStandardService',

		['platformUIStandardConfigService', 'constructionSystemMasterAssemblyResourceTranslationService', 'platformSchemaService',

			function (platformUIStandardConfigService, constructionSystemMasterAssemblyResourceTranslationService, platformSchemaService) {

				function createMainDetailLayout() {
					return {
						fid: 'constructionsystem.master.assemblyresourceform',
						version: '1.0.0',
						showGrouping: true,
						addValidationAutomatically: true,
						'groups': [
							{
								gid: 'baseGroup',  // 'code','descriptioninfo',
								'attributes':  [ 'estcosttypefk','estresourcetypefk',  'descriptioninfo1','quantitydetail', 'quantity', 'basuomfk', 'quantityfactordetail1', 'quantityfactor1', 'quantityfactordetail2', 'quantityfactor2', 'quantityfactor3', 'quantityfactor4',
									'quantityfactorcc','productivityfactordetail', 'productivityfactor', 'efficiencyfactordetail1', 'efficiencyfactor1', 'efficiencyfactordetail2', 'efficiencyfactor2', 'quantityreal', 'quantityinternal', 'quantitytotal',
									'costunit', 'bascurrencyfk', 'costfactordetail1', 'costfactor1', 'costfactordetail2', 'costfactor2', 'costfactorcc', 'costunitsubitem', 'costunitlineitem', 'costtotal', 'hoursunit', 'hoursunitsubitem', 'hoursunitlineitem',
									'hoursunittarget', 'hourstotal', 'hourfactor', 'islumpsum', 'isdisabled','isindirectcost', 'commenttext', 'estresourceflagfk','iscost','sorting']

							},
							{
								gid: 'entityHistory',
								isHistory: true
							}
						],
						/* 'translationInfos': {
                            'extraModules': [moduleName, cloudCommonModule],
                            'extraWords': {
                                CommentText: { location: cloudCommonModule, identifier: 'entityCommentText', initial: 'Comment' },
                                EstLineItemFk: { location: moduleName, identifier: 'entityEstLineItemFk', initial: 'Est LineItem Code' },
                                EstAssemblyCatFk: { location: moduleName, identifier: 'entityEstAssemblyCatFk', initial: 'Est Assembly Cat Code' }
                            }
                        }, */
						'overloads':{
						}
					};
				}

				var constructionSystemMasterAssembliesResourceLayout = createMainDetailLayout();

				var BaseService = platformUIStandardConfigService;

				var constructionSystemMasterAssembliesResourceAttributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'EstResourceDto',
					moduleSubModule: 'Estimate.Main'
				});
				constructionSystemMasterAssembliesResourceAttributeDomains = constructionSystemMasterAssembliesResourceAttributeDomains.properties;

				function ConstructionSystemMasterStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				ConstructionSystemMasterStandardService.prototype = Object.create(BaseService.prototype);
				ConstructionSystemMasterStandardService.prototype.constructor = ConstructionSystemMasterStandardService;

				var service = new BaseService(constructionSystemMasterAssembliesResourceLayout, constructionSystemMasterAssembliesResourceAttributeDomains, constructionSystemMasterAssemblyResourceTranslationService);

				return service;
			}
		]);
})();


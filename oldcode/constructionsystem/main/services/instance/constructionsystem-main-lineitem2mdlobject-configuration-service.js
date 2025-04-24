/**
 * Created by pja on 20.03.2018.
 */
(function () {
	// eslint-disable-next-line no-redeclare
	/* global angular */
	'use strict';
	var moduleName = 'constructionsystem.main';

	/**
	 * @ngdoc service
	 * @name constructionsystemMainLineItem2MdlObjectConfigService
	 * @function
	 * @description
	 * constructionsystemMainLineItem2MdlObjectConfigService is the data service for estimate line item model object data functions.
	 */
	angular.module(moduleName).factory('constructionsystemMainLineItem2MdlObjectConfigService', ['platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'constructionSystemMainInstanceService', 'basicsLookupdataConfigGenerator',

		function (platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, constructionSystemMainInstanceService, basicsLookupdataConfigGenerator) {

			var getLineItem2MdlObjectDetailLayout = function (){
				return {
					'fid': 'constructionsystem.main.lineItem2MdlObject.detailform',
					'version': '1.0.1',
					'showGrouping': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['mdlmodelfk', 'mdlobjectfk', 'quantity', 'quantitydetail', 'quantitytarget', 'quantitytargetdetail', 'wqquantitytarget', 'quantitytotal', 'locationcode','locationdesc', 'date', 'remark']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],

					'overloads': {
						'mdlmodelfk':basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
							dataServiceName: 'modelProjectModelLookupDataService',
							enableCache: false,
							readonly: false,
							filter: function () {
								return constructionSystemMainInstanceService.getCurrentSelectedProjectId();
							}
						}),
						'mdlobjectfk': {
							'detail': {
								'type': 'directive',
								'directive': 'estimate-main-model-object-dialog',

								'options': {
									'eagerLoad': true,
									'showClearButton': true
								}
							},
							'grid': {
								editor: 'lookup',
								editorOptions: {
									directive: 'estimate-main-model-object-dialog',
									lookupOptions: {
										showClearButton: true,
										filterKey: 'est-model-object-filter',
										'displayMember':'Description'
									}
								},
								formatter: 'lookup',
								formatterOptions: {
									lookupType: 'modelObjects',
									filter : function (item){
										return item.MdlModelFk;},
									displayMember: 'Description',
									dataServiceName: 'modelMainObjectLookupDataService'
								}
							}
						},
						'quantitytotal':{
							readonly: true
						},
						'locationcode': {
							readonly: true
						},
						'locationdesc': {
							readonly: true
						}
					}
				};
			};

			var BaseService = platformUIStandardConfigService;
			var estLineItem2MdlObjectDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'EstLineItem2MdlObjectDto', moduleSubModule: 'Estimate.Main'} );

			if (estLineItem2MdlObjectDomainSchema) {
				estLineItem2MdlObjectDomainSchema = estLineItem2MdlObjectDomainSchema.properties;
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;
			var estimateMainLineItem2MdlObjectDetailLayout = getLineItem2MdlObjectDetailLayout();
			return new BaseService(estimateMainLineItem2MdlObjectDetailLayout, estLineItem2MdlObjectDomainSchema, estimateMainTranslationService);
		}
	]);
})();
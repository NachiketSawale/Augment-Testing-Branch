/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	/* global globals */

	'use strict';
	let moduleName = 'estimate.main';

	/**
	 * @ngdoc service
	 * @name estimateMainLineItem2MdlObjectConfigService
	 * @function
	 * @description
	 * estimateMainLineItem2MdlObjectConfigService is the data service for estimate line item model object data functions.
	 */
	angular.module(moduleName).factory('estimateMainLineItem2MdlObjectConfigService', ['$http', 'platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService', 'estimateMainService', 'basicsLookupdataConfigGenerator',

		function ($http, platformUIStandardConfigService, estimateMainTranslationService, platformSchemaService, estimateMainService, basicsLookupdataConfigGenerator) {

			let getLineItem2MdlObjectDetailLayout = function (){
				return {
					'fid': 'estimate.main.lineItem2MdlObject.detailform',
					'version': '1.0.1',
					'showGrouping': true,
					'addValidationAutomatically': true,
					'groups': [
						{
							'gid': 'basicData',
							'attributes': ['mdlmodelfk', 'mdlobjectfk', 'quantity', 'quantitydetail', 'quantitytarget', 'quantitytargetdetail', 'wqquantitytarget','wqquantitytargetdetail', 'quantitytotal', 'locationcode','locationdesc', 'date', 'remark']
						},
						{
							'gid': 'entityHistory',
							'isHistory': true
						}
					],

					'overloads': {
						'mdlmodelfk':basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
							dataServiceName : 'modelProjectModelTreeLookupDataService',
							enableCache: false,
							readonly: false,
							filter: function () {
								let selectedProjectId = estimateMainService.getSelectedProjectId();
								return (selectedProjectId ? selectedProjectId : -1) + '&includeComposite=true';
							}
						}),
						'mdlobjectfk':basicsLookupdataConfigGenerator.provideTreeDataServiceLookupConfig({
							dataServiceName : 'modelMainObjectLookupDataService',
							enableCache: false,
							readonly: false,
							filter: function (item) {
								return item.MdlModelFk || item.ModelFk;
							},
							events: [{
								name: 'onSelectedItemChanged',
								handler: function (e, args) {
									if (args.selectedItem && args.entity) {
										$http.get(globals.webApiBaseUrl + 'estimate/main/lineitem2mdlobject/locationbymodelobject?modelId=' + args.entity.MdlModelFk + '&objectId=' + args.selectedItem.Id).then(function (response) {
											if (response && response.data){
												args.entity.LocationCode = response.data.Code;
												args.entity.LocationDesc = response.data.DescriptionInfo.Description;
											} else {
												args.entity.LocationCode = null;
												args.entity.LocationDesc = null;
											}
										});
									}
									else if (!args.selectedItem){
										args.entity.LocationCode = null;
										args.entity.LocationDesc = null;
									}
								}
							}]
						}),
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

			let BaseService = platformUIStandardConfigService;
			let estLineItem2MdlObjectDomainSchema = platformSchemaService.getSchemaFromCache( { typeName: 'EstLineItem2MdlObjectDto', moduleSubModule: 'Estimate.Main'} );
			if(estLineItem2MdlObjectDomainSchema) {
				estLineItem2MdlObjectDomainSchema = estLineItem2MdlObjectDomainSchema.properties;
				estLineItem2MdlObjectDomainSchema.ContainerFk ={ domain : 'integer'};
			}

			function EstimateUIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			EstimateUIStandardService.prototype = Object.create(BaseService.prototype);
			EstimateUIStandardService.prototype.constructor = EstimateUIStandardService;
			let estimateMainLineItem2MdlObjectDetailLayout = getLineItem2MdlObjectDetailLayout();
			return new BaseService(estimateMainLineItem2MdlObjectDetailLayout, estLineItem2MdlObjectDomainSchema, estimateMainTranslationService);
		}
	]);
})();

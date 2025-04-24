/**
 * Created by wuj on 11/13/2015.
 */
(function () {
	'use strict';
	var modName = 'procurement.package';
	// eslint-disable-next-line no-redeclare
	/* global angular,_ */
	angular.module(modName).factory('procurementPackagePackageImportLayout', ['procurementPackageLookUpItems',
		function (lookUpItems) {
			return {
				'fid': 'procurement.package.import.detail',
				'version': '1.0.0',
				'addValidationAutomatically': true,
				'showGrouping': true,
				'groups': [
					{
						'gid': 'basicData',
						'attributes': ['status'/* ,'errormessage' */]
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				'overloads': {
					'status': {
						'readonly': true,
						'detail': {
							options: {
								displayMember: 'Description',
								valueMember: 'Id',
								items: lookUpItems.importStatusItems
							}
						},
						'grid': {
							formatter: function (row, cell, value) {
								var selectItem = _.find(lookUpItems.importStatusItems, {Id: value});
								return selectItem ? selectItem.Description : '';
							}
							/* editorOptions: {
							 displayMember: 'Description',
							 valueMember: 'Id',
							 items: lookUpItems.importStatusItems
							 } */
						}
					}
				}
			};
		}]);

	angular.module(modName).factory('procurementPackagePackageImportUIStandardService',
		['platformUIStandardConfigService', 'procurementPackageTranslationService', 'procurementPackagePackageImportLayout', 'platformSchemaService',
			function (platformUIStandardConfigService, translationService, layout, platformSchemaService) {
				var BaseService = platformUIStandardConfigService;
				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcPackageImportDto',
					moduleSubModule: 'Procurement.Package'
				});

				if (domainSchema) {
					domainSchema = domainSchema.properties;
				}
				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service;
				service= new BaseService(layout, domainSchema, translationService);
				// platformUIStandardExtentService.extend(service, layout.addition, domainSchema);
				return service;
			}
		]);
})();
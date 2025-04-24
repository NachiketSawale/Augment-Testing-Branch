/**
 * Created by lcn on 4/18/2022.
 */
// eslint-disable-next-line no-redeclare
/* global angular */

(function (angular) {
	'use strict';
	var moduleName = 'basics.material';
	angular.module(moduleName).factory('basicsMaterialStockTotalLayout',
		['procurementStockStockTotalLayout', '_',
			function (playout, _) {
				var layout = angular.copy(playout);
				let estAggrAttributes = ['companycode', 'companyname', 'currency', 'projectno', 'projectname'];
				let delAggrAttributes = ['catalogcode', 'catalogdescription', 'materialcode', 'description1', 'description2', 'orderproposalstatuses','specification'];
				let basicGroup = _.find(layout.groups, {gid: 'basicData'});
				_.each(estAggrAttributes, function (attribute) {
					basicGroup.attributes.push(attribute);
				});

				_.remove(basicGroup.attributes, function (attribute) {
					return _.includes(delAggrAttributes, attribute);
				});

				var overloads = {};
				overloads.companycode = {readonly: true};
				overloads.companyname =  {readonly: true};
				overloads.currency =  {readonly: true};
				overloads.projectno =  {readonly: true};
				overloads.projectname =  {readonly: true};
				layout.overloads = _.merge(overloads, layout.overloads);

				var words = {};
				words.CompanyCode = {location: 'cloud.common', identifier: 'cloud.common.entityCompanyCode', initial: 'Company Code'};
				words.CompanyName = {location: 'cloud.common', identifier: 'cloud.common.entityCompanyName', initial: 'Company Name'};
				words.Currency = {location: 'cloud.common', identifier: 'cloud.common.entityCurrency', initial: 'Currency'};
				words.ProjectNo = {location: 'cloud.common', identifier: 'cloud.common.entityProject', initial: 'Project No.'};
				words.ProjectName = {location: 'cloud.common', identifier: 'cloud.common.entityProjectName', initial: 'Project Name'};
				layout.translationInfos.extraWords = _.merge(words, layout.translationInfos.extraWords);
				return layout;
			}]);

	angular.module(moduleName).factory('basicsMaterialStockTotalUIStandardService',
		['platformUIStandardConfigService', 'basicsMaterialTranslationService',
			'basicsMaterialStockTotalLayout', 'platformSchemaService', 'platformUIStandardExtentService',

			function (platformUIStandardConfigService, translationService, layout, platformSchemaService, platformUIStandardExtentService) {

				var BaseService = platformUIStandardConfigService;

				var domainSchema = platformSchemaService.getSchemaFromCache({
					typeName: 'Material2StockTotalVDto',
					moduleSubModule: 'Basics.Material'
				});
				if (domainSchema) {
					domainSchema = domainSchema.properties;
					//domainSchema.OrderProposalStatuses = {domain: 'action'};
				}

				function UIStandardService(layout, scheme, translateService) {
					BaseService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(BaseService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				var service = new BaseService(layout, domainSchema, translationService);

				platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

				return service;
			}
		]);
})(angular);




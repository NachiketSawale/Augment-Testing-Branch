/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function () {
	'use strict';

	const moduleName = 'controlling.projectcontrols';

	angular.module(moduleName).factory('controllingProjectcontrolsPackageUIStandardService',
		['platformUIStandardConfigService', 'platformSchemaService', 'controllingProjectControlsPackageTranslationService', 'controllingProjectcontrolsPackageImageFormatter',
			function (platformUIStandardConfigService, platformSchemaService, translationService, imageFormatter) {
				const layout = {
					fid: 'project.controlling.package',
					version: '1.0.1',
					addValidationAutomatically: true,
					showGrouping: true,
					groups: [
						{
							gid: 'baseGroup',
							attributes: [
								'code', 'description', 'businesspartnername',
								'contractcode', 'contractdescription', 'contractstatus', 'plannedstart', 'plannedend', 'actualstart', 'actualend',
								'prcvalue','prcbudget',
								'reqvalue',
								'convalueoverall', 'convalueapproved', 'convalueorde', 'convaluemain', 'convaluecoapproved', 'convalueconapproved',
								'pesvalueoverall', 'pesvalueaccepted',
								'invvalueoverall', 'invvalueposted',
								'controllingunitcode', 'structurecode'
							]
						}
					],
					overloads:{
						'code': {
							'readonly': true,
							'navigator': {
								moduleName: 'procurement.package',
								registerService: 'procurementPackageDataService'
							}
						},
						'contractcode': {
							'readonly': true,
							navigator: {
								moduleName: 'procurement.contract'
							}
						},
						'businesspartnername': {'readonly': true},
						'contractstatus': {
							'readonly': true,
							'grid': {
								formatter: imageFormatter,
								formatterOptions: {
									'imageSelector': 'platformStatusIconService'
								},
								'width': 100
							}
						},
						'description': {'readonly': true},
						'contractdescription': {'readonly': true},
						'plannedstart': {'readonly': true},
						'plannedend': {'readonly': true},
						'actualstart': {'readonly': true},
						'actualend': {'readonly': true},
						'prcvalue': {'readonly': true},
						'prcbudget': {'readonly': true},
						'reqvalue': {'readonly': true},
						'convalueoverall': {'readonly': true},
						'convalueapproved': {'readonly': true},
						'convalueorde': {'readonly': true},
						'convaluemain': {'readonly': true},
						'convaluecoapproved': {'readonly': true},
						'convalueconapproved': {'readonly': true},
						'pesvalueoverall': {'readonly': true},
						'pesvalueaccepted': {'readonly': true},
						'invvalueoverall': {'readonly': true},
						'invvalueposted': {'readonly': true},
						'controllingunitcode': {'readonly': true},
						'structurecode': {'readonly': true}
					}
				};

				var BaseService = platformUIStandardConfigService,
					domainSchema = platformSchemaService.getSchemaFromCache({
						typeName: 'ProjectControlsPrcPackageDto',
						moduleSubModule: 'Controlling.ProjectControls'
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
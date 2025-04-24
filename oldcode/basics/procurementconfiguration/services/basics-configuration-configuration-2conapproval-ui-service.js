/**
 * Created by lvy on 9/23/2020.
 */
(function () {
	'use strict';

	var modName = 'basics.procurementconfiguration';
	var basicsCommon = 'basics.common';

	angular.module(modName).factory('basPrcConfig2ConApprovalLayout', [
		'basicsLookupdataConfigGenerator',
		'platformTranslateService',
		function (
			basicsLookupdataConfigGenerator,
			platformTranslateService
		) {
			var referencedatetypes = [
				{Id: 1, Description$tr$: 'basics.procurementconfiguration.dateEffective'},
				{Id: 2, Description$tr$: 'basics.procurementconfiguration.dateReported'},
				{Id: 3, Description$tr$: 'basics.procurementconfiguration.insertedAt'}
			];
			platformTranslateService.translateObject(referencedatetypes, 'Description');

			var periods = [
				{Id: 1, Description$tr$: 'basics.procurementconfiguration.approval'},
				{Id: 2, Description$tr$: 'basics.procurementconfiguration.proving'}
			];
			platformTranslateService.translateObject(periods, 'Description');

			var layout = {
				fid: 'basics.procurementconfiguration.conapproval',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'basicData',
						'attributes': ['clerkrolefk', 'refernecedatetype', 'period', 'amount', 'ismail', 'iscommentreject', 'iscommentapproved', 'evaluationlevel']
					},
					{
						gid: 'entityHistory',
						isHistory: true
					}
				],
				translationInfos: {
					extraModules: [basicsCommon],
					extraWords: {
						ClerkRoleFk: {
							location: basicsCommon, identifier: 'entityClerkRole', initial: 'Clerk Role'
						},
						ReferneceDateType: {
							location: modName, identifier: 'entityReferneceDateType', initial: 'Reference Date Type'
						},
						Period: {
							location: modName, identifier: 'entityPeriod', initial: 'Period'
						},
						Amount: {
							location: modName, identifier: 'entityAmount', initial: 'Amount'
						},
						IsMail: {
							location: modName, identifier: 'entityIsMail', initial: 'Is Mail'
						},
						IsCommentReject: {
							location: modName, identifier: 'entityIsCommentReject', initial: 'Is Comment Reject'
						},
						IsCommentApproved: {
							location: modName, identifier: 'entityIsCommentApproved', initial: 'Is Comment Approved'
						},
						EvaluationLevel: {
							location: modName, identifier: 'entityEvaluationLevel', initial: 'Evaluation Level'
						}
					}
				},
				overloads: {
					clerkrolefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
						dataServiceName: 'basicsCustomClerkRoleLookupDataService',
						enableCache: true
					}),
					ismail: {
						width: 80,
						editor: 'boolean',
						formatter: 'boolean',
						cssClass: 'cell-center'
					},
					iscommentreject: {
						width: 80,
						editor: 'boolean',
						formatter: 'boolean',
						cssClass: 'cell-center'
					},
					iscommentapproved: {
						width: 80,
						editor: 'boolean',
						formatter: 'boolean',
						cssClass: 'cell-center'
					},
					refernecedatetype: {
						detail: {
							type: 'select',
							options: {
								items: referencedatetypes,
								valueMember: 'Id',
								displayMember: 'Description',
								modelIsObject: false
							}
						},
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: referencedatetypes,
								valueMember: 'Id',
								displayMember: 'Description'
							},
							editor: 'select',
							editorOptions: {
								items: referencedatetypes,
								valueMember: 'Id',
								displayMember: 'Description'
							}
						}
					},
					period: {
						detail: {
							type: 'select',
							options: {
								items: periods,
								valueMember: 'Id',
								displayMember: 'Description',
								modelIsObject: false
							}
						},
						grid: {
							formatter: 'select',
							formatterOptions: {
								items: periods,
								valueMember: 'Id',
								displayMember: 'Description'
							},
							editor: 'select',
							editorOptions: {
								items: periods,
								valueMember: 'Id',
								displayMember: 'Description'
							}
						}
					}
				},
				addition: {
				}
			};

			return layout;
		}
	]);

	angular.module(modName).factory('basPrcConfig2ConApprovalUIService', [
		'basicsProcurementConfigHeaderTranslationService',
		'platformSchemaService',
		'platformUIStandardConfigService',
		'platformUIStandardExtentService',
		'basPrcConfig2ConApprovalLayout',
		function(
			translationService,
			platformSchemaService,
			platformUIStandardConfigService,
			platformUIStandardExtentService,
			layout
		) {
			var service;

			var BaseService = platformUIStandardConfigService;

			var domainSchema = platformSchemaService.getSchemaFromCache({
				typeName: 'PrcConfig2ConApprovalDto',
				moduleSubModule: 'Basics.ProcurementConfiguration'
			});
			if (domainSchema) {
				domainSchema = domainSchema.properties;
			}
			function UIStandardService(layout, scheme, translateService) {
				BaseService.call(this, layout, scheme, translateService);
			}

			UIStandardService.prototype = Object.create(BaseService.prototype);
			UIStandardService.prototype.constructor = UIStandardService;

			service = new UIStandardService(layout, domainSchema, translationService);
			platformUIStandardExtentService.extend(service, layout.addition, domainSchema);

			return service;
		}
	]);
})();
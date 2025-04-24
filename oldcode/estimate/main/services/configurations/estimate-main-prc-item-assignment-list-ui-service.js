
(function () {
	'use strict';
	let moduleName = 'estimate.main';


	angular.module(moduleName).factory('estimateMainPrcItemAssignmentListUIService',
		['platformUIStandardConfigService', 'estimateMainTranslationService', 'platformSchemaService','$injector','platformUIStandardExtentService','basicsLookupdataConfigGenerator',
			function (PlatformUIStandardConfigService, estimateMainTranslationService, platformSchemaService,$injector,platformUIStandardExtentService,basicsLookupdataConfigGenerator) {

				function createDetailLayout(fid, version) {

					let addColumns = [{
						id: 'Description',
						field: 'DescriptionInfo',
						name: 'Description',
						width: 300,
						formatter: 'translation',
						name$tr$: 'cloud.common.entityDescription'
					}];

					return {
						'fid': fid,
						'version': version,
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [{
							'gid': 'basicData',
							'attributes': ['estlineitemfk', 'estresourcefk', 'prcitemfk', 'boqheaderreference', 'boqitemfk','iscontracted','prcpackagefk','packagestatusfk']
						}, {
							'gid': 'entityHistory',
							'isHistory': true
						}],
						'overloads': {
							estlineitemfk: {
								'readonly': true,
								'grid': {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-est-line-item-lookup-dialog',
										lookupOptions: {
											'additionalColumns': true,
											'displayMember': 'Code',
											'addGridColumns': addColumns
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estlineitemlookup',
										displayMember: 'Code'
									}
								},
								'detail': {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'estimate-main-est-line-item-lookup-dialog',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'package-item-assignment-est-lineitem-filter'
										}
									}
								}
							},
							estresourcefk: {
								'grid': {
									'editor': 'directive',
									'editorOptions': {
										directive: 'estimate-main-resource-for-item-assignment-lookup',
										'filterKey': 'estimate-item-assignment-est-resource-filter',
										showClearButton: true,
										lookupOptions: {
											'additionalColumns': true,
											'displayMember': 'Code',
											'addGridColumns': [{
												id: 'Description',
												field: 'DescriptionInfo',
												name: 'Description',
												width: 300,
												formatter: 'translation',
												name$tr$: 'cloud.common.entityDescription'
											}]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'estresource4itemassignment',
										displayMember: 'Code'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'estimate-main-resource-for-item-assignment-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'estimate-item-assignment-est-resource-filter'
										}
									}
								}
							},
							'boqitemfk': {
								'grid': {
									'editor': 'lookup',
									'editorOptions': {
										directive: 'procurement-package-boq-dialog',
										showClearButton: true,
										lookupOptions: {
											additionalColumns: true,
											'displayMember': 'Reference',
											addGridColumns: [
												{
													id: 'brief',
													field: 'BriefInfo',
													name: 'Brief',
													width: 120,
													toolTip: 'Brief',
													formatter: 'translation',
													name$tr$: 'estimate.main.briefInfo'
												}
											]
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'packageboqitems',
										displayMember: 'Reference',
										dataServiceName: 'procurementPackageBoqLookupService'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'procurement-package-boq-dialog',
										descriptionMember: 'BriefInfo.Translated',
										'eagerLoad': true
									}
								}
							},
							'boqheaderreference': {
								'readonly': true,
							},
							prcitemfk: {
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'prc-common-item-material-lookup-dialog',
										filterKey: 'estimate-item-prc-item-assignment-item-filter',
										lookupOptions: {
											filterKey: 'estimate-item-prc-item-assignment-item-filter',
											showClearButton: true,
											additionalColumns: true,
											displayMember: 'Itemno'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'PrcItem',
										displayMember: 'Itemno'
									},
									width: 100
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'prc-common-item-material-lookup-dialog',
										descriptionMember: 'MaterialDescription',
										lookupOptions: {
											showClearButton: true,
											filterKey: 'estimate-item-prc-item-assignment-item-filter'
										}
									}
								}
							},
							iscontracted:{
								'readonly': true
							},
							prcpackagefk: basicsLookupdataConfigGenerator.provideDataServiceLookupConfig({
								navigator: {
									moduleName: 'procurement.package'
								},
								moduleQualifier: 'estLineItemPrcPackageLookupDataService',
								dataServiceName: 'estLineItemPrcPackageLookupDataService',
								disableDataCaching: false,
								additionalColumns: true,
								addGridColumns:[{
									id: 'Description',
									field: 'Description',
									name: 'Description',
									formatter: 'description',
									name$tr$: 'cloud.common.entityDescription'
								}],
								valMember: 'Id',
								dispMember: 'Code',
								columns: [
									{
										id: 'Code',
										field: 'Code',
										name: 'Code',
										formatter: 'code',
										name$tr$: 'cloud.common.entityCode'
									},
									{
										id: 'Description',
										field: 'Description',
										name: 'Description',
										formatter: 'description',
										name$tr$: 'cloud.common.entityDescription'
									}
								],
								events: [
									{
										name: 'onSelectedItemChanged', // register event and event handler here.
										handler: function (e, args) {
											let item = args.entity;
											if (!item) {
												return;
											}
											let selectedPackageItem = args.selectedItem;
											args.entity.PackageStatusFk = args.selectedItem.PackageStatusFk;
											args.entity.PackageCode = selectedPackageItem.Code;
											$injector.get('estimateMainService').updatePackageAssignment.fire();
											$injector.get('estimateMainResourceService').updateResourcePackageAssignment.fire();
										}
									}
								]
							}),
							'packagestatusfk': {
								'readonly': true,
								'grid': {
									'editor': '',
									'editorOptions': null,
									'formatter': 'lookup',
									'formatterOptions': {
										'lookupType': 'PackageStatus',
										'displayMember': 'DescriptionInfo.Translated',
										'imageSelector': 'platformStatusIconService'
									}
								},
								'detail': {
									'type': 'directive',
									'directive': 'procurement-package-status-combobox'
								}
							}
						}
					};
				}

				let layout = createDetailLayout('estimate.main.itemAssignments', '1.0.0');
				let attributeDomains = platformSchemaService.getSchemaFromCache({
					typeName: 'PrcItemAssignmentDto',
					moduleSubModule: 'Procurement.Common'
				});
				attributeDomains = attributeDomains.properties;

				function UIStandardService(layout, scheme, translateService) {
					PlatformUIStandardConfigService.call(this, layout, scheme, translateService);
				}

				UIStandardService.prototype = Object.create(PlatformUIStandardConfigService.prototype);
				UIStandardService.prototype.constructor = UIStandardService;

				return new PlatformUIStandardConfigService(layout, attributeDomains, estimateMainTranslationService);
			}
		]);
})();

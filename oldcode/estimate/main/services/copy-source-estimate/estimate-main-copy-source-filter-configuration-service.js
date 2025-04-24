/**
 *
 */
(function () {

	'use strict';

	let moduleName = 'estimate.main';

	angular.module(moduleName).service('estimateMainCopySourceFilterConfigurationService', ['basicsLookupdataConfigGenerator', 'estimateMainCopySourceFilterTypeConstant', 'platformTranslateService',
		function (basicsLookupdataConfigGenerator, estimateMainCopySourceFilterTypeConstant, platformTranslateService) {


			return {
				getEstimateMainCopySourceLineItemDetailLayout: function() {
					return{
						fid: 'estimate.main.copy.source.filter.detail',
						version: '1.1.0',
						showGrouping: false,
						addValidationAutomatically: true,
						change : 'change',
						groups: [
							{
								gid: 'filterOptions',
								attributes: ['estimatefiltertype', 'projectid', 'assemblycategoryid', 'estheaderid', 'searchtext', 'records']
							}
						],
						translationInfos: {},

						overloads: {
							'estimatefiltertype': {detail: {
								type: 'select',
								required: false,
								options: {
									items : platformTranslateService.translateObject(angular.copy(estimateMainCopySourceFilterTypeConstant)),
									valueMember: 'Id',
									displayMember: 'Description',
									modelIsObject: false
								}
							}},
							'projectid': {
								navigator: {
									moduleName: 'project.main'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'basics-lookup-data-project-project-dialog',
										lookupOptions: {
											showClearButton: true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'project',
										displayMember: 'ProjectNo'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'basics-lookup-data-project-project-dialog',
										descriptionMember: 'ProjectName',
										lookupOptions: {
											showClearButton: true
										}
									}
								}
							},
							'assemblycategoryid': {
								navigator: {
									moduleName: 'estimate.assemblies'
								},
								grid: {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-assemblies-source-line-items-assembly-category-lookup',
										lookupOptions: {
											showClearButton: true,
											additionalColumns : true
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'AssembliesSourceLineItemsAssemblyCategoryLookup',
										displayMember: 'Code',
										initValueField : 'Code'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'estimate-assemblies-source-line-items-assembly-category-lookup',
										descriptionMember: 'Code',
										lookupOptions: {
											showClearButton: true
										}
									}
								}
							},
							'estheaderid': {
								grid : {
									editor: 'lookup',
									editorOptions: {
										directive: 'estimate-main-document-project-lookup',
										filterKey: 'estimate-main-copy-source-header-filter',
										lookupOptions: {
											'filterKey': 'estimate-main-copy-source-header-filter',
											'additionalColumns': true,
											'displayMember': 'Code'
										}
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'EstimateMainHeader',
										displayMember: 'Code'
									}
								},
								detail: {
									type: 'directive',
									directive: 'basics-lookupdata-lookup-composite',
									options: {
										lookupDirective: 'estimate-main-document-project-lookup',
										descriptionMember: 'DescriptionInfo.Translated',
										lookupOptions: {
											filterKey: 'estimate-main-copy-source-header-filter'
										}
									}
								}
							}
						}
					};
				}
			};
		}]);
})(angular);

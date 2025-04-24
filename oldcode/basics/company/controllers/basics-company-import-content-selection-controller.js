/**
 * Created by ysl on 12/8/2017.
 */
/**
 * Created by ysl on 11/13/2017.
 */
(function () {

	'use strict';

	var moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyImportContentSelectionController', [
		'$scope',
		'$q',
		'$timeout',
		'$translate',
		'_',
		'platformGridAPI',
		'platformSchemaService',
		'platformUIConfigInitService',
		'platformTranslateService',
		'basicsCompanyImportContentSelectionService',
		'basicsCompanyImportContentService',
		'basicsLookupdataConfigGenerator',
		'basicsCompanyImportContentOperationtypeService',
		'platformContextService',
		'basicsCompanyImportContentSelectionGridDataService',
		'basicsCompanyImportContentContentTypeService',
		function ($scope,
			$q,
			$timeout,
			$translate,
			_,
			platformGridAPI,
			platformSchemaService,
			platformUIConfigInitService,
			platformTranslateService,
			basicsCompanyImportContentSelectionService,
			basicsCompanyImportContentService,
			basicsLookupdataConfigGenerator,
			basicsCompanyImportContentOperationtypeService,
			platformContextService,
			basicsCompanyImportContentSelectionGridDataService,
			basicsCompanyImportContentContentTypeService
		) {
			basicsCompanyImportContentSelectionService.clearSourceCompanyList();

			$scope.importItems = {
				sourceCompanyCode: '',
				targetCompanyId: platformContextService.getContext().clientId,
				prcIncluded: false,
				costCodeIncluded: false,
				addCostCode: false
			};

			var CompanyOptions = {
				'fid': 'importContent.company.setting',
				'version': '1.1.0',
				'showGrouping': false,
				'groups': [
					{
						'gid': 'basicData',
						'isOpen': true,
						'visible': true,
						'sortOrder': 1
					}
				],
				'rows': [
					{
						'rid': 'companySource',
						'gid': 'basicData',
						'label$tr$': 'basics.company.importContent.source',
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'model': 'sourceCompanyCode',
						'options': {
							lookupDirective: 'basics-company-remote-company-lookup',
							descriptionMember: 'Name',
							lookupOptions: {
								events: [{
									name: 'onSelectedItemChanged', handler: function selectedBoqHeaderChanged(e, args) {
										var internalImport = basicsCompanyImportContentService.allSettings.basicSettings ?
											basicsCompanyImportContentService.allSettings.basicSettings.internalImport : false;
										basicsCompanyImportContentSelectionGridDataService.updateLevel1ByCompanyCode(args.selectedItem.Code, internalImport);
									}
								}]
							}
						}
					},
					{
						'afterId': 'companySource',
						'rid': 'companyTarget',
						'gid': 'basicData',
						'label$tr$': 'basics.company.importContent.target',
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'model': 'targetCompanyId',
						'readonly': true,
						'options': {
							lookupDirective: 'basics-company-company-lookup',
							descriptionMember: 'CompanyName'
						}
					},
					{
						'afterId': 'companyTarget',
						'rid': 'procurementStructure',
						'gid': 'basicData',
						'label$tr$': 'basics.company.importContent.includeProcurementStructure',
						'type': 'boolean',
						'model': 'prcIncluded'
					},
					{
						'afterId': 'procurementStructure',
						'rid': 'CostCode',
						'gid': 'basicData',
						'label$tr$': 'basics.company.importContent.includeCostCode',
						'type': 'boolean',
						'model': 'costCodeIncluded'
					}
				]
			};
			platformTranslateService.translateFormConfig(CompanyOptions);
			$scope.formContainerOptions = {
				formOptions: {
					configure: CompanyOptions
				}
			};


			function saveContentSelections() {
				var selections = [];
				var contentArray = basicsCompanyImportContentSelectionGridDataService.getList();
				getSelectedSelections(0, contentArray, selections);

				var settingsDataModel = {
					itemSelections: selections,
					sourceCompanyCode: $scope.importItems.sourceCompanyCode,
					prcIncluded: $scope.importItems.prcIncluded,
					costCodeIncluded: $scope.importItems.costCodeIncluded,
					addCostCode: $scope.importItems.addCostCode
				};
				//save
				basicsCompanyImportContentService.setContentSettings(settingsDataModel);
			}

			function getSelectedSelections(curLevel, contentArray, itemSelections) {
				angular.forEach(contentArray, function (item) {
					if (item.selection === true && item.id !== 0) {
						var newItem = angular.copy(item);
						newItem.level = curLevel;
						itemSelections.push(newItem);

						if(basicsCompanyImportContentContentTypeService.keepGettingSelectedSelections(newItem.contenttype)){
							getSelectedSelections(newItem.level + 1, newItem.children, itemSelections);
						}
					} else {
						if (item.children && item.children.length > 0) {
							getSelectedSelections(curLevel + 1, item.children, itemSelections);
						}
					}
				});
			}

			basicsCompanyImportContentService.onContentSelectionFinishedEvent.register(saveContentSelections);
			$scope.$on('$destroy', function () {
				basicsCompanyImportContentService.onContentSelectionFinishedEvent.unregister(saveContentSelections);
			});

		}
	]);
})();

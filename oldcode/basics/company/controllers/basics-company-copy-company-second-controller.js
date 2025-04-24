(function () {

	'use strict';

	let moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyCopyCompanySecondController', [
		'$scope',
		'$translate',
		'_',
		'platformSchemaService',
		'platformTranslateService',
		function ($scope,
			$translate,
			_,
			platformSchemaService,
			platformTranslateService
		){
			// ------ keep for proi 2.
			let CompanyOptions = {
				'fid': 'copyRubic.company.setting',
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
						'afterId': 'companySource',
						'rid': 'companyTarget',
						'gid': 'basicData',
						'label$tr$': 'basics.company.copyCompany.target',
						'type': 'directive',
						'directive': 'basics-lookupdata-lookup-composite',
						'model': 'targetCompanyId',
						'readonly': true,
						'options': {
							lookupDirective: 'basics-company-company-lookup',
							descriptionMember: 'CompanyName'
						}
					}
				]
			};
			platformTranslateService.translateFormConfig(CompanyOptions);
			$scope.formContainerOptions = {
				formOptions: {
					configure: CompanyOptions
				}
			};
			// end ------ keep for proi 2.
		}
	]);
})();

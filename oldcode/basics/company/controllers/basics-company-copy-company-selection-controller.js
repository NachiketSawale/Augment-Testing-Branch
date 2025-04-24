/**
 * Created by ysl on 12/8/2017.
 */
/**
 * Created by ysl on 11/13/2017.
 */
(function () {

	'use strict';

	let moduleName = 'basics.company';

	angular.module(moduleName).controller('basicsCompanyCopyCompanyBasicController', [
		'$scope',
		'$q',
		'$timeout',
		'$translate',
		'_',
		'platformGridAPI',
		'platformSchemaService',
		'platformUIConfigInitService',
		'platformTranslateService',

		function ($scope,
			$q,
			$timeout,
			$translate,
			_,
			platformGridAPI,
			platformSchemaService,
			platformUIConfigInitService,
			platformTranslateService
		) {
			$scope.companyItems = {
				sourceCompanyId: $scope.$parent.soureCompany.Id
			};

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
						'model': 'sourceCompanyId',
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
		}
	]);
})();

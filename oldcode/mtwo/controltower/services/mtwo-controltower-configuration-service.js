/**
 * Created by lal on 2018-06-21.
 */

(function (angular) {
	'use strict';

	var moduleName = 'mtwo.controltower';
	var ControlTowerModul = angular.module(moduleName);

	/**
	 * @gndoc service
	 * @name mtwoControlTowerConfigurationService
	 * @description
	 */
	ControlTowerModul.factory('mtwoControlTowerConfigurationService', [
		function () {
			return {
				getMtwoControlTowerMainGridLayout: function () {
					return {
						'fid': 'mtwo.controltower.detailform',
						'version': '1.0.0',
						'showGrouping': false,
						'addValidationAutomatically': false,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['name']
							}
						],
						'overloads': {
							'name': {
								'readonly': true,
								'grid': {
									'width': 500,
								}
							}
						}
					};
				},
				getMtwoPowerBIListLayout: function () {
					return {
						'fid': 'mtwo.controltowerconfiguration.detailform',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': true,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['description', 'logonname', 'password', 'clientid']
							},
							{
								'gid': 'PowerBISettings',
								'attributes': ['resourceurl', 'authurl', 'apiurl', 'accesslevel', 'authorized', 'azureadintegrated', 'bascompanyfk']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'clientid': {
								'mandatory': true
							},
							'logonname': {
								'mandatory': true
							},
							'password': {
								'mandatory': true
							},
							'description': {
								'readonly': true
							},
							'authorized': {
								'readonly': true
							},
							'bascompanyfk': {
								'grid': {
									editor: null,
									editorOptions: {
										directive: 'basics-company-company-lookup'
									},
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'company',
										displayMember: 'Code'
									},
									width: 140
								},
								'detail': {
									'type': 'directive',
									'directive': 'basics-lookupdata-lookup-composite',
									'options': {
										lookupDirective: 'basics-company-company-lookup',
										descriptionMember: 'CompanyName',
										lookupOptions: {}
									}
								}
							}

						},
						'addition': {
							'grid': [
								{
									afterId: 'bascompanyfk',
									id: 'companyname',
									field: 'BasCompanyFk',
									name: 'Company Name',
									name$tr$: 'cloud.common.entityCompanyName',
									sortable: true,
									formatter: 'lookup',
									formatterOptions: {
										lookupType: 'company',
										displayMember: 'CompanyName'
									},
									width: 140
								}
							]
						}
					};
				}
			};
		}]);
})(angular);

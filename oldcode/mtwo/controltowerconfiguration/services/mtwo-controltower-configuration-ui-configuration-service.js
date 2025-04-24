/**
 * Created by hae on 2018-07-2.
 */

(function (angular) {
	'use strict';

	var moduleName = 'mtwo.controltowerconfiguration';
	var ControlTowerModul = angular.module(moduleName);

	/**
	 * @gndoc service
	 * @name mtwoControlTowerConfigurationConfigurationService
	 * @description
	 */
	ControlTowerModul.factory('mtwoControlTowerConfigurationUIConfigurationService', [
		function () {
			return {
				getMtwoPowerBIDetailLayout: function () {
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
								'mandatory': false
							},
							'logonname': {
								'mandatory': false
							},
							'password': {
								'mandatory': false
							},
							'authorized': {
								'readonly': false
							},
							'bascompanyfk': {
								'grid': {
									editor: 'lookup',
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
				},
				getMtwoPowerBIItemDetailLayout: function () {
					return {
						'fid': 'mtwo.controltowerconfiguration.itemGrid',
						'version': '1.0.0',
						'showGrouping': true,
						'addValidationAutomatically': false,
						'groups': [
							{
								'gid': 'basicData',
								'attributes': ['name', 'embedurl', 'itemid']
							},
							{
								'gid': 'entityHistory',
								'isHistory': true
							}
						],
						'overloads': {
							'name': {
								'readonly': false
							},
							'embedurl': {
								'readonly': false
							},
							'itemid': {
								'readonly': false
							}
						}
					};
				},
				getMtwoPowerBIPermissionsLayout: function () {
					return {
						fid: 'mtwo.controltowerconfiguration.moduleassignments',
						version: '1.0.0',
						showGrouping: true,
						groups: [
							{
								gid: 'basicData',
								attributes: ['name', 'description']
							},
							{
								gid: 'entityHistory',
								isHistory: true
							}],
						'translationInfos': {
							'extraModules': ['usermanagement.right'],
							'extraWords': {

								'Name': {location: 'usermanagement.right', identifier: 'structureName', initial: 'Name'},
								'Description': {
									location: 'usermanagement.right',
									identifier: 'descriptorDescription',
									initial: 'Description'
								}
							}
						},
						'overloads': {
							'name': {readonly: false},
							'description': {readonly: false}

						}
					};
				}
			};
		}]);
})(angular);

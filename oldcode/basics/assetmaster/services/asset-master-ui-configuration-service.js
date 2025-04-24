(function config() {
	'use strict';
	var moduleName = 'basics.assetmaster';
	var cloudCommonModule = 'cloud.common';
	/**
	 * @ngdoc service
	 * @name basicsAssetMasterUIConfigurationService
	 * @function
	 *
	 * @description
	 * UI configuration for asset master
	 */
	angular.module(moduleName).factory('basicsAssetMasterUIConfigurationService', ['basicsCommonComplexFormatter',
		function basicsAssetMasterUIConfigurationService(basicsCommonComplexFormatter) {
			var config;
			config = {
				fid: 'basics.assetmaster.detail',
				version: '1.0.0',
				addValidationAutomatically: true,
				showGrouping: true,
				groups: [
					{
						'gid': 'basicData',
						'attributes': ['code', 'descriptioninfo', 'addressentity', 'islive', 'userdefined1', 'userdefined2', 'userdefined3', 'userdefined4', 'userdefined5', 'allowassignment']
					},
					{
						'gid': 'entityHistory',
						'isHistory': true
					}
				],
				translationInfos: {
					'extraModules': [moduleName, 'project.main', 'procurement.package'],
					'extraWords': {
						'Code': {
							location: cloudCommonModule,
							identifier: 'entityCode',
							initial: 'Code'
						},
						'moduleName': {
							location: moduleName,
							identifier: 'moduleName',
							initial: 'Asset Master'
						},
						'projectListTitle': {
							location: 'project.main',
							identifier: 'projectListTitle',
							initial: 'Projects'
						},
						'detailContainerTitle': {
							location: 'project.main',
							identifier: 'detailContainerTitle',
							initial: 'Project Details'
						},
						'pacHeaderGridTitle': {
							location: 'procurement.package',
							identifier: 'pacHeaderGridTitle',
							initial: 'Packages'
						},
						'pacHeaderFormTitle': {
							location: 'procurement.package',
							identifier: 'pacHeaderFormTitle',
							initial: 'Package Details'
						},
						'AddressEntity': {
							'location': cloudCommonModule,
							'identifier': 'entityDeliveryAddress',
							'initial': 'entityDeliveryAddress'
						},
						'IsLive': {
							location: cloudCommonModule,
							identifier: 'entityIsLive',
							initial: 'IsLive'
						},
						'UserDefined1': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '1'}
						},
						'UserDefined2': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '2'}
						},
						'UserDefined3': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '3'}
						},
						'UserDefined4': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '4'}
						},
						'UserDefined5': {
							'location': cloudCommonModule,
							'identifier': 'entityUserDefined',
							'initial': 'entityUserDefined',
							param: {'p_0': '5'}
						},
						'AllowAssignment': {
							'location': cloudCommonModule,
							'identifier': 'allowAssignment',
							'initial': 'Allow Assignment'
						}
					}
				},
				overloads: {
					code: {
						'mandatory': true,
						'searchable': true
					},
					'addressentity': {
						'grid': {
							'editor': 'lookup',
							'editorOptions': {
								'directive': 'basics-common-address-dialog',
								'lookupOptions': {
									'foreignKey': 'AddressFk',
									'titleField': 'cloud.common.entityDeliveryAddress',
									'showClearButton': true
								}
							},
							'formatter': basicsCommonComplexFormatter,
							'formatterOptions': {'displayMember': 'AddressLine'},
							'width': 180
						},
						'detail': {
							'type': 'directive',
							'directive': 'basics-common-address-dialog',
							'options': {
								'titleField': 'cloud.common.entityDeliveryAddress',
								'foreignKey': 'AddressFk',
								'showClearButton': true
							}
						}
					},
					'islive': {
						readonly: true,
						width: 100
					}
				}
			};

			return config;
		}]);
})(angular);


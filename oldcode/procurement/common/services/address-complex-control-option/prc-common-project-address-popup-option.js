/**
 * Created by chi on 2018/4/3.
 */
(function(angular) {
	'use strict';
	var moduleName = 'procurement.common';

	// eslint-disable-next-line no-redeclare
	/* global angular,globals */

	angular.module(moduleName).factory('procurementCommonProjectAddressPopupOption', procurementCommonProjectAddressPopupOption);
	procurementCommonProjectAddressPopupOption.$inject = ['$http'];
	function procurementCommonProjectAddressPopupOption($http) {
		var options = {
			showPopup: true,
			popupOptions: {
				controller: 'procurementCommonGridPopupController'
			},
			popupLookupConfig: {
				version: 2,
				lookupType: 'project2Address',
				valueMember: 'AddressEntity',
				displayMember: 'AddressEntity.Address',
				columns: [
					{
						id: 'description',
						field: 'Description',
						name: 'Description',
						name$tr$: 'cloud.common.entityDescription',
						width: 100
					},
					{
						id: 'commentText',
						field: 'CommentText',
						name: 'Comment Text',
						name$tr$: 'basics.common.entityCommentText',
						width: 150
					},
					{
						id: 'address',
						field: 'AddressEntity.Address',
						name: 'Address',
						name$tr$: 'basics.common.entityAddress',
						width: 180
					},
					{
						id: 'addressType',
						field: 'AddressTypeFk',
						name: 'Address Type',
						name$tr$: 'project.main.AddressTypeFk',
						width: 80,
						formatter: 'lookup',
						formatterOptions: {'lookupType': 'AddressType', 'displayMember': 'Description'}
					}
				],
				lookupRequest: function (projectFk) {
					if (projectFk) {
						var filter = {
							PKey1: projectFk
						};
						return $http.post(globals.webApiBaseUrl + 'project/main/address/lookup', filter);
					}
					return null;
				},
				referencedForeignKey: 'ProjectFk'
			}
		};

		return {
			getOptions: getOptions
		};

		// ///////////////////////
		function getOptions() {
			return angular.copy(options);
		}
	}
})(angular);
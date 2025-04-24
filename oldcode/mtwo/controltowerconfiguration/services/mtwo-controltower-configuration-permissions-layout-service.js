/**
 * Created by waldrop on 9/16/2019
 */

(function (angular) {
	'use strict';
	var moduleName = 'mtwo.controltowerconfiguration';

	/**
	 * @ngdoc controller
	 * @name mtwoControltowerConfigurationPermissionsLayoutService
	 * @function
	 *
	 * @description
	 * This service provides standard layout for grid / form of  mtwo controltower configurationPermissions entity.
	 **/
	angular.module(moduleName).factory('mtwoControltowerConfigurationPermissionsLayoutService', [
		function () {
			return {
				fid: 'mtwo.controltowerconfiguration.moduleassignments.detailform',
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
						},
						'Read': {location: 'usermanagement.right', identifier: 'rightRead', initial: 'R'},
						'Write': {location: 'usermanagement.right', identifier: 'rightWrite', initial: 'W'},
						'Create': {location: 'usermanagement.right', identifier: 'rightCreate', initial: 'C'},
						'Delete': {location: 'usermanagement.right', identifier: 'rightDelete', initial: 'D'},
						'Execute': {location: 'usermanagement.right', identifier: 'rightExecute', initial: 'E'},
						'ReadDeny': {location: 'usermanagement.right', identifier: 'rightReadDeny', initial: 'RD'},
						'WriteDeny': {
							location: 'usermanagement.right',
							identifier: 'rightWriteDeny',
							initial: 'WD'
						},
						'CreateDeny': {
							location: 'usermanagement.right',
							identifier: 'rightCreateDeny',
							initial: 'CD'
						},
						'DeleteDeny': {
							location: 'usermanagement.right',
							identifier: 'rightDeleteDeny',
							initial: 'DD'
						},
						'ExecuteDeny': {
							location: 'usermanagement.right',
							identifier: 'rightExecuteDeny',
							initial: 'ED'
						}
					}
				},
				'overloads': {
					'name': {readonly: true},
					'description': {readonly: true},

				}
			};
		}]);



})(angular);

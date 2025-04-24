/**
 * Created by nitsche on 20.10.2022
 */

(function (angular) {
	/* global  */
	'use strict';
	let myModule = angular.module('project.group');

	/**
	 * @ngdoc service
	 * @name projectGroupConstantValues
	 * @description projectGroupConstantValues provides constants used in Project.Group client development
	 */
	myModule.value('projectGroupConstantValues', {
		schemes: {
			projectGroup: {
				typeName: 'ProjectGroupDto',
				moduleSubModule: 'Project.Group'
			}
		},
		uuid: {
			container: {
				projectGroupList: '5f2c8f5b4d24470f8ff69e81a129f5b8',
				projectGroupDetails: 'c1592f6e58514d3e904e9e5a4a046e35'
			},
			permissions: {
				createWithAutoGeneration: 'a3dbe3d8b5bf409e9563a13cd97f1eb5'
			}
		}
	});
})(angular);
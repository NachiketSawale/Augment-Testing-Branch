/**
 * Created by janas on 02.07.2018.
 */

(function (angular) {
	'use strict';

	var moduleName = 'controlling.structure';
	angular.module(moduleName).factory('controllingStructureTestUnitTestdataProvider', ['_', 'companyCommonData', 'projectsCommonData',
		function (_, companyCommonData, projectsCommonData) {
			// default project
			var curProject = projectsCommonData.projectA;

			return {
				getCompany: function getCompany() {
					return companyCommonData;
				},
				getProject: function getProject() {
					return curProject;
				},
				setProject: function setProject(key) {
					if (_.isObject(projectsCommonData[key])) {
						curProject = projectsCommonData[key];
					}
				},
				getControllingUnits: function getControllingUnits() {
					return []; // TODO:
				}
			};
		}]);

})(angular);
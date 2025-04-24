/**
 * Created by baf on 27.10.2022
 */

(function (angular) {
	'use strict';
	var moduleName = 'project.main';

	/**
	 * @ngdoc service
	 * @name projectMainPhaseSelectionDataService
	 * @description provides validation methods for project main phaseSelection entities
	 */
	angular.module(moduleName).service('projectMainPhaseSelectionDataService', ProjectMainPhaseSelectionDataService);

	ProjectMainPhaseSelectionDataService.$inject = [];

	function ProjectMainPhaseSelectionDataService() {
		var self = this;

		this.ProjectAlternatives = [];
		this.selectedProjectAlternative = null;

		this.takeProjectAlternatives = function takeProjectAlternatives(alternatives) {
			self.ProjectAlternatives = alternatives;
		};

		this.getProjectAlternatives = function getProjectAlternatives() {
			return self.ProjectAlternatives;
		};

		this.setSelected = function setSelected(sel) {
			this.selectedProjectAlternative = sel;
		};

		this.getSelected = function getSelected() {
			return this.selectedProjectAlternative;
		};
	}
})(angular);

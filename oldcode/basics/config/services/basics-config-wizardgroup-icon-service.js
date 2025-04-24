/**
 * Created by sandu on 03.02.2016.
 */
(function () {
	'use strict';
	var moduleName = 'basics.config';

	/**
	 * @ngdoc service
	 * @name basicsConfigWizardgroupIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsConfigWizardGroupIconService', BasicsConfigWizardGroupIconService);

	BasicsConfigWizardGroupIconService.$inject = ['platformIconBasisService'];

	function BasicsConfigWizardGroupIconService(pibs) {

		pibs.setBasicPath('wizard-icons ico-wizard%%index%%');

		var icons = [],
			totalIcon = 125; // Currently there are so many pictures.

		for(var i = 1; i <= totalIcon; i++) {
			icons.push(pibs.createCssIcon('Wizard' + i));
		}

		pibs.extend(icons, this);
	}
})();

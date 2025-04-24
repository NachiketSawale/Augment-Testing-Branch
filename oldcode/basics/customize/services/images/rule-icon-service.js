/**
 * Created by Michael Alisch on 12/11/2015.
 */
(function () {
	'use strict';
	var moduleName = 'basics.customize';

	/**
	 * @ngdoc service
	 * @name basicsCustomizeRuleIconService
	 * @function
	 *
	 * @description
	 *
	 */
	angular.module(moduleName).service('basicsCustomizeRuleIconService', BasicsCustomizeRuleIconService);

	BasicsCustomizeRuleIconService.$inject = ['platformIconBasisService'];

	function BasicsCustomizeRuleIconService(platformIconBasisService) {

		var icons = [];
		// without default icon now, when icon value is zero, todo
		var baseNames = [ 'calculator', 'document', 'house', 'material', 'money' ];
		var countOverlays = 9;

		platformIconBasisService.setBasicPath('');
		for (var i = 0; i < baseNames.length; i++) {
			var name = baseNames[i];

			for (var j = 1; j <= countOverlays; j++) {
				icons.push(platformIconBasisService.createCssIcon('','rule-icons ico-' + name + ' overlay-' + j));
			}
		}

		platformIconBasisService.extend(icons, this);
	}
})();

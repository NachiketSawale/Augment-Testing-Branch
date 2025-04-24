(function () {
	'use strict';

	/**
	 * basics-common-project-navigator-tree-leaf
	 */
	angular.module('basics.common').directive('basicsCommonProjectNavigatorTreeLeaf', basicsCommonProjectNavigatorTreeLeaf);
	basicsCommonProjectNavigatorTreeLeaf.$inject = ['platformStringUtilsService', '$templateCache'];

	function basicsCommonProjectNavigatorTreeLeaf(stringUtils, $templateCache) {


		return {
			restrict: 'A',
			scope: true,
			template: function (elem, attr) {
				let leafTemplate = $templateCache.get('project-navigator/project-navigator-tree-leaf-template.html');
				let title = stringUtils.replaceSpecialChars(attr.title);
				leafTemplate = leafTemplate.replace(/@@leaftitle@@/g, title)
					.replace('@@ngclick@@', attr.onClick + ';$event.stopPropagation();')
					.replace('@@datatype@@', attr.type);

				return leafTemplate;
			}
		};
	}
})();
(function(angular) {
	'use strict';
	let moduleName = 'estimate.main';

	angular.module(moduleName).directive('estimateMainRootBoqItem', ['BasicsLookupdataLookupDirectiveDefinition', function (BasicsLookupdataLookupDirectiveDefinition) {
		let defaults = {
			version:2,
			type:2,
			lookupType: 'estBoqHeaders',
			valueMember: 'Id',
			displayMember: 'Reference',
			uuid: '76643700d5dc403cb5b701f24fefbc4e'
		};

		return new BasicsLookupdataLookupDirectiveDefinition('combobox-edit', defaults, {
			dataProvider: 'estimateMainBoqHeaderService'
		});
	}]);
})(angular);

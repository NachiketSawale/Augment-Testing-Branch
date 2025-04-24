(function (angular) {
	'use strict';
	var moduleName = 'change.main';

	/**
	 * @ngdoc service
	 * @name changeMainConditionConstantValues
	 * @function
	 *
	 * @description
	 * changeMainConditionConstantValues provides definitions and constants frequently used in change skill module
	 */
	angular.module(moduleName).value('changeMainConstantValues', {
		schemes: {
			change: {typeName: 'ChangeDto', moduleSubModule: 'Change.Main'},
			changeReference: {typeName: 'ChangeReferenceDto', moduleSubModule: 'Change.Main'},
			changeTotal: {typeName: 'ChangeTotalsVDto', moduleSubModule: 'Change.Main'},
			changeTotalGrouped: {typeName: 'ChangeTotalsGroupedVDto', moduleSubModule: 'Change.Main'},
			chang2Externals: {typeName: 'Change2ExternalDto', moduleSubModule: 'Change.Main'}
		},
		uuid: {
			container: {
				changeList: '3aea93d116ae440eb92c414e817e3454',
				changeDetail: '02f152811dd245c5a6eb51d3eaf93515',
				changeReferenceList: '2dc8ccd98e704c9096d4819f2bbd49ea',
				changeReferenceDetail: 'b2940bc5315343558f45dfa6fbbc90ab',
				changeTotalList: 'b7e6d6eec7714665afe46917814e50bd',
				changeTotalDetail: '51932a3ba48645c3a64542f5cec38893',
				changeTotalGroupedList: '8e0288e96e5d4ad2853dc784842b5813',
				changeTotalGroupedDetail: 'af568b67503b405281d4146b1e00f1a8',
				change2ExternalList: '1bdb594baf8443ac91e66456f5c93c2a',
				change2ExternalDetail: '96a52c46f02f41018ced9434094b0497'
			}
		},
		rubricId: 14
	});
})(angular);

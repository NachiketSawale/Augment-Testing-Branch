/**
 * Created by zos on 11/2/2018.
 */
(function () {
	'use strict';
	let moduleName = 'estimate.rule';

	/**
     * @ngdoc service
     * @name estimateRuleSequenceIconService
     * @function
     *
     * @description
     *
     */
	angular.module(moduleName).service('estimateRuleSequenceIconService', estimateRuleSequenceIconService);

	estimateRuleSequenceIconService.$inject = ['_', 'platformIconBasisService', 'estimateRuleSequenceLookupService'];

	function estimateRuleSequenceIconService(_, platformIconBasisService, estimateRuleSequenceLookupService) {

		let icons = [];
		let estRuleSequenceItems = estimateRuleSequenceLookupService.getList4SequenceDetailFormIcons();

		platformIconBasisService.setBasicPath('');
		_.forEach(estRuleSequenceItems, function (item) {

			let iconName = '';

			if(item.Ischangeable){
				iconName = 'editable';
			}else{
				iconName = 'not-editable';
			}

			icons.push(platformIconBasisService.createCssIconWithId(item.Id, item.DescriptionInfo.Translated, 'control-icons ico-' + iconName));

		});

		platformIconBasisService.extend(icons, this);
	}
})();

(() => {
	/*global _*/
	'use strict';
	const moduleName = 'productionplanning.item';

	angular.module(moduleName).service('ppsItemUpstreamStateIconService', ppsItemUpstreamStateIconService);

	ppsItemUpstreamStateIconService.$inject = ['$translate'];

	function ppsItemUpstreamStateIconService($translate) {
		const icons = [
			{
				id: 'None',
				res: 'control-icons ico-blank',
				toolTip: 'productionplanning.item.upstreamState.none'
			}, {
				id: 'Inherited',
				res: 'control-icons ico-accordion-root',
				toolTip: 'productionplanning.item.upstreamState.inherited'
			}, {
				id: 'Linked',
				res: 'control-icons ico-accordion-grp',
				toolTip: 'productionplanning.item.upstreamState.linked'
			}];

		let service = {};

		service.select = (item) => {
			if (item) {
				let icon = _.find(icons, {'id': item.IsUpstreamDefined});
				if (icon) {
					return icon.res;
				}
			}
		};

		service.selectTooltip = (item) => {
			if (item) {
				let icon = _.find(icons, {'id': item.IsUpstreamDefined});
				if (icon) {
					return $translate.instant(icon.toolTip);
				}
			}
		};

		service.getIcons = () => icons;
		service.isCss = () => true;

		return service;
	}
})();
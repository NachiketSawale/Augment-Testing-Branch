((angular => {
	'use strict';

	const sprite = 'control-icons';

	angular.module('cloud.common').constant('cloudCommonLanguagesConstant', [
		{iconClass: `${sprite} ico-gb`, language: 'en', culture: 'en-gb'},
		{iconClass: `${sprite} ico-de`, language: 'de', culture: 'de-de'},
		{iconClass: `${sprite} ico-us`, language: 'en-us', culture: 'en-us'},
		{iconClass: `${sprite} ico-es`, language: 'es', culture: 'es-es'},
		{iconClass: `${sprite} ico-fi`, language: 'fi', culture: 'fi-fi'},
		{iconClass: `${sprite} ico-fr`, language: 'fr', culture: 'fr-fr'},
		{iconClass: `${sprite} ico-nl`, language: 'nl', culture: 'nl-nl'},
		{iconClass: `${sprite} ico-ru`, language: 'ru', culture: 'ru-ru'},
		{iconClass: `${sprite} ico-cn`, language: 'zh', culture: 'zh-cn'},
		{iconClass: `${sprite} ico-it`, language: 'it', culture: 'it-it'},
		{iconClass: `${sprite} ico-cs`, language: 'cs', culture: 'cs-cz'},
		{iconClass: `${sprite} ico-pl`, language: 'pl', culture: 'pl-pl'},
		{iconClass: `${sprite} ico-se`, language: 'sv', culture: 'sv-se'},
		{iconClass: `${sprite} ico-no`, language: 'nb', culture: 'nb-no'},
		{iconClass: `${sprite} ico-lt`, language: 'lt', culture: 'lt-lt'}
	]);
}))(angular);

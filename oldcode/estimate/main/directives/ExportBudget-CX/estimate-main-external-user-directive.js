/**
 * $Id$
 * Copyright (c) RIB Software SE
 */

(function(angular) {
	/** global angular, globals */
	'use strict';
	let moduleName = 'estimate.main';

	/**
     * @ngdoc directive
     * @name estimateMainGroupAction
     * @requires
     * @description select a external user to login to CX api
     */

	angular.module(moduleName).directive('estimateMainExternalUserDirective', [function () {
		return {
			restrict: 'A',
			template: '<div data-ng-controller="estimateMainExternalUserController">' +
                '<div ng-show="!noCxApiUser"><div data-domain-control data-domain="select" data-ng-model="Entity.UserId" data-options="selections" data-change="onSelectedChanged(UserId)"></div></div>' +
                '<div ng-show="noCxApiUser" style="padding-top:5px"><input type="text" data-ng-trim="false" class="domain-type-description form-control ng-pristine ng-valid ng-scope ng-empty ng-touched" data-ng-model="Entity.CxUserName"  data-ng-model-options="{ updateOn: \'default blur\', debounce: { default: 2000, blur: 0} }" data-ng-pattern-restrict="^[\\s\\S]{0,42}$" data-domain="description" placeholder="{{::\'estimate.main.exportBudget2CxWizard.enterCxUserName\'|translate }}" data-ng-blur="loginToiTWOcx()" /></div>' +
                '<div ng-show="noCxApiUser" style="padding-top:5px"><input type="password" autocomplete="off" class="domain-type-password form-control ng-valid ng-scope ng-touched ng-not-empty ng-dirty ng-valid-parse"  data-ng-model="Entity.CxPassword"  data-ng-model-options="{ updateOn: \'default blur\', debounce: { default: 2000, blur: 0} }" data-ng-pattern-restrict="^[\\s\\S]{0,128}$" data-domain="password" placeholder="{{::\'estimate.main.exportBudget2CxWizard.enterCxPassword\'|translate }}" data-ng-blur="loginToiTWOcx()"/></div>' +
                // '<div ng-show="noCxApiUser" style="padding-top:5px"><button type="button" class="btn btn-default ng-binding" style="float:right; margin-bottom:8px" data-ng-click="loginToiTWOcx()" data-ng-disabled="!Entity.CxUserName || !Entity.CxPassword">Load iTWOcx Project</button></div>' +
                '</div>'
		};
	}
	]);


	angular.module(moduleName).directive('estimateMainExternalUserDirectiveV10', [function () {
		return {
			restrict: 'A',
			template: '<div data-ng-controller="estimateMainExternalUserControllerV10">' +
                '<div style="padding-top:5px"><input type="text" data-ng-trim="false" class="domain-type-description form-control ng-pristine ng-valid ng-scope ng-empty ng-touched" data-ng-model="Context.iTWOcxCredential.UserName"  data-ng-model-options="{ updateOn: \'default blur\', debounce: { default: 2000, blur: 0} }" data-ng-pattern-restrict="^[\\s\\S]{0,42}$" data-domain="description" placeholder="{{::\'estimate.main.exportBudget2CxWizard.enterCxUserName\'|translate }}" /></div>' +
                '<div style="padding-top:5px"><input type="password" autocomplete="off" class="domain-type-password form-control ng-valid ng-scope ng-touched ng-not-empty ng-dirty ng-valid-parse"  data-ng-model="Context.iTWOcxCredential.Password"  data-ng-model-options="{ updateOn: \'default blur\', debounce: { default: 2000, blur: 0} }" data-ng-pattern-restrict="^[\\s\\S]{0,128}$" data-domain="password" placeholder="{{::\'estimate.main.exportBudget2CxWizard.enterCxPassword\'|translate }}" /></div>' +
                // '<div ng-show="noCxApiUser" style="padding-top:5px"><button type="button" class="btn btn-default ng-binding" style="float:right; margin-bottom:8px" data-ng-click="loginToiTWOcx()" data-ng-disabled="!Entity.CxUserName || !Entity.CxPassword">Load iTWOcx Project</button></div>' +
                '</div>'
		};
	}
	]);

})(angular);

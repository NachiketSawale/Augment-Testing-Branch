(function () {
	'use strict';

	angular.module('platform').value('platformActionItemListHTMLMarkups', {
		divider: {
			template: '<div class="divider fullheight" data-ng-class="item.cssClass"></div>'
		},
		text: {
			template: '<span data-ng-if="item.caption" class="item {{item.cssClass}}" data-ng-class="{\'ellipsis\': item.ellipsis}" title="{{item.caption}}">{{item.caption}}</span>'
		},
		item: {
			template: '<button data-ng-show="item.visible" ng-disabled="item.disabled" class="item" data-ng-class="[item.cssClass, item.iconClass]" title="{{item.caption}}" ' +
				'data-ng-click="item.fnWrapper(this, item.id, $event)">' +
				'##subIco##' +
				'<span data-ng-show="item.caption">{{item.caption}}</span>' +
				'</button>'
		},
		radio: {
			template: '<button data-ng-show="item.visible" class="item" data-ng-class="[item.cssClass, item.iconClass]" data-ng-attr-title="item.value" ' +
				'data-ng-click="item.fnWrapper(this, item.id, $event)" data-ng-disabled="item.disabled" name="{{item.id}}" data-ng-model="$parent.list.activeValue" btn-radio="getValueForBtnRadio({{item}})">' +
				'##subIco##' +
				'<span data-ng-show="item.caption">{{item.caption}}</span>' +
				'</button>'
		},
		check: {
			template: '<button data-ng-show="item.visible" btn-checkbox class="item" data-ng-class="[item.cssClass, item.iconClass]" title="{{item.caption}}"' +
				'data-ng-click="item.fnWrapper(this, item.id, $event)" data-ng-disabled="{{item.disabled}}" name="{{item.id}}" data-ng-model="item.value">' +
				'##subIco##' +
				'<span data-ng-show="item.caption">{{item.caption}}</span>' +
				'</button>'
		},
		dropdownBtn: {
			template: '<button data-ng-if="item.visible" class="dropdown-toggle item relative-container" data-ng-class="[item.iconClass, item.cssClass]" ' +
				'data-ng-click="executeFn()" data-data="item" title="{{item.toolTip}}" ' +
				'data-ng-disabled="item.disabled" >' +
				'<span data-ng-show="item.caption" class="margin-right-ld">{{item.caption}}</span>' +
				'</button>'
		},
		sublist: {
			template: '<ul data-platform-action-item-list-content data-ng-disabled="{{item.disabled}}" class="item-list-content flex-box"></ul>'
		},
		svg: {
			template: '<svg data-cloud-desktop-svg-image data-sprite="{{item.svgSprite}}" data-image="{{item.svgImage}}" data-replace></svg>'
		},
		colorpicker: {
			template: '<div data-ng-show="item.visible" id="{{item.id}}" class="item" data-ng-class="[item.iconClass, item.cssClass]" title="{{item.caption}}">' +
				'<div data-domain-control data-domain="color" tabindex="-1" data-ng-model="item.value" data-change="item.fnWrapper(this, item.id, $event)" ></div>' +
				'</div>'
		}
	});
})();

/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

export interface IBasicLookUpDataPopUpInterface {
	align: null;
	level: number;
	options: { level: number | null };
	popups: { filter: Function; forEach: Function };
	item: { level: number; close: Function };
	$rootScope: Object;
	result: undefined;
	promise: string;
	show: Function;
	hide: Function;
	filter: Function;
	push: Function;
	settings: {
		level: number | null;
		scope: { $close: Function | null };
		focusedElement: Function;
		template: string;
		templateUrl: string;
		resolve: Function;
	};
	popupResultDeferred: {
		promise: string;
		notify: Function;
		reject: Function;
		resolve: Function;
	};
	popupOpenedDeferred: {
		promise: string;
		notify: Function;
		reject: Function;
		resolve: Function;
	};
	popupClosedDeferred: {
		promise: string;
		notify: Function;
		reject: Function;
		resolve: Function;
	};
}

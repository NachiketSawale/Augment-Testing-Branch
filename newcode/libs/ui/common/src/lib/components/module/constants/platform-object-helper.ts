/* eslint-disable */
// TODO: Either remove this file, or re-enable ESLint and fix all errors
//       before it is included in a production version!

/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import * as _ from 'lodash';
import { extend, forEach, PropertyPath } from 'lodash';

export class PlatformObjectHelper {
	setValue(entity: { [x: string]: string | null }, field: PropertyPath, value: string) {
		_.set(entity, field, value);
	}

	getValue(entity: { [x: string]: string | null | number | boolean | object } | string | null, field: string, defaultValue?: string | undefined): null | string {
		if (field) {
			return _.get(entity as any, field, defaultValue !== undefined ? defaultValue : null);
		}

		return null;
	}

	checkProperty(entity: string | { [x: string]: string | null } | null, field: string) {
		let result = false;

		if (field) {
			const props = field.split('.');

			_.each(props, function (prop: string) {
				if (entity) {
					result = entity.hasOwnProperty(prop);
					entity = (entity as { [x: string]: string | null })[prop];
				}
			});
		}

		return result;
	}

	// function (...args: any) { }
	isSet(_args: string | { [x: string]: string | null | number | boolean | object } | null): boolean {
		let result = false;
		_.each(arguments, function (arg: string | { [x: string]: string | null }) {
			result = arg !== null && arg !== undefined;
			if (!result) {
				return result;
			}
			// need to test
			return result;
		});

		return result;
	}

	// checks if value is an angular promise
	isPromise(value: Promise<string>): boolean {
		return value && _.isFunction(value.then);
	}

	extendGrouping(gridColumns: { name$tr$: string; field: string }[]) {
		forEach(gridColumns, function (column: { name$tr$: string; field: string }): void {
			extend(column, {
				grouping: {
					title: column.name$tr$,
					getter: column.field,
					aggregators: [],
					aggregateCollapsed: true,
				},
			});
		});

		return gridColumns;
	}

	arrayItemMove(arr: string[], from: number, to: number) {
		arr.splice(to, 0, arr.splice(from, 1)[0]);
		return arr;
	}

	//   /**
	//    * @ngdoc function
	//    * @name cleanupScope
	//    * @function
	//    * @methodOf platformObjectHelper
	//    * @description removes all properties of given $scope not starting with $
	//    * @param {object} scope $scope to be cleaned
	//    * @param {object} $timeout $timeout or null (called immediately)
	//    */
	//   cleanupScope(/* scope, $timeout */) {
	//     return;
	//   }
	/** The above method has been commented because the method doesn't accept or return any value and also doesn't perform any operation */
}

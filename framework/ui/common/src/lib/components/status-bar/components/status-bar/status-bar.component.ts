/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

/**
 * @ngdoc component
 * @name platform.component:platformStatusBar
 * @element div
 * @description Displays a status bar.
 */
import { Component } from '@angular/core';
import * as _ from 'lodash';
import { IFieldsInterface, IStatusBarComponentInterface } from '../../model/interfaces/status-bar.interface';

@Component({
	selector: 'ui-common-status-bar',
	templateUrl: './status-bar.component.html',
	styleUrls: ['./status-bar.component.scss'],
})
export class UiCommonStatusBarComponent implements IStatusBarComponentInterface {
	private version!: number;
	public fields!: IFieldsInterface[];
	public newFields!: IFieldsInterface;
	public changedFields!: { id: string; value: number };
	public field!: IFieldsInterface;
	private normalizedFields!: ConcatArray<IFieldsInterface>;

	private linkObject = {
		/**
		 * @ngdoc function
		 * @name setFields
		 * @description set new elements to the end of the array for status bar.
		 * @param {fieldsObj}
		 *
		 * @return {void}
		 */
		setFields: (fieldsObj: IFieldsInterface) => {
			setTimeout(() => {
				const normalizedFields = _.map(
					_.filter(this.normalizeToArray(fieldsObj), (f: { delete: string }) => {
						return !f.delete;
					}),
					this.addDefaultSettings
				);
				normalizedFields;
				this.sortFields();
				this.version++;
			}, 1000);
		},

		/**
		 * @ngdoc function
		 * @name addFields
		 * @description  Appends new elements to the end of an array for status bar.
		 * @param {newFields}
		 *
		 * @return { }
		 */

		addFields: (newFields: IStatusBarComponentInterface) => {
			if (!_.isNil(newFields.newFields)) {
				setTimeout(() => {
					const normalizeFieldsObj: IFieldsInterface = {
						align: '',
						cssClass: '',
						disabled: false,
						ellipsis: false,
						id: '',
						toolTip: '',
						type: '',
						value: 0,
						visible: false,
					};
					const normalizedFields = _.map(
						_.filter(this.normalizeToArray(normalizeFieldsObj), (f: { delete: string }) => {
							return !f.delete;
						}),
						this.addDefaultSettings
					);
					this.fields = this.fields.concat(this.normalizedFields);
					normalizedFields;
					this.sortFields();
					this.version++;
				}, 1000);
			}
		},

		/**
		 * @ngdoc function
		 * @name updateFields
		 * @description Appends new elements to the end of an array, and returns the new length of the array.
		 * @param {changedFields}
		 *
		 * @return {}
		 */

		updateFields: (changedFields: IStatusBarComponentInterface) => {
			setTimeout(() => {
				const fieldsObject: IFieldsInterface = {
					align: '',
					cssClass: '',
					disabled: false,
					ellipsis: false,
					id: '',
					toolTip: '',
					type: '',
					value: 0,
					visible: false,
				};
				if (!_.isNil(changedFields)) {
					const normalizedFields = this.normalizeToArray(fieldsObject);
					normalizedFields.forEach((f) => {
						if (f.delete) {
							const idx = _.findIndex(this.fields, { id: f.id });
							if (idx >= 0) {
								this.fields.splice(idx, 1);
							}
						} else {
							const origField = _.find(this.fields, { id: f.id });
							if (origField) {
								_.assign(origField, f);
							} else {
								const f = this.addDefaultSettings(changedFields);
								this.fields.push(f);
							}
						}
					});
					this.sortFields();
				}
				this.version++;
			});
		},

		/**
		 * @ngdoc function
		 * @name update
		 * @description updates the version.
		 *
		 * @return {}
		 */
		update: () => {
			setTimeout(() => {
				this.version++;
			}, 1000);
		},
	};

	/**
	 * @ngdoc function
	 * @name normalizeToArray
	 * @description Checks if value is classified as an Array object.
	 *
	 * @param {fields}
	 *
	 * @return {Array<object>}
	 */

	public normalizeToArray(fields: IFieldsInterface) {
		if (_.isArray(fields)) {
			return _.filter(fields, (f) => {
				return _.isObject(f);
			});
		}
		if (!_.isObject(fields)) {
			return [];
		}
		const result: Array<object> = [];
		Object.keys(fields).forEach((key) => {
			const f = fields.id;
			if (f === null) {
				result.push({
					id: key,
					delete: true,
				});
			}
			if (_.isObject(f)) {
				// TODO: is this still required?
				//const id = key;
				result.push(f);
			}
		});
		return result;
	}

	/**
	 * @ngdoc function
	 * @name addDefaultSettings
	 * @description mutates object and is loosely based on Object.assign.
	 * @param {fieldObject}
	 *
	 * @return {}
	 */
	public addDefaultSettings(fieldObject: IStatusBarComponentInterface) {
		return _.assign(
			{
				visible: true,
				disabled: false,
				toolTip: {},
				align: 'right-side',
				ellipsis: false,
			},
			fieldObject.field
		);
	}

	/**
	 * @ngdoc function
	 * @name sortFields
	 * @description mutates the array and returns a reference to the same array.
	 *
	 * @return {}
	 */
	public sortFields() {
		this.fields?.sort((a, b) => {
			if (!_.isObject(a) || !_.isObject(b)) {
				return 0;
			}
			if (a === b) {
				return 0;
			}
			if (a < b) {
				return -1;
			} else {
				return 1;
			}
		});
	}

	/**
	 * @ngdoc function
	 * @name setlink
	 * @description called the linkObject functions.
	 *
	 * @return {}
	 */
	public setlink(): void {
		this.linkObject;
	}

	/**
	 * @ngdoc function
	 * @name ngOnDestroy
	 * @description Destroy fields value and setLink.
	 *
	 * @return {}
	 */
	public ngOnDestroy(): void {
		// TODO: is this still required?
		//const fields = null;
		this.setlink;
	}
}

/*
 * Copyright(c) RIB Software GmbH
 */
import * as _ from 'lodash';
import { Injectable, inject } from '@angular/core';

import { ScopedConfigDialogComponent } from '../components/scoped-config-dialog/scoped-config-dialog.component';

import { IFormConfig } from '../../../form';
import { FieldType } from '../../../model/fields';
import { AccessScope, CheckAccessRightsResult, IAccessScopeInfo, PlatformCommonAccessScopeService, PropertyIdentifier } from '@libs/platform/common';
import { IScopedConfigDialogState } from '../model/scoped-config-dialog-state.interface';
import { IScopedConfigDialogConfig } from '../model/scoped-config-dialog-options.interface';
import { IEditorDialog, IEditorDialogResult, StandardDialogButtonId, UiCommonDialogService } from '../../base';
import { IScopedConfigDialogFormData } from '../model/scoped-config-dialog-form-data.interface';
import { IEntityData } from '../model/scoped-config-dialog-entity-data.interface';
import { IScopedConfigDialogFormDataSetting } from '../model/scoped-config-dialog-form-settings-data.interface';
import { IScopedConfigDialogData, getScopedConfigDialogDataToken } from '../model/scoped-config-dialog-data.interface';

/**
 * Displays a modal dialog box for configuring settings that are scoped to users, roles, or the system,
 * and that can optionally be specified to override the less prioritized settings.
 *
 * @group Dialogs
 */
@Injectable({
	providedIn: 'root',
})
export class UiCommonScopedConfigDialogService {
	/**
	 * Opens/Closes form dialog.
	 */
	private readonly modalDialogService = inject(UiCommonDialogService);

	/**
	 * This service provides utility routines for working with the AccessScope type.
	 */
	private readonly accessScopeService = inject(PlatformCommonAccessScopeService);

	/**
	 * Support variable for get/set.
	 *
	 * @param {string} propName The name of the model property.
	 * @returns {string} The generated property name.
	 */
	private getControlName(propName: string): string {
		return '_' + propName;
	}

	/**
	 * Support variable for get/set.
	 *
	 * @param {string} propName The name of the model property.
	 * @returns {string} The generated property name.
	 */
	private getValueActualPropertyName(propName: string): string {
		return '_rt$set_' + propName;
	}

	/**
	 * Returns the name of the property that determines, for a given model property, whether
	 * a value is set (rather than inherited from the next fallback level).
	 * @param {string} propName The name of the model property.
	 * @returns {string} The generated property name.
	 */
	private getValueDefinedPropertyName(propName: string): string {
		return '__rt$set_' + propName;
	}

	/**
	 * Returns the name of the property that stores the previously edited value of a model property
	 * that currently inherits its value from the next fallback level.
	 * @param {string} propName The name of the model property.
	 * @returns {string} The generated property name.
	 */
	private getEditedValuePropertyName(propName: string): string {
		return '__rt$edited_' + propName;
	}

	/**
	 * Creates an expanded form configuration that may include controls for determining whether
	 * a property value is set or inherited from the next fallback level.
	 *
	 * @param {IFormConfig<T>} formCfg The original form configuration.
	 * @param {boolean} isLastConfigurableLevel Indicates whether the form configuration represents the last
	 *                                      	cascading level, that is, the level whose fallback is not
	 *                                      	configurable in the dialog box.
	 * @param {T} fallback An object specifying the default settings that cannot be edited in the dialogbox.
	 * @param {boolean} hasEditPermission Indicates whether the user has the permission to modify settings in the current access scope.
	 * @returns {IFormConfig<T>} The expanded form configuration.
	 */
	private expandForm<T extends object>(formCfg: IFormConfig<T>, isLastConfigurableLevel: boolean, fallback: T, hasEditPermission: boolean): IFormConfig<T> {
		const result = _.cloneDeep(formCfg);

		for (let rowIdx = 0; rowIdx < result.rows.length; rowIdx++) {
			const row = result.rows[rowIdx];
			if (row.model && !row.readonly) {
				if (!isLastConfigurableLevel || typeof fallback[this.getKey(row.model)] !== 'undefined') {
					const valueDefinedProp = this.getValueDefinedPropertyName(row.model as string);
					result.rows[rowIdx] = {
						type: FieldType.Composite,
						groupId: row.groupId,
						id: row.id,
						label: row.label,
						sortOrder: row.sortOrder,
						visible: row.visible,
						composite: [
							{
								model: valueDefinedProp,
								type: FieldType.Boolean,
								id: 'bool',
								tooltip: {
									text: '',
									key: 'platform.overwriteInherited',
								},
								readonly: !hasEditPermission ? true : false,
							},
							{
								...row,
								...{
									readonly: !hasEditPermission ? true : false,
								},
							},
						],
					};
				} else {
					if (!hasEditPermission) {
						row.readonly = true;
					}
				}
			}
		}

		return result;
	}

	/**
	 * Creates expanded copy of the settings object.
	 *
	 * @param {IScopedConfigDialogFormDataSetting<T>} result The expanded copy of the settings object.
	 * @param {T} settings Original settings of fallback settings.
	 * @param {string} model Form row model.
	 * @param {boolean} actualPropValue Actual prop value.
	 * @param {boolean} isPresent Boolean for check.
	 */
	private createSettingsData<T extends object>(result: IScopedConfigDialogFormDataSetting<T>, settings: T, model: string, actualPropValue: boolean, isPresent: boolean): void {
		const controlName = this.getKey<T>(this.getControlName(model));
		const valueDefinedProp = this.getValueDefinedPropertyName(model);
		const valueActualProp = this.getKey<T>(this.getValueActualPropertyName(model));
		const editedValueProp = this.getKey<T>(this.getEditedValuePropertyName(model));

		Object.assign(result.entity, { [valueActualProp]: actualPropValue });
		result.entity[controlName] = _.cloneDeep(settings[this.getKey(model)]);

		Object.defineProperty(result.entity, valueDefinedProp, {
			get: () => {
				return result.entity[valueActualProp];
			},
			set: function (val) {
				const field = result.runTimeData.readOnlyFields.find((item) => {
					return item.field === model;
				});

				if (field) {
					field.readOnly = !val;
				}

				result.entity[valueActualProp] = val;
				if (val) {
					if (typeof this[editedValueProp] !== 'undefined') {
						this[model] = this[editedValueProp];
					}
				} else {
					this[editedValueProp] = this[model];
					this.__rt$inheritedSettings.passValueOn(model);
				}
			},
		});

		Object.defineProperty(result.entity, model, {
			get: () => result.entity[controlName],
			set: function (val) {
				result.entity[controlName] = val;
				if (this.passValueOn) {
					this.passValueOn(model);
				}
			},
		});

		if (isPresent) {
			result.runTimeData.readOnlyFields.push({
				field: model,
				readOnly: !isPresent,
			});
			if (typeof result.entity[editedValueProp] !== 'undefined') {
				result.entity[this.getKey<T>(model)] = result.entity[editedValueProp];
			}
		} else {
			result.entity[editedValueProp] = result.entity[this.getKey(model)];
			result.runTimeData.readOnlyFields.push({
				field: model,
				readOnly: !isPresent,
			});
		}
	}

	/**
	 * Creates an expanded copy of a settings object for a single fallback level. The expanded copy
	 * includes runtime data required by the internal logic of the dialog box.
	 *
	 * @param {IFormConfig<T>} formCfg The original form configuration.
	 * @param {T} originalSettings The unaltered settings for a single fallback level.
	 * @param {boolean} isLastConfigurableLevel  Indicates whether the form configuration represents the last
	 *                                       	 cascading level, that is, the level whose fallback is not
	 *                                       	 configurable in the dialog box.
	 * @param {T} fallback The expanded settings object that serves as a fallback to the current fallback level.
	 * @returns {IScopedConfigDialogFormDataSetting<T>} The expanded copy of the settings object.
	 */
	private createExpandedSettings<T extends object>(formCfg: IFormConfig<T>, originalSettings: T, isLastConfigurableLevel: boolean, fallback: T): IScopedConfigDialogFormDataSetting<T> {
		const result = {
			entity: {},
			runTimeData: {
				readOnlyFields: [],
				validationResults: [],
				entityIsReadOnly: false,
			},
		};

		formCfg.rows.forEach((row) => {
			if (row.model && !row.readonly) {
				const modelProp = row.model as string;
				if (!isLastConfigurableLevel || typeof fallback[this.getKey(row.model)] !== 'undefined') {
					if (typeof originalSettings[this.getKey(row.model)] !== 'undefined' && originalSettings[this.getKey(row.model)] !== null) {
						this.createSettingsData(result, originalSettings, modelProp, true, true);
					} else {
						this.createSettingsData(result, fallback, modelProp, false, false);
					}
				} else {
					this.createSettingsData(result, originalSettings, modelProp, true, true);
				}
			}
		});

		return result;
	}

	/**
	 * Generates the expanded form and settings objects for all fallback levels.
	 *
	 * @param { IFormConfig<Partial<T>>} formCfg The original form configuration.
	 * @param {IScopedConfigDialogState<T>} entity All original settings. These settings should be provided as an object with
	 *                          				   properties whose name match the `id` field in the objects returned by
	 *                                             @see {@link PlatformCommonAccessScopeService.createItems}. Each of these
	 *                                             properties may hold an object that stores the actual settings for the
	 *                                             respective fallback level.
	 * @param {Partial<T>} fallbackDataItem An object that provides default settings that serve as a fallback for
	 *                         	   the settings provided in `entity`. If a property is not defined in
	 *                             this object, users will be forced to enter a value in the last fallback
	 *                             level, as the option for inheriting a value will not be available.
	 * @param {CheckAccessRightsResult} hasEditPermissions  An object that indicates for each access scope whether the user has
	 *                              	the permission to modify settings.
	 * @param {IAccessScopeInfo[]} scopesData scopes data.
	 * @returns {IScopedConfigDialogData<T>} An object that stores information about the fallback levels in two fashions: `byName`
	 *                   				 	allows access via the `id`. `ordered` allows access via
	 *                   				 	an array ordered from least prioritized to most prioritized fallback level.
	 */
	private generateForm<T extends object>(
		formCfg: IFormConfig<Partial<T>>,
		entity: IScopedConfigDialogState<T>,
		fallbackDataItem: Partial<T>,
		hasEditPermissions: CheckAccessRightsResult,
		scopesData: IAccessScopeInfo[],
	): IScopedConfigDialogData<T> {
		const result: IScopedConfigDialogData<T> = {
			byName: {},
			ordered: [],
			items: scopesData,
		};

		result.byName[0] = {
			scopeLevel: 0,
			isGlobalFallback: true,
			formConfiguration: null, // intentionally null; there is no form for fallback settings
			settings: {
				entity: _.cloneDeep(fallbackDataItem),
				runTimeData: {
					readOnlyFields: [],
					validationResults: [],
					entityIsReadOnly: false,
				},
			},
		};

		result.ordered.push(result.byName[0]);

		scopesData
			.sort((obj1, obj2) => obj1.priority - obj2.priority)
			.forEach((scopeLevel, index) => {
				const obj: IScopedConfigDialogFormData<T> = {
					scopeLevel: scopeLevel.id,
					isGlobalFallback: false,
					formConfiguration: this.expandForm(formCfg, index <= 0, fallbackDataItem, hasEditPermissions[scopeLevel.scope as keyof CheckAccessRightsResult]),
					settings: this.createExpandedSettings(formCfg, entity[scopeLevel.id], index <= 0, result.ordered[result.ordered.length - 1].settings.entity),
				};

				(obj.settings.entity as unknown as IEntityData<T>).__rt$inheritedSettings = result.ordered[result.ordered.length - 1].settings.entity;

				result.byName[scopeLevel.id] = obj;
				result.ordered.push(obj);

				(result.ordered[index].settings.entity as unknown as IEntityData<T>).passValueOn = (propName: string) => {
					const valueDefinedProp = this.getValueDefinedPropertyName(propName);
					if (!result.ordered[index + 1].settings.entity[this.getKey(valueDefinedProp)]) {
						result.ordered[index + 1].settings.entity[this.getKey(propName)] = result.ordered[index].settings.entity[this.getKey(propName)];
					}
				};
			});

		return result;
	}

	/**
	 * Returns key for object.
	 * @param {string|PropertyIdentifier<T>} key key name.
	 * @returns {keyof T} object key.
	 */
	private getKey<T extends object>(key: string | PropertyIdentifier<T>): keyof T {
		return key as keyof T;
	}

	/**
	 * Writes settings from the form back into the original data item.
	 *
	 * @param {IFormConfig<T>} formCfg The original, unaltered form configuration.
	 * @param {IScopedConfigDialogData<T>} scopedForm An object as returned by @see {generateForm}.
	 * @param {IScopedConfigDialogState<T>} dataItem The original settings object that serves as a target for the operation.
	 */
	private applySettings<T extends object>(formCfg: IFormConfig<T>, scopedForm: IScopedConfigDialogData<T>, dataItem: IScopedConfigDialogState<T>) {
		scopedForm.ordered.forEach((level) => {
			if (!level.isGlobalFallback) {
				let dataItemLevel = dataItem[level.scopeLevel];
				let newDataItemLevel;
				if (dataItemLevel) {
					newDataItemLevel = false;
				} else {
					newDataItemLevel = true;
					dataItemLevel = {};
				}

				let isValueSet = false;
				formCfg.rows.forEach((row) => {
					if (row.model && !row.readonly) {
						const valueDefinedProp = this.getValueDefinedPropertyName(row.model as string);
						if (level.settings.entity[this.getKey(valueDefinedProp)]) {
							isValueSet = true;
							dataItemLevel[this.getKey(row.model)] = level.settings.entity[this.getKey(row.model)];
						} else {
							if (typeof dataItemLevel[this.getKey(row.model)] !== 'undefined') {
								delete dataItemLevel[this.getKey(row.model)];
							}
						}
					}
				});

				if (newDataItemLevel && isValueSet) {
					dataItem[level.scopeLevel] = dataItemLevel;
				}
			}
		});
	}

	/**
	 * Shows a dialog box for access-scoped configuration settings.
	 *
	 * @param {IScopedConfigDialogConfig<T>} config Dialog configuration options.
	 * @returns {Promise<IEditorDialogResult<IScopedConfigDialogState<T>>> | undefined } Dialog result
	 */
	public showDialog<T extends object>(config: IScopedConfigDialogConfig<T>): Promise<IEditorDialogResult<IScopedConfigDialogState<T>> | undefined> {
		if (!config.formConfiguration) {
			throw new Error('No form configuration found.');
		}

		const entity = config.value ?? {};

		const scopesData = this.createItems();

		scopesData.forEach((scopeLevel) => {
			if (!entity[scopeLevel.id]) {
				entity[scopeLevel.id] = {};
			}
		});

		return this.accessScopeService.checkAccessRights(config.permissions).then((scopedPermissions) => {
			const finalFormConfig = this.generateForm<T>(config.formConfiguration, entity, config.fallbackValue || {}, scopedPermissions as CheckAccessRightsResult, scopesData);

			const effectiveConfig = this.modalDialogService.createOptionsForCustom<IEditorDialog<IScopedConfigDialogState<T>>, IScopedConfigDialogConfig<T>, IScopedConfigDialogState<T>, ScopedConfigDialogComponent<T>>(
				config,
				(info) => info.body.dialogInfo,
				ScopedConfigDialogComponent,
				[
					{
						provide: getScopedConfigDialogDataToken<T>(),
						useValue: finalFormConfig,
					},
				],
			);

			if (!effectiveConfig.buttons || (effectiveConfig.buttons && !effectiveConfig.buttons.length)) {
				effectiveConfig.buttons = [
					{
						id: StandardDialogButtonId.Ok,
					},
				];
			}

			if (!effectiveConfig.width) {
				effectiveConfig.width = '600px';
			}

			return this.modalDialogService.show(effectiveConfig)?.then((val) => {
				this.applySettings(config.formConfiguration, finalFormConfig, entity);
				return val;
			});
		});
	}

	/**
	 * Returns an Array with information about a required access scopes.
	 *
	 * @returns {IAccessScopeInfo[]} Required Scopes.
	 */
	private createItems(): IAccessScopeInfo[] {
		const scopesData: IAccessScopeInfo[] = [];
		const scopes = [AccessScope.Global, AccessScope.Role, AccessScope.User];

		scopes.forEach((scope) => {
			scopesData.push(this.accessScopeService.getInfo(scope));
		});

		return scopesData;
	}
}

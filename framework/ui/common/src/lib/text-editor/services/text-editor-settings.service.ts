/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';

import { PlatformHttpService } from '@libs/platform/common';

import { ITextEditorSettings } from '../model/interfaces/text-editor-settings.interface';
import { IFonts } from '../model/interfaces/fonts.interface';
import { ISystemSettings } from '../model/interfaces/system-settings.interface';
import { SystemFonts } from '../model/system-fonts.model';
import { Observable } from 'rxjs';
import { RulerUnitCaption } from '../model/ruler-unit.enum';
import { IEditorUnits } from '../model/interfaces/editor-units.interface';
import { units } from '../model/unit.model';
import { FieldType } from '../../model/fields';
import { IFormConfig } from '../../form';
import { ISettingsViewDialogOptions } from '../model/interfaces/settings-view-dialog-options.interface';


@Injectable({
	providedIn: 'root',
})
/**
 * TODO: Created service for demo as required in quill editor implementation
 * once platformWysiwygEditorSettingsService service is implemented 
 * those functions will be removed.
 */
export class TextEditorSettingsService {


	/**
	 * Used to inject platform http service
	 */
	private readonly http = inject(PlatformHttpService);

	/**
	 * Used to get editor settings.
	 *
	 * @returns {Observable<ITextEditorSettings>} returns wysiwyg editor settings
	 */
	public getBothSettings(): Observable<ITextEditorSettings> {
		const params = { params: { settingsKey: 'wysiwygEditorSettings' } };
		return this.http.get$<ITextEditorSettings>('cloud/desktop/usersettings/loadsetting', params);
	}

	/**
	 * Used to get fonts data from system settings.
	 *
	 * @param {ISystemSettings} data system settings
	 * @returns {IFonts[] | undefined} returns fonts data
	 */
	public getCurrentFonts(data: ISystemSettings): IFonts[] | undefined {
		if (data === undefined) {
			return;
		}
		const systemFonts = SystemFonts;
		const retVal = data.showSystemFonts ? this.mergeFonts(systemFonts, data.fonts) : data.fonts;
		return retVal.sort((a, b) => {
			return (a.displayName?.toUpperCase() || '').localeCompare(b.displayName.toUpperCase() || '');
		});
	}

	/**
	 * Used to merged all fonts data
	 *
	 * @param {IFonts[]} allFonts fonts data
	 * @param {IFonts[]} userFonts fonts data
	 * @returns { IFonts[]} returns fonts data
	 */
	public mergeFonts(allFonts: IFonts[], userFonts: IFonts[]): IFonts[] {
		if (Array.isArray(allFonts) && Array.isArray(userFonts)) {
			userFonts.forEach((userFont) => {
				if (userFont.fontFamily !== undefined) {
					if (userFont.displayName === undefined) {
						userFont.displayName = userFont.fontFamily;
					}
					const index = allFonts.findIndex((font) => font.fontFamily === userFont.fontFamily);
					if (index > -1) {
						allFonts[index] = userFont;
					} else {
						allFonts.push(userFont);
					}
				}
			});
		}
		return allFonts;
	}
	/**
	 * the function get the unit of the caption
	 *
	 * @param unit unit value
	 * @returns unit of caption
	 */
	public getUnitCaption(unit: string) {
		const value = units.find((x) => x.value === unit);
		if (value) {
			return value.caption;
		}
		return null;
	}


	/**
	 * Used to convert in required unit. 
	 * 
	 * @param {string} newValue 
	 * @param {string} oldValue 
	 * @param {number} value 
	 * @returns {number} returns unit value
	 */
	public convertInRequiredUnit(newValue: string, oldValue: string, value: number): number {
		let newVal: IEditorUnits = {
			value: '',
			caption: RulerUnitCaption.in,
			decimal: 0
		};
		let oldVal: IEditorUnits = {
			value: '',
			caption: RulerUnitCaption.in,
			decimal: 0
		};

		if (newValue === 'px' && oldValue !== 'px') {
			newVal.caption = RulerUnitCaption.px;
			oldVal = units.find(unit => unit.value === oldValue) as IEditorUnits;
		} else if (oldValue === 'px' && newValue !== 'px') {
			newVal = units.find(unit => unit.value === newValue) as IEditorUnits;
			oldVal.caption = RulerUnitCaption.px;
		} else {
			oldVal = units.find(unit => unit.value === oldValue) as IEditorUnits;
			newVal = units.find(unit => unit.value === newValue) as IEditorUnits;
		}

		switch (oldVal.caption + '-' + newVal.caption) {
			case 'mm-cm':
				value /= 10;
				break;
			case 'mm-in':
				value /= 25.4;
				break;
			case 'cm-mm':
				value *= 10;
				break;
			case 'cm-in':
				value /= 2.54;
				break;
			case 'in-mm':
				value *= 25.4;
				break;
			case 'in-cm':
				value *= 2.54;
				break;
			case 'mm-px':
				value *= 3.7795275591;
				break;
			case 'cm-px':
				value *= 37.795275591;
				break;
			case 'in-px':
				value *= 96;
				break;
			case 'px-mm':
				value /= 3.7795275591;
				break;
			case 'px-cm':
				value /= 37.795275591;
				break;
			case 'px-in':
				value /= 96;
				break;
			default:
				break;
		}

		return value;
	}


	/**
	 * 
	 * Used to get settings-view dialog options.
	 * 
	 * @returns {IFormConfig<ISettingsViewDialogOptions>} returns settings-view
	 * dialog form-config
	 */
	public getSettingsViewDialogOptions(): IFormConfig<ISettingsViewDialogOptions> {
		const settingsViewFormConfig: IFormConfig<ISettingsViewDialogOptions> = {
			formId: 'SettingsView',
			showGrouping: true,
			groups: [
				{
					groupId: 'tool',
					header: { key: 'platform.wysiwygEditor.settings.activate' },
					open: true,
					visible: true,
					sortOrder: 1
				},
				{
					groupId: 'general',
					header: { key: 'platform.wysiwygEditor.settings.groupGeneral' },
					open: true,
					visible: true,
					sortOrder: 10
				},
				{
					groupId: 'docview',
					header: { key: 'platform.wysiwygEditor.settings.groupDocview' },
					open: true,
					visible: true,
					sortOrder: 15
				},
			],
			rows: [
				{
					groupId: 'tool',
					type: FieldType.Boolean,
					id: 'activateUserSettings',
					model: 'useSettings',
					label: { key: 'platform.wysiwygEditor.activateUserSettings' },
					visible: true,
					sortOrder: 1,
					change: (entity) => {
						const dataReadonly = !entity.entity.useSettings;
						this.setReadonlyFields(dataReadonly, settingsViewFormConfig);
					}
				},
				{
					groupId: 'tool',
					id: 'showRuler',
					label: { key: 'platform.wysiwygEditor.settings.showRuler' },
					visible: true,
					sortOrder: 2,
					model: 'showRuler',
					type: FieldType.Boolean
				},
				{
					groupId: 'tool',
					id: 'activateAutoNumberingSettings',
					label: { key: 'platform.wysiwygEditor.activateAutoNumberSettings' },
					type: FieldType.Boolean,
					visible: true,
					sortOrder: 3,
					model: 'autoNumberSettings'
				},
				{
					groupId: 'general',
					id: 'unitOfMeasurement',
					label: {
						key: 'platform.wysiwygEditor.unitOfMeasurement',
					},
					type: FieldType.Select,
					visible: true,
					itemsSource: {
						items: [
							{
								id: 'mm',
								displayName: 'mm',
							},
							{
								id: 'cm',
								displayName: 'cm',
							},
							{
								id: 'in',
								displayName: 'in',
							},
						],
					},
					model: 'unitOfMeasurement',
					readonly: false,
					change: (changeInfo) => {
						console.log(changeInfo);
						//TODO: function implementation is pending as
						//change event not working on selecting new value 

					},
				},
				{
					groupId: 'docview',
					id: 'width',
					label: {
						key: 'platform.wysiwygEditor.settings.documentWidth',
					},
					type: FieldType.Decimal,
					visible: true,
					sortOrder: 5,
					model: 'documentWidth',
					readonly: false,

				},
				{
					groupId: 'docview',
					id: 'padding',
					label: {
						key: 'platform.wysiwygEditor.settings.documentPadding',
					},
					type: FieldType.Decimal,
					visible: true,
					sortOrder: 10,
					model: 'documentPadding',
					readonly: false,
				},
			],
		};

		return settingsViewFormConfig;
	}


	/**
	 * Used to set fields readonly.
	 * 
	 * @param {boolean} dataReadonly is field readonly
	 * @param {IFormConfig<ISettingsViewDialogOptions>} formConfig
	 * settings-view dialog form config. 
	 */
	public setReadonlyFields(dataReadonly: boolean, formConfig: IFormConfig<ISettingsViewDialogOptions>) {

		const readOnlyFields: string[] = [
			'unitOfMeasurement', 'showRuler', 'documentWidth', 'documentPadding'
		];
		formConfig.rows.forEach(item => {
			if (readOnlyFields.includes(item.model as string)) {
				item.readonly = dataReadonly;
			}
		});
	}
}

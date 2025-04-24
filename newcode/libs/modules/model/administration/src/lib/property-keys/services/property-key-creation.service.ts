/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import {
	FieldType,
	IFormDialogConfig,
	StandardDialogButtonId,
	UiCommonFormDialogService
} from '@libs/ui/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { IPropertyKeyCreationConfig } from '../model/property-key-creation-config.interface';
import { ICreatePropertyKeyRequestEntity, IPropertyKeyEntity } from '../model/entities/entities';
import { PropertyKeyTagSelectorComponent } from '../components/property-key-tag-selector/property-key-tag-selector.component';
import { ModelAdministrationValueTypeUtilityService } from './model-administration-value-type-utility.service';

/**
 * A service that provides a dialog box for creating new model property keys.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationPropertyKeyCreationService {

	private readonly formDialogSvc = inject(UiCommonFormDialogService);

	private readonly valueTypeUtilSvc = inject(ModelAdministrationValueTypeUtilityService);

	/**
	 * Shows a dialog box to specify settings for a new property key.
	 *
	 * @param config An optional configuration object for the dialog box.
	 *
	 * @returns A promise that is resolved to the request for the new property key,
	 *   or to `null` if the dialog is canceled.
	 */
	public async showDialog(config?: Omit<IPropertyKeyCreationConfig, 'fromAdminModule'>): Promise<ICreatePropertyKeyRequestEntity | null> {
		const effectiveConfig: IPropertyKeyCreationConfig = {
			selectedTags: [],
			...config
		};

		const newPropKeySettings: ICreatePropertyKeyRequestEntity = {
			TagIds: effectiveConfig.selectedTags,
			DefaultValue: undefined
		};
		// TODO: read-only

		const defaultValueHelper = await this.valueTypeUtilSvc.generatePropertyValueFieldOverload<ICreatePropertyKeyRequestEntity>();

		const dlgConfig: IFormDialogConfig<ICreatePropertyKeyRequestEntity> = {
			headerText: {key: 'model.administration.propertyKeys.newPropKey'},
			entity: newPropKeySettings,
			formConfiguration: {
				showGrouping: false,
				groups: [{
					groupId: 'default'
				}],
				rows: [{
					groupId: 'default',
					id: 'name',
					label: {key: 'cloud.common.entityName'},
					model: 'PropertyName',
					type: FieldType.Description,
					maxLength: 255
				}, {
					...BasicsSharedLookupOverloadProvider.provideValueTypeLookupOverload(false),
					groupId: 'default',
					id: 'vt',
					model: 'ValueTypeFk',
					label: {key: 'model.administration.propertyValueType'},
					change: info => {
						if (typeof info.newValue === 'number') {
							defaultValueHelper.valueTypeId = info.newValue;
						}
					}
				}, {
					groupId: 'default',
					id: 'usedefvals',
					label: {key: 'model.administration.useDefaultValue'},
					type: FieldType.Boolean,
					model: 'UseDefaultValue',
					/*TODO: change: function (item) {
						setDefaultValueFieldsReadOnly(item, !item.UseDefaultValue);
					}*/
				}, {
					groupId: 'default',
					id: 'defvalue',
					label: {key: 'model.administration.defaultValue'},
					type: FieldType.Dynamic,
					overload: () => defaultValueHelper.valueOverload,
					model: 'DefaultValue'
					// TODO: update default value based on selected type?
				}, {
					...BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
					groupId: 'default',
					id: 'defuom',
					model: 'BasUomDefaultFk',
					label: {key: 'model.administration.defaultUoM'}
				}, {
					groupId: 'default',
					id: 'tags',
					label: {key: 'model.administration.propertyKeys.tags'},
					type: FieldType.CustomComponent,
					componentType: PropertyKeyTagSelectorComponent,
					model: 'TagIds'
				}]
			}
			// TODO: disable OK button if !newPropKeySettings.PropertyName || !_.isInteger(newPropKeySettings.ValueTypeFk) (waiting for DEV-15769)
		};

		const dlgResult = await this.formDialogSvc.showDialog(dlgConfig);

		if (dlgResult?.closingButtonId === StandardDialogButtonId.Ok && dlgResult.value) {
			return dlgResult.value;
		}

		return null;
	}

	private readonly httpSvc = inject(PlatformHttpService);

	/**
	 * Displays a dialog box to create a property key and issues the request to the server.
	 *
	 * @param config An optional configuration object for the operation.
	 *
	 * @returns A promise that is resolved to the newly created property key entity,
	 *   or to `null` if the operation is canceled.
	 */
	public async createPropertyKeyWithDialog(config?: IPropertyKeyCreationConfig): Promise<IPropertyKeyEntity | null> {
		const effectiveConfig: IPropertyKeyCreationConfig = {
			fromAdminModule: false,
			selectedTags: [],
			...config
		};

		const request = await this.showDialog(effectiveConfig);

		if (!request) {
			return null;
		}

		const propKey = await this.httpSvc.post<IPropertyKeyEntity>('model/administration/propertykey/createandsave', {
			FromUserModule: !effectiveConfig.fromAdminModule,
			...request
		});

		return propKey ?? null;
	}
}

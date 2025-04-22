/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IConcreteEntitySchemaProperty, ICreateDynamicFieldsSettings, IEntityDataCreationContext, IEntityDynamicCreateDialogService, IEntitySchema, PlatformModuleEntityCreationConfigService } from '@libs/platform/data-access';
import { IFormConfig, ILayoutConfiguration, StandardDialogButtonId, UiCommonFormDialogService } from '@libs/ui/common';
import { UiBusinessBaseEntityFormService } from './ui-business-base-entity-form.service';

/**
 * This service responsible for dynamically creating entity creation dialogs in a container.
 * This service generates the necessary form configuration based on the
 * provided schema, layout, and validation service, and displays the dialog for user input.
 */
@Injectable({
	providedIn: 'root'
})
export class EntityDynamicCreateDialogService<T extends object> implements IEntityDynamicCreateDialogService<T> {

	private formDialogService = inject(UiCommonFormDialogService);
	private formService = inject(UiBusinessBaseEntityFormService);
	private moduleEntityCreateService = inject(PlatformModuleEntityCreationConfigService);

	public async showCreateDialog(context: IEntityDataCreationContext<T>): Promise<T | undefined> {
		const settings = this.moduleEntityCreateService.getEntity() as ICreateDynamicFieldsSettings;

		if (settings) {

			const formConfig = await this.generateFormConfig(settings, context.schema, context.validationService, context.layout);

			const initialEntity: T = this.initializeEntityWithDefaults(context.schema);

			const dialogResult = await this.formDialogService.showDialog({
				formConfiguration: formConfig,
				headerText: `Create ${settings.ClassConfigurations[0].EntityName}`,
				entity: initialEntity,
			});

			// TODO: Ensure OK button is disabled until form validation is satisfied
			// Currently, even if required fields are not filled, the OK button remains enabled.
			// The validation logic needs to be connected properly to disable the OK button
			// when the form is invalid. This might require changes in the formDialogService ?
			// or adjustments in how validation is related to formConfig.

			if (dialogResult?.closingButtonId === StandardDialogButtonId.Ok) {
				return dialogResult.value as T;
			} else {
				return undefined;
			}
		}
		return undefined;
	}

	public async generateFormConfig(settings: ICreateDynamicFieldsSettings, schema: IEntitySchema<T> , validationService: BaseValidationService<T>, layout: ILayoutConfiguration<T>): Promise<IFormConfig<T>> {

		const allowedAttributes = settings.ClassConfigurations[0].ColumnsForCreateDialog.filter(column => column.ShowInWizard === 'true')
			.map(column => column.PropertyName);

		const filteredLayout: ILayoutConfiguration<T> = {
			...layout,
			suppressHistoryGroup: true,
			groups: [
				{
					gid: settings.ClassConfigurations[0].EntityName,
					attributes: layout.groups?.flatMap(group => group.attributes?.filter(attr =>
						allowedAttributes.includes(attr as string)) || []) || []
				}
			]
		};

		return this.formService.generateEntityFormConfig(schema, filteredLayout, validationService);
	}

	private initializeEntityWithDefaults(schema: IEntitySchema<T>): T {
		const entity: Partial<T> = {};

		const entries: [string, IConcreteEntitySchemaProperty][] = Object.entries(schema.properties);
		entries.forEach(([key, property]) => {
			switch (property.domain) {
				default:
					entity[key as keyof T] = null as unknown as T[keyof T];
					break;
			}
		});

		return entity as T;
	}

}
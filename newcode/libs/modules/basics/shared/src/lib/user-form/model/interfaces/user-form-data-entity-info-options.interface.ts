/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntitySchema, IEntitySelection } from '@libs/platform/data-access';
import { CompleteIdentification, IInitializationContext, Translatable } from '@libs/platform/common';
import { IUserFormDataEntity } from '../entities/user-form-data-entity.interface';
import { Rubric } from '../../../model/enums';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedUserFormDataGridBehavior } from '../../behaviors/user-form-data-behavior.service';
import { BasicsSharedUserFormDataService } from '../user-form-data-service.class';
import { BasicsSharedUserFormDataValidationService } from '../user-form-data-validation-service.class';

/**
 *
 */
export interface IUserFormDataWizardConfig {
	moduleName: string;
	uuid: string;
}

/**
 *
 */
export interface IUserFormDataServiceInitializeOptions<PT extends object> {
	rubric: Rubric;
	parentService: IEntitySelection<PT>;
	isParentReadonly?: (parentService: IEntitySelection<PT>) => boolean;
}

/**
 *
 */
export interface IUserFormDataEntityInfoBehaviorOptions<PT extends object> {
	permissionUuid: string;
	dataService: IEntitySelection<IUserFormDataEntity>;
	parentService: IEntitySelection<PT>;
	isParentAndSelectedReadonly?: () => boolean;
	bulkEditorSupport?: boolean;
	onCreate?: (behavior: BasicsSharedUserFormDataGridBehavior<PT>) => void;
	onDestroy?: (behavior: BasicsSharedUserFormDataGridBehavior<PT>) => void;
}

/**
 * Provide the option to create the entity info instance.
 */
export interface IUserFormDataEntityInfoOptions<PT extends object, PU extends CompleteIdentification<PT>> {
	/**
	 * Rubric info.
	 */
	rubric: Rubric;

	/**
	 * The container permission uuid
	 */
	permissionUuid: string;

	/**
	 * The container uuid, if it is the same as permissionUuid can be ignored.
	 */
	containerUuid?: string;

	/**
	 * Represents detail form uuid, if specified the form container will be shown.
	 */
	detailUuid?: string;

	/**
	 * Grid title translation
	 */
	gridTitle?: Translatable;

	/**
	 * Represents detail form title, if specified the form container will be shown.
	 */
	detailTitle?: Translatable;

	/**
	 * Specified whether the entity data status can be changed via wizard or not.
	 */
	disabledChangeStatusViaWizard?: boolean;

	/**
	 * If not specified, using the default wizard uuid '756badc830b74fdcbf6b6ddc3f92f7bd'
	 */
	statusChangeWizardUuid?: string;

	/**
	 * Represents a function to provided parent service.
	 * @param context
	 */
	parentServiceFn: (context: IInitializationContext) => IEntitySelection<PT>;

	/**
	 * Represents a function to provided custom validation service.
	 * @param context
	 */
	validationServiceFn?: (context: IInitializationContext) => BasicsSharedUserFormDataValidationService<PT, PU>;

	/**
	 * Parent service readonly state access provide function.
	 * @param parentService
	 * @param context
	 */
	isParentReadonly?: (parentService: IEntitySelection<PT>, context: IInitializationContext) => boolean;

	/**
	 * Represents a function to provided custom layout configuration.
	 * @param layout
	 * @param context
	 */
	layoutConfigurationFn?: (layout: ILayoutConfiguration<IUserFormDataEntity>, context: IInitializationContext) => ILayoutConfiguration<IUserFormDataEntity>;

	/**
	 * Represents a callback of behavior when created.
	 * @param containerLink
	 */
	onBehaviorCreate?: (behavior: BasicsSharedUserFormDataGridBehavior<PT>) => void;

	/**
	 * Represents a callback of behavior when destroyed.
	 * @param containerLink
	 */
	onBehaviorDestroy?: (behavior: BasicsSharedUserFormDataGridBehavior<PT>) => void;

	/**
	 * Indicates whether support bulk editor.
	 */
	bulkEditorSupport?: boolean;

	/**
	 * Represents a function to provides custom entity schema.
	 * @param schema
	 */
	entitySchemaFn?: (schema: IEntitySchema<IUserFormDataEntity>) => IEntitySchema<IUserFormDataEntity>;

	/**
	 * Represents a function to provides custom data service.
	 * @param context
	 */
	dataServiceFn?: (context: IInitializationContext) => BasicsSharedUserFormDataService<PT, PU>;
}
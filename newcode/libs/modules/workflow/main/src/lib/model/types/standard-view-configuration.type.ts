/*
 * Copyright(c) RIB Software GmbH
 */

import { FormRow, IFormConfig } from '@libs/ui/common';
import { ParameterType } from '../enum/action-editors/parameter-type.enum';
import { StandardViewFieldType } from '../enum/action-editors/standard-view-field-type.enum';
import { IBaseColumn } from '../../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';
import { IGridViewProperties } from '../interfaces/action-editor/grid-view-properties.interface';
import { IWorkflowAction } from '@libs/workflow/interfaces';

/**
 * Base type for standard view
 */
type StandardViewBase<ParentEntity extends object> = {

	/**
	 * Key property of action
	 * For workflow action editor please use the key value of action parameter.
	 * `actionParamKey`
	 */
	formRowId: string;

	/**
	 * Specifies the group in which the editor view component has to be added.
	 * For workflow action editor please use the enum `ParameterType` to specify if parameter exists in the input/output array of workflow action.
	 */
	formGroupId?: ParentEntity extends IWorkflowAction ? ParameterType : string;

	/**
	 * Specifies the type of field in standard view.
	 * Can either be `Grid` or `DomainControl`
	 */
	standardViewFieldType: StandardViewFieldType;

	/**
	 * Form configuration for expert mode, script domain control will be provided as default value if not specified..
	 */
	expertViewFormConfig?: IFormConfig<ParentEntity>;
}

/**
 * Custom type used to make one level of nesting optional
 */
type NestedPartial<T> = {
	[P in keyof T]?: NestedPartialLevel1<T[P]> | undefined ;
}

type NestedPartialLevel1<T> = {
	[P in keyof T]?: T[P] | undefined
}

/**
 * Standard view grid configuration type.
 */
export type StandardViewGridConfig<Entity extends object, ParentEntity extends object, ColumnDef extends IBaseColumn> = StandardViewBase<ParentEntity> &
{
	standardViewFieldType: StandardViewFieldType.Grid,

	/**
	 * Label of the grid
	 */
	label: string,

	/**
	 * The model path against which the grid/domain control will be bound against.
	 */
	model: string;

	/**
	 * Entity for the grid.
	 */
	entity: Entity;
} & NestedPartial<IGridViewProperties<Entity, ColumnDef>>;

/**
 * Standard view domain control configuration type.
 */
export type StandardViewDomainConfig<ParentEntity extends object> = StandardViewBase<ParentEntity> & { standardViewFieldType: StandardViewFieldType.DomainControl, row: FormRow<ParentEntity> };

/**
 * Standard view generic configuration type.
 */
export type StandardViewConfig<Entity extends object, ParentEntity extends object, ColumnDef extends IBaseColumn = IBaseColumn> = StandardViewGridConfig<Entity, ParentEntity, ColumnDef> | StandardViewDomainConfig<ParentEntity>;
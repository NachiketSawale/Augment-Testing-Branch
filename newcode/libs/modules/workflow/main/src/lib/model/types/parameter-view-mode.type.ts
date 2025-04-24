/*
 * Copyright(c) RIB Software GmbH
 */

import { IGridView } from '../interfaces/action-editor/grid-view-properties.interface';
import { IDomainControlView } from '../interfaces/action-editor/domain-control-view-properties.interface';
import { IBaseColumn } from '../../components/action-editors/standard-view-components/parameter-grid-view/parameter-grid-view.component';

/**
 * Configuration required to load custom parameter editor.
 */
export type ParameterView<Entity extends object, ColumnDef extends IBaseColumn, ParentEntity extends object = object> = IGridView<Entity, ColumnDef, ParentEntity> | IDomainControlView<Entity, ParentEntity>;
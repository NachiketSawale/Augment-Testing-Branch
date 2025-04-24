/*
 * Copyright(c) RIB Software GmbH
 */

import { ConcreteField } from '../../model/fields/concrete-field.type';
import { IAdditionalColumnProperties } from './additional-column-properties.interface';

/**
 * Column definition based on ConcreteField and IAdditionalColumnProperties
 */
export type ColumnDef<T extends object> = ConcreteField<T> & IAdditionalColumnProperties

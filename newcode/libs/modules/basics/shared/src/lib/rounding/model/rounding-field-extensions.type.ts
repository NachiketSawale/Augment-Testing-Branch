/*
 * Copyright(c) RIB Software GmbH
 */

import { ColumnDef, FieldOverloadSpec, TransientFieldSpec } from '@libs/ui/common';

export type RoundingFieldOverloadSpec<T extends object> = FieldOverloadSpec<T> & { roundingField: string };

export type RoundingTransientFieldSpec<T extends object> = TransientFieldSpec<T> & { roundingField: string };

export type RoundingColumnDef<T extends object> = ColumnDef<T> & { roundingField: string };

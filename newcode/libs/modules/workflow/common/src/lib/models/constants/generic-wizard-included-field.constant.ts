/*
 * Copyright(c) RIB Software GmbH
 */

import { FieldType } from '@libs/ui/common';

/**
 * Field that is used to select items in generic wizard grids.
 */
export const INCLUDED_FIELD = {
    id: 'isIncluded',
    model: 'isIncluded',
    type: FieldType.Boolean,
    sortOrder: 0,
    label: { text: 'Is Included?', key: 'platform.wizard.isIncluded' },
    pinned: true
};
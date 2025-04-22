/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { IField } from '../model/fields/field.interface';

/**
 * Provides utility routines for working with fields.
 *
 * @group Fields API
 */
@Injectable({
  providedIn: 'root'
})
export class UiFieldHelperService {

  /**
   * Initializes a new instance.
   */
  public constructor() { }

  /**
   * Sorts fields according to their sort order values, if any.
   * @param fields The fields to sort.
   * @returns The sorted array of fields. Fields with an explicit sort order value will be listed first, before the others.
   */
  public sortFields<T extends object, TField extends IField<T>>(fields: TField[]): TField[] {
    const fieldsWithOrderValue = fields.filter(f => typeof f.sortOrder === 'number');
    const fieldsWithoutOrderValue = fields.filter(f => typeof f.sortOrder !== 'number');

    // This array contains only fields with an explicit sort order value.
    const sortedFields = fieldsWithOrderValue.sort((a, b) => a.sortOrder! - b.sortOrder!);

    return sortedFields.concat(...fieldsWithoutOrderValue);
  }
}

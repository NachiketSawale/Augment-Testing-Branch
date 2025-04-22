import { TestBed } from '@angular/core/testing';

import { UiFieldHelperService } from './ui-field-helper.service';
import { IField } from '../model/fields/field.interface';
import { FieldType } from '../model/fields/field-type.enum';

describe('UiFieldHelperService', () => {
  let service: UiFieldHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UiFieldHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sort explicitly ordered fields', () => {
    const fields: IField<object>[] = [{
      id: 'a',
      type: FieldType.Integer,
      sortOrder: 3
    }, {
      id: 'b',
      type: FieldType.Color,
      sortOrder: 8
    }, {
      id: 'c',
      type: FieldType.Code,
      sortOrder: 4
    }];

    const sorted = service.sortFields(fields);
    expect(sorted).toHaveLength(3);
    expect(sorted[0].id).toBe('a');
    expect(sorted[1].id).toBe('c');
    expect(sorted[2].id).toBe('b');
  });

  it('should sort implicitly ordered fields', () => {
    const fields: IField<object>[] = [{
      id: 'x',
      type: FieldType.Integer
    }, {
      id: 'y',
      type: FieldType.Color
    }, {
      id: 'z',
      type: FieldType.Code
    }];

    const sorted = service.sortFields(fields);
    expect(sorted).toHaveLength(3);
    expect(sorted[0].id).toBe('x');
    expect(sorted[1].id).toBe('y');
    expect(sorted[2].id).toBe('z');
  });

  it('should sort mixed sets of fields', () => {
    const fields: IField<object>[] = [{
      id: 'd',
      type: FieldType.Integer
    }, {
      id: 'a',
      type: FieldType.Integer,
      sortOrder: 3
    }, {
      id: 'f',
      type: FieldType.Integer
    }, {
      id: 'e',
      type: FieldType.Integer
    }, {
      id: 'b',
      type: FieldType.Color,
      sortOrder: 8
    }, {
      id: 'c',
      type: FieldType.Code,
      sortOrder: 4
    }];

    const sorted = service.sortFields(fields);
    expect(sorted).toHaveLength(6);
    expect(sorted[0].id).toBe('a');
    expect(sorted[1].id).toBe('c');
    expect(sorted[2].id).toBe('b');
    expect(sorted[3].id).toBe('d');
    expect(sorted[4].id).toBe('f');
    expect(sorted[5].id).toBe('e');
  });

  it('should sort empty sets of fields', () => {
    const sorted = service.sortFields([]);
    expect(sorted).toHaveLength(0);
  });
});

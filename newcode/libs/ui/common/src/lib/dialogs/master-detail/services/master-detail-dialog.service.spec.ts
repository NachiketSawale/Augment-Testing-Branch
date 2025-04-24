/*
 * Copyright(c) RIB Software GmbH
 */

import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { PlatformTranslateService } from '@libs/platform/common';
import { UiCommonMasterDetailDialogService } from './master-detail-dialog.service';
import { UiCommonDialogService } from '../../base/services/dialog.service';

import { FieldType } from '../../../model/fields/field-type.enum';

import { IMasterDetailItem } from '../model/master-detail-item.interface';
import { IMasterDetailDialogOptions } from '../model/master-detail-dialog-options.interface';


interface IDynamicFirstMasterItemFormTestEntity {
  myText: string;
  isGood?: boolean;
  money?: number;
}

interface IDynamicSecondMasterItemFormTestEntity {
  name?: string;
  age?: number;
  isOld?: boolean;
  isValid?: boolean;
}

interface IAdditionalEntry {
  moneyValue?: number;
  isOver?: boolean;
  dummyText?: string;
}

type IDynamicDialogData = IDynamicFirstMasterItemFormTestEntity | IDynamicSecondMasterItemFormTestEntity | IAdditionalEntry;

describe('UiCommonMasterDetailDialogService', () => {
  let service: UiCommonMasterDetailDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, HttpClientModule],
      providers: [UiCommonDialogService, HttpClient, PlatformTranslateService]
    });
    service = TestBed.inject(UiCommonMasterDetailDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call show', () => {
    const data: IMasterDetailDialogOptions<IDynamicDialogData> = {
      backdrop: 'static',
      height: '90%',
      headerText: 'cloud.desktop.sdSettingsHeader',
      width: '830px',
      windowClass: 'app-settings',
      editing: {
        add: (items: IMasterDetailItem<IDynamicDialogData>[]) => {
          //TODO: Implementation is Mocked
          const item: IMasterDetailItem<IDynamicDialogData> = {
            name: 'UI System',
            visible: true,
            form: {
              formId: 'displaySettingsSystem',
              showGrouping: true,
              groups: [
                {
                  groupId: 'dataconfig',
                  header: { text: 'DataConfig', key: 'cloud.desktop.design.dataconfig' },
                },
                {
                  groupId: 'personaldata',
                  header: { text: 'PersonalData', key: 'cloud.desktop.design.personaldata' },
                },
              ],
              rows: [
                {
                  groupId: 'dataconfig',
                  id: 'dummyText',
                  label: {
                    text: 'Dummy Text',
                  },
                  type: FieldType.Description,
                  model: 'dummyText',
                  sortOrder: 2,
                  required: true,
                },
                {
                  groupId: 'dataconfig',
                  id: 'isOver',
                  label: {
                    text: 'It is Over',
                  },
                  type: FieldType.Boolean,
                  model: 'isOver',
                  sortOrder: 5,
                },
                {
                  groupId: 'personaldata',
                  id: 'moneyValue',
                  label: {
                    text: 'Please transfer Money',
                  },
                  type: FieldType.Money,
                  minValue: 10,
                  model: 'moneyValue',
                  sortOrder: 7,
                },
              ],
            },
          };
          items.push(item as IMasterDetailItem<IDynamicDialogData>);
          return item;
        },
        delete: (items: IMasterDetailItem<IDynamicDialogData>[], deleteItem: IMasterDetailItem<IDynamicDialogData>) => {
          //TODO: Implementation is Mocked
          const delIdx = items.indexOf(deleteItem);
          items.splice(delIdx, 1);
          return true;
        },
        addText: 'Add',
        deleteText: 'Delete',
      },
      items: [
        {
          cssClass: 'title',
          disabled: true,
          name: 'System Settings',
          visible: true,
        },
        {
          name: 'UI Branding (System)',
          visible: true,
          form: {
            formId: 'displaySettingsSystem',
            showGrouping: true,
            groups: [
              {
                groupId: 'config',
                header: { text: 'Config', key: 'cloud.desktop.design.config' },
              },
              {
                groupId: 'personal',
                header: { text: 'Personal', key: 'cloud.desktop.design.personal' },
              },
            ],
            rows: [
              {
                groupId: 'config',
                id: 'isoCode1',
                label: {
                  text: 'Iso Code 1',
                },
                type: FieldType.Description,
                model: 'myText',
                sortOrder: 2,
                required: true,
              },
              {
                groupId: 'config',
                id: 'isGood',
                label: {
                  text: 'It is good',
                },
                type: FieldType.Boolean,
                model: 'isGood',
                sortOrder: 5,
              },
              {
                groupId: 'personal',
                id: 'money',
                label: {
                  text: 'Please transfer immediately',
                },
                type: FieldType.Money,
                minValue: 10,
                model: 'money',
                sortOrder: 7,
              },
            ],
          },
        },
        {
          name: 'Layout Settings',
          visible: true,
          form: {
            formId: 'layoutSettings',
            showGrouping: true,
            groups: [
              {
                groupId: 'pages',
                header: { text: 'Config', key: 'cloud.desktop.design.pages' },
              },
              {
                groupId: 'groups',
                header: { text: 'Personal', key: 'cloud.desktop.design.groups' },
              },
            ],
            rows: [
              {
                groupId: 'pages',
                id: 'name',
                label: {
                  text: 'Name',
                },
                type: FieldType.Description,
                model: 'name',
                sortOrder: 1,
                required: true,
              },
              {
                groupId: 'pages',
                id: 'age',
                label: {
                  text: 'Age',
                },
                type: FieldType.Integer,
                minValue: 10,
                model: 'age',
                sortOrder: 2,
                required: true,
              },
              {
                groupId: 'groups',
                id: 'old',
                label: {
                  text: 'Is Old',
                },
                type: FieldType.Boolean,
                model: 'isOld',
                sortOrder: 3,
              },
              {
                groupId: 'groups',
                id: 'isValid',
                label: {
                  text: 'Is Valid',
                },
                type: FieldType.Boolean,
                model: 'isValid',
                sortOrder: 4,
              },
            ],
          },
        },
      ],
    };
    expect(service.showDialog(data));
  });
});

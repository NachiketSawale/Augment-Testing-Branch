/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { IEditorOptions, IVariableList } from '@libs/ui/common';
import { ContainerBaseComponent } from '@libs/ui/container-system';


@Component({
  selector: 'example-topic-one-text-editor-container',
  templateUrl: './text-editor-container.component.html',
  styleUrl: './text-editor-container.component.scss'
})

/**
 * Demo component for text-editor
 */
export class TextEditorContainerComponent extends ContainerBaseComponent {
  /**
   * editor options
   */
  public editorOptions!: IEditorOptions;
  public isEditable: boolean = true;

  public content: string = '<h1 style="text-align: center;"><strong style="color: rgb(50, 22, 152);"><u>Task information</u></strong></h1><p style="text-align: center;"><br></p><p><br></p><table><tbody><tr><td data-row="row-udg7" style="width: 50px; text-align: center;"><strong>Sr No</strong></td><td data-row="row-udg7" style="width: 50px; text-align: center;"><strong>Taks</strong></td><td data-row="row-udg7" style="width: 50px; text-align: center;"><strong>Status</strong></td></tr><tr><td data-row="row-0scg" style="width: 50px; text-align: center;">1</td><td data-row="row-0scg" style="width: 50px; text-align: center;">Dev task 1</td><td data-row="row-0scg" style="width: 50px; text-align: center;"><span class="ql-font-arial-black" style="color: rgb(65, 204, 46);">done</span></td></tr><tr><td data-row="row-2cjg" style="width: 50px; text-align: center;">2</td><td data-row="row-2cjg" style="width: 50px; text-align: center;">Dev task 2</td><td data-row="row-2cjg" style="width: 50px; text-align: center;"><span style="color: rgb(215, 29, 29);">pending</span></td></tr></tbody></table><p><br></p><p><strong style="font-size: 12pt;">Hello Team,</strong></p><p><strong style="font-size: 12pt;"><em>This is demo implementation of quill editor</em></strong></p>';

  /**
   * used to inject platform http service.
   */
  private readonly http = inject(PlatformHttpService);

  public ngOnInit() {
    this.editorOptions = {
      language: {
        current: {
          'Id': 1,
          'DescriptionInfo': {
            'Description': 'English',
            'DescriptionTr': 3,
            'DescriptionModified': false,
            'Translated': 'English',
            'VersionTr': 0,
            'Modified': false,
            'OtherLanguages': null
          },
          'Culture': 'en',
          'Sorting': 10,
          'IsDefault': true,
          'Islive': true,
          'InsertedAt': new Date('2015-05-01T00:00:00Z'),
          'InsertedBy': 1,
          'UpdatedAt': new Date('2022-02-03T09:52:31.83Z'),
          'UpdatedBy': 1696,
          'Version': 11,
          'CodeFinance': '',
        },
        editable: true,
        visible: true,
        list: [
          {
            'Id': 1,
            'DescriptionInfo': {
              'Description': 'English',
              'DescriptionTr': 3,
              'DescriptionModified': false,
              'Translated': 'English',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'en',
            'Sorting': 10,
            'IsDefault': true,
            'Islive': true,
            'InsertedAt': new Date('2015-05-01T00:00:00Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2022-02-03T09:52:31.83Z'),
            'UpdatedBy': 1696,
            'Version': 11,
            'CodeFinance': '',

          },
          {
            'Id': 6,
            'DescriptionInfo': {
              'Description': 'English (US)',
              'DescriptionTr': 10860,
              'DescriptionModified': false,
              'Translated': 'English (US)',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'en-us',
            'Sorting': 10,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2016-11-25T00:00:00Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2024-04-03T09:37:21.427Z'),
            'UpdatedBy': 3581,
            'Version': 12,
            'CodeFinance': '',
          },
          {
            'Id': 2,
            'DescriptionInfo': {
              'Description': 'Deutsch',
              'DescriptionTr': 4,
              'DescriptionModified': false,
              'Translated': 'Deutsch',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'de',
            'Sorting': 20,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2015-05-01T00:00:00Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2022-02-03T09:52:31.98Z'),
            'UpdatedBy': 2115,
            'Version': 11,
            'CodeFinance': 'CODEFIN-DE',

          },
          {
            'Id': 24,
            'DescriptionInfo': {
              'Description': 'German (Swiss)',
              'DescriptionTr': 47447,
              'DescriptionModified': false,
              'Translated': 'German (Swiss)',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'de-ch',
            'Sorting': 20,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2022-01-24T10:21:50.767Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 6,
            'CodeFinance': '',
          },
          {
            'Id': 3,
            'DescriptionInfo': {
              'Description': 'Suomi',
              'DescriptionTr': 5,
              'DescriptionModified': false,
              'Translated': 'Suomi',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'fi',
            'Sorting': 30,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2015-05-01T00:00:00Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 14,
            'CodeFinance': '',

          },
          {
            'Id': 4,
            'DescriptionInfo': {
              'Description': 'Русский',
              'DescriptionTr': 6,
              'DescriptionModified': false,
              'Translated': 'Русский',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'ru',
            'Sorting': 40,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2015-05-01T00:00:00Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 15,
            'CodeFinance': '',

          },
          {
            'Id': 5,
            'DescriptionInfo': {
              'Description': 'Chinese',
              'DescriptionTr': 7,
              'DescriptionModified': false,
              'Translated': 'Chinese',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'zh',
            'Sorting': 50,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2015-05-01T00:00:00Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2024-01-11T10:18:56.09Z'),
            'UpdatedBy': 1536,
            'Version': 12,
            'CodeFinance': '',

          },
          {
            'Id': 23,
            'DescriptionInfo': {
              'Description': 'Chinese (Traditional)',
              'DescriptionTr': 47286,
              'DescriptionModified': false,
              'Translated': 'Chinese (Traditional)',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'zh-hant',
            'Sorting': 50,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-10-26T08:17:24.2Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',
          },
          {
            'Id': 7,
            'DescriptionInfo': {
              'Description': 'Français',
              'DescriptionTr': 10861,
              'DescriptionModified': false,
              'Translated': 'Français',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'fr',
            'Sorting': 70,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2016-11-25T00:00:00Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-04-26T07:17:23.933Z'),
            'UpdatedBy': 1928,
            'Version': 10,
            'CodeFinance': '',

          },
          {
            'Id': 25,
            'DescriptionInfo': {
              'Description': 'French (Swiss)',
              'DescriptionTr': 47566,
              'DescriptionModified': false,
              'Translated': 'French (Swiss)',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'fr-ch',
            'Sorting': 70,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2022-02-14T16:38:43.22Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 8,
            'DescriptionInfo': {
              'Description': 'Español',
              'DescriptionTr': 10862,
              'DescriptionModified': false,
              'Translated': 'Español',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'es',
            'Sorting': 80,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2016-11-25T00:00:00Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-04-26T07:17:23.933Z'),
            'UpdatedBy': 1928,
            'Version': 9,
            'CodeFinance': '',

          },
          {
            'Id': 9,
            'DescriptionInfo': {
              'Description': 'Dutch',
              'DescriptionTr': 41,
              'DescriptionModified': false,
              'Translated': 'Dutch',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'nl',
            'Sorting': 90,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2017-06-13T14:48:14.01Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-04-26T07:17:23.933Z'),
            'UpdatedBy': 1928,
            'Version': 11,
            'CodeFinance': '',

          },
          {
            'Id': 10,
            'DescriptionInfo': {
              'Description': 'Italiano',
              'DescriptionTr': 42078,
              'DescriptionModified': false,
              'Translated': 'Italiano',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'it',
            'Sorting': 100,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2019-06-28T16:59:56.427Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 14,
            'CodeFinance': '',

          },
          {
            'Id': 26,
            'DescriptionInfo': {
              'Description': 'Italian (Swiss)',
              'DescriptionTr': 47567,
              'DescriptionModified': false,
              'Translated': 'Italian (Swiss)',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'it-ch',
            'Sorting': 100,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2022-02-14T16:38:43.263Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': ''
          },
          {
            'Id': 11,
            'DescriptionInfo': {
              'Description': 'Czech',
              'DescriptionTr': 44773,
              'DescriptionModified': false,
              'Translated': 'Czech',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'cs',
            'Sorting': 110,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2020-06-15T12:00:09.823Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 9,
            'CodeFinance': '',

          },
          {
            'Id': 12,
            'DescriptionInfo': {
              'Description': 'Polish',
              'DescriptionTr': 44774,
              'DescriptionModified': false,
              'Translated': 'Polish',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'pl',
            'Sorting': 120,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2020-06-15T12:00:09.823Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 8,
            'CodeFinance': '',

          },
          {
            'Id': 13,
            'DescriptionInfo': {
              'Description': 'Swedish',
              'DescriptionTr': 44775,
              'DescriptionModified': false,
              'Translated': 'Swedish',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'sv',
            'Sorting': 130,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2020-06-15T12:00:09.823Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 8,
            'CodeFinance': '',

          },
          {
            'Id': 14,
            'DescriptionInfo': {
              'Description': 'Norwegian',
              'DescriptionTr': 44776,
              'DescriptionModified': false,
              'Translated': 'Norwegian',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'nb',
            'Sorting': 140,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2020-06-15T12:00:09.823Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 8,
            'CodeFinance': '',

          },
          {
            'Id': 15,
            'DescriptionInfo': {
              'Description': 'Lithuanian',
              'DescriptionTr': 46502,
              'DescriptionModified': false,
              'Translated': 'Lithuanian',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'lt',
            'Sorting': 150,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-03-16T10:05:44.503Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 16,
            'DescriptionInfo': {
              'Description': 'Japanese',
              'DescriptionTr': 46861,
              'DescriptionModified': false,
              'Translated': 'Japanese',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'ja',
            'Sorting': 160,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-06-17T08:21:31.21Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 17,
            'DescriptionInfo': {
              'Description': 'Portuguese',
              'DescriptionTr': 46862,
              'DescriptionModified': false,
              'Translated': 'Portuguese',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'pt',
            'Sorting': 170,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-06-17T08:21:31.56Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 18,
            'DescriptionInfo': {
              'Description': 'Danish',
              'DescriptionTr': 46863,
              'DescriptionModified': false,
              'Translated': 'Danish',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'da',
            'Sorting': 180,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-06-17T08:21:31.87Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 19,
            'DescriptionInfo': {
              'Description': 'Korean',
              'DescriptionTr': 47017,
              'DescriptionModified': false,
              'Translated': 'Korean',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'ko',
            'Sorting': 190,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-07-30T06:52:38.867Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 20,
            'DescriptionInfo': {
              'Description': 'Vietnamese',
              'DescriptionTr': 47018,
              'DescriptionModified': false,
              'Translated': 'Vietnamese',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'vi',
            'Sorting': 200,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-07-30T06:52:39.15Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 21,
            'DescriptionInfo': {
              'Description': 'Thai',
              'DescriptionTr': 47019,
              'DescriptionModified': false,
              'Translated': 'Thai',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'th',
            'Sorting': 210,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-07-30T06:52:39.447Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 22,
            'DescriptionInfo': {
              'Description': 'Indonesian',
              'DescriptionTr': 47020,
              'DescriptionModified': false,
              'Translated': 'Indonesian',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'id',
            'Sorting': 220,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2021-07-30T06:52:39.713Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 7,
            'CodeFinance': '',

          },
          {
            'Id': 27,
            'DescriptionInfo': {
              'Description': 'Romanian',
              'DescriptionTr': 48432,
              'DescriptionModified': false,
              'Translated': 'Romanian',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'ro',
            'Sorting': 230,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2022-10-07T07:40:28.12Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 9,
            'CodeFinance': '',

          },
          {
            'Id': 28,
            'DescriptionInfo': {
              'Description': 'Hungarian',
              'DescriptionTr': 0,
              'DescriptionModified': false,
              'Translated': 'Hungarian',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'hu',
            'Sorting': 240,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2023-01-25T16:57:10.017Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 6,
            'CodeFinance': '',

          },
          {
            'Id': 29,
            'DescriptionInfo': {
              'Description': 'Slovak',
              'DescriptionTr': 49158,
              'DescriptionModified': false,
              'Translated': 'Slovak',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'sk',
            'Sorting': 250,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2023-02-08T11:05:16.733Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-06-20T01:26:18.43Z'),
            'UpdatedBy': 3254,
            'Version': 6,
            'CodeFinance': '',

          },
          {
            'Id': 30,
            'DescriptionInfo': {
              'Description': 'Flemish',
              'DescriptionTr': 0,
              'DescriptionModified': false,
              'Translated': 'Flemish',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Culture': 'nl-be',
            'Sorting': 260,
            'IsDefault': false,
            'Islive': true,
            'InsertedAt': new Date('2023-05-03T09:36:37.44Z'),
            'InsertedBy': 1,
            'UpdatedAt': new Date('2023-09-18T08:44:42.897Z'),
            'UpdatedBy': 3581,
            'Version': 5,
            'CodeFinance': '',
          }
        ],
        onChanged: (languageId) => {
          this.onLanguageChange(languageId);
        }
      },
      variable: {
        current: null,
        visible: true,
        list: [
          {
            'Id': 1,
            'Code': '<<TodaysDate>>',
            'DescriptionInfo': {
              'Description': 'Todays Date',
              'DescriptionTr': 46056,
              'DescriptionModified': false,
              'Translated': 'Todays Date',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': 0,
            'UpdatedAt': new Date(),
            'Version': 1
          },
          {
            'Id': 2,
            'Code': '<<ClerkFamilyName>>',
            'DescriptionInfo': {
              'Description': 'Sender Family Name',
              'DescriptionTr': 46057,
              'DescriptionModified': false,
              'Translated': 'Sender Family Name',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 3,
            'Code': '<<ClerkFirstName>>',
            'DescriptionInfo': {
              'Description': 'Sender First Name',
              'DescriptionTr': 46058,
              'DescriptionModified': false,
              'Translated': 'Sender First Name',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 4,
            'Code': '<<ClerkDescription>>',
            'DescriptionInfo': {
              'Description': 'Sender Description',
              'DescriptionTr': 46059,
              'DescriptionModified': false,
              'Translated': 'Sender Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 5,
            'Code': '<<ClerkCode>>',
            'DescriptionInfo': {
              'Description': 'Sender Code',
              'DescriptionTr': 46060,
              'DescriptionModified': false,
              'Translated': 'Sender Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 6,
            'Code': '<<ClerkSignature>>',
            'DescriptionInfo': {
              'Description': 'Sender Signature',
              'DescriptionTr': 46061,
              'DescriptionModified': false,
              'Translated': 'Sender Signature',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 7,
            'Code': '<<ClerkEMailAddress>>',
            'DescriptionInfo': {
              'Description': 'Sender Email Address',
              'DescriptionTr': 46062,
              'DescriptionModified': false,
              'Translated': 'Sender Email Address',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 8,
            'Code': '<<ClerkTelephoneNumber>>',
            'DescriptionInfo': {
              'Description': 'Sender Telephone Number',
              'DescriptionTr': 46063,
              'DescriptionModified': false,
              'Translated': 'Sender Telephone Number',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 9,
            'Code': '<<ClerkTelephoneNumberMobile>>',
            'DescriptionInfo': {
              'Description': 'Sender Mobil Number',
              'DescriptionTr': 46064,
              'DescriptionModified': false,
              'Translated': 'Sender Mobil Number',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 10,
            'Code': '<<ClerkCompanyDescription>>',
            'DescriptionInfo': {
              'Description': 'Sender Company Description',
              'DescriptionTr': 46065,
              'DescriptionModified': false,
              'Translated': 'Sender Company Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 11,
            'Code': '<<ClerkCompanyCode>>',
            'DescriptionInfo': {
              'Description': 'Sender Company Code',
              'DescriptionTr': 46066,
              'DescriptionModified': false,
              'Translated': 'Sender Company Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 12,
            'Code': '<<ProjectNo>>',
            'DescriptionInfo': {
              'Description': 'Project No.',
              'DescriptionTr': 46067,
              'DescriptionModified': false,
              'Translated': 'Project No.',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 13,
            'Code': '<<ProjectName>>',
            'DescriptionInfo': {
              'Description': 'Project Name',
              'DescriptionTr': 46068,
              'DescriptionModified': false,
              'Translated': 'Project Name',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 14,
            'Code': '<<ProjectName2>>',
            'DescriptionInfo': {
              'Description': 'Project Name 2',
              'DescriptionTr': 46069,
              'DescriptionModified': false,
              'Translated': 'Project Name 2',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 15,
            'Code': '<<ProjectAddress>>',
            'DescriptionInfo': {
              'Description': 'Project Adress',
              'DescriptionTr': 46070,
              'DescriptionModified': false,
              'Translated': 'Project Adress',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 16,
            'Code': '<<CallOffNo>>',
            'DescriptionInfo': {
              'Description': 'Call Off No.',
              'DescriptionTr': 46071,
              'DescriptionModified': false,
              'Translated': 'Call Off No.',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 17,
            'Code': '<<CallOffDate>>',
            'DescriptionInfo': {
              'Description': 'Call Off Date',
              'DescriptionTr': 46072,
              'DescriptionModified': false,
              'Translated': 'Call Off Date',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 18,
            'Code': '<<BidNo>>',
            'DescriptionInfo': {
              'Description': 'Bid Code',
              'DescriptionTr': 46073,
              'DescriptionModified': false,
              'Translated': 'Bid Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 19,
            'Code': '<<BidDescription>>',
            'DescriptionInfo': {
              'Description': 'Bid Description',
              'DescriptionTr': 46074,
              'DescriptionModified': false,
              'Translated': 'Bid Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 20,
            'Code': '<<QuoteDate>>',
            'DescriptionInfo': {
              'Description': 'Quote Date',
              'DescriptionTr': 46075,
              'DescriptionModified': false,
              'Translated': 'Quote Date',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 21,
            'Code': '<<OrderCode>>',
            'DescriptionInfo': {
              'Description': 'Order Code',
              'DescriptionTr': 46076,
              'DescriptionModified': false,
              'Translated': 'Order Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 22,
            'Code': '<<OrderDescription>>',
            'DescriptionInfo': {
              'Description': 'Order Description',
              'DescriptionTr': 46077,
              'DescriptionModified': false,
              'Translated': 'Order Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 23,
            'Code': '<<OrderDate>>',
            'DescriptionInfo': {
              'Description': 'Order Date',
              'DescriptionTr': 46078,
              'DescriptionModified': false,
              'Translated': 'Order Date',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 24,
            'Code': '<<OrderCodeCustomer>>',
            'DescriptionInfo': {
              'Description': 'Order Code Customer',
              'DescriptionTr': 46079,
              'DescriptionModified': false,
              'Translated': 'Order Code Customer',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 25,
            'Code': '<<WIPCode>>',
            'DescriptionInfo': {
              'Description': 'Wip Code',
              'DescriptionTr': 46080,
              'DescriptionModified': false,
              'Translated': 'Wip Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 26,
            'Code': '<<WIPDescription>>',
            'DescriptionInfo': {
              'Description': 'WIP Description',
              'DescriptionTr': 46081,
              'DescriptionModified': false,
              'Translated': 'WIP Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 27,
            'Code': '<<WIPDocDate>>',
            'DescriptionInfo': {
              'Description': 'WIP Date',
              'DescriptionTr': 46082,
              'DescriptionModified': false,
              'Translated': 'WIP Date',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 28,
            'Code': '<<BillNo>>',
            'DescriptionInfo': {
              'Description': 'Bill No.',
              'DescriptionTr': 46083,
              'DescriptionModified': false,
              'Translated': 'Bill No.',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 29,
            'Code': '<<BillDescription>>',
            'DescriptionInfo': {
              'Description': 'Bill Description',
              'DescriptionTr': 46084,
              'DescriptionModified': false,
              'Translated': 'Bill Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 30,
            'Code': '<<BillDate>>',
            'DescriptionInfo': {
              'Description': 'Bill Date',
              'DescriptionTr': 46085,
              'DescriptionModified': false,
              'Translated': 'Bill Date',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 31,
            'Code': '<<PackageCode>>',
            'DescriptionInfo': {
              'Description': 'Package Code',
              'DescriptionTr': 46086,
              'DescriptionModified': false,
              'Translated': 'Package Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 32,
            'Code': '<<PackageDescription>>',
            'DescriptionInfo': {
              'Description': 'Package Description',
              'DescriptionTr': 46087,
              'DescriptionModified': false,
              'Translated': 'Package Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 33,
            'Code': '<<PackageStructureCode>>',
            'DescriptionInfo': {
              'Description': 'Package Prc Structure Code',
              'DescriptionTr': 46088,
              'DescriptionModified': false,
              'Translated': 'Package Prc Structure Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 34,
            'Code': '<<PackageStructureDescription>>',
            'DescriptionInfo': {
              'Description': 'Package Prc Structure Description',
              'DescriptionTr': 46089,
              'DescriptionModified': false,
              'Translated': 'Package Prc Structure Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 35,
            'Code': '<<RequisitionCode>>',
            'DescriptionInfo': {
              'Description': 'Requisition Code',
              'DescriptionTr': 46090,
              'DescriptionModified': false,
              'Translated': 'Requisition Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 36,
            'Code': '<<RequisitionDescription>>',
            'DescriptionInfo': {
              'Description': 'Requisition Description',
              'DescriptionTr': 46091,
              'DescriptionModified': false,
              'Translated': 'Requisition Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 37,
            'Code': '<<RequisitionStructureCode>>',
            'DescriptionInfo': {
              'Description': 'Requisition Prc Structure Code',
              'DescriptionTr': 46092,
              'DescriptionModified': false,
              'Translated': 'Requisition Prc Structure Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 38,
            'Code': '<<RequisitionStructureDescription>>',
            'DescriptionInfo': {
              'Description': 'Requisition Prc Structure Description',
              'DescriptionTr': 46093,
              'DescriptionModified': false,
              'Translated': 'Requisition Prc Structure Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 39,
            'Code': '<<RfQCode>>',
            'DescriptionInfo': {
              'Description': 'Rfq Code',
              'DescriptionTr': 46094,
              'DescriptionModified': false,
              'Translated': 'Rfq Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 40,
            'Code': '<<RfQDescription>>',
            'DescriptionInfo': {
              'Description': 'RfQ Description',
              'DescriptionTr': 46095,
              'DescriptionModified': false,
              'Translated': 'RfQ Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 41,
            'Code': '<<QuotationCode>>',
            'DescriptionInfo': {
              'Description': 'Quotation Code',
              'DescriptionTr': 46096,
              'DescriptionModified': false,
              'Translated': 'Quotation Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 42,
            'Code': '<<QuotationDescription>>',
            'DescriptionInfo': {
              'Description': 'Quotation Description',
              'DescriptionTr': 46097,
              'DescriptionModified': false,
              'Translated': 'Quotation Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 43,
            'Code': '<<ContractCode>>',
            'DescriptionInfo': {
              'Description': 'Contract Code',
              'DescriptionTr': 46098,
              'DescriptionModified': false,
              'Translated': 'Contract Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 44,
            'Code': '<<ContractDescription>>',
            'DescriptionInfo': {
              'Description': 'Contract Description',
              'DescriptionTr': 46099,
              'DescriptionModified': false,
              'Translated': 'Contract Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 45,
            'Code': '<<ContractStructureCode>>',
            'DescriptionInfo': {
              'Description': 'Contract Prc Structure Code',
              'DescriptionTr': 46100,
              'DescriptionModified': false,
              'Translated': 'Contract Prc Structure Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 46,
            'Code': '<<ContractStructureDescription>>',
            'DescriptionInfo': {
              'Description': 'Contract Prc Structure Description',
              'DescriptionTr': 46101,
              'DescriptionModified': false,
              'Translated': 'Contract Prc Structure Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 47,
            'Code': '<<ContractDateOrdered>>',
            'DescriptionInfo': {
              'Description': 'Contract Date Ordered',
              'DescriptionTr': 46102,
              'DescriptionModified': false,
              'Translated': 'Contract Date Ordered',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 48,
            'Code': '<<PESCode>>',
            'DescriptionInfo': {
              'Description': 'PES Code',
              'DescriptionTr': 46103,
              'DescriptionModified': false,
              'Translated': 'PES Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 49,
            'Code': '<<PESDescription>>',
            'DescriptionInfo': {
              'Description': 'PES Description',
              'DescriptionTr': 46104,
              'DescriptionModified': false,
              'Translated': 'PES Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 50,
            'Code': '<<PESDateDcoument>>',
            'DescriptionInfo': {
              'Description': 'PES Date of Document',
              'DescriptionTr': 46105,
              'DescriptionModified': false,
              'Translated': 'PES Date of Document',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 51,
            'Code': '<<PESDateDelivered>>',
            'DescriptionInfo': {
              'Description': 'PES Date Delivered',
              'DescriptionTr': 46106,
              'DescriptionModified': false,
              'Translated': 'PES Date Delivered',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 52,
            'Code': '<<InvoiceCode>>',
            'DescriptionInfo': {
              'Description': 'Invoice Code',
              'DescriptionTr': 46107,
              'DescriptionModified': false,
              'Translated': 'Invoice Code',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 53,
            'Code': '<<InvoiceDescription>>',
            'DescriptionInfo': {
              'Description': 'Invoice Description',
              'DescriptionTr': 46108,
              'DescriptionModified': false,
              'Translated': 'Invoice Description',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 54,
            'Code': '<<InvoiceReference>>',
            'DescriptionInfo': {
              'Description': 'Invoice Reference',
              'DescriptionTr': 46109,
              'DescriptionModified': false,
              'Translated': 'Invoice Reference',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 55,
            'Code': '<<InvoiceDateInvoiced>>',
            'DescriptionInfo': {
              'Description': 'Invoice Date Invoiced',
              'DescriptionTr': 46110,
              'DescriptionModified': false,
              'Translated': 'Invoice Date Invoiced',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 56,
            'Code': '<<InvoiceDateReceived>>',
            'DescriptionInfo': {
              'Description': 'Invoice Date Received',
              'DescriptionTr': 46111,
              'DescriptionModified': false,
              'Translated': 'Invoice Date Received',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          },
          {
            'Id': 57,
            'Code': '<<InvoiceDatePosted>>',
            'DescriptionInfo': {
              'Description': 'Invoice Date Posted',
              'DescriptionTr': 46112,
              'DescriptionModified': false,
              'Translated': 'Invoice Date Posted',
              'VersionTr': 0,
              'Modified': false,
              'OtherLanguages': null
            },
            'Sorting': 1,
            'IsDefault': false,
            'Islive': true,
            'InsertedBy': 1,
            'InsertedAt': new Date('2020-10-21T12:11:47.03Z'),
            'UpdatedBy': null,
            'UpdatedAt': null,
            'Version': 1
          }
        ]
      }
    };
  }

  /**
   * this is demo function added for checking language dropdown
   * functionality.
   */
  public onLanguageChange(languageId: number | null) {
    this.http.get$('basics/textmodules/text/getvariablelist?languageId=' + languageId).subscribe((data) => {
      const updatedVariableList = data as IVariableList[];
      this.editorOptions = {
        ...this.editorOptions,
        variable: {
          ...this.editorOptions.variable,
          list: [...updatedVariableList]
        }
      };
    });

  }
}


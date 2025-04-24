/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {IDocumentOrphan} from '../model/entities/document-import.interface';
/**
 * document import layout service
 */
@Injectable({
    providedIn: 'root',
})
export class DocumentsImportLayoutService {
    public async generateConfig(): Promise<ILayoutConfiguration<IDocumentOrphan>> {
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'Barcode',
                        'CommentText',
                        'OriginFileName'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('documents.import.', {
                    Barcode: { key: 'entityBarCode', text: 'BarCode'},
                    CommentText: {key: 'entityCommentText', text: 'CommentText'},
                    OriginFileName: {key: 'entityFileArchiveDoc', text: 'Origin File Name'}
                }),
            },
            overloads: {
                OriginFileName: {readonly: true},
            }
        };
    }
}
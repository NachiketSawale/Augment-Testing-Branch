
/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable } from '@angular/core';
import {IDocumentRevisionEntity} from '../../model/entities/document-revision-entity.interface';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {ILayoutConfiguration} from '@libs/ui/common';

/**
 * project document revision layout service
 */
@Injectable({
    providedIn: 'root',
})
export class DocumentProjectShareRevisionLayoutService {
    /**
     * Generate layout config
     */
    public async generateLayout(): Promise<ILayoutConfiguration<IDocumentRevisionEntity>> {
        return {
            groups: [
                {
                    'gid': 'basicData',
                    'title': {
                        'key': 'cloud.common.entityProperties',
                        'text': 'Basic Data'
                    },
                    'attributes': [
                        'Test',
                        'OriginFileName',
                        'BarCode',
                        'Description',
                        'CommentText',
                        'ModelStatus',
                        'Revision',
                        'FileSize'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('documents.project.', {
                    'OriginFileName': {
                        'key': 'entityFileArchiveDoc',
                        'text': 'Origin File Name'
                    },
                    'Test': {
                        'key': 'entityFileArchiveDoc',
                        'text': 'Origin File Name2'
                    },
                    'FileSize': {
                        'key': 'entityFileSize',
                        'text': 'File Size'
                    },//todo: currently can not show the file size
                    'Barcode': {
                        'key': 'entityBarcode',
                        'text': 'Bar Code'
                    },
                    'Revision': {
                        'key': 'Revisions.Revision',
                        'text': 'Revision'
                    },
                    'ModelStatus': {
                        'key': 'modelJobState',
                        'text': 'Model State'
                    }
                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    'Description': {
                        'key': 'entityDescription',
                        'text': 'Description'
                    },
                    'CommentText': {
                        'key': 'entityCommentText',
                        'text': 'Comment'
                    }
                })
            },
            overloads: {
                'OriginFileName': {
                    'readonly': true
                },
                'FileSize': {
                    'readonly': true
                },
                'Revision': {
                    'readonly': true
                }
            }
        };
    }
}
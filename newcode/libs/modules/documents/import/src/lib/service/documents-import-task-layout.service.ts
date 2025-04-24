/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IDocumentImportJob } from '../model/entities/document-import-job.interface';
/**
 * document import task layout service
 */
@Injectable({
	providedIn: 'root',
})
export class DocumentsImportTaskLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IDocumentImportJob>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'Description',
						'XmlName',
						'JobState',
						'StartTime',
						'EndTime',
						'ProgressValue',
						'ErrorMessage'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('documents.import.', {
					Description: { key: 'description', text: 'Description'},
					XmlName: {key: 'xmlName', text: 'Xml Name(s)'},
					JobState: {key: 'importStatus', text: 'Import Status'},
					StartTime: {key: 'startTime', text: 'Start Time'},
					EndTime: {key: 'endTime', text: 'End Time'},
					ProgressValue:{key: 'progressValue', text: 'Progress Value'},
					ErrorMessage:{key: 'errorMessage', text: 'Error Message'}
				}),
			},
			overloads: {
				Description: {readonly: true},
				XmlName: {readonly: true},
				JobState: {readonly: true},
				StartTime: {readonly: true},
				EndTime: {readonly: true},
				ProgressValue: {readonly: true},
				ErrorMessage: {readonly: true},
			}
		};
	}
}
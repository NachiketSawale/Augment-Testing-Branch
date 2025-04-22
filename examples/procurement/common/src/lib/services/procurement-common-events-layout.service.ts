/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
	 BasicsSharedProcurementStructureEventTypeLookupService,
} from '@libs/basics/shared';
import { IProcurementCommonEventsEntity } from '../model/entities/procurement-common-events-entity.interface';
/**
 * events layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonEventsLayoutService {
	public async generateConfig<T extends IProcurementCommonEventsEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'PrcEventTypeFk',
						'StartCalculated',
						'EndCalculated',
						'StartOverwrite',
						'EndOverwrite',
						'StartActual',
						'EndActual',
						'StartRelevant',
						'EndRelevant',
						'CommentText'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('basics.procurementstructure.', {
					PrcEventTypeFk: {key: 'eventType', text: 'Event Type'}
				}),
				...prefixAllTranslationKeys('procurement.package.', {
					StartCalculated: {key: 'event.startCalculated', text: 'Calc. Start'},
					EndCalculated: {key: 'event.endCalculated', text: 'Calc. End'},
					StartOverwrite: {key: 'event.startOverwrite', text: 'Man. Start'},
					EndOverwrite: {key: 'event.endOverwrite', text: 'Man. End'},
					StartActual: {key: 'event.startActual', text: 'Act. Start'},
					EndActual: {key: 'event.endActual', text: 'Act. End'},
					StartRelevant: {key: 'event.startRelevant', text: 'Relevant Start'},
					EndRelevant: {key: 'event.endRelevant', text: 'Relevant End'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {key: 'entityCommentText', text: 'Comment'},
				})
			},
			overloads: {
				PrcEventTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementStructureEventTypeLookupService
					})
				}
			}
		};
	}
}
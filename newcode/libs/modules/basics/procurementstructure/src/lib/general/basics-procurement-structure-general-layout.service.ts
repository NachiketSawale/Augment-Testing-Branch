/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { BasicsSharedGeneralTypeLookupService, BasicsSharedLookupOverloadProvider, } from '@libs/basics/shared';
import { IPrcConfiguration2GeneralsEntity } from '../model/entities/prc-configuration-2-generals-entity.interface';
import { IBasicsCustomizeGeneralTypeEntity } from '@libs/basics/interfaces';

/**
 * Procurement structure general layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsProcurementStructureGeneralLayoutService {

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IPrcConfiguration2GeneralsEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'MdcLedgerContextFk',
						'PrcConfigHeaderFk',
						'PrcGeneralsTypeFk',
						'Value',
						'CommentText'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'PrcGeneralsTypeFk': {
						text: 'Type',
						key: 'entityType'
					},
					'CommentText': {
						text: 'Comment',
						key: 'entityCommentText'
					}
				}),
				...prefixAllTranslationKeys('basics.procurementstructure.', {
					'MdcLedgerContextFk': {
						text: 'Ledger Context',
						key: 'entityLedgerContextFk'
					},
					'PrcConfigHeaderFk': {
						text: 'Configuration Header',
						key: 'configuration'
					},
					'Value': {
						text: 'Value',
						key: 'value'
					}
				}),
			},
			overloads: {
				MdcLedgerContextFk: BasicsSharedLookupOverloadProvider.provideLedgerContextByCompanyLookupOverload(true),
				PrcConfigHeaderFk: BasicsSharedLookupOverloadProvider.provideProcurementConfigurationHeaderLookupOverload(false),
				PrcGeneralsTypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedGeneralTypeLookupService,
						clientSideFilter: {
							execute(item: IBasicsCustomizeGeneralTypeEntity, context: ILookupContext<IBasicsCustomizeGeneralTypeEntity, IPrcConfiguration2GeneralsEntity>): boolean {
								return item.LedgerContextFk === context.entity?.MdcLedgerContextFk;
							}
						}
					})
				}
			}
		};
	}
}
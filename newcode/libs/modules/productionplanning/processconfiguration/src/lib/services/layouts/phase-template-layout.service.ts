/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable } from '@angular/core';
import {
	FieldType,
	ILayoutConfiguration
} from '@libs/ui/common';
import { PhaseTemplateEntity } from '../../model/phase-template-entity.class';
import {
	BasicsSharedLookupOverloadProvider
} from '@libs/basics/shared';

import { DATESHIFT_MODES_TOKEN } from '@libs/productionplanning/shared';

import { createFormDialogLookupProvider } from '@libs/basics/shared';
import {
	PpsProcessTemplateDialogLookupComponent
	// , BasicsSharedPpsProcessTypeLookupService // has no been exported from basics.share module
} from '@libs/productionplanning/shared';

import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * PPS Phase Template layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PpsPhaseTemplateLayoutService {

	private dateShiftModes = inject(DATESHIFT_MODES_TOKEN);

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<PhaseTemplateEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PhaseTypeFk', 'SequenceOrder', 'Duration', 'SuccessorLeadTime', 'PsdRelationkindFk', 'SuccessorMinSlackTime', 'DateshiftMode'],
				},
				{
					gid: 'placeHolder',
					attributes: ['IsPlaceholder', 'ProcessTemplateDefFk', 'ExecutionLimit'],
				}
			],
			overloads: {
				PhaseTypeFk: BasicsSharedLookupOverloadProvider.providePpsPhaseTypeLookupOverload(true),
				PsdRelationkindFk: BasicsSharedLookupOverloadProvider.provideRelationKindLookupOverload(true),
				DateshiftMode: {
					type: FieldType.Select,
					itemsSource: {
						items: this.dateShiftModes,
					}
				},
				ProcessTemplateDefFk: {
					visible: true,
					type: FieldType.CustomComponent,
					componentType: PpsProcessTemplateDialogLookupComponent,
					providers: createFormDialogLookupProvider({
						objectKey: 'ProcessTemplate',
						showSearchButton: true,
						clientSideFilter: {
							execute(item, context): boolean {
								//TODO: not sure how to deal with this case, need a way to replace basicsLookupdataLookupDescriptorService.getData -zwz
								/*
								var types = basicsLookupdataLookupDescriptorService.getData('basics.customize.ppsprocesstype');
								types = _.filter(types, function (type) {
									return type.IsPlaceHolder;
								});
								return !!_.find(types, {Id : entity.ProcessTypeFk});
								*/

								/* testing codes
								BasicsSharedPpsProcessTypeLookupService.getItemByKey
								IPpsProcessTemplateSimpleLookupEntity
								console.log(item.ProcessTypeFk)
								*/
								return true;
							}
						}
					}),
				},

				SuccessorLeadTime: {
					// disallowNegative: true
				},
				ExecutionLimit: {
					// disallowNegative: true
				},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					baseGroup: { key: 'entityProperties', text: '*Basic Data' },
				}),

				...prefixAllTranslationKeys('productionplanning.common.', {
					DateshiftMode: { key: 'event.dateshiftMode' },
				}),

				...prefixAllTranslationKeys('productionplanning.processconfiguration.', {
					PhaseTypeFk: { key: 'phaseTemplate.phaseType' },
					SequenceOrder: { key: 'phaseTemplate.sequenceOrder' },
					Duration: { key: 'phaseTemplate.duration' },
					SuccessorLeadTime: { key: 'phaseTemplate.successorLeadTime' },
					PsdRelationkindFk: { key: 'phaseTemplate.psdRelationKind' },
					SuccessorMinSlackTime: { key: 'phaseTemplate.successorMinSlackTime' },
					placeHolder: { key: 'placeHolder' },
					IsPlaceholder: { key: 'phaseTemplate.isPlaceholder' },
					ProcessTemplateDefFk: { key: 'phaseTemplate.defaultProcessTemplate' },
					ExecutionLimit: { key: 'phaseTemplate.executionLimit' },
				}),

			},
		};
	}
}

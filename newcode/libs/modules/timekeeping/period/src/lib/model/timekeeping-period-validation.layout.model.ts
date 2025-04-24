import { ContainerLayoutConfiguration } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ITimekeepingValidationEntity } from '../model/entities/timekeeping-validation-entity.interface';
import { createLookup, FieldType } from '@libs/ui/common';
import { BasicsSharedMessageLookupService } from '@libs/basics/shared';

export const TIMEKEEPING_PERIOD_VALIDATION_LAYOUT:ContainerLayoutConfiguration<ITimekeepingValidationEntity> ={
	groups: [
		{
			gid: 'default-group',
			attributes: ['Message','MessageSeverityFk']
		}
	],
	overloads: {
		MessageSeverityFk: {
			readonly: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedMessageLookupService,
				showDescription: true,
				descriptionMember: 'MessageseverityFk'
			})
		},
		Message: {
			readonly: true
		}
	},
	labels: {
		...prefixAllTranslationKeys('basics.customize.', {
			MessageSeverityFk: {key:'messageseverityfk'},
		}),
		...prefixAllTranslationKeys('procurement.invoice.', {
			Message:{key:'message'}
		})
	}
};
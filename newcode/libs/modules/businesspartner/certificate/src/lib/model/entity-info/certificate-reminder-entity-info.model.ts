import {EntityInfo} from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BusinesspartnerCertificateReminderDataService } from '../../services/certificate-reminder-data.service';
import { ICertificateReminderEntity } from '@libs/businesspartner/interfaces';
import { CertificateReminderValidationService } from '../../services/validations/certificate-reminder-validation.service';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IBasicsCustomizeCertificateStatusEntity } from '@libs/basics/interfaces';


export const CERTIFICATE_REMINDER_ENTITY = EntityInfo.create<ICertificateReminderEntity>({
	grid: {
		title: { text: 'Reminders', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName + '.certificateReminderListTitle' },
	},
	form: {
		title: { text: 'Reminder Detail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName + '.certificateReminderDetailTitle' },
		containerUuid: '78373adc2a214ab2b3c9564317dcd36b',
	},
	dataService: (ctx) => ctx.injector.get(BusinesspartnerCertificateReminderDataService),
	validationService: (ctx) => ctx.injector.get(CertificateReminderValidationService),
	dtoSchemeId: { moduleSubModule: MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificatePascalCasedModuleName, typeName: 'CertificateReminderDto' },
	permissionUuid: '1b11c041c2e54c87b7be08ebf066089c',
	layoutConfiguration: {
		groups: [
			{
				'gid': 'basicData',
				'attributes': ['BatchId', 'BatchDate', 'Description', 'CertificateStatusFk', 'CommentText', 'Telefax', 'Email']
			}
		],
		labels: {
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerCertificateModuleName + '.', {

				BatchId: {key: 'reminder.label.batch'},
				BatchDate: {key: 'reminder.label.batchDate'},
				CertificateStatusFk: {key: 'status'},
				Email: {key: 'reminder.label.useEmail'},
				Telefax: {key: 'reminder.label.useTelefax'}
			}),
			...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
				CommentText: {key: 'entityCommentText'},
				Description:{key: 'entityDescription'}
			}),
		},
		overloads: {
			CertificateStatusFk: {
				...BasicsSharedCustomizeLookupOverloadProvider.provideCertificateStatusLookupOverload(false, {
					select(item: IBasicsCustomizeCertificateStatusEntity): string {
						return item.Icon ? `status-icons ico-status${item.Icon.toString().padStart(2, '0')}` : '';
					},
					getIconType() {
						return 'css';
					},
				}),
				...{ width: 120 }
			}
		}
	}
});
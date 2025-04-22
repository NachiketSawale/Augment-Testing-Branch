import { IInitializationContext, PlatformConfigurationService } from '@libs/platform/common';
import { SendEmailOrFaxService } from '../../services/wizards/send-email-or-fax.service';
import { CreateRequestsService } from '../../services/wizards/create-requests.service';
import { ChangeCertificateStatusService } from '../../services/wizards/change-certificate-status.service';
import { CreateRemindersService } from '../../services/wizards/create-reminders.service';
import { BPCertificateChangeProjectDocumentStatusWizardService } from '../../services/wizards/change-project-document-status-wizard.service';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { BusinesspartnerCertificateCertificateDataService } from '../../services/certificate-data.service';
import { CommunicationType, IChangeCertificateStatusWizardOptions, ICreateRequestsEntity, ICreateRequestsOptions } from '@libs/businesspartner/interfaces';
import { ICertificateEntity } from '@libs/businesspartner/interfaces';
import { CertificateEntityComplete } from '@libs/businesspartner/shared';

export class BusinesspartnerCertificateWizard {
	public sendEmail(context: IInitializationContext) {
		const service = context.injector.get(SendEmailOrFaxService);
		service.sendEmail.bind(service);
		return service.sendEmail(CommunicationType.Email);
	}

	public sendFax(context: IInitializationContext) {
		const service = context.injector.get(SendEmailOrFaxService);
		service.sendEmail.bind(service);
		return service.sendEmail(CommunicationType.Fax);
	}

	public async createRequests(context: IInitializationContext) {
		const configuration = context.injector.get(PlatformConfigurationService);
		const options: ICreateRequestsOptions<ICreateRequestsEntity> = {
			createRequestsEntity: {
				CompanyFk: configuration.clientId,
			},
			customFormRows: [
				{
					id: 'CompanyFk',
					model: 'CompanyFk',
					label: 'cloud.common.entityCompany',
					...BasicsSharedLookupOverloadProvider.provideCertificateCompanyLookupOverload(true, true),
				}
			],
			creationProvider: (param: ICreateRequestsEntity) => {
				return {
					url: 'businesspartner/certificate/createrequired/company',
					params: {
						StatusFk: param.CertificateStatusFk ?? 0,
						CompanyId: param.CompanyFk ?? 0
					}
				};
			}
		};
		return context.injector.get(CreateRequestsService).createRequests(options, () => {
			const certificateService = context.injector.get(BusinesspartnerCertificateCertificateDataService);
			certificateService.refreshAllLoaded();
		});
	}

	public changeStatus(context: IInitializationContext) {
		const statusService = context.injector.get(ChangeCertificateStatusService<ICertificateEntity, CertificateEntityComplete>);
		statusService.onStartChangeStatusWizard.bind(statusService);
		const options: IChangeCertificateStatusWizardOptions<ICertificateEntity, CertificateEntityComplete> = {
			dataService: context.injector.get(BusinesspartnerCertificateCertificateDataService),
			rootDataService: context.injector.get(BusinesspartnerCertificateCertificateDataService),
		};
		return statusService.onStartChangeStatusWizard(options);
	}

	public createReminders(context: IInitializationContext) {
		return context.injector.get(CreateRemindersService).createReminders();
	}

	public changeDocumentProjectStatus(context: IInitializationContext) {
		const dataService = context.injector.get(BPCertificateChangeProjectDocumentStatusWizardService);
		return dataService.onStartChangeStatusWizard();
	}
}

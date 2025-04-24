import {IInitializationContext} from '@libs/platform/common';
import {BusinesspartnerContactAssignmentActivationService} from '../../services/wizards/assignment-activation.service';
import {ExportVcfFileService} from '../../services/wizards/export-vcf-file.service';
import {IEntityModification, IEntitySelection} from '@libs/platform/data-access';
import {IContactEntity} from '@libs/businesspartner/interfaces';
import {
	BasicsSupportsIsLiveDisableWizardService,
	BasicsSupportsIsLiveEnableWizardService,
	ISimpleActionOptions
} from '@libs/basics/shared';
import {ContactDataService} from '../../services/contact-data.service';
import {ImportVcfFileService} from '../../services/wizards/import-vcf-file.service';
import { BusinessPartnerContactReOrInActivatePortalUserService } from '../../services/wizards/contact-reactivate-or-inactive-portal-user.service';
export class BusinesspartnerContactWizard {
	public activateBusinessPartnerAssignment(context: IInitializationContext) {
		context.injector.get(BusinesspartnerContactAssignmentActivationService).showEditor();
	}

	public exportVCF(context: IInitializationContext,dataService:IEntitySelection<IContactEntity>) {
		context.injector.get(ExportVcfFileService).exportVCF(dataService);
	}

	public disableContact(context: IInitializationContext, dataService: IEntitySelection<IContactEntity> & IEntityModification<IContactEntity>) {
		const wizardService = context.injector.get(BasicsSupportsIsLiveDisableWizardService<IContactEntity>);
		const options: ISimpleActionOptions<IContactEntity> = {
			headerText: 'cloud.common.disableRecord',
			codeField: 'FirstName',
			doneMsg: 'businesspartner.contact.disableDone',
			nothingToDoMsg: 'businesspartner.contact.alreadyDisabled',
			questionMsg: 'cloud.common.questionEnableSelection',
		};

		wizardService.startDisableWizard(options, dataService);
	}

	public enableContact(context: IInitializationContext){
		const wizardService = context.injector.get(BasicsSupportsIsLiveEnableWizardService<IContactEntity>);
		const dataService = context.injector.get(ContactDataService);

		const options: ISimpleActionOptions<IContactEntity> = {
			headerText: 'cloud.common.enableRecord',
			codeField: 'FirstName',
			doneMsg: 'businesspartner.contact.enableDone',
			nothingToDoMsg: 'businesspartner.contact.alreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection',
		};

		wizardService.startEnableWizard(options, dataService);
	}

	public importVCF(context: IInitializationContext,dataService:IEntitySelection<IContactEntity>) {
		context.injector.get(ImportVcfFileService).importVCF(dataService);
	}

	public reactivateOrInactivatePortalUser(context: IInitializationContext) {
		context.injector.get(BusinessPartnerContactReOrInActivatePortalUserService).ContactReactivateOrInactivatePortalUser();
	}
}
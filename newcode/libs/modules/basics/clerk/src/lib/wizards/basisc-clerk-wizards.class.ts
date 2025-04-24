/*
 * Copyright(c) RIB Software GmbH
 */

import { IInitializationContext } from '@libs/platform/common';
import { IBasicsClerkEntity } from '@libs/basics/interfaces';
import { BasicsClerkDataService } from '../services/basics-clerk-data.service';
import { BasicsSupportsIsLiveDisableWizardService, BasicsSupportsIsLiveEnableWizardService, ISimpleActionOptions } from '@libs/basics/shared';
import { CreateClerksFromUsersService } from './create-clerks-from-users/create-clerks-from-users.service';

export class BasicsClerkWizards{
	public async createClerksFromUsers(context: IInitializationContext) {
		const service = context.injector.get(CreateClerksFromUsersService);
		await service.handle();
	}
	public disableClerk(context: IInitializationContext) {
		const wizardService = context.injector.get(BasicsSupportsIsLiveDisableWizardService<IBasicsClerkEntity>);
		const dataService = context.injector.get(BasicsClerkDataService);

		const options: ISimpleActionOptions<IBasicsClerkEntity> = {
			headerText: 'basics.clerk.disableClerkTitle',
			codeField: 'Code',
			doneMsg: 'basics.clerk.disableDone',
			nothingToDoMsg: 'basics.clerk.alreadyDisabled',
			questionMsg: 'cloud.common.questionEnableSelection',
		};

		wizardService.startDisableWizard(options, dataService);
	}

	public enableClerk(context: IInitializationContext) {
		const wizardService = context.injector.get(BasicsSupportsIsLiveEnableWizardService<IBasicsClerkEntity>);
		const dataService = context.injector.get(BasicsClerkDataService);

		const options: ISimpleActionOptions<IBasicsClerkEntity> = {
			headerText: 'basics.clerk.enableClerkTitle',
			codeField: 'Code',
			doneMsg: 'basics.clerk.enableDone',
			nothingToDoMsg: 'basics.clerk.alreadyEnabled',
			questionMsg: 'cloud.common.questionEnableSelection',
		};

		wizardService.startEnableWizard(options, dataService);
	}

}
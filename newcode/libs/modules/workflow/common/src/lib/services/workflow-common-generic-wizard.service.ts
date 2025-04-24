/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, Injector } from '@angular/core';
import { ICustomDialog, ICustomDialogOptions, IDialogButtonBase, IEditorDialogResult, UiCommonDialogService } from '@libs/ui/common';
import { WorkflowCommonGenericWizardComponent } from '../components/workflow-common-generic-wizard/workflow-common-generic-wizard.component';
import { GENERIC_WIZARD_STEPS_TOKEN } from '../models/injection-token/generic-wizard-injection-tokens';
import { ICustomWorkflowAction } from '@libs/workflow/shared';
import { PlatformHttpService, Translatable } from '@libs/platform/common';
import { GenericWizardEntityInfoService } from './base/generic-wizard-entity-info.service';
import { IGenericWizardInstanceConfiguration } from '@libs/basics/config';
import { GenericWizardUuidServiceMap } from '../configuration/base/enum/rfq-bidder-container-id.enum';
import { GenericWizardStepService } from './base/generic-wizard-step.service';
import { GenericWizardBaseConfig } from '../models/types/generic-wizard-base-config.type';
import { extend } from 'lodash';
import { GenericWizardConfigService } from './base/generic-wizard-config.service';
import { GenericWizardConfigProviderService } from './base/generic-wizard-config-provider.service';
import { GenericWizardNamingParameterConstantService } from './base/generic-wizard-naming-parameter-constant.service';
import { GenericWizardCommunicationChannel } from '../models/enum/generic-wizard-communication-channel.enum';
import { GenericWizardButtonId } from '../models/enum/generic-wizard-button-id.enum';
import { GENERIC_WIZARD_ROOT_SERVICE_PROVIDER_TOKEN } from '../configuration/base/tokens/root-service-provider.token';


@Injectable({
	providedIn: 'root'
})
export class WorkflowCommonGenericWizardService {

	private readonly modalPopup = inject(UiCommonDialogService);
	private readonly httpService = inject(PlatformHttpService);
	private readonly injector = inject(Injector);
	private readonly wizardConfigService = inject(GenericWizardConfigService);
	private readonly genericWizardEntityInfoService = inject(GenericWizardEntityInfoService);
	private readonly genericWizardConfigProviderService = inject(GenericWizardConfigProviderService);
	private readonly genericWizardContainerLayoutservice = inject(GenericWizardStepService);
	private readonly genericWizardNamingParameterConstantService = inject(GenericWizardNamingParameterConstantService);

	public async execute<T>(action: ICustomWorkflowAction): Promise<IEditorDialogResult<T>> {

		const genericWizardConfigId = parseInt(action.input.find((option) => option.key === 'GenericWizardInstanceId')?.value ?? '0');
		const startEntityId = parseInt(action.input.find((option) => option.key === 'EntityId')?.value ?? '0');
		const followTemplateId = parseInt(action.input.find((option) => option.key === 'WorkflowTemplateId')?.value ?? '0');

		let wizardConfig = <GenericWizardBaseConfig>{
			startEntityId: startEntityId,
			followTemplateId: followTemplateId,
			actionInstance: action,
			communicationChannel: GenericWizardCommunicationChannel.Email
		};

		//Extending wizard config with action context
		wizardConfig = extend(wizardConfig, action.Context);

		//Setting default value for communication channel
		if (!wizardConfig.communicationChannel) {
			wizardConfig.communicationChannel = GenericWizardCommunicationChannel.Email;
		}

		//Cache for data services.
		const dataServices = <GenericWizardUuidServiceMap>{};

		//Load generic wizard configuration from module module.
		const genericWizardInstanceConfig = await this.prepareWizardConfigFromModule(genericWizardConfigId);
		wizardConfig.instance = genericWizardInstanceConfig.Instance;

		const useCaseConfiguration = this.genericWizardEntityInfoService.getUseCaseConfig(genericWizardInstanceConfig);
		this.wizardConfigService.setUseCaseConfiguration(useCaseConfiguration);

		this.wizardConfigService.setInitialContainerServiceStatus();

		//Load config providers
		wizardConfig = await this.genericWizardConfigProviderService.loadConfigProviders(wizardConfig, useCaseConfiguration);

		//Settings services to service helper.
		this.wizardConfigService.setServices(dataServices);
		this.wizardConfigService.setWizardConfig(wizardConfig);
		this.wizardConfigService.wizardTitle = useCaseConfiguration.WizardTitle;

		this.genericWizardNamingParameterConstantService.setInfoObject();

		//Load entity info configuration from use case id.
		const containerInfo = await this.genericWizardEntityInfoService.prepareEntityInfo(startEntityId, wizardConfig, dataServices, genericWizardInstanceConfig);

		//Create steps based on generic wizard configuration.
		const stepsInfo = this.genericWizardContainerLayoutservice.prepareSteps(containerInfo.containerInfo, genericWizardInstanceConfig, useCaseConfiguration);

		//Prepare generic wizard buttons
		const buttons: IDialogButtonBase<ICustomDialog<T, WorkflowCommonGenericWizardComponent, void>, void>[] = useCaseConfiguration.WizardButtons.map(button => {
			const dialogButton: IDialogButtonBase<ICustomDialog<T, WorkflowCommonGenericWizardComponent, void>, void> = {
				id: button.id,
				caption: button.caption as Translatable,
				fn: () => {
					button.fn(this.injector);
				},
				isDisabled: () => {
					return button.isDisabled ? button.isDisabled(this.injector) : false;
				},
				autoClose: button.autoClose
			};
			return dialogButton;
		});

		//Adding default close button
		const closeButton: IDialogButtonBase<ICustomDialog<T, WorkflowCommonGenericWizardComponent, void>, void> = {
			id: GenericWizardButtonId.Close,
			caption: {key: 'basics.workflow.modalDialogs.closeButton', text: 'Close'},
			fn: () => {},
			autoClose: true
		};
		buttons.push(closeButton);
		
		const customModalOptions: ICustomDialogOptions<T, WorkflowCommonGenericWizardComponent> = {
			bodyComponent: WorkflowCommonGenericWizardComponent,
			bodyProviders: [
				{ provide: GENERIC_WIZARD_STEPS_TOKEN, useValue: stepsInfo },
				{ provide: GENERIC_WIZARD_ROOT_SERVICE_PROVIDER_TOKEN, useValue: containerInfo.rootDataService }
			],
			buttons: buttons,
			height: '90%',
			width: '90%'
		};

		let result = await this.modalPopup.show<T, WorkflowCommonGenericWizardComponent>(customModalOptions);
		this.wizardConfigService.clearServices();
		if (!result) {
			throw new Error('Result is not defined');
		}

		if(result.closingButtonId === GenericWizardButtonId.Close && typeof action.Context !== 'string') {
			const wizardResult = {
				close: true,
				wizardFinished: true
			};
			(action.Context as {
				WizardResult: {
					close: boolean; 
					wizardFinished: boolean;
				}
			}).WizardResult = wizardResult;

			result = {
				...result,
				value: {
					result: JSON.stringify(wizardResult),
					context: action.Context
				} as T
			};
		}
		return result;
	}

	private prepareWizardConfigFromModule(genericWizardConfigId: number) {
		//Get uuid from workflow instance to load use case configuration.
		return this.httpService.get<IGenericWizardInstanceConfiguration>('basics/config/genwizard/instance/getbyid', { params: { instanceId: genericWizardConfigId } });
	}
}
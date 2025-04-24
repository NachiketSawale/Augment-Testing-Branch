/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, computed, effect, EffectRef, inject, OnDestroy, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { GENERIC_WIZARD_STEPS_TOKEN, GenericWizardStepConfig } from '../../models/injection-token/generic-wizard-injection-tokens';
import { CdkStepper } from '@angular/cdk/stepper';
import { GenericWizardConfigService } from '../../services/base/generic-wizard-config.service';
import { PlatformTranslateService, Translatable } from '@libs/platform/common';
import { getCustomDialogDataToken } from '@libs/ui/common';
import { ContainerGroupComponent } from '@libs/ui/container-system';
import { GenericWizardValidationService, Prop } from '../../services/base/generic-wizard-validation.service';
import { GenericWizardContainers } from '../../configuration/base/enum/rfq-bidder-container-id.enum';


/**
 * Renders the generic wizard.
 */
@Component({
	templateUrl: './workflow-common-generic-wizard.component.html',
	styleUrl: './workflow-common-generic-wizard.component.scss',
	encapsulation: ViewEncapsulation.None
})
export class WorkflowCommonGenericWizardComponent implements OnDestroy {

	@ViewChild('cdkStepper')
	public cdkStepper!: CdkStepper;

	/**
	 * Generic wizard steps used to build the containers.
	 */
	public readonly genericWizardSteps: GenericWizardStepConfig[] = inject(GENERIC_WIZARD_STEPS_TOKEN);

	private readonly genericWizardConfigService = inject(GenericWizardConfigService);
	private readonly platformTranslateService = inject(PlatformTranslateService);
	private readonly dialogData = inject(getCustomDialogDataToken());
	private readonly genericWizardValidationService = inject(GenericWizardValidationService);

	/**
	 * Sets the current load status of all the data services.
	 */
	public haveDataServicesLoaded: boolean = false;

	@ViewChildren(ContainerGroupComponent)
	private readonly containerGroups!: QueryList<ContainerGroupComponent>;

	private validationEffect!: EffectRef;
	public constructor() {

		this.genericWizardConfigService.setGenericWizardSteps(this.genericWizardSteps);

		this.validationEffect = effect(() => {
			this.validationErrors = [];
			const containerValidations = this.genericWizardValidationService.validationErrors();
			let props: Prop<GenericWizardContainers>[] = [];
			containerValidations.forEach(containerValidation => {
				props = props.concat((containerValidation.props as unknown as Prop<GenericWizardContainers>));
			});
			const errors = props.map(prop => prop.error).reduce((acc, curr) => {
				return acc.concat(curr);
			}, []);
			this.validationErrors = errors;
		});

		effect(() => {
			if (this.genericWizardConfigService.$areDataServicesCreated() && !this.genericWizardConfigService.$haveDataServicesLoaded()) {
				this.genericWizardConfigService.loadAllDataService();
			}
		});

		effect(()=>{
			this.haveDataServicesLoaded = this.genericWizardConfigService.$haveDataServicesLoaded();
		});
	}

	/**
	 * List of tabs to display.
	 */
	public tabs = this.genericWizardSteps.map(step => ({ tabName: step.tabName }));

	/**
	 * Initially selected tab index.
	 */
	public selectedTabIndex = computed(() => {
		const currentTabIndex = this.genericWizardConfigService.currentSelectedTab();
		if(this.cdkStepper) {
			this.cdkStepper.selectedIndex = currentTabIndex;
			this.setHeader(currentTabIndex);
		}
		return currentTabIndex;
	});

	/**
	 * Validation errors in containers
	 */
	public validationErrors: Translatable[] = [];

	/**
	 * Selects the container based on the selected tab.
	 * @param index the index of the selected tab.
	 */
	public onTabSelected(index: number) {
		this.genericWizardConfigService.currentSelectedTab.set(index);
	}

	private setHeader(index: number): void {
		const wizardTitle = this.platformTranslateService.instant(this.genericWizardConfigService.wizardTitle).text;
		const tabName = this.platformTranslateService.instant(this.tabs[index].tabName).text;
		this.dialogData.headerText = `${wizardTitle} - ${index + 1}/${this.tabs.length} ${tabName}`;
	}

	public itemClicked(index: number) {
		this.onTabSelected(index);
	}

	public ngOnDestroy(): void {
		this.validationEffect.destroy();
	}
}
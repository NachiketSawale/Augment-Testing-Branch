/*
 * Copyright(c) RIB Software GmbH
 */

import { ChangeDetectorRef, Component, effect, EventEmitter, inject, Input, OnDestroy, Output } from '@angular/core';
import { GenericWizardStepConfig } from '../../models/injection-token/generic-wizard-injection-tokens';
import { Subscription } from 'rxjs';
import { isIncluded } from '../../configuration/rfq-bidder/types/generic-wizard-included.type';
import { GenericWizardConfigService } from '../../services/base/generic-wizard-config.service';
import { GenericWizardContainers } from '../../configuration/base/enum/rfq-bidder-container-id.enum';
import { IEntityList, IEntityModification } from '@libs/platform/data-access';
import { IInfoBarHeader, IInfoBarOutput, IInfoBarSub } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { get, isString } from 'lodash';

/**
 * Wrapper over the info bar component for the generic wizard.
 * Displays the info bar for the generic wizard.
 */
@Component({
	templateUrl: './workflow-common-generic-wizard-info-bar.component.html',
	selector: 'workflow-common-generic-wizard-info-bar'
})
export class WorkflowCommonGenericWizardInfoBarComponent<T extends object> implements OnDestroy {
	@Input()
	public genericWizardSteps: GenericWizardStepConfig[] = [];

	@Output()
	public itemClicked = new EventEmitter<number>();

	private subscriptions: Subscription[] = [];
	public entityInfos: IInfoBarHeader[] = [];

	private readonly wizardConfigService = inject(GenericWizardConfigService);
	private readonly platformTranslateService = inject(PlatformTranslateService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	public constructor() {
		effect(() => {
			if (this.wizardConfigService.$haveDataServicesLoaded()) {
				const infoBarContainerUuids = this.wizardConfigService.getContainersForInfoBar();
				this.genericWizardSteps.forEach((step, index) => {
					const infoBarHeader: IInfoBarHeader = {
						id: index,
						description: this.platformTranslateService.instant(step.tabName).text,
						subEntity: []
					};
					step.containerConfig.filter(config => infoBarContainerUuids.includes(config.containerUuid)).forEach((containerConfig) => {
						const subentities: IInfoBarSub[] = [];

						const infoBarSub: IInfoBarSub = {
							id: 1,
							description: this.platformTranslateService.instant(containerConfig.containerTitle).text,
							subEntity: subentities
						};
						this.loadInfoBarItems(containerConfig.containerUuid, infoBarSub);
						infoBarHeader.subEntity?.push(infoBarSub);
					});
					if (infoBarHeader.subEntity && infoBarHeader.subEntity.length > 0) {
						this.entityInfos.push(infoBarHeader);
					}
				});
			}
		});

	}


	private loadInfoBarItems(containerUuid: GenericWizardContainers, infoBarSub: IInfoBarSub) {
		const dataService = this.wizardConfigService.getService(containerUuid) as unknown as (IEntityModification<T> & IEntityList<T>);
		if (dataService !== null) {

			const sub = dataService.entitiesModified$.subscribe(modified => {
				const items = dataService.getList();
				//If grid container get all selected items.
				if (isIncluded(items)) {
					const filteredItems = items.filter(item => item.isIncluded);
					const subEntities = filteredItems.map(item => {
						return {
							description: this.getDisplayName(item, containerUuid),
							id: 1,
							subEntity: []
						};
					}
					);
					infoBarSub.subEntity = subEntities;
				} else if (items.length > 0) { //Otherwise get first item by default
					const subEntities = [{
						description: this.getDisplayName(items[0], containerUuid),
						id: 1,
						subEntity: []
					}];
					infoBarSub.subEntity = subEntities;
				}
				this.changeDetectorRef.detectChanges();
			});

			//set default values
			const items = dataService.getList();
			//If grid container get all selected items.
			if (isIncluded(items)) {
				const filteredItems = items.filter(item => item.isIncluded);
				const subEntities = filteredItems.map(item => {
					return {
						description: this.getDisplayName(item, containerUuid),
						id: 1,
						subEntity: []
					};
				}
				);
				infoBarSub.subEntity = subEntities;
			} else if (items.length > 0) { //Otherwise get first item by default
				const subEntities = [{
					description: this.getDisplayName(items[0], containerUuid),
					id: 1,
					subEntity: []
				}];
				infoBarSub.subEntity = subEntities;
			}
			this.changeDetectorRef.detectChanges();
			this.subscriptions.push(sub);
		}
	}

	private getDisplayName(item: T, containerUuid: GenericWizardContainers) {
		const useCaseConfiguration = this.wizardConfigService.getUseCaseConfiguration();
		const keysArray = useCaseConfiguration.Containers[containerUuid]?.orderedInfoBarDisplayMembers;
		let displayName: string | undefined = '';
		if (keysArray) {
			keysArray.forEach(key => {
				if (key) {
					const displayValue = get(item, key);
					displayName = isString(displayValue) ? (displayValue as string).trim() : displayName;
				}
			});
		}
		return displayName;
	}

	public ngOnDestroy(): void {
		this.subscriptions.forEach(sub => sub.unsubscribe());
	}

	public itemClickedFn(index: IInfoBarOutput) {
		this.itemClicked.emit(index.id);
	}
}
/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ICosInstanceEntity } from '@libs/constructionsystem/shared';
import { ItemType, UiModuleNavigationHelperService } from '@libs/ui/common';
import { isEmpty } from 'lodash';
import { ConstructionSystemMainInstanceDataService } from '../services/construction-system-main-instance-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { ConstructionSystemMainInstanceImageHelperService } from '../services/construction-system-main-instance-image-helper.service';
import { ConstructionSystemMainJobDataService } from '../services/construction-system-main-job-data.service';

export const CONSTRUCTION_SYSTEM_MAIN_INSTANCE_BEHAVIOR_TOKEN = new InjectionToken<ConstructionSystemMainInstanceBehavior>('constructionSystemMainInstanceBehavior');

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainInstanceBehavior implements IEntityContainerBehavior<IGridContainerLink<ICosInstanceEntity>, ICosInstanceEntity> {
	private readonly imageService = ServiceLocator.injector.get(ConstructionSystemMainInstanceImageHelperService);
	private readonly jobService = ServiceLocator.injector.get(ConstructionSystemMainJobDataService);
	private uiModuleNavigationHelperService: UiModuleNavigationHelperService = inject(UiModuleNavigationHelperService);
	public constructor(private dataService: ConstructionSystemMainInstanceDataService) {}
	public onCreate(containerLink: IGridContainerLink<ICosInstanceEntity>) {
		containerLink.uiAddOns.toolbar.deleteItems([EntityContainerCommand.CreateRecord]);
		this.uiModuleNavigationHelperService.remove(containerLink.uiAddOns.toolbar); // remove navigationGroup
		//todo Waiting for platformModuleInfoService
		//navigateTitle= platformModuleInfoService.getNavigatorTitle('procurement.requisition').text,
		const navigateTitle = 'Go To Estimate';
		containerLink.uiAddOns.toolbar.addItems([
			{
				caption: { key: 'cloud.common.taskBarDeepCopyRecord' },
				hideItem: false,
				iconClass: 'tlb-icons ico-copy-paste-deep',
				id: 'createDeepCopy',
				fn: () => {
					this.dataService.createDeepCopy();
				},
				disabled: () => {
					return isEmpty(this.dataService.getSelection());
				},
				sort: 4,
				type: ItemType.Item,
			},
			{
				id: 't-navigation',
				caption: { text: navigateTitle },
				sort: 10,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-goto',
				fn: () => {
					this.dataService.gotToEstimate();
				},
			},
			{
				id: 't-calculation',
				caption: { text: 'Calculation', key: 'constructionsystem.main.taskBarAddCalculationJob' },
				sort: 10,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-instance-calculate',
				fn: () => {
					this.jobService.createCalculationJob();
				},
				disabled: () => {
					return this.jobService.disableCalculation();
				},
			},
			{
				id: 'taskBarShowImage',
				caption: { text: 'Construction System Master Image', key: 'constructionsystem.main.taskBarShowImage' },
				sort: 10,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-create-form',
				fn: () => {
					this.imageService.showDialog();
				},
			},
			{
				id: 't-evaluation',
				caption: { text: 'Evaluate All', key: 'constructionsystem.main.taskBarAddEvaluationJob' },
				sort: 10,
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-instance-par-evaluate',
				fn: () => {
					this.jobService.createEvaluationJob();
				},
				disabled: () => {
					return this.jobService.disableEvaluation();
				},
			},
		]);

		console.warn(containerLink.uiAddOns.toolbar);
	}
}

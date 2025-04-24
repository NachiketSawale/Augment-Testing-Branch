/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';

import { IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { ItemType } from '@libs/ui/common';

import { IWizard2GroupPValueEntity } from '../model/entities/wizard-2group-pvalue-entity.interface';
import { IListWizards } from '../model/entities/list-wizards-complete.interface';

import { BasicsConfigWizardXGroupPValueDataService } from '../services/basics-config-wizard-xgroup-pvalue-data.service';
import { PlatformHttpService } from '@libs/platform/common';
import { BasicsConfigWizardXGroupDataService } from '../../wizard-to-group/services/basics-config-wizard-xgroup-data.service';

@Injectable({
	providedIn: 'root'
})

/**
 * Basics config wizard-x group parameter value behavior service.
 */
export class BasicsConfigWizardXGroupPValueBehavior implements IEntityContainerBehavior<IGridContainerLink<IWizard2GroupPValueEntity>, IWizard2GroupPValueEntity> {

	/**
	 * Used to inject wizard group data service.
	 */
	private wizard2GroupDataService = inject(BasicsConfigWizardXGroupDataService);


	/**
	 * Used to inject wizard xgroup parameter value data service.
	 */
	private dataService: BasicsConfigWizardXGroupPValueDataService = inject(BasicsConfigWizardXGroupPValueDataService);

	/**
	 * Used to inject http client.
	 */
	protected http = inject(PlatformHttpService);

	/**
	 * This method is invoked right when the container component
	 * is being created.
	 * @param {IGridContainerLink<IWizard2GroupPValueEntity>} containerLink 
	 * A reference to the facilities of the container
	 */
	public onCreate(containerLink: IGridContainerLink<IWizard2GroupPValueEntity>): void {

		containerLink.uiAddOns.toolbar.addItems([
			{
				id: 't1',
				caption: { key: 'basics.config.parameterAdjustment' },
				type: ItemType.Item,
				cssClass: 'tlb-icons ico-db-update',
				fn: () => this.adjustParameters(),
				sort: 240

			}
		]);
	}


	/**
	 * Used to adjust parameters based on icon click.
	 */
	private adjustParameters() {
		const wizard2Group = this.wizard2GroupDataService.getSelection()[0];

		if (wizard2Group) {

			this.http.get('basics/config/wizard/listWizardsCompleteByWizardId' + '?wizardId=' + wizard2Group.WizardFk).then((data) => {

				const parameters: IWizard2GroupPValueEntity[] = [];
				let x = 0;
				const parameterValues = data as IListWizards[];
				parameterValues.forEach((value) => {
					if (value.Type === 'p') {
						const data: IWizard2GroupPValueEntity = {
							Id: --x,
							Domain: value.Domain,
							Value: value.Value,
							Version: -1,
							Sorting: 0,
							ReportFk: null,
							Wizard2GroupFk: wizard2Group.Id,
							WizardParameterFk: value.WizardParameterFk,
							InsertedAt: new Date(),
							InsertedBy: 0
						};
						parameters.push(data);
					}
				});

				this.dataService.setList(this.dataService.getList().concat(parameters));
			});
		}
	}
}
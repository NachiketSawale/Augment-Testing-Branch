/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, EntityArrayProcessor, DataServiceHierarchicalNode } from '@libs/platform/data-access';

import { BasicsCostcodesDailogConfigurationService } from '../lookups/basics-cost-codes-dailog-configuration.service';
import { BasicsCostCodesDataService } from './basics-cost-codes-data.service';
import { ICostCodeCompanyEntity, ICostCodeEntity, ICostCodesUsedCompanyEntity } from '../../model/models';
import { BasicsCostCodesPriceVersionCompanyComplete } from '../../model/basics-cost-codes-price-version-company-complete.class';
import { IBasicsCostCodesComplete } from '../../model/basics-cost-codes-complete.inteface';
import { UiCommonMessageBoxService } from '@libs/ui/common';

export const BASICS_COST_CODES_DATA_TOKEN = new InjectionToken<BasicsCostCodesPriceVersionCompanyDataService>('basicsCostCodesPriceVersionCompanyDataToken');

/**
 * Basics Cost Codes Price Version Company Data Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesPriceVersionCompanyDataService extends DataServiceHierarchicalNode<ICostCodeCompanyEntity, BasicsCostCodesPriceVersionCompanyComplete, ICostCodeEntity, IBasicsCostCodesComplete> {
	public basicsCostcodesDailogConfigurationService = inject(BasicsCostcodesDailogConfigurationService);
	private selectedItem: ICostCodeCompanyEntity[] | null = null;
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	public parentService = inject(BasicsCostCodesDataService);
	public constructor(parentService: BasicsCostCodesDataService) {
		const options: IDataServiceOptions<ICostCodeCompanyEntity> = {
			apiUrl: 'basics/costcodes/version/company',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,

				prepareParam: (ident) => {
					const selection = parentService.getSelection()[0];
					return { mainItemId: selection.Id, mdcContextId: selection.ContextFk };
				},
			},

			roleInfo: <IDataServiceRoleOptions<ICostCodeCompanyEntity>>{
				role: ServiceRole.Root,
				itemName: 'Companies',
				parent: parentService
			},
			processors: [new EntityArrayProcessor<ICostCodeCompanyEntity>(['Companies'])]
		};

		super(options);
	}

	/**
	 * Creates a `BasicsCostCodesPriceVersionCompanyComplete` entity based on the provided modified company entity.
	 *
	 * @param modified The modified `ICostCodeCompanyEntity` to base the new complete entity on, or `null` to create an empty entity.
	 *
	 * @returns A new `BasicsCostCodesPriceVersionCompanyComplete` object, with properties set based on the `modified` entity if provided.
	 */
	public override createUpdateEntity(modified: ICostCodeCompanyEntity | null): BasicsCostCodesPriceVersionCompanyComplete {
		const complete = new BasicsCostCodesPriceVersionCompanyComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Companies = [modified];
		}

		return complete;
	}

	/**
	 * Retrieves the list of modified cost code company entities from the provided update.
	 * @param complete The `BasicsCostCodesPriceVersionCompanyComplete` object containing company data.
	 * @returns An array of `ICostCodeCompanyEntity` representing the companies. If `Companies` is `null`, returns an empty array.
	 */
	public override getModificationsFromUpdate(complete: BasicsCostCodesPriceVersionCompanyComplete): ICostCodeCompanyEntity[] {
		if (complete.Companies === null) {
			return (complete.Companies = []);
		}

		return complete.Companies;
	}

	/**
	 * Retrieves the child companies of the given cost codes used company entity.
	 * @param element The `ICostCodesUsedCompanyEntity` from which to retrieve the child companies.
	 * @returns An array of `ICostCodesUsedCompanyEntity` representing the child companies, or an empty array if `Companies` is `null` or `undefined`.
	 */
	public override childrenOf(element: ICostCodesUsedCompanyEntity): ICostCodesUsedCompanyEntity[] {
		return element.Companies ?? [];
	}

	/**
	 * Retrieves the parent company of the given cost code company entity.
	 * @param element The `ICostCodeCompanyEntity` for which to find the parent company.
	 *
	 * @returns The parent `ICostCodeCompanyEntity` if found, or `null` if no parent exists or `CompanyFk` is `null`.
	 */
	public override parentOf(element: ICostCodeCompanyEntity): ICostCodeCompanyEntity | null {
		if (element.CompanyFk == null) {
			return null;
		}

		const parentId = element.CompanyFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	public override select(toSelect: ICostCodesUsedCompanyEntity): Promise<ICostCodesUsedCompanyEntity> {
		return new Promise((resolve, reject) => {
			if (Array.isArray(toSelect)) {
				if (toSelect.length > 0) {
					resolve(toSelect[0]);

					this.setStateRecursive(toSelect, true);
				} else {
					reject(new Error('is empty'));
				}
			} else if (toSelect) {
				resolve(toSelect);
			} else {
				reject(new Error('Invalid selection'));
			}
		});
	}

	public setStateRecursive(item: ICostCodesUsedCompanyEntity, newState: boolean): void {
		const header = this.parentService.getSelection()[0];

		item.IsChecked = newState;

		if (header.ContextFk === item.MdcContextFk) {
			this.setModified(item);
		}

		if (item.Companies && item.Companies.length > 0) {
			for (let i = 0; i < item.Companies.length; i++) {
				this.setStateRecursive(item.Companies[i], newState);
			}
		}
	}

	public override isParentFn(parentKey: ICostCodeCompanyEntity, entity: ICostCodeCompanyEntity): boolean {
		return entity.CostCodeFk === parentKey.Id;
	}
}

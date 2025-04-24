/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceHierarchicalNode } from '@libs/platform/data-access';

import { BasicsCostCodesDataService } from './basics-cost-codes-data.service';
import { ICostCodesUsedCompanyEntity } from '../../model/entities/cost-codes-used-company-entity.interface';
import { ICostCodeEntity } from '../../model/entities/cost-code-entity.interface';
import { IBasicsCostCodesComplete } from '../../model/basics-cost-codes-complete.inteface';

import { ICostCodeCompanyEntity } from '../../model/entities/cost-code-company-entity.interface';
import { BasicsCostCodesCompanyComplete } from '../../model/basics-cost-codes-company-complete.class';
import { IYesNoDialogOptions, StandardDialogButtonId, UiCommonMessageBoxService } from '@libs/ui/common';
import { PlatformTranslateService } from '@libs/platform/common';
import { ICostcodePriceVerEntity } from '@libs/basics/interfaces';

export const BASICS_COST_CODES_COMPANY_DATA_TOKEN = new InjectionToken<BasicsCostCodesCompanyDataService>('basicsCostCodesCompanyDataToken');

/**
 * Basics Cost Codes Company Data Service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsCostCodesCompanyDataService extends DataServiceHierarchicalNode<ICostCodesUsedCompanyEntity, BasicsCostCodesCompanyComplete, ICostCodeEntity, IBasicsCostCodesComplete> {
	private parentService = inject(BasicsCostCodesDataService);

	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly translateService = inject(PlatformTranslateService);
	public constructor(parentService: BasicsCostCodesDataService) {
		const options: IDataServiceOptions<ICostcodePriceVerEntity> = {
			apiUrl: 'basics/costcodes/company',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'tree',
				usePost: false,
				prepareParam: (ident) => {
					const selection = this.parentService.getSelection()[0];
					return { mainItemId: selection.Id, mdcContextId: selection.ContextFk };
				},
			},
			roleInfo: <IDataServiceRoleOptions<ICostcodePriceVerEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PriceVersion',
				parent: parentService
			},
		};

		super(options);
	}

	/**
	 * Retrieves the list of modified cost code company entities from the provided update..
	 * @param complete The complete `IBasicsCostCodesCompanyComplete` object containing company data.
	 * @returns The array of `ICostCodeCompanyEntity` representing the companies.
	 */

	public override getModificationsFromUpdate(complete: BasicsCostCodesCompanyComplete): ICostCodeCompanyEntity[] {
		if (complete.Companies === null) {
			return (complete.Companies = []);
		}

		return complete.Companies;
	}

	/**
	 * Retrieves the child companies of the given cost code company entity.
	 *
	 * @param element The `ICostCodesUsedCompanyEntity` from which to retrieve the child companies.
	 *
	 * @returns An array of `ICostCodesUsedCompanyEntity` representing the child companies, or an empty array if `Companies` is `null` or `undefined`.
	 */
	public override childrenOf(element: ICostCodesUsedCompanyEntity): ICostCodesUsedCompanyEntity[] {
		return element.Companies ?? [];
	}

	public override createUpdateEntity(modified: ICostCodesUsedCompanyEntity): BasicsCostCodesCompanyComplete {
		const complete = new BasicsCostCodesCompanyComplete();
		if (modified !== null) {
			complete.Id = modified.Id;
			complete.Companies = [modified];
		}

		return complete;
	}
	/**
	 * Retrieves the parent company of the given cost code company entity.
	 * @param element The `ICostCodeCompanyEntity` for which to find the parent company.
	 *
	 * @returns The parent `ICostCodeCompanyEntity` if found, or `null` if no parent exists or `CompanyFk` is `null`.
	 */
	public override parentOf(element: ICostCodesUsedCompanyEntity): ICostCodesUsedCompanyEntity | null {
		if (element.CompanyFk == null) {
			return null;
		}

		const parentId = element.CompanyFk;
		const parent = this.flatList().find((candidate) => candidate.Id === parentId);
		return parent === undefined ? null : parent;
	}

	/**
	 * @brief Selects a single `ICostCodesUsedCompanyEntity` from the provided input and sets state recursively
	 * @param toSelect The entity or array of entities to be selected. Can be an array of `ICostCodesUsedCompanyEntity`
	 * @return A `Promise` that resolves to the selected `ICostCodesUsedCompanyEntity` if successful,
	 *         or rejects with an `Error` if the selection is invalid or the array is empty.
	 */
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

	/**
	 * @brief Recursively sets the `IsChecked` state for the given entity and its associated companies.
	 * @return A `Promise` that resolves when the state has been set for the entity and all its associated companies,
	 *         and the confirmation dialog action has been completed.
	 */
	public async setStateRecursive(item: ICostCodesUsedCompanyEntity, newState: boolean): Promise<void> {
		item.IsChecked = newState;
		this.setModified(item);

		if (item.Companies && item.Companies.length > 0) {
			for (const company of item.Companies) {
				await this.setStateRecursive(company, newState);
			}
		}

		if (!item.IsChecked) {
			await this.parentService.setCompanyCostCodes(false);
		}

		await this.clickYesNoModalDailog();
	}

	/**
	 * @brief Displays a confirmation dialog and handles the user’s response.
	 * @return A `Promise` that resolves when the dialog has been shown and the user's response
	 *         has been processed. (Currently, the method does not return a value as the final
	 *         implementation for the service call is not complete.)
	 */
	public async clickYesNoModalDailog() {
		const options: IYesNoDialogOptions = {
			defaultButtonId: StandardDialogButtonId.Yes,
			id: 'YesNoModal',
			dontShowAgain: true,
			showCancelButton: false,
			headerText: this.translateService.instant('basics.costocdes.confirmAssignCompany').text,
			bodyText: this.translateService.instant('basics.costocdes.updateIncotermToItem').text
		};
		const result = await this.messageBoxService.showYesNoDialog(options);
		const includeChild = result?.closingButtonId && result.closingButtonId !== 'no' ? true : false;
		return this.parentService.setCompanyCostCodes(includeChild);
	}

	public override isParentFn(parentKey: ICostCodeEntity, entity: ICostCodesUsedCompanyEntity): boolean {
		return entity.Companies === parentKey.CostCodeCompanyEntities;
	}
}

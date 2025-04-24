/*
 * Copyright(c) RIB Software GmbH
 */
import { AfterViewInit, Directive, OnInit } from '@angular/core';
import { BusinessPartnerScope } from '../model/business-partner-scope';

//notice: For the validation function, please do it in the corresponding validation file
//This is just a hint, later deleted
// lookupOptions: {
// 	showClearButton: true,
// 	'IsShowBranch': true,
// 	'mainService':'basicsMaterialCatalogService',
// 	'BusinessPartnerField':'BusinessPartnerFk',
// 	'SubsidiaryField':'SubsidiaryFk',
// 	'SupplierField':'SupplierFk'
// }
//
@Directive()
export abstract class BusinessPartnerDialogComponent implements OnInit, AfterViewInit {
	public scope = new BusinessPartnerScope();

	public async ngOnInit(): Promise<void> {
		this.onInitialValue();
		await this.scope.translateService.load(['cloud.common', 'businesspartner.main', 'basics.customize']);
	}

	public ngAfterViewInit(): void {
		setTimeout(() => {
			this.scope.search();
		});
	}

	protected abstract onInitialValue(): void ;
}

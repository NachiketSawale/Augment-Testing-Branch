/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { StandardDialogButtonId } from '@libs/ui/common';
import { getDashboardImportDialogDataToken, IDashboardImport } from '../../model/basics-bi-plus-designer-dashboard-import.interface';
import { BasicBiPlusDesignerDashboardImportService } from '../../services/basics-bi-plus-designer-dashboard-import.service';

/**
 * This Component Render the Dashboard Import Details
 */
@Component({
	selector: 'basics-biplusdesigner-import-dialog',
	templateUrl: './basics-biplusdesigner-import-dialog.component.html',
	styleUrl: './basics-biplusdesigner-import-dialog.component.scss',
})
export class BasicsBiPlusDesignerImportDialogComponent implements OnInit {
	/**
	 * shown displayInfo
	 */
	public displayInfo = true;

	/**
	 * loading flag
	 */
	public loading = false;

	/**
	 * notificationText
	 */
	public notificationText = '';

	/**
	 *  Dashboard Import Data
	 */
	public data: IDashboardImport[] = [];

	/**
	 * inject BasicBiPlusDesignerDashboardImportService
	 */
	private readonly dashboardImportservice = inject(BasicBiPlusDesignerDashboardImportService);

	/**
	 * get dialogData token
	 */
	private readonly dialogData = inject(getDashboardImportDialogDataToken());

	/**
	 * On Init Component
	 */
	public ngOnInit(): void {
		if (this.dialogData[1].id === StandardDialogButtonId.Cancel) {
			this.dialogData[1].isDisabled = () => {
				return this.loading;
			};
		}
		if (this.dialogData[0].id === 'execute') {
			this.dialogData[0].isDisabled = () => {
				return this.loading || !this.displayInfo;
			};
			this.dialogData[0].fn = () => {
				this.getDashboardImportDetails();
			};
		}
	}

	/**
	 * get Dashboard Import Details
	 */
	public getDashboardImportDetails() {
		this.loading = true;
		//TODO:this url comming from globals.dashboard.url
		const dashboardUrl = 'https://itwobi-admin.itwo40.eu/mvc/organizations/Cl0ghYAnYtW6JXsOCCQNy2';
		this.dashboardImportservice.getDashboardImport(dashboardUrl).subscribe(
			(result) => {
				this.displayInfo = false;
				this.prepareOutput(result);
				this.loading = false;
			},
			() => {
				this.loading = false;
				this.displayInfo = false;
				this.showError();
			},
		);
	}
	/**
	 * show Error
	 */
	public showError() {
		this.notificationText = 'basics.biplusdesigner.import.errorText';
	}

	/**
	 * Prepared Import Dashboard Output Data
	 *
	 * @param {IDashboardImport[]} importResult
	 */
	public prepareOutput(importResult: IDashboardImport[]) {
		this.data = importResult; // prepare
		this.notificationText = 'basics.biplusdesigner.import.successText';
	}
}

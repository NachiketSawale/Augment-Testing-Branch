/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IReportData, PlatformCommonModule } from '@libs/platform/common';
import { UiCommonModule } from '@libs/ui/common';
import { IReportFormat, ProcurementRfqEmailFaxReportFormatLookupService } from '../../services/lookups/procurement-rfq-email-fax-report-format-lookup.service';
import { ProcurementRfqEmailFaxItemReportTemplatelookupService } from '../../services/lookups/procurement-rfq-email-fax-item-report-template-lookup.service';
import { ProcurementRfqEmailFaxBoqReportTemplatelookupService } from '../../services/lookups/procurement-rfq-email-fax-boq-report-template-lookup.service';
import { IReportBoqFormat, ProcurementRfqEmailFaxReportBoqFormatLookupService } from '../../services/lookups/procurement-rfq-email-fax-report-boq-format-lookup.service';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { BoqMainWizardGaebService, ExportOptions, GaebFormatLookupService, GaebTypeLookupService } from '@libs/boq/main';
import { ProcurementRfqSendEmailOrFaxService } from '../../wizards/procurement-rfq-send-email-or-fax.service';
import { ProcurementRfqEmailFaxRfqReportTemplatelookupService } from '../../services/lookups/procurement-rfq-email-fax-rfq-report-template-lookup.service';

/**
 * Interface representing the data structure for RFQ Email/Fax settings.
 */
export interface IData {
	rfqReportTemplate: number | null;
	boqReportTemplate: number | null;
	gaebFormatId: number | null;
	gaebTypeId: number | null;
	itemReportTemplate: number | null;
	formatTypeId: number | null;
	boqFormatTypeId: number | null;
}

@Component({
	selector: 'procurement-rfq-email-fax-setting',
	standalone: true,
	imports: [FormsModule, UiCommonModule, PlatformCommonModule, CommonModule],
	templateUrl: './procurement-rfq-email-fax-setting.component.html',
	styleUrl: './procurement-rfq-email-fax-setting.component.css',
})
/*
 * Procurement Rfq Email Fax Setting Component
 */
export class ProcurementRfqEmailFaxSettingComponent implements OnInit, OnDestroy {
	/**
	 * Injects the BoqMainWizardGaebService.
	 */
	private readonly boqMainGaebHelperService = inject(BoqMainWizardGaebService);

	/**
	 * Injects the ProcurementRfqSendEmailOrFaxService.
	 */
	private readonly dataService = inject(ProcurementRfqSendEmailOrFaxService);

	/**
	 * Injects the Lookup services.
	 */
	public readonly lookups = {
		rfqReportTemplate: inject(ProcurementRfqEmailFaxRfqReportTemplatelookupService),
		boqReportTemplate: inject(ProcurementRfqEmailFaxBoqReportTemplatelookupService),
		boqReportFormat: inject(ProcurementRfqEmailFaxReportBoqFormatLookupService),
		itemReportTemplate: inject(ProcurementRfqEmailFaxItemReportTemplatelookupService),
		itemReportFormat: inject(ProcurementRfqEmailFaxReportFormatLookupService),
		gaebExportType: inject(GaebTypeLookupService),
		gaebExportFormat: inject(GaebFormatLookupService),
	};

	/**
	 * Subject for managing component's lifecycle to unsubscribe from observables
	 */
	private readonly destroy$ = new Subject<void>();

	/**
	 * Cache for storing parameter options used in RFQ email/fax settings.
	 * Key: string
	 * Value: ExportOptions
	 */
	private paramCache: Record<string, ExportOptions> = {};

	/**
	 * Selected GAEB format ID
	 */
	private gaebFormatId: number = 0;

	/**
	 * Selected GAEB Type ID
	 */
	private gaebTypeId: number = 0;

	/**
	 * Updates parameter options in the cache.
	 * @param key The key for the parameter.
	 * @param options The export options to be stored.
	 */
	public setOptions(key: string, options: ExportOptions): void {
		this.paramCache[key] = options;
	}

	/**
	 * Retrieves stored parameter options from the cache.
	 * @param key The key to look up the parameter options.
	 * @returns The export options or `null` if not found.
	 */
	public getOptions(key: string): ExportOptions | null {
		return this.paramCache[key] || null;
	}

	/**
	 * Component data model.
	 */
	public data: IData = {
		rfqReportTemplate: null,
		boqReportTemplate: null,
		gaebFormatId: this.gaebFormatId ?? 0,
		gaebTypeId: this.gaebTypeId ?? 0,
		itemReportTemplate: null,
		formatTypeId: 1,
		boqFormatTypeId: 1,
	};

	/**
	 * Lookup options for configuring UI components.
	 */
	public lookupOptions = {
		rfqHeader: {
			showClearButton: true,
		},
		boqFormatType: {
			readonly: this.dataService.existedBoq,
		},
		boqReportTemplate: {
			showClearButton: true,
		},
		itemReportTemplate: {
			showClearButton: true,
		},
		boq: {
			readonly: this.dataService.existedBoq,
		},
		item: {
			readonly: this.dataService.existedItem,
		},
	};

	public ngOnInit(): void {
		const paramOptions = this.getOptions('RFQ.SENDEMAIL.PARAM');

		if (paramOptions) {
			this.gaebFormatId = this.boqMainGaebHelperService.getGaebFormatId(paramOptions);
			this.gaebTypeId = this.boqMainGaebHelperService.getGaebTypeId(paramOptions);
		}
	}

	/**
	 * Handles changes to the boqFormatTypeId  selection.
	 * Updates BOQ format and GAEB-related values based on the selected type.
	 */
	public changeCreateType(): void {
		if (this.data.boqFormatTypeId === 2) {
			this.data.gaebFormatId = null;
			this.data.gaebTypeId = null;
			this.lookupOptions.boqFormatType.readonly = true;
			this.dataService.existedBoq = true;
		} else {
			this.lookupOptions.boqFormatType.readonly = false;
			this.dataService.existedBoq = false;
			this.data.gaebFormatId = 0;
			this.data.gaebTypeId = 0;
		}
	}
	/**
	 * Handles changes to component data fields.
	 * Fetches lookup data and updates the corresponding service properties.
	 *
	 * @param value The new value for the field.
	 * @param field The field that changed.
	 */
	public valueChangeHandler<K extends keyof IData>(value: IData[K], field: K): void {
		this.data[field] = value;

		if (field === 'rfqReportTemplate' && this.data.rfqReportTemplate !== null) {
			this.dataService.previewIsDisabled = false;
			this.dataService.sendIsDisabled = false;

			this.lookups.rfqReportTemplate
				.getItemByKey({ id: this.data.rfqReportTemplate })
				.pipe(takeUntil(this.destroy$))
				.subscribe((rfqReport: IReportData) => {
					this.dataService.rfqReportTemplateItem = rfqReport;
				});
		}
		if (field === 'boqReportTemplate' && this.data.boqReportTemplate !== null) {
			this.lookups.boqReportTemplate
				.getItemByKey({ id: this.data.boqReportTemplate })
				.pipe(takeUntil(this.destroy$))
				.subscribe((boqReport: IReportData) => {
					this.dataService.boqReportTemplateItem = boqReport;
				});
		}
		if (field === 'boqFormatTypeId' && this.data.boqFormatTypeId !== null) {
			this.lookups.boqReportFormat
				.getItemByKey({ id: this.data.boqFormatTypeId })
				.pipe(takeUntil(this.destroy$))
				.subscribe((boqFormat: IReportBoqFormat) => {
					this.dataService.boqFormatType = boqFormat;
				});
		}
		if (field === 'itemReportTemplate' && this.data.itemReportTemplate !== null) {
			this.lookups.itemReportTemplate
				.getItemByKey({ id: this.data.itemReportTemplate })
				.pipe(takeUntil(this.destroy$))
				.subscribe((itemReport: IReportData) => {
					this.dataService.itemReportTemplateItem = itemReport;
				});
		}
		if (field === 'formatTypeId' && this.data.formatTypeId !== null) {
			this.lookups.itemReportFormat
				.getItemByKey({ id: this.data.formatTypeId })
				.pipe(takeUntil(this.destroy$))
				.subscribe((formatType: IReportFormat) => {
					this.dataService.formatType = formatType;
				});
		}
		if (this.data.gaebTypeId != null && this.data.gaebFormatId != null) {
			this.dataService.gaebFormatExt = this.boqMainGaebHelperService.getGaebExt(this.data.gaebFormatId, this.data.gaebTypeId);
		}
	}

	public ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}

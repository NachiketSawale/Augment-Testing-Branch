/*
 * Copyright(c) RIB Software GmbH
 */
import { Component, inject } from '@angular/core';
import { ColumnDef, FieldType } from '@libs/ui/common';
import { ProcurementInvoiceImportDataService } from '../../services/procurement-invoice-import-data.service';
import { map } from 'rxjs';
import { PlatformConfigurationService } from '@libs/platform/common';
import { HttpClient } from '@angular/common/http';
import { BasicsSharedReadOnlyGridComponent } from '@libs/basics/shared';
import { IInvInvoiceImportEntity } from '../../model';


/**
 * Warning Message interface.
 */
interface IWarningMessage {
    Id:number;
    WarningMessage?: string;
}

@Component({
    selector: 'procurement-invoice-import-invoice-warning',
    templateUrl: './import-invoice-warning.component.html',
    styleUrls: ['./import-invoice-warning.component.scss'],
})
export class ImportInvoiceWarningComponent extends BasicsSharedReadOnlyGridComponent<IWarningMessage, IInvInvoiceImportEntity > {
    
    private readonly configurationService = inject(PlatformConfigurationService);
    private readonly http = inject(HttpClient);

    public dataService = inject(ProcurementInvoiceImportDataService);
    public gridId :string = 'fc8e5673b0fc41fb972dea9110c8f986';

    protected readonly warningColumns: ColumnDef<IWarningMessage>[] = [
        {
            id: 'WarningMessage',
            label: { text: 'Warning Message' },
            type: FieldType.Remark,
            readonly: true,
            visible: true,
            width: 400,
            model: 'WarningMessage',
            sortable:true,
        }
    ];

    private readonly webApiBaseUrl = `${this.configurationService.webApiBaseUrl}procurement/invoice/`;

    protected readonly getWarningData = (selected: IInvInvoiceImportEntity) => {
        const selectedId = selected.Id;
        console.log(selectedId, 'selectedId');
        return this.http.get<string[]>(`${this.webApiBaseUrl}warn?mainItemId=${selectedId}`).pipe(
          map((response) => response.map((message, index) => ({ Id: index, WarningMessage: message })))
        );
      };
}

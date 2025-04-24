/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILookupDialogSearchFormEntity, UiCommonLookupTypeDataService } from '@libs/ui/common';
import { IRequisitionEntity } from './entities/requisition-entity';
import { BasicsCompanyLookupService } from '@libs/basics/shared';
import { ICompanyEntity } from '@libs/basics/interfaces';

/**
 * Requisition lookup service.
 */
@Injectable({
	providedIn: 'root'
})
export class ProcurementShareRequisitionLookupService<TEntity extends object = object> extends UiCommonLookupTypeDataService<IRequisitionEntity, TEntity> {
	public constructor() {
		super('reqheaderlookupview', {
			uuid: 'b554e83b841c4941a3cb97f4c462f4d7',
			idProperty: 'Id',
			valueMember: 'Id',
			displayMember: 'Code',
			showDialog: true,
			mergeConfig: true,
			gridConfig: {
				columns: [{
					id: 'code',
					model: 'Code',
					type: FieldType.Code,
					label: {
						text: 'Code',
						key: 'cloud.common.entityCode'
					},
					sortable: true,
					visible: true,
					readonly: true
				}]
			},
			dialogOptions: {
				headerText: {
					text: 'Assign Basis Requisition',
					key: 'procurement.common.reqHeaderUpdateInfo'
				}
			},
			dialogSearchForm: {
				visible: false,
				form: {
					config: {
						rows: [{
							id: 'company',
							label: {
								text: 'Company',
								key: 'cloud.common.entityCompany'
							},
							type: FieldType.Lookup,
							lookupOptions: createLookup<ILookupDialogSearchFormEntity, ICompanyEntity>({
								dataServiceToken: BasicsCompanyLookupService,
								showClearButton: true
							}),
							model: 'CompanyFk',
							sortOrder: 1,
							readonly: false
						}, {
							id: 'project',
							label: {
								text: 'Project',
								key: 'cloud.common.entityProject'
							},
							type: FieldType.Integer,// TODO-DRIZZLE: To be convert to lookup.
							model: 'ProjectFk',
							sortOrder: 2,
							readonly: false
						}]
					},
					rowChanged: (context) => {
						if (context.model === 'CompanyFk') {
							if (!context.value) {
								context.entity['ProjectFk'] = null;
								context.runtimeData.readOnlyFields.push({
									field: 'ProjectFk',
									readOnly: true
								});
							} else {
								context.runtimeData.readOnlyFields = context.runtimeData.readOnlyFields.filter(field => field.field !== 'ProjectFk');
							}
						}
					}
				}
			}
		});
	}
}
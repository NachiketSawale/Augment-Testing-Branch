/*
 * Copyright(c) RIB Software GmbH
 */

import { IBaselineEntity } from '@libs/scheduling/interfaces';
import { createLookup, FieldType, IFormConfig, IFormDialogConfig } from '@libs/ui/common';
import { SchedulingScheduleLookup } from '@libs/scheduling/shared';
import { SchedulingMainCreateBaselineGridDialogComponent } from '../../components/scheduling-main-create-baseline-grid-dialog.component';

export class CreateBaselineDialogConfig {
	public createFormConfiguration(baseline: IBaselineEntity,
	                               specList: {id?: number | null, description?: string | null}[]): IFormDialogConfig<IBaselineEntity>{
		return <IFormDialogConfig<IBaselineEntity>>{
			headerText: 'scheduling.main.createBaseline',
			id: 'CreateBaseline',
			entity: baseline,
			formConfiguration: <IFormConfig<IBaselineEntity>> {
				showGrouping: false,
				rows: [
					{
						id: 'Description',
						label: {text: 'Description', key:'basics.common.Description'},
						type: FieldType.InputSelect,
						options:
							{
								items: specList,
								valueMember: 'description',
								displayMember: 'description',
								inputDomain: 'description'
							},
						model: 'Description',
						sortOrder: 1
					},
					{
						id: 'Remarks',
						label: {text: 'Remarks', key: 'cloud.common.remark'},
						type: FieldType.Remark,
						model: 'Remark',
						sortOrder: 2
					},
					{
						id: 'Schedule',
						label: {text: 'Schedule', key: 'scheduling.main.schedule'},
						type: FieldType.Lookup,
						lookupOptions: createLookup(
							{
								dataServiceToken: SchedulingScheduleLookup
							}
						),
						model: 'PsdScheduleFk',
						readonly: true,
						sortOrder: 3
					},
					{
						id: 'Baselines',
						label: {text: 'Baseline', key: 'scheduling.main.baseline'},
						type: FieldType.CustomComponent,
						componentType: SchedulingMainCreateBaselineGridDialogComponent,
						sortOrder: 4
					}
				]
			}
		};
	}
}
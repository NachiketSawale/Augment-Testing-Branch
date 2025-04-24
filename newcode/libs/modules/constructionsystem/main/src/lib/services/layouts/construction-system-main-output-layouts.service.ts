import { ConstructionSystemCommonOutputLayoutService } from '@libs/constructionsystem/common';
import { isUndefined } from 'lodash';
import { Injectable } from '@angular/core';
import { ICosInsErrorEntity } from '../../model/entities/cos-ins-error-entity.interfae';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainOutputLayoutsService {
	public generateLayout() {
		const COS_COMMON_LAYOUT = new ConstructionSystemCommonOutputLayoutService<ICosInsErrorEntity>().generateLayout();
		if (!isUndefined(COS_COMMON_LAYOUT.groups) && !isUndefined(COS_COMMON_LAYOUT.labels) && !isUndefined(COS_COMMON_LAYOUT.overloads)) {
			return {
				groups: [
					{
						gid: 'basicData',
						title: {
							key: 'cloud.common.entityProperties',
							text: 'Basic Data',
						},
						attributes: [...COS_COMMON_LAYOUT.groups[0].attributes, 'LoggingSource', 'Instance'],
					},
				],
				labels: {
					...COS_COMMON_LAYOUT.labels,
					LoggingSource: { key: 'constructionsystem.executionScriptOutput.type' },
					Instance: { key: 'constructionsystem.executionScriptOutput.instance' },
				},
				overloads: {
					...COS_COMMON_LAYOUT.overloads,
					LoggingSource: {
						tooltip: 'type',
						sortable: true,
						searchable: true,
						width: 50,
					},
					Instance: {
						tooltip: 'Instance Code',
						sortable: true,
						searchable: true,
						width: 50,
					},
				},
			};
		}
		return {};
	}
}

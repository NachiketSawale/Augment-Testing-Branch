/*
 * Copyright(c) RIB Software GmbH
 */

import { IGroupingstate, IGroupingType, ProjectControlsGroupingType } from '../../model/entities/dashboard-container-entity-models';
import { Injectable } from '@angular/core';
import { isString, isNumber, clone, forEach, isArray, find, isEmpty } from 'lodash';
import { IContrGroupColumn } from '../../model/controlling-projectcontrols-cost-analysis-request.interface';

@Injectable({
	providedIn: 'root',
})
export class ControllingProjectcontrolsDashboardStructureDataService {
	private getMetadataByColumn(column: IGroupingType) {
		return column.Metadata;
	}

	public isGenericGroup(column: IGroupingType) {
		const def = this.getMetadataByColumn(column);
		return typeof def !== 'undefined' && typeof def.GroupType !== 'undefined' && def.GroupType === 3;
	}

	public getGroupingColumns(item: IGroupingstate[]): IContrGroupColumn[] {
		return [];
	}

	private getAllGroupingColumns() {
		const allGroupingColumns: IContrGroupColumn[] = [];

		const groupingTypes = clone(ProjectControlsGroupingType);

		forEach(groupingTypes, (group) => {
			if (group.Metadata) {
				if (isArray(group.Dateoption) && !isEmpty(group.Dateoption)) {
					forEach(group.Dateoption, function (option) {
						allGroupingColumns.push({
							Id: group.Metadata.GroupId,
							GroupColumnId: group.Metadata.GroupColumnName,
							GroupType: (group.Metadata && group.Metadata.GroupType) || 1,
							Depth: isNumber(group.Depth) ? group.Depth : 8,
							DateOption: option,
							SortingBy: isNumber(group.SortDesc) ? group.SortDesc : 0,
						});
					});
				} else {
					allGroupingColumns.push({
						Id: group.Metadata.GroupId,
						GroupColumnId: group.Metadata.GroupColumnName,
						GroupType: (group.Metadata && group.Metadata.GroupType) || 1,
						Depth: isNumber(group.Depth) ? group.Depth : 8,
						DateOption: isString(group.Dateoption) ? group.Dateoption : '',
						SortingBy: isNumber(group.SortDesc) ? group.SortDesc : 0,
					});
				}
			}
		});

		return allGroupingColumns;
	}

	public getMergedAllGroupingColumns(target: IContrGroupColumn[]) {
		const source = this.getAllGroupingColumns();
		if (!isArray(target) || !isArray(target) || target.length < 1 || source.length < 1) {
			return [];
		}

		forEach(source, function (s) {
			if (!find(target, { id: s.Id })) {
				target.push(s);
			}
		});

		return target;
	}
}

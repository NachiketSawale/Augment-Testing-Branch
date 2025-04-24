/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {ColumnDef, FieldType} from '@libs/ui/common';
import {IProjectEntity} from '@libs/project/interfaces';

@Injectable({
    providedIn: 'root'
})
export class ControllingStructureProjectUiService{
    public getGridColumns() {
        return [
            {
                id: 'ProjectNo',
                model: 'ProjectNo',
                type: FieldType.Description,
                label: {
                    text: 'Project Number',
                    key: 'controlling.structure.ProjectNumber',
                },
                visible: true,
                readonly: true,
            },
            {
                id: 'projectName',
                model: 'ProjectName',
                type: FieldType.Description,
                label: {
                    text: 'Project Name',
                    key: 'controlling.structure.ProjectName',
                },
                visible: true,
                readonly: true,
            }
        ] as Array<ColumnDef<IProjectEntity>>;
    }

}
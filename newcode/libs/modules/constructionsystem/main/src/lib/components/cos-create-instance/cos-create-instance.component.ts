/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import { COS_CREATE_INSTANCE_OPTION_TOKEN } from '../../model/entities/token/cos-create-instance-option.interface';
import { PlatformCommonModule } from '@libs/platform/common';
import { FormsModule } from '@angular/forms';
import { CosCreateInstanceType } from '../../model/enums/cos-create-instance-type.enum';

@Component({
	selector: 'constructionsystem-main-cos-create-instance',
	templateUrl: './cos-create-instance.component.html',
	styleUrls: ['./cos-create-instance.component.scss'],
	standalone: true,
	imports: [PlatformCommonModule, FormsModule],
})
export class CosCreateInstanceComponent {
	public createInstanceOption = inject(COS_CREATE_INSTANCE_OPTION_TOKEN);
	protected readonly CosCreateInstanceType = CosCreateInstanceType;
}

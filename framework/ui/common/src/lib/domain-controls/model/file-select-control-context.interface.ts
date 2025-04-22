import { IControlContext } from './control-context.interface';
import { IAdditionalFileSelectOptions } from '../../model/fields/additional/additional-file-select-options.interface';
import { IFileSelectControlResult } from '@libs/platform/common';

export interface IFileSelectControlContext extends IControlContext<IFileSelectControlResult | IFileSelectControlResult[]>, IAdditionalFileSelectOptions {}

import { ValidationResult } from '../validation/validation-result.class';
import { RevalidationInfo } from './revalidation-info.class';

export type Revalidator<T extends object> = (info: RevalidationInfo<T>) => Promise<ValidationResult> | ValidationResult;
import { BaseQueryParametersDto } from '../../shared/base-parameters.dto';

export class FindUsersQueryDto extends BaseQueryParametersDto {
  name: string;
  email: string;
  status: boolean;
  role: string;
}

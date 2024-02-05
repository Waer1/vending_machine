import { ConfigService } from '@nestjs/config';

const getConfigVariables = async (variableName: string) => {
  const configService: ConfigService = new ConfigService();
  return await configService.get(variableName);
};

export default getConfigVariables;

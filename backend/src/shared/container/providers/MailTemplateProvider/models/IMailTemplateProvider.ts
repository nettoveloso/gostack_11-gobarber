import IParseMailTamplateDTO from '../dtos/IParseMailTemplateDTO';

export default interface IMailTemplateProvider {
  parse(data: IParseMailTamplateDTO): Promise<string>;
}

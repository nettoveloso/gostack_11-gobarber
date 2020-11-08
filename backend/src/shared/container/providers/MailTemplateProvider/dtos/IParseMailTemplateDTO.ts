interface ITemplateVariables {
  [key: string]: string | number;
}

export default interface IParseMailTamplateDTO {
  file: string;
  variables: ITemplateVariables;
}

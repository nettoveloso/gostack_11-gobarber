export default interface IMailProvider {
  sendMail(to: string, bod: string): Promise<void>;
}

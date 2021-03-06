import { container } from 'tsyringe';

import IStorageProvider from './StorageProvider/models/IStorageProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

import IMailProvider from './MailProvider/models/IMailProvider';
// import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import MailtrapMailProvider from './MailProvider/implementations/MailtrapMailProvider';

import IMailTemplateProvider from './MailTemplateProvider/models/IMailTemplateProvider';
import HandlebarsMailTempalteProvider from './MailTemplateProvider/implementations/HandlebarsMailTemplateProvider';

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  DiskStorageProvider,
);

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider',
  HandlebarsMailTempalteProvider,
);

container.registerInstance<IMailProvider>(
  'MailProvider',
  container.resolve(MailtrapMailProvider),
);

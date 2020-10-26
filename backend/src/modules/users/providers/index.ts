import { container } from 'tsyringe';

import IHashProvider from './HashProvider/models/IHasProvider';
import BCryptHashProvider from './HashProvider/implementations/BCryptHasProvider';

container.registerSingleton<IHashProvider>('HasProvider', BCryptHashProvider);

interface ImailConfig {
  driver: 'etherel' | 'ses';
}

export default {
  driver: process.env.MAIL_DRIVER || 'ethereal',
} as ImailConfig;

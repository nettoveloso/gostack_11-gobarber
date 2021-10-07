interface ImailConfig {
  driver: 'ethereal' | 'mailtrap';
}

export default {
  driver: process.env.MAIL_DRIVER || 'mailtrap',
} as ImailConfig;

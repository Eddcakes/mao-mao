import type { DenonConfig } from 'https://deno.land/x/denon/mod.ts';
import { config as env } from 'https://deno.land/x/dotenv/mod.ts';

const config: DenonConfig = {
  scripts: {
    start: {
      cmd: 'app.ts',
      desc: 'run my app.ts file',
      env: env({ safe: true }),
      allow: ['env', 'net', 'read'],
    },
  },
};

export default config;

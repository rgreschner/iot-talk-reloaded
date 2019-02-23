import * as bunyan from 'bunyan';
import * as PrettyStream from 'bunyan-prettystream';

const prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

export const logger = bunyan.createLogger({
  name: 'data-mock',
  level: 'info',
  streams: [
    {
      level: 'info',
      type: 'raw',
      stream: prettyStdOut
    }
  ]
});

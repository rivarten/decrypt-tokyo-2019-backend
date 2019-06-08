import * as path from 'path';
import * as shell from 'shelljs';

shell.cp(
    '-R',
    path.join(__dirname, '../src/views'),
    path.join(__dirname, '../dist/'),
);

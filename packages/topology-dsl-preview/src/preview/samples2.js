export const samples2 = [
`import { choice, terminal, sequence} from 'topology-dsl';
import { az_Linux_Virtual_Machines } from './assets/js/Azure_Products_Icons/index.js';
import { gcp_Compute_Engine, gcp_Cloud_Storage, gcp_Cloud_PubSub } from 'gcp-dsl';

const am = az_Linux_Virtual_Machines;
const gm = gcp_Compute_Engine;

export const v1 = sequence(
  terminal('b'), 
  choice(
    'c',
    gm('a')._title_('GCP VM-A'),
    am('b')._title_('AZ VM-B')
  ),
  sequence(
    gm('c')._title_('GCP VM-C'),
    am('c')._title_('AZ VM-C'),
    gcp_Cloud_Storage('S1'),
    gcp_Cloud_PubSub('PS1'),
    am('d')._title_('AZ VM-A')
  )
);

v1._title_('CLOUD DIAGRAM1')._id_('DIAGRAM1');

export const testflow = am('b');
testflow._title_('AZ VM-B');
`,
`import { choice, terminal, sequence} from 'topology-dsl';
export const testflow = choice(
  terminal('a')._in_('a','b')._out_('a','b'),
  choice('e', 'd'),
  sequence(
    terminal('b'), 
    terminal('c')._in_('a','b'),
    sequence('c','d')._in_('a','b')._out_('e','f')
  ),
  sequence('c','d')
);`,
`import { choice, terminal, sequence, repeat, optional, zeroOrMore } from 'topology-dsl';
export const testflow = choice(
  terminal('a')._in_('a','b')._out_('a','b'),
  choice('e', 'd'),
  sequence(
    terminal('b'),
    terminal('c')._in_('a','b'),
    sequence('c','d')._in_('a','b')._out_('e','f')
  ),
  sequence('c','d')
);

let selectClause = () => sequence('a', 'b', repeat(optional('c')), zeroOrMore('d'));
let fromClause = function a() {
    return  choice('1', '2', selectClause, '4');
};

export const v1 = selectClause();
export const v2 = fromClause();
`,
`import { choice, terminal, sequence, repeat, optional, zeroOrMore } from 'topology-dsl';
let selectClause = () => sequence('a', 'b', repeat(optional('c')), zeroOrMore('d'));
let fromClause = function a() {
    return  choice('1', '2', selectClause, '4');
};

export const v1 = selectClause();
export const v2 = fromClause();
`,
`import { choice, terminal, sequence, repeat, optional, zeroOrMore } from 'topology-dsl';
import { path1, path2, path3 } from './assets/js/dummy.js';

export const v1 = sequence(path1, path2);

export const v2 = path1;
export const v3 = path2;
export const v4 = path3;
`,
'./assets/js/dummy.js'
];
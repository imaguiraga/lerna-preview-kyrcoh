export const samples2 = [
  `import { 
  choice, terminal, sequence, group, 
  fanIn, fanOut, fanIn_fanOut 
} from 'topology-dsl';

export const va = fanIn(['e1', 'd1'], 'fanIn');
export const vb = fanOut('fanOut', ['e1', 'd1']);
export const vc = fanIn_fanOut(['e1', 'd1'], 'fanIn', ['e2', 'd2']);

export const v3 = choice('choice', ['e1', 'd1']);
v3.to('6').sequence('e2', 'd2').choice('choice', ['e3', 'd3']);

export const v1 =
  sequence(
    terminal('a'),
    terminal('b')
  );
export const testflow =
  sequence(
    [
      terminal('a'),
      terminal('b'),
      sequence(
        [
          terminal('a'),
          terminal('b')
        ],
        'merge',
        group([
          terminal('c'),
          terminal('d')
        ]),
        terminal('e')
      )
    ],
    [
      terminal('c'),
      terminal('d')
    ],
    terminal('e')
  );`,
  `import { choice, terminal, sequence } from 'topology-dsl';
  import { 
    aws_AWS_Lake_Formation,
    aws_AWS_Data_Pipeline
  } from './assets/js/AWS/index.js';
  
  import { 
    aws_Amazon_Simple_Storage_Service
  } from 'aws-dsl';
  
  const s3 = aws_Amazon_Simple_Storage_Service;
  
  const choice1 = choice('choice',[
    s3('c')._title_('AZ BLOB-A'),
        s3('a')._title_('AZ SQL-A')
  ])._down_();
    
  export const sequence1 = sequence(
      s3('c')._title_('GCP VM-C'),
      aws_AWS_Data_Pipeline('b')._title_('AZ CACHE-B'),
      choice1,
      aws_AWS_Lake_Formation('c')._title_('AZ VM-C')
    );	
  `,
`import { choice, terminal, sequence } from 'topology-dsl';
import { 
  gcp_Cloud_SQL,
  gcp_Memorystore
} from './assets/js/GCP/index.js';

import { 
  gcp_Compute_Engine,
  gcp_Cloud_Storage,
  gcp_Pub_Sub 
} from 'gcp-dsl';

const gce = gcp_Compute_Engine;

const choice1 = choice('choice',[
  gcp_Cloud_Storage('c')._title_('AZ BLOB-A'),
      gcp_Cloud_SQL('a')._title_('AZ SQL-A')
])._down_();
	
export const sequence1 = sequence(
    gce('c')._title_('GCP VM-C'),
    gcp_Memorystore('b')._title_('AZ CACHE-B'),
    choice1,
    gce('c')._title_('AZ VM-C')
  );	
  
export const v1 = sequence(
  terminal('b'), 
  choice('choice',[
    'c',
    gce('a')._title_('GCP VM-A'),
    gce('b')._title_('AZ VM-B')
  ]),
  sequence1,
  gcp_Cloud_Storage('S1'),
  gcp_Pub_Sub('PS1')
);

v1._title_('CLOUD DIAGRgce1')._id_('DIAGRgce1');

export const testflow = gce('b');
testflow._title_('AZ VM-B');
`,
`import { choice, terminal, sequence } from 'topology-dsl';

export const testflow = choice('choice',[
  terminal('a')._in_('1','2')._out_('3','4'),
  choice('choice',['e', 'd']),
  sequence(
    terminal('b'),
    terminal('c')._in_('5','6'),
    sequence('c','d')._in_('7','8b')._out_('e','f')
  ),
  sequence('c','d')
  ]);

let v1 = terminal('a');
export const testflow2 = choice('choice',[
  v1.from('1','2')]

).to('a1','b1');

let v2 = choice('choice',['e1', 'd1']);
v1.from('4').to(v2);
v1.from('5').to('6').choice('choice',['e2', 'd2']).choice('choice',['e3', 'd3']);

`,
`import {
  choice,
  terminal,
  sequence,
  repeat,
  optional,
  zeroOrMore
} from 'topology-dsl';

export const testflow = choice('choice',[
  terminal('a')._in_('1','2')._out_('3','4'),
  choice('choice',['e', 'd']),
  sequence(
    terminal('b'),
    terminal('c')._in_('5','6'),
    sequence('c','d')._in_('7','8b')._out_('e','f')
  ),
  sequence('c','d')
  ]);

let selectClause = () => sequence('a', 'b', repeat(optional('c')), zeroOrMore('d'));
let fromClause = function a() {
    return  choice('choice',['1', '2', selectClause, '4']);
};

export const v1 = selectClause();
export const v2 = fromClause();
`,
`import {
  choice,
  terminal,
  sequence,
  repeat,
  optional,
  zeroOrMore
} from 'topology-dsl';

let selectClause = () => sequence('a', 'b', repeat(optional('c')), zeroOrMore('d'));
let fromClause = function a() {
    return  choice('choice',['1', '2', selectClause, '4']);
};

export const v1 = selectClause();
export const v2 = fromClause();
`,
'./assets/js/dummy.js',
`import {
  choice,
  terminal,
  sequence,
  repeat,
  optional,
  zeroOrMore
} from 'topology-dsl';

import { path1, path2, path3 } from './assets/js/dummy.js';

export const v1 = sequence(path1, path2);

export const v2 = path1;
export const v3 = path2;
export const v4 = path3;
`,
`import { choice, terminal, sequence, fanOut, fanIn, group } from 'topology-dsl';
export const v1 = sequence(
  'Create \\nAggregations',
  'Store \\nAggregations'
)._down_()._title_('Step 2');

const phase1 = sequence(
	fanIn(
		'GBP.EUR',
		'GBP.BRL',
		'EUR.AUD',
		'GBP.JPY'
	)._title_('Step 1'),
	v1
)._title_('Phase 1');

const phase2 = sequence(
	group(
		'Create Operating \\nWindows'
	)._title_('Step 3'),
	sequence(
		'Compute \\nCorrelations',
		fanOut(
			'Store \\nCorrelations',
			'Publish \\nCorrelations',
		)
	)._down_()._title_('Step 4')
)._title_('Phase 2');

export const flow = sequence(phase1,phase2);`
];
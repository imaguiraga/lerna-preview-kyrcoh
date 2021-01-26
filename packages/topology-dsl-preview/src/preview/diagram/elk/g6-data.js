export const data = {
  "nodes": [
   {
    "id": "$root",
    "x": -320,
    "y": -82.5,
    "size": [
     640,
     165
    ],
    "children": [
     "sequence.2"
    ]
   },
   {
    "id": "sequence.2",
    "label": "sequence.2",
    "x": -272,
    "y": -58.5,
    "size": [
     592,
     141
    ],
    "children": [
     "terminal.0",
     "terminal.1"
    ]
   },
   {
    "id": "terminal.0",
    "label": "terminal.0",
    "x": -72,
    "y": 21,
    "size": [
     240,
     80
    ],
    "children": []
   },
   {
    "id": "terminal.1",
    "label": "terminal.1",
    "x": 232,
    "y": 21,
    "size": [
     240,
     80
    ],
    "children": []
   }
  ],
  "edges": [
   {
    "id": "edge.0",
    "source": "sequence.2",
    "target": "terminal.0",
    "controlPoints": [
     {
      "x": 20,
      "y": 101
     },
     {
      "x": 36,
      "y": 101
     }
    ]
   },
   {
    "id": "edge.1",
    "source": "terminal.0",
    "target": "terminal.1",
    "controlPoints": [
     {
      "x": 300,
      "y": 101
     },
     {
      "x": 340,
      "y": 101
     }
    ]
   },
   {
    "id": "edge.2",
    "source": "terminal.1",
    "target": "sequence.2",
    "controlPoints": [
     {
      "x": 604,
      "y": 101
     },
     {
      "x": 620,
      "y": 101
     }
    ]
   }
  ]
 };
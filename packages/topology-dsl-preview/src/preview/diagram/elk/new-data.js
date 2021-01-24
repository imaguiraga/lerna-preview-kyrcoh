export const data = {
  "nodes": [
   {
    "id": "$root",
    "x": 0,
    "y": 0,
    "width": 1360,
    "height": 326,
    "ports": {
     "items": [],
     "groups": {
      "abs": {
       "position": {
        "name": "absolute"
       },
       "zIndex": 10,
       "attrs": {
        "circle": {
         "r": 8,
         "magnet": true,
         "stroke": "#31d0c6",
         "strokeWidth": 2,
         "fill": "#fff"
        },
        "text": {
         "fontSize": 12,
         "fill": "#888"
        }
       }
      }
     }
    },
    "children": [
     "sequence.8"
    ]
   },
   {
    "id": "sequence.8",
    "label": "sequence.8",
    "data": {
     "idGenIt": {},
     "title": "sequence.8",
     "resourceType": "sequence",
     "subType": "sequence",
     "tagName": "flow",
     "id": "sequence.8",
     "provider": "default",
     "compound": true,
     "_start": {
      "idGenIt": {},
      "title": "terminal.9",
      "resourceType": "terminal",
      "subType": "terminal",
      "tagName": "port",
      "id": "terminal.9",
      "provider": "default",
      "compound": false,
      "_start": null,
      "_finish": null,
      "data": {},
      "link": null,
      "name": "terminal.9",
      "elts": [
       "start"
      ],
      "inputElts": [],
      "outputElts": []
     },
     "_finish": {
      "idGenIt": {},
      "title": "terminal.10",
      "resourceType": "terminal",
      "subType": "terminal",
      "tagName": "port",
      "id": "terminal.10",
      "provider": "default",
      "compound": false,
      "_start": null,
      "_finish": null,
      "data": {},
      "link": null,
      "name": "terminal.10",
      "elts": [
       "finish"
      ],
      "inputElts": [],
      "outputElts": []
     },
     "data": {},
     "link": null,
     "name": "sequence.8",
     "elts": [
      {
       "idGenIt": {},
       "title": "GCP VM-C",
       "resourceType": "terminal",
       "subType": "gcp_Compute_Engine",
       "tagName": "flow",
       "id": "gcp_Compute_Engine.5",
       "provider": "default",
       "compound": false,
       "_start": null,
       "_finish": null,
       "data": {},
       "link": null,
       "name": "terminal.5",
       "elts": [
        "c"
       ],
       "inputElts": [],
       "outputElts": []
      },
      {
       "idGenIt": {},
       "title": "AZ CACHE-B",
       "resourceType": "terminal",
       "subType": "az_Azure_Cache_for_Redis",
       "tagName": "flow",
       "id": "az_Azure_Cache_for_Redis.6",
       "provider": "default",
       "compound": false,
       "_start": null,
       "_finish": null,
       "data": {},
       "link": null,
       "name": "terminal.6",
       "elts": [
        "b"
       ],
       "inputElts": [],
       "outputElts": []
      },
      {
       "idGenIt": {},
       "title": "fanOut_fanIn.2",
       "resourceType": "fanOut_fanIn",
       "subType": "choice",
       "tagName": "flow",
       "id": "choice.2",
       "provider": "default",
       "compound": true,
       "_start": {
        "idGenIt": {},
        "title": "terminal.3",
        "resourceType": "terminal",
        "subType": "terminal",
        "tagName": "port",
        "id": "terminal.3",
        "provider": "default",
        "compound": false,
        "_start": null,
        "_finish": null,
        "data": {},
        "link": null,
        "name": "terminal.3",
        "elts": [
         "start"
        ],
        "inputElts": [],
        "outputElts": []
       },
       "_finish": {
        "idGenIt": {},
        "title": "terminal.4",
        "resourceType": "terminal",
        "subType": "terminal",
        "tagName": "port",
        "id": "terminal.4",
        "provider": "default",
        "compound": false,
        "_start": null,
        "_finish": null,
        "data": {},
        "link": null,
        "name": "terminal.4",
        "elts": [
         "finish"
        ],
        "inputElts": [],
        "outputElts": []
       },
       "data": {},
       "link": null,
       "name": "fanOut_fanIn.2",
       "elts": [
        {
         "idGenIt": {},
         "title": "AZ BLOB-A",
         "resourceType": "terminal",
         "subType": "az_Blob_Storage",
         "tagName": "flow",
         "id": "az_Blob_Storage.0",
         "provider": "default",
         "compound": false,
         "_start": null,
         "_finish": null,
         "data": {},
         "link": null,
         "name": "terminal.0",
         "elts": [
          "c"
         ],
         "inputElts": [],
         "outputElts": []
        },
        {
         "idGenIt": {},
         "title": "AZ SQL-A",
         "resourceType": "terminal",
         "subType": "az_Azure_SQL_Database",
         "tagName": "flow",
         "id": "az_Azure_SQL_Database.1",
         "provider": "default",
         "compound": false,
         "_start": null,
         "_finish": null,
         "data": {},
         "link": null,
         "name": "terminal.1",
         "elts": [
          "a"
         ],
         "inputElts": [],
         "outputElts": []
        }
       ],
       "inputElts": [],
       "outputElts": []
      },
      {
       "idGenIt": {},
       "title": "AZ VM-C",
       "resourceType": "terminal",
       "subType": "az_Linux_Virtual_Machines",
       "tagName": "flow",
       "id": "az_Linux_Virtual_Machines.7",
       "provider": "default",
       "compound": false,
       "_start": null,
       "_finish": null,
       "data": {},
       "link": null,
       "name": "terminal.7",
       "elts": [
        "c"
       ],
       "inputElts": [],
       "outputElts": []
      }
     ],
     "inputElts": [],
     "outputElts": []
    },
    "x": 24,
    "y": 12,
    "width": 1312,
    "height": 302,
    "ports": {
     "items": [
      {
       "group": "abs",
       "id": "terminal.9",
       "args": {
        "x": 12,
        "y": 146
       },
       "data": {
        "idGenIt": {},
        "title": "terminal.9",
        "resourceType": "terminal",
        "subType": "terminal",
        "tagName": "port",
        "id": "terminal.9",
        "provider": "default",
        "compound": false,
        "_start": null,
        "_finish": null,
        "data": {},
        "link": null,
        "name": "terminal.9",
        "elts": [
         "start"
        ],
        "inputElts": [],
        "outputElts": []
       }
      },
      {
       "group": "abs",
       "id": "terminal.10",
       "args": {
        "x": 1340,
        "y": 146
       },
       "data": {
        "idGenIt": {},
        "title": "terminal.10",
        "resourceType": "terminal",
        "subType": "terminal",
        "tagName": "port",
        "id": "terminal.10",
        "provider": "default",
        "compound": false,
        "_start": null,
        "_finish": null,
        "data": {},
        "link": null,
        "name": "terminal.10",
        "elts": [
         "finish"
        ],
        "inputElts": [],
        "outputElts": []
       }
      }
     ],
     "groups": {
      "abs": {
       "position": {
        "name": "absolute"
       },
       "zIndex": 10,
       "attrs": {
        "circle": {
         "r": 8,
         "magnet": true,
         "stroke": "#31d0c6",
         "strokeWidth": 2,
         "fill": "#fff"
        },
        "text": {
         "fontSize": 12,
         "fill": "#888"
        }
       }
      }
     }
    },
    "children": [
     "gcp_Compute_Engine.5",
     "az_Azure_Cache_for_Redis.6",
     "choice.2",
     "az_Linux_Virtual_Machines.7"
    ]
   },
   {
    "id": "gcp_Compute_Engine.5",
    "label": "gcp_Compute_Engine.5",
    "data": {
     "idGenIt": {},
     "title": "GCP VM-C",
     "resourceType": "terminal",
     "subType": "gcp_Compute_Engine",
     "tagName": "flow",
     "id": "gcp_Compute_Engine.5",
     "provider": "default",
     "compound": false,
     "_start": null,
     "_finish": null,
     "data": {},
     "link": null,
     "name": "terminal.5",
     "elts": [
      "c"
     ],
     "inputElts": [],
     "outputElts": []
    },
    "x": 36,
    "y": 110,
    "width": 240,
    "height": 80,
    "ports": {
     "items": [],
     "groups": {
      "abs": {
       "position": {
        "name": "absolute"
       },
       "zIndex": 10,
       "attrs": {
        "circle": {
         "r": 8,
         "magnet": true,
         "stroke": "#31d0c6",
         "strokeWidth": 2,
         "fill": "#fff"
        },
        "text": {
         "fontSize": 12,
         "fill": "#888"
        }
       }
      }
     }
    },
    "children": []
   },
   {
    "id": "az_Azure_Cache_for_Redis.6",
    "label": "az_Azure_Cache_for_Redis.6",
    "data": {
     "idGenIt": {},
     "title": "AZ CACHE-B",
     "resourceType": "terminal",
     "subType": "az_Azure_Cache_for_Redis",
     "tagName": "flow",
     "id": "az_Azure_Cache_for_Redis.6",
     "provider": "default",
     "compound": false,
     "_start": null,
     "_finish": null,
     "data": {},
     "link": null,
     "name": "terminal.6",
     "elts": [
      "b"
     ],
     "inputElts": [],
     "outputElts": []
    },
    "x": 316,
    "y": 110,
    "width": 240,
    "height": 80,
    "ports": {
     "items": [],
     "groups": {
      "abs": {
       "position": {
        "name": "absolute"
       },
       "zIndex": 10,
       "attrs": {
        "circle": {
         "r": 8,
         "magnet": true,
         "stroke": "#31d0c6",
         "strokeWidth": 2,
         "fill": "#fff"
        },
        "text": {
         "fontSize": 12,
         "fill": "#888"
        }
       }
      }
     }
    },
    "children": []
   },
   {
    "id": "choice.2",
    "label": "choice.2",
    "data": {
     "idGenIt": {},
     "title": "fanOut_fanIn.2",
     "resourceType": "fanOut_fanIn",
     "subType": "choice",
     "tagName": "flow",
     "id": "choice.2",
     "provider": "default",
     "compound": true,
     "_start": {
      "idGenIt": {},
      "title": "terminal.3",
      "resourceType": "terminal",
      "subType": "terminal",
      "tagName": "port",
      "id": "terminal.3",
      "provider": "default",
      "compound": false,
      "_start": null,
      "_finish": null,
      "data": {},
      "link": null,
      "name": "terminal.3",
      "elts": [
       "start"
      ],
      "inputElts": [],
      "outputElts": []
     },
     "_finish": {
      "idGenIt": {},
      "title": "terminal.4",
      "resourceType": "terminal",
      "subType": "terminal",
      "tagName": "port",
      "id": "terminal.4",
      "provider": "default",
      "compound": false,
      "_start": null,
      "_finish": null,
      "data": {},
      "link": null,
      "name": "terminal.4",
      "elts": [
       "finish"
      ],
      "inputElts": [],
      "outputElts": []
     },
     "data": {},
     "link": null,
     "name": "fanOut_fanIn.2",
     "elts": [
      {
       "idGenIt": {},
       "title": "AZ BLOB-A",
       "resourceType": "terminal",
       "subType": "az_Blob_Storage",
       "tagName": "flow",
       "id": "az_Blob_Storage.0",
       "provider": "default",
       "compound": false,
       "_start": null,
       "_finish": null,
       "data": {},
       "link": null,
       "name": "terminal.0",
       "elts": [
        "c"
       ],
       "inputElts": [],
       "outputElts": []
      },
      {
       "idGenIt": {},
       "title": "AZ SQL-A",
       "resourceType": "terminal",
       "subType": "az_Azure_SQL_Database",
       "tagName": "flow",
       "id": "az_Azure_SQL_Database.1",
       "provider": "default",
       "compound": false,
       "_start": null,
       "_finish": null,
       "data": {},
       "link": null,
       "name": "terminal.1",
       "elts": [
        "a"
       ],
       "inputElts": [],
       "outputElts": []
      }
     ],
     "inputElts": [],
     "outputElts": []
    },
    "x": 608,
    "y": 61,
    "width": 424,
    "height": 241,
    "ports": {
     "items": [
      {
       "group": "abs",
       "id": "terminal.3",
       "args": {
        "x": 596,
        "y": 146
       },
       "data": {
        "idGenIt": {},
        "title": "terminal.3",
        "resourceType": "terminal",
        "subType": "terminal",
        "tagName": "port",
        "id": "terminal.3",
        "provider": "default",
        "compound": false,
        "_start": null,
        "_finish": null,
        "data": {},
        "link": null,
        "name": "terminal.3",
        "elts": [
         "start"
        ],
        "inputElts": [],
        "outputElts": []
       }
      },
      {
       "group": "abs",
       "id": "terminal.4",
       "args": {
        "x": 1036,
        "y": 146
       },
       "data": {
        "idGenIt": {},
        "title": "terminal.4",
        "resourceType": "terminal",
        "subType": "terminal",
        "tagName": "port",
        "id": "terminal.4",
        "provider": "default",
        "compound": false,
        "_start": null,
        "_finish": null,
        "data": {},
        "link": null,
        "name": "terminal.4",
        "elts": [
         "finish"
        ],
        "inputElts": [],
        "outputElts": []
       }
      }
     ],
     "groups": {
      "abs": {
       "position": {
        "name": "absolute"
       },
       "zIndex": 10,
       "attrs": {
        "circle": {
         "r": 8,
         "magnet": true,
         "stroke": "#31d0c6",
         "strokeWidth": 2,
         "fill": "#fff"
        },
        "text": {
         "fontSize": 12,
         "fill": "#888"
        }
       }
      }
     }
    },
    "children": [
     "az_Blob_Storage.0",
     "az_Azure_SQL_Database.1"
    ]
   },
   {
    "id": "az_Blob_Storage.0",
    "label": "az_Blob_Storage.0",
    "data": {
     "idGenIt": {},
     "title": "AZ BLOB-A",
     "resourceType": "terminal",
     "subType": "az_Blob_Storage",
     "tagName": "flow",
     "id": "az_Blob_Storage.0",
     "provider": "default",
     "compound": false,
     "_start": null,
     "_finish": null,
     "data": {},
     "link": null,
     "name": "terminal.0",
     "elts": [
      "c"
     ],
     "inputElts": [],
     "outputElts": []
    },
    "x": 700,
    "y": 210,
    "width": 240,
    "height": 80,
    "ports": {
     "items": [],
     "groups": {
      "abs": {
       "position": {
        "name": "absolute"
       },
       "zIndex": 10,
       "attrs": {
        "circle": {
         "r": 8,
         "magnet": true,
         "stroke": "#31d0c6",
         "strokeWidth": 2,
         "fill": "#fff"
        },
        "text": {
         "fontSize": 12,
         "fill": "#888"
        }
       }
      }
     }
    },
    "children": []
   },
   {
    "id": "az_Azure_SQL_Database.1",
    "label": "az_Azure_SQL_Database.1",
    "data": {
     "idGenIt": {},
     "title": "AZ SQL-A",
     "resourceType": "terminal",
     "subType": "az_Azure_SQL_Database",
     "tagName": "flow",
     "id": "az_Azure_SQL_Database.1",
     "provider": "default",
     "compound": false,
     "_start": null,
     "_finish": null,
     "data": {},
     "link": null,
     "name": "terminal.1",
     "elts": [
      "a"
     ],
     "inputElts": [],
     "outputElts": []
    },
    "x": 700,
    "y": 110,
    "width": 240,
    "height": 80,
    "ports": {
     "items": [],
     "groups": {
      "abs": {
       "position": {
        "name": "absolute"
       },
       "zIndex": 10,
       "attrs": {
        "circle": {
         "r": 8,
         "magnet": true,
         "stroke": "#31d0c6",
         "strokeWidth": 2,
         "fill": "#fff"
        },
        "text": {
         "fontSize": 12,
         "fill": "#888"
        }
       }
      }
     }
    },
    "children": []
   },
   {
    "id": "az_Linux_Virtual_Machines.7",
    "label": "az_Linux_Virtual_Machines.7",
    "data": {
     "idGenIt": {},
     "title": "AZ VM-C",
     "resourceType": "terminal",
     "subType": "az_Linux_Virtual_Machines",
     "tagName": "flow",
     "id": "az_Linux_Virtual_Machines.7",
     "provider": "default",
     "compound": false,
     "_start": null,
     "_finish": null,
     "data": {},
     "link": null,
     "name": "terminal.7",
     "elts": [
      "c"
     ],
     "inputElts": [],
     "outputElts": []
    },
    "x": 1084,
    "y": 110,
    "width": 240,
    "height": 80,
    "ports": {
     "items": [],
     "groups": {
      "abs": {
       "position": {
        "name": "absolute"
       },
       "zIndex": 10,
       "attrs": {
        "circle": {
         "r": 8,
         "magnet": true,
         "stroke": "#31d0c6",
         "strokeWidth": 2,
         "fill": "#fff"
        },
        "text": {
         "fontSize": 12,
         "fill": "#888"
        }
       }
      }
     }
    },
    "children": []
   }
  ],
  /*
  "edges": [
   {
    "id": "edge.5",
    "source": {
     "cell": "terminal.3"
    },
    "target": {
     "cell": "az_Blob_Storage.0"
    }
   },
   {
    "id": "edge.6",
    "source": {
     "cell": "az_Blob_Storage.0"
    },
    "target": {
     "cell": "terminal.4"
    }
   },
   {
    "id": "edge.7",
    "source": {
     "cell": "terminal.3"
    },
    "target": {
     "cell": "az_Azure_SQL_Database.1"
    }
   },
   {
    "id": "edge.8",
    "source": {
     "cell": "az_Azure_SQL_Database.1"
    },
    "target": {
     "cell": "terminal.4"
    }
   },
   {
    "id": "edge.0",
    "source": {
     "cell": "terminal.9"
    },
    "target": {
     "cell": "gcp_Compute_Engine.5"
    }
   },
   {
    "id": "edge.1",
    "source": {
     "cell": "gcp_Compute_Engine.5"
    },
    "target": {
     "cell": "az_Azure_Cache_for_Redis.6"
    }
   },
   {
    "id": "edge.2",
    "source": {
     "cell": "az_Azure_Cache_for_Redis.6"
    },
    "target": {
     "cell": "terminal.3"
    }
   },
   {
    "id": "edge.3",
    "source": {
     "cell": "terminal.4"
    },
    "target": {
     "cell": "az_Linux_Virtual_Machines.7"
    }
   },
   {
    "id": "edge.4",
    "source": {
     "cell": "az_Linux_Virtual_Machines.7"
    },
    "target": {
     "cell": "terminal.10"
    }
   }
  ]//*/
 };
export const data = {
  nodes: [
    {
      id: "$root",
      x: 0,
      y: 0,
      width: 640,
      height: 165,
      ports: {
        items: [],
        groups: {
          abs: {
            position: {
              name: "absolute"
            },
            zIndex: 10,
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff"
              },
              text: {
                fontSize: 12,
                fill: "#888"
              }
            }
          }
        }
      },
      children: ["sequence.2"]
    },
    {
      id: "sequence.2",
      label: "sequence.2",
      x: 24,
      y: 12,
      width: 592,
      height: 141,
      ports: {
        items: [
          {
            group: "abs",
            id: "sequence.2.start",
            args: {
              x: -8,
              y: 89
            }
          },
          {
            group: "abs",
            id: "sequence.2.finish",
            args: {
              x: 600,
              y: 89
            }
          }
        ],
        groups: {
          abs: {
            position: {
              name: "absolute"
            },
            zIndex: 10,
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff"
              },
              text: {
                fontSize: 12,
                fill: "#888"
              }
            }
          }
        }
      },
      children: ["terminal.0", "terminal.1"]
    },
    {
      id: "terminal.0",
      label: "terminal.0",
      x: 48,
      y: 61,
      width: 240,
      height: 80,
      ports: {
        items: [
          {
            group: "abs",
            id: "terminal.0.start",
            args: {
              x: -8,
              y: 40
            }
          },
          {
            group: "abs",
            id: "terminal.0.finish",
            args: {
              x: 248,
              y: 40
            }
          }
        ],
        groups: {
          abs: {
            position: {
              name: "absolute"
            },
            zIndex: 10,
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff"
              },
              text: {
                fontSize: 12,
                fill: "#888"
              }
            }
          }
        }
      },
      children: []
    },
    {
      id: "terminal.1",
      label: "terminal.1",
      x: 352,
      y: 61,
      width: 240,
      height: 80,
      ports: {
        items: [
          {
            group: "abs",
            id: "terminal.1.start",
            args: {
              x: -8,
              y: 40
            }
          },
          {
            group: "abs",
            id: "terminal.1.finish",
            args: {
              x: 248,
              y: 40
            }
          }
        ],
        groups: {
          abs: {
            position: {
              name: "absolute"
            },
            zIndex: 10,
            attrs: {
              circle: {
                r: 4,
                magnet: true,
                stroke: "#31d0c6",
                strokeWidth: 2,
                fill: "#fff"
              },
              text: {
                fontSize: 12,
                fill: "#888"
              }
            }
          }
        }
      },
      children: []
    }
  ],
  edges: []
};

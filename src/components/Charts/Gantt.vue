<template>
  <div>
    <gantt-elastic
      :options="options"
      :tasks="tasks"
      @tasks-changed="tasksUpdate"
      @options-changed="optionsUpdate"
      @dynamic-style-changed="styleUpdate"
    >
    </gantt-elastic>
    <div class="q-mt-md" />
    <a-button @click="addTask"><a-icon type="plus"/>Add Task</a-button>
  </div>
</template>

<script>
import GanttElastic from 'gantt-elastic'
import GanttHeader from 'gantt-elastic-header'
import dayjs from 'dayjs'
// just helper to get current dates
function getDate (hours) {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()
  const timeStamp = new Date(
    currentYear,
    currentMonth,
    currentDay,
    0,
    0,
    0
  ).getTime()
  return new Date(timeStamp + hours * 60 * 60 * 1000).getTime()
}
const tasks = [
  {
    id: 1,
    label: 'Make some noise',
    user: '<a href="https://www.google.com/search?q=John+Doe" target="_blank" style="color:#0077c0;">John Doe</a>',
    start: getDate(-24 * 5),
    duration: 15 * 24 * 60 * 60 * 1000,
    progress: 85,
    type: 'project'
    // collapsed: true,
  },
  {
    id: 2,
    label: 'With great power comes great responsibility',
    user: '<a href="https://www.google.com/search?q=Peter+Parker" target="_blank" style="color:#0077c0;">Peter Parker</a>',
    parentId: 1,
    start: getDate(-24 * 4),
    duration: 4 * 24 * 60 * 60 * 1000,
    progress: 50,
    type: 'milestone',
    collapsed: true,
    style: {
      base: {
        fill: '#1EBC61',
        stroke: '#0EAC51'
      }
      /* 'tree-row-bar': {
        fill: '#1EBC61',
        stroke: '#0EAC51'
      },
      'tree-row-bar-polygon': {
        stroke: '#0EAC51'
      } */
    }
  },
  {
    id: 3,
    label: 'Courage is being scared to death, but saddling up anyway.',
    user: '<a href="https://www.google.com/search?q=John+Wayne" target="_blank" style="color:#0077c0;">John Wayne</a>',
    parentId: 2,
    start: getDate(-24 * 3),
    duration: 2 * 24 * 60 * 60 * 1000,
    progress: 100,
    type: 'task'
  },
  {
    id: 4,
    label: 'Put that toy AWAY!',
    user: '<a href="https://www.google.com/search?q=Clark+Kent" target="_blank" style="color:#0077c0;">Clark Kent</a>',
    start: getDate(-24 * 2),
    duration: 2 * 24 * 60 * 60 * 1000,
    progress: 50,
    type: 'task',
    dependentOn: [3]
  },
  {
    id: 5,
    label: '202204',
    start: dayjs('2022-05-08').valueOf(),
    end: dayjs('2022-9-10').valueOf(),
    percent: 25,
    type: 'group',
    tasks: [
      {
        id: 6,
        label: 'V0',
        start: dayjs('2022-06-16').valueOf(),
        end: dayjs('2022-06-24').valueOf(),
        percent: 50,
        type: 'task',
        style: {
          base: {
            fill: '#C0E2D9',
            stroke: '#C0E2D9'
          }
        }
      },
      {
        id: 7,
        label: 'V1',
        start: dayjs('2022-07-01').valueOf(),
        end: dayjs('2022-07-16').valueOf(),
        percent: 50,
        type: 'task',
        style: {
          base: {
            fill: '#FEE4D5',
            stroke: '#FEE4D5'
          }
        }
      },
      {
        id: 8,
        label: 'V2',
        start: dayjs('2022-08-02').valueOf(),
        end: dayjs('2022-08-16').valueOf(),
        percent: 50,
        type: 'task',
        style: {
          base: {
            fill: '#C6EBFE',
            stroke: '#C6EBFE'
          }
        }
      },
      {
        id: 9,
        label: 'V3',
        start: dayjs('2022-08-24').valueOf(),
        end: dayjs('2022-09-16').valueOf(),
        percent: 50,
        type: 'task',
        style: {
          base: {
            fill: '#E7E7E7',
            stroke: '#E7E7E7'
          }
        }
      }
    ]
  },
  {
    id: 6,
    label: '202205',
    start: dayjs('2022-04-08').valueOf(),
    end: dayjs('2022-9-30').valueOf(),
    percent: 25,
    type: 'group',
    tasks: [
      {
        id: 7,
        label: 'V0',
        start: dayjs('2022-06-01').valueOf(),
        end: dayjs('2022-06-16').valueOf(),
        percent: 50,
        type: 'task',
        style: {
          base: {
            fill: '#C0E2D9',
            stroke: '#C0E2D9'
          }
        }
      },
      {
        id: 8,
        label: 'V1',
        start: dayjs('2022-06-18').valueOf(),
        end: dayjs('2022-07-28').valueOf(),
        percent: 50,
        type: 'task',
        style: {
          base: {
            fill: '#FEE4D5',
            stroke: '#FEE4D5'
          }
        }
      },
      {
        id: 9,
        label: 'V2',
        start: dayjs('2022-08-01').valueOf(),
        end: dayjs('2022-08-10').valueOf(),
        percent: 50,
        type: 'task',
        style: {
          base: {
            fill: '#C6EBFE',
            stroke: '#C6EBFE'
          }
        }
      },
      {
        id: 10,
        label: 'V3',
        start: dayjs('2022-08-21').valueOf(),
        end: dayjs('2022-09-06').valueOf(),
        percent: 50,
        type: 'task',
        style: {
          base: {
            fill: '#E7E7E7',
            stroke: '#E7E7E7'
          }
        }
      }
    ]
  }
]
const options = {
  taskMapping: {
    progress: 'percent'
  },
  maxRows: 100,
  maxHeight: 500,
  title: {
    label: 'Your project title as html (link or whatever...)',
    html: false
  },
  row: {
    height: 24
  },
  calendar: {
    hour: {
      display: true
    }
  },
  chart: {
    progress: {
      bar: false
    },
    expander: {
      display: true
    }
  },
  taskList: {
    expander: {
      straight: false
    },
    columns: [
      {
        id: 1,
        label: 'ID',
        value: 'id',
        width: 40
      },
      {
        id: 2,
        label: 'Description',
        value: 'label',
        width: 200,
        expander: true,
        html: true,
        events: {
          click ({ data, column }) {
            alert('description clicked!\n' + data.label)
          }
        }
      },
      {
        id: 3,
        label: 'Start',
        value: task => dayjs(task.start).format('YYYY-MM-DD'),
        width: 78
      },
      {
        id: 4,
        label: 'Type',
        value: 'type',
        width: 68
      },
      {
        id: 5,
        label: '%',
        value: 'progress',
        width: 35,
        style: {
          'task-list-header-label': {
            'text-align': 'center',
            width: '100%'
          },
          'task-list-item-value-container': {
            'text-align': 'center',
            width: '100%'
          }
        }
      }
    ]
  },
  locale: {
    name: 'en',
    Now: 'Now',
    'X-Scale': 'Zoom-X',
    'Y-Scale': 'Zoom-Y',
    'Task list width': 'Task list',
    'Before/After': 'Expand',
    'Display task list': 'Task list'
  }
}
export default {
  name: 'Gantt',
  components: {
    GanttElastic,
    GanttHeader
  },
  data () {
    return {
      tasks,
      options,
      dynamicStyle: {},
      lastId: 16
    }
  },
  methods: {
    addTask () {
      this.tasks.push({
        id: this.lastId++,
        label:
          '<a href="https://images.pexels.com/photos/423364/pexels-photo-423364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" target="_blank" style="color:#0077c0;">Yeaahh! you have added a task bro!</a>',
        user:
          '<a href="https://images.pexels.com/photos/423364/pexels-photo-423364.jpeg?auto=compress&cs=tinysrgb&h=650&w=940" target="_blank" style="color:#0077c0;">Awesome!</a>',
        start: getDate(24 * 3),
        duration: 1 * 24 * 60 * 60 * 1000,
        percent: 50,
        type: 'project'
      })
    },
    tasksUpdate (tasks) {
      this.tasks = tasks
    },
    optionsUpdate (options) {
      this.options = options
    },
    styleUpdate (style) {
      this.dynamicStyle = style
    }
  }
}
</script>

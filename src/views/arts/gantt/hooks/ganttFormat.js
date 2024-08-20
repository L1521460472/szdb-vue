/*
 * @Description: 
 * @Version: 1.0.0
 * @Autor: lijiancong
 * @Date: 2023-03-07 11:41:59
 * @LastEditors: lijiancong
 * @LastEditTime: 2023-03-25 11:37:35
 */
const priorityStyle = (story) => {
  const priority = story.priority;
  if (!priority) {
    return '';
  }
  const className = `priority-P${story.priority}`;
  return `<span class=${className} id="priority-box">P${story.priority}</span>`;
};
const demandFormat = {
  // tooltip: (start, end, task) => `<p class="gantt_tooltip_task_name">${task.name}</p>
  //             <p class="gantt_tooltip_task_content">持续时间：${task.duration}天</p>
  //             <p class="gantt_tooltip_task_content">当前进度：${task.progress * 100}%</p>
  //             <p class="gantt_tooltip_task_content">计划提测时间：${task.planTestTime || ''}</p>
  //             <p class="gantt_tooltip_task_content">实际提测时间：${task.actualTestTime}</p>`,
  columns: [
    {
      name: 'text',
      label: '制作人',
      align: 'center',
      width: 120,
      // template: (obj) => `<span class="gantt-name-box gantt-name-click">${obj.text}</span>`
    },
    // {
    //   name: 'priority',
    //   label: '优先级',
    //   align: 'center',
    //   width: 60,
    //   template: (obj) => priorityStyle(obj)
    // },
    // {
    //   name: 'start_date',
    //   label: '开始时间',
    //   align: 'center',
    //   width: 100,
    //   template: (obj) => `<span>${obj.beginTime}</span>`
    // },
    // {
    //   name: 'end_date',
    //   label: '结束时间',
    //   align: 'center',
    //   width: 100,
    //   template: (obj) => (obj.isOvertime ? `<span style="color: red">${obj.endTime}</span>` : `<span>${obj.endTime}</span>`)
    // },
    // {
    //   name: 'planTestTime', label: '计划提测时间', align: 'center', width: 100
    // },
    // {
    //   name: 'planAcceptanceTime', label: '计划验收时间', align: 'center', width: 100
    // },
    // {
    //   name: 'assignedTo', label: '处理人', align: 'center', width: 100
    // },
  ],
  tableWidth: 120
};
const taskFormat = {
  // tooltip: (start, end, task) => `<p class="gantt_tooltip_task_name">${task.name}</p>
  //             <p class="gantt_tooltip_task_content">实际开始时间：${task.beginTime}</p>
  //             <p class="gantt_tooltip_task_content">实际结束时间：${task.endTime}</p>`,
  columns: [
    {
      name: 'text',
      label: '制作人',
      align: 'center',
      width: 120,
      // template: (obj) => `<span class="gantt-name-box">${obj.text}</span>`
    },
    // {
    //   name: 'priority',
    //   label: '优先级',
    //   align: 'center',
    //   width: 60,
    //   template: (obj) => priorityStyle(obj)
    // },
    // {
    //   name: 'start_date',
    //   label: '开始时间',
    //   align: 'center',
    //   width: 100,
    //   template: (obj) => `<span>${obj.beginTime}</span>`
    // },
    // {
    //   name: 'end_date',
    //   label: '结束时间',
    //   align: 'center',
    //   width: 100,
    //   template: (obj) => (obj.isOvertime ? `<span style="color: red">${obj.endTime}</span>` : `<span>${obj.endTime}</span>`)
    // },
    // {
    //   name: 'assignedTo', label: '处理人', align: 'center', width: 100
    // },
  ],
  tableWidth: 120
};
export default { demandFormat, taskFormat };
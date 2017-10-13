const nodes = [{
  name: 'div',
  attrs: {
    class: 'rule-wrapper'
  },
  children: [
    {
      name:'h2',
      attrs: {
        class: 'rule-title'
      },
      children: [{
        type: 'text',
        text: '规则说明'
      }]
    },
    {
      name: 'p',
      attrs: {
        class: 'rule-item'
      },
      children: [{
        type: 'text',
        text: '1.公司实行每天上班前、下班后二次打卡考勤管理制度；'
      }]
    },
    {
      name: 'p',
      attrs: {
        class: 'rule-item'
      },
      children: [{
        type: 'text',
        text: '2.作息时间：每周5天，实行周六、周日双休制；'
      }]
    },
    {
      name: 'p',
      attrs: {
        class: 'rule-item'
      },
      children: [{
        type: 'text',
        text: '3.工作时间：上午9：00—12：00，下午14：00—18：00；可依季节、公司阶段性发展需要作相应调整;'
      }]
    },
    {
      name: 'p',
      attrs: {
        class: 'rule-item'
      },
      children: [{
        type: 'text',
        text: '4.打卡有效范围：距离公司100米以内。'
      }]
    }
  ]
}]
export {
  nodes
}
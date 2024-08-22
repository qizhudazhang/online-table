export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-case': [2, 'always', 'lowerCase'],
    'type-empty': [2, 'never'],
    'scope-empty': [2, 'never'],
    'subject-case': [2, 'always', 'lowerCase'],
    'subject-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test'
      ]
    ]
  },
  prompt: {
    skip: ['body', 'footer', 'issues'], //可跳过的字段
    messages: {
      skip: '按回车可跳过该字段',
      max: '最大%d字符',
      min: '最小%d字符',
      emptyWarning: '内容不能为空',
      upperLimitWarning: 'over limit',
      lowerLimitWarning: 'below limit'
    },
    questions: {
      type: {
        description: '请选择提交类型:',
        enum: {
          feat: {
            description: '新功能',
            title: 'Features',
            emoji: '✨'
          },
          fix: {
            description: 'bug修复',
            title: 'Bug Fixes',
            emoji: '🐛'
          },
          docs: {
            description: '文档变更',
            title: 'Documentation',
            emoji: '📚'
          },
          style: {
            description: '代码格式(不影响代码运行的变动)',
            title: 'Styles',
            emoji: '💎'
          },
          refactor: {
            description: '重构(既不是增加feature，也不是修复bug)',
            title: 'Code Refactoring',
            emoji: '📦'
          },
          perf: {
            description: '性能优化',
            title: 'Performance Improvements',
            emoji: '🚀'
          },
          test: {
            description: '增加测试',
            title: 'Tests',
            emoji: '🚨'
          },
          build: {
            description: '改变构建系统或者外部依赖',
            title: 'Builds',
            emoji: '🛠'
          },
          ci: {
            description: '改变ci配置和脚本',
            title: 'Continuous Integrations',
            emoji: '⚙️'
          },
          chore: {
            description: '修改src或测试文件以外的文件',
            title: 'Chores',
            emoji: '♻️'
          },
          revert: {
            description: '回退',
            title: 'Reverts',
            emoji: '🗑'
          }
        }
      },
      scope: {
        description: '请输入修改范围(必填): (功能模块 或 bug号)'
      },
      subject: {
        description: '请简要描述提交(必填):'
      },
      body: {
        description: '请输入详细描述(可选):'
      },
      isBreaking: {
        description: '是否存在重大变化?'
      },
      breakingBody: {
        description: '一个破坏性的提交需要一个主体. 请对提交进行一个详细的描述'
      },
      breaking: {
        description: '描述重大更改'
      },
      isIssueAffected: {
        description: '此更改是否影响任何未决问题?'
      },
      issuesBody: {
        description: '如果问题被关闭. 请对提交进行一个详细的描述'
      },
      issues: {
        description: '增加问题的引用 (e.g. "fix #123", "re #123".)'
      }
    }
  }
}
